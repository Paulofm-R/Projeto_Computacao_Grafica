import Nave from "./Nave.js";
import Asteroides from "./Asteroides.js";
import OVNI from "./OVNI.js";

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

//colocar em tela cheia
canvas.width  = window.innerWidth - 1;
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
let especial = false;
let especialTimer = 30;  
let xR;
let yR;

//imagens
let imagens = {}
loadImage('Nave');
loadImage("Meteoro 1");
loadImage("Meteoro 2");
loadImage("Meteoro 3");
loadImage("Ovni");

//array de asteroides
let asteroides = [];
let numAsteroides = 5 //numero de asteroides

//ovni
let ovni = new OVNI(ctx, imagens['Ovni'], W, H);;

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
    if (e.key == 'Enter' && !nave.vida){  //quando ficar sem vidas, dar opção de o jogador de voltar a jogar
        location.reload();
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
    spaceTimer--;
    if (spaceTimer == 0){
        clearInterval(timer);
    }
}

/**
 * colisões
 * @param {object} obj1 objeto de colição um 
 * @param {object} obj2 objeto de colição dois
 * @returns 
 */
function colisoes(obj1, obj2) {
    if ((obj1.x + obj1.colisao.x) + (obj1.w + obj1.colisao.w) < (obj2.x + obj2.colisao.x) || 
    (obj1.x + obj1.colisao.x) > (obj2.x + obj2.colisao.x) + (obj2.w + obj2.colisao.w) ||
    (obj1.y + obj1.colisao.y) + (obj1.h + obj1.colisao.h) < (obj2.y + obj2.colisao.y) ||
    (obj1.y + obj1.colisao.y) > (obj2.y + obj2.colisao.y) + (obj2.h + obj2.colisao.h)) {
    return false;
    } 
    else {
        return true;
    }
}

function colisaoTiros(tiro, obj){
    if (tiro.x + tiro.t < (obj.x + obj.colisao.x) || 
        tiro.x > (obj.x + obj.colisao.x) + (obj.w + obj.colisao.w) ||
        tiro.y + tiro.t < (obj.y + obj.colisao.y) ||
        tiro.y > (obj.y + obj.colisao.y) + (obj.h + obj.colisao.h)) {
            return false;
        } 
        else { 
            return true;
        }
}

//criar ovni
function novOVNI(){
    if(!ovni.emJogo){
        ovni.criarOVNI()
    }
}

function tirOVNI(){
    if(ovni.emJogo){
        ovni.disparar(nave.x - nave.w/2, nave.y - nave.h/2)
    }
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

        asteroides.push(new Asteroides(ctx, xInit, yInit, direcao, imagens['Meteoro 1'], 1, W, H));
    }

    numAsteroides += 2;
}

function destruirAsteroides(index, especial = false) {
    let x = asteroides[index].x;
    let y = asteroides[index].y;
    let estado = asteroides[index].estado;

    if(estado < 3 && !especial){
        estado++

        for (let i = 0; i < 2; i++){
            let direcao = Math.random() * 2 * Math.PI;
            
            asteroides.push(new Asteroides(ctx, x, y, direcao, imagens[`Meteoro ${estado}`], estado, W, H));
        }
    }

    asteroides.splice(index, 1);
}

function carregarEspecial(){
    if(especialTimer == 0) {
        especial = true;
    }
    else if(especialTimer > 0){
        especialTimer--
    }
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
        
        //desaceleração final
        if(upKey == false && primeiroClique == true){
            nave.desaceleracao()
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
            nave.disparar(xR, yR, especial);          
            click = false;

            if(especial){
                especial = false;
                especialTimer = 30;
            }
        }

        if(especialTimer == 30){
            
        }

        // tiro (NAVE) -> asteroides
        for (let t = 0; t < nave.tiros.length; t++){
            for(let a = 0; a < asteroides.length; a++){
                if(colisaoTiros(nave.tiros[t], asteroides[a])){ //quando o tiro entrar na area de colisão do asteroide, eliminar os dois do array
                    //atribuir pontos
                    nave.atribuirPontos(asteroides[a].estado, nave.tiros[t].especial)
                    destruirAsteroides(a, nave.tiros[t].especial)
                    nave.tiros.splice(t, 1);
                    break
                }
            }
        }

        //tiro (NAVE) -> OVNI
        for (let t = 0; t < nave.tiros.length; t++){
            if(ovni.emJogo){            
                if(colisaoTiros(nave.tiros[t], ovni)){ //quando o tiro entrar na area de colisão do OVNI
                    //atribuir pontos
                    nave.atribuirPontos('OVNI', nave.tiros[t].especial)
                    nave.tiros.splice(t, 1);
                    
                    ovni.emJogo = false;
                    break;
                }
            } 
        }

        //tiro (OVNI) -> Nave
        for (let t = 0; t < ovni.tiros.length; t++){            
            if(colisaoTiros(ovni.tiros[t], nave)){ //quando o tiro entrar na area de colisão do OVNI
                ovni.tiros.splice(t, 1);
                nave.perderVida();
                break;
            }
        }

        //nave -> asteroides (colisão)
        for (let a = 0; a < asteroides.length; a++){
            if(colisoes(asteroides[a], nave)){ //quando a nave bate contra o asteroide
                destruirAsteroides(a)
                nave.perderVida();
                break;
            }
        }

        //nave -> ovni (colisão)
        if(ovni.emJogo){
            if(colisoes(ovni, nave, true)){ //quando a nave bate contra o OVNI
                ovni.emJogo = false;
                nave.perderVida();
            }
        }

        // //OVNI -> asteroides (colisão)
        for (let a = 0; a < asteroides.length; a++){
            if(ovni.emJogo){
                if(colisoes(asteroides[a], ovni, true)){ //quando a nave bate contra o asteroide
                    destruirAsteroides(a)
                    
                    ovni.emJogo = false;
                    break;
                }
            }
        }
    }
    else{
        ctx.fillStyle = 'White';
        ctx.textAlign = 'center';
        ctx.font = 'bold 50px sans-serif';
        ctx.fillText(`GAME OVER`, W/2, H/2);
        ctx.font = 'bold 25px sans-serif';
        ctx.fillText(`Press ENTER to play again`, W/2, H/2 + 45);
    }

    if(asteroides.length == 0 && !ovni.emJogo){
        criarAsteroides()
    }

    //desenhar e mover os asteroides
    asteroides.forEach( asteroide => {
        asteroide.draw();
        asteroide.update();
    });

    //desenhar e mover os tiros
    nave.tiros.forEach(tiro =>{
        tiro.draw();
        tiro.update();

        //retirar tiros
        if(tiro.x < 0) nave.tiros.shift()
        else if(tiro.x > W) nave.tiros.shift()
        else if(tiro.y < 0) nave.tiros.shift()
        else if(tiro.y > H) nave.tiros.shift()
    })

    if(ovni.emJogo){
        ovni.draw();
        ovni.update();
        
        if(ovni.x < -ovni.w || ovni.x > W + ovni.w || ovni.y < -ovni.h || ovni.y > H + ovni.h) {
            ovni.emJogo = false
        }
    }

    //desenhar e mover os tiros do OVNI
    ovni.tiros.forEach(tiro =>{
        tiro.draw();
        tiro.update();

        //retirar tiros
        if(tiro.x < 0) ovni.tiros.shift()
        else if(tiro.x > W) ovni.tiros.shift()
        else if(tiro.y < 0) ovni.tiros.shift()
        else if(tiro.y > H) ovni.tiros.shift()
    })
    

    //quantidade de vidas na tela
    ctx.fillStyle = 'White';
    ctx.textAlign = 'left';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText(`LIVES: ${nave.vidas}`, 35, 40);
    
    //pontuação atual do jogador
    ctx.fillText(`SCORE: ${nave.pontos}`, 35, 70);

    //circulo com o tempo até o teleporte
    ctx.beginPath();
    ctx.strokeStyle = 'White';
    ctx.arc(W - 175, H - 60, 50, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.textAlign = 'center';
    ctx.fillText(spaceTimer > 0 ? spaceTimer : 'Space', W - 175, H - 53);

    //circulo com o tempo até a habilidade
    ctx.beginPath();
    ctx.strokeStyle = 'White';
    ctx.arc(W - 75, H - 125, 50, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fillText(especialTimer > 0 ? especialTimer : 'FIRE', W - 75, H - 115);


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

setInterval(novOVNI, 30000);
setInterval(tirOVNI, 1000);
setInterval(carregarEspecial, 1000)

window.onload = () => render()  //chamar a função render depois de carregar a pagina