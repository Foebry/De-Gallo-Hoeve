import { createRandomKlanten } from 'tests/fixtures/klant';
import { handler } from 'src/cronjobs/scripts/updateKlantData';
import { getAllKlanten } from 'src/controllers/KlantController';
import { createDefaultFeedbackConfiguration } from 'src/services/Factory';
import { getUntypedCollection } from 'src/utils/db';
import logger from 'src/utils/logger';

describe('SCRIPT - UpdateKlantData', () => {
  jest.spyOn(logger, 'info').mockImplementation();

  it('Should update all klanten with new key "feedbackConfiguration" which will hold the default Configuration', async () => {
    const collection = await getUntypedCollection('klant');
    const klanten = createRandomKlanten(10).map((klant) => {
      const { feedbackConfiguration, password, ...rest } = klant;
      return rest;
    });
    await collection.insertMany(klanten);

    const result = await handler();
    expect(result).toBe(true);

    const updatedKlanten = await getAllKlanten(true);
    expect(updatedKlanten).toEqual(
      expect.arrayContaining(
        klanten.map((klant) =>
          expect.objectContaining({
            _id: klant._id,
            bus: klant.bus ?? null,
            created_at: klant.created_at,
            deleted_at: klant.deleted_at ?? null,
            email: klant.email,
            gemeente: klant.gemeente,
            gsm: klant.gsm,
            honden: klant.honden,
            inschrijvingen: klant.inschrijvingen,
            lnaam: klant.lnaam,
            nr: klant.nr,
            postcode: klant.postcode,
            reservaties: klant.reservaties,
            roles: klant.roles,
            straat: klant.straat,
            verified: klant.verified,
            verified_at: klant.verified_at ?? null,
            vnaam: klant.vnaam,
            feedbackConfiguration: expect.objectContaining({
              ...createDefaultFeedbackConfiguration(),
            }),
          })
        )
      )
    );
  });
});
