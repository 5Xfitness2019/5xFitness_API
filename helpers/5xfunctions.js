let connectionProvider = require('../server/dbConnectionProvider'),
merge = require('merge'),
nodemailer = require('nodemailer'),
config = require('../server/config');

let functions = {
	
    get(table, cond) {
		var self = this;
        var sql = "SELECT * FROM " + table;        
		if (typeof (cond) == "object") {
			sql += " WHERE ";
			for (var key in cond) {
				sql += key + " = '" + cond[key] + "' AND ";
			}
			sql = sql.substring(0, sql.length - 4);
        }        
        return self.selectQuery(sql);
	},
	insert(table, data) {
		var self = this;
		var sql = "INSERT INTO " + table + " SET ?";
		if (typeof (data) == "object") {
			return self.processQuery(sql, data);
		} else {
			return false;
		}
	},
	update(table, fields, cond) {        
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
		return self.processQuery(sql, data);
	},
	delete(table, cond) {
		var self = this;
		var sql = "DELETE FROM " + table + " WHERE 1";
		if (typeof (cond) == 'object') {
			for (var key in cond) {
				sql += " AND " + key + "='" + cond[key] + "'";
			}
			return self.selectQuery(sql);
		} else {
			return false;
		}
	},
	selectQuery(sql) {
		return new Promise((resolve, reject) => {
			let connection = connectionProvider.dbConnectionProvider.getMysqlConnection();
			connection.query(sql, (err, result)=>{
				if(err) reject(err);
				else resolve(result);
			});
			connectionProvider.dbConnectionProvider.closeMysqlConnection(connection);
		}) 
    },
    processQuery(sql, data) {
		return new Promise((resolve, reject)=> {
			let connection = connectionProvider.dbConnectionProvider.getMysqlConnection();			
			connection.query(sql, data, (err, result) => {
				if(err) reject(err);
				else resolve(result);
			})
			connectionProvider.dbConnectionProvider.closeMysqlConnection(connection);
		})
	},
	queryProcessor: function(sql, callb){
		try{
			var connection = connectionProvider.dbConnectionProvider.getMysqlConnection();
			
			connection.query(sql, function(err, result){
				if(err){ throw err; }
				connectionProvider.dbConnectionProvider.closeMysqlConnection(connection);
				callb(result);
				
			})
		}catch(e){
			callb(e);
		}
	},
    getCount(table, cond) {
		var self = this;
		var sql = "SELECT count(*) as count FROM " + table;
		if (typeof (cond) == "object") {
			sql += " WHERE ";
			for (var key in cond) {
				sql += key + " = '" + cond[key] + "' AND ";
			}
			sql = sql.substring(0, sql.length - 4);
		}
		return self.selectQuery(sql);
	},
	multiProcess( sql , data, callback ){
        return new Promise((resolve, reject)=> {
            let connection = connectionProvider.dbConnectionProvider.getMysqlConnection();          
            connection.query(sql, [data], (err, result) => {
                if(err) reject(err);
                else resolve(result);
            })
            connectionProvider.dbConnectionProvider.closeMysqlConnection(connection);
        }).then((result) => {
			callback(result);
		})
		.catch((err) => {
			callback(err);
		});
    },
    sendMail: function(to, subject, email, isEmailTemplate, callback){
		try{
			config.getConfig(function(prefs){	
				var poolConfig = {
					pool: true,
					host: prefs.smtpHost[0],
					port: prefs.smtpPort[0],
					secure: true, // use SSL
					auth: {
						user: prefs.smtpUser[0],
						pass: prefs.smtpPass[0]
					}
				};			
				
				var transporter = nodemailer.createTransport(poolConfig);
			
				transporter.verify(function(error, success) {
					if (error) {			
						throw error;					
					} else {
						
						if(!isEmailTemplate){
							
							var mailOptions = {
								from: '"' + prefs.fromName[0] + '" <' + prefs.fromEmail[0] + '>',
								to: to,
								subject: subject,			
								html: email
							}
							
							transporter.sendMail(mailOptions, function(err, info){
								if(err){
									throw err;								
								}else{
									var response = {'status': 'success', 'message': 'Message sent successfully.'};
									callback(response);
								}
							});
						}else{
							var template = email.email_template;
							
							var mailOptions = {
								from: '"' + prefs.fromName[0] + '" <' + prefs.fromEmail[0] + '>',
								to: to,
								subject: subject,			
								html: template
							}
							
							if(email.cc == 'Y'){
								mailOptions.cc = prefs.adminEmail[0];
							}
							
							if(email.bcc == 'Y'){
								mailOptions.bcc = prefs.adminEmail[0];
							}
							
							if(email.admin_only == 'Y'){
								mailOptions.to = prefs.adminEmail[0];
							}				
							
							transporter.sendMail(mailOptions, function(err, info){
								if(err){
									throw err;								
								}else{
									var response = {'status': 'success', 'message': 'Message sent successfully.'};
									callback(response);
								}
							});
						}
					}
				
				})
			})
		}catch(e){
			callback(e);
		}	
	}
}

module.exports = functions;
