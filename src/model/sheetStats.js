

// if (localStorage.getItem("savedChars") === null) {
//   localStorage.setItem('savedChars', JSON.stringify(savedChars));
// }
//
// if (localStorage.getItem("activeChar") === null) {
//   localStorage.setItem('activeChar', 0);
// }

// TODO:
//
//
// Position Page
// Create Landing Explanation
// Fill dropdowns (need way to query entire server for a column of info first)
// Loading Prompt when videos are getting ready
// Write and Display Search Tips when no results are found
// Wire all text to use selected language node system
//
// Create Icons for:
// (Need Logo) DONE!
// Play button DONE!
// Pause Button DONE!
// Calendar DONE!
// Clock DONE!
// Up/down ticks on Clock DONE!
// Display Option icons DONE!
//
// Final Aesthetic Pass:
// Goal: Black/white/Green palette, I'm thinking a modern adn simplistic with just a touuch of cyberpunk seems about right
// Try to give the feeling of the videos representing a bank of cctv camera feeds




const siteURL="prinnybaal.github.io/video-multiplayer/";
const databaseUpperBound=2500;
let videoPlayers=[];
let userPrefs={
  gridWidth:3,
  language:"english",
  maxPlayers:10

};
let searchSettings={
  time:false, //time or time range that must be accounted for in videos (videos will start at this time when playback is selected)
  location:false, //dropdown multiple select, refers to physical locations
  source:false, //dropdown multiple select, refers to page that video is sourced from
  ignoreList:[75, 8],
  reset:()=>{
    console.log(searchSettings);
    searchSettings.time=false;
    searchSettings.location=false;
    searchSettings.source=false;
    searchSettings.ignoreList=[];
    console.log(searchSettings);
  }
}
let sampleData;

let languageOptions={
  english:{

  },
}

let ci={

  array_move:function(arr, old_index, new_index) {
    //https://stackoverflow.com/questions/5306680/move-an-array-element-from-one-array-position-to-another
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; // for testing
  },
  checkCommonGround:function(array1, array2){
    //tests if array1 and 2 have ANY elements in common
    let commonGround=false;
    if (array1.length<array2.length){
      for (let i=0, len=array1.length; i<len; i++){
        if (array2.includes(array1[i])){commonGround=true; break;}
      }
    }else{
      for (let i=0, len=array2.length; i<len; i++){
        if (array1.includes(array2[i])){commonGround=true; break;}
      }
    }

    return commonGround;
  },
  copyToClipboard:(copyText)=>{



   /* Select the text field */
   let copyContainer;
   //create a holder input for our text
   let elem = document.createElement('input');
    elem.id="tempInput";
    elem.style.cssText = 'position:absolute;opacity:0;';
    document.body.appendChild(elem);
    elem.value=copyText;


   //select text, then copy to clipboard
   copyContainer = document.querySelector("#tempInput");
    copyContainer.select();

   document.execCommand("copy");
    copyContainer.parentNode.removeChild(copyContainer);


   /* Alert the user of the copied text */
   ci.fyiUser("Link copied to clipboard!");
 },
 fyiUser:(text)=>{
   $("#alertBanner").removeClass("activeAlert");
   $("#alertBanner").html(text);
   $("#alertBanner").addClass("activeAlert");
   setTimeout(removeBanner, 5000)

   function removeBanner(){
     $("#alertBanner").removeClass("activeAlert");
   }
 }
}

function resetStorage(){
  if (window.confirm("Do you really want to delete all your saved info?")) {
  localStorage.clear();
  location.reload();
}
}
