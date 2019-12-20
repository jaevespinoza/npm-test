'use strict';

var Server = require('../../src/backend/server.js').Server;
var server = Server('8080');
server.listen(function () {
    console.log('server started and listening on port', server.options.port)
});