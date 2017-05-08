/*
*	Léopold Aziz GUEYE
*	lazizgueye@gmail.com
*/


/*
*	Initialized global variables
*/	
var interval_play = "";
var interval_moveBack = "";
var interval_moveForward = "";
var mute = false;
var page = "";
var video = "";
var video_full = false;




$(document).ready(function(){
	video = document.getElementById("video");
	video.load();
	video.volume = 0.8;
	page = document.getElementById("page");
	setTimeout(function(){showTime();}, 150);	
	//$("#time").html("<b><span style='color:red'>--:--</span> / --:--</b>");
	
	/*
	*	Play or Pause Button
	*	Intetrval allows to update the timer display
	*/
	$("#playPause").on('click', function(event){
		if (video.paused){
			video.play(); 
			interval_play = setInterval(function(){showTime() }, 100);
			$("#playPause").attr("src", "img/pause-icon.png");			
			$("#playPause").attr("title", "Pause");			
			
		}else{
			video.pause();
			clearInterval(interval_play);
			$("#playPause").attr("src", "img/play-icon.png");
		}
	});
	
	/*
	*	Reload, move back, move forward the video debut start
	*/
	$("#load").on('click', function(event){
		video.load();
		$("#playPause").attr("src", "img/play-icon.png");
		setTimeout(function(){showTime();}, 150);	
	});
	$("#moveBack").on('click', function(event){
		if(video.currentTime > 0)
			video.currentTime -= 1;
		else
			video.currentTime = 0;
		showTime();	
	});
	$("#moveBack").on('mousedown', function(event){
		interval_moveBack = setInterval(
								function(){
									if(video.currentTime > 0)
										video.currentTime -= 2;
									else
										video.currentTime = 0;
									showTime();
								}, 100);
	});
	$("#moveBack").on('mouseup', function(event){
		clearInterval(interval_moveBack);	
		showTime();	
	});
	$("#moveForward").on('click', function(event){
		if(video.currentTime < video.duration)
			video.currentTime += 1;
		else
			video.currentTime = video.duration;
		showTime();	
	});
	$("#moveForward").on('mousedown', function(event){
		interval_moveForward = setInterval(
								function(){
									if(video.currentTime < video.duration)
										video.currentTime += 2;
									else
										video.currentTime = video.duration;
									showTime();
								}, 100);
	});
	$("#moveForward").on('mouseup', function(event){
		clearInterval(interval_moveForward);
		showTime();			
	});
	
	/*
	*	Mute, down, up the volume
	*/	
	$("#mute").on('click', function(event){
		if(mute){
			mute = false;
			video.muted = false;
			$("#mute").attr("src", "img/mute-off.png");
		}else{
			mute = true;
			video.muted = true;
			$("#mute").attr("src", "img/mute-on.png");
		}
	});
	$("#volumeLow").on('click', function(event){
		if($("#volumeBar").val()>0){
			$("#volumeBar").val($("#volumeBar").val()-10);
			video.volume -= 0.1;
			$("#volumeBar").attr("title", $("#volumeBar").val()+"%");
		}
	});
	$("#volumePlus").on('click', function(event){
		if($("#volumeBar").val()<100){
			$("#volumeBar").val($("#volumeBar").val()+10);
			video.volume += 0.1;
			$("#volumeBar").attr("title", $("#volumeBar").val()+"%");
		}
	});
				
	/*
	*	Full Screen IN & OUT Mode Button
	*	differents FullScreens methode because depends on browser
	*/
	$("#fullScreen").on('click', function(event){
		//alert("page:"+$("#page").css("width") +" screen:"+ screen.width+" video:"+video.width+"&&"+ ($("#page").css("width") == (screen.width+"px")));
		if (video_full){			
			if (document.exitFullscreen) {
				document.exitFullscreen();
				video_full = false; 
			} else if (document.webkitExitFullscreen) {
				document.webkitExitFullscreen();
				video_full = false; 
			} else if (document.mozCancelFullScreen) {
				document.mozCancelFullScreen();
				video_full = false; 
			} else if (document.msExitFullscreen) {
				document.msExitFullscreen();
				video_full = false; 
			}		
		}else{			
			if (page.requestFullscreen) {
				page.requestFullscreen();		
				video_full = true;			  
			} else if (page.mozRequestFullScreen) {
				page.mozRequestFullScreen();
				video_full = true;
			} else if (page.webkitRequestFullscreen) {
				page.webkitRequestFullscreen();
				video_full = true;
			}else if (page.msRequestFullscreen) {
				page.msRequestFullscreen();
				video_full = true;
			}else{
				alert("Désolé !!! mais votre navigateur ne supporte pas cette option,\nVeuillez passer sous firefox.\nMerci");
			}
		}
	});
	
	/*
	*	Full Screen IN & OUT Mode Listerner
	*	change icon of fullscreen button
	*	change the video size
	*/
	$(window).resize(function(event){	
		//if(($("#page").css("width") == (screen.width+"px")) && video_full){
		if(document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement || document.fullScreenElement){
			$("#fullScreen").attr("src", "img/fullScreen-off.png");
			$("#fullScreen").attr("title", "Full Screen OUT");
			video.width = screen.width-40;
			$(".panelVideo").css("padding", "0");
			$(".footer").hide();			
		}else{
			$("#fullScreen").attr("src", "img/fullScreen-on.png");
			$("#fullScreen").attr("title", "Full Screen IN");			
			$(".panelVideo").css("padding", "5% 0");
			$("#video").attr("width", "50%");
			$("#video").attr("height", "auto");
			$(".footer").show();
			video_full = false;			
		}
	});
		
	/*
	*	Show or Hide the panelFooter (video buttons Controls)
	*	Hide only if full screen mode in
	*/	
	$(".panelFooter").hover(
		function(){
			$(".footer").show();
		},
		function(){
			if(video_full)
				$(".footer").hide();
		}
	);

	/*
	*	Show the current time and total duration of the video
	*/	
	function showTime(){
		$("#time").html("<b><span style='color:red'>"+parseTime(video.currentTime)+ "</span> / " + parseTime(video.duration)+"</b>");
		if(video.ended){			
			$("#playPause").attr("src", "img/play-icon.png");
			clearInterval(interval_play);
			clearInterval(interval_moveBack);
			clearInterval(interval_moveForward);
		}
	}	
	function parseTime(second){
		var time = parseFloat(second);
		if(time < 10)
			return "00:0"+(time+"").substr(0, 1);
		else if(time < 60)
			return "00:"+(time+"").substr(0, 2);
		else if(time < 600)
			return "0"+parseFloat(time/60).substr(0, 1)+":"+parseFloat(time/60).substr(2, 2);
		else if(time < 3600)
			return parseFloat(time/60).substr(0, 2)+":"+parseFloat(time/60).substr(3, 2);
		else if(time < 72000)
			return (time+"").substr(0, 3)+":"+(time+"").substr(4, 2);
		else
			return "00:00"
	}
	
	
});


