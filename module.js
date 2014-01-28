define(['angular'], function (ng) {
  'use strict';

  ng.module('cs_digitalfingerprint.controllers', []);
  ng.module('cs_digitalfingerprint.services', []);

  var module = ng.module('cs_digitalfingerprint', [
    'cs_common',
    'cs_digitalfingerprint.controllers',
    'cs_digitalfingerprint.services'
  ]);

  module.config([
    '$routeProvider',
    'CSTemplateProvider',
    function ($routeProvider, CSTemplateProvider) {

      CSTemplateProvider.setPath('/modules/cs_digitalfingerprint/views');

      $routeProvider
        .when('/dflogin', {
          templateUrl: CSTemplateProvider.view('login'),
          controller: 'CSDigitalFingerprintController',
          public: true
        });

    }

  ]);

  return module;

});
