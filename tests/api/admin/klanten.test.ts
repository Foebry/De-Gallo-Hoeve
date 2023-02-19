import { faker } from '@faker-js/faker';
import { closeClient } from 'src/utils/db';
import { clearAllData } from 'src/utils/MongoDb';
import { getRequest } from 'tests/helpers';
import listHandler from 'src/pages/api/admin/klanten/index.page';
import byIdHandler from 'src/pages/api/admin/klanten/[slug].page';
import {
  createRandomKlant,
  createRandomKlanten,
  RoleOptions,
} from 'tests/fixtures/klant';
import { createBearer } from 'src/services/Authenticator';
import { createRandomHonden } from 'tests/fixtures/hond';
import { KLANT } from 'src/controllers/KlantController';
import { getController } from 'src/services/Factory';
import { getCurrentTime, toReadableDate } from 'src/shared/functions';
import { createRandomInschrijvingen } from 'tests/fixtures/inschrijving';
import { INSCHRIJVING } from 'src/controllers/InschrijvingController';

describe('/admin/klanten', () => {
  beforeEach(clearAllData);
  afterAll(async () => {
    await clearAllData();
    await closeClient();
  });

  const listRequest = getRequest(listHandler);
  const byIdRequest = getRequest(byIdHandler);

  describe('GET /', () => {
    it('Should return a paginated list of klanten', async () => {
      const admin = createRandomKlant({ roles: RoleOptions.ADMIN });
      const superAdmin = createRandomKlant({ roles: RoleOptions.SUPER_ADMIN });
      const bearerAdmin = createBearer(admin);
      const bearerSuperAdmin = createBearer(superAdmin);

      const randomKlanten = createRandomKlanten(
        faker.datatype.number({ max: 20, min: 1 })
      );
      const amount = faker.datatype.number({ max: 20 });
      randomKlanten.forEach((klant) => {
        if (Math.random() > 0.5) {
          klant.verified = true;
          klant.verified_at = getCurrentTime();
        }
        klant.honden = createRandomHonden(faker.datatype.number({ max: 3 }));
      });

      await getController(KLANT).saveMany(randomKlanten);

      const expectedResponse = expect.objectContaining({
        data: expect.arrayContaining(
          randomKlanten.slice(0, amount).map((klant) =>
            expect.objectContaining({
              _id: klant._id.toString(),
              verified: klant.verified,
              email: klant.email,
              vnaam: klant.vnaam,
              lnaam: klant.lnaam,
              straat: klant.straat,
              nr: klant.nr.toString(),
              postcode: klant.postcode.toString(),
              gemeente: klant.gemeente,
              created_at: toReadableDate(klant.created_at),
              updated_at: toReadableDate(klant.created_at),
            })
          )
        ),
        pagination: expect.objectContaining({
          currentPage: 1,
          first: 1,
          last: Math.min(randomKlanten.length, amount),
          total: randomKlanten.length,
        }),
      });

      const nextPage =
        randomKlanten.length > amount
          ? `/api/admin/klanten/?page=2&amount=${amount}`
          : undefined;

      const { body: adminBody } = await listRequest
        .get('/api/admin/klanten/')
        .query({ amount })
        .auth(bearerAdmin, { type: 'bearer' })
        .expect(200);

      const { body: superAdminBody } = await listRequest
        .get('/api/admin/klanten/')
        .query({ amount })
        .auth(bearerSuperAdmin, { type: 'bearer' })
        .expect(200);

      expect(adminBody).toEqual(expectedResponse);
      expect(adminBody.pagination.next).toBe(nextPage);

      expect(superAdminBody).toEqual(expectedResponse);
      expect(superAdminBody.pagination.next).toBe(nextPage);
    });

    it.skip('Should throw 401 when unauthorized', async () => {
      const klant = createRandomKlant();
      const bearer = createBearer(klant);

      await listRequest
        .get('/api/admin/klanten/')
        .auth(bearer, { type: 'bearer' })
        .expect(401);
    });
  });

  describe('GET /:id', () => {
    it('Should return detailResponse for specific klant', async () => {
      const admin = createRandomKlant({ roles: RoleOptions.ADMIN });
      const superAdmin = createRandomKlant({ roles: RoleOptions.SUPER_ADMIN });
      const bearerAdmin = createBearer(admin);
      const bearerSuperAdmin = createBearer(superAdmin);

      const randomKlanten = createRandomKlanten(
        faker.datatype.number({ min: 1, max: 20 })
      );
      randomKlanten.forEach((klant) => {
        klant.honden = createRandomHonden(faker.datatype.number({ max: 5, min: 1 }));
        klant.inschrijvingen = createRandomInschrijvingen(
          klant,
          faker.datatype.number({ max: 3 })
        ).map((inschrijving) => inschrijving._id);
        klant.verified = Math.random() > 0.6 ? true : false;
      });

      const specificHonden = createRandomHonden(10);
      randomKlanten[0].honden = specificHonden;
      const specificInschrijvingen = createRandomInschrijvingen(randomKlanten[0], 5);
      randomKlanten[0].inschrijvingen = specificInschrijvingen.map(
        (inschrijving) => inschrijving._id
      );
      const specificKlant = randomKlanten[0];

      await getController(KLANT).saveMany(randomKlanten);
      await getController(INSCHRIJVING).saveMany(specificInschrijvingen);

      const expectedResponse = expect.objectContaining({
        _id: specificKlant._id.toString(),
        email: specificKlant.email,
        vnaam: specificKlant.vnaam,
        lnaam: specificKlant.lnaam,
        gsm: specificKlant.gsm,
        straat: specificKlant.straat,
        nr: specificKlant.nr,
        gemeente: specificKlant.gemeente,
        postcode: specificKlant.postcode,
        roles: '0',
        verified: specificKlant.verified,
        created_at: toReadableDate(specificKlant.created_at),
        inschrijvingen: expect.arrayContaining(
          specificInschrijvingen.map((inschrijving) =>
            expect.objectContaining({
              _id: inschrijving._id.toString(),
              datum: toReadableDate(inschrijving.datum),
              training: inschrijving.training,
              hond: inschrijving.hond.naam,
            })
          )
        ),
        honden: expect.arrayContaining(
          specificKlant.honden.map((hond) =>
            expect.objectContaining({
              _id: hond._id.toString(),
              geslacht: hond.geslacht,
              naam: hond.naam,
              ras: hond.ras,
            })
          )
        ),
      });

      const { body: adminBody } = await byIdRequest
        .get(`/api/admin/klanten/`)
        .query({ slug: specificKlant._id.toString() })
        .auth(bearerAdmin, { type: 'bearer' })
        .expect(200);

      const { body: superAdminBody } = await byIdRequest
        .get(`/api/admin/klanten/`)
        .query({ slug: specificKlant._id.toString() })
        .auth(bearerSuperAdmin, { type: 'bearer' })
        .expect(200);

      expect(adminBody).toEqual(expectedResponse);
      expect(superAdminBody).toEqual(expectedResponse);
    });

    it.skip('Should throw 401 when unauthorized', async () => {
      const klant = createRandomKlant();
      const bearer = createBearer(klant);

      await byIdRequest
        .get('/api/admin/klanten/')
        .query({ slug: klant._id.toString() })
        .auth(bearer, { type: 'bearer' })
        .expect(401);
    });
  });
});
