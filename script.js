
var viewed = [];


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
    var x = new XMLHttpRequest();
    var url = "https://happyhour-studit.rhcloud.com/addMood";
    var body = JSON.stringify({"user_id":getFbid(), "post_id": postId, "mood": mood, "time": time});
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

function getFbid(){
    return document.getElementsByClassName("_s0 _2dpc _rw img")[0].getAttribute("id").split("profile_pic_header_")[1];
}

function getPostId(post){
    var dt = post.getElementsByClassName("_5pcq")[0];
    var href = dt.href;
    var postId;
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
    return postId;
}

setInterval(function () {
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
        log(JSON.stringify(resp));
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
                topTxt.innerHTML = txt != ''? txt : ' <img src="https://static.xx.fbcdn.net/rsrc.php/v2/yV/r/a7qcbliVfQ1.png" height="16" style="vertical-align: -2.9px;"> ' + post_id;
            }
        }
    });
}, 1000);



function log(str) {
    var script = document.createElement("script");
    script.textContent = "console.log('" + str + "');";
    (document.head || document.documentElement).appendChild(script);
    script.parentNode.removeChild(script);
}
