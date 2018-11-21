let functions = require('../helpers/fiveXFunctions'),
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
	getSubscription: function () {
		var sql = `SELECT
		a.*, CONCAT(
			b.first_name,
			' ',
			b.last_name
		) AS user_name,
		b.email,
		CONCAT(EXTRACT(YEAR FROM a.date),'-',EXTRACT(MONTH FROM a.date),'-',EXTRACT(DAY FROM a.date)) as sdate
	FROM
		subscription a
	LEFT JOIN member_master b ON a.member_id = b.member_id ORDER BY a.sub_id DESC`;
		return functions.selectQuery(sql);
	},

	getUserdetails: function (query) {

		var sql = `SELECT A.*,DATE_FORMAT(A.dob,'%Y-%m-%d') as dob FROM member_master A
		WHERE A.member_id =  `+ query.member_id;
		return functions.selectQuery(sql);
	},
	getHealthInfo: function (query) {
		var sql = `SELECT A.*,DATE_FORMAT(A.date_of_onset,'%Y-%m-%d') as date_of_onset FROM complaint_master A WHERE A.member_id= ` + query.member_id;
		return functions.selectQuery(sql);
	},
	getWorkouts: function (query) {
		var sql = `SELECT A.* FROM workout_master A WHERE 1 = 1 `;
		if (query.search != '') {
			sql += ` AND A.workout_name like "%` + query.search + `%" `;
		}
		if (query.category_id) {
			sql += ` AND A.category_id = ` + query.category_id;
		}
		if (query.subcategory_id) {
			sql += ` AND A.subcategory_id = ` + query.subcategory_id;
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
		//console.log(sql);
		return functions.selectQuery(sql);
	},
	getDailyLogWorkouts: function (query) {
		//console.log(query);
		var sql = `SELECT A.*,B.*,C.*,CURDATE() FROM assigned_workout_master A 
		LEFT JOIN workout_master B ON B.workout_id = A.workout_id 
		LEFT JOIN user_wokout_progress C ON C.assigned_id= A.assigned_id 
		WHERE 1=1 `;
		if (query.member_id != '') {
			sql += ` AND A.member_id = ` + query.member_id + ` AND DATE_FORMAT(C.work_date,'%Y-%m-%d')=CURDATE()`;
		}
		if (query.date) {
			sql += ` AND DATE_FORMAT(C.work_date,'%Y-%m-%d')='` + query.date + `'`;
		} else {
			sql += ` AND DATE_FORMAT(C.work_date,'%Y-%m-%d')=CURDATE()`;
		}
		//console.log(sql);
		return functions.selectQuery(sql);
	},
	getSettings: function (query) {
		var sql = `SELECT A.* FROM settings A `;
		return functions.selectQuery(sql);
	},
	getDashboardCounts: function (query) {
		var sql = `SELECT  ( SELECT count(*) as count FROM member_master WHERE member_type = 1 ) as user_count, 
		(SELECT count(*) as count FROM workout_master ) as workout_count,
		(SELECT count(*) as count FROM settings  ) as setting_count `;
		return functions.selectQuery(sql);
	},
	getCategories: function (query) {
		var sql = `SELECT A.* FROM category_master A WHERE 1 = 1 `;
		if (query.search) {
			sql += ` AND A.category_name like "%` + query.search + `%"`;
		}
		//console.log(sql);
		return functions.selectQuery(sql);
	},
	getSubCategories: function (query) {
		var sql = `SELECT A.*,B.category_name FROM sub_category_master A 
		LEFT JOIN category_master B on B.category_id = A.category_id
		WHERE 1 = 1 `;
		if (query.category_id) {
			sql += ` AND A.category_id = ` + query.category_id;
		}
		if (query.search) {
			sql += ` AND A.sub_category_name like "%` + query.search + `%"`;
		}
		//console.log(sql);
		return functions.selectQuery(sql);
	},
	getGroups: function (query) {
		var sql = `SELECT A.* FROM chat_groups A 
		WHERE 1 = 1 `;
		return functions.selectQuery(sql);
	},
	getChatHistory: function (query) {
		var sql = `SELECT A.*,A.date,if((((UNIX_TIMESTAMP(NOW()) - UNIX_TIMESTAMP(A.date)))/60) > 60,
		if((((UNIX_TIMESTAMP(NOW()) - UNIX_TIMESTAMP(A.date)))/60)/60 >24 , 
		CONCAT(TRUNCATE(((((UNIX_TIMESTAMP(NOW()) - UNIX_TIMESTAMP(A.date)))/60)/60)/24, 0), ' days' ) ,
		CONCAT(TRUNCATE((((UNIX_TIMESTAMP(NOW()) - UNIX_TIMESTAMP(A.date)))/60)/60 ,0),' hr')),
		CONCAT(TRUNCATE(((UNIX_TIMESTAMP(NOW()) - UNIX_TIMESTAMP(A.date)))/60,0),' min')) as timeInsec,B.group_name,C.first_name,C.last_name,C.image FROM chat_message A
		LEFT JOIN chat_groups B ON B.group_id = A.group_id
		LEFT JOIN member_master C on C.member_id =  A.member_id
		WHERE A.group_id = ` + query.group_id;
		return functions.selectQuery(sql);
	},
	getGroupMembers: function (query) {
		var sql = `SELECT A.*,B.*,C.fcmToken FROM chat_groups A
		LEFT JOIN chat_members B on B.group_id = A.group_id
		LEFT JOIN member_master C on C.member_id=B.member_id
		WHERE A.group_id = ` + query.group_id;
		return functions.selectQuery(sql);
	},
	getMyWorkouts: function (query) {
		console.log("member id is" + query.member_id);
		var sql =
			` SELECT B.workout_name as workout_details,
			A.repeat_times,
			A.assigned_id,
			A.workout_id,
			A.category_id,
			A.subcategory_id,
			A.work_period,
			A.chosen_week,
			A.onetime_date,
			A.work_times
		
		FROM
			assigned_workout_master A
		LEFT JOIN workout_master B ON A.workout_id = B.workout_id
		WHERE
			A.member_id = ` + query.member_id;
		console.log(sql);
		return functions.selectQuery(sql);
	},


	getChatUsers: function (id) {

		var sql = `SELECT member_id FROM chat_members WHERE group_id =` + id;
		return functions.selectQuery(sql);
	},

	myGoal: function (id) {

		var sql = `SELECT
				T1.*, T2.title
			FROM
				alam T1
			LEFT JOIN my_goal T2 ON T1.goal_id = T2.goal_id
			WHERE
				T1.member_id = `+ id + `
			AND T1.alam_on = TRUE
			AND T1.is_repeat = TRUE`;

		return functions.selectQuery(sql);
	},
	myWorkout: function (id) {
		var sql = `SELECT
					T1.*,
					T3.workout_name AS title
				FROM
					workout_alarm T1
				LEFT JOIN assigned_workout_master T2 ON T1.assigned_id = T2.assigned_id
				LEFT JOIN workout_master T3 ON T2.workout_id = T3.workout_id
				WHERE
					T1.member_id = `+ id + `
				AND T1.alam_on = TRUE
				AND T1.is_repeat = TRUE`;

		return functions.selectQuery(sql);
	}



}

module.exports = userModel;