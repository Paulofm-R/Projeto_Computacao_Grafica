import Tiros from "./Tiros.js";

//definição dos OVNI
export default class OVNI{
    constructor(ctx, imagem, W, H){
        this.x = 0; 
        this.y = 0; 
        this.dX = 0; //direção do ovni em x
        this.dY = 0; //direção do ovni em y
        this.tiros = [];
        this.colisao = { //correção para as coordenadas de colisao
            x: 7, 
            y: 7, 
            w: -12, 
            h: -12
        }; 
        this.emJogo = false;
        this.img = imagem;
        this.w = imagem.width;
        this.h = imagem.height;
        this.ctx = ctx;
        this.W = W;
        this.H = H;
    }

    draw(){
        //desenhar o OVNI
        this.ctx.beginPath();
        this.ctx.fillStyle = 'blue'
        this.ctx.fillRect(this.x + this.colisao.x, this.y + this.colisao.y, this.img.width + this.colisao.w, this.img.height + this.colisao.h);
        this.ctx.drawImage(this.img, this.x, this.y);  
    }

    update(){
        // atualizar a posição dos ovni
        this.x += this.dX;
        this.y += this.dY;
    }

    criarOVNI(){
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
        
        this.emJogo = true;
    }

    disparar(x, y){
        let anguloTiro = Math.atan2(y - this.y, x - this.x);

        this.tiros.push(new Tiros(this.ctx, this.x + this.w/2, this.y + this.h/2, anguloTiro))
    }
}