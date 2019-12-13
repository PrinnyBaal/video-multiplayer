
sheetProj.view.sheetLogic = {
  setupUserInterface: function () {
    //videoControl.getActivePlayers();
    videoControl.resizePlayers();
    window.addEventListener('resize', videoControl.resizePlayers);
    //searchSystem.sampleLoad();
    $(".displayChoice").change(uiSystem.displayChange);
    $("#languageSelector").click(uiSystem.displayLanguages);
    $("#infoIcon").click(uiSystem.displayInfo);
    $("#logo").click(uiSystem.displayInfo);
    $("#searchButton").click(searchSystem.searchByButton);
    $("#videoMax").change(searchSystem.setMaxPlayers);
    urlSystem.getURLVars();
    searchSystem.loadDropdowns();
    }
};

function testInput(){
  //let date= new Date("2019-10-04T16:57:00Z");
  //let minuteDate = new Date("1899-12-31T03:35:00.000Z");
  //let hourDate= new Date("1899-12-30T09:13:33.000Z");
  //searchSystem.searchDatabase();

  //searchSystem.searchByButton();




}

let videoControl={
  getActivePlayers:()=>{
    videoPlayers.length=0;
    FB.Event.subscribe('xfbml.ready', function(msg) {
      if (msg.type === 'video') {
        videoPlayers.push({player:msg.instance,
        duration:msg.instance.getDuration()});


      }
    });
  },
  playAll:()=>{
    videoPlayers.forEach((video)=>{
      video.player.play();
      console.log(video.player.getDuration());
    });
  },
  pauseAll:()=>{
    videoPlayers.forEach((video)=>{
      video.player.pause();

    });
  },
  fastForwardAll:()=>{

  },
  rewindAll:()=>{

  },
  resizePlayers:()=>{
    let newWidth=(document.getElementById('displayBox').offsetWidth*.9)/userPrefs.gridWidth;
    let newHeight;


    $( ".fb-video" ).css( "width", newWidth);

    // newHeight=$('.fb-video').height();
    // console.log(newHeight);
    // $(".videoResult").height(newHeight);
  },
  createPlayers:(videoDocs)=>{
    let displayHTML=``;
    $("#displayBox").html(``);

    videoPlayers.length=0;
    console.log(videoDocs);
    videoDocs.docs.forEach((video)=>{
      displayHTML+=`
      <div class="videoResult" id="video${video.id}">
        <div class="fb-video"
          data-href="${video.videoLink}"
          data-show-text="false"
          >
        </div>
        <div class="videoOverlay"><div class="arrangementBar"><button onclick="videoControl.removePlayer('video${video.id}', ${video.id})">X</button></div></div>
      </div>`
      // displayHTML+=`
      // <div class="videoResult">
      //   <div class="fb-video" data-href="${video.videoLink}" data-width="1000" data-show-text="false">
      //     <blockquote cite="https://developers.facebook.com/facebookapp/videos/10153231379946729/" class="fb-xfbml-parse-ignore">
      //     <a href="https://developers.facebook.com/facebookapp/videos/10153231379946729/">How to Share With Just Friends</a>
      //     <p>How to share with just friends.</p>
      //     Posted by <a href="https://www.facebook.com/facebookapp/">Facebook</a> on Friday, December 5, 2014</blockquote>
      //   </div>
      //   <div class="videoOverlay">
      //     <div class="arrangementBar"></div>
      //   </div>
      // </div>`;
    });

    $("#displayBox").html(displayHTML);
    FB.XFBML.parse()
    videoControl.getActivePlayers();
    videoControl.resizePlayers();

  },
  removePlayer:(htmlID, serverID)=>{
    let player=$(`#${htmlID}`)[0];
    player.parentNode.removeChild(player);
    searchSettings.ignoreList.push(parseInt(serverID));

  }
}

let uiSystem={
  displayChange:(event)=>{
    userPrefs.gridWidth=parseInt(event.target.value);
    videoControl.resizePlayers();
  },
  displayInfo:()=>{
    window.location.href = "http://info.melonyeah.com/";
  },
  displayLanguages:()=>{
    let elem = document.createElement('div');
    let languageSelect=`
      <div style="position:absolute; width:50vw; height: 80vh; top:10vh; left:25vw; background-color:pink;">
        <button class="closeButton" onclick="uiSystem.closeLanguageMenu()"></button>
        <button>English</button>
        <button>Chinese</button>
      </div>
    `;
    elem.className+=" overlay";
    elem.className+=" closableDiv";
    elem.className+=" closableDiv";
    elem.id="languageDisplay";
    elem.innerHTML=languageSelect;
    document.body.appendChild(elem);
  },
  closeLanguageMenu:()=>{
    let menu=$("#languageDisplay")[0];
    menu.parentNode.removeChild(menu);
  }

}

let searchSystem={
  setMaxPlayers:(event)=>{
    let newMax=Math.round(event.target.value);

    if (newMax<1){
      newMax=1;
    }else if(newMax>30){
      newMax=30;
    }

    event.target.value=newMax;
    userPrefs.maxPlayers=newMax;
  },
  sampleLoad:()=>{
    $.getJSON( "dataSample.json", function( data ) {
    sampleData=data;
  });
  },
  searchDatabase:(query, ignoreList)=>{
    let url="http://172.105.123.252/"+query;
    let proxyUrl = 'https://cors-anywhere.herokuapp.com/';
  //  targetUrl = 'http://catfacts-api.appspot.com/api/facts?number=99'
    fetch(proxyUrl + url)
    .then(blob => blob.json())
    .then(data => {
      console.table(data);

      //document.querySelector("pre").innerHTML = JSON.stringify(data, null, 2);
      if (ignoreList){
        data.response.docs=data.response.docs.filter((video)=>{  return !ignoreList.includes(video.id)});}
      videoControl.createPlayers(data.response);
      return data;
    })
    .catch(e => {
      console.log(e);
      return e;
    });

  },
  searchByButton:()=>{
    let timeStart=$("#startDateInput").val(),
      timeEnd=$("#endDateInput").val(),
      solrDate="videoDate:";
    let pageSearch=$("#sourceSelector").val(),
      solrPage="videoPage:";
    let locationSearch=$("#locationSelector").val(),
      solrLocation="videoLocation:";
    let query="";

    searchSettings.reset();
    if (timeStart){
      timeStart=new Date(timeStart);

      solrDate+=`[${timeStart.getFullYear()}-${timeStart.getMonth()+1}-${timeStart.getDate()}T${timeStart.getHours()}:${timeStart.getMinutes()}:00Z`;

      if (timeEnd){
        timeEnd=new Date(timeEnd);
        solrDate+=` TO ${timeEnd.getFullYear()}-${timeEnd.getMonth()+1}-${timeEnd.getDate()}T${timeEnd.getHours()}:${timeEnd.getMinutes()}:00Z]`;
      }else{
        solrDate+=` TO NOW]`;
      }
      searchSettings.time=solrDate;
      query+=solrDate;
    }
    if (pageSearch.length && !pageSearch.includes("NOFILTER")){
      pageSearch.forEach((page, index)=>{
        if (index>0){
          solrPage+=` OR `;
        }
        solrPage+=page;
      });

      if (query){
        query+=" AND ";
      }
      searchSettings.source=solrPage;
      query+=solrPage;

    }
    if (locationSearch.length && !locationSearch.includes("NOFILTER")){
      locationSearch.forEach((location, index)=>{
        if (index>0){
          solrLocation+=` OR `;
        }
        solrLocation+=location;
      });

      if (query){
        query+=" AND ";
      }
      searchSettings.location=solrLocation;
      query+=solrLocation;
    }

    query+=`&rows=${userPrefs.maxPlayers}`;



    //let descSearch="";


    searchSystem.searchDatabase(query);
  },
  searchByURL:(searchObj)=>{
    let query=``;
    let ignoreList=false;

    if (query){
      query+=" AND ";
    }

    if (searchObj.time){
      query+=searchObj.time;
    }
    if (searchObj.location){
      if (query){
        query+=" AND ";
      }
      query+=searchObj.location;
    }
    if (searchObj.source){
      if (query){
        query+=" AND ";
      }
      query+=searchObj.source;
    }
    if(searchObj.ignored){
      ignoreList=searchObj.ignored.split(",");

      ignoreList=ignoreList.filter((item)=>{return Boolean(item.length>0)});
    }
    if(searchObj.rows){
      query+=`&rows=${searchObj.rows}`;
    }

    console.log("urlSEARCH!");
    console.log(query);

    searchSystem.searchDatabase(query, ignoreList);
  },
  getVideoDuration:(videoURL)=>{

  },
  loadDropdowns:()=>{
    let url="http://172.105.123.252/videoPage:*&rows="+databaseUpperBound;
    let proxyUrl = 'https://cors-anywhere.herokuapp.com/';
  //  targetUrl = 'http://catfacts-api.appspot.com/api/facts?number=99'
    fetch(proxyUrl + url)
    .then(blob => blob.json())
    .then(data => {
      console.table(data);

      //document.querySelector("pre").innerHTML = JSON.stringify(data, null, 2);

      fillDropdowns(data.response.docs);
      return data;
    })
    .catch(e => {
      console.log(e);
      return e;
    });

    function fillDropdowns(docs){
      let sources=[],
        sourceOptions='<option value="NOFILTER">Don`t Filter</option>';
      let locations=[],
        locationOptions='<option value="NOFILTER">Don`t Filter</option>';

      //
      docs.forEach((video)=>{
        if (!sources.includes(video.videoPage)){
          sources.push(video.videoPage);
          sourceOptions+=`<option value="${video.videoPage}">${video.videoPage}</option>`;

        }
        video.videoLocation.forEach((location)=>{
          if (!locations.includes(location)){
            locations.push(location);
            locationOptions+=`<option value="${location}">${location}</option>`;
          }
        });

      });




      $("#locationSelector").html(locationOptions);
      $("#sourceSelector").html(sourceOptions);

    }
  }
}

let urlSystem={
  getURLVars:()=>{
    //https://html-online.com/articles/get-url-parameters-javascript/
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    if (vars.search){
      searchSystem.searchByURL(vars);
    }
    console.log(vars);
  },
  getSeededURL:()=>{
    let finalURL=siteURL;
    finalURL+="?search=true";

    if (searchSettings.time){
      finalURL+=`&?time=${searchSettings.time}`;
    }
    if (searchSettings.location){
      finalURL+=`&?location=${searchSettings.location}`;
    }
    if (searchSettings.source){
      finalURL+=`&?source=${searchSettings.source}`;
    }
    if(searchSettings.ignoreList){
      finalURL+=`&?ignored=`;
      searchSettings.ignoreList.forEach((ignored)=>{
        finalURL+=`${ignored},`;

      });
    }

    finalURL+=`&?rows=${userPrefs.maxPlayers}`;

    return finalURL;
  },
  copySearchResult:()=>{
    ci.copyToClipboard(urlSystem.getSeededURL());
  }


}
