import { faker } from '@faker-js/faker';
import { KLANT } from 'src/controllers/KlantController';
import { RAS } from 'src/controllers/rasController';
import listHandler from 'src/pages/api/admin/honden/index.page';
import byIdHandler from 'src/pages/api/admin/honden/[slug].page';
import { createBearer } from 'src/services/Authenticator';
import { getController } from 'src/services/Factory';
import { getAge } from 'src/shared/functions';
import { createRandomHond, createRandomHonden } from 'tests/fixtures/hond';
import {
  createRandomKlant,
  createRandomKlanten,
  RoleOptions,
} from 'tests/fixtures/klant';
import { createRandomRas } from 'tests/fixtures/ras';
import { getRequest } from 'tests/helpers';

describe('/honden', () => {
  const listRequest = getRequest(listHandler);
  const byIdRequest = getRequest(byIdHandler);

  describe('GET /', () => {
    it('Should return a paginated list of hondCollections', async () => {
      const [klant1, klant2, klant3] = createRandomKlanten(3);
      const hondenKlant1 = createRandomHonden(faker.datatype.number({ max: 10 }));
      const hondenKlant2 = createRandomHonden(faker.datatype.number({ max: 10 }));
      const hondenKlant3 = createRandomHonden(faker.datatype.number({ max: 10 }));
      const allHonden = [...hondenKlant1, ...hondenKlant2, ...hondenKlant3];

      klant1.honden = hondenKlant1;
      klant2.honden = hondenKlant2;
      klant3.honden = hondenKlant3;

      await getController(KLANT).saveMany([klant1, klant2, klant3]);

      const admin = createRandomKlant({ roles: RoleOptions.ADMIN });
      const superAdmin = createRandomKlant({ roles: RoleOptions.SUPER_ADMIN });
      const bearerAdmin = createBearer(admin);
      const bearerSuperAdmin = createBearer(superAdmin);

      const amount = faker.datatype.number();
      const nextPage =
        amount < allHonden.length
          ? `/api/admin/honden?page=2&amount=${amount}`
          : undefined;

      const { body: adminBody } = await listRequest
        .get(`/api/admin/honden`)
        .query({ amount })
        .auth(bearerAdmin, { type: 'bearer' })
        .expect(200);
      expect(adminBody.data.length).toBe(Math.min(amount, allHonden.length));
      expect(adminBody.pagination.next).toBe(nextPage);
      expect(adminBody).toEqual(
        expect.objectContaining({
          data: expect.arrayContaining(
            allHonden.slice(0, amount).map((hond) => {
              const klant = [klant1, klant2, klant3].find((klant) =>
                klant.honden.includes(hond)
              );
              return expect.objectContaining({
                _id: hond._id.toString(),
                naam: hond.naam,
                ras: hond.ras,
                geslacht: hond.geslacht,
                geboortedatum: hond.geboortedatum
                  .toISOString()
                  .replace('T', ' ')
                  .split('.')[0],
                created_at: hond.created_at.toISOString().replace('T', ' ').split('.')[0],
                updated_at: hond.updated_at.toISOString().replace('T', ' ').split('.')[0],
                leeftijd: getAge(hond.geboortedatum),
                klant: {
                  _id: klant?._id.toString(),
                  naam: `${klant?.vnaam} ${klant?.lnaam}`,
                },
              });
            })
          ),
          pagination: expect.objectContaining({
            currentPage: 1,
            total: allHonden.length,
            first: 1,
            last: Math.min(amount, allHonden.length),
          }),
        })
      );

      const { body: superAdminBody } = await listRequest
        .get('/api/admin/honden')
        .query({ amount })
        .auth(bearerSuperAdmin, { type: 'bearer' })
        .expect(200);

      expect(superAdminBody.data.length).toBe(Math.min(amount, allHonden.length));
      expect(superAdminBody.pagination.next).toBe(nextPage);
      expect(superAdminBody).toEqual(
        expect.objectContaining({
          data: expect.arrayContaining(
            allHonden.slice(0, amount).map((hond) => {
              const klant = [klant1, klant2, klant3].find((klant) =>
                klant.honden.includes(hond)
              );
              return expect.objectContaining({
                _id: hond._id.toString(),
                naam: hond.naam,
                ras: hond.ras,
                geslacht: hond.geslacht,
                geboortedatum: hond.geboortedatum
                  .toISOString()
                  .replace('T', ' ')
                  .split('.')[0],
                created_at: hond.created_at.toISOString().replace('T', ' ').split('.')[0],
                updated_at: hond.updated_at.toISOString().replace('T', ' ').split('.')[0],
                leeftijd: getAge(hond.geboortedatum),
                klant: {
                  _id: klant?._id.toString(),
                  naam: `${klant?.vnaam} ${klant?.lnaam}`,
                },
              });
            })
          ),
          pagination: expect.objectContaining({
            currentPage: 1,
            total: allHonden.length,
            first: 1,
            last: Math.min(amount, allHonden.length),
          }),
        })
      );
    });
    // was skipped already
    it.skip('Should return 401 when not an admin', async () => {
      const randomKlant = createRandomKlant();
      const bearer = createBearer(randomKlant);

      await listRequest
        .get('/api/admin/honden')
        .auth(bearer, {
          type: 'bearer',
        })
        .expect(401);
    });
  });

  describe('GET /:id', () => {
    it('Should return responseData for specific hond', async () => {
      const admin = createRandomKlant({ roles: RoleOptions.ADMIN });
      const bearer = createBearer(admin);
      const hond = createRandomHond();
      const klant = createRandomKlant({ honden: [hond] });
      const ras = createRandomRas({ naam: hond.ras });

      await getController(RAS).save(ras);
      await getController(KLANT).save(klant);

      const { body } = await byIdRequest
        .get(`/api/admin/honden/`)
        .query({ slug: hond._id.toString() })
        .auth(bearer, { type: 'bearer' })
        .expect(200);

      expect(body).toEqual(
        expect.objectContaining({
          _id: hond._id.toString(),
          naam: hond.naam,
          geboortedatum: hond.geboortedatum.toISOString(),
          geslacht: hond.geslacht,
          eigenaar: expect.objectContaining({
            _id: klant._id.toString(),
            fullName: `${klant.vnaam} ${klant.lnaam}`,
          }),
          ras: expect.objectContaining({
            _id: ras._id.toString(),
            naam: hond.ras,
          }),
        })
      );
    });
    //was skipped already
    it.skip('Should return 401 when not an admin', async () => {
      const klant = createRandomKlant();
      const hond = createRandomHond();
      const bearer = createBearer(klant);

      await byIdRequest
        .get(`/api/admin/honden/${hond._id.toString()}`)
        .auth(bearer, { type: 'bearer' })
        .expect(401);
    });
  });
});
