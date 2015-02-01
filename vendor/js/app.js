angular.module('PifmBrowser', [])
.controller('PifmBrowserCtrl', ['$scope', '$http', function ($scope, $http) {
    $http.get('/api/').success(function (data) {
      var socket = io.connect(window.location.host);
      $scope.musics = data;
      $scope.currentzik = null;
      $scope.want = false;
        
      $scope.setzik = function (zik, want) {
        if (zik !== null) {
          $scope.lastzik = $scope.currentzik;
          $scope.currentzik = zik;
          $scope.want = want; 
          socket.emit('play', $scope.currentzik.id);
        }
      };
        
      $scope.refresh = function () {
        socket.emit('refresh');
      };
      
      $scope.stop = function () {
        socket.emit('stop');
        $scope.want = true;
      };
        
      $scope.random = function (want) {
        var number = Math.floor(Math.random() * $scope.musics.length);
        if ($scope.currentzik != $scope.musics[number]) {
          $scope.setzik($scope.musics[number], want);
        } else {
          $scope.random(want);
        }
      };
    
      $scope.random(true);
        
      socket.on('random', function () {
          if ($scope.want) {
            $scope.want = false;
          } else {
            $scope.random(false);   
          }
      });
        
      socket.on('refresh', function (data) {
          $scope.musics = data;
          $scope.random(true);
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