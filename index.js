//PRod
//var API_KEY = "d8cd30d93c9e4421b94176ed5cce4d08"
//TEST
var API_KEY = "193a94ff20a34d71aa6165cdbc3386ac"

var Character = {
    displayName : "Undefined",
    membershipId : "Undefined",
    characterId: "Undefined",
    emblemBackground: "Undefined",
    platform: "-1"
  };

//Loads on document ready
$(document).ready(function(){
	var username;
  
  //Input listener for the search bar to auto complete
  document.getElementById("userSearchBar").addEventListener("input", function(){
    var formReturn = $("form").serializeArray();
    var val = formReturn[0].value;
    //console.log(formReturn[0].value);
    
    //API call for partial matches
    if(val.length > 3){
      $.ajax({
          url: "https://www.bungie.net/Platform/User/SearchUsers/?q="+val,
          headers: {'X-API-KEY':API_KEY},
          type: 'GET',
          error: function(jqXHR, textStatus, errorThrown) {
              console.log(jqXHR);
              console.log(textStatus);
              console.log(errorThrown);
          },
          success: function(res) {
              //console.log(res);
              closeAllLists();
              var a = document.createElement("DIV");
              a.setAttribute("id","autocomplete-list");
              a.setAttribute("class", "autocomplete-items");
              var inp = document.getElementById("userSearchBar");
              inp.parentNode.appendChild(a);
              var arr = res.Response;
              for (var i = 0; i < Math.min(arr.length, 6); i++) {
              /*check if the item starts with the same letters as the text field value:*/
                var name;
                if (arr[i].blizzardDisplayName != null){
                  name = arr[i].blizzardDisplayName;
                }else{
                  name = arr[i].displayName;
                }
                if (name.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                  /*create a DIV element for each matching element:*/
                  var b = document.createElement("DIV");
                  /*make the matching letters bold:*/
                  b.innerHTML = "<strong>" + name.substr(0, val.length) + "</strong>";
                  b.innerHTML += name.substr(val.length);
                  /*insert a input field that will hold the current array item's value:*/
                  b.innerHTML += "<input type='hidden' value='" + name + "'>";
                  /*execute a function when someone clicks on the item value (DIV element):*/
                  b.addEventListener("click", function(e) {
                    /*insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value;
                    /*close the list of autocompleted values,
                      (or any other open lists of autocompleted values:*/
                    closeAllLists();
                  });
                  a.appendChild(b);
                }
              }
              function closeAllLists() {
                /*close all autocomplete lists in the document,
                except the one passed as an argument:*/
                var x = document.getElementsByClassName("autocomplete-items");
                for (var i = 0; i < x.length; i++) {
                    x[i].parentNode.removeChild(x[i]);
                    console.log("removed: "+x[i] );
                }
              }
          
          }  
      });
    }  
  });

  
  // Click listener for the search button
	$("#searchButton").click(function(){


      var formReturn = $("form").serializeArray();
    	username = formReturn[0].value;
    	
    
        //Check string for the '#' character and replace it with '%23'
    	for (var i = 0; i < username.length; i++) {
    		if(username.charAt(i)=='#'){
    			username = username.replace('#','%23');
    		}
      }
      /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        x[i].parentNode.removeChild(x[i]);
        //console.log("removed: "+x[i]);
        
      }
      
      getMembershipId(username);
    });
    
});




//Each account has a membership id that links all the characters on that account
function getMembershipId(username){
	$.ajax({
        url: "https://www.bungie.net/Platform/Destiny2/SearchDestinyPlayer/-1/"+username+"/",
        headers: {'X-API-KEY':API_KEY},
        type: 'GET',
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        },
        success: function(res) {
            //console.log(res);
            //Save membership id in the character object
            Character.displayName = res.Response[0].displayName;
            Character.membershipId = res.Response[0].membershipId;
            Character.platform = res.Response[0].membershipType
            //console.log(Character);
            getCharacterId(Character);
        }
	});
}

//Use membership ID and platform to get the list of character ID's
function getCharacterId(Character){
  console.log("Called Get Charactrer ID:  "+Character.membershipId);
   //console.log("https://www.bungie.net/Platform/Destiny2/4/Profile/"+Character.membershipId+"/?components=100");
  $.ajax({
        url: "https://www.bungie.net/Platform/Destiny2/"+Character.platform+"/Profile/"+Character.membershipId+"/?components=100",
        headers: {'X-API-KEY':API_KEY},
        type: 'GET',
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        },
        success: function(res) {
          
            //Save a list of characters 
            Character.characterId = res.Response.profile.data.characterIds;
            Character.displayName = res.Response.profile.data.userInfo.displayName;
            //console.log("Character ID:  "+Character.characterId);
            //console.log(res.Response);
            var emblems = document.getElementsByClassName("emblemContainer");
            //console.log("Length: "+emblems.length);
            var size = emblems.length;

            for (var index = size-1; index >=0; index--) {
                        
              emblems[index].parentNode.removeChild(emblems[index]);
                        
              //console.log("removed: "+emblems[index]+"index is: "+index);
              emblems = document.getElementsByClassName("emblemContainer");
            }
            for (var i in Character.characterId){
              getCharacterInfo(Character,i);
            }
        }
    });
}

//takes an index to know which emblem container to use and character id to get information on
// Gathers the emblem and charcater name information, and class
function getCharacterInfo(Character,index){
  console.log("Called Get Charactrer Info:   "+Character.characterId[index]);
   //console.log("https://www.bungie.net/Platform/Destiny2/4/Profile/"+Character.membershipId+"/Character/"+Character.characterId[0]+"/?components=200");
  $.ajax({
            url:"https://www.bungie.net/Platform/Destiny2/"+Character.platform+"/Profile/"+Character.membershipId+"/Character/"+Character.characterId[index]+"/?components=200",
            headers: {'X-API-KEY':API_KEY},
            type: 'GET',
            error: function(jqXHR, textStatus, errorThrown) {
              console.log(jqXHR);
              console.log(textStatus);
              console.log(errorThrown);
            },
            success: function(res) {
              //Character.emblemBackground = "https://www.bungie.net"+res.Response.character.data.emblemBackgroundPath; baseCharacterLevel light
              console.log(res.Response);
              //console.log(res.Response.character.data.emblemBackgroundPath);
              //console.log(Character.emblemBackground);
              var classId = res.Response.character.data.classType
              if(classId == 1){
                var classType = "Hunter";
              }
              if(classId == 2){
                var classType = "Warlock";
              }
              if(classId == 0){
                var classType = "Titan";
              }
                
              var CharacterSample = {
                displayName : Character.displayName,
                membershipId : Character.membershipId,
                characterId: Character.characterId[index],
                emblemBackground: "https://www.bungie.net"+res.Response.character.data.emblemBackgroundPath,
                platform: Character.platform,
                level: res.Response.character.data.baseCharacterLevel,
                light: res.Response.character.data.light,
                index: index,
                class: classType
              };
              //console.log(CharacterSample);
              
              
              
              
              
              
              addEmblemBackground(CharacterSample);
              //getOverallStats(Character);
              //getActivityHistory(Character);
              }

        });
}

//Add the character information to the emblemContainer
function addEmblemBackground(Character){

  
  /* Remove existing backgrounds frist  */
 
  
  
  $(".characterList").prepend('        \
        <div id="index'+Character.index+'" class="emblemContainer">\
          <img class="emblem" src="'+Character.emblemBackground+'">\
          <div class="levelText">\
            '+Character.level+'\
          </div>\
          <div class="classText">\
            '+Character.class+'\
          </div>\
          <div class="lightText">\
            '+Character.light+'\
          </div>\
        </div> ');
  var id = "index"+Character.index;
  //Click listener for each emblem that links to the character stats page
  document.getElementById(id).addEventListener('click',function(){
    console.log("Button was clicked"+id);
    
    //TEST
    //window.location.href = "https://destiny2stats.glitch.me/Stats.html?membershipId="+Character.membershipId+"&characterId="+Character.characterId+"&platform="+Character.platform+"&name="+Character.displayName;
    //Prod    https://nervous-fermi-739b06.netlify.com/
    //window.location.href = "https://nervous-fermi-739b06.netlify.com/Stats.html?membershipId="+Character.membershipId+"&characterId="+Character.characterId+"&platform="+Character.platform+"&name="+Character.displayName;
    
    window.location.href = "/statsPage.html?membershipId="+Character.membershipId+"&characterId="+Character.characterId+"&platform="+Character.platform+"&name="+Character.displayName;
  
  });

}
