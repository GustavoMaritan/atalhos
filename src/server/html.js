
const $ = require('jquery');
const config = require('./config');

module.exports = {
    setItem,
    setItens
}

// {
// "id": 1,
// "name": "Palavra Chave",
// "icon": "check",
// "type": "spawn",
// "descricao": "",
// "cwd": "E:\\Projetos\\z-testes\\palavra-chave",
// "comandos": [["electron", "."]]
// }

function setItem(item) {
    $('.content-body>.itens').append(
        `<div class="item" data-id="${item.id}" onclick="exec(this)" title="${item.name + (item.descricao ? '\n' + item.descricao : '')}">
            <div class="img">
                <i class="material-icons">${item.icon || 'check'}</i>
            </div>
            <div class="display">
                <div class="text">${item.name} <span></span></div>
            </div>
        </div>
    `);
}

function setItens() {
    let userConfig = config.getUserConfig();
    userConfig.itens.forEach(x => setItem(x));
}