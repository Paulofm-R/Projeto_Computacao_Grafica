//definição dos asteroides
export default class Asteroides{
    constructor(ctx, x, y, d, img, W, H){
        this.x = x; //posisão do asteroide em x
        this.y = y; //posisão do asteroide em y
        this.dX = 2 * Math.cos(d); //direção do asteroide em x
        this.dY = 2 * Math.sin(d); //direção do asteroide em y
        this.img = img; //imagem do asteroide
        this.w = img.width; //largura
        this.h = img.height; //altura
        this.ctx = ctx;
        this.W = W;
        this.H = H;
    }

    draw(){
        //desenhar os asteroides
        this.ctx.fillStyle = 'blue' //ponto de colição (mudar/remover depois)
        this.ctx.beginPath();
        this.ctx.fillRect(this.x + 5, this.y + 5, this.w - 10, this.h - 10); //ponto de colição (mudar/remover depois)
        this.ctx.drawImage(this.img, this.x, this.y);         
    }

    update(){
        // atualizar a posição dos asteroides
        if (this.x < -120) this.x = this.W
        if (this.x > this.W) this.x = -120
        if (this.y < -68)  this.y = this.H
        if (this.y > this.H) this.y = -68

        this.x += this.dX;
        this.y += this.dY;
    }
}