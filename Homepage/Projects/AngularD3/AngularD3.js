var angularD3 = angular.module("angularD3", ["angularD3Controllers"]);

angularD3.service('SettingsService', AngularD3SettingsService);
angularD3.service('GraphService',['SettingsService', AngularD3GraphService]);