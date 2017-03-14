//var heroi;

function startGame() {
    heroi = new personagem(30, 30, "white", 80, 75);
	plataforma1 = new plataforma(100, 20, "white", 80, 200);
	joystick = new controlador();
    areaDeJogo.start();
}

var areaDeJogo = {
    canvas : document.createElement("canvas"),
    
	start : function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        
		window.addEventListener('keydown', function (e) {
			joystick.keyDown(e);

        })
        window.addEventListener('keyup', function (e) {
			joystick.keyUp(e);
        })
    },
    stop : function() {
        clearInterval(this.interval);
    },    
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function controlador() {

	this.up = false;
	this.down = false;
	this.left = false;
	this.right = false;

	this.keyDown = function(e) {

		if(e.keyCode == 38){ //Cima
			this.up=true;
		}
		
		if(e.keyCode == 37){ //Esq
			this.left=true;
		}
		
		if(e.keyCode == 39){ //Dir
			this.right=true;
		}
		
		if(e.keyCode == 40){ //Baixo
			this.down=true;
		}
		
    }

	this.keyUp = function(e) {
		
		if(e.keyCode == 37){ //Esq
			this.left=false;
		}
		
		if(e.keyCode == 39){ //Dir
			this.right=false;
		}
    }	
	
}

function personagem(width, height, color, x, y, type) {
    
	this.type = type;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
	this.c;
    this.speedX = 0;
	this.speedLimit = 5;
    this.speedY = 0;    
    this.gravity = 0.1; // normal 0.1
    this.gravitySpeed = 0;
	this.isGrounded = false;
    
	this.update = function() {
        ctx = areaDeJogo.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
		
    }
	
    this.move = function() {
	
		if (joystick.right){this.speedX+=0.1};
		if (joystick.left){this.speedX+=-0.1};
		this.x += this.speedX; 
        this.gravitySpeed += this.gravity;
        this.y += this.speedY + this.gravitySpeed;
    }
	
	
	this.pular = function(){
		if(this.isGrounded){
			this.speedY = this.speedY -5.5;
			this.isGrounded = false;
		}
    }
	
	this.aterrisar = function(){
		this.gravitySpeed=0;
	    this.speedY=0;
		this.gravity=0;
		this.isGrounded = true;	
	}
	
	this.cair = function(){
		this.gravity=0.1;
		this.isGrounded = false;
	}	
	
	this.colide = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) ||
               (mytop > otherbottom) ||
               (myright < otherleft) ||
               (myleft > otherright)) {
           crash = false;
        }
        return crash;
    }
}

function plataforma(width, height, color, x, y, type) {
    
	this.type = type;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    
	this.update = function() {
        ctx = areaDeJogo.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

}


function updateGameArea() {

		areaDeJogo.clear();
		heroi.move();
		heroi.update();
		plataforma1.update();
		
		//testar colisões:
		if(heroi.colide(plataforma1)){

			if(heroi.y<plataforma1.y){
				heroi.aterrisar();
			}
			
		}else{
			heroi.cair();
		}

}
