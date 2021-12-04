//definição dos tiros
export default class Tiros{
    constructor(ctx, x, y, anguloTiro, t, especial = false){
        this.x = x; //posisão do tiro em x
        this.y = y; //posisão do tiro em y
        this.c = 'White'; //cor do tiro
        this.t = t; //tamanho do tiro
        this.especial = especial; //tiro especial
        this.dX = 4 * Math.cos(anguloTiro); //direção do tiro em x
        this.dY = 4 * Math.sin(anguloTiro); //direção do tiro em y 
        this.distancia = 0 //distancia percorrida pelo tiro
        this.ctx = ctx;
    }

    draw(){
        //desenhar o tiro
        this.ctx.fillStyle = this.c;
        this.ctx.beginPath();
        this.ctx.fillRect(this.x, this.y, this.t, this.t);
    }

    update(){
        //disparar para o local em que o rato está localizado
        this.x += this.dX
        this.y += this.dY

        //calcular a distancia percorrida pelo tiro
        this.distancia += Math.sqrt(Math.pow(this.dX, 2) + Math.pow(this.dY, 2));
    }
}