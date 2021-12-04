//definição dos asteroides
export default class Asteroides{
    constructor(ctx, x, y, d, img, estado, W, H){
        this.x = x; //posisão do asteroide em x
        this.y = y; //posisão do asteroide em y
        this.dX = 2 * Math.cos(d); //direção do asteroide em x
        this.dY = 2 * Math.sin(d); //direção do asteroide em y
        this.img = img; //imagem do asteroide
        this.estado = estado;  //se esta no 1/2/3 estado de tamanho
        this.colisao = { //correção para as coordenadas de colisao
            x: 5, 
            y: 5, 
            w: -10, 
            h: -10
        }; 
        this.w = img.width; //largura
        this.h = img.height; //altura
        this.ctx = ctx;
        this.W = W;
        this.H = H;
    }

    draw(){
        //desenhar os asteroides
        this.ctx.drawImage(this.img, this.x, this.y);    
    }

    update(){
        //quando o asteroide passar o limite do canvas, passar para o outro lado
        if (this.x < -this.w) this.x = this.W
        if (this.x > this.W) this.x = -this.w
        if (this.y < -this.h)  this.y = this.H
        if (this.y > this.H) this.y = -this.h

        // atualizar a posição dos asteroides
        this.x += this.dX;
        this.y += this.dY;
    }
}