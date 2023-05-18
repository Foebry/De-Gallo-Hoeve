import { faker } from '@faker-js/faker';
import listHandler from 'src/pages/api/admin/inschrijvingen/index.page';
import byIdHandler from 'src/pages/api/admin/inschrijvingen/[slug].page';
import { getRequest } from 'tests/helpers';
import {
  createRandomKlant,
  createRandomKlanten,
  RoleOptions,
} from 'tests/fixtures/klant';
import { createBearer } from 'src/services/Authenticator';
import {
  createRandomInschrijving,
  createRandomInschrijvingen,
} from 'tests/fixtures/inschrijving';
import { createRandomHond, createRandomHonden } from 'tests/fixtures/hond';
import { toReadableDate } from 'src/shared/functions';
import { getController } from 'src/services/Factory';
import { KLANT } from 'src/controllers/KlantController';
import { INSCHRIJVING } from 'src/controllers/InschrijvingController';

describe('/admin/inschrijvingen', () => {
  const listRequest = getRequest(listHandler);
  const byIdRequest = getRequest(byIdHandler);

  describe('GET /', () => {
    it('Should return a paginated list of inschrijvingen', async () => {
      const admin = createRandomKlant({ roles: RoleOptions.ADMIN });
      const superAdmin = createRandomKlant({ roles: RoleOptions.SUPER_ADMIN });
      const bearerAdmin = createBearer(admin);
      const bearerSuperAdmin = createBearer(superAdmin);

      const amount = faker.datatype.number({ max: 20 });

      const randomKlanten = createRandomKlanten(
        faker.datatype.number({ min: 1, max: 20 })
      );
      randomKlanten.forEach((klant) => {
        klant.honden = createRandomHonden(faker.datatype.number({ min: 1, max: 5 }));
      });
      const randomInschrijvingen = randomKlanten
        .map((klant) => createRandomInschrijvingen(klant, faker.datatype.number(10)))
        .reduce((curr, acc) => [...acc, ...curr], []);
      randomKlanten.forEach((klant) => {
        klant.inschrijvingen = randomInschrijvingen
          .filter((inschrijving) => inschrijving.klant.id === klant._id)
          .map((inschrijving) => inschrijving._id);
      });

      const nextPage =
        amount < randomInschrijvingen.length
          ? `/api/admin/inschrijvingen/?page=2&amount=${amount}`
          : undefined;

      await getController(KLANT).saveMany(randomKlanten);
      await getController(INSCHRIJVING).saveMany(randomInschrijvingen);

      const expectedResponse = expect.objectContaining({
        data: expect.arrayContaining(
          randomInschrijvingen.slice(0, amount).map((inschrijving) => {
            const klant = randomKlanten.find((klant) =>
              klant.inschrijvingen.includes(inschrijving._id)
            );
            const hond = klant?.honden.find(
              (hond) => hond._id.toString() === inschrijving.hond.id.toString()
            );
            return expect.objectContaining({
              id: inschrijving._id.toString(),
              created_at: toReadableDate(inschrijving.created_at),
              datum: toReadableDate(inschrijving.datum),
              training: inschrijving.training,
              klant: expect.objectContaining({
                id: klant?._id.toString(),
                vnaam: klant?.vnaam,
                lnaam: klant?.lnaam,
              }),
              hond: expect.objectContaining({
                id: hond?._id.toString(),
                naam: hond?.naam,
              }),
            });
          })
        ),
        pagination: expect.objectContaining({
          currentPage: 1,
          first: 1,
          last: Math.min(randomInschrijvingen.length, amount),
          total: randomInschrijvingen.length,
        }),
      });

      const { body: adminBody } = await listRequest
        .get('/api/admin/inschrijvingen/')
        .query({ amount })
        .auth(bearerAdmin, { type: 'bearer' })
        .expect(200);

      const { body: superAdminBody } = await listRequest
        .get('/api/admin/inschrijvingen/')
        .query({ amount })
        .auth(bearerSuperAdmin, { type: 'bearer' })
        .expect(200);

      expect(adminBody).toEqual(expectedResponse);
      expect(adminBody.pagination.next).toBe(nextPage);
      expect(superAdminBody).toEqual(expectedResponse);
      expect(superAdminBody.pagination.next).toBe(nextPage);
    });

    it.skip('Should return 401 when not authorized', async () => {
      const klant = createRandomKlant();
      const bearer = createBearer(klant);

      await listRequest
        .get('/api/admin/inschrijvingen')
        .auth(bearer, { type: 'bearer' })
        .expect(401);
    });
  });

  describe('GET /:id', () => {
    it('Should return detailResponse for specific inschrijving', async () => {
      const admin = createRandomKlant({ roles: RoleOptions.ADMIN });
      const superAdmin = createRandomKlant({ roles: RoleOptions.SUPER_ADMIN });
      const bearerAdmin = createBearer(admin);
      const bearerSuperAdmin = createBearer(superAdmin);

      const randomKlanten = createRandomKlanten(
        faker.datatype.number({ min: 1, max: 20 })
      );
      randomKlanten.forEach(
        (klant) =>
          (klant.honden = createRandomHonden(faker.datatype.number({ min: 1, max: 20 })))
      );
      const randomInschrijvingen = randomKlanten
        .map((klant) =>
          createRandomInschrijvingen(klant, faker.datatype.number({ max: 5, min: 1 }))
        )
        .reduce((curr, acc) => [...acc, ...curr], []);

      randomKlanten.forEach((klant) => {
        klant.inschrijvingen = randomInschrijvingen
          .filter((inschrijving) => inschrijving.klant.id === klant._id)
          .map((inschrijving) => inschrijving._id);
      });

      const specificHond = createRandomHond();
      const specificInschrijving = createRandomInschrijving(
        randomKlanten[0],
        specificHond
      );

      const specificKlant = randomKlanten[0];
      randomKlanten[0].honden = [...specificKlant.honden, specificHond];
      randomKlanten[0].inschrijvingen = [
        ...specificKlant.inschrijvingen,
        specificInschrijving._id,
      ];

      await getController(KLANT).saveMany(randomKlanten);
      await getController(INSCHRIJVING).saveMany([
        ...randomInschrijvingen,
        specificInschrijving,
      ]);

      const expectedResponse = expect.objectContaining({
        _id: specificInschrijving._id.toString(),
        datum: toReadableDate(specificInschrijving.datum),
        training: specificInschrijving.training,
        created_at: toReadableDate(specificInschrijving.created_at),
        klant: expect.objectContaining({
          _id: specificKlant._id.toString(),
          vnaam: specificKlant.vnaam,
          lnaam: specificKlant.lnaam,
        }),
        hond: expect.objectContaining({
          _id: specificHond._id.toString(),
          naam: specificHond.naam,
          ras: specificHond.ras,
        }),
      });

      const { body: adminBody } = await byIdRequest
        .get('/api/admin/inschrijvingen/')
        .query({ slug: specificInschrijving._id.toString() })
        .auth(bearerAdmin, { type: 'bearer' })
        .expect(200);

      const { body: superAdminBody } = await byIdRequest
        .get('/api/admin/inschrijvingen/')
        .query({ slug: specificInschrijving._id.toString() })
        .auth(bearerSuperAdmin, { type: 'bearer' })
        .expect(200);

      expect(adminBody).toStrictEqual(expectedResponse);
      expect(superAdminBody).toStrictEqual(expectedResponse);
    });

    it.skip('Should throw 401 when not authorized', async () => {
      const klant = createRandomKlant();
      const hond = createRandomHond();
      const inschrijving = createRandomInschrijving(klant, hond);
      const bearer = createBearer(klant);

      await byIdRequest
        .get('/api/admin/inschrijvingen/')
        .query({ slug: inschrijving._id.toString() })
        .auth(bearer, { type: 'bearer' })
        .expect(401);
    });
  });
});
