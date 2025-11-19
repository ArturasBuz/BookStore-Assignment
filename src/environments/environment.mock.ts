import { pageSettings } from '@env/page-settings';

export const environment = {
  production: false,
  path: `http://localhost:3001/${pageSettings.GATEWAY_PATH}`,
};
