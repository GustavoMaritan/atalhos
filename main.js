const electron = require('electron'),
	server = require('./src/server/app'),
	Promise = require('promise'),
	notifier = require('node-notifier'),
	{
		app,
		BrowserWindow,
		ipcMain,
		Notification,
		dialog,
		Tray,
		Menu
	} = electron;

if (handleSquirrelEvent(app)) { return; }

const path = require('path')
const url = require('url')
const fs = require('fs')
let isQuiting = false;
app.showExitPrompt = true
let mainWindow,
	iconPath = 'resources/icon3.ico';

function newWindow() {
	new BrowserWindow({
		titleBarStyle: 'hidden',
		width: 500,
		minWidth: 0,
		height: 200,
		minHeight: 0,
		darkTheme: true
	});
}

function createWindow() {
	mainWindow = new BrowserWindow({
		titleBarStyle: 'hidden',
		width: 600,
		minWidth: 0,
		height: 800,
		minHeight: 0,
		icon: __dirname + '/' + iconPath,
		darkTheme: true,
		movable: true,
		frame: false,
		transparent: true,
		opacity: 0.7
	});

	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'src/index.html'),
		protocol: 'file:',
		slashes: true
	}));

	ipcMain.on('open', function (e, x, y) {
		mainWindow.setSize(x, y);
		mainWindow.setOpacity(1);
	});

	ipcMain.on('close', function (e, x, y) {
		mainWindow.setSize(x, y);
		mainWindow.setOpacity(0.7);
	});

	ipcMain.on('openDevTools', function (e, x, y) {
		mainWindow.webContents.openDevTools()
	});

	function notifyState() {
		notifier.notify({
			title: 'Info',
			message: 'App continua em execusão.',
			icon: path.join(__dirname, iconPath),
			sound: false
		});
		mainWindow.flashFrame(true);
	}

	let tray = new Tray(__dirname + '/' + iconPath);

	var contextMenu = Menu.buildFromTemplate([
		{
			label: 'Abrir',
			//icon: __dirname + '/resources/icon.png',
			accelerator: 'CmdOrCtrl+R',
			click: function () {
				mainWindow.show();
			}
		},
		{
			type: 'separator'
		},
		{
			label: 'Sair',
			//type: 'radio',
			click: function () {
				isQuiting = true;
				app.quit();
			}
		}
	]);

	tray.setToolTip('Auto Pblish');
	tray.setContextMenu(contextMenu);
	//mainWindow.setKiosk(true) // TELA CHEIA
	mainWindow.setAutoHideMenuBar(true)
	mainWindow.setMenuBarVisibility(false)

	//mainWindow.webContents.openDevTools();

	mainWindow.on('close', (e) => {
		app.quit();
		mainWindow = null;
		return;

		if (!isQuiting) {
			e.preventDefault()
			mainWindow.hide();
			notifyState();
		} else {
			app.quit();
			mainWindow = null;
		}
	})

	mainWindow.on('minimize', function (event) {
		return;
		event.preventDefault();
		mainWindow.hide();
		notifyState();
	});
}

app.on('ready', async () => {
	createWindow();
});

app.on('window-all-closed', function (event) {
	event.preventDefault();
	if (process.platform !== 'darwin') {
		app.quit()
	}
});

app.on('activate', function () {
	if (mainWindow === null) {
		createWindow()
	}
});

app.on('activate-with-no-open-windows', function () {
	mainWindow.show();
});

//INSTALLER
function handleSquirrelEvent(application) {
	if (process.argv.length === 1) {
		return false;
	}

	const ChildProcess = require('child_process');
	const path = require('path');

	const appFolder = path.resolve(process.execPath, '..');
	const rootAtomFolder = path.resolve(appFolder, '..');
	const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
	const exeName = path.basename(process.execPath);

	const spawn = function (command, args) {
		let spawnedProcess, error;

		try {
			spawnedProcess = ChildProcess.spawn(command, args, {
				detached: true
			});
		} catch (error) { }

		return spawnedProcess;
	};

	const spawnUpdate = function (args) {
		return spawn(updateDotExe, args);
	};

	const squirrelEvent = process.argv[1];
	switch (squirrelEvent) {
		case '--squirrel-install':
		case '--squirrel-updated':
			// Optionally do things such as:
			// - Add your .exe to the PATH
			// - Write to the registry for things like file associations and
			//   explorer context menus

			// Install desktop and start menu shortcuts
			spawnUpdate(['--createShortcut', exeName]);

			setTimeout(application.quit, 1000);
			return true;

		case '--squirrel-uninstall':
			// Undo anything you did in the --squirrel-install and
			// --squirrel-updated handlers

			// Remove desktop and start menu shortcuts
			spawnUpdate(['--removeShortcut', exeName]);

			setTimeout(application.quit, 1000);
			return true;

		case '--squirrel-obsolete':
			// This is called on the outgoing version of your app before
			// we update to the new version - it's the opposite of
			// --squirrel-updated

			application.quit();
			return true;
	}
};
