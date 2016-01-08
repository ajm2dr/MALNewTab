var AnimeList;
var loggedin = false;
var selectedWatching = 0;
var selectedCompleted = 0;
var selectedOnHold = 0;
var selectedPlanToWatch = 0;
var scrollWatching = 0;
var scrollCompleted = 0;
var scrollOnHold = 0;
var scrollPlanToWatch = 0;

var clicky;
$(document).mousedown(function(e) {
      // The latest element clicked
      clicky = $(e.target);
});

$( document ).ready(function() {
  getImage();
  AnimeList = JSON.parse(localStorage.getItem("MyAnimeList"));
  loggedin = localStorage.getItem("loggedin");
  if (localStorage.getItem("open") == "open" || localStorage.getItem("open") == null) {
  //  console.log("open");
    if (AnimeList == null) {
      console.log("no previous list found");
      loggedin = false;
      localStorage.setItem("loggedin", loggedin);
      $("#link").show();
    } else if(loggedin){
      $(".list_button").show();
      $("#logout").show();
      $("#logout").unbind("click");
      $("#logout").click(function(e) {
    //    console.log("clicked");
        e.stopPropagation();
        loggedin = false;
        localStorage.setItem("loggedin", loggedin);
        localStorage.setItem("MyAnimeList", null);
        $("#logout").hide();
        resetList();
      });
      fillTable();
    }
    $("#list_container").css("width","40%");
    $("#list_tab").css("left","40%");
    $(".list_element").show();
    $(".button_text").show();
    $("#arrow_icon").attr("src","x_icon.png");
    $("#list_tab").click(function() {
      click_open();
    });
  } else if (localStorage.getItem("open") == "closed"){
    //console.log("closed");
    if (AnimeList == null) {
      console.log("no previous list found");
      loggedin = false;
      localStorage.setItem("loggedin", loggedin);
    } else if(loggedin){
      $(".list_button").show();
      $("#logout").unbind("click");
      $("#logout").click(function(e) {
    //    console.log("clicked");
        e.stopPropagation();
        loggedin = false;
        localStorage.setItem("loggedin", loggedin);
        localStorage.setItem("MyAnimeList", null);
        $("#logout").hide();
        resetList();
      });
      fillTable();
    }
    $(".list_element").hide();
    $(".button_text").hide();
    $("#list_container").css("width","0");
    $("#list_tab").css("left","0");
    $("#arrow_icon").attr("src","stack_icon.png");
    $("#list_tab").click(function() {
      click_close();
    });
  }
  $(".list_button").click(function() {
    click_unselected($(this));
  });

  $("#link").click(function() {
    $("#linkmal").hide();
    $("#username").show();
    $("#submit").show();
    $("#username").focus();
    $("#username").blur(function(e){
      var id = clicky.attr('id');
      if (id == "submit" || id == "link") {

      } else {
        resetList();
      }
    });
    $('#username').keypress(function (e) {
      if (e.which == 13) {
    //    console.log($("#username").val());
        $("#username").unbind("blur");
        if ($("#username").val() != "") {
          getHTML($("#username").val());
        }
        return false;    //<---- Add this line
      }
    });
    $("#submit").click(function(){
    //    console.log($("#username").val());
      $("#username").unbind("blur");
      if ($("#username").val() != "") {
        getHTML($("#username").val());
      }
      return false;    //<---- Add this line
    });
  });
  $("#picture_info").click(function() {
    window.open("http://www.google.com/?nord=1#nord=1&q="+$(this).text()+"&btnK=Google+Search");
  });
});

var imgs;

function getImage() {
  var link = localStorage.getItem("link");
  var picture_info = localStorage.getItem("picture_info");
  var picture_time =JSON.parse(localStorage.getItem("picture_time"));
//  console.log(picture_time);
  if (!(picture_time == null)) {
    var today = new Date();
    var year = today.getFullYear();
    var month = today.getMonth();
    var day= today.getDate();
    var hour = today.getHours();
    var minutes = today.getMinutes();
    var timeout = false;
    if (year > picture_time.year || month > picture_time.month || day > picture_time.day || (hour*60+minutes > picture_time.hour*60+picture_time.minutes+15)) {
      console.log("timeout");
      timeout = true;
    }
  }
  if ((link == null && picture_info == null) || timeout) {
  //  alert(link);
    var imgur = {};
    $.ajax({
      type: "GET",
      url: "https://api.imgur.com/3/album/Xbfuw",
      dataType: "text",
      beforeSend: function(xhr) {
          xhr.setRequestHeader('Authorization', 'Client-ID 70676d07e838765');
      },
      success: function(data) {
        imgur= $.parseJSON(data);
        //console.log(imgur);
        imgs=[imgur.data.images_count];
        for (var i = 0; i < imgur.data.images_count; i++) {
          imgs[i] = imgur.data.images[i];
        }
        pickImage(imgur.data.images_count);
      }
    });
  } else {
    $("#picture").attr("src", link);
    $("#picture_info").text(picture_info);
  }
}

function pickImage(num_images) {
  var index = Math.floor((Math.random() * num_images));
  var link = imgs[index].link;
  var picture_info = imgs[index].title;
  $("#picture").attr("src", link);
  $("#picture_info").text(imgs[index].title);
  Date.prototype.addHours = function() {
   this.setTime(this.getTime() + (60*60*1000));
   return this;
  }
  var today = new Date();
  var date = {}
  date.year = today.getFullYear();
  date.month = today.getMonth();
  date.day= today.getDate();
  date.hour = today.getHours();
  date.minutes = today.getMinutes();
  localStorage.setItem("picture_time", JSON.stringify(date));
  localStorage.setItem("link", link);
  localStorage.setItem("picture_info", picture_info);
}

function findSelected() {
  return $(".list_button.selected")[0].innerText;
}

function click_unselected(button) {
  var selected = findSelected();
  if (selected == "Watching") {
    selectedWatching = $(".selected_anime").eq(0).attr('id');
      scrollWatching = $("#list").scrollTop();;
  //  console.log(selectedWatching);
  } else if (selected == "Completed") {
    selectedCompleted = $(".selected_anime").eq(0).attr('id');
      scrollCompleted = $("#list").scrollTop();
  //  console.log(selectedCompleted);
  } else if (selected == "On Hold") {
    selectedOnHold = $(".selected_anime").eq(0).attr('id');
      scrollOnHold = $("#list").scrollTop();
  //  console.log(selectedOnHold);
  } else if (selected == "Plan to Watch") {
    selectedPlanToWatch = $(".selected_anime").eq(0).attr('id');
      scrollPlanToWatch = $("#list").scrollTop();
  //  console.log(selectedPlanToWatch);
  }
  $(".list_button.selected").removeClass("selected");
  button.addClass("selected");
  button.removeClass("unselected");
  fillTable();
}

function click_open() {
  if (!loggedin) {
    $("#link").hide();
  }
  localStorage.setItem("open", "closed");
//  console.log(localStorage.getItem("open"));
  $(".list_element").hide();
  $(".button_text").hide();
  $("#list_container").animate({width:'0'},200);
  $("#list_tab").animate({left:'0'},200);
  $("#logout").hide();
  setTimeout(function(){
  }, 1000);
  $("#list_tab").unbind("click");
  $("#arrow_icon").attr("src","stack_icon.png");
  $("#list_tab").click(function() {
    click_close();
  });
}

function click_close() {
  if (!loggedin || AnimeList == null) {
    $("#link").fadeIn();
  } else {
    $("#logout").show();
  }
  localStorage.setItem("open", "open");
  $(".list_element").show();
  $(".button_text").show();
  $("#list_container").animate({width:'40%'},200);
  $("#list_tab").animate({left:'40%'},200);

  setTimeout(function(){
  }, 1000);
  $("#list_tab").unbind("click");
  $("#arrow_icon").attr("src","x_icon.png");
  $("#list_tab").click(function() {
    click_open();
  });
}


function fillTable() {
  $("#list").empty();
  var num_watching = AnimeList.watching.length;
  var num_completed = AnimeList.completed.length;
  var num_onHold = AnimeList.onHold.length;
  var num_plannedToWatch = AnimeList.planToWatch.length;
//  console.log(num_watching + " " + num_completed + " " + num_onHold + " " + num_plannedToWatch);
  var title = "";
  var selected = findSelected();
  var progress= "";
  if (selected == "Watching") {
    $("#list").append('<div style="color: black" class = "name">ANIME TITLE</div><div style="color: black" class = "episode">PROGRESS</div>');
    for (var i = 0; i < num_watching; i++) {
      title = AnimeList.watching[i];
      progress= AnimeList.progress[i];
      $("#list").append('<div class="list_element" id="'+i+'"><div class = "name">'+title+'</div><div class = "episode">'+progress+'</div></div>');
    }
    $(".list_element").eq(selectedWatching).children().addClass("selected");
    $(".list_element").eq(selectedWatching).addClass("selected_anime");
    $(".list_element").click(function() {
      $(".name.selected").removeClass("selected");
      $(".episode.selected").removeClass("selected");
      $(".selected_anime").removeClass("selected_anime");
      $(this).addClass("selected_anime");
      $(this).children().addClass("selected");
      selectedWatching = $(".selected_anime").eq(0).attr('id');
      scrollWatching = $("#list").scrollTop();
    });
  $("#list").scrollTop(scrollWatching);
  } else if (selected == "Completed") {
    $("#list").append('<div style="color: black" class = "name">ANIME TITLE</div><div style="color: black" class = "episode">SCORE</div>');
    var score = "";
    for (var i = 0; i < num_completed; i++) {
      title = AnimeList.completed[i];
      score = AnimeList.score[i];
      $("#list").append('<div class="list_element" id="'+i+'"><div class = "name">'+title+'</div><div class = "episode">'+score+'/10</div></div>');
    }
    $(".list_element").eq(selectedCompleted).children().addClass("selected");
    $(".list_element").eq(selectedCompleted).addClass("selected_anime");
    $(".list_element").click(function() {
      $(".name.selected").removeClass("selected");
      $(".episode.selected").removeClass("selected");
      $(".selected_anime").removeClass("selected_anime");
      $(this).addClass("selected_anime");
      $(this).children().addClass("selected");
      selectedCompleted = $(".selected_anime").eq(0).attr('id');
      scrollCompleted = $("#list").scrollTop();
  //    console.log(scrollCompleted);
    });
    $("#list").scrollTop(scrollCompleted);
  } else if (selected == "On Hold") {
    $("#list").append('<div style="color: black" class = "name">ANIME TITLE</div><div style="color: black" class = "episode">PROGRESS</div>');
    var progressOnHold = "";
    for (var i = 0; i < num_onHold; i++) {
      title = AnimeList.onHold[i];
      progressOnHold = AnimeList.progressOnHold[i];
      $("#list").append('<div class="list_element" id="'+i+'"><div class = "name">'+title+'</div><div class = "episode">'+progressOnHold+'</div></div>');
    }
    $(".list_element").eq(selectedOnHold).children().addClass("selected");
    $(".list_element").eq(selectedOnHold).addClass("selected_anime");
    $(".list_element").click(function() {
      $(".name.selected").removeClass("selected");
      $(".episode.selected").removeClass("selected");
      $(".selected_anime").removeClass("selected_anime");
      $(this).addClass("selected_anime");
      $(this).children().addClass("selected");
      selectedOnHold = $(".selected_anime").eq(0).attr('id');
      scrollCompleted = $("#list").scrollTop();
    });
    $("#list").scrollTop(scrollOnHold);
  } else if (selected == "Plan to Watch") {
    $("#list").append('<div style="color: black" class = "name">ANIME TITLE</div><div style="color: black" class = "episode">PROGRESS</div>');
    var progress = "";
    for (var i = 0; i < num_plannedToWatch; i++) {
      title = AnimeList.planToWatch[i];
      progress = AnimeList.numEps[i];
      $("#list").append('<div class="list_element" id="'+i+'"><div class = "name">'+title+'</div><div class = "episode">'+progress+'</div></div>');
    }
    $(".list_element").eq(selectedPlanToWatch).children().addClass("selected");
    $(".list_element").eq(selectedPlanToWatch).addClass("selected_anime");
    $(".list_element").click(function() {
      $(".name.selected").removeClass("selected");
      $(".episode.selected").removeClass("selected");
      $(".selected_anime").removeClass("selected_anime");
      $(this).addClass("selected_anime");
      $(this).children().addClass("selected");
      selectedPlanToWatch = $(".selected_anime").eq(0).attr('id');
      scrollPlanToWatch = $("#list").scrollTop();
    });
    $("#list").scrollTop(scrollPlanToWatch);
  }
}


/*
* Gets the raw HTML of a users MAL list
* Created by Andrew Mitchell, 12/30/15
*/
function getHTML(username) { //TODO Make it dynamic for any user
  $.ajax({
       type: 'GET',
       url: "http://myanimelist.net/animelist/"+username,
       dataType: 'html',
       success: function(data) {
      //    console.log(data);
          parse(data);
      }
  });
}
/*
* Creates a JSON object of a MAL anime list
* Created by Andrew Mitchell, 12/30/15
*/
function parse(MALhtml) {
  //console.log(MALhtml);
  var wrapper = document.createElement("DIV");
  wrapper.innerHTML = MALhtml;
  $(wrapper).find('script').remove();
  $("#hidden").append(wrapper);
  setTimeout(function(){
  }, 1000);
  if ($(".badresult").eq(0).length) {
      $("#error").show();
      $("#username").focus();
      $("#username").unbind("click");
      $("#username").unbind("keypress");
      $("#submit").unbind("click");
      $("#username").blur(function(e){
        var id = clicky.attr("id");
        if (id == "submit" || id == "link") {

        } else {
          resetList();
        }
      });
      $('#username').keypress(function (e) {
        if (e.which == 13) {
      //    console.log($("#username").val());
          $("#username").unbind("blur");
          if ($("#username").val() != "") {
            getHTML($("#username").val());
          }
          return false;    //<---- Add this line
        }
      });
      $("#submit").click(function(){
      //    console.log($("#username").val());
        $("#username").unbind("blur");
        if ($("#username").val() != "") {
          getHTML($("#username").val());
        }
        return false;    //<---- Add this line
      });
      $("#hidden").empty();
  } else {
  $("#username").val("");
  $("#error").hide();
  $("#link").hide();
  $(".list_button").show();
  var ht = document.getElementsByClassName('header_title');
  var completedY = ht[1].children[0].getBoundingClientRect().top;
  var onHoldY = ht[2].children[0].getBoundingClientRect().top;
  var planToWatchY = ht[3].children[0].getBoundingClientRect().top;
  var anime = document.getElementsByClassName('animetitle');
  //console.log(anime);
  var i = 0;
  var watching = [];
  var progress = [];
  while(anime[i].children[0].getBoundingClientRect().top < completedY) {
    watching.push(anime[i].children[0].innerText);
    progress.push(anime[i].parentElement.parentElement.children[4].innerText);
    i++;
  }
  var completed = [];
  var score = [];
  while(anime[i].children[0].getBoundingClientRect().top < onHoldY) {
    completed.push(anime[i].children[0].innerText);
    score.push(anime[i].parentElement.parentElement.children[2].innerText);
    i++;
  }
  var onHold = [];
  var progressOnHold = [];
  while(anime[i].children[0].getBoundingClientRect().top < planToWatchY) {
    onHold.push(anime[i].children[0].innerText);
    progressOnHold.push(anime[i].parentElement.parentElement.children[4].innerText);
    i++;
  }
  var planToWatch = [];
  var numEps = [];
  for (i;i<anime.length; i++) {
    planToWatch.push(anime[i].children[0].innerText);
    numEps.push(anime[i].parentElement.parentElement.children[4].innerText);
  }
  var list = {};
  list.watching = watching;
  list.progress = progress;
  list.completed = completed;
  list.score = score;
  list.onHold = onHold;
  list.progressOnHold = progressOnHold;
  list.planToWatch = planToWatch;
  list.numEps = numEps;
  //console.log(list);
  AnimeList=list;
  var jsonlist = JSON.stringify(list);
  writeToFile(jsonlist);
  }
}

function writeToFile(json) {
  if (typeof(Storage) !== "undefined") {
    localStorage.setItem('MyAnimeList', json);
    loggedin = true;
    localStorage.setItem("loggedin", loggedin);
    $("#logout").show();
    $("#logout").click(function(e) {
    //  console.log("clicked");
      e.stopPropagation();
      loggedin = false;
      localStorage.setItem("loggedin", loggedin);
      localStorage.setItem("MyAnimeList", null);
      $("#logout").hide();
      resetList();
    });
  //  console.log(json);
  } else {
    alert("Sorry, your browser does not support Web Storage...");
  }
  $("#hidden").empty();
  fillTable();
}

function resetList() {
  $("#list").empty();
  $(".list_button").hide();
      $("#error").hide();
  $("#link").show();
  $("#username").hide();
  $("#submit").hide();
  $("#linkmal").show();
}
