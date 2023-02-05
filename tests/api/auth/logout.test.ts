import handler from 'src/pages/api/auth/logout.page';
import { createBearer } from 'src/services/Authenticator';
import { createRandomKlant } from 'tests/fixtures/klant';
import { LOGOUT } from 'src/types/apiTypes';
import { getRequest } from 'tests/helpers';

describe('/logout', () => {
  const request = getRequest(handler);
  describe('/DELETE', () => {
    it('Should remove Client and JWT on successfull logout', async () => {
      const klant = createRandomKlant();
      const bearer = createBearer(klant);

      const logoutResponse = await request
        .delete(LOGOUT)
        .set('bearer', bearer)
        .send()
        .expect(200);

      expect(logoutResponse.headers['set-cookie'].includes('JWT')).toBe(false);
      expect(logoutResponse.headers['set-cookie'].includes('Client')).toBe(false);
    });
  });
});
