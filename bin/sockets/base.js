var config = require('../../server/config');
module.exports = function (io) {
	'use strict';
	var connections = [];
	var USERS = [];
	io.on('connection', function (socket) {
		config.socketUSER = socket;
		socket.on('sendMessage', function (data) {
			config.socketUSER = socket;
		});
	});
};