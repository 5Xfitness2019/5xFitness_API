var mysql = require('mysql');
let functions = require('../helpers/functions');

let userDao = {
    checkEmailExists: function (email, callback) {
        if (email) {
            functions.get('users', { email: email })
                .then((result) => {
                    callback(result);
                })
                .catch((err) => {
                    callback(err);
                });
        }
    },



    UserLogin: function (email, password, callback) {
        if (email && password) {
            var sql = `SELECT
            MAX(T2.complaint_id) as complaint_id ,
            T1.status,
            T1.member_id,
            T1.image,
            T1.email,
            T1.first_name,
            T1.last_name,
            T1.dob,
            T1.gender,
            T1.postcode,
            T1.step_to_complete,
            T1.mobile,
            T1.address,
            T1.marital_status
        FROM
            member_master T1 LEFT JOIN complaint_master T2 ON T1.member_id = T2.member_id 
        WHERE
        T1.email = "`+ email + `"
        AND T1.PASSWORD = "`+ password + `"`;


            functions.queryProcessor(sql, function (result) {
                callback(result[0]);
            })
        }
    },


    complaintUser: function (user_id, callback) {

        var sql = `SELECT
            *
        FROM
            complaint_master
        WHERE
            complaint_id IN (
                SELECT
                    MAX(complaint_id)
                FROM
                    complaint_master
                WHERE
                    member_id = `+ user_id + `
                GROUP BY
                    member_id
            )`;
        functions.queryProcessor(sql, function (result) {
            callback(result[0]);
        })

    },
    complaintUserCmpId: function (complnt_id, callback) {

        var sql = `SELECT
        T2.step_to_complete,T1.*
    FROM
        complaint_master T1 LEFT JOIN member_master T2 ON T1.member_id = T2.member_id
    WHERE
        T1.complaint_id =` + complnt_id;

        console.log(sql)
        functions.queryProcessor(sql, function (result) {
            callback(result[0]);
        })

    },
    basicInfo: function (member_id, callback) {

        var sql = `SELECT
        MAX(T2.complaint_id) as complaint_id ,
        T1.step_to_complete,
                T1.first_name,
                T1.last_name,
                T1.email,
                T1.address,
                T1.mobile,
                T1.occupation,
                T1.marital_status,
                T1.postcode,
                T1.image,
                T1.about
                FROM
                member_master T1 LEFT JOIN complaint_master T2 ON T1.member_id = T2.member_id 
               WHERE
               T1.member_id = ` + member_id;

        functions.queryProcessor(sql, function (result) {
            callback(result[0]);
        })

    },
    getUserHealthRating: function (member_id, start, end, callback) {

        var sql = `SELECT
                        T1.*, DATE_FORMAT(T1.date, '%b %D') AS date,
                        T2.feel_today AS td_feel_today,
                        T2.rating AS td_rating,
                        T2.rating_id AS td_rating_id
                    FROM
                        health_rating AS T1
                    LEFT JOIN health_rating T2 ON T2.date = DATE(NOW()) AND T1.member_id = T2.member_id
                    WHERE
                        T1.member_id = `+ member_id

        if (start && end) {
            sql += ` AND T1.date >= '` + start + `' AND  T1.date <=  '` + end + `'`
        } else {
            sql += ` AND T1.date >= DATE(NOW()) - INTERVAL 7 DAY`;
        }

        console.log(sql);
        functions.queryProcessor(sql, function (result) {
            callback(result);
        })

    },

    //
    getUserByEmail: function (email, callback) {
        if (email) {
            functions.get('member_master', { email: email })
                .then((result) => {
                    callback(result[0]);
                })
                .catch((err) => {
                    callback(err);
                });
        }
    },
    updatePswdRecoveryCode: function (email, reset_code, callback) {

        if (email) {
            functions.update('member_master', { reset_code: reset_code }, { email: email })
                .then((result) => {
                    callback(result);
                })
                .catch((err) => {
                    callback(err);
                });
        }
    },
    getEmailTemplateByName: function (name, callback) {
        if (name) {
            functions.get('general_emails', { name: name })
                .then((result) => {
                    callback(result[0]);
                })
                .catch((err) => {
                    callback(err);
                });
        }
    },
    verifyCode: function (email, reset_code, callback) {
        if (email && reset_code) {
            functions.get('member_master', { email: email, reset_code: reset_code })
                .then((result) => {
                    callback(result[0]);
                })
                .catch((err) => {
                    callback(err);
                });
        }
    },
    updatePassword: function (email, password, callback) {
        if (email && password) {
            functions.update('member_master', { password: password }, { email: email })
                .then((result) => {
                    callback(result);
                })
                .catch((err) => {
                    callback(err);
                });
        }
    },
    checkPassword: function (id, password, callback) {
        if (id && password) {
            functions.get('member_master', { member_id: id, password: password })
                .then((result) => {
                    callback(result[0]);
                })
                .catch((err) => {
                    callback(err);
                });
        }
    },
    updatePasswordById: function (id, password, callback) {
        if (id && password) {
            functions.update('member_master', { password: password }, { member_id: id })
                .then((result) => {
                    callback(result);
                })
                .catch((err) => {
                    callback(err);
                });
        }
    },
    getMyGoals: function (member_id, callback) {

        var sql = `SELECT * FROM my_goal WHERE member_id = ` + member_id + ` ORDER BY goal_id DESC`;
        functions.queryProcessor(sql, function (result) {
            callback(result);
        })

    },
    getMyWorkOut: function (url, member_id, callback) {
        console.log(member_id)

        var sql = `SELECT
                        if(T1.rest_sec,T1.rest_sec,T2.rest_sec) as rest_sec,
                        if(T1.weight,T1.weight,T2.weight) as weight,
                        IFNULL(T3.count,0) as count ,
                        CONCAT('`+ url + `',video_url) as video,
                        CONCAT('`+ url + `',image_url) as image,
                        T1.assigned_id, IFNULL(T1.repeat_times,0) as repeat_times,T2.workout_id, if(T1.rest,T1.rest,T2.rest) as rest,T2.workout_name,if(T1.duration,T1.duration,T2.duration) as duration
                   
                    FROM
                        assigned_workout_master T1
                    LEFT JOIN workout_master T2 ON T1.workout_id = T2.workout_id
                    LEFT JOIN user_wokout_progress T3 ON T1.assigned_id = T3.assigned_id AND DATE(T3.work_date) = CURDATE()
                    WHERE
                        T1.member_id = `+ member_id;


        functions.queryProcessor(sql, function (result) {
            callback(result);
        })

    },
    getWorkout: function (url, assigned_id, callback) {

        var sql = `SELECT
                       if(T1.rest_sec,T1.rest_sec,T2.rest_sec) as rest_sec,
                       if(T1.weight,T1.weight,T2.weight) as weight,
                       T3.workout_progress_id,IFNULL(T3.count,0) as count ,
                       T1.workout_details, T1.assigned_id, IFNULL(T1.repeat_times,0) as repeat_times ,T2.workout_id,if(T1.rest,T1.rest,T2.rest) as rest,T2.workout_name,if(T1.duration,T1.duration,T2.duration) as duration,
                        CONCAT('`+ url + `',video_url) as video,
                        CONCAT('`+ url + `',image_url) as image
                        
                    FROM
                        assigned_workout_master T1
                    LEFT JOIN workout_master T2 ON T1.workout_id = T2.workout_id
                    LEFT JOIN user_wokout_progress T3 ON T1.assigned_id = T3.assigned_id AND DATE(T3.work_date) = CURDATE()
                    WHERE
                        T1.assigned_id = `+ assigned_id;

        functions.queryProcessor(sql, function (result) {
            callback(result);
        })

    },
    getEvents: function (member_id, newDate, callback) {

        // var sql = `SELECT * ,UPPER(DATE_FORMAT(date,'%M %d') ) as month_day,UPPER(DATE_FORMAT(date,'%a') ) as new_day , TIME_FORMAT(time,'%r') as new_time, DATE_FORMAT(date,'%Y-%m-%d') as date  FROM appointment WHERE member_id =` + member_id

        var sql = `SELECT
                        *, LAST_DAY(date),
                        UPPER(
                            CONCAT(
                                DATE_FORMAT( IFNULL('`+ newDate + `',NOW()), '%M'),
                                ' ',
                                DATE_FORMAT(date, '%d')
                            )
                        ) AS month_day,
                        UPPER(
                            DATE_FORMAT(
                                (
                                    CONCAT(
                                        DATE_FORMAT(IFNULL('`+ newDate + `',NOW()), '%Y-%m-'),
                                        DATE_FORMAT(date, '%d')
                                    )
                                ),
                                '%a'
                            )
                        ) AS new_day,
                        TIME_FORMAT(time, '%r') AS new_time,
                        DATE_FORMAT(date, '%Y-%m-%d') AS actl_date,
                        CONCAT(
                            DATE_FORMAT(IFNULL('`+ newDate + `',NOW()), '%Y-%m-'),
                            DATE_FORMAT(date, '%d')
                        ) AS date
                    FROM
                        appointment
                    WHERE
                        member_id =`+ member_id + `
                    AND (
                        (
                            DATE_FORMAT(date, '%Y-%m') = DATE_FORMAT(IFNULL('`+ newDate + `',NOW()), '%Y-%m')
                        )
                        OR (app_repeat = 'daily')
                        OR (app_repeat = 'month')
                        OR (
                            app_repeat = 'year'
                            AND DATE_FORMAT(date, '%d') = DATE_FORMAT(IFNULL('`+ newDate + `',NOW()), '%m')
                        )
                    )`

        console.log(sql);
        functions.queryProcessor(sql, function (result) {
            callback(result);
        })

    },

    chatList: function (member_id, callback) {
        sql = `SELECT
                    T1.group_id,
                    group_name,
                    (
                        SELECT
                            COUNT(*)
                        FROM
                            chat_members T4
                        WHERE
                            T4.group_id = T1.group_id
                        AND T4. STATUS = 'Y'
                    ) AS total_member,
                    (
                        SELECT
                            COUNT(
                                CASE
                                WHEN T3.message_id > IFNULL(T1.last_read_message_id, 0) THEN
                                    1
                                END
                            )
                        FROM
                            chat_message T3
                        WHERE
                            T3.group_id = T1.group_id
                    ) AS unread
                FROM
                    chat_members T1
                LEFT JOIN chat_groups T2 ON T1.group_id = T2.group_id
                WHERE
                    T1.member_id = ` + member_id

        console.log(sql);
        functions.queryProcessor(sql, function (result) {
            callback(result);
        })

    },
    getMessage: function (group_id, url, media_url, callback) {

        var sql = `SELECT
        T1.date,if((((UNIX_TIMESTAMP(NOW()) - UNIX_TIMESTAMP(T1.date)))/60) > 60,
if((((UNIX_TIMESTAMP(NOW()) - UNIX_TIMESTAMP(T1.date)))/60)/60 >24 , 
CONCAT(TRUNCATE(((((UNIX_TIMESTAMP(NOW()) - UNIX_TIMESTAMP(T1.date)))/60)/60)/24, 0), ' days' ) ,
CONCAT(TRUNCATE((((UNIX_TIMESTAMP(NOW()) - UNIX_TIMESTAMP(T1.date)))/60)/60 ,0),' hr')),
CONCAT(TRUNCATE(((UNIX_TIMESTAMP(NOW()) - UNIX_TIMESTAMP(T1.date)))/60,0),' min')) as timeInsec ,
        CONCAT('`+ url + `',T2.image) as image,
        T1.*, CONCAT(
            T2.first_name,
            ' ',
            T2.last_name
        ) AS message_from,
        CONCAT('`+ media_url + `',T1.media_url) as media_url,
        CONCAT('`+ media_url + `',T1.thumb_nail) as thumb_nail
    FROM
        chat_message T1
    LEFT JOIN member_master T2 ON T1.member_id = T2.member_id
    WHERE
        T1.group_id = ` + group_id;

        console.log(sql);

        functions.queryProcessor(sql, function (result) {
            callback(result);
        })

    },
    getMessageDetails: function (group_id, member_id, callback) {

        var sql = `SELECT
                T2.fcmToken,T3.image,T3.member_type,T3.first_name,T3.last_name
            FROM
                chat_members T1
            LEFT JOIN member_master T2 ON T1.member_id = T2.member_id
            LEFT JOIN member_master T3 ON T3.member_id = ` + member_id + `
            WHERE
                T1.group_id = `+ group_id + ` AND T1.member_id !=` + member_id;
        console.log(sql);
        functions.queryProcessor(sql, function (result) {
            callback(result);
        })

    },
    getPushMessageDetails: function (message_id, callback) {

        var sql = `SELECT
                T1.*, group_name,
                (
                    SELECT
                        COUNT(*)
                    FROM
                        chat_members
                    WHERE
                        group_id = T1.group_id
                ) AS total_member,
                (
                    SELECT
                        COUNT(*)
                    FROM
                        chat_message T3
                    WHERE
                        T3.group_id = T1.group_id
                ) AS unread
            FROM
                chat_message T1
            LEFT JOIN chat_groups T2 ON T1.group_id = T2.group_id
            WHERE
                T1.message_id = ` + message_id;

        functions.queryProcessor(sql, function (result) {
            callback(result);
        })

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
                T2.workout_details AS title
            FROM
                workout_alarm T1
            LEFT JOIN assigned_workout_master T2 ON T1.assigned_id = T2.assigned_id
            WHERE
                T1.member_id = `+ id + `
            AND T1.alam_on = TRUE
            AND T1.is_repeat = TRUE`;

        return functions.selectQuery(sql);
    }




}

module.exports.userDao = userDao;
