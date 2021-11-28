import Nave from "./Nave.js";
import Tiros from "./Tiros.js";
import Asteroides from "./Asteroides.js";
import OVNI from "./OVNI.js";

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

//colocar em tela cheia
canvas.width  = window.innerWidth - 5;
canvas.height = window.innerHeight - 5;

const W = canvas.width;
const H = canvas.height;

//setas
let upKey = false;
let primeiroClique = false

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
loadImage("Ovni");

//array de asteroides
let asteroides = [];
let numAsteroides = 10 //numero de asteroides

//array de tiros
let tirosNave = [];
let tirosOVNI = [];

//ovni
let ovni;

//inivializar nave
let nave = new Nave(ctx, W, H, imagens['Nave']);

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
        //roda o angulo para a esquerda
        nave.rotacao = -5 / 180 * Math.PI
    }
    else if (e.key == 'd'){
        //roda o angulo da nave para a direita
        nave.rotacao = 5 / 180 * Math.PI
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
            upKey = false; 
            break;
        case "a":
            nave.rotacao = 0;
            break;
        case "d":
            nave.rotacao = 0;
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
 * @param {object} obj1 objeto de colição um 
 * @param {object} obj2 objeto de colição dois
 * @param {object} nave se a nave
 * @returns 
 */
function colisoes(obj1, obj2, nave = false){
    if (nave){
        if ((Math.floor(obj1.x + obj1.colisao.x)) + (obj1.w + obj1.colisao.w) < (obj2.x + obj2.colisao.x) || 
        (Math.floor(obj1.x + obj1.colisao.x)) > (obj2.x + obj2.colisao.x) + (obj2.w + obj2.colisao.w) ||
        (Math.floor(obj1.y + obj1.colisao.y)) + (obj1.h + obj1.colisao.h) < (obj2.y + obj2.colisao.y) ||
        (Math.floor(obj1.y + obj1.colisao.y)) > (obj2.y + obj2.colisao.y) + (obj2.h + obj2.colisao.h)) {
        return false;
    } 
    else {
        return true;
        }
    }
    else{
        if ((Math.floor(obj1.x + obj1.colisao.x)) + (obj1.w + obj1.colisao.w) < obj2.x || 
        (Math.floor(obj1.x + obj1.colisao.x)) > obj2.x + obj2.w ||
        (Math.floor(obj1.y + obj1.colisao.y)) + (obj1.h + obj1.colisao.h) < obj2.y ||
        (Math.floor(obj1.y + obj1.colisao.y)) > obj2.y + obj2.h) {
        return false;
    } 
    else { 
        return true;
        }
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

    ovni = new OVNI(ctx, xInit, yInit, direcao, imagens['Ovni']);
}

//criar asteroides
function criarAsteroides() {
    for (let i = 0; i < numAsteroides; i++) {
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

        asteroides.push(new Asteroides(ctx, xInit, yInit, direcao, imagens['Meteoro 2'], 2, W, H));
    }

    numAsteroides += 2;
}

function destroirAsteroides(asteroide){
    console.log(asteroide);
    if(asteroide.estagio < 4){
        asteroide.estagio++

        for (let i = 0; i < 2; i++){
            let direcao = Math.random() * 2 * Math.PI;
            
            asteroides.push(new Asteroides(ctx, asteroide.x, asteroide.y, direcao, imagens[`Meteoro ${asteroide.estagio}`], asteroide.estagio, W, H));
        }
    }

    asteroides.splice(asteroide, 1);
}

//render
function render(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //quando a nave tiver vidas
    if(nave.vida){        
        //mover a nave
        if (upKey) {
            nave.mover()
            primeiroClique = true;
        }

        //aceleração final
        if(upKey == false && primeiroClique == true){
            nave.aceleracao()
        }

        //teleportar a nave
        if (space){
            teleport()
            space = false;
        }

        //pintar a nave
        nave.desenhar();

        //disparar com o click do rato
        if (click){
            let anguloTiro = Math.atan2(yR - nave.y, xR - nave.x);

            //posição sem rotação da nave
            let xi = nave.x + nave.w/2 * Math.cos(nave.angulo - (90 / 180 * Math.PI));
            let yi = nave.y + nave.h/2 * Math.sin(nave.angulo - (90 / 180 * Math.PI));

            tirosNave.push(new Tiros(ctx, xi, yi, anguloTiro))
            click = false;
        }

        //tiro -> asteroides (colisão)
        for (let t = 0; t < tirosNave.length; t++){
            for(let a = 0; a < asteroides.length; a++){
                let colicao = colisoes(asteroides[a], tirosNave[t]);
                
                if(colicao){ //quando o tiro entrar na area de colisão do asteroide, eliminar os dois do array
                    tirosNave.splice(t, 1);
                    destroirAsteroides(asteroides[a])
                    break
                }
            }
        }

        //nave -> asteroides (colisão)
        for (let a = 0; a < asteroides.length; a++){
            let colicao = colisoes(asteroides[a], nave, true);

            if(colicao){ //quando a nave bate contra o asteroide
                destroirAsteroides(asteroides[a])
                nave.vidas--;
                nave.x = W / 2;
                nave.y = H / 2;

                if(nave.vidas == 0){
                    nave.vida = false;
                }
            }
        }
    }

    if(asteroides.length == 0){
        criarAsteroides()
    }

    //desenhar e mover os asteroides
    asteroides.forEach( asteroide => {
        asteroide.draw();
        asteroide.update();
    });

    //desenhar e mover os tiros
    tirosNave.forEach(tiro =>{
        tiro.draw();
        tiro.update();

        //retirar tiros
        if(tiro.x < 0) tirosNave.shift()
        else if(tiro.x > W) tirosNave.shift()
        else if(tiro.y < 0) tirosNave.shift()
        else if(tiro.y > H) tirosNave.shift()
    })

    //desenhar e mover os tiros
    tirosOVNI.forEach(tiro =>{
        tiro.draw();
        tiro.update();

        //retirar tiros
        if(tiro.x < 0) tiros.shift()
        else if(tiro.x > W) tiros.shift()
        else if(tiro.y < 0) tiros.shift()
        else if(tiro.y > H) tiros.shift()
    })

    // ovni.draw();
    // ovni.update();

    //quantidade de vidas na tela
    ctx.fillStyle = 'White';
    ctx.textAlign = 'center';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText(`VIDAS: ${nave.vidas}`, 75, 40); 

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

novOVNI()

window.onload = () => render()  //chamar a função render depois de carregar a pagina