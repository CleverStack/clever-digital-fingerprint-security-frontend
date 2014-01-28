define([
  'angular',
  './module',
  'cs_common',
  'underscore',

  // 'webStorageModule',
  // 'csDigitalFingerprintHelpers',

  // Controllers
  './scripts/cs_digitalfingerprint_controller',

  // Providers
  './../cs_session/scripts/cs_session_provider',
  './../cs_session/scripts/cs_session_helpers_provider',

  // Services
  './../cs_session/scripts/cs_session_service',
  './scripts/cs_digitalfingerprint_factory'

], function() {});
