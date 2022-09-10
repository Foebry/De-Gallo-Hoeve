import moment from "moment";
import { ClientSession, Collection, ObjectId } from "mongodb";
import { CASCADEKLANT } from "../middleware/Factory";
import client from "../middleware/MongoDb";
import { InternalServerError } from "../middleware/RequestError";
import {
  deleteInschrijvingen,
  getInschrijvingById,
  getInschrijvingCollection,
  InschrijvingCollection,
  IsInschrijving,
} from "./InschrijvingController";
import { KlantCollection } from "./KlantController";

export type TrainingType = "prive" | "groep";

export interface PriveTrainingCollection {
  _id: ObjectId;
  naam: TrainingType;
  prijs: number;
  inschrijvingen: ObjectId[];
}

export interface GroepTrainingCollection extends PriveTrainingCollection {
  max_inschrijvingen: number;
}

export interface UpdateTraining {
  naam?: TrainingType;
  prijs?: number;
  inschrijvingen?: ObjectId[];
  max_inschrijvingen?: number;
}

export interface IsTrainingController {
  getTrainingCollection: () => Collection;
  getTrainingById: typeof getTrainingById;
  getTrainingByName: typeof getTrainingByName;
  updateTraining: typeof updateTraining;
  addTrainingInschrijving: (
    training: string,
    inschrijving: InschrijvingCollection,
    session?: ClientSession
  ) => Promise<void>;
  delete: (_id: ObjectId) => Promise<void>;
  deleteInschrijving: (
    training: string,
    inschrijving_id: ObjectId,
    session?: ClientSession
  ) => Promise<void>;
  klantReedsIngeschreven: (
    klant: KlantCollection,
    training: TrainingType,
    inschrijving: IsInschrijving
  ) => Promise<boolean>;
  trainingVolzet: (training: TrainingType, datum: string) => Promise<boolean>;
}

const TrainingController: IsTrainingController = {
  getTrainingCollection: () => client.db("degallohoeve").collection("training"),
  getTrainingById,
  getTrainingByName,
  updateTraining,
  addTrainingInschrijving: async (training, inschrijving, session) => {
    await getTrainingByName(training);
    const { modifiedCount } = await getTrainingCollection().updateOne(
      { naam: training },
      { $addToSet: { inschrijvingen: inschrijving } },
      { session }
    );
    if (modifiedCount !== 1) throw new InternalServerError();
  },
  delete: async (_id) => {
    const training = await getTrainingById(_id);
    const { deletedCount } = await getTrainingCollection().deleteOne({ _id });
    if (deletedCount !== 1) throw new InternalServerError();

    const inschrijvingen = await Promise.all(
      training.inschrijvingen.map(
        async (_id) => await getInschrijvingById(_id, false)
      )
    );
    await deleteInschrijvingen(inschrijvingen, CASCADEKLANT);
  },
  deleteInschrijving: async (training, inschrijving_id, session) => {
    await getTrainingByName(training);
    await getInschrijvingById(inschrijving_id);
    const {} = await getTrainingCollection().updateOne(
      { naam: training },
      { $pull: { inschrijvingen: inschrijving_id } },
      { session }
    );
  },
  klantReedsIngeschreven: async (klant, training, inschrijving) => {
    const inschrijvingFound = await getInschrijvingCollection().findOne({
      datum: moment(inschrijving.datum).local().format(),
      training,
      klant: { _id: klant._id },
    });
    return inschrijvingFound ? true : false;
  },
  trainingVolzet: async (training, datum) => {
    const Training = await getTrainingByName(training);
    const inschrijvingen = await getInschrijvingCollection()
      .find({ datum: moment(datum).local().format() })
      .toArray();
    return inschrijvingen.length >= Training.max_inschrijvingen;
  },
};

export default TrainingController;
export const TRAINING = "TrainingController";
export const {
  getTrainingCollection,
  deleteInschrijving,
  addTrainingInschrijving,
  klantReedsIngeschreven,
  trainingVolzet,
} = TrainingController;

export async function getTrainingByName(
  naam: string
): Promise<GroepTrainingCollection>;
export async function getTrainingByName(
  naam: string
): Promise<PriveTrainingCollection>;
export async function getTrainingByName(naam: string) {
  const training = await getTrainingCollection().findOne({ naam });
  if (naam === "groep") return training as GroepTrainingCollection;
  else if (naam === "prive") return training as PriveTrainingCollection;
}

export async function getTrainingById(
  _id: ObjectId
): Promise<PriveTrainingCollection>;
export async function getTrainingById(
  _id: ObjectId
): Promise<GroepTrainingCollection>;
export async function getTrainingById(_id: ObjectId) {
  const training = (await getTrainingCollection().findOne({ _id })) as
    | PriveTrainingCollection
    | GroepTrainingCollection;
  if (training.naam === "groep") return training as GroepTrainingCollection;
  else if (training.naam === "prive")
    return training as PriveTrainingCollection;
}

export async function updateTraining(
  _id: ObjectId,
  updateData: UpdateTraining
): Promise<GroepTrainingCollection>;
export async function updateTraining(
  _id: ObjectId,
  updateData: UpdateTraining
): Promise<PriveTrainingCollection>;
export async function updateTraining(
  _id: ObjectId,
  updateData: UpdateTraining
) {
  const training = await getTrainingById(_id);
  const updateTraining = { ...training, ...updateData };
  const { upsertedCount } = await getTrainingCollection().updateOne(
    { _id },
    updateTraining
  );
  if (upsertedCount !== 1) throw new InternalServerError();
  return await getTrainingById(_id);
}

// export const deleteTraining = async (
//   _id: ObjectId,
//   hardDelete = false
// ): Promise<void> => {
//   const collection = getTrainingCollection();
//   const training = await getTrainingById(_id);
//   await collection.deleteOne({ _id: training._id });

//   if (hardDelete) {
//     let updatedInschrijvingen: ObjectId[];
//     const inschrijvingen = training.inschrijvingen;
//     const inschrijvingCollection = getInschrijvingCollection();
//     await inschrijvingCollection.deleteMany({ _id: { $in: inschrijvingen } });

//     const klantCollection = getKlantCollection();
//     const filter = { inschrijvinge: { $in: inschrijvingen } };
//     const klanten = (await klantCollection
//       .find({ filter })
//       .toArray()) as KlantCollection[];

//     await Promise.all(
//       klanten.map(async (klant) => {
//         updatedInschrijvingen = klant.inschrijvingen.filter(
//           (id) => !inschrijvingen.includes(id)
//         );
//         const updatedKlant = {
//           ...klant,
//           inschrijvingen: updatedInschrijvingen,
//         };

//         await updateKlant(klant._id as ObjectId, updatedKlant);
//       })
//     );
//   }
// };
