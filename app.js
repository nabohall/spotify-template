var data;
var baseUrl = 'https://api.spotify.com/v1/search?type=artist&query='
var myApp = angular.module('myApp', ['spotify'])
var countryCode = 'US'
var possible = "abcdefghijklmnopqrstuvwxyz"

//https://api.spotify.com/v1/search?type=artist&q=Fall%20Out%20Boy - use this is to find ID, for other queries
myApp.config(function (SpotifyProvider) {
    SpotifyProvider.setClientId('719c8291eda047a59594190aa2caa468');
    SpotifyProvider.setRedirectUri('http://www.example.com/callback.html');
	SpotifyProvider.setScope('');
	// If you already have an auth token
	SpotifyProvider.setAuthToken('BQAjb0vcW6c-fFnzMHfHssuWBqquWn2kiB3bOextcqX2KUSQ4GA_2pyBECJmTMbKdb5cxx-EdVIwLo9FWDlJyPYrId93imSTCit85JZrhevGSH9VzYjj5I8fErnlGrpyujpdr479ftk');
  });

var myCtrl = myApp.controller('myCtrl', function($scope, $http, Spotify) {
  $scope.audioObject = {}

  var makeRelatedTable = function(relatedArtistArr, artistID) {
  	var artistLI = $('#'+artistID);
  	$('#'+artistID + ' ul').remove();

  	var ul = $('<ul>Related Artists</ul');

  	angular.forEach(relatedArtistArr, function(artist){
  		var li = $('<li></li>').attr('ng-click','displayInfo($event)');
  		li.attr('id', artist.id);
  		li.text(artist.name);
  		ul.append(li);
  	});

  	artistLI.append(ul);
  }

  var randomNumber = function(min,max){
  	return Math.floor(Math.random() * (max-min+1)+min);
  }

  $scope.randomize = function() {
  	var randChar = possible.charAt(randomNumber(0,possible.length));

  	Spotify.search(randChar+'*', 'artist').then(function(response){
  		data = response.artists.items;
	  	$scope.artistInitial = data[randomNumber(0,data.length)];
  	});
  }

  $scope.getArtist = function() {
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
  	var artistID = artistOb.target.attributes.id.value

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
