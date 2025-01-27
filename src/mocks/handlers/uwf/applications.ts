import { http, HttpResponse } from 'msw';

export default http.get('*/api/uwf-query-service/applications', () => {
  // ...and respond to them using this JSON response.
  return HttpResponse.json([
    {
      name: 'workspaces',
      displayName: 'Avaya Workspaces',
      initScripts: [
        {
          src: 'http://localhost:4002/uwf-workspaces/AvayaCustomerServices-0.0.0.min.js',
          type: 'application/javascript',
        },
      ],
      description: 'Contact Center Agent and Supervisor Experience',
      iconUri: 'neo-icon-headphones',
      features: {
        allowRuntimeLayoutChanges: true,
        enableIdleTimeout: false,
      },
      languageFileDirectory: 'http://localhost:4002/uwf-workspaces/assets/i18n/translate/locales/',
      clientIntegrations: [],
    },
  ]);
});
