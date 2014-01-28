define(['angular', '../module'], function (ng) {
  'use strict';

  ng.module('cs_digitalfingerprint.controllers')
  .controller('CSDigitalFingerprintController', [
    '$scope',
    'CSSession',
    'CSSessionHelpers',
    '$log',
    'CSDigitalFingerprintFactory',
    '$sanitize',
    function ($scope, CSSessionProvider, CSSessionHelpersProvider, $log, CSDigitalFingerprintFactory, $sanitize) {
      $scope.helpers = CSSessionHelpersProvider;

      $scope.credentials = {
        "username" : "admin@clevertech.biz",
        "password" : "1234"
      };

      //sanitize everything to protect data
      $scope.sanitizeCredentials = function(credentials) {
          return {
              "username" : $sanitize(credentials.username),
              "password" : $sanitize(credentials.password),
              "fingerprint" : $sanitize(CSDigitalFingerprintFactory.fingerprint.front)
          }
      }

      $scope.login = function () {
        CSDigitalFingerprintFactory.runPrints(function()
        {
            //incude the users front fingerprint to the login credentials used to create session token
            CSSessionProvider.login($scope.sanitizeCredentials($scope.credentials));
        });
      }

      //set session
      $scope.$on('CSSessionProvider:loginSuccess', function (event, data) {
          console.log("LoginController:",event,data);
          if (data && data.token) {
            console.log("LoginController: session token received: "+data.token);
            localStorage.setItem('fingerprint', CSDigitalFingerprintFactory.fingerprint.front);
            localStorage.setItem('token', data.token);
          }
      });

      // $scope.login = function () {
      //   CSSessionProvider.login($scope.credentials);
      // };

      $scope.$on('CSSessionProvider:loginFailure', function (event, data) {
        $log.log('CSLoginController:', event, data);
        if(data === '403') {
          $log.error('Invalid username/password');
        }
      });

    }
  ]);

});
