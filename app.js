var data;
var countryCode = 'US'
var possible = "abcdefghijklmnopqrstuvwxyz"

var myApp = angular.module('myApp', ['spotify'])

var myCtrl = myApp.controller('myCtrl', function($scope, $http, Spotify) {
  
  //The Spotify part of the controller
  $scope.audioObject = {}

  var makeRelatedTable = function(relatedArtistArr, artistID) {
  	var artistLI = $('.'+artistID);
  	$('.'+artistID + ' ul').remove();

  	var ul = $('<ul>Related Artists</ul');

  	angular.forEach(relatedArtistArr, function(artist){
  		var li = $('<li></li>').attr('ng-click','displayInfo($event)');
  		li.addClass(artist.id);

  		li.text(artist.name);
  		ul.append(li);
  	});

  	artistLI.append(ul);
  }

  var randomNumber = function(min,max){
  	return Math.floor(Math.random() * (max-min+1)+min);
  }

  //Find random Artist
  $scope.randomize = function() {
    $('#initial ul').remove();
  	var randChar = possible.charAt(randomNumber(0,possible.length));

  	Spotify.search(randChar+'*', 'artist').then(function(response){
  		data = response.artists.items;
	  	$scope.artistInitial = data[randomNumber(0,data.length)];
  	});
  }

  //Get user entered artist
  $scope.getArtist = function() {
    $('#initial ul').remove();
    Spotify.search($scope.artistQuery,'artist').then(function(response){
    	$scope.artistInitial = response.artists.items[0];
    })
  }
  $scope.play = function(song) {
    if($scope.currentSong == song) {
      $scope.audioObject.pause()
      $scope.currentSong = false
      return
    }
    else {
      if($scope.audioObject.pause != undefined) $scope.audioObject.pause()
      $scope.audioObject = new Audio(song);
      $scope.audioObject.play()  
      $scope.currentSong = song
    }
  }

  $scope.displayInfo = function(artistOb){
    	var artistID = artistOb.target.attributes.class.value

    	Spotify.getArtist(artistID).then(function(artistData){
  	  	$scope.showInfo = true;
  	  	$scope.artistName = artistData.name;
  	  	$scope.artistPop = artistData.popularity;
  	  	$scope.artistImg = artistData.images[0].url;
  	  	$scope.artistGenres = artistData.genres;
  	  	Spotify.getArtistTopTracks(artistData.id, countryCode).then(function(response){
  	  		$scope.topTracks = response.tracks;
  	  	})
    	})

    	Spotify.getRelatedArtists(artistID).then(function(data){
    		success:makeRelatedTable(data.artists, artistID);
  	})
  }

})

// Add tool tips to anything with a title property
$('body').tooltip({
    selector: '[title]'
});
