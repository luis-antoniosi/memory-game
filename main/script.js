const cards = document.querySelectorAll('.memory-card');

function virarCarta() {
    this.classList.toggle('flip');
}

cards.forEach(card => card.addEventListener('click', virarCarta))