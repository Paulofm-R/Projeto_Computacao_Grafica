//definição dos OVNI
export default class OVNI{
    constructor(ctx, x, y, d, imagem){
        this.x = x; 
        this.y = y; 
        this.dX = 2 * Math.cos(d); //direção do ovni em x
        this.dY = 2 * Math.sin(d); //direção do ovni em y
        this.img = imagem;
        this.ctx = ctx;
    }

    draw(){
        //desenhar o OVNI
        this.ctx.beginPath();
        this.ctx.fillStyle = 'blue'
        this.ctx.fillRect(this.x, this.y, this.img.width, this.img.height);
        this.ctx.drawImage(this.img, this.x, this.y);  
    }

    update(){
        // atualizar a posição dos ovni
        this.x += this.dX;
        this.y += this.dY;
    }
}