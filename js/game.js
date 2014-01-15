
$(document).ready(function(){

	$("#canvas").width($(window).width());
	$("#canvas").height($(window).height());
	
	var canvas = oCanvas.create({ canvas: "#canvas", background: "#ffffff" });
	var margins = 1;
	var number = 5;
	var currentLocation = {cX: 0, cY: 0};
	var firstChosen = false;
	
	canvas.width = $(window).width();
	canvas.height = $(window).height();
	
	var colors = {red: "#FF625A", blue: "#208BFF", green: "#3BE651", gray: "#777777"};
	
	//load the sounds
	$("#sounds").innerHTML= "<embed src=\"sounds/flipsound.m4a\" hidden=\"true\" autostart=\"false\" loop=\"false\" />";
	
	var sound = function(surl) {		
		$("#sounds").innerHTML= "<embed src=\"sounds/"+surl+"\" hidden=\"true\" autostart=\"true\" loop=\"false\" />";
	}
	
	
	var toScene = function(destinationScene){
		
		canvas.scenes.unload(localStorage.scene);
		
  		localStorage.scene = destinationScene;
		canvas.scenes.load(localStorage.scene);
		
		canvas.draw.redraw();
	}
	
	 
	//SCENES
	

	
	var level_menu = canvas.scenes.create("level", function () {
	
		console.log("Level was reloaded");
		//the arrow images
		var arrowImage = canvas.display.image({
			x: 0,
			y: 0,
			origin: { x: "center", y: "center" },
			image: "images/arrow.png"
		});
		
		//back button
		var backButton = canvas.display.rectangle({
			x: canvas.width - 20 - 40, 
			y: 10,
			width: 40,
			height: 40,
			fill: "transparent"
		});
		backButton.bind("click tap", function () {
	  		toScene("square");
	    });
	    var xLabel = canvas.display.text({
				x: 0,
				y: 0,
				width: 30,
				align: "center",
				font: "30px Raleway",
				text: "X",
				fill: "#333333"
		});
		backButton.addChild(xLabel);
		this.add(backButton);
		
		//level title 
		
		var levelTitle = canvas.display.text({
				x: 20,
				y: 20,
				width: 500,
				align: "left",
				font: "30px Raleway",
				text: "Map " + localStorage.level,
				fill: "#333333"
		});
		this.add(levelTitle);
		
		
		//make the map box
		var smaller = (canvas.width < canvas.height) ? canvas.width : canvas.height;
		
		var box = canvas.display.rectangle({
			x: canvas.width/2 - (smaller-100)/2, 
			y: 0,
			width: (smaller-100),
			height: (smaller-100),
			fill: "transparent"
		});
		
		this.add(box);
		
		//make the restart button
		
		var restartWidth = 200;
		var restartY = canvas.height - 70;
		
		var line = canvas.display.line({
			start: { x: canvas.width/2 - restartWidth/2, y: restartY },
			end: { x: canvas.width/2 + restartWidth/2, y: restartY },
			stroke: "60px " + colors.blue,
			cap: "round"
		});
		var restartLabel = canvas.display.text({
				x: -100/2,
				y: -30/2,
				width: 200,
				align: "center",
				font: "30px Raleway",
				text: "Restart",
				fill: "white"
		});
		line.bind("click tap", function () {
	  		restartLevel();
	    });
	    
	    
		line.addChild(restartLabel);
		
		this.add(line);
		
		// Prototype objects that will be used to instantiate the others
		var squareProto = canvas.display.rectangle({
											x: 77,
											y: 77,
											width: 10,
											height: 10,
											fill: "#0aa"
										});
			
		var blockArray = new Array(number+2);
		
		for(x=0;x<number+2;x++){
			blockArray[x] = new Array(number+2);
		  for(y=0;y<number+2;y++){   
		  	   blockArray[x][y] = new Array(5);
		  	   var filledColor = colors.red;
		  	   if(x == 0 || y == 0 || x == number+1 || y == number+1){
			  	   filledColor = "transparent";
		  	   }
		       createSquare({
		       	parent: box, 
		       	fill: filledColor,
		       	x: x,
		       	y: y
		       });
		  }
		}
		
		
		var restartLevel = function(){
			
			clearBoard();
			
			setUpMap();
			
			canvas.redraw();
		}
		
		
		var clearBoard = function(){

			firstChosen = false;
		
			removeArrows();
		
			for(x=0;x<number+2;x++){
			  for(y=0;y<number+2;y++){   
			  	   
			  	   var filledColor = colors.red;
			  	   var squaretype = 0;
			  	   if(x == 0 || y == 0 || x == number+1 || y == number+1){
				  	   filledColor = "transparent";
				  	   squaretype = 99;
			  	   }
			  	     	   
			  	   blockArray[x][y][0].fill = filledColor;
			  	   blockArray[x][y][0].stype = squaretype;
			  	   
			  }
			}
			
		}
		
		var setUpMap = function(){
			setBlockType(1, 4, 3);
			setBlockType(4, 3, 3);
			setBlockType(3, 5, 3);
			setBlockType(4, 2, 3);
		}
		
		
		var setBlockType = function(x, y, typeOfSquare){
			var theblock = blockArray[x][y][0];
			theblock.fill = colors.gray;
			theblock.stype = typeOfSquare;
		}
		
		
		var arrowPlaceType = function(theType){
			if(theType == 0){
				return true;
			}else{
				return false;
			}
		}
		
		var addArrows = function(block){
			//remove current arrows
			removeArrows();
			
			sound('flipsound.m4a');
			
			var arrows = [blockArray[block.lX][block.lY-1][0], 
						  blockArray[block.lX+1][block.lY][0], 
					      blockArray[block.lX][block.lY+1][0], 
					      blockArray[block.lX-1][block.lY][0]];  
						  
			var degrees = 0;
			for(var i = 0; i < arrows.length; i++){
				//frist do the top block	     
				if(arrowPlaceType(arrows[i].stype)){
					var newArrow = arrowImage.clone();
					newArrow.width = block.width;
					newArrow.height = block.height;
					newArrow.x = block.width/2;
					newArrow.y = block.height/2;
					newArrow.rotate(degrees);
					arrows[i].addChild(newArrow);
					
					nslog(arrows[i].lX + ", " + arrows[i].lY);
					
					addDirectionals(arrows[i], i, newArrow); 
					//add the click events
				
					switch(i)
					{
					case 0:
					 
					  newArrow.bind("click tap", function () {
					  	
					  	return move(this, 0);
					  	
					  });
					  
					  break;
					case 1:
					  newArrow.bind("click tap", function () {
					 	 
					  	return move(this, 1);
					  });
					  break;
					 case 2:
					  newArrow.bind("click tap", function () {
					  	
					  	return move(this, 2);
					  	
					  });
					  break;
					 case 3:
					  newArrow.bind("click tap", function () {
					  	
					  	return move(this, 3);
					  	
					  });
					  break;
					default:
					  newArrow.bind("click tap", function () {	
					  	
					  	return move(this, 0);
					  	
					  });
					 
					}
					canvas.draw.redraw();
				
				}
				
				//rotate
				degrees += 90;
				
			}
		}
		
		
		
		var addDirectionals = function(block, way, theArrow){
				
			var checkBlock = block;
			var count = 0;
			var currBlock;
			var next = true;
			
			//get the directions
			var xOffset, yOffset;
				switch(way)
					{
					case 0:
					  xOffset = 0;
					  yOffset = -1;
					  break;
					case 1:
					  xOffset = +1;
					  yOffset = 0;
					  break;
					 case 2:
					  xOffset = 0;
					  yOffset = +1;
					  break;
					 case 3:
					  xOffset = -1;
					  yOffset = 0;
					  break;
					default:
					  xOffset = 0;
					  yOffset = -1;
					}
					
			checkBlock = blockArray[block.lX + xOffset][block.lY + yOffset][0];
			
			while(next){
				count++;
				// end the loop if hit a filled in block or the border
				if(checkBlock.stype == 99){
					next = false;
				}else{ //else, fill in and keep going
					//set new current location
				
					var direcitonal = canvas.display.rectangle({
										x: 0, 
										y: 0,
										width: block.width,
										height: block.height,
										fill: "transparent"
									});
					
					
					switch(way)
					{
					case 0:
					  direcitonal.bind("click tap", function () {
					  	return move(theArrow, 0);
					  });
					  break;
					case 1:
					  direcitonal.bind("click tap", function () {
					  	return move(theArrow, 1);
					  });
					  break;
					 case 2:
					  direcitonal.bind("click tap", function () {
					  	return move(theArrow, 2);
					  });
					  break;
					 case 3:
					  direcitonal.bind("click tap", function () {
					  	return move(theArrow, 3);
					  });
					  break;
					default:
					  direcitonal.bind("click tap", function () {
					  	return move(theArrow, 0);
					  });
					 
					}
					
					checkBlock.addChild(direcitonal);
					
					currBlock = checkBlock;
					
					checkBlock = blockArray[checkBlock.lX + xOffset][checkBlock.lY + yOffset][0];
				}
			}
			
		}
		
		var setColorToType = function(block){
			switch(block.stype)
				{
				case 0:
				  block.fill = colors.red;
				  break;
				case 1:
				  block.fill = colors.green;
				  break;
				 case 2:
				  block.fill = colors.gray;
				  break;
				
				default:
				  block.fill = colors.red;
				}
		}
		
		var removeArrows = function(){
			for(x=0;x<number+2;x++){
			  for(y=0;y<number+2;y++){  
			  	if(blockArray[x][y][0].children.length > 0){
				  	for(var z = 0; z < blockArray[x][y][0].children.length; z++){
					  	canvas.removeChild(blockArray[x][y][0].children[z]);
				  	}
				  	
			  	} 
			  }
			}
			
		}
		
		var blockPressed = function(block){
			
			if(!firstChosen){
				block.stype = 1;
				block.fill = colors.blue;
				
				currentLocation = {cX: block.lX, cY: block.lY};
				addArrows(block);
				
				firstChosen = true;
			}else{
				//taken care of by the move up and move down 
				
				currentLocation = {cX: block.lX, cY: block.lY};
			}
			
			
		}
	
		
		// Definition for a satellite and its corresponding path
		function createSquare (options) {
		
			var squareType = 0;
			if(x == 0 || y == 0 || x == number+1 || y == number+1){
				squareType = 99;
			}
		
			// Create a new satellite
			var square = squareProto.clone({
				origin: {
					x: 0,
					y: 0
				},
				width: (box.width/(number+2)) - margins,
				height: (box.width/(number+2)) - margins,
				x: (options.x*(box.width/(number+2)) - margins) + margins, 
				y: (options.y*(box.width/(number+2)) - margins) + margins,
				lX: options.x,
				lY: options.y,
				fill: options.fill,
				stype: squareType
			});
			
			//only bind if one of the visible squares
			if(options.x > 0 && options.x < number+1 && options.y > 0 && options.y < number+1){ 
				square.bind("click tap", function () {
					blockPressed(this);
				
					canvas.draw.redraw();
				});
			}
			
			options.parent.addChild(square);
			
			blockArray[x][y][0] = square;
			
		}
		
		var flipToColor = function(curBlock, toColor, delayTime){
			var startingY = curBlock.y;
			var startingHeight = curBlock.height;
		
			curBlock.delay(100*delayTime);
			curBlock.animate({
				height: 0,
				y: startingHeight/2 + startingY
			}, {
				duration: 300,
				easing: "linear",
				callback: function () {
					curBlock.fill = toColor;
					curBlock.animate({
						height: startingHeight,
						y: startingY
					}, {
						duration: 300,
						easing: "linear",
						callback: function () {
							canvas.draw.redraw();
						}
					});
				}
			});
		}
		
		var move = function(arrowImage, way){
			
			//this is the top arrow so I need its parent for the top block... I think
			//check block will always be the next block
			var checkBlock = arrowImage.parent;
			var sendBlock = checkBlock;
			var count = 0;
			var currBlock;
			var next = true;
			
			//get the directions
			var xOffset, yOffset;
			switch(way)
				{
				case 0:
				  xOffset = 0;
				  yOffset = -1;
				  break;
				case 1:
				  xOffset = +1;
				  yOffset = 0;
				  break;
				 case 2:
				  xOffset = 0;
				  yOffset = +1;
				  break;
				 case 3:
				  xOffset = -1;
				  yOffset = 0;
				  break;
				default:
				  xOffset = 0;
				  yOffset = -1;
				}
				
			var startingBlock = blockArray[checkBlock.lX - xOffset][checkBlock.lY - yOffset][0];
			setColorToType(startingBlock);
			
			while(next){
				count++;
				// end the loop if hit a filled in block or the border
				if(flipAllowedType(checkBlock.stype)){
					next = false;
				}else{ //else, fill in and keep going
					//set new current location
					currentLocation = {cX: checkBlock.lX, cY: checkBlock.lY};
					
					checkBlock.stype = 1;
					//checkBlock.fill = colors.green;
					currBlock = checkBlock;
					
					if(!flipAllowedType(blockArray[checkBlock.lX + xOffset][checkBlock.lY + yOffset][0].stype)){ 
						flipToColor(checkBlock, colors.green, count);
					}
					
					checkBlock = blockArray[checkBlock.lX + xOffset][checkBlock.lY + yOffset][0];
				}
			}
			
			addArrows(currBlock);
			currBlock.fill = colors.blue; //set the current indicator
			
			checkIfWon();
		}
		
		var flipAllowedType = function(thisType){
			if(thisType == 99 || thisType == 1 || thisType == 3){
				return true;
			}else{
				return false;
			}
		}
		
		var checkIfWon = function(){
		
			var checker = 0;
		/*
			for(x=1;x<number;x++){
			  for(y=1;y<number;y++){  
			  	if(blockArray[x][y][0].stype == 0){
				  	checker++;
			  	}
			  }
			}
			if(checker != 0){
				restartLevel();
			}else{
				alert("You won!");
			}*/
		}
		
		// Set up a tick function that will move all satellites each frame
		canvas.setLoop(function () {
			
		});
		
		//canvas.timeline[canvas.timeline.running ? "stop" : "start"]();
		
		var nslog = function(string){
			console.log(string);
		}
		
		//make the map
		setUpMap();
		
		
		$(window).resize(function(){
		
			$("#canvas").width($(window).width());
			$("#canvas").height($(window).height());
			
			canvas.width = $(window).width();
			canvas.height = $(window).height();
			
			smaller = (canvas.width < canvas.height) ? canvas.width : canvas.height;
			box.x = canvas.width/2 - (smaller-100)/2;
			box.width = smaller-100;
			box.height = smaller-100;
			
			
			for(x=0;x<number+2;x++){
			  for(y=0;y<number+2;y++){   
			  	  blockArray[x][y][0].width = (box.width/(number+2)) - margins;
			  	  blockArray[x][y][0].height = (box.width/(number+2)) - margins;
			  	  blockArray[x][y][0].x = (x*(box.width/(number+2)) - margins) + margins;
			  	  blockArray[x][y][0].y = (y*(box.width/(number+2)) - margins) + margins
			  }
			}
		
			canvas.draw.redraw();
		});
	});
	
	delete level_menu.loaded;
	var loaded = false;
	Object.defineProperty(level_menu, 'loaded', {
	  get: function() {
	    return loaded;
	  },
	  set: function(value) {
	    loaded = value;
	    if (loaded) sceneIsLoaded();
	    else sceneIsUnloaded();
	  }
	});
	
	
	//////////////////////////////
	//////  Single Square
	//////////////////////////////
	
	var square_menu = canvas.scenes.create("square", function () {
	
		var smaller = (canvas.width < canvas.height) ? canvas.width : canvas.height;
		smaller -= 100;
		
		var bg = canvas.display.image({
			x: 0,
			y: 0,
			tile: true,
			tile_width: 100,
			tile_height: 100,
			width: canvas.width + 100,
			height: canvas.height,
			image: "images/menu-bg.png"
		});
		
		var animateBG = function(){
			bg.animate({
				x: -100
			}, {
				duration: 8000,
				easing: "linear",
				callback: function () {
					bg.x = 0;
					animateBG();
				}
			});
		}
		
		this.add(bg);
		
		animateBG();
		
		
		var levelsBounds = canvas.display.rectangle({
				x: canvas.width/2 - smaller/2, 
				y: 50,
				width: smaller,
				height: smaller,
				fill: "transparent"
		});
		this.add(levelsBounds);
		
		var spaceBetweenLevelBlocks = 5;
		
		var levelArray = new Array(5);
		for(x=0;x<5;x++){
			levelArray[x] = new Array(5);
		  for(y=0;y<5;y++){   
		  	   levelArray[x][y] = new Array(5);
		       createLevel({
		       	fill: colors.red,
		       	x: x,
		       	y: y,
		       	parent: levelsBounds
		       });
		  }
		}
		function createLevel (options) {
		
			// Create a new level block
			var level = canvas.display.rectangle({
				origin: {
					x: 0,
					y: 0
				},
				width: (options.parent.width/5) - spaceBetweenLevelBlocks,
				height: (options.parent.width/5) - spaceBetweenLevelBlocks,
				x: (options.x*(options.parent.width/5) - spaceBetweenLevelBlocks) + spaceBetweenLevelBlocks, 
				y: (options.y*(options.parent.width/5) - spaceBetweenLevelBlocks) + spaceBetweenLevelBlocks,
				lX: options.x,
				lY: options.y,
				fill: options.fill
			});
			
			var levelNumber = (x+1) + (y*(x+1));
			
			var sizeOfFont = level.height/2;
			var xShift = 0;
			if(levelNumber > 9){
				xShift = sizeOfFont/4;
			}
			
			var singleLabel = canvas.display.text({
					x: level.width/2 - sizeOfFont/2 - xShift,
					y: level.height/2 - sizeOfFont/2,
					width: sizeOfFont,
					align: "center",
					font: sizeOfFont + "px Raleway",
					text: " " + levelNumber,
					fill: "white"
			});
			
			level.addChild(singleLabel);
			
		 
			level.bind("click tap", function () {
				sound('flipsound.m4a');
				
				localStorage.square = 1;
				localStorage.level = parseInt(level.children[0].text);
				
				
				toScene("level");
			});
		
			
			options.parent.addChild(level);
			
			levelArray[x][y][0] = level;
			
		}
		
		//back button
		var backButton = canvas.display.rectangle({
			x: canvas.width - 20 - 40, 
			y: 10,
			width: 40,
			height: 40,
			fill: "transparent"
		});
		backButton.bind("click tap", function () {
	  		toScene("menu");
	    });
	    var xLabel = canvas.display.text({
				x: 0,
				y: 0,
				width: 30,
				align: "center",
				font: "30px Raleway",
				text: "X",
				fill: "#333333"
		});
		backButton.addChild(xLabel);
		this.add(backButton);
		
		//resize
		
		$(window).resize(function(){
		
			$("#canvas").width($(window).width());
			$("#canvas").height($(window).height());
			
			canvas.width = $(window).width();
			canvas.height = $(window).height();
			
			bg.width = canvas.width + 100;
			bg.height = canvas.height;
			
			smaller = (canvas.width < canvas.height) ? canvas.width : canvas.height;
			smaller -= 100;
		
			levelsBounds.width = smaller;
			levelsBounds.height = smaller;
			levelsBounds.x = canvas.width/2 - smaller/2;
			
			for(var i = 0; i<5; i++){
				for(var j = 0; j<5; j++){
					levelArray[i][j][0].x = (levelArray[i][j][0].lX*(levelsBounds.width/5) - spaceBetweenLevelBlocks) + spaceBetweenLevelBlocks;
					levelArray[i][j][0].y = (levelArray[i][j][0].lY*(levelsBounds.width/5) - spaceBetweenLevelBlocks) + spaceBetweenLevelBlocks;
					levelArray[i][j][0].width = levelArray[i][j][0].height = (levelsBounds.width/5) - spaceBetweenLevelBlocks;
					
					
					var levelNumber = (i+1) + (j*(i+1));
					
					var sizeOfFont = levelArray[i][j][0].width/2;
					var xShift = 0;
					if(levelNumber > 9){
						xShift = sizeOfFont/4;
					}
					
					levelArray[i][j][0].children[0].x = levelArray[i][j][0].width/2 - sizeOfFont/2 - xShift;
					levelArray[i][j][0].children[0].y = levelArray[i][j][0].height/2 - sizeOfFont/2;
					levelArray[i][j][0].children[0].font = sizeOfFont + "px Raleway";
				}
			}
		
			canvas.draw.redraw();
			
		});
		
		
	
	});
	
	delete square_menu.loaded;
	var loaded2 = false;
	Object.defineProperty(square_menu, 'loaded', {
	  get: function() {
	    return loaded2;
	  },
	  set: function(value) {
	    loaded2 = value;
	    if (loaded2) sceneIsLoaded();
	    else sceneIsUnloaded();
	  }
	});
	
	
	//////////////////////////////
	//////  MENU
	//////////////////////////////
	
	var menu_menu = canvas.scenes.create("menu", function () {
	
		var smaller = (canvas.width < canvas.height) ? canvas.width : canvas.height;
		smaller -= 100;
		
		var bg = canvas.display.image({
			x: 0,
			y: 0,
			tile: true,
			tile_width: 100,
			tile_height: 100,
			width: canvas.width + 100,
			height: canvas.height,
			image: "images/menu-bg.png"
		});
		
		
		var animateBG = function(){
			bg.animate({
				x: -100
			}, {
				duration: 8000,
				easing: "linear",
				callback: function () {
					bg.x = 0;
					animateBG();
				}
			});
		}
		
		var levelPacks = new Array(1);
		
		var createMenuItem = function(numbered, colored){
			var menuBox = canvas.display.rectangle({
				x: canvas.width/2 - smaller/2, 
				y: 50,
				width: smaller,
				height: smaller,
				fill: colored
			});
			
			menuBox.bind("click tap", function () {
				sound('flipsound.m4a');
				toScene("square");
			});
			
			
			var levelLabel = canvas.display.text({
					x: menuBox.width/2 - 70/2,
					y: menuBox.height/2 - 70/2,
					align: "center",
					font: "70px Raleway",
					text: " " + numbered,
					fill: "white"
			});
			
			menuBox.addChild(levelLabel);
			
			levelPacks[numbered-1] = menuBox;
			
			return menuBox;
			
		}
		
		
		//LEFT ARROW
			var arrow = canvas.display.polygon({
				x: 50,
				y: canvas.height/2 - 15,
				sides: 3,
				radius: 30,
				rotation: 180,
				fill: "rgba(0,0,0,0.1)"
			});
			
		//RIGHT ARROW
			var arrow2 = canvas.display.polygon({
				x: canvas.width - 20 - 50,
				y: canvas.height/2 - 15,
				sides: 3,
				radius: 30,
				rotation: 0,
				fill: "rgba(0,0,0,0.1)"
			});
		var navArrows = function(scene){
			scene.add(arrow);
			scene.add(arrow2);
		}
		
		
		$(window).resize(function(){
		
			$("#canvas").width($(window).width());
			$("#canvas").height($(window).height());
			
			canvas.width = $(window).width();
			canvas.height = $(window).height();
			
			bg.width = canvas.width + 100;
			bg.height = canvas.height;
			
			for(var i = 0; i < levelPacks.length; i++){
			
				smaller = (canvas.width < canvas.height) ? canvas.width : canvas.height;
				levelPacks[i].x = canvas.width/2 - (smaller-100)/2;
				levelPacks[i].width = smaller-100;
				levelPacks[i].height = smaller-100;
				
				for(var j = 0; j < levelPacks[i].children.length; j++){
					levelPacks[i].children[j].x = levelPacks[i].width/2 - 70/2;
					levelPacks[i].children[j].y = levelPacks[i].height/2 - 70/2;
				}
			
			}
			
			//arrows
			arrow.y = canvas.height/2 - 15;
			arrow2.x = canvas.width - 20 - 50;
			arrow2.y = canvas.height/2 - 15;
		
			canvas.draw.redraw();
		});
		
		
		this.add(bg);
		
		animateBG();
	
		this.add(createMenuItem(1, colors.blue));
		
		this.add(navArrows(this));
	});
	
	delete menu_menu.loaded;
	var loaded3 = false;
	Object.defineProperty(menu_menu, 'loaded', {
	  get: function() {
	    return loaded3;
	  },
	  set: function(value) {
	    loaded3 = value;
	    if (loaded3) sceneIsLoaded();
	    else sceneIsUnloaded();
	  }
	});
	
	var sceneIsLoaded = function(){
		console.log("Scene was loaded");
	}
	
	var sceneIsUnloaded = function(){
		console.log("Scene was unloaded");
	}
	
	///LOCAL STORAGE
	
	if (localStorage.scene)
	  {
	  	canvas.scenes.load(localStorage.scene);
	  }
	else
	  {
	  localStorage.scene= "menu";
	  canvas.scenes.load(localStorage.scene);
	  }
	
	
	
	
});
