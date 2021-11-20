const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

//colocar em tela cheia
canvas.width  = window.innerWidth - 10;
canvas.height = window.innerHeight - 10;

const W = canvas.width;
const H = canvas.height;

ctx.fillStyle = 'Blue'; //eliminar depois

//setas
let upKey = false;
let downKey = false;
let leftKey = false;
let rightKey = false;

//teleporte
let space = false;
let spaceTimer = 0;
let timer

//rato
let click = false;  
let xR;
let yR;

//imagens
let imagens = {}
loadImage('Nave');
loadImage("Meteoro 1");
loadImage("Meteoro 2");
loadImage("Meteoro 3");
loadImage("Meteoro 4");
loadImage("Ovni")

//array de asteroides
let asteroides = [];

//array de tiros
let tiros = [];

//ovni
let ovni;

//array da nave
let nave = {
    x: W / 2,
    y: H / 2,
    w: 80,
    h: 75,
    imagem: imagens['Nave'],
    colicaoX: 12,
    colicaoY: 5,
    colicaoW: -25,
    colicaoH: -10,
    vida: true,
    vidas: 5,
    angulo: 0,
};

//classes
//asteroides
class Asteroides{
    constructor(x, y, d, img){
        this.x = x; //posisão do asteroide em x
        this.y = y; //posisão do asteroide em y
        this.dX = 2 * Math.cos(d); //direção do asteroide em x
        this.dY = 2 * Math.sin(d); //direção do asteroide em y
        this.img = img; //imagem do asteroide
        this.w = img.width; //largura
        this.h = img.height; //altura
        this.partir = false;
    }

    draw(){
        //desenhar os asteroides
        ctx.fillStyle = 'blue' //ponto de colição (mudar/remover depois)
        ctx.beginPath();
        ctx.fillRect(this.x + 5, this.y + 5, this.w - 10, this.h - 10); //ponto de colição (mudar/remover depois)
        ctx.drawImage(this.img, this.x, this.y);         
    }

    update(){
        // atualizar a posição dos asteroides
        if (this.x < -120) this.x = W
        if (this.x > W) this.x = -120
        if (this.y < -68)  this.y = H
        if (this.y > H) this.y = -68

        this.x += this.dX;
        this.y += this.dY;
    }
}

//tiros
class Tiro{
    constructor(x, y, c, t, xDir, yDir){
        this.x = x; //posisão do tiro em x
        this.y = y; //posisão do tiro em y
        this.c = c; //cor do tiro
        this.t = t; //tamanho do tiro
        this.dX = 2 * Math.cos(xDir); //direção do tiro em x
        this.dY = 2* Math.sin(yDir); //direção do tiro em y
    }

    draw(){
        //desenhar o tiro
        ctx.fillStyle = this.c;
        ctx.beginPath();
        ctx.fillRect(this.x, this.y, this.t, this.t);
    }

    update(){
        //atualizar a posição do tiro
        // if(this.dX < this.x) this.x -= 5;
        // if (this.dX > this.x) this.x += 5;
        // if (this.dY < this.y) this.y -= 5;
        // if (this.dY > this.y) this.y += 5;

        if (this.x < -120) this.x = W
        if (this.x > W) this.x = -120
        if (this.y < -68)  this.y = H
        if (this.y > H) this.y = -68

        this.x += this.dX;
        this.y += this.dY;
        
        
        //retirar o tiro quando chegar ao destino
        if (this.xDir == this.x && this.yDir == this.y) {
            tiros.shift();
        }
    }
}

//ovni
class OVNI{
    constructor(x, y, d){
        this.x = x; 
        this.y = y; 
        this.d = d;
        this.img = imagens['Ovni'];
    }

    draw(){
        //desenhar o OVNI
        ctx.fillStyle = 'blue' //ponto de colição (mudar/remover depois)
        ctx.beginPath();
        ctx.fillRect(this.x + 5, this.y + 5, this.w - 10, this.h - 10); //ponto de colição (mudar/remover depois)
        ctx.drawImage(this.img, this.x, this.y);  
    }

    update(){
        // atualizar a posição dos ovni
        this.x += this.dX;
        this.y += this.dY;
    }
}

//function
//carregar imagens
function loadImage(name){
    imagens[name] = new Image();
    imagens[name].src = 'img/' + name + '.png';
}

//clicar numa tecla
function KeyPressed(e){
    if (e.key == 'w'){
        upKey = true;
    }
    if (e.key == 'a'){
        leftKey = true;
    }
    if (e.key == 'd'){
        rightKey = true;
    }
    if (e.key == ' ' && spaceTimer == 0){
        space = true;
        spaceTimer = 5;
        timer = window.setInterval(teleportTimer, 1000);
    }
}

//lagar a tecla
function KeyReleased(e){
    switch (e.key){
        case "w":
            upKey = false; ;
            break;
        case "s":
            downKey = false;
            break;
        case "a":
            leftKey = false;
            break;
        case "d":
            rightKey = false;
            break;
        case ' ':
            space = false;
            break;
    }
}

//teleportar a nave
function teleport(){
    nave.x = Math.floor(Math.random() * (canvas.width ));
    nave.y = Math.floor(Math.random() * (canvas.height));
}

//tempo de espera para poder teleportar novamente
function teleportTimer(){
    console.log(spaceTimer);
    spaceTimer--;
    if (spaceTimer == 0){
        clearInterval(timer);
    }
}

//colisões
function colisoes(obj1, obj2){
    if ((Math.floor(obj1.x)) + (obj1.w) < obj2.x || 
        (Math.floor(obj1.x)) > obj2.x + obj2.w ||
        (Math.floor(obj1.y)) + (obj1.h) < obj2.y ||
        (Math.floor(obj1.y)) > obj2.y + obj2.h) {
        return false;
    } 
    else { 
        return true;
        }
}

//render
function render(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //quando a nave tiver vidas
    if(nave.vida){
        //mover a nave
        if (upKey) {
            if(nave.angulo == 0){ //frente
                nave.y -= 3;
                if (nave.y < -nave.h){
                    nave.y = H;
                }
            }else if(nave.angulo<0 || nave.angulo<-90){ // diagonal superior esquerda
                nave.y -= 3;
                nave.x -= 3;
                if (nave.y < -nave.h){
                    nave.y = H;
                }
            }else if(nave.angulo>0 || nave.angulo<90){ //diagonal superior direita
                 nave.y -= 3;
                 nave.x += 3;
                 if (nave.y < -nave.h){
                     nave.y = H;
                 }
             }else if(nave.angulo == -90){ //esquerda
                 nave.x -= 3;
                 if (nave.y < -nave.h){
                     nave.y = H;
                 }
             }else if(nave.angulo<-90 || nave.angulo>-180){ //diagonal inferior esquerda
                nave.y += 3;
                nave.x -= 3;
                if (nave.y < -nave.h){
                    nave.y = H;
                }
            }else if(nave.angulo == 180){ //baixo
                nave.y += 3;
                
                if (nave.y < -nave.h){
                    nave.y = H;
                }
            }else if(nave.angulo>90 || nave.angulo<180){ //diagonal inferior direita
                nave.y += 3;
                nave.x += 3;
                if (nave.y < -nave.h){
                    nave.y = H;
                }
            }else if(nave.angulo == 90 || nave.angulo == -270){
                nave.x += 3;
                if (nave.y < -nave.h){
                    nave.y = H;
                }
            }
             
             else{
                 nave.y += 3;
                 nave.x -= 3;
                 if (nave.y < -nave.h){
                     nave.y = H;
                 }
             }
            
        }
        if (leftKey) {
            //roda o angulo para a esquerda
            nave.angulo --
        }
        if (rightKey) {
            //roda o angulo da nave para a direita
            nave.angulo ++

        }

        //teleportar a nave
        if (space){
            teleport()
            space = false;
        }

        //pintar a nave
        ctx.beginPath();
        ctx.fillStyle = 'blue' //ponto de colição (mudar/remover depois)
        ctx.fillRect(nave.x + 12, nave.y + 5, nave.w - 25, nave.h - 10); //ponto de colição (mudar/remover depois)
        ctx.save()
        ctx.translate(nave.x,nave.y)
        ctx.rotate(nave.angulo*Math.PI/180)
        ctx.drawImage(nave.imagem, -nave.w/2, -nave.h/2, nave.w, nave.h);
        ctx.restore()

        //disparar com o click do rato
        if (click){
            tiros.push(new Tiro(nave.x+37, nave.y, 'White', 5, xR, yR))
            click = false;
        }

        //tiro -> asteroides (colisão)
        for (let t = 0; t < tiros.length; t++){
            for(let a = 0; a < asteroides.length; a++){
                let colicao = colisoes(asteroides[a], tiros[t]);
                
                if(colicao){ //quando o tiro entrar na area de colisão do asteroide, eliminar os dois do array
                    tiros.splice(t, 1);
                    asteroides.splice(a, 1);
                    break
                }
            }
        }

        //nave -> asteroides (colisão)
        for (let a = 0; a < asteroides.length; a++){
            let colicao = colisoes(asteroides[a], nave);

            if(colicao){ //quando a nave bate contra o asteroide
                asteroides.splice(a, 1);
                nave.vida = false;
            }
        }
    }

    //desenhar e mover os asteroides
    asteroides.forEach( asteroide => {
        asteroide.draw();
        asteroide.update();
    });

    //desenhar e mover os tiros
    tiros.forEach(tiro =>{
        tiro.draw();
        tiro.update();
    })

    window.requestAnimationFrame(render);
}

window.addEventListener('keydown', KeyPressed);
window.addEventListener('keyup', KeyReleased);

//receber a infoção do click do rato e das coordenadas
canvas.addEventListener('mousedown', (e) => {
    click = true
    xR = e.clientX;
    yR = e.clientY;
})

//criar asteroides 
for (let i = 0; i < 10; i++) {
    let xInit;
    let yInit;
    let direction = Math.random() * 2 * Math.PI;

    if(direction < 1 || direction > 5){
        xInit = Math.random() * W/4;
        yInit = Math.random() * H;
    }
    else if(direction < 2) {
        xInit = Math.random() * W;
        yInit = Math.random() * H/4;
    }
    else if (direction < 4){
        xInit = Math.random() * W + W * 3/4;
        yInit = Math.random() * H;
    }
    else {
        xInit = Math.random() * W;
        yInit = Math.random() * H + H * 3/4;
    }    
    asteroides.push(new Asteroides(xInit, yInit, direction, imagens['Meteoro 2']));
}

window.onload = () => render()  //chamar a função render depois de carregar a pagina