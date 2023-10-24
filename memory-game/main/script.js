import images from "../data/images.js";

let card = document.querySelector('div.card-base'); // definição da card, card base que será utilizado para clonagem
let game = document.getElementById('game'); // section que possui todos os cards
let primeiraCarta, segundaCarta;
let cartaVirada, trancarTabuleiro = false;
let height, width;
let correctGuesses = 0;
let difficulty;

(function startGame() {

    let buttons = document.querySelectorAll('input');
    var arr = [...buttons];

    arr.forEach((element, index) => {
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
    createBoard(4);
})()

// criar tabuleiro
function createBoard(difficulty) {
    console.log(difficulty);
    clearBoard(); //limpa o tabuleiro antes da criação de outro
    prepare(difficulty);

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

    shuffle();
}

function prepare(difficulty) { //define o tamanho das cartas dependendo da dificuldade do jogo
    switch (difficulty) {
        case 4: // 8 cartas, fácil
            height = (540 * 0.333 - 15) + "px";
            width = (660 * 0.25 - 15) + "px";
            break;
        case 6: // 12 cartas, médio
            height = (540 * 0.333 - 15) + "px";
            width = (660 * 0.25 - 15) + "px";
            break;
        case 10: // 20 cartas, difícil
            height = (540 * 0.333 - 15) + "px";
            width = (660 * 0.25 - 15) + "px";
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
    console.log("clearing...");
    //pega todas as cartas (divs com nome de card) e retorna um NodeList
    document.querySelectorAll("div.card").forEach(item => item.remove()); //  remove cada elemento do array recebido pelo querrySelector
}

// função que vira a carta
function flipCard() {
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
        isMatch(); // verifica se as cartas são iguais
    }
}

function isMatch() {
    if (primeiraCarta.dataset.tipocarta === segundaCarta.dataset.tipocarta) { // se o "data-*" das duas cartas acima forem iguais, ou seja, as cartas são iguais e possuem a mesma imagem
        primeiraCarta.removeEventListener('click', flipCard); //remove os eventListener de cada, para que não possam mais ser viradas
        segundaCarta.removeEventListener('click', flipCard);
        correctGuesses++;
        winOrLose();
        resetCards();
    }
    else { // se não forem iguais
        setTimeout(() => { // espera um tempo (1.5s) e remove a classe 'flip' das duas cartas, fazendo com que voltem ao normal (parte de trás para cima)
            primeiraCarta.classList.remove('flip');
            segundaCarta.classList.remove('flip');
            resetCards();
        }, "1500");
    }
}
    
function winOrLose() {
    console.log(difficulty);
    if (correctGuesses == difficulty) {
        Swal.fire({
            icon: 'success',
            title: 'Good job!',
            text: 'you won the game!',
            backdrop: false
        });
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