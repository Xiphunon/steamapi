const requestPromise = require('request-promise');
var request = require('request');
const { API_TOKEN, XIPH_STEAM_ID } = require('./config.json');

var friendListJSON_URL = `http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=${API_TOKEN}&steamid=${XIPH_STEAM_ID}&relationship=friend`;

var ownedGamesJSON_URL = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${API_TOKEN}&steamid=${XIPH_STEAM_ID}&include_played_free_games=true&format=json`;

getPlayerFriendID();

async function getPlayerFriendID() {
    var friendList;

    console.time('friendList2');
    friendList = await JSON.parse(await getBody(friendListJSON_URL)).friendslist.friends;
    console.timeEnd('friendList2');

    //console.log(friendList);

    var friendObjects = await getFriendObjectList(friendList); //THIS TAKES A WHILE

    console.log("End");
}

async function getFriendObjectList(friendList) {
    var playerSummariesJSON_URL = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${API_TOKEN}&steamids=`;
    var testURL = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${API_TOKEN}&steamid=`;
    var arrayOfFriends = new Array();

    console.time('friendList');
    for (var num = 0; num < friendList.length; num++) {
        //var friendObject = JSON.parse(await requestPromise(playerSummariesJSON_URL + friendList[num].steamid)).response.players[0];
        var friendObject = await getBody(testURL + friendList[num].steamid);
        arrayOfFriends.push(friendObject);
    }
    console.timeEnd('friendList');
    return arrayOfFriends;
}

function getBody(URL) {
    return new Promise((resolve, reject) => {
        request.get(URL, (error, response, body) => {
            if (error) {
                reject(error);
            } else {
                resolve(body);
            }
        });
    });
}


console.log('READY');
