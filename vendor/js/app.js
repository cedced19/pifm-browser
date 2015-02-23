angular.module('PifmBrowser', [])
.controller('PifmBrowserCtrl', ['$scope', '$http', function ($scope, $http) {
    $http.get('/api/').success(function (data) {
      $scope.musics = data;
    
      $scope.start = function () {
          $http.get('/api/start/');
      }
        
      
      $scope.stop = function () {
        $http.get('/api/stop/');
      };
        
      
      $scope.refresh = function () {
        $http.get('/api/refresh/').success(function (data) {
            $scope.musics = data;
        });
      };
        
    }).error(function () {
      $scope.error = true;
    });
  }
]);