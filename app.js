const fs = require('fs');
const ini = require('ini');
const path = require('path');
const process = require('process');

const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);

const root = process.cwd();
const settings = ini.parse(fs.readFileSync("Settings.ini", 'utf-8'));

const steamExe = path.join(settings.Steam.exepath, 'steam.exe');
const steamCmdPath = path.join(root, 'lib', 'steamcmd');
const steamCmdExe = path.join(steamCmdPath, 'steamcmd.exe');
const steamAppPath = path.join(steamCmdPath, 'steamapps');

let hasErrors = false;
let errorMessage = '';

//Validate Steam Executable
if (!fs.existsSync(steamExe)) {
    hasErrors = true;

    errorMessage += `\nERROR: Steam.exe not found`;
    errorMessage += `\nCheck exepath in Settings.ini\n`;
} 
//Validate Steam App Path
if(!fs.existsSync(settings.Steam.apppath) || !fs.lstatSync(settings.Steam.apppath).isDirectory()) {
    hasErrors = true;

    errorMessage += `\nERROR: Steam App path is not valid`;
    errorMessage += `\nCheck apppath in Settings.ini\n`;
} 
//Validate Apps
if(settings.Downloads.appids.length <= 0) {
    hasErrors = true;

    errorMessage += `\nERROR: No App Ids provided`;
    errorMessage += `\nCheck appids in Settings.ini\n`;
}

//Settings Verified | Run App
if(hasErrors) {
    displayExitMessage();
} else {
    (async () =>{
        displayHeader();

        //Symlink Directory
        await symlinkAppDir();
    
        //Download Apps from App ID
        const apps = settings.Downloads.appids.split(",");
        const appCount = apps.length;

        console.log(`Downloading ${appCount} ${(appCount > 1 ? 'Apps' : 'App')}`);
        await downloadApps(apps);
        
        //Update App Manifest Launcher Path
        console.log(`Updating App Manifests`);

        for await (const app of apps) {
            await updateAppManifestLauncherPath(app);
        };
    
        await fs.unlinkSync(path.join(steamAppPath, 'libraryfolders.vdf'));
        await removeAppDirSymlink();
    })();
}

async function downloadApps(appIds) {
    //Create Login Command Part
    let login = settings.Steam.user.length > 0 ? `+login "${settings.Steam.user}"` : '';
    login += settings.Steam.pass.length > 0 && login != '' ? ` "${settings.Steam.pass}"` : '';

    //Create App Command Parts
    const appUpdate = `+app_update ${appIds.join(' +app_update ')}`;
    const appSubscribe = settings.Options.subscribe == 'true' ? `+app_license_request ${appIds.join(' +app_license_request ')} ` : '';

    //Create Command from Parts
    const cmd = `START "" ${steamCmdExe} ${login} ${appSubscribe}${appUpdate} +quit`;
    
    const { stdout, stderr } = await exec(cmd);
    if(stderr) console.error('stderr:', stderr);
}

async function symlinkAppDir() {
    if(fs.existsSync(steamAppPath))
        await removeAppDirSymlink()

    const cmd = `mklink /D ${steamAppPath} ${settings.Steam.apppath}`;

    const { stdout, stderr } = await exec(cmd);
    if(stderr) {
        errorMessage = "Could not create a link to Steam Apps folder";
        errorMessage += `\nstderr: ${stderr}`;

        displayExitMessage();
    }
}

async function removeAppDirSymlink() {
    const cmd = `rmdir ${steamAppPath}`;

    const { stdout, stderr } = await exec(cmd);
    if(stderr) {
        errorMessage = "Could not remove existing link to Steam Apps folder";
        errorMessage += `\nstderr: ${stderr}`;

        displayExitMessage();
    }
}

async function updateAppManifestLauncherPath(appId) {
    const appManifest = path.join(steamAppPath, `appmanifest_${appId}.acf`);
    fs.readFile(appManifest, 'utf8', function (err,data) {
        if (err) return console.log(err);

        const from = steamCmdExe.replace(/\\/g, '\\\\');
        const to = steamExe.replace(/\\/g, '\\\\');
        const result = data.replace(from, to);

        fs.writeFile(appManifest, result, 'utf8', function (err) {
            if (err) return console.log(err);
        });
    });
}

function displayExitMessage() {
    console.log(errorMessage);
    console.log("Press any key to exit");

    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', process.exit.bind(process, 9));
}

function displayHeader() {
    console.log("Steam Easy Downloader");
    console.log("---------------------");
}