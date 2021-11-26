//definição dos tiros
export default class Tiros{
    constructor(ctx, x, y, anguloTiro){
        this.x = x; //posisão do tiro em x
        this.y = y; //posisão do tiro em y
        this.c = 'White'; //cor do tiro
        this.t = 5; //tamanho do tiro
        this.dX = 3 * Math.cos(anguloTiro); //direção do tiro em x
        this.dY = 3 * Math.sin(anguloTiro); //direção do tiro em y 
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
    }
}