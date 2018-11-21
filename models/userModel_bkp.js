let functions = require('../helpers/functions'),
	mysql = require('mysql');

let userModel = {


	getUserByEmail: function (email, cb) {
		var sql = `SELECT					 
					um.*
				FROM member_master um				   
				WHERE um.email= ` + mysql.escape(email);

		return functions.selectQuery(sql);
	},

	getUsers: function (query) {
		var sql = `SELECT A.*  FROM member_master  A
		WHERE 1=1 AND A.member_type = 1
				  `;
		if (query.search != '') {
			sql += ` AND A.first_name like "%` + query.search + `%" OR A.last_name like "%` + query.search + `%" OR A.email like "%` + query.search + `%"`;
		}
		return functions.selectQuery(sql);
	},

	getUserdetails: function (query) {

		var sql = `SELECT A.*,DATE_FORMAT(A.dob,'%Y-%m-%d') as dob FROM member_master A
		WHERE A.member_id =  `+ query.member_id;
		return functions.selectQuery(sql);
	},
	getHealthInfo: function (query) {
		var sql = `SELECT * FROM complaint_master WHERE member_id= ` + query.member_id;
		return functions.selectQuery(sql);
	},
	getWorkouts: function (query) {
		var sql = `SELECT A.* FROM workout_master A WHERE 1 = 1 `;
		if (query.search != '') {
			sql += ` AND A.workout_name like "%` + query.search + `%" `;
		}
		return functions.selectQuery(sql);
	},
	getWorkoutdetails: function (query) {
		var sql = `SELECT A.* FROM workout_master A WHERE 1 = 1 `;
		if (query.workout_id != '') {
			sql += ` AND A.workout_id = ` + query.workout_id;
		}
		return functions.selectQuery(sql);
	},
	getAssignedWorkouts: function (query) {
		var sql = `SELECT A.*,B.* FROM assigned_workout_master A 
		LEFT JOIN workout_master B ON B.workout_id = A.workout_id
		WHERE 1=1 `;
		if (query.member_id != '') {
			sql += ` AND A.member_id = ` + query.member_id;
		}
		return functions.selectQuery(sql);
	},
	getPainChartRecords: function (query) {
		var sql = `SELECT A.*,DATE_FORMAT(A.date,"%a %m/%y") as dis_date FROM health_rating A WHERE 1=1 `;
		if (query.member_id != '') {
			sql += ` AND A.member_id = ` + query.member_id;
		}
		if (query.fromdate == '' && query.todate == '') {
			sql += ` ORDER BY A.date DESC LIMIT 7 `;
		} else {
			sql += ` AND (( A.date >= DATE_FORMAT('` + query.fromdate + `',"%Y-%m-%d") AND A.date <=  DATE_FORMAT('` + query.todate + `',"%Y-%m-%d")) 
			OR (A.date >= DATE_FORMAT('`+ query.todate + `',"%Y-%m-%d") AND A.date <=  DATE_FORMAT('` + query.fromdate + `',"%Y-%m-%d")))`;
		}
		console.log(sql);
		return functions.selectQuery(sql);
	},
	getDailyLogWorkouts: function (query) {
		var sql = `SELECT A.*,B.*,C.*,CURDATE() FROM assigned_workout_master A 
		LEFT JOIN workout_master B ON B.workout_id = A.workout_id 
		LEFT JOIN user_wokout_progress C ON C.assigned_id= A.assigned_id 
		WHERE 1=1 `;
		if (query.member_id != '') {
			sql += ` AND A.member_id = ` + query.member_id + ` AND DATE_FORMAT(C.work_date,'%Y-%m-%d')=CURDATE()`;
		}
		return functions.selectQuery(sql);
	},
	getSettings: function (query) {
		var sql = `SELECT A.* FROM settings A `;
		return functions.selectQuery(sql);
	},



}

module.exports = userModel;