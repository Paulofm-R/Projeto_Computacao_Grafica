//definição da nave
export default class Nave{
    constructor(ctx, W, H, imagem){
        this.x = W / 2;
        this.y = H / 2;
        this.w = 80;
        this.h = 75;
        this.imagem = imagem;
        this.vida = true;
        this.vidas = 3;
        this.angulo = 0;
        this.rotacao = 0;
        this.colisao = { //correção para as coordenadas de colisao
            x: -30, 
            y: -30, 
            w: -20, 
            h: -10
        }; 
        this.tiros = [];
        this.acelerar = false;
        this.aceleracao = {
            x: 0,
            y: 0
        }
        this.pontos = 0;
        this.ctx = ctx;
        this.W = W;
        this.H = H;
    }

    desenhar(){
        this.angulo += this.rotacao
        
        this.ctx.save()
        this.ctx.translate(this.x,this.y)
        this.ctx.rotate(this.angulo)
        this.ctx.drawImage(this.imagem, -this.w/2, -this.h/2, this.w, this.h);
        this.ctx.restore()
    }

    mover(){
        this.x += 5 * Math.cos(this.angulo - (90 / 180 * Math.PI));
        this.y += 5 * Math.sin(this.angulo - (90 / 180 * Math.PI));

        if (this.y < -this.h){
            this.y = this.H;
        }
        if (this.y > this.H + this.h/2){
            this.y = -this.h/2;
        }
        if (this.x > this.W + this.w/2){
            this.x = -this.w/2;
        }
        if (this.x < -this.w){
            this.x = this.W;
        }
    }
}