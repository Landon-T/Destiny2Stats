//Prod
var API_KEY = "d8cd30d93c9e4421b94176ed5cce4d08"
//TEST
//var API_KEY = "193a94ff20a34d71aa6165cdbc3386ac"

//Determines how many games will be looked at for the per map statistics
const MAP_SEARCH = 250;

var Character = {
    displayName : "Undefined",
    membershipId : "Undefined",
    characterId: "Undefined",
    emblemBackground: "Undefined",
    platform: "4"
};

//Get URL character information
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

//Load the google charts library
google.charts.load('current', {'packages':['corechart']});

$(document).ready(function(){
  
  //Object contains all charcater information
  var Character = window.Character;
  var activityList;
  
  //List of all maps
  var ActivityReferanceList = [3292922825, 2666761222, 2262757213, 2748633318, 1815340083, 1673114595, 3404623499, 3849796864, 1711620427, 750001803, 3164915257, 332234118, 2473919228, 4012915511, 806094750, 532383918, 399506119, 1153409123, 2810171920, 777592567, 778271008, 1583254851];
  var allPvP;
  
  
  $('.subHeader').append( "Last "+MAP_SEARCH+" Games");
  
  
  Character.displayName = getParameterByName("name");
  Character.membershipId = getParameterByName("membershipId");
  Character.platform = getParameterByName("platform");
  Character.characterId = getParameterByName("characterId");
  getCharacterInfo(Character);
  
  var generalIsHidden = false;
  var weaponIsHidden = false;
  var mapIsHidden = false;
  
  document.getElementsByClassName('upArrow')[0].addEventListener('click', function (event) {
    var element = document.getElementById("generalArrow");
    if (generalIsHidden == true){
      document.getElementById("generalAppend").style.display = "";  
      generalIsHidden = false;
      element.classList.remove("downArrow");
      element.classList.add("upArrow");
    }else{
      document.getElementById("generalAppend").style.display = "none";  
      generalIsHidden = true;
      element.classList.remove("upArrow");
      element.classList.add("downArrow");
    } 
  });
  
    document.getElementsByClassName('upArrow')[1].addEventListener('click', function (event) {
    var element = document.getElementById("weaponArrow");
    if (generalIsHidden == true){
      document.getElementById("weaponAppend").style.display = "";  
      generalIsHidden = false;
      element.classList.remove("downArrow");
      element.classList.add("upArrow");
    }else{
      document.getElementById("weaponAppend").style.display = "none";  
      generalIsHidden = true;
      element.classList.remove("upArrow");
      element.classList.add("downArrow");
    } 
  });
  
    document.getElementsByClassName('upArrow')[2].addEventListener('click', function (event) {
    var element = document.getElementById("mapArrow");
    if (generalIsHidden == true){
      document.getElementById("mapAppend").style.display = "";  
      generalIsHidden = false;
      element.classList.remove("downArrow");
      element.classList.add("upArrow");
    }else{
      document.getElementById("mapAppend").style.display = "none";  
      generalIsHidden = true;
      element.classList.remove("upArrow");
      element.classList.add("downArrow");
    } 
  });
  
});



function getCharacterInfo(Character){
  console.log("Called Get Charactrer Info:   "+Character.characterId);
  console.log(Character);
  $.ajax({
            url:"https://www.bungie.net/Platform/Destiny2/"+Character.platform+"/Profile/"+Character.membershipId+"/Character/"+Character.characterId+"/?components=200",
            headers: {'X-API-KEY':API_KEY},
            type: 'GET',
            error: function(jqXHR, textStatus, errorThrown) {
              console.log(jqXHR);
              console.log(textStatus);
              console.log(errorThrown);
            },
            success: function(res) {
              //get character emblem
              Character.emblemBackground = "https://www.bungie.net"+res.Response.character.data.emblemBackgroundPath; 
              console.log(res)
              addEmblemBackground(Character);
              getOverallStats(Character);
              getActivityHistory(Character);
              }

        });
}


function addEmblemBackground(Character){
  console.log("Add Emblem Path:  "+Character.emblemBackground);
  $("#Header").prepend('<img id="emblem" src="'+Character.emblemBackground+'"/>');
  $(".HeaderText").prepend('<b id="HeaderTextLine">'+Character.displayName.toUpperCase()+'</b>');
  $(".HeaderText").css("visibility", "visible");
}


function getOverallStats(Character){
  console.log("Called Get Charactrer Overall Stats:"+Character.characterId+" | "+Character.membershipId);
   
  $.ajax({
            url:"https://www.bungie.net/Platform/Destiny2/"+Character.platform+"/Account/"+Character.membershipId+"/Character/"+Character.characterId+"/Stats/?modes=5&groups=Weapons,General",
            headers: {'X-API-KEY':API_KEY},
            type: 'GET',
            error: function(jqXHR, textStatus, errorThrown) {
              console.log(jqXHR);
              console.log(textStatus);
              console.log(errorThrown);
            },
            success: function(res) {
              var allPvP = res.Response.allPvP.allTime;
              PopulateOverallStats(Character, allPvP);
              PopulateWeaponStats(Character, allPvP);
            }

        });
}

function PopulateOverallStats(Character, allPvP){
  var overview = [];
  allPvP.kills.formatedDisplay = 'Kills';
  allPvP.deaths.formatedDisplay = 'Deaths';
  allPvP.assists.formatedDisplay = 'Assists';
  allPvP.efficiency.formatedDisplay = 'Efficiency';
  allPvP.killsDeathsRatio.formatedDisplay = 'Kills Deaths Ratio';
  allPvP.secondsPlayed.formatedDisplay = 'Time Played';
  allPvP.activitiesEntered.formatedDisplay = 'Games Played';
  allPvP.activitiesWon.formatedDisplay = 'Games Won';
  overview.push(allPvP.kills);
  overview.push(allPvP.deaths);
  overview.push(allPvP.assists);
  overview.push(allPvP.efficiency);
  overview.push(allPvP.killsDeathsRatio);
  overview.push(allPvP.secondsPlayed);
  overview.push(allPvP.activitiesEntered);
  overview.push(allPvP.activitiesWon);
  
   $("#generalAppend").append(    '<li class="overallStat">\
      <div class="statHeader">\
          Overview '+'\
      </div>\
      <div id="overview" class="statRow"> \
      </div>\
    </li>');
  
  for (var item in overview){
    $("#overview").append('<div class="statName test">\
          '+overview[item].formatedDisplay+': \
        </div> \
        <div class="statNumber test ">\
          '+overview[item].basic.displayValue+'\
        </div>');
  };
  
  var bests = [];
  allPvP.longestKillSpree.formatedDisplay = "Longest Killing Spree";
  allPvP.longestSingleLife.formatedDisplay = "Longest Single Life";
  allPvP.mostPrecisionKills.formatedDisplay = "Most Precision Kills";
  allPvP.weaponBestType.formatedDisplay = "Best Weapon Type";
  allPvP.bestSingleGameScore.formatedDisplay = "Best Score";
  allPvP.bestSingleGameKills.formatedDisplay = "Most Kills";
  bests.push(allPvP.longestKillSpree);
  bests.push(allPvP.mostPrecisionKills);
  bests.push(allPvP.bestSingleGameKills);
  bests.push(allPvP.bestSingleGameScore);
  bests.push(allPvP.weaponBestType);
  bests.push(allPvP.longestSingleLife);
  
  
  $("#generalAppend").append(    '<li class="overallStat">\
      <div class="statHeader">\
          Bests '+'\
      </div>\
      <div id="bests" class="statRow"> \
      </div>\
    </li>');
  
  for (var item in bests){
    $("#bests").append('<div class="statName test">\
          '+bests[item].formatedDisplay+': \
        </div> \
        <div class="statNumber test ">\
          '+bests[item].basic.displayValue+'\
        </div>');
  };
  
  var average = [];
  allPvP.averageKillDistance.formatedDisplay = "Kill Distance";
  allPvP.averageScorePerKill.formatedDisplay = "Score Per Kill";
  allPvP.averageScorePerLife.formatedDisplay = "Score Per Life";
  allPvP.averageLifespan.formatedDisplay = "Life Span";
  average.push(allPvP.averageKillDistance);
  average.push(allPvP.averageScorePerKill);
  average.push(allPvP.averageScorePerLife);
  average.push(allPvP.averageLifespan);
    $("#generalAppend").append(    '<li class="overallStat">\
      <div class="statHeader">\
          Average Stats '+'\
      </div>\
      <div id="average" class="statRow"> \
      </div>\
    </li>');
  
  for (var item in average){
    $("#average").append('<div class="statName test">\
          '+average[item].formatedDisplay+': \
        </div> \
        <div class="statNumber test ">\
          '+average[item].basic.displayValue+'\
        </div>');
  };
  
}


function PopulateWeaponStats(Character, allPvP){
  console.log("Populate Weapon stats called");
  var weaponList = [];
  var tempString;
  for(var item in allPvP){
    //Comb through the allPvP objects for ones that are realted to weapon kills.
    // Appned those to a new list that can be added to the weapon stats column
    if(item.indexOf("weaponKill")>= 0 && !(item.indexOf("weaponKillsPrecisionKills")>= 0) ) {
      tempString = item.replace("weaponKills",'');
      allPvP[item].basic.name = tempString;
      weaponList.push(allPvP[item].basic);
    }
  }
  //Repeat for the presicion kills
  for(var item in allPvP){
    //Comb through the allPvP objects for ones that are realted to weapon kills.
    // Appned those to a new list that can be added to the weapon stats column
    if(item.indexOf("weaponPrecisionKill")>= 0){
      tempString = item.replace("weaponPrecisionKills",'');
      for(var index in weaponList){
        if(tempString == weaponList[index].name){
          
          weaponList[index].pKills = allPvP[item].basic.displayValue;
          
        }
      }
      
    }
  }
 
  var OrderedWeaponList = [];
  var index = weaponList.length;
  while(index > 0){
    var max = weaponList[0];
    for(var weapon in weaponList){
      if(weaponList[weapon].value > max.value){
       
        max = weaponList[weapon];
      }
    }
    index = index -1;
    OrderedWeaponList.push(max);
    weaponList.splice(weaponList.indexOf(max),1);
    
  }
  
  
  //console.log(weaponList);
  //Output the weapons to the middle column
  for (var weapon in OrderedWeaponList){
    //Sword and relic kills will be undeinfed use this to catch them
    if( typeof OrderedWeaponList[weapon].pKills == 'undefined'){
      OrderedWeaponList[weapon].pKills = 0;
     }

    $("#weaponAppend").append(    '<li class="overallStatW">\
      <div class="statHeader">\
          '+OrderedWeaponList[weapon].name+'\
      </div>\
      <div class="statRow"> \
        <div class="statName test">\
          Kills:\
        </div> \
        <div class="statNumber test ">\
          '+OrderedWeaponList[weapon].displayValue+'\
        </div>\
        <div class="statName test">\
          Precision:\
        </div>\
        <div class="statNumber test ">\
          '+OrderedWeaponList[weapon].pKills+'\
        </div>\
      </div>\
    </li>');
    
  }
  
}



function getActivityHistory(Character){
  console.log("Called Get activity History");
   
  $.ajax({
            url:"https://www.bungie.net/Platform/Destiny2/"+Character.platform+"/Account/"+Character.membershipId+"/Character/"+Character.characterId+"/Stats/Activities/?mode=5&count="+ MAP_SEARCH,
            headers: {'X-API-KEY':API_KEY},
            type: 'GET',
            error: function(jqXHR, textStatus, errorThrown) {
              console.log(jqXHR);
              console.log(textStatus);
              console.log(errorThrown);
            },
            success: function(res) {
             console.log(res);
              var activityList = res.Response.activities;
              proccessActivityHistory(activityList);
            }

        });
  
  
}

function proccessActivityHistory(activityList){
  console.log("Called proccess activity history");
  var activityDefinitions = [];
  var mapList = [];
  var tempMap;
  var referanceId;
  
  //Create a list of all the map hashes
  for (var activity in activityList){
   referanceId = activityList[activity].activityDetails.referenceId;
   var result = activityDefinitions.findIndex(x => x.referanceId == referanceId);
   //If the hash is not in the list add it.
   if(result<0){
      var tempActivity = {
        referanceId:referanceId,
        instanceList:[activityList[activity].activityDetails.instanceId]
      }
      activityDefinitions.push(tempActivity);
    }
    //If it alredy exists then just append the instance the to referance list
    else{
      activityDefinitions[result].instanceList.push(activityList[activity].activityDetails.instanceId)
    }
  }


  //Get info for all the map hashes
  for (var index = 0; index < activityDefinitions.length; index++){
   getMapName(activityDefinitions[index])
    
  }
}

async function getMapName(activityStats){
  var tempMap;
  //console.log("Calling get map name on: "+activityStats.referanceId)
  await $.ajax({           
            url:"https://www.bungie.net/Platform/Destiny2/Manifest/DestinyActivityDefinition/"+activityStats.referanceId+"/",
            headers: {'X-API-KEY':API_KEY},
            type: 'GET',
            error: function(jqXHR, textStatus, errorThrown) {
              console.log(jqXHR);
              console.log(textStatus);
              console.log(errorThrown);
            },
            success: function(res) {
              //console.log(res);
              tempMap =  new mapObject(res.Response.hash, 
                                       res.Response.displayProperties.name,
                                       res.Response.displayProperties.description,
                                       res.Response.displayProperties.icon );
            tempMap.backgroundImg = res.Response.pgcrImage;
            }

     });
   //console.log("Got name for: "+tempMap.name+" | ID: "+tempMap.id);
    for (var i = 0; i < activityStats.instanceList.length; i++){
                var r = await getMapStats(tempMap, activityStats.instanceList[i]);
                
                //console.log("Got report for "+tempMap.name+" | index: "+i);
                

                var players = r.Response.entries
                var charId = window.Character.characterId;
                var result = players.findIndex(x => x.characterId == charId);
                tempMap.games += 1;
                //console.log(players[result]);
                tempMap.kills += players[result].values.kills.basic.value;
                tempMap.assists += players[result].values.assists.basic.value;
                tempMap.deaths += players[result].values.deaths.basic.value;
                if(players[result].values.standing.basic.value == 0 ){
                  tempMap.wins += 1;
                }
                 
              }
             
              addMapData(tempMap);
}

function mapObject(id, name, description, icon){
  this.id = id;
  this.icon = icon;
  this.name = name;
  this.description = description;
  this.backgroundImg = "";
  this.games = 0;
  this.wins = 0;
  this.kills = 0;
  this.deaths = 0;
  this.assists = 0;
  this.pKills = 0;
}


async function getMapStats(mapObject,instance){
  //console.log("Called Get Map Stats with: ");
  //console.log(mapObject);
  //console.log(instance);

  
 //TODO: https://developers.google.com/web/fundamentals/primers/promises
  //https://stackoverflow.com/questions/45683267/iterating-over-synchronous-ajax-calls-with-promises

    return await $.ajax({           
            //url:"https://www.bungie.net/Platform/Destiny2/Stats/PostGameCarnageReport/"+instance+"/",
            url:"https://stats.bungie.net/Platform/Destiny2/Stats/PostGameCarnageReport/"+instance+"/",
            headers: {'X-API-KEY':API_KEY},
            type: 'GET',
            crossDomain: true,
            //async: false,
            error: function(jqXHR, textStatus, errorThrown) {
              console.log(jqXHR);
              console.log(textStatus);
              console.log(errorThrown);
            },
            success: function(res) {
              /*
              var mapObject = Object.assign({},mapObjects);
              var players = res.Response.entries
              var charId = window.Character.characterId;
              var result = players.findIndex(x => x.characterId == charId);
              mapObject.games += 1;
              mapObject.kills += players[result].values.kills.basic.value;
              mapObject.assists += players[result].values.assists.basic.value;
              mapObject.deaths += players[result].values.deaths.basic.value;
              if(players[result].values.standing.basic.value == 0 ){
                mapObject.wins += 1;
                */
              //console.log("Logging: "+mapObject.name+", on instance: "+instance);
            }
          });
   
}
  
function addMapData(mapObject){

  $("#mapAppend").append(    '<li class="overallStat">\
      <div class="headerContainer">\
        <img class="mapIcon" src="https://www.bungie.net/'+mapObject.backgroundImg+'">\
        <div class="statHeaderMap">\
          '+mapObject.name+'\
          <div class="subHeader">'+mapObject.description+'</div>\
          <div class="subHeader">Games Played: '+mapObject.games+'</div>\
        </div>\
      </div>\
      <div class="statRowMap"> \
        <div id="pie'+mapObject.id+'" class="pie">\
          '+'\
        </div>\
        <div class="mapStatName">\
          K/D Ratio\
        </div>\
        <div class="mapStat">\
          '+(Math.round(mapObject.kills/mapObject.deaths*100)/100)+'\
        </div>\
        <span id="pieGame'+mapObject.id+'" class="pie">\
          '+'\
        </span>\
        <div class="mapStatName">\
          Win Ratio\
        </div>\
        <div class="mapStat">\
          '+(Math.round(mapObject.wins/(mapObject.games-mapObject.wins)*100)/100)+'\
        </div>\
      </div>\
    </li>');
    

    google.charts.setOnLoadCallback(function () {
     drawChart(mapObject);
  });
}



/*
    '<li class="overallStat">\
      <div class="statHeader">\
          '+OrderedWeaponList[weapon].name+'\
      </div>\
      <div class="statRow"> \
        <div class="statName test">\
          Kills:\
        </div> \
        <div class="statNumber test ">\
          '+OrderedWeaponList[weapon].displayValue+'\
        </div>\
        <div class="statName test">\
          Precision Kills:\
        </div>\
        <div class="statNumber test ">\
          '+OrderedWeaponList[weapon].pKills+'\
        </div>\
      </div>\
    </li>'
    
*/


/*--------------------------------------------------------------*/
//Chart Stuff

function drawChart(mapObject) {
  var data = google.visualization.arrayToDataTable([
  ['Stat', 'Value'],
  ['Kills', mapObject.kills],
  ['Deaths', mapObject.deaths],
  ['Assists', mapObject.assists]

]);
  
  var data2 = google.visualization.arrayToDataTable([
  ['Stat', 'Value'],
  ['Wins', mapObject.wins],
  ['Loses', (mapObject.games-mapObject.wins)]
]);
  var kdRatio = mapObject.kills/mapObject.deaths;
  var mapTitle = 'K/D Ratio: '+ String(kdRatio);
  // Optional; add a title and set the width and height of the chart

  var options = {
                 'width':275,
                 'height':175,
                 'pieHole': 0.5,
                 'pieSliceText':'value',
                 'backgroundColor':'',
                 'chartArea':{width:'95%',height:'90%'},
                 'pieStartAngle': 180,
                 'tooltip': { 'text':'value' },
                 'colors': ['#102a5d', '#e05225','#17777F'],
                 'legend':'none'
                };
    var options2 = {
                 'width':275,
                 'height':175,
                 'pieHole': 0.5,
                 'pieSliceText':'value',
                 'backgroundColor':'',
                 'chartArea':{width:'95%',height:'90%'},
                 'pieStartAngle': 180,
                 'tooltip': { 'text':'value' },
                 'colors': ['#102a5d', '#e05225'],
                 'legend':'none'
                };

  // Display the chart inside the <div> element with id="piechart"
  var chart = new google.visualization.PieChart(document.getElementById('pie'+mapObject.id));

  chart.draw(data, options);
  
   var chart2 = new google.visualization.PieChart(document.getElementById('pieGame'+mapObject.id));

  chart2.draw(data2, options2);
}

