import Tiros from "./Tiros.js";

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
        this.aX = 0;
        this.aY = 0;
        this.pontos = 0;
        this.pontosVida = 0;
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
        
        if(this.aX <= 10 && this.aY <= 10){
            this.aX += 0.1 ;
            this.aY += 0.1 ;
        }   

        this.x += this.aX * (2 * Math.cos(this.angulo - (90 / 180 * Math.PI)))
        this.y += this.aY * (2 * Math.sin(this.angulo - (90 / 180 * Math.PI)))

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

    disparar(xR, yR, especial){
        let anguloTiro = Math.atan2(yR - this.y, xR - this.x);

        //posição sem rotação da nave
        let xi = this.x + this.w/2 * Math.cos(this.angulo - (90 / 180 * Math.PI));
        let yi = this.y + this.h/2 * Math.sin(this.angulo - (90 / 180 * Math.PI));

        if(!especial){
            this.tiros.push(new Tiros(this.ctx, xi, yi, anguloTiro, 5));
        }
        else{
            this.tiros.push(new Tiros(this.ctx, xi, yi, anguloTiro, 10, true));
        }
        
    }

    atribuirPontos(inimigo, especial){
        let m = 1 //multiplicador de pontos
        if(especial){
            m = 2;
        }

        switch(inimigo){
            case 1:
                this.pontos += 20 * m;
                this.pontosVida += 20 * m;
                break;
            case 2:
                this.pontos += 50 * m;
                this.pontosVida += 50 * m;
                break;
            case 3:
                this.pontos += 100 * m;
                this.pontosVida += 100 * m;
                break;
            case 'OVNI':
                this.pontos += 1000 * m;
                this.pontosVida += 1000 * m;
                break;
        }

        if(this.pontosVida >= 10000){
            this.vidas += 1
            this.pontosVida = 0;
        }
    }

    desaceleracao(){
        console.log(this.aX);
        if(this.aX > 0 && this.aY > 0){
            this.aX -= 0.1 ;
            this.aY -= 0.1 ;
        }
        
        if(this.aX < 0 && this.aY < 0){
            this.aX = 0 ;
            this.aY = 0 ;
        }

        this.x += this.aX * (2 * Math.cos(this.angulo - (90 / 180 * Math.PI)))
        this.y += this.aY * (2 * Math.sin(this.angulo - (90 / 180 * Math.PI)))

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

    perderVida(){
        this.vidas--;
        this.x = this.W / 2;
        this.y = this.H / 2;
        this.angulo = 0;
        this.aX = 0;
        this.aY = 0;

        if(this.vidas == 0){
            this.vida = false;
        }
    }
}