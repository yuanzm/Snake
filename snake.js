$(function() {
	//click the button to start the game.
	$("#start").click(function() {
		pressCode[0] = 40;
		createEgg();
	});

	/*
	 Initialize the game:
	 	Set the game interface as a rectangle with 50 columns and 30 rows.
	 	Set the color of eggs with seven random color;
	 	Set the speed of the initial snake; 
	 	Create a new snake with length 1 in the game interface randomly;
	 	*/

	 	var $viewWidth = parseInt($("#game-content").css("width"));
	 	var $stepWidth =  $viewWidth / 50,
	 	$stepHeight = $stepWidth;
	 	$("#game-content").css("height",$stepWidth * 30);
	 	var eggColor = ['#fff','green','yellow','#FF6600','#CCCCFF','#00CCFF','#FFB7DD'];
	 	var eggColor = ['#fff','green','yellow','#FF6600','#CCCCFF','#00CCFF','#FFB7DD'],colorIndex = 0;
	 	var colorIndex = parseInt(Math.random()*6),
	 	marginLeft = parseInt(Math.random() * 50) * $stepWidth + "px",
	 	marginTop = parseInt(Math.random() * 15) * $stepHeight + "px";
	 	$("#game-content").append("<div class = 'snake'></div>");
	 	$(".snake:first").css({
	 		"background-color" : eggColor[colorIndex],
	 		"width" : $stepWidth,
	 		"height" : $stepHeight,
	 		"margin-left" : marginLeft,
	 		"margin-top" : marginTop,
	 		"position" : "absolute"
	 	});
	 	var speed = 150;

	 	var detect = setInterval(eatEgg,speed);
	 	var record = setInterval(recordHeadPosition,speed);
	/*
	  A function to change the system float number into decimal with two places; 
	  */
	  function toDecimal2(x) {  
	  	var f = parseFloat(x);  
	  	if (isNaN(f)) {  
	  		return false;  
	  	}  
	  	var f = Math.round(x*100)/100;  
	  	var s = f.toString();  
	  	var rs = s.indexOf('.');  
	  	if (rs < 0) {  
	  		rs = s.length;  
	  		s += '.';  
	  	}  
	  	while (s.length <= rs + 2) {  
	  		s += '0';  
	  	}  
	  	return s;  
	  }  

	/*
	  To detemine the state of the game,we should record the position of the snake
	  at any time.First,we need to create a two-dimensional array record the 
	  position coordinates in the form of float point number to detemine the action 
	  of the snake.However,there a problem with the float point precision when compare
	  the size of two float point numbers.So,it is necessary to create another two-
	  dimensional array to record the position coordinates  in the form of decimal 
	  with two places  in order to compare two float point numbers.Besides,we should 
	  also creat two arrays in two kinds of form mentioned above to record the position
	  coordinate of the head.
	  */

	var position = new Array(); //two-dimensional array in the form of float point number;
	var realPosition = new Array(); //two-dimensional array in the form of decimal with 2 places;

	var marginleft = parseFloat($(".snake:first").css("margin-left")),
	margintop = parseFloat($(".snake:first").css("margin-top"));
	var currentHead = [marginleft,margintop]; //An array to record the head position coordinate in the form of float point number;
	position.push(currentHead);	
	var realHead = new Array();//An array to record the head position coordinate in the form decimal number with 2 places;

	//A function to record the head node position
	function recordHeadPosition() {
		var l = toDecimal2(parseFloat($(".snake:first").css("margin-left")));
		var r = toDecimal2(parseFloat($(".snake:first").css("margin-top")));
		realHead = [l,r];
	}
	function recordPosition() {
		position = [];
		realPosition = [];
		$(".snake").each(function() {
			var newPosition = []
			var left = parseFloat($(this).css("margin-left"));
			var top = parseFloat($(this).css("margin-top"));
			var a = toDecimal2(left);
			var b = toDecimal2(top);
			var realP = [a,b];
			var fposition = [left,top];
			position.push(fposition);
			realPosition.push(realP);
		});
	}
	/*
	  In order to change the move direction of the snake
	  */
	  var pressCode = new Array(1);
	  pressCode[0] = 0;
	  document.onkeydown = getCharCode;
	  function getCharCode(event) {
	  	var key = event.keyCode;
	  	if(key == 37 || key == 38 || key == 39 || key == 40){
	  		pressCode[0] = key;
	  	}
	  }

	/*
	  To impletement the function of movement,it is incorrect to move the position of snake
	   really,but add a node in front of the head node and remove the tail node.
	   */ 

	   function moveDirection(pressCode) {
	   	if(pressCode == 37) {
	   		currentHead[0] -= $stepWidth; 
	   	}
	   	if(pressCode == 38) {
	   		currentHead[1] -= $stepWidth;
	   	}
	   	if(pressCode == 39) {
	   		currentHead[0] += $stepWidth;
	   	}
	   	if(pressCode == 40) {
	   		currentHead[1] += $stepWidth;
	   	}
	   	gameOverCondition();
	   	var headColor = $(".snake:first").css("background-color");
	   	if(pressCode == 37 || pressCode == 38 || pressCode == 39 || pressCode == 40){
	   		$("#game-content").append("<div class = 'snake'></div>");
	   		$(".snake:last").css({
	   			"background-color" : headColor,
	   			"width" : $stepWidth,
	   			"height" : $stepHeight,
	   			"margin-left" : currentHead[0],
	   			"margin-top" : currentHead[1],
	   			"position" : "absolute"
	   		});
	   		$(".snake:first").remove();
	   	}
	   }
	   var move = setInterval(moveDirection,speed,pressCode);

	/*
	  When the snake eat the egg exists on the game interface,we should create a new egg 
	  randomly. To creat an egg,we need to ensure that the newly created egg won't coincide
	  with the snake.
	  */
	  function createEgg() {
	  	var colorIndex = parseInt(Math.random()*6),
	  	marginLeft = parseInt(Math.random() * 50) * $stepWidth + "px",
	  	marginTop = parseInt(Math.random() * 30) * $stepHeight + "px";
	  	var flag = true;
	  	var eggNumber = $(".egg").length;
	  	if(eggNumber == 0){
	  		$.each(position,function() {
	  			if(marginLeft == $(this)[0] && marginTop == $(this)[1] ) {
	  				flag = false;
	  				createEgg();
	  			}
	  		});
	  		if(flag == true) {
	  			$("#game-content").append("<div class = 'egg'></div>");
	  			$(".egg").css({
	  				"background-color" : eggColor[colorIndex],
	  				"width" : $stepWidth,
	  				"height" : $stepHeight,
	  				"margin-left" : marginLeft,
	  				"margin-top" : marginTop,
	  				"position" : "absolute"
	  			});
	  		}
	  	}
	  }

	  var eatNumber = parseInt($("#eatNumber").text());
	  var score = parseInt($("#score").text());

	  /*
		 When the snake head node coincide with the egg,the egg will be removed and a new node
		 will be added to the tail node of the snake.At the same time,we should update the
		 position array.
		 */
		 function eatEgg() {
		 	var eggPositionX = toDecimal2(parseFloat($(".egg").css("margin-left")));
		 	var eggPositionY = toDecimal2(parseFloat($(".egg").css("margin-top")));
		 	var eggColor = $(".egg").css("background-color");
		 	if(eggPositionX == realHead[0] && eggPositionY == realHead[1]) {
		 		$("#game-content").append("<div class = 'snake'></div>");
		 		$(".snake:last").css({
		 			"background-color" : "gray",
		 			"width" : $stepWidth,
		 			"height" : $stepHeight,
		 			"margin-left" : currentHead[0],
		 			"margin-top" : currentHead[1],
		 			"position" : "absolute"
		 		});
		 		$(".snake").each(function() {
		 			$(this).css("background-color",eggColor);
		 		});
		 		$(".egg").remove();
		 		createEgg();
		 		score += 100;
		 		eatNumber++
		 		$("#eatNumber").text(eatNumber);
		 		$("#score").text(score);
		 	}
		 	recordPosition();
		 }

	/*If the head of the snake collide with the remain section of itself,game over.
	  So it is necessary to record the position of the whole position of the snake,
	  when the next step of the snake cause the problem mentioned above,which means
	  the next position of the head coincide with one of the position of the snake,
	  the game will be over.   
	  */
	  function gameOverCondition() {
	  	var leftMost = $stepWidth * 50,topMost = $stepWidth * 30;
	  	if(pressCode[0] != 0) {
	  		var currentPressCode = pressCode[0];
	  		var game = true;
	  		if(currentHead[0] < -1 || currentHead[1] < -1 || currentHead[0] > leftMost - 1 || currentHead[1] > topMost - 1 ){
	  			if(currentPressCode == 37|| currentPressCode == 39) {
	  				if(pressCode[0] != 38 || pressCode[0] != 40){
	  					alert("game over");
	  					resetGame();
	  				}
	  			} else if(currentPressCode == 38 || currentPressCode == 40) {
	  				if(pressCode[0] != 37 || pressCode[0] != 39){
	  					alert("game over");
	  					resetGame();
	  				}
	  			}
	  		}
	  		var currentLeft = toDecimal2(currentHead[0]);
	  		var currentRight = toDecimal2(currentHead[1]);
	  		$.each(realPosition,function(){
	  			if(position.length > 1){
	  				if( currentLeft== $(this)[0] && currentRight == $(this)[1]) {
	  					game = false;
	  					return;
	  				}
	  			}
	  		});
	  		if(game == false) {
	  			alert("game over");
	  			resetGame();
	  		}
	  	}
	  }
	//Reset the game
	function resetGame() {
		pressCode[0] = 0;
		clearInterval(move);
	}
});