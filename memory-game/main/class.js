export class User { // classe User para a criação de usuário ('export' antes da criação para podemos exportar para o script.js) 
    constructor(codigo, name, difficulty, time) { // toda classe precisa de um construtor (pois é um molde), nesse caso ela receberá um código, nome, dificuldade e tempo
        this.codigo = codigo; // o código do objeto que for criado na instância (this) terá o código que será recebido quando for criar a instância
        this.name = name; // mesma coisa para todas as propriedades abaixo
        this.difficulty = difficulty;
        this.time = time;
    }
}