var playerUrl;
var id;
var player;
var deviceWidth;
var deviceHeight;
var done;

$(function() {
    deviceWidth = $(window).width();
    deviceHeight = $(window).height();
    
    console.log("width="+deviceWidth+" height="+deviceHeight);
        
});

function search(){

    $("#icon").css("display","none");
    var page = 1;  //サムネイル候補の１番目の動画を表示させる 
    var pageSize = 2;   //サムネイル表示数
    var query = $('#txtQuery').val();
    query = document.song_select.song.value;
    console.log(query);

    var time = 'all_time';  
    var url = 'http://gdata.youtube.com/feeds/api/videos?start-index={page}&max-results={pageSize}&orderby=relevance&callback=?';  
    
    console.log(url);
    var url2 = url.replace('{page}', page).replace('{pageSize}', pageSize);  
    var params = {  
    	v: '2',  
        q: query,  
        alt: 'json-in-script',  // atom, rss, json, json-in-script(jsonp)  
        format: '1'             // 1-mobile, 5-swf, 6-mobile rtsp  
    }  

  
    console.log(params);
    $.getJSON(url2, params, function (data) {  
    	var feed = data.feed;  
        var entries = feed.entry || [];  
        var html = ['<ul>'];  
        $.each(data.feed.entry, function (i, item) {  
            var vid = item.media$group.yt$videoid.$t;  
            var title = item.title.$t;  
            var url = item.content.src;  
            var thumbnailUrl = item.media$group.media$thumbnail[0].url;                 
            playerUrl = item.media$group.media$content[0].url;
                        
            console.log(playerUrl);
            html.push('<li><a href="javascript:loadVideo(\'',playerUrl,'\',true)"title="',title,'"><img src="',thumbnailUrl,'"/></a></li>');
	});
	
        html.push('</ul>');  
       	$('#player').html(html.join(''));  
        if (entries.length > 0) {  
            loadVideo(entries[0].media$group.media$content[0].url, true);  
            $('#playerContainer').show();  
	}  
	
	var url = playerUrl;
	
        var str = url.match(/[\/?=]([a-zA-Z0-9]{11})[&\?]?/);
	console.log(str);
	id = str[1];
        console.log(id);  
        if(player == null){
            var tag = document.createElement('script'); 
            tag.src = "http://www.youtube.com/player_api"; 
            var firstScriptTag = document.getElementsByTagName('script')[0]; 
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag); 
            done = false; 

        } else {
            player.loadVideoById(id);
        }
	

    });      
    
}


var xmlHttp;
function plus(){
    frm1.result.value = (eval(year_select.year.value) + eval(grade_select.grade.value));
    if (window.XMLHttpRequest){
	xmlHttp = new XMLHttpRequest();
    }else{
	if (window.ActiveXObject){
	    xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
	}else{
	    xmlHttp = null;
	}
    }
    xmlHttp.onreadystatechange = checkStatus;
    xmlHttp.open("GET",frm1.result.value+'.txt' , true);
    xmlHttp.send(null);
}

function checkStatus(){
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
	var ItemList = xmlHttp.responseText;
	var ItemLists = ItemList.split(/\n/);
	with(document.getElementById("txtQuery")){
	    options.size = 3; //リストの表示行数
	    options.length = ItemLists.length;
	    for (i=0; i<ItemLists.length; i++){
		options[i].text = ItemLists[i]; options[i].value=ItemLists[i];
	    }
	}
    }
}

function loadVideo(playerUrl, autoplay) {  
    swfobject.embedSWF(playerUrl+'&rel=1&border=0&fs=1&autoplay='+(autoplay?1:0),'player','290','250','9.0.0',false,false,{allowfullscreen:'true'});// 290 x 250  
}    

function onYouTubePlayerAPIReady() {
    console.log("onYoutubePlayerAPIReady");
    player = new YT.Player('player', {
        height: deviceWidth * 0.75,
        width: deviceWidth,
        videoId: id, 
        events: { 
            'onReady': onPlayerReady, 
            'onStateChange': onPlayerStateChange 
        } 
    });
}
    
function onPlayerReady(evt) {
    evt.target.playVideo();
}

function onPlayerStateChange(evt) { 
    if (evt.data == YT.PlayerState.PLAYING && !done) {
	done = true;
    }
}
