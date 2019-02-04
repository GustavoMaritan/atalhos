const fs = require('fs'),
    { execSync } = require('child_process'),
    path = require('path'),
    Promise = require('promise'),
    rimraf = require('rimraf'),
    installer = require('electron-winstaller');

(async () => {
    try {
        // --ignore=\"(.bin|.vscode)\" 
        // await removeFolder(`./auto_publish-win32-x64`);
        // await removeFolder('./installer');
        // fs.mkdirSync('./installer');
        // execSync(`start cmd.exe /K "electron-packager .\ auto_publish --platform=win32 --arch=x64 --icon=./resources/icon1.icon --prune=true --version=1.4.3 & exit"`);

        var settings = {
            appDirectory: `./mini_player-win32-x64`,
            outputDirectory: './installer',
            authors: 'Gustavo Maritan',
            exe: `./mini_player.exe`,
            name: 'MiniPlayer.exe',
            setupExe:'MiniPlayer.exe',
            iconUrl: path.join(path.resolve(__dirname, '..'), 'resources/icon3.ico'),
            loadingGif: path.join(process.cwd(), 'resources/giphy2.gif'),
            setupIcon: path.join(process.cwd(), 'resources/icon3.ico'),
        };

        console.log("Start installer...");
        await installer.createWindowsInstaller(settings);
        console.log("The installers of your application were succesfully created !");
    } catch (error) {
        console.log(error);
    }
})();

async function removeFolder(folder) {
    return new Promise((res, rej) => {
        rimraf(folder, (err) => {
            if (err) return rej(err);
            res();
        });
    });
}

async function zip() {
    return new Promise((res, rej) => {

    });
}

/*

        //'http://www.iconarchive.com/download/i27126/ph03nyx/super-mario/Luma-Green.ico', // 


        let appName = 'scriptPublish'; // CASO MUDE ALTERAR NO .GITIGNORE
        await removeFolder(`./${appName}-win32-x64`);
        await removeFolder('./installer');
        fs.mkdirSync('./installer');
        execSync(`start cmd.exe /K "electron-packager .\ ${appName} --platform=win32 --arch=x64 --ignore=\"(.bin|.vscode)\" --prune=true --version=1.4.3 & exit"`);

----------------------------------------------------


var zipfile = require('zipfile');
var zf = new zipfile.ZipFile('./test/data/world_merc.zip');
var zip_entry_name = 'world_merc.shp';
var output_file = 'out/world_merc.shp';
zf.copyFile(zip_entry_name,output_file, function(err) {
  if (err) throw err;
  console.log('Successfully wrote ' + output_file);
});


----------------------------------------------------


let resultPromise = 
resultPromise.then(() => {
            console.log("The installers of your application were succesfully created !");
        }, (e) => {
            console.log(`Well, sometimes you are not so lucky: ${e.message}`)
        });
        
                // let cam = path.join(process.cwd(), '/dist-win32-x64/dist.exe');
        // let cam1 = path.join(process.cwd(), '/dist-win32-x64/Scripts Publish.exe');
        //fs.renameSync(cam, cam1);

*/