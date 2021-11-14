const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

//colocar em tela cheia
canvas.width  = window.innerWidth - 10;
canvas.height = window.innerHeight - 10;

const W = canvas.width;
const H = canvas.height;

ctx.fillStyle = 'Blue'; //eliminar depois

//posição inicial da nave
// let x = W / 2;
// let y = H / 2;

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

//tiros
// let tiroTimer = true;
// let timeTiro

//imagens
let imagens = {}
loadImage('Nave');
loadImage("Meteoro 1");
loadImage("Meteoro 2");
loadImage("Meteoro 3");
loadImage("Meteoro 4");
loadImage("Ovni")

//array de asteroides
let a = [];

//array de tiros
let tiros = [];

//array da nave
let nave = {
    x: W / 2,
    y: H / 2,
    w: 35,
    h: 69,
    imagem: imagens['Nave'],
    vida: true,
    vidas: 5,
};

//guardar se esta na tela inical ou não
// let inicio;

//classes
//asteroides
class Asteroides{
    constructor(x, y, d){
        this.x = x;
        this.y = y;
        this.dX = 2 * Math.cos(d);
        this.dY = 2 * Math.sin(d);
    }

    draw(){
        //desenhar os asteroides
        ctx.beginPath();
        ctx.fillRect(this.x + 10, this.y + 5, 100, 60)
        ctx.drawImage(imagens['Meteoro 3'], this.x, this.y, 120, 68);
        // ctx.arc(this.x + 60, this.y + 34, 45, 0, Math.PI * 2); //ponto de colição (mudar/remover depois)
        // ctx.fill()
        
    }

    update(){
        //atualizar a posição dos asteroides
        if (this.x < -120) this.x = W
        if (this.x > W) this.x = -120
        if (this.y < -68)  this.y = H
        if (this.y > H) this.y = -68

        this.x += this.dX;
        this.y += this.dY;

        colisoes(this.x + 10, this.y + 5, 100, 60)  //verificar se um asteroide bateu na nave
    }
}

//tiros
class Tiro{
    constructor(x, y, c, t, xDir, yDir){
        this.x = x;
        this.y = y;
        this.c = c;
        this.t = t;
        this.xDir = xDir;
        this.yDir = yDir;
    }

    draw(){
        //desenhar o tiro
        ctx.fillStyle = this.c;
        ctx.beginPath();
        ctx.fillRect(this.x, this.y, this.t, this.t);
    }

    update(){
        //atualizar a posição do tiro
        if(this.xDir < this.x){
            this.x -= 2;
        }
        if (this.xDir > this.x) {
            this.x += 2;
        }
        if (this.yDir < this.y) {
            this.y -= 2;
        }
        if (this.yDir > this.y) {
            this.y += 2;
        }
        
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
    // if (e.key == 'Enter' && inicio){
    //     render();
    //     inicio = false;
    // }
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
    x = Math.floor(Math.random() * (canvas.width - 2*R) + R);
    y = Math.floor(Math.random() * (canvas.height - 2*R) + R);
}

//tempo de espera para poder teleportar novamente
function teleportTimer(){
    console.log(spaceTimer);
    spaceTimer--;
    if (spaceTimer == 0){
        clearInterval(timer);
    }
}

//tempo de espera entre dois tiros  //ver com a Sofia
// function timerTiro(){
//     tiroTimer = true;
//     window.clearInterval(timeTiro);
// }

//colisões
function colisoes(x, y, w, h){
    if (x + w < nave.x || x > nave.x + nave.w || y + h < nave.y || y > nave.y + nave.h) {
        //sem colições
    } 
    else {
        nave.vida = false;  //dar a informação que a nave foi destruida
        }
        
}

// //ecra inicial
// function ecraInicial(){
//     ctx.fillStyle = 'Blue';
//     let text = 'ENTER'
//     ctx.font = '50px Arial';
//     ctx.textAlign = 'center';
//     ctx.fillText(text, W/2, H/2);

//     inicio = true;
// }

//render
function render(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //mover a nave
    if (upKey) {
        nave.y -= 3;
        if (nave.y < -69){
            nave.y = H;
        }
    }
    if (downKey) {
        nave.y += 3;
        if (nave.y > H){
            nave.y = -69;
        }
    }
    if (leftKey) {
        nave.x -= 3;
        if (nave.x < -35){
            nave.x = W;
        }
    }
    if (rightKey) {
        nave.x += 3;
        if (nave.x > W){
            nave.x = -35;
        }
    }

    //teleportar a nave
    if (space){
        teleport()
        space = false;
    }

    //disparar com o click do rato
    if (click){
        tiros.push(new Tiro(nave.x+15, nave.y, 'White', 5, xR, yR))
        click = false;
    }

    //pintar a nave
    if(nave.vida){
        ctx.beginPath();
        ctx.fillRect(nave.x + 3, nave.y + 3, 30, 65);
        ctx.drawImage(nave.imagem, nave.x, nave.y, nave.w, nave.h);
        // ctx.arc(x + 17.5, y + 34.5, 30, 0, Math.PI * 2);  //ponto de colição (mudar/remover depois)
        // ctx.fill()
    }

    //desenhar e mover os asteroides
    a.forEach( asteroide => {
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

    a.push(new Asteroides(xInit, yInit, direction))
}

window.onload = () => render()  //chamar a função render depois de carregar a pagina