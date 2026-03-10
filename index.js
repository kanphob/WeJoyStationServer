
// * Дополнительные функции расширений стандартных классов
require('./Core/JSExt');

const JSONLoader = require('./Core/JSONLoader');
var ServerLib = require('./Core/ServerMain');


console.log("ANET Server by Pheonix KageDesu");
console.log("");

let settings = JSONLoader.LoadFromFile("Settings.json");

console.log(settings);

_Server = null;
_Server2 = null;

// * HTTP
if(settings.useHttp == true) {
    var server = new ServerLib.ServerMain(settings.port, false, settings.configuration);

    console.log("Start HTTP Server at port: " + settings.port);
    server.start();

    _Server = server;

    // * VChat (Video Chat) signaling handlers
    server.io.on('connection', (socket) => {
        console.log('[VChat] Player connected to VChat layer: ' + socket.id);

        socket.on('vchat_signal', (data) => {
            console.log('[VChat] vchat_signal from ' + socket.id + ' to ' + (data.to || 'unknown'));
            // Forward WebRTC signal to target player
            if (data.to) {
                server.io.to(data.to).emit('vchat_signal', data);
                console.log('[VChat] vchat_signal forwarded to ' + data.to);
            } else {
                console.warn('[VChat] vchat_signal missing "to" field, not forwarded.');
            }
        });

        socket.on('vchat_end', (data) => {
            console.log('[VChat] vchat_end from ' + socket.id + ' to ' + (data.to || 'unknown'));
            // Notify target player that call has ended
            if (data.to) {
                server.io.to(data.to).emit('vchat_end', data);
                console.log('[VChat] vchat_end forwarded to ' + data.to);
            } else {
                console.warn('[VChat] vchat_end missing "to" field, not forwarded.');
            }
        });
    });
}

// * HTTPS
if(settings.useSSL == true) {
    var server = new ServerLib.ServerMain(settings.portForSSL, true, settings.configuration);

    console.log("Start SSL Server at port: " + settings.portForSSL);
    server.start();

    _Server2 = server;

    // * VChat (Video Chat) signaling handlers
    server.io.on('connection', (socket) => {
        console.log('[VChat SSL] Player connected to VChat layer: ' + socket.id);

        socket.on('vchat_signal', (data) => {
            console.log('[VChat SSL] vchat_signal from ' + socket.id + ' to ' + (data.to || 'unknown'));
            // Forward WebRTC signal to target player
            if (data.to) {
                server.io.to(data.to).emit('vchat_signal', data);
                console.log('[VChat SSL] vchat_signal forwarded to ' + data.to);
            } else {
                console.warn('[VChat SSL] vchat_signal missing "to" field, not forwarded.');
            }
        });

        socket.on('vchat_end', (data) => {
            console.log('[VChat SSL] vchat_end from ' + socket.id + ' to ' + (data.to || 'unknown'));
            // Notify target player that call has ended
            if (data.to) {
                server.io.to(data.to).emit('vchat_end', data);
                console.log('[VChat SSL] vchat_end forwarded to ' + data.to);
            } else {
                console.warn('[VChat SSL] vchat_end missing "to" field, not forwarded.');
            }
        });
    });
}