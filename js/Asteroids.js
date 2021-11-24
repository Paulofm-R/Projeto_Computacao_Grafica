const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

//colocar em tela cheia
canvas.width  = window.innerWidth - 10;
canvas.height = window.innerHeight - 10;

const W = canvas.width;
const H = canvas.height;

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
    vida: true,
    vidas: 5,
    angulo: 0,
    colisao: {  //correção para as coordenadas de colisao
        x: -30,
        y: -30,
        w: -20,
        h: -10
    }
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
    constructor(x, y, c, t, anguloTiro){
        this.x = x; //posisão do tiro em x
        this.y = y; //posisão do tiro em y
        this.c = c; //cor do tiro
        this.t = t; //tamanho do tiro
        this.dX = 3 * Math.cos(anguloTiro); //direção do tiro em x
        this.dY = 3 * Math.sin(anguloTiro); //direção do tiro em y 
    }

    draw(){
        //desenhar o tiro
        ctx.fillStyle = this.c;
        ctx.beginPath();
        ctx.fillRect(this.x, this.y, this.t, this.t);
    }

    update(){
        if (this.x < 0) this.x = W 
        if (this.x > W) this.x = 0
        if (this.y < 0)  this.y = H
        if (this.y > H) this.y = 0

        //disparar para o local em que o rato está localizado
        this.x += this.dX
        this.y += this.dY
    }
}

//ovni
class OVNI{
    constructor(x, y, d){
        this.x = x; 
        this.y = y; 
        this.dX = 2 * Math.cos(d); //direção do ovni em x
        this.dY = 2 * Math.sin(d); //direção do ovni em y
        this.img = imagens['Ovni'];
    }

    draw(){
        //desenhar o OVNI
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
    nave.x = Math.floor(Math.random() * W);
    nave.y = Math.floor(Math.random() * H);
}

//tempo de espera para poder teleportar novamente
function teleportTimer(){
    console.log(spaceTimer);
    spaceTimer--;
    if (spaceTimer == 0){
        clearInterval(timer);
    }
}

/**
 * colisões
 * @param {object} obj1 asteroides 
 * @param {object} obj2 tiros ou nave
 * @param {object} nave se a nave
 * @returns 
 */
function colisoes(obj1, obj2, nave = false){
    if (nave){
        if ((Math.floor(obj1.x)) + (obj1.w) < (obj2.x + obj2.colisao.x) || 
        (Math.floor(obj1.x)) > (obj2.x + obj2.colisao.x) + (obj2.w + obj2.colisao.w) ||
        (Math.floor(obj1.y)) + obj1.h < (obj2.y + obj2.colisao.y) ||
        (Math.floor(obj1.y)) > (obj2.y + obj2.colisao.y) + (obj2.h + obj2.colisao.h)) {
        return false;
    } 
    else { 
        return true;
        }
    }
    else{
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
}

//função para ajustar o angulo
function angulo(){
    if(nave.angulo >= 360){
        nave.angulo = nave.angulo - 360;
    }else if(nave.angulo <= -360){
        nave.angulo = -360 - nave.angulo;
    }
}

//criar ovni
function novOVNI(){
    let direcao = Math.random() * 2 * Math.PI;

    let xInit; //posição inicial em x
    let yInit; //posiçai inicial em y

    //diferenciar a posição inical do OVNI dependedo da direção
    if(direcao < 1 || direcao > 5){
        xInit = 0;
        yInit = Math.random() * H;
    }
    else if(direcao < 2) {
        xInit = Math.random() * W;
        yInit = 0;
    }
    else if (direcao < 4){
        xInit = W;
        yInit = Math.random() * H;
    }
    else {
        xInit = Math.random() * W;
        yInit = Math.random() * H + H * 3/4;
    }    

    ovni = new OVNI(xInit, yInit, direcao);
}

function Nave(){
    // let direcaoNave = Math.atan2(nave.angulo - nave.x, nave.angulo + nave.y);
    // console.log(direcaoNave);
    // nave.x += 2 * Math.cos(direcaoNave);
    // nave.y += 2 * Math.sin(direcaoNave);
    
    console.log(nave.angulo);
    if(nave.angulo == 0){ //frente
        nave.y -= 3;
        if (nave.y < -nave.h){
            nave.y = H;
        }
    }else if((nave.angulo<0 && nave.angulo>-90) || (nave.angulo< 360 && nave.angulo > 270)){ // diagonal superior esquerda
        nave.y -= 3;
        nave.x -= 3;
        if (nave.y < -nave.h){
            nave.y = H;
        }
        if (nave.x < -nave.w){
            nave.x = W;
        }
    }else if((nave.angulo>0 && nave.angulo<90) || (nave.angulo> -360 && nave.angulo < -270)){ //diagonal superior direita
         nave.y -= 3;
         nave.x += 3;
         if (nave.y < -nave.h){
             nave.y = H;
         }
         if (nave.x > W){
            nave.x = -nave.w;
        }
     }else if(nave.angulo == -90 || nave.angulo == 270){ //esquerda
         nave.x -= 3;
         if (nave.x < -nave.w){
            nave.x = W;
        }
     }else if((nave.angulo < -90 && nave.angulo >- 180) || (nave.angulo < 270 && nave.angulo > 180)){ //diagonal inferior esquerda
        nave.y += 3;
        nave.x -= 3;
        if (nave.x < -nave.w){
            nave.x = W;
        }
        if (nave.y > H){
            nave.y = -nave.h;
        }
    }else if(nave.angulo == 180 || nave.angulo == -180){ //baixo
        nave.y += 3;
        if (nave.y > H){
            nave.y = -nave.h;
        }
    }else if((nave.angulo>90 && nave.angulo<180) || (nave.angulo> -270 && nave.angulo < -180)){ //diagonal inferior direita
        nave.y += 3;
        nave.x += 3;
        if (nave.y > H){
            nave.y = -nave.h;
        }
        if (nave.x > W){
            nave.x = -nave.w;
        }
    }else if(nave.angulo == 90 || nave.angulo == -270){ //direita
        nave.x += 3;
        if (nave.x > W){
            nave.x = -nave.w;
        }
    }
}

//render
function render(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //quando a nave tiver vidas
    if(nave.vida){
        angulo() //repor o angulo da nave para 0 quando passar de +/-360
        
        //mover a nave
        if (upKey) {
            Nave()
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
        ctx.save()
        ctx.translate(nave.x,nave.y)
        ctx.rotate(nave.angulo*Math.PI/180)
        ctx.drawImage(nave.imagem, -nave.w/2, -nave.h/2, nave.w, nave.h);
        ctx.restore()

        //disparar com o click do rato
        if (click){
            let anguloTiro = Math.atan2(yR - nave.y, xR - nave.x);

            // let xi = 37* Math.cos(nave.x);
            // let yi = 37* Math.sin(nave.y);
            //posição sem rotação da nave 
            let xi = nave.x
            let yi = -37 + nave.y

            tiros.push(new Tiro(xi, yi, 'White', 5, anguloTiro))
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
            let colicao = colisoes(asteroides[a], nave, true);

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

    // ovni.draw();
    // ovni.update();

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
for (let i = 0; i < 0; i++) {
    let xInit;
    let yInit;
    let direcao = Math.random() * 2 * Math.PI;

    //diferenciar a posição inical do asteroide dependedo da direção
    if(direcao < 1 || direcao > 5){
        xInit = Math.random() * W/4;
        yInit = Math.random() * H;
    }
    else if(direcao < 2) {
        xInit = Math.random() * W;
        yInit = Math.random() * H/4;
    }
    else if (direcao < 4){
        xInit = Math.random() * W + W * 3/4;
        yInit = Math.random() * H;
    }
    else {
        xInit = Math.random() * W;
        yInit = Math.random() * H + H * 3/4;
    }    
    asteroides.push(new Asteroides(xInit, yInit, direcao, imagens['Meteoro 2']));
}

// novOVNI()

window.onload = () => render()  //chamar a função render depois de carregar a pagina