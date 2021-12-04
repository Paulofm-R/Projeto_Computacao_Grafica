function KeyPressed(e){
    switch(e.key){
        case 'Enter':
            location.href = '../Jogo.html';
    }
}

window.addEventListener('keydown', KeyPressed); //ao clicar no enter, enviar para a pagina de jogo