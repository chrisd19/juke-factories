'use strict';

juke.controller('AlbumCtrl', function ($scope, AlbumFactory, $rootScope, $log, StatsFactory) {

  // load our initial data
  AlbumFactory.fetchAll()
  .then(function (res) { return res.data; })
  .then(function (albums) {
    return AlbumFactory.fetchById(albums[0].id); // temp: get one
  })
  .then(function (res) { return res.data; })
  .then(function (album) {
    album.imageUrl = '/api/albums/' + album.id + '/image';
    album.songs.forEach(function (song, i) {
      song.audioUrl = '/api/songs/' + song.id + '/audio';
      song.albumIndex = i;
    });
    StatsFactory.totalTime(album)
    .then(function(dur) {
      album.duration = Math.round(dur/60) + " minutes";
      $scope.album = album;
    });
  })
  .catch($log.error); // $log service can be turned on and off; also, pre-bound

  // main toggle
  $scope.toggle = function (song) {
    if ($scope.playing && song === $scope.currentSong) {
      $rootScope.$broadcast('pause');
    } else $rootScope.$broadcast('play', song);
  };

  // incoming events (from Player, toggle, or skip)
  $scope.$on('pause', pause);
  $scope.$on('play', play);
  $scope.$on('next', next);
  $scope.$on('prev', prev);

  // functionality
  function pause () {
    $scope.playing = false;
  }
  function play (event, song) {
    $scope.playing = true;
    $scope.currentSong = song;
  };

  // a "true" modulo that wraps negative to the top of the range
  function mod (num, m) { return ((num % m) + m) % m; };

  // jump `interval` spots in album (negative to go back, default +1)
  function skip (interval) {
    if (!$scope.currentSong) return;
    var index = $scope.currentSong.albumIndex;
    index = mod( (index + (interval || 1)), $scope.album.songs.length );
    $scope.currentSong = $scope.album.songs[index];
    if ($scope.playing) $rootScope.$broadcast('play', $scope.currentSong);
  };
  function next () { skip(1); };
  function prev () { skip(-1); };

});

juke.controller('AllAlbumsCtrl', function($scope, AlbumFactory, StatsFactory, $log, $rootScope) {
  AlbumFactory.fetchAll()
  .then(function(res) {
    return res.data;
  })
  .then(function(albums) {
    albums.forEach(function(album) {
      album.imageUrl = '/api/albums/' + album.id + '/image';
      AlbumFactory.fetchById(album.id)
      .then(function(res) {
        album.numSongs = res.data.songs.length;
      });
    });
    $scope.albums = albums;
  })
})
