require.config({
  baseUrl: '/modules/cs_digitalfingerprint',
  packages: [
    {
      name: 'cs_account',
      location: '../cs_account'
    },
    {
      name: 'cs_common',
      location: '../cs_common'
    },
    {
      name: 'cs_session',
      location: '../cs_session'
    },
    {
      name: 'users',
      location: '../users'
    }
  ],
  paths: {
    angular: '../../components/angular/angular',
    ngResource: '../../components/angular-resource/angular-resource',
    ngRoute: '../../components/angular-route/angular-route',
    ngSanitize: '../../components/angular-sanitize/angular-sanitize',
    ngStorage: '../components/angular-webstorage/angular-webstorage',
    csDigitalFingerprintHelpers: 'cs_digitalfingerprint_helpers'
  },
  shim: {
    angular: {
      exports: 'angular'
    },
    ngResource: {
      deps: ['angular']
    },
    ngRoute: {
      deps: ['angular']
    },
    ngSanitize: {
      deps: ['angular']
    },
    ngStorage: {
      deps: ['angular']
    },
    csDigitalFingerprintHelpers: {
      deps: ['angular']
    }
  }
});
