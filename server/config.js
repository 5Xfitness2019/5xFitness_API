var fs = require('fs');
var parseString = require('xml2js').parseString;
var crypto = require('crypto');

var config = {
	// jwt_secret : '5xfitness',
	socketUSER:  '',
	jwt_secret: 'newage',
	encrypt_pass: 'newagesmb',
	website_baseUrl: '',
	encrypt_algorithm: 'aes-256-cbc',

	//baseUrl: 'http://10.10.10.41:7071/',
	baseUrl: 'http://newagesme.com:7071/',


	getConfig: function (callback) {
		fs.readFile('config.xml', function (err, data) {
			parseString(data, function (err, result) {
				console.log(result, err);
				callback(result.preferences);
			});
		});
	},

	encryptPassword: function (password) {
		var text = password;
		var cipher = crypto.createCipher('aes-256-cbc', 'touristtracker');
		var crypted = cipher.update(text, 'utf8', 'hex');
		crypted += cipher.final('hex');
		return crypted;
	},
	passwordRecoveryCode: function () {
		var alphabet = "0123456789";
		var pass = [];
		var alphaLength = (alphabet.length) - 1;

		for (var i = 0; i < 4; i++) {
			var n = Math.floor(Math.random() * (alphaLength - 0 + 1)) + 0;
			pass.push(alphabet[n]);
		}

		var code = pass.join("");
		return code;
	},
	generateOPT: function () {
		var alphabet = "0123456789";
		var pass = [];
		var alphaLength = (alphabet.length) - 1;

		for (var i = 0; i < 4; i++) {
			var n = Math.floor(Math.random() * (alphaLength - 0 + 1)) + 0;
			pass.push(alphabet[n]);
		}

		var code = pass.join("");
		return code;
	},
	generateTime: function () {
		var date = new Date();
		var time = Number(date);
		return time;
	},
	generateToken: function () {
		var alphabet = "0123456789";
		var pass = [];
		var alphaLength = (alphabet.length) - 1;

		for (var i = 0; i < 3; i++) {
			var n = Math.floor(Math.random() * (alphaLength - 0 + 1)) + 0;
			pass.push(alphabet[n]);
		}

		var code = pass.join("");
		return code;
	},
	generateOrderId: function () {
		var alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		var pass = [];
		var alphaLength = (alphabet.length) - 1;

		for (var i = 0; i < 8; i++) {
			var n = Math.floor(Math.random() * (alphaLength - 0 + 1)) + 0;
			pass.push(alphabet[n]);
		}

		var code = pass.join("");
		return code;
	},
}

module.exports = config;
