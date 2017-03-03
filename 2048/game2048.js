window.onload = function(){
	this.container = document.getElementById("game2048");
	var startBtn = document.getElementById("startBtn");
	game = new game2048(container);
	game.init();	
	startBtn.onclick = function(){
		this.style.display = "none";	
		
	}
}

window.onkeydown = function(e){
	var keynum;
	var keychar;
	if(window.event){
		keynum = e.keyCode;
	}//IE
	else if(e.which){
		keynum = e.which;
	}//Netscape/firefox/Opera
	keychar = String.fromCharCode(keynum);
	if(game.over()){		
		startBtn.style.display = "block";
		startBtn.innerHTML = "game over,replay?";
		game.clean();
	}
	else if(["I","L","K","J"].indexOf(keychar) > -1){
		if(game.erroDirection(keychar)){
			alert("该方向没有可移动的数字，请换个方向！");
		}
		else{
			game.move(keychar);}
	}
}
var value;
var game;
//var flag = true;
function game2048(container){
	this.container = container;	
	this.grid = new Array(16);
	this.len = this.grid.length;	
}

game2048.prototype = {
//这部分用来对游戏进行初始化
	init:function(){		
	for (var i=0; i<this.len; i++){
		var grid = this.newGrid(0);			
		this.container.appendChild(grid);
		this.grid[i] = grid;
		this.grid[i].setAttribute("index", 0); //该属性用来记录当前格子是否被合并过
	}
	this.randomGrid();
	this.randomGrid();
	},
//在盒子上生成新格子
	newGrid: function(val){
		var gridDiv = document.createElement("div");			
		this.setGridVal(gridDiv,val);
		return gridDiv;
	},
//设置格子里面的数字
	setGridVal: function(grid, val){
		grid.className = "grid grid" + val;
		grid.setAttribute("value" , val);//该属性用来记录当前格子的数字
		grid.innerHTML = val > 0 ? val : "";
	},
//在空格子上随机显示数字
	randomGrid: function(){
		var zeroGrid = new Array();
		for(var i = 0; i < this.len; i++ ){
			if(this.grid[i].getAttribute("value") == 0){		
			zeroGrid.push(this.grid[i]);
			}
		}
		var num = Math.floor(Math.random()*zeroGrid.length);
		this.setGridVal(zeroGrid[num], Math.random() > 0.8 ? 4 : 2);
	},
//按键后分别处理各种合并动作
	move: function(direction){
		var j;
		switch(direction){
			case "I":
				for(var i = 4 ;i <this.len ;i++){					
					j = i;
                    while(j >= 4){
                        this.merge(this.grid[j - 4], this.grid[j]);
                        j -= 4;
                    }					
				}
			
			break;
			case "L":
				for(var i = 14; i >= 0; i--){
					j = i;
                    while(j % 4 != 3){
                        this.merge(this.grid[j + 1], this.grid[j]);
                        j += 1;
                    }
				}
			break;
			case "K":
				for(var i = 11 ; i >= 0; i--){
					j = i;
                    while(j <= 11){
                        this.merge(this.grid[j + 4], this.grid[j]);
                        j += 4;
                    }	
				}
			break;
			case "J":
				for(var i =1 ; i < this.len; i++){
					j = i;
                    while(j % 4 != 0){
                        this.merge(this.grid[j - 1], this.grid[j]);
                        j -= 1;
                    }
				}
				break;
		}
		this.randomGrid();
		for (var i=0; i<this.len; i++){
			this.grid[i].setAttribute("index" , 0);
		}
	},
	//根据各个格子的数字决定怎么合并
	merge: function(currGrid, preGrid){
		var currVal = currGrid.getAttribute("value");
		var currIndex = currGrid.getAttribute("index");		
		var preVal = preGrid.getAttribute("value");
		var preIndex = preGrid.getAttribute("index");
		if(preVal != 0){			
			if((currVal == preVal) && (currIndex == 0) && (preIndex == 0)){
			this.setGridVal(currGrid,2*currVal);			
			this.setGridVal(preGrid, 0);			
			currGrid.setAttribute("index",1);			
			}		
			else if(currVal == 0){
				this.setGridVal(currGrid, preVal);
				this.setGridVal(preGrid, 0);
				}
		}
	},
//判断是否按了暂时不能移动的方向
	erroDirection: function(direction){
		var num =0; //num用来记录为显示数字的格子的数目
		var numx= 0;//用来记录横向相邻两个格子数字相同的数目
		var numy=0;//用来记录纵向相邻两个格子数字相同的数目
		for(var i=0 ; i< this.len; i++){
			if(this.grid[i].getAttribute("value") == 0){
				num++;
			}
			if(i%4 !=3){
				if(this.grid[i].getAttribute("value") == this.grid[i+1].getAttribute("value")){
					numx++;
				}
			}
			if(i<12){
				if(this.grid[i].getAttribute("value") == this.grid[i+4].getAttribute("value")){
					numy++;
				}
			}
		}
		switch(direction){
			case "I": {
				if( (num  == 0) && (numy == 0) ){
					return true;
				}
				break;				
			}
			case "K": {
				if( (num  == 0) && (numy == 0) ){
					return true;
				}
				break;
			}
			case "L": {
				if( (num  == 0) && (numx == 0) ){
					return true;
				}
				break;				
			}
			case "J": {
				if( (num  == 0) && (numx == 0) ){
					return true;
				}
				break;
			}
		}
		return false;
	},

//判断游戏是否已经结束
	over: function(){
		for(var i = 0; i < this.len ;i++ ){
			if(this.grid[i].getAttribute("value") == 0){
				return false;
			}
			if(i < 12){
				if(this.grid[i].getAttribute("value") == this.grid[i+4].getAttribute("value")){
					return false;
				}
			}
			if(i%4 != 3){
				if(this.grid[i].getAttribute("value") == this.grid[i+1].getAttribute("value")){
					return false;
				}
			}
		}
		return true;
	},
//游戏结束后的清理工作
	clean: function(){
		for(var i = 0; i < this.len; i++){
			this.setGridVal(this.grid[i], 0);
		}
		game.randomGrid();
		game.randomGrid();
	}
}