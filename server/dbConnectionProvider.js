var mysql = require('mysql');
var connectionString = require('./dbConnectionString');

var dbConnectionProvider = {
    getMysqlConnection: function(){
        var connection = mysql.createConnection(connectionString.dbConnectionString.connection.dev);
        connection.connect(function(err){
            if(err) {
                throw err;
            }          
        })
        return connection;
    },
    closeMysqlConnection: function(connection){
        if(connection){
            connection.end(function(err){
                if(err) {
                    throw err;
                } 
            });
        }
    }

}

module.exports.dbConnectionProvider = dbConnectionProvider;