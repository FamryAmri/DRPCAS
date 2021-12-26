var config = require('./config.json');
var pin = randpin();

/*
        !! DANGER ZONE !!
    
    THIS ARE FULLY SECRET, DO NOT
    EDIT ANYTHING AND COPY MY CODE
    BECAUSE THIS CONTAINS ALL OF MY
    APPLICATION OF CLIENT_ID AND 
    CLIENT_SECRET. YOU CAN USE IT 
    FOR FREE AS A DEFAULT CONFIG.
    YOU CAN CHANGE ON config.json
    FOR YOUR OWN APPLICATION.
*/
if (!config.CLIENT_ID) config.CLIENT_ID = default_config('MDFkYTJmNC5JRA', parseInt(Buffer.from('MTMyNDQ', 'base64').toString('ascii')), pin);
if (!config.CLIENT_SECRET) config.CLIENT_SECRET = default_config('MjNtZGFvLlNFQ1JFVA', parseInt(Buffer.from('MTMyNDQ', 'base64').toString('ascii')), pin);
if (!config.TRANSPORT) config.TRANSPORT = 'ipc';

function randpin() {
    return Math.floor(Math.random() * (9999 - 1111) + 1111);
}

function default_config(type, code=null, pincode=0000){
    let unlimted = 999999999999999999;
    let d = ('eyJpZCI6IkNBVURBQVlIQmdVRkJnUURCQWNDQndZTCIsInNlY3JldCI6IlkwVUdVRVJtUXdwOGZBQkRjV2RlVkhKUUFWdENEd2RFZVdNSGZIOUJYMkU9In0;AAQAAwI').split(';');
    let t = (a, b) => {return String.fromCodePoint(...(Buffer.from(a.replace(/\//g, '_').replace(/\+/g, '-'), 'base64').toString()).split('').map((char, i) => char.charCodeAt(0) ^ b.toString().charCodeAt(i % b.toString().length)))}
    let k = parseInt(t(d[1], code)) + 1;
    let g = JSON.parse(Buffer.from(d[0], 'base64').toString('ascii'));
    type = Buffer.from(type, 'base64').toString('ascii').split('.');
    var w = Math.floor(Math.random() * (unlimted - 111111111111111111) + 111111111111111111).toString();
    if(!(type.length > 1)) return w;
    if(pincode!==pin) return w; 
    if(g[type[1].toLowerCase()]) return t(g[type[1].toLowerCase()], k);
    return null;
}

module.exports = config;