import Tiros from "./Tiros.js";

//definição dos OVNI
export default class OVNI{
    constructor(ctx, imagem, W, H){
        this.x = 0; //posição da ovni em x
        this.y = 0; //posição da ovni em y
        this.dX = 0; //direção do ovni em x
        this.dY = 0; //direção do ovni em y
        this.tiros = []; //array para guardar todos tiros do ovni
        this.colisao = { //correção para as coordenadas de colisao
            x: 7, 
            y: 7, 
            w: -12, 
            h: -12
        }; 
        this.emJogo = false; //se o onvi esta vivo ou não
        this.img = imagem;
        this.w = 170; //largura
        this.h = 80; //altura
        this.ctx = ctx;
        this.W = W;
        this.H = H;
    }

    /**
     * Desenhar o OVNI
     */
    draw(){
        this.ctx.drawImage(this.img, this.x, this.y, this.w, this.h);  
    }

    /**
     * Atualizar a posição dos ovni
     */
    update(){
        this.x += this.dX;
        this.y += this.dY;
    }

    /**
     * Criar um novo OVNI
     */
    criarOVNI(){
        //direção do ovni
        let direcao = Math.random() * 2 * Math.PI;
        this.dX = 2 * Math.cos(direcao);
        this.dY = 2 * Math.sin(direcao);

        //diferenciar a posição inical do OVNI dependedo da direção
        if(direcao < 1 || direcao > 5){
            this.x = -this.w;
            this.y = Math.random() * this.H + this.h;
        }
        else if(direcao < 2) {
            this.x = Math.random() * this.W - this.w;
            this.y = -this.h;
        }
        else if (direcao < 4){
            this.x = this.W;
            this.y = Math.random() * this.H;
        }
        else {
            this.x = Math.random() * this.W;
            this.y = this.H;
        }
        
        this.emJogo = true; //dizer que o ovni esta dentro do canvas
    }

    /**
     * 
     * @param {float} x posição atual da nave em x
     * @param {float} y posição atual da nave em y
     */
    disparar(x, y){
        let anguloTiro = Math.atan2(y - this.y, x - this.x);

        this.tiros.push(new Tiros(this.ctx, this.x + this.w/2, this.y + this.h/2, anguloTiro, 5))
    }
}