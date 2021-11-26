//definição da nave
export default class Nave{
    constructor(ctx, W, H, imagem){
        this.x = W / 2,
        this.y = H / 2,
        this.w = 80,
        this.h = 75,
        this.imagem = imagem,
        this.vida = true,
        this.vidas = 5,
        this.angulo = 0,
        this.colisao = {x: -30, y: -30, w: -20, h: -10}, //correção para as coordenadas de colisao
        this.tiros = [],
        this.ctx = ctx,
        this.W = W,
        this.H = H
    }

    desenhar(){
        this.ctx.save()
        this.ctx.translate(this.x,this.y)
        this.ctx.rotate(this.angulo*Math.PI/180)
        this.ctx.drawImage(this.imagem, -this.w/2, -this.h/2, this.w, this.h);
        this.ctx.restore()
    }

    mover(){
        let pontaX = 37 * Math.cos(this.angulo);
        let pontaY = 37 * Math.sin(this.angulo);

        
        let direcaoNave = Math.atan2(pontaX - this.x, pontaY + this.y);

        this.x += 2 * Math.cos(direcaoNave);
        this.y += 2 * Math.sin(direcaoNave);

        // if(this.angulo == 0){ //frente
        //     this.y -= 3;
        // }else if((this.angulo<0 && this.angulo>-90) || (this.angulo< 360 && this.angulo > 270)){ // diagonal superior esquerda
        //     this.y -= 3;
        //     this.x -= 3;
        // }else if((this.angulo>0 && this.angulo<90) || (this.angulo> -360 && this.angulo < -270)){ //diagonal superior direita
        //      this.y -= 3;
        //      this.x += 3;
        //  }else if(this.angulo == -90 || this.angulo == 270){ //esquerda
        //     this.x -= 3;
        //  }else if((this.angulo < -90 && this.angulo >- 180) || (this.angulo < 270 && this.angulo > 180)){ //diagonal inferior esquerda
        //     this.y += 3;
        //     this.x -= 3;
        // }else if(this.angulo == 180 || this.angulo == -180){ //baixo
        //     this.y += 3;
        // }else if((this.angulo>90 && this.angulo<180) || (this.angulo> -270 && this.angulo < -180)){ //diagonal inferior direita
        //     this.y += 3;
        //     this.x += 3;
        // }else if(this.angulo == 90 || this.angulo == -270){ //direita
        //     this.x += 3;
        // }

        if (this.y < -this.h){
            this.y = this.H;
        }
        if (this.y > this.H){
            this.y = -this.h;
        }
        if (this.x > this.W){
            this.x = -this.w;
        }
        if (this.x < -this.w){
            this.x = this.W;
        }
    }

    teleportar
}