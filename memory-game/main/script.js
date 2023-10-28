import images from "../data/images.js";  // importa todas as imagens de data/images.js
import { User } from "./class.js"; // importa classe User de class.js

// querrySelector retorna o primeiro elemento que achar que possui tal chave ou classe especificada, querrySelectorAll retorna todos os elementos como NodeList (array)
let card = document.querySelector('div.card-base'); // definição da card, div com classe de 'card-base' que será o molde das outras cartas
let game = document.getElementById('game'); // section que possui todos as cartas (cards)
let buttons = document.querySelectorAll('input');
let reset = document.getElementById('resetButton');
let primeiraCarta, segundaCarta;
let cartaVirada, trancarTabuleiro, foiExecutada = false;
let height, width, difficulty, nivel;
let cartasCertas, duration, codigo = 0;

reset.addEventListener('click', () => {location.href = '/MemoryGame/start/login.html'});

function randomize(images) { //randomiza as imagens
    let index = images.length, randomIndex;
    
    // enquanto ter indexes para randomizar
    while (index != 0) {
      // selecionar um index aleatório (número máximo é a quantidade restante de indexes a serem reposicionados)
      randomIndex = Math.floor(Math.random() * index);
      index--;
  
      // troca o index atual com o novo index randomizado (troca um pelo lugar do outro)
      [images[index], images[randomIndex]] = [images[randomIndex], images[index]]; //uso de 'Destructuring assignment' para atribuir valores
    }
  
    return images; //retorna o novo array randomizado
}

(function startGame() {
    var arr = [...buttons];

    arr.forEach((element, index) => { // funcionamento dos botões de dificuldade
            element.addEventListener("click", () => {
            element.style.opacity = "1";
            difficulty = parseInt(element.dataset.max);
            createBoard(difficulty);
            arr
            .filter(function (item) {
                return item != element;
            })
            .forEach((item) => {
                item.style.opacity = "0";
            });
        });
    });
    buttons[0].click(); //simulamos um click para rodar a função 1 vez para o programa definir o valor da dificuldade
    createBoard(difficulty); //o click no botão executa a função de criação do tabuleiro
})()



// criar tabuleiro
function createBoard(difficulty) {
    cartasCertas = 0; //redefine o número de cartas certas quando o tabuleiro é criado
    foiExecutada = false; //condição que define se os botões para a troca de dificuldade vão estar desativados ou ativados
    randomize(images); // cada tabuleiro novo, randomizamos o tabuleiro
    clearBoard(); //limpa o tabuleiro antes da criação de outro
    prepare(difficulty); // linha 78

    if (difficulty == 10) { // define um tamanho (largura e altura) específico para a section (game) que possui todas as cartas, no díficil
        game.style.width = 800 + "px";
    }
    else
        game.style.width = 660 + "px";
    // card -> card base
    card.style.height = height; 
    card.style.width = width;

    for (let i = 0; i < difficulty; i++) {
        createCard(i, card.cloneNode(true)); // loop que clona a carta base e cria todas as cartas baseada no parâmetro data-max (max = 4 => nº de cartas é 8) 
    }

    shuffle(); // reorganiza as cartas (linha 173)
}

function prepare(difficulty) { //define o tamanho das cartas (height e width), string do nível, e a duração dependendo da dificuldade do jogo
    switch (difficulty) {
        case 4: // 8 cartas, fácil
            height = (540 * 0.333 - 15) + "px";
            width = (660 * 0.25 - 15) + "px";
            duration = 30;
            nivel = "fácil";
            break;
        case 6: // 12 cartas, médio
            height = (540 * 0.333 - 15) + "px";
            width = (660 * 0.25 - 15) + "px";
            duration = 60;
            nivel = "médio";
            break;
        case 10: // 20 cartas, difícil
            height = (540 * 0.333 - 15) + "px";
            width = (660 * 0.25 - 15) + "px";
            duration = 60 * 1.5;
            nivel = "difícil";
            break;
    }
}

// função para criação de cartas
function createCard(i, item) {
    item.children[0].src = images[i].image; // altera a primeira imagem da carta (div) baseada no index i (como a carta é uma div, possui children, que acessamos com o index [0], nesse caso)
    item.dataset.tipocarta = images[i].card; // altera o data-tipocarta da carta, que é o mesmo index da imagem
    item.style.display = "";
    item.classList.toggle("card-base"); //tira a classe card-base da carta (pois é um clone de 'card', que é a carta base)
    item.classList.toggle("card"); //adiciona a classe card

    addCardToBoard(item); //adiciona a carta (div) criada acima ao tabuleiro (section chamada de game)
    addCardToBoard(item.cloneNode(true)); //adiciona um clone da carta criada para o tabuleiro (duas cartas iguais em um jogo da memória)
}

function addCardToBoard(item) {
    item.addEventListener('click', flipCard); //adiciona um event listener para cada carta
    // ver linha 59
    game.appendChild(item);
}

function clearBoard() { //limpa o tabuleiro
    //pega todas as cartas (divs com nome de card) e retorna um NodeList
    document.querySelectorAll("div.card").forEach(item => item.remove()); // remove cada elemento do array recebido pelo querySelector
}

// função que vira a carta
function flipCard() {
    if (!foiExecutada) {
        buttons.forEach(botao => {
            botao.disabled = true; // desativa todos botões de dificuldade quando a primeira carta for virada (para não poder mudar de dificuldade no meio do jogo)
        });
        startTimer(); // começa o timer (linha 181)
        foiExecutada = true;
    }
    if (trancarTabuleiro) // se o tabuleiro está trancada, isso é, duas cartas foram viradas, não é possível virar outras cartas antes delas serem desviradas
        return;
    if (this === primeiraCarta) // se a carta que foi clicada é a mesma da carta que já foi clicada, a função para aqui
        return;
    
    this.classList.add('flip'); // adiciona a classe 'flip' a carta para poder girar a carta 
    
    if (!cartaVirada) { // se cartaVirada for false
        primeiraCarta = this; // a primeira carta é a que disparou a função
        cartaVirada = true; // cartaVirada vira true para podemos distinguir essa carta e a segunda carta
    }  
    else { // se cartaVirada for true, ou seja, a primeiraCarta já foi definida
        segundaCarta = this; // a segunda carta é a carta que disparou o evento
        cartaVirada = false; // cartaVirada agora é false para redefinir as cartas
        trancarTabuleiro = true; // tabuleiro é trancado para não poder clicar em outras cartas
        isMatch(); // verifica se as cartas são iguais (linha 153)
    }
}

function isMatch() {
    if (primeiraCarta.dataset.tipocarta === segundaCarta.dataset.tipocarta) { // se o "data-*" das duas cartas acima forem iguais, ou seja, as cartas são iguais e possuem a mesma imagem
        primeiraCarta.removeEventListener('click', flipCard); //remove os eventListener de cada, para que não possam mais ser viradas
        segundaCarta.removeEventListener('click', flipCard);
        cartasCertas++;
        resetCards(); //linha 171
    }
    else { // se não forem iguais
        setTimeout(() => { // espera um tempo (1.5s) e remove a classe 'flip' das duas cartas, fazendo com que voltem ao normal (parte de trás para cima)
            primeiraCarta.classList.remove('flip');
            segundaCarta.classList.remove('flip');
            resetCards(); //linha 171
        }, "1000");
    }
}

function resetCards() { // redefine todas as varíaveis relacionadas às cartas
    [primeiraCarta, segundaCarta] = [null, null]; 
    [trancarTabuleiro, cartaVirada] = [false, false]; 
}

function shuffle() { // embaralha as cartas
    let cards = document.querySelectorAll("div.card"); // retorna um NodeList com todas as divs (que são as cartas)
    cards.forEach(card => {
        let randomOrder = Math.floor(Math.random() * cards.length);
        card.style.order = randomOrder; // como a section que estão são um flex container, possuem o estilo de order, que define a sua posição no container
    });
}

function startTimer() {
    let display = document.querySelector('#timer'); // selecionamos o 'span' do html que será o temporizador
    let nomeJogador = sessionStorage.getItem('jogador'); // o nome do jogador que foi salvo no sessionStorage é recuperado para receber depois
    var time = duration, minutes, seconds;
    var cronometro = setInterval(function () {
        minutes = parseInt(time / 60, 10);
        seconds = parseInt(time % 60, 10);
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        display.innerHTML = minutes + ":" + seconds;
        if (--time < 0 && cartasCertas != difficulty) { // caso o tempo acabar ou o número de cartas certas não for o número de cartas totais no tabuleiro -> derrota
            clearInterval(cronometro); // para o cronômetro
            Swal.fire({ // mostra um alerta do SweetAlert2 que mostra a derrota
                icon: 'error',
                title: 'Derrota',
                text: `${nomeJogador}, você perdeu no modo ${nivel} :(`,
                backdrop: false
            });
            buttons.forEach(botao => { // ativamos a habilidade de mudar a dificuldade (clicar nos botões) após o fim do jogo
                botao.disabled = false;
            });
        }
        else if (cartasCertas == difficulty) {  // se o número de cartas certas for igual ao número de cartas no tabuleiro (dificuldade (4, 6, 10)) -> vitória
            clearInterval(cronometro); // para o cronômetro
            Swal.fire({ // mostra um alerta modificado (SweetAlert2 que foi importado)
                icon: 'success',
                title: `Parabéns ${nomeJogador}!`,
                text: `Você ganhou! ${display.innerHTML} segundos restantes no ${nivel}`,
                backdrop: false
            });
            buttons.forEach(botao => { // ativamos a habilidade de mudar a dificuldade (clicar nos botões) após o fim do jogo
                botao.disabled = false; // não é mais desabilitado
            });
            saveUser(nomeJogador, nivel, display.innerHTML); //rodamos a função de salvar usuário com o nome, dificuldade atual (nivel) e o tempo restante
        }
    }, 1000);
}

function saveUser(nome, nivel, tempo) {    // função que salvará o usuário que jogou o jogo
    codigo = Number(localStorage.getItem('codigo')); // terá um código salvo no localStorage que será recuperado aqui
    if (codigo == null) // se o código não existir, considerar como 0
        codigo = 0;

    codigo++; // adicionar mais 1 (se código é 0, vira 1, se é 1, vira 2)
    const user = new User(codigo, nome, nivel, tempo); // criar uma nova constante chamada de user, em base da classe User (ver class.js), com o código, nome, dificuldade e tempo restante
    const info = JSON.stringify(user); // constante info que é o usuário (objeto) só que em forma de string (porque se não, não é possível salvar)
    localStorage.setItem(nome, info); // salvar no localStorage uma informação com o nome do usuário, com as informações que foram transformadas em string acima
    localStorage.setItem('codigo', codigo); // salvar o código no localStorage para recuperar na criação do próximo usuário
}
