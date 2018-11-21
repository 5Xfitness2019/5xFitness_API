var connectionProvider = require("./dbConnectionProvider");
var crypto = require('crypto');
var config = require('./config');
var merge = require('merge');
var nodemailer = require('nodemailer');
var mysql = require('mysql');

var functions = {
		_send: function (to, subject, email, isEmailTemplate, callback) {

		try {
			nodemailer.createTestAccount((err, account) => {

				// create reusable transporter object using the default SMTP transport
				let transporter = nodemailer.createTransport({
					host: 'smtp.gmail.com',
					port: 465,
					secure: true, // true for 465, false for other ports
					auth: {
						user: "qanewagesmb@gmail.com", // generated ethereal user
						pass: "Newagesm8"  // generated ethereal password
					}
				});
				var template = config.email_header + email.template + config.email_footer;
				// setup email data with unicode symbols
				let mailOptions = {
					from: 'surgerize@gmail.com', // sender address
					to: to, // list of receivers
					subject: subject, // Subject line
					text: subject, // plain text body
					html: template // html body
				};

				// send mail with defined transport object
				transporter.sendMail(mailOptions, (error, info) => {
					if (error) {
						return console.log(error);
					}
					var response = { 'status': true, 'message': 'Email sent successfully.' };
					callback(response);
					//console.log('Message sent: %s', info.messageId);
					// Preview only available when sending through an Ethereal account
					//console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

					// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
					// Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
				});
			});


		} catch (e) {
			callback(e);
		}

	},

	checkEmail: function (email, table_name, cb) {
		var sql = "SELECT COUNT(*) as userCount FROM " + table_name + " WHERE email=" + mysql.escape(email);
		functions.selectQuery(sql, function (res) {
			cb(res[0].userCount);
		})
	},
	get: function (table, cond, callb) {
		var self = this;
		var sql = "SELECT * FROM " + table;
		if (typeof (cond) == "object") {
			sql += " WHERE ";
			for (var key in cond) {
				sql += key + " = '" + cond[key] + "' AND ";
			}
			sql = sql.substring(0, sql.length - 4);
		}
		console.log(sql);
		self.selectQuery(sql, function (result) {
			callb(result);
		});
	},
	insert: function (table, data, callb) {
		var self = this;
		var sql = "INSERT INTO " + table + " SET ?";
		if (typeof (data) == "object") {
			self.processQuery(sql, data, function (result) {
				callb(result);
			})
		} else {
			callb(null);
		}
	},
	update: function (table, fields, cond, callb) {
		var self = this;
		var sql = "UPDATE " + table + " SET ";
		for (var key in fields) {
			sql += key + " = ?,";
		}
		sql = sql.substring(0, sql.length - 1) + " WHERE ";

		for (var ky in cond) {
			sql += ky + " = ? AND ";
		}
		sql = sql.substring(0, sql.length - 4);

		var original = merge(fields, cond);
		var data = [];
		for (var attr in original) {
			data.push(original[attr]);
		}
		//console.log(sql);
		self.processQuery(sql, data, function (result) {
			callb(result);
		});
	},
	delete: function (table, cond, callb) {
		var self = this;
		var sql = "DELETE FROM " + table + " WHERE 1";
		if (typeof (cond) == 'object') {
			for (var key in cond) {
				sql += " AND " + key + "='" + cond[key] + "'";
			}
			self.processQuery(sql, null, function (result) {
				callb(result);
			});
		} else {
			callb(null);
		}
	},

	selectQuery: function (sql, callb) {
		try {
			var connection = connectionProvider.dbConnectionProvider.getMysqlConnection();
			connection.query(sql, function (err, result) {
				if (err) { throw err; }
				connectionProvider.dbConnectionProvider.closeMysqlConnection(connection);
				callb(result);

			})
		} catch (e) {
			callb(e);
		}
	},
	selectQuerys(sql) {
		return new Promise((resolve, reject) => {
			let connection = connectionProvider.dbConnectionProvider.getMysqlConnection();
			connection.query(sql, (err, result)=>{
				if(err) reject(err);
				else resolve(result);
			});
			connectionProvider.dbConnectionProvider.closeMysqlConnection(connection);
		}) 
    },


	processQuery: function (sql, data, callb) {
		try {
			var connection = connectionProvider.dbConnectionProvider.getMysqlConnection();
			if (data) {
				var qry = connection.query(sql, data, function (err, result) {
					if (err) { throw err; }
					connectionProvider.dbConnectionProvider.closeMysqlConnection(connection);
					callb(result);

				});
			} else {
				var qry = connection.query(sql, function (err, result) {
					if (err) { throw err; }
					connectionProvider.dbConnectionProvider.closeMysqlConnection(connection);
					callb(result);

				});
			}
		} catch (e) {
			callb(e);
		}
	},
	encryptPass: function (password, callb) {
		// var mykey = crypto.createCipher('aes-128-cbc', 'mypassword');
		// var mystr = mykey.update('abc', 'utf8', 'hex')
		// mystr += mykey.final('hex');
		// callb(mystr);
		var cipher = crypto.createCipher(config.encrypt_algorithm, config.encrypt_pass);
		var crypted = cipher.update(password, 'utf8', 'hex');
		crypted += cipher.final('hex');
		console.log(crypted);
		callb(crypted);
	},
	decryptPass: function (encrypted, callb) {
		console.log('decryptPass')
		var decipher = crypto.createDecipher(config.encrypt_algorithm, config.encrypt_pass)
		console.log('decryptPass 1')
		var dec = decipher.update(encrypted,'hex','utf8')
		console.log('decryptPass2')
		dec += decipher.final('utf8');
		console.log('decryptPass 3')
		callb(dec);
		//console.log(encrypted);
		// var mykey = crypto.createDecipher('aes-128-cbc', 'mypassword');
		// var mystr = mykey.update('34feb914c099df25794bf9ccb85bea72', 'hex', 'utf8')
		// mystr += mykey.final('utf8');
		// callb(mystr);
		// var decipher = crypto.createDecipher(config.encrypt_algorithm, config.encrypt_pass);
		// var dec = decipher.update(encrypted, 'hex', 'utf8');
		// dec += decipher.final('utf8');
		// callb(dec);
	},
	
	getCount: function (table, cond, callb) {
		var self = this;
		var sql = "SELECT count(*) as count FROM " + table;
		if (typeof (cond) == "object") {
			sql += " WHERE ";
			for (var key in cond) {
				sql += key + " = '" + cond[key] + "'";
			}
		}
		self.selectQuery(sql, function (result) {
			callb(result);
		});
	}

}

module.exports = functions;