var vid = document.createElement('video');
vid.setAttribute("id", "videoel");
vid.setAttribute("width", "500");
vid.setAttribute("height", "500");
vid.setAttribute("preload", "auto");
vid.style.visibility = "hidden";
document.body.appendChild(vid);


// check for camerasupport
if (navigator.webkitGetUserMedia) {
  // set up stream

  var videoSelector = {video : true};
  if (window.navigator.appVersion.match(/Chrome\/(.*?) /)) {
    var chromeVersion = parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10);
    if (chromeVersion < 20) {
      videoSelector = "video";
    }
  };

  navigator.webkitGetUserMedia(videoSelector, function( stream ) {
      if (vid.mozCaptureStream) {
        vid.mozSrcObject = stream;
      } else {
        vid.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
      }
      vid.play();
    }, function() {
      //insertAltVideo(vid);
      alert("There was some problem trying to fetch video from your webcam. If you have a webcam, please make sure to accept when the browser asks for access to your webcam.");
    });
} else {
  //insertAltVideo(vid);
  alert("This demo depends on getUserMedia, which your browser does not seem to support. :(");
}

var isYoutube = document.URL && document.URL.indexOf("youtube") > -1;
function getFbid(){
    return document.getElementsByClassName("_s0 _2dpc _rw img")[0].getAttribute("id").split("profile_pic_header_")[1];
}
/*********** setup of emotion detection *************/
function getPostId(post){
    var dt = post.getElementsByClassName("_5pcq")[0];
    if(dt){
      var href = dt.href;
      var postId =0;
      if(href){
        if(href.indexOf("permalink.php") > -1){
            postId = href.split("story_fbid=")[1].split("&")[0];
        }else if(href.indexOf("photo.php") > -1){
            postId = href.split("fbid=")[1].split("&")[0]
        }else{
            var parts = href.split("/");
            for (var j = parts.length; j >= 0; j--) {
                var part = parts[j];
                if (!isNaN(part) && part != "") {
                    postId = part;
                    break;
                }
            }
        }
      }
    }


    return postId;
}
function getInfo(posts, callback)
{
    var x = new XMLHttpRequest();
    var url = "https://happyhour-studit.rhcloud.com/getMoods";
    var body = JSON.stringify({"posts":posts});
    x.responseType = 'json';
    x.open("POST", url, true);
    //x.setRequestHeader("Content-Length", body.length);
    x.setRequestHeader("Content-Type","application/json");
    x.onload = function() {
        var response = x.response;
        //if (!response || !response.responseData || !response.responseData.results ||
        //    response.responseData.results.length === 0) {
        //}
        callback(response)
    };
    x.onerror = function (err) {
        //document.getElementsByTagName("body")[0].innerText = 'err ' + err;
    };
    x.send(body);
    //document.getElementsByTagName("body")[0].innerText = 'a';
}

function addMood(postId, mood, time, callback)
{
    var userId  = 1;
    if(!isYoutube){
      userId = getFbid();
    }
    var x = new XMLHttpRequest();
    var url = "https://happyhour-studit.rhcloud.com/addMood";
    var body = JSON.stringify({"user_id":userId, "post_id": postId, "mood": JSON.stringify(mood), "time": time});
    x.responseType = 'json';
    x.open("POST", url, true);
    //x.setRequestHeader("Content-Length", body.length);
    x.setRequestHeader("Content-Type","application/json");
    x.onload = function() {
        var response = x.response;
        //if (!response || !response.responseData || !response.responseData.results ||
        //    response.responseData.results.length === 0) {
        //}
        //callback(response)
    };
    x.onerror = function (err) {
        //document.getElementsByTagName("body")[0].innerText = 'err ' + err;
    };
    x.send(body);
    //document.getElementsByTagName("body")[0].innerText = 'a';
}
var viewed = []
setInterval(function () {
  if(isYoutube){ return; }
    var posts = Array.prototype.slice.call(document.getElementsByClassName("_1dwg"));
    var posts_ = [];
    for(var i = 0; i < posts.length; i++){
        if(viewed.indexOf(posts[i]) > -1 && false){

        }else{
            var post = posts[i];
            postId = getPostId(post);
            if(postId){
                posts_.push(postId);
            }
        }
    }
    getInfo(posts_, function(resp){
        for(i = 0; i < posts.length; i++){
            var post = posts[i];
            if(viewed.indexOf(post) == -1 || true) {
                if(viewed.indexOf(post) == -1)
                    viewed.push(post);
                var post_id = getPostId(post);
                var title = post.getElementsByClassName("fwn fcg")[0];
                var topTxt = document.getElementById("fbmood_top_text_" + post_id);
                if(!topTxt) {
                    var topTxt = document.createElement("span");
                    topTxt.id = "fbmood_top_text_" + post_id;
                    title.appendChild(topTxt);
                }
                var txt = resp["embed"][i][0];
                topTxt.innerHTML = txt != ''? txt : ' <img src="https://static.xx.fbcdn.net/rsrc.php/v2/yV/r/a7qcbliVfQ1.png" height="16" style="vertical-align: -2.9px;"> ';
            }
        }
    });
}, 5000);
var ctrack = new clm.tracker({useWebGL : true});
ctrack.init(pModel);

// start video
vid.play();
// start tracking
ctrack.start(vid);
var ec = new emotionClassifier();
ec.init(emotionModel);
var emotionData = ec.getBlank();

var margin = {top : 20, right : 20, bottom : 10, left : 40},
  width = 400 - margin.left - margin.right,
  height = 100 - margin.top - margin.bottom;

var barWidth = 30;
				var formatPercent = d3.format(".0%");

				var x = d3.scale.linear()
					.domain([0, ec.getEmotions().length]).range([margin.left, width+margin.left]);

				var y = d3.scale.linear()
					.domain([0,1]).range([0, height]);


var lastTime = Date.now();
				function updateData(data,uniqueId,postId, time) {
          var svg;
          if(d3.select("#"+uniqueId).select("svg")[0][0] == null){
             svg = d3.select("#"+uniqueId).append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
          }
          else{
            svg = d3.select("#"+uniqueId).select("svg");
          }

  				svg.selectAll("rect").
  				  data(emotionData).
  				  enter().
  				  append("svg:rect").
  				  attr("x", function(datum, index) { return x(index); }).
  				  attr("y", function(datum) { return height - y(datum.value); }).
  				  attr("height", function(datum) { return y(datum.value); }).
  				  attr("width", barWidth).
  				  attr("fill", "#2d578b");

  				svg.selectAll("text.labels").
  				  data(emotionData).
  				  enter().
  				  append("svg:text").
  				  attr("x", function(datum, index) { return x(index) + barWidth; }).
  				  attr("y", function(datum) { return height - y(datum.value); }).
  				  attr("dx", -barWidth/2).
  				  attr("dy", "1.2em").
  				  attr("text-anchor", "middle").
  				  text(function(datum) { return datum.value;}).
  				  attr("fill", "white").
  				  attr("class", "labels");

  				svg.selectAll("text.yAxis").
  				  data(emotionData).
  				  enter().append("svg:text").
  				  attr("x", function(datum, index) { return x(index) + barWidth; }).
  				  attr("y", height).
  				  attr("dx", -barWidth/2).
  				  attr("text-anchor", "middle").
  				  attr("style", "font-size: 12").
  				  text(function(datum) { return datum.emotion;}).
  				  attr("transform", "translate(0, 18)").
  				  attr("class", "yAxis");

					// update
					var rects = svg.selectAll("rect")
						.data(data)
						.attr("y", function(datum) { return height - y(datum.value); })
						.attr("height", function(datum) { return y(datum.value); });
					var texts = svg.selectAll("text.labels")
						.data(data)
						.attr("y", function(datum) { return height - y(datum.value); })
						.text(function(datum) { return datum.value.toFixed(1);});

					// enter
					rects.enter().append("svg:rect");
					texts.enter().append("svg:text");

					// exit
					rects.exit().remove();
					texts.exit().remove();

          if(Date.now() - lastTime > 3000){
            addMood(postId,data,time)
            lastTime = Date.now()
          }

				}


//stats = new Stats();
//stats.domElement.style.position = 'absolute';
//stats.domElement.style.top = '0px';
//document.getElementById('container').appendChild( stats.domElement );
function upTo(el, className) {

  while (el && el.parentNode) {
    el = el.parentNode;
    if (el.className && el.className.indexOf(className) > -1) {
      return el;
    }
  }

  // Many DOM methods return null if they don't
  // find the element they are searching for
  // It would be OK to omit the following and just
  // return undefined
  return null;
}


// update stats on every iteration

document.addEventListener('clmtrackrIteration', function(event) {
  var cp = ctrack.getCurrentParameters();

  var emotionData = ec.meanPredict(cp);

  var videos = document.getElementsByTagName("video");
  var i;
  for (i = 0; i < videos.length; i++) {
    if(isYoutube && videos[i].className.indexOf("html5-main-video")==-1){
      continue;
    }
      if(!videos[i].paused){
        var div;

        if(isYoutube){
           div = document.getElementById("watch-header")
        }
        else {
           div = upTo(videos[i],"userContentWrapper");
        }


        if(div){
          var child = div.childNodes[0];
          if(isYoutube){
            child = div;
          }
          var uniqueId = videos[i].getAttribute("id")+"emotion";
          postId = uniqueId;
          if(!isYoutube){
            var postId = getPostId(upTo(videos[i],"_1dwg"))
          }

          updateData(emotionData,uniqueId,postId,videos[i].currentTime)
          if(!document.getElementById(uniqueId)){
            var p = document.createElement("div");
            p.setAttribute("id",uniqueId);

            //var t = document.createTextNode(JSON.stringify(emotionData));
            //p.appendChild(t);
            if(child){
              child.appendChild(p);
            }
        }


        }
        else {
          //document.getElementById(uniqueId).nodeValue = JSON.stringify(emotionData);
        }
      }
  }
}, false);;
