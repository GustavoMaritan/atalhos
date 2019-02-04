
const fs = require('fs');
const JQ = require('jquery');
const path = require('path');
const { spawn, execFileSync } = require('child_process');

const _path_config = './configs/config.json';
const _path_user = './configs/user';
const _types = ['bat', 'spawn', 'file'];

module.exports = {
    exec: execute
}

function execute(idCommand, options) {
    console.log(idCommand)

    let comando = _getCommand(idCommand);
    console.log(comando)
    options.prepare && options.prepare(comando);
    funcs[comando.type](comando, options);
}

const funcs = {
    bat(comm, options) {
        let command = comm.comandos.join('\n\r\n\r');
        fs.writeFileSync('./temp/temp.bat', command);
        _spawn({
            command: 'cmd.exe',
            args: ['/C', path.join(__dirname, '../../temp', 'temp.bat')],
            detached: true,
            stdout: (data) => {
                console.log(data.toString())
                options.stdout && options.stdout(data);
            },
            stderr: (data) => {
                console.log(data.toString())
                options.stderr && options.stderr(data);
            },
            close: (code) => {
                fs.unlinkSync('./temp/temp.bat');
                options.close && options.close(code);
            }
        })
    },
    spawn(comm, options) {
        let $spawn = (coms) => {
            let comando = coms.splice(0, 1)[0];
            _spawn({
                command: comando.splice(0, 1)[0],
                cwd: comm.cwd,
                args: comando,
                stdout: (data) => {
                    console.log(data.toString())
                    options.stdout && options.stdout(data);
                },
                stderr: (data) => {
                    console.log(data.toString())
                    options.stderr && options.stderr(data);
                },
                close: (code) => {
                    if (coms.length) return $spawn(coms);
                    options.close && options.close(code);
                }
            })
        }
        $spawn(comm.comandos);
    },
    file(comm, options) {
        _spawn({
            command: comm.file,
            cwd: comm.cwd,
            args: [],
            stdout: (data) => { options.stdout && options.stdout(data); },
            stderr: (data) => { options.stderr && options.stderr(data); },
            close: (code) => { options.close && options.close(code); }
        })
    }
}

function _spawn(option) {
    let ls = spawn(option.command, option.args || [], {
        cwd: option.cwd,
        shell: true,
        detached: option.detached
    });
    ls.stdout.on('data', (data) => {
        option.stdout && option.stdout(data);
    });
    ls.stderr.on('data', (data) => {
        option.stderr && option.stderr(data);
    });
    ls.on('close', (code) => {
        option.close && option.close(code);
    });
}

function _getConfig() {
    let conf = fs.readFileSync(_path_config, 'utf8');
    if (!conf)
        return console.log('Configuração não encontrada.');
    return JSON.parse(conf);
}

function _getUserConfig(idCommand) {
    let conf = fs.readFileSync(path.join(_path_user, `${idCommand}.json`), 'utf8');
    if (!conf)
        return console.log('Configuração usuário não encontrada.');
    return JSON.parse(conf);
}

function _getCommand(idCommand) {
    let conf = _getConfig();
    let userConf = _getUserConfig(conf.configOn);
    console.log(userConf)
    let command = userConf.itens.find(x => x.id == idCommand);
    if (!command) {
        console.log('Comando não encontrado.');
        return
    }
    return command;
}