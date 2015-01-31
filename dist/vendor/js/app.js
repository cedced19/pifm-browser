angular.module('PifmBrowser', [])
.controller('PifmBrowserCtrl', ['$scope', '$http', function ($scope, $http) {
    $http.get('/api/').success(function (data) {
      var socket = io.connect(window.location.host);
      $scope.musics = data;
      $scope.currentzik = null;
      $scope.isstop = false;
        
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
        $scope.isstop = true;
      };
        
      $scope.random = function () {
        var number = Math.floor(Math.random() * $scope.musics.length);
        if ($scope.currentzik != $scope.musics[number]) {
          $scope.setzik($scope.musics[number]);
        } else {
          $scope.random();
        }
      };
    
      $scope.random();
        
      socket.on('random', function () {
          if ($scope.isstop) {
            $scope.isstop = false;
            return false;
          }
          $scope.random();
      });
        
      socket.on('refresh', function (data) {
          $scope.musics = data;
      });
      
      socket.on('info', function (id) {
          $scope.musics.forEach(function(zik) {
            if (id == zik.id) {
                $scope.lastzik = $scope.currentzik;
                $scope.currentzik = zik;
            }
          });
      });
        
    }).error(function () {
      $scope.error = true;
    });
  }
]);