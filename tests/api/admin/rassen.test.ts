import { closeClient } from 'src/utils/db';
import { clearAllData } from 'src/utils/MongoDb';
import listHandler from 'src/pages/api/admin/rassen/index.page';
import { getRequest } from 'tests/helpers';
import { createRandomKlant, RoleOptions } from 'tests/fixtures/klant';
import { createBearer } from 'src/services/Authenticator';
import { faker } from '@faker-js/faker';
import { createRandomRassen } from 'tests/fixtures/ras';
import { getController } from 'src/services/Factory';
import { KLANT } from 'src/controllers/KlantController';
import { RAS } from 'src/controllers/rasController';

describe('/admin/rassen', () => {
  beforeEach(clearAllData);
  afterAll(async () => {
    await clearAllData();
    await closeClient();
  });

  const listRequest = getRequest(listHandler);

  describe('GET /', () => {
    it('Should return a paginated list of rassen', async () => {
      const admin = createRandomKlant({ roles: RoleOptions.ADMIN });
      const superAdmin = createRandomKlant({ roles: RoleOptions.SUPER_ADMIN });
      const bearerAdmin = createBearer(admin);
      const bearerSuperAdmin = createBearer(superAdmin);
      const rassen = createRandomRassen(faker.datatype.number({ max: 20, min: 1 }));

      await getController(KLANT).save(admin);
      await getController(RAS).saveMany(rassen);

      const amount = faker.datatype.number({ max: 20, min: 1 });
      const nextPage =
        rassen.length > amount ? `/api/admin/rassen/?page=2&amount=${amount}` : undefined;

      const { body: adminBody } = await listRequest
        .get('/api/admin/rassen/')
        .query({ amount })
        .auth(bearerAdmin, { type: 'bearer' })
        .expect(200);

      const { body: superAdminBody } = await listRequest
        .get('/api/admin/rassen/')
        .query({ amount })
        .auth(bearerSuperAdmin, { type: 'bearer' })
        .expect(200);

      const expectedResponse = expect.objectContaining({
        data: expect.arrayContaining(
          rassen.slice(0, amount).map((ras) =>
            expect.objectContaining({
              _id: ras._id.toString(),
              naam: ras.naam,
              soort: ras.soort,
            })
          )
        ),
        pagination: expect.objectContaining({
          currentPage: 1,
          first: 1,
          last: Math.min(rassen.length, amount),
          total: rassen.length,
        }),
      });

      expect(adminBody).toEqual(expectedResponse);
      expect(adminBody.pagination.next).toBe(nextPage);

      expect(superAdminBody).toEqual(expectedResponse);
      expect(superAdminBody.pagination.next).toBe(nextPage);
    });

    it.skip('Should throw 401 when unathorized', async () => {
      const klant = createRandomKlant();
      const bearer = createBearer(klant);

      await listRequest
        .get('/api/admin/rassen/')
        .auth(bearer, { type: 'bearer' })
        .expect(401);
    });
  });

  describe('GET /:id', () => {
    // Api not yet implemented
    it.skip('Should return detailResponse for specific ras', async () => {});

    // Api not yet implemented
    it.skip('Should throw 401 when unauthorized', async () => {});
  });
});
