const RPC = require('discord-rpc');
const cmd = require('child_process');
const { CLIENT_ID, CLIENT_SECRET, TRANSPORT, ADB_BIN, AAPT_BIN } = require('./assets/config');
const thispath = __dirname;
const fs = require('fs');

const rpc = new RPC.Client({ transport: TRANSPORT });
const scopes = ['rpc', 'rpc.api'];

// function list
function getForeground (){
    var fore = cmd.execSync(ADB_BIN + ' shell "dumpsys window windows | grep mCurrentFocus"').toString();
    var proc = (fore.split(" ").pop()).split('/')[0];
    return proc;
}

function getDevices (list={}, num=0){
    list.list = [];
    var devices = cmd.execSync(ADB_BIN + ' devices').toString();
    devices = devices.split('\r\n').slice(1, -2);
    devices.forEach(value => {
        var a = value.split('\t');
        list.list.push({
            name: a[0],
            status: a[1]
        });
        num+=1;
    });

    list.total = num;
    return list;
}

function packageOn (package='com.android'){
    var available = require(thispath + '/assets/packages.json');
    var on = available.indexOf(package);
    if (on > -1) return true;
    return false;
}

function getNamePackage (package='com.android'){
    if (!fs.existsSync(`./assets/application/${package}`)) {
        var apkpath = cmd.execSync(ADB_BIN + ` shell "pm list packages -f ${package}"`).toString();
        apkpath = apkpath.split(':')[1].split(`=${package}`)[0];
        cmd.execSync(ADB_BIN + ` pull ${apkpath} ./tmp/${package}.apk`);

        var infoapk = cmd.execSync(AAPT_BIN + ` dump badging ./tmp/${package}.apk`).toString();
        infoapk = infoapk.split("application-label:'")[1].split("'")[0];
        fs.writeFileSync('./assets/application/' + package, infoapk);
    } else {
        var infoapk = fs.readFileSync(`./assets/application/${package}`, 'utf-8');
    }
    return infoapk;
}

if (getDevices().total < 1){
    console.log("Error: no devices found");
    process.exit();
} else if (getDevices().total > 1){
    console.log("Error: couldn't not connect more than 1");
    process.exit();
} else if (getDevices().list[0].status !=='device'){
    console.log("Error: couldn't not connected");
    process.exit();
}

// this function copied from sites
function validateIp (ipaddress){
    ipaddress = ipaddress.split(":")[0];
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) return (true);
    return false;
}

// prepare activity
function setStatus(game, options={ time: true }, s={}){ 
    s.details = game;
    if (options.time) s.startTimestamp = Date.now();
    rpc.setActivity(s);
    return true;
}

rpc.on('ready', async () => {
    console.log('Auth to ' + rpc.user.username);
    console.log('PID: ' + process.pid);
    console.log('Connection Name: ' + getDevices().list[0].name);
    if (validateIp(getDevices().list[0].name)) console.log('Warning: you are using wireless mode. make sure that you are using 5Ghz');
    console.log("\nTips: Press 'CTRL + C' to stop running...");

    var lastrunpackage;
    lastrunpackage = '';
    // set activity 
    setInterval(() => {
        var run = getForeground();
        var packON = packageOn(run);

        if (!packON){ 
            if (lastrunpackage=='idle') return;
            lastrunpackage = 'idle';
            return setStatus('idle'); // edit assets/packages.json to add more
        } else {
            if (lastrunpackage==run) return;
            lastrunpackage = run;
            var name = getNamePackage(run);
            return setStatus(name);
        }
    }, 9000);
    // rpc.selectVoiceChannel('633131564053561352');
});

rpc.login({ clientId: CLIENT_ID, clientSecret: CLIENT_SECRET});