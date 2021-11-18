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

//array da nave
let nave = {
    x: W / 2,
    y: H / 2,
    w: 80,
    h: 75,
    imagem: imagens['Nave'],
    colicaoX: 12,
    colicaoY: 5,
    colicaoW: 25,
    colicaoH: 10,
    vida: true,
    vidas: 5,
};

//classes
//asteroides
class Asteroides{
    constructor(x, y, d, img){
        this.x = x;
        this.y = y;
        this.dX = 2 * Math.cos(d);
        this.dY = 2 * Math.sin(d);
        this.img = img;
        this.w = img.width;
        this.h = img.height;
        this.partir = false;
    }

    draw(){
        if(!this.partir){
            //desenhar os asteroides
            ctx.fillStyle = 'blue' //ponto de colição (mudar/remover depois)
            ctx.beginPath();
            ctx.fillRect(this.x + 5, this.y + 5, this.w - 10, this.h - 10); //ponto de colição (mudar/remover depois)
            ctx.drawImage(this.img, this.x, this.y); 
        }          
    }

    update(){
        if(!this.partir){
            // atualizar a posição dos asteroides
            if (this.x < -120) this.x = W
            if (this.x > W) this.x = -120
            if (this.y < -68)  this.y = H
            if (this.y > H) this.y = -68

            this.x += this.dX;
            this.y += this.dY;
        }
        
        this.partir = colisoesNave(this.x + 5, this.y + 5, imagens['Meteoro 2'].width - 10, imagens['Meteoro 2'].height - 10)  //verificar se um asteroide bateu na nave
    }
}

//tiros
class Tiro{
    constructor(x, y, c, t, xDir, yDir){
        this.x = x;
        this.y = y;
        this.c = c;
        this.t = t;
        this.dX = xDir;
        this.dY = yDir;
    }

    draw(){
        //desenhar o tiro
        ctx.fillStyle = this.c;
        ctx.beginPath();
        ctx.fillRect(this.x, this.y, this.t, this.t);
    }

    update(){
        //atualizar a posição do tiro
        if(this.dX < this.x) this.x -= 5;
        if (this.dX > this.x) this.x += 5;
        if (this.dY < this.y) this.y -= 5;
        if (this.dY > this.y) this.y += 5;
        
        //retirar o tiro quando chegar ao destino
        if (this.xDir == this.x && this.yDir == this.y) {
            tiros.shift();
        }
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
    if (e.key == 's'){
        downKey = true;
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
function colisoesNave(x, y, w, h){
    if (x + w < (nave.x + nave.colicaoX) || x > (nave.x + nave.colicaoX) + (nave.w - nave.colicaoW)|| y + h < (nave.y + nave.colicaoY) || y > (nave.y + nave.colicaoY) + (nave.h - nave.colicaoH)) {
        //sem colições
    } 
    else {
        nave.vida = false;  //dar a informação que a nave foi destruida
        return true;
        }
}

function colisoes(obj1, obj2){
    if ((Math.floor(obj1.x) + 5) + (obj1.w - 10) < obj2.x || 
        (Math.floor(obj1.x) + 5) > obj2.x + obj2.w ||
        (Math.floor(obj1.y) + 5) + (obj1.h - 10) < obj2.y ||
        (Math.floor(obj1.y) + 5) > obj2.y + obj2.h) {
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
            nave.y -= 3;
            if (nave.y < -nave.h){
                nave.y = H;
            }
        }
        if (downKey) {
            nave.y += 3;
            if (nave.y > H){
                nave.y = -nave.h;
            }
        }
        if (leftKey) {
            nave.x -= 3;
            if (nave.x < -nave.w){
                nave.x = W;
            }
        }
        if (rightKey) {
            nave.x += 3;
            if (nave.x > W){
                nave.x = -nave.w;
            }
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
        ctx.drawImage(nave.imagem, nave.x, nave.y, nave.w, nave.h);

        //disparar com o click do rato
        if (click){
            tiros.push(new Tiro(nave.x+37, nave.y, 'White', 5, xR, yR))
            click = false;
        }

        //tiro -> asteroides
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
    let xInit = 20 + Math.random() * (W - 2 * 20);
    let yInit = 20 + Math.random() * (H - 2 * 20);

    let direction = Math.random() * 2 * Math.PI;

    asteroides.push(new Asteroides(xInit, yInit, direction, imagens['Meteoro 2']))
}

window.onload = () => render()  //chamar a função render depois de carregar a pagina