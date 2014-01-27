define(['angular', '../module'], function (ng) {
  'use strict';

  ng.module('cs_session.controllers')
  .controller('CSLoginController', [
    '$scope',
    'CSSession',
    'CSSessionHelpers',
    '$log',
    'CSDigitalFingerprintService',
    '$storage',
    '$sanitize',
    function ($scope, CSSessionProvider, CSSessionHelpersProvider, $log, CSDigitalFingerprintService, $storage, $sanitize) {
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
              "fingerprint" : $sanitize(CSDigitalFingerprintService.fingerprint.front)
          }
      }

      $scope.login = function () {
        CSDigitalFingerprintService.runPrints(function()
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
            $storage.add('fingerprint', CSDigitalFingerprintService.fingerprint.front);
            $storage.add('token', data.token);
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
