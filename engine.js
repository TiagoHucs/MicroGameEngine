// montando o jogo (metodo chamado pela página index.html)
function startGame() {

	// Cria o heró do jogo
    heroi = new personagem(30, 30, "white", 80, 75);
	
	// Cria plataformas para pular em cima
	plataforma1 = new plataforma(100, 20, "white", 80, 200);
	
	// Cria um controlados para receber eventos do teclado e mouse e transformalas em ação do jogo
	joystick = new controlador();
	
	// inicia o jogo
    areaDeJogo.start();
}

var areaDeJogo = {
    
	// elemento utilizado para desenhar no navegador
	canvas : document.createElement("canvas"),
    
	// função Start da area do jogo
	start : function() {
        this.canvas.width = 480; // largura da área de jogo
        this.canvas.height = 270; // Altura da área de jogo
        this.context = this.canvas.getContext("2d"); // contexto em 2 dimensões X e Y
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20); // intervalo em milisegundos // 1000 = 1 segundo
        
		window.addEventListener('keydown', function (e) { // a janela escuta eventos de clique e teclas
			joystick.keyDown(e); // envia tecla precionada para o controlador

        })
        window.addEventListener('keyup', function (e) { // a janela escuta eventos de clique e teclas
			joystick.keyUp(e); // envia tecla que deixou de ser pressionada para o controlador
        })
    },
	
	// para o jogo
    stop : function() {
        clearInterval(this.interval);
    }, 
	
	// limpa o jogo
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function controlador() {

	// variáveis de verdadeiro e falso para as direções
	this.up = false;
	this.down = false;
	this.left = false;
	this.right = false;

	this.keyDown = function(e) {

		if(e.keyCode == 38){ // Tecla para cima
			this.up=true;
		}
		
		if(e.keyCode == 37){ // Tecla para esquerda
			this.left=true;
		}
		
		if(e.keyCode == 39){ // Tecla para direita
			this.right=true;
		}
		
		if(e.keyCode == 40){ // Tecla para Baixo
			this.down=true;
		}
		
    }

	// mesmas funçoes porém eventos de teclas que deixaram de ser pressionadas
	this.keyUp = function(e) {
		
		if(e.keyCode == 37){ //Esq
			this.left=false;
		}
		
		if(e.keyCode == 39){ //Dir
			this.right=false;
		}
    }	
	
}

// monta as caracteristicas do personagem
function personagem(width, height, color, x, y) {
    
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.speedX = 0;
    this.speedY = 0;    
    this.gravity = 0.1; // "Gravidade" força que puxa para baixo -- normal 0.1
    this.gravitySpeed = 0; // velocidade da queda
	this.isGrounded = false;
    
	this.update = function() {
        ctx = areaDeJogo.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
		
    }
	
    this.move = function() {
	
		if (joystick.right){this.speedX+=0.1}; // se é verdade que o controle tecla para direita então vá
		if (joystick.left){this.speedX+=-0.1}; // se é verdade que o controle tecla para esquerda então vá
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

function plataforma(width, height, color, x, y) {
    
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
