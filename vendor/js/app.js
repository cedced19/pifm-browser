angular.module('PifmBrowser', [])
.controller('PifmBrowserCtrl', ['$scope', '$http', function ($scope, $http) {
    $http.get('/api').success(function (data) {
      var socket = io.connect('http://localhost:7775');
      $scope.musics = data;
      $scope.currentzik = null;
        
      $scope.setzik = function (zik) {
        if (zik !== null) {
          $scope.lastzik = $scope.currentzik;
          $scope.currentzik = zik;
          socket.emit('play', $scope.currentzik.id);
        }
      };
        
      $scope.refresh = function () {
        socket.emit('refresh');
      };
      
      $scope.stop = function () {
        socket.emit('pause');
      };
        
      $scope.random = function () {
        var number = Math.floor(Math.random() * $scope.musics.length);
        if ($scope.currentzik != $scope.musics[number]) {
          $scope.setzik($scope.musics[number]);
        } else {
          $scope.random();
        }
      };
        
      socket.on('random', function () {
          $scope.random();
      });
        
      socket.on('refresh', function (data) {
          $scope.musics = data;
      });
        
    }).error(function () {
      $scope.error = true;
    });
  }
]);