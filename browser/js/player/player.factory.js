'use strict';

juke.factory('PlayerFactory', function(){
    let factoryObj = {};
    let playingBool = false;
    let currentSong = null;
    let playList = [];
    //let progress = 0;
    var audio = document.createElement('audio');
    factoryObj.start = function (song, songList) {
      currentSong = song;
      if(songList) playList = songList;
      factoryObj.pause();
      audio.src = song.audioUrl;
      audio.load();
      audio.play();
      playingBool = true;
    }
    factoryObj.pause = function() {
      audio.pause();
      playingBool = false;
    }
    factoryObj.resume = function () {
      audio.play();
      playingBool = true;
    }
    factoryObj.isPlaying = function () {
      return playingBool;
    }
    factoryObj.getCurrentSong = function () {
      return currentSong;
    }
    factoryObj.next = function () {
      let currentIndex = playList.indexOf(currentSong);
      let nextIndex = (currentIndex + 1) % playList.length;
      factoryObj.start(playList[nextIndex]);
    }
    factoryObj.previous = function () {
      let currentIndex = playList.indexOf(currentSong);
      let prevIndex = (currentIndex - 1 + playList.length) % playList.length;
      factoryObj.start(playList[prevIndex]);
    }
    factoryObj.getProgress = function () {
      return audio.currentTime / audio.duration || 0;
    }
    factoryObj.seek = function(decimal) {
      audio.currentTime = audio.duration * decimal;
    }
    return factoryObj;
});
