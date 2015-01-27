angular.module('PifmBrowser', []).controller('PifmBrowserCtrl', ['$scope', '$http', function ($scope, $http) {
    $http.get('/api').success(function (data) {
      $scope.musics = data;
      $scope.currentzik = null;
      $scope.isstop = true;
        
      $scope.setzik = function (zik) {
        if (zik !== null) {
          $scope.lastzik = $scope.currentzik;
          $scope.currentzik = zik;
          $http.get('/api/play/' + $scope.currentzik.id).success(function (data) {
            $scope.isstop = data;
          });
        }
      };
        
      $scope.random = function () {
        var number = Math.floor(Math.random() * $scope.musics.length);
        if ($scope.currentzik != $scope.musics[number]) {
          $scope.setzik($scope.musics[number]);
        } else {
          $scope.random();
        }
      };
        
      $scope.refresh = function () {
        $http.get('/api/refresh').success(function (data) {
          $scope.musics = data;
        });
      };
      
      $scope.stop = function () {
        $http.get('/api/stop').success(function (data) {
          $scope.isstop = data;
        });
      };
        
    }).error(function () {
      $scope.error = true;
    });
  }
]);