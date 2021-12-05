import Tiros from "./Tiros.js";

//definição da nave
export default class Nave{
    constructor(ctx, W, H, imagem){
        this.x = W / 2; //posição da nave em x
        this.y = H / 2; //posição da nave em y
        this.w = 80; //largura da nave
        this.h = 75; //altura da nave
        this.imagem = imagem;
        this.vida = true; //se a nave ainda tem vidas disponiveis
        this.vidas = 3; //quantidade de vidas que a nave tem
        this.angulo = 0;  //angulo da nave
        this.rotacao = 0;  //rotacao da nave
        this.colisao = { //correção para as coordenadas de colisao
            x: -30, 
            y: -30, 
            w: -20, 
            h: -10
        }; 
        this.tiros = []; //array para guardar todos tiros da nave
        this.aX = 0; //aceleração da nave em x
        this.aY = 0; //aceleração da nave em y
        this.pontos = 0; //quantidade de pontos da nave
        this.pontosVida = 0; //quantidade de pontos da nave (cada dez mil ponto converte em uma vida)
        this.ctx = ctx;
        this.W = W;
        this.H = H;
    }

    /**
     * Desenhar a nave no canvas
     */
    desenhar(){
        this.angulo += this.rotacao
        
        this.ctx.save()
        this.ctx.translate(this.x,this.y)
        this.ctx.rotate(this.angulo)
        this.ctx.drawImage(this.imagem, -this.w/2, -this.h/2, this.w, this.h);
        this.ctx.restore()
    }

    /**
     * Acelerar a nave ao clicar a tecla W
     */
    aceleracao(){
        if(this.aX <= 8 && this.aY <= 8){
            this.aX += 0.1 ;
            this.aY += 0.1 ;
        }   

        this.mover()
    }

    /**
     * Desacelerar a nave ao largar a tecla W
     */
    desaceleracao(){
        if(this.aX > 0 && this.aY > 0){
            this.aX -= 0.1;
            this.aY -= 0.1;
        }
        else if(this.aX < 0 && this.aY < 0){ //impedir que a aceleracao fique com valores negativos
            this.aX = 0;
            this.aY = 0;
        }

        this.mover()
    }

    /**
     * Mover a nave pelo canvas
     */
    mover(){
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

    /**
     * Disparar ao dar um click no rato
     * @param {float} xR posição do rato em x
     * @param {float} yR posição do rato em y
     * @param {boolean} especial se o tiro é especial ou não
     */
    disparar(xR, yR, especial){
        //direção do tiro
        let direcao = Math.atan2(yR - this.y, xR - this.x);

        //posição sem rotação da nave
        let xi = this.x + this.w/2 * Math.cos(this.angulo - (90 / 180 * Math.PI));
        let yi = this.y + this.h/2 * Math.sin(this.angulo - (90 / 180 * Math.PI));

        if(!especial){
            this.tiros.push(new Tiros(this.ctx, xi, yi, direcao, 5));
        }
        else{
            this.tiros.push(new Tiros(this.ctx, xi, yi, direcao, 10, true));
        }
    }

    /**
     * Atribuir pontos ao destroir asteroides/OVNI
     * @param {*} inimigo Asteroides/OVNI
     * @param {boolean} especial se o tiro é especial ou não
     */
    atribuirPontos(inimigo, especial){
        let m = 1 //multiplicador de pontos
        if(especial){
            m = 2;
        }

        //atribuir pontos consoante o inimigo
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

        //Dar mais uma vida a cada dez mil pontos conseguidos
        if(this.pontosVida >= 10000){
            this.vidas += 1
            this.pontosVida = 0;
        }
    }

    //quando a nave é destruida
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