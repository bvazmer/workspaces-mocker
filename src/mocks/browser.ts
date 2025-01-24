import { setupWorker } from 'msw/browser';
import sessionHandler from './handlers/session';
import stateChangeHandler from './handlers/stateChange';
import socketHandler from './handlers/socket';
import statusHandler from './handlers/status';
import configurationHandler from './handlers/configuration';
import applicationsHandler from './handlers/applications';
import applicationDataHandler from './handlers/applicationData';
import { KJUR } from 'jsrsasign';
import { v4 as uuidv4 } from 'uuid';

export const handlers = [
  configurationHandler,
  applicationsHandler,
  applicationDataHandler,
  socketHandler,
  sessionHandler,
  stateChangeHandler,
  statusHandler,
];

export const initMocks = async () => {
  const jwt = KJUR.jws.JWS.sign(
    'RS256',
    {
      // @ts-expect-error sfsd
      typ: 'JWT',
      kid: 'LbnpA0OBDjpT2rPfu_D-W6mB3iV2WlZdbGFgmYGg61o',
    },
    {
      jti: uuidv4(),
      exp: Math.floor(new Date().getTime() / 1000) + 300,
      nbf: 0,
      iat: Math.floor(new Date().getTime() / 1000),
      iss: '/auth/realms/ix',
      aud: ['account', 'uwf'],
      sub: '',
      typ: 'Bearer',
      azp: 'uwf',
      auth_time: 1590396025,
      session_state: uuidv4(),
      acr: '1',
      realm_access: {
        roles: ['agent', 'offline_access', 'uma_authorization'],
      },
      resource_access: {
        account: {
          roles: ['manage-account', 'manage-account-links', 'view-profile'],
        },
      },
      scope: 'openid profile offline_access email',
      email_verified: true,
      idp: 'avaya',
      preferred_username: 'joebloggs@avaya.com',
      given_name: 'Joe',
      family_name: 'Bloggs',
      email: 'joebloggs@avaya.com',
    },
    {
      kty: 'RSA',
      n: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAmRfJjYCYo2Tzw23boO8dwTFatUSDIdqUcI0tomEUt3NM/X72PlYetxDHaI5FMlkTofrY8L4xcM9pdo230YBEWEOpjyZvDxvc3lPtMEHRc3acmq+G0YXa5sP8E2w4zXbZCvliooDVJT5e/3lFPvwMCIUS9g/0E2W33TysBeBATVifY+D2WMzUfgt16wqc9wZeUkdgdN5aT+p4puZ8nYehB8a5A0JLnmJ5qlrXE0352MoeN/4U+dTPlQOO5drYTlasGl9LZEXtFhAVUT5EPkcjGq8fnsAHI+CckfIwYd4yVFPukauh/ZndRWHuvEzjGqzpAtfRfeDNcf+cosbqMmhAXQIDAQAB',
      e: 'AQAB',
      d: 'secret',
    },
  );
  document.cookie = `sso-access=${jwt}`;

  return setupWorker(...handlers).start({
    onUnhandledRequest: 'bypass',
  });
};