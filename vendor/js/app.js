angular.module('PifmBrowser', [])
.factory('socket', ['$rootScope', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
}])
.controller('PifmBrowserCtrl', ['$scope', '$http', 'socket', function ($scope, $http, socket) {
    $http.get('/api/').success(function (data) {

      $scope.musics = data.list;
      $scope.currentzik = data.current;
      $scope.freq = data.freq;

      $scope.refresh = function () {
        $http.get('/api/refresh/').success(function (data) {
            $scope.musics = data;
        });
      };

      socket.on('new', function (data) {
          $scope.lastzik = $scope.currentzik;
          $scope.currentzik = data;
      });

    }).error(function () {
      $scope.error = true;
    });
  }
]);
