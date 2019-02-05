const fs = require('fs');
const path = require('path');
const _path_config = './configs/config.json';
const _path_user = './configs/user';
const types = ['bat', 'spawn', 'file'];

module.exports = {
    types,
    getCommand,
    getUserConfig,
    getConfig
};

function getConfig() {
    let conf = fs.readFileSync(_path_config, 'utf8');
    if (!conf) return console.log('Configuração não encontrada.');
    return JSON.parse(conf);
}

function getUserConfig() {
    let conf = getConfig();
    let userConf = fs.readFileSync(path.join(_path_user, `${conf.configOn}.json`), 'utf8');
    if (!userConf) return console.log('Configuração usuário não encontrada.');
    return JSON.parse(userConf);
}

function getCommand(idCommand) {
    let userConf = getUserConfig();
    let command = userConf.itens.find(x => x.id == idCommand);
    if (!command) {
        console.log('Comando não encontrado.');
        return;
    }
    return command;
}