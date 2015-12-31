$( document ).ready(function() {
  $("#linkMAL").click(function() {
    getHTML();
  });

});

/*
* Gets the raw HTML of a users MAL list
* Created by Andrew Mitchell, 12/30/15
*/
function getHTML() { //TODO Make it dynamic for any user
  $.ajax({
       type: 'GET',
       url: "http://myanimelist.net/animelist/1597538520",
       dataType: 'html',
       success: function(data) {
        //  console.log(data);
          parse(data);

      }
  });
}
/*
* Creates a JSON object of a MAL anime list
* Created by Andrew Mitchell, 12/30/15
*/
function parse(MALhtml) {
  var wrapper = document.createElement("DIV");
  wrapper.innerHTML = MALhtml;
  $(wrapper).find('script').remove();
  $("#hidden").append(wrapper);
  setTimeout(function(){
  }, 1000);
  var ht = document.getElementsByClassName('header_title');
  var completedY = ht[1].children[0].getBoundingClientRect().top;
  var onHoldY = ht[2].children[0].getBoundingClientRect().top;
  var planToWatchY = ht[3].children[0].getBoundingClientRect().top;
  var anime = document.getElementsByClassName('animetitle');
  var i = 0;
  var watching = [];
  while(anime[i].children[0].getBoundingClientRect().top < completedY) {
    watching.push(anime[i].children[0].innerText);
    i++;
  }
  var completed = [];
  while(anime[i].children[0].getBoundingClientRect().top < onHoldY) {
    completed.push(anime[i].children[0].innerText);
    i++;
  }
  var onHold = [];
  while(anime[i].children[0].getBoundingClientRect().top < planToWatchY) {
    onHold.push(anime[i].children[0].innerText);
    i++;
  }
  var planToWatch = [];
  for (i;i<anime.length; i++) {
    planToWatch.push(anime[i].children[0].innerText);
  }
  var list = {};
  list.watching = watching;
  list.completed = completed;
  list.onHold = onHold;
  list.planToWatch = planToWatch;
  var jsonlist = JSON.stringify(list);
  writeToFile(jsonlist);
}

function writeToFile(json) {
  if (typeof(Storage) !== "undefined") {
    localStorage.setItem('MyAnimeList', json);
    console.log(json);
  } else {
    alert("Sorry, your browser does not support Web Storage...");
  }
}
