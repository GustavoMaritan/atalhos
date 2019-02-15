const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const config = require('./config');
const uuid = require('uuid/v4');

module.exports = {
	exec: execute,
	salvar
};

function execute(idCommand, options) {
	let comando = config.getCommand(idCommand);
	options.prepare && options.prepare(comando);
	funcs[comando.type](comando, options);
}

function salvar(obj) {
	let userConfig = config.getUserConfig();
	obj.id = uuid();
	if (obj.type == 'spawn')
		obj.comandos = obj.comandos.map(x => x.split(' '));
	if (obj.type == 'file') {
		let _caminho = obj.cwd.split('\\');
		obj.file = _caminho.pop();
		obj.cwd = _caminho.join('\\') + '\\';
		obj.comandos = undefined;
	}
	userConfig.itens.push(obj);
	config.updateUserConfig(userConfig);
}

const funcs = {
	bat(comm, options) {
		let command = comm.comandos.join('\n\r\n\r');
		fs.writeFileSync('./temp/temp.bat', command);
		_spawn({
			command: 'cmd.exe',
			args: ['/C', path.join(__dirname, '../../temp', 'temp.bat')],
			detached: true,
			stdout: data => {
				console.log(data.toString());
				options.stdout && options.stdout(data);
			},
			stderr: data => {
				console.log(data.toString());
				options.stderr && options.stderr(data);
			},
			close: code => {
				fs.unlinkSync('./temp/temp.bat');
				options.close && options.close(code);
			}
		});
	},
	spawn(comm, options) {
		let $spawn = coms => {
			let comando = coms.splice(0, 1)[0];
			_spawn({
				command: comando.splice(0, 1)[0],
				cwd: comm.cwd,
				args: comando,
				stdout: data => {
					console.log(data.toString());
					options.stdout && options.stdout(data);
				},
				stderr: data => {
					console.log(data.toString());
					options.stderr && options.stderr(data);
				},
				close: code => {
					if (coms.length) return $spawn(coms);
					options.close && options.close(code);
				}
			});
		};
		$spawn(comm.comandos);
	},
	file(comm, options) {
		_spawn({
			command: comm.file,
			cwd: comm.cwd,
			args: [],
			stdout: data => {
				options.stdout && options.stdout(data);
			},
			stderr: data => {
				options.stderr && options.stderr(data);
			},
			close: code => {
				options.close && options.close(code);
			}
		});
	}
};

function _spawn(option) {
	let ls = spawn(option.command, option.args || [], {
		cwd: option.cwd,
		shell: true,
		detached: option.detached
	});
	ls.stdout.on('data', data => {
		option.stdout && option.stdout(data);
	});
	ls.stderr.on('data', data => {
		option.stderr && option.stderr(data);
	});
	ls.on('close', code => {
		option.close && option.close(code);
	});
}
