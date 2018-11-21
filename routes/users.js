var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var dateFormat = require('dateformat');
var fs = require('fs');
var user = require('../models/userDao');
var config = require('../server/config');
let functions = require('../helpers/functions');
let pushs = require('../helpers/pushs');
var year = new Date().getFullYear();
var md5 = require('md5');
var request = require("request");
var async = require('async');
thumbler = require('video-thumb');
var ffmpeg = require('ffmpeg');
////////// file upload ////////////
var multer = require('multer');
usercontroller = require('../controllers/userController')

//var upload = multer({ dest: 'uploads/' })



var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'public/uploads/')
	},
	filename: function (req, file, cb) {
		console.log(file);

		var ext = file.originalname.split('.').pop();
		cb(null, 'vid_' + req.decoded.member_id + '_' + (Math.floor(Math.random() * 90000) + 10000) + '.' + ext);

		// console.log(file, "first", file.originalname.split('.')[file.originalname.split('.').length - 1])
		// cb(null, Date.now() + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]) //Appending .jpg
	}
}, err => {
	console.log("err upload0", err);
})

var upload = multer({ storage: storage });




////////////////////////
//var mediaUrl = 'http://10.10.10.41:7071/';
var mediaUrl = 'http://newagesme.com:7071/';

/* GET users listing. */
router.get('/', function (req, res, next) {
	pushs.message_push('147', 1, 52, mediaUrl);
	res.send('ok');
});



router.get('/Testpush', function (req, res, next) {
	var arr = []
	arr.fcm_token = 'dtGNFIiKX7A:APA91bEnBCX0YFqGyVbiptS-JxxvXdeXto3WzzYtZclkqcIoepqVW413D4zMa9MkXH9p5zXf4txBdBsszkZewX7FkeJC8X2XOw9P2kpCit2wkQdK_NUCrzZYe3-8IZiBFHDhjlQ35tJSoj16MToKmicLFu7fLz8yPg';
	arr.title = 'test push';
	arr.body = 'jkshda';
	arr.bodyArr = { assigned_id: 1 };
	pushs.sendPush(arr, (data) => {
		res.send('push wrking');
	});


});



/* User SignUp */
router.post('/userSignUp', function (req, res, next) {
	functions.get('member_master', { email: req.body.email }).then((data) => {
		if (data.length) {
			res.json({ "status": false, "message": "This email address is already in use.", "details": '', "response_from": "userSignUp" });
		} else {
			functions.insert('member_master', { email: req.body.email, password: md5(req.body.password), first_name: req.body.first_name, last_name: req.body.last_name, fcmToken: req.body.fcmTkn }).then((loginData) => {
				if (loginData.insertId > 0) {
					var userToken = jwt.sign(JSON.parse(JSON.stringify({ member_id: loginData.insertId })), config.jwt_secret, {
						expiresIn: "240000h"
					});
					res.json({ "status": true, "message": "Successfully registered.", "details": '', "userToken": userToken, "response_from": "userSignUp" });
				} else {
					res.json({ "status": false, "message": "Some error has occured. Please try again later.", "details": '', "response_from": "userSignUp" });
				}
			}, err => {
				res.json({ "status": false, "message": "Some error has occured. Please try again later." });
			})

		}
	})

});


/* User Login */
router.post('/userLogin', function (req, res, next) {


	user.userDao.UserLogin(req.body.email, md5(req.body.password), (data) => {

		if (data && data.member_id) {

			if (data.status) {
				if (typeof (data['image']) != 'undefined' && data['image'] != null && data['image'] != '')
					data['image'] = config.baseUrl + "images/users/" + data['image'] + '?' + config.generateOPT();
				else
					data['image'] = '';



				var userToken = jwt.sign(JSON.parse(JSON.stringify({ member_id: data.member_id })), config.jwt_secret, {
					expiresIn: "240000h"
				});

				if (req.body.fcmTkn) {
					functions.update('member_master', { fcmToken: req.body.fcmTkn }, { email: req.body.email, password: md5(req.body.password) }).then((data) => {
						console.log(fcm_update)
					})
				}

				functions.get('assigned_workout_master', { member_id: data.member_id }).then((dataWorkout) => {

					user.userDao.myGoal(data.member_id)
						.then((myGoal) => {
							user.userDao.myWorkout(data.member_id)
								.then((myWorkout) => {
									res.json({ "status": true, "message": "Logged in successfully.", "details": data, "response_from": "userLogin", "userToken": userToken, workoutalarm: dataWorkout, "myGoal": myGoal, 'myWorkout': myWorkout });
								})
						})

				}, err => {
					res.json({ "status": true, "message": "Logged in successfully.", "details": data, "response_from": "userLogin", "userToken": userToken });
				})



			} else {

				res.json({ "status": false, "message": "This account has been blocked by the admin.", "details": "", "response_from": "userLogin" });
			}

		} else {

			res.json({ "status": false, "message": "Invalid Username or Password\nPlease try again.", "details": "", "response_from": "userLogin" });
		}
	})
});


router.post('/forgotPassword', function (req, res, next) {
	var userArr = req.body;
	if (typeof (userArr.email) == 'undefined' || userArr.email == '') {
		res.json({ "status": false, "message": "Email ID is required", "details": "", "response_from": "forgotPassword" });
	} else {
		user.userDao.getUserByEmail(userArr.email, function (userdata) {
			if (typeof (userdata) != 'undefined' && userdata != '') {
				if (userdata['blocked'] == 'N') {
					var reset_code = config.passwordRecoveryCode();
					user.userDao.updatePswdRecoveryCode(userArr.email, reset_code, function (result) {
						if (result.affectedRows > 0) {
							user.userDao.getEmailTemplateByName('forgot_password', function (template) {
								var emailTemplate = template.email_template;
								emailTemplate = emailTemplate.replace("#HEADING#", template.email_title);
								emailTemplate = emailTemplate.replace("#FULL_NAME#", userdata.first_name + ' ' + userdata.last_name);
								// emailTemplate = emailTemplate.replace("#LINK#", config.website_baseUrl);
								emailTemplate = emailTemplate.replace("#YEAR#", year);
								emailTemplate = emailTemplate.replace("#RESETCODE#", reset_code);
								template.email_template = emailTemplate;

								functions.sendMail(userArr.email, template.email_subject, template, true, function (emailRes) {
									if (emailRes.status == "success") {
										res.json({ "status": true, "message": "Please follow the instructions in the email to reset your password.", "details": "", "response_from": "forgotPassword" });
									} else {
										res.json({ "status": false, "message": "Unable to send email. Please check your smtp configuration.", "details": "", "response_from": "forgotPassword" });
									}
								})
							})
						}
						else {
							res.json({ "status": false, "message": "Unable to connect with database.", "details": "", "response_from": "forgotPassword" });
						}
					})
				} else if (userdata.active == 'N') {
					res.json({ "status": false, "message": "This account has been deactivated by the admin.", "details": "", "response_from": "forgotPassword" });
				}
			} else {
				res.json({ "status": false, "message": "This email address is not registered with any account.\nPlease try again.", "details": "", "response_from": "forgotPassword" })
			}
		})
	}
});




/* Verify Code */
router.post('/verifyCode', function (req, res, next) {
	var userArr = req.body;
	if (typeof (userArr.email) == 'undefined' || userArr.email == '' || typeof (userArr.reset_code) == 'undefined' || userArr.reset_code == '') {
		res.json({ "status": false, "message": "Invalid details", "details": "", "response_from": "verifyCode" });
	} else {
		user.userDao.verifyCode(userArr.email, userArr.reset_code, function (userdata) {
			if (typeof (userdata) != 'undefined' && userdata != '') {
				res.json({ "status": true, "message": "Verified successfully.", "details": "", "response_from": "verifyCode" });
			} else {
				res.json({ "status": false, "message": "The reset code is not valid.\nPlease try again.", "details": "", "response_from": "verifyCode" });
			}
		});
	}
});
router.post('/resetPassword', function (req, res, next) {
	var userArr = req.body;
	if (typeof (userArr.email) == 'undefined' || userArr.email == '' || typeof (userArr.password) == 'undefined' || userArr.password == '') {
		res.json({ "status": false, "message": "Invalid details", "details": "", "response_from": "resetPassword" });
	} else {
		// userArr.password = config.encryptPassword(userArr.password);
		userArr.password = md5(userArr.password);
		user.userDao.updatePassword(userArr.email, userArr.password, function (updateInfo) {
			if (updateInfo.affectedRows > 0) {
				res.json({ "status": true, "message": "Password updated successfully.", "details": "", "response_from": "resetPassword" });
			} else {
				res.json({ "status": false, "message": "Some error has occured. Please try again later.", "details": "", "response_from": "resetPassword" });
			}
		});
	}
});





/* Token Verification */
router.use(function (req, res, next) {
	var token = req.body.token || req.query.token || req.headers['x-access-token'];
	if (token) {
		jwt.verify(token, config.jwt_secret, function (err, decoded) {
			if (err) {
				return res.json({ "status": false, "message": "Failed to authenticate token.", "details": "", "response_from": "tokenVerification" });
			} else {
				req.decoded = decoded;
				next();
			}
		});
	} else {
		return res.json({ "status": false, "message": "No token provided", "details": "", "response_from": "tokenVerification" })
	}
});

router.post('/userSignUpTwo', function (req, res, next) {
	functions.update('member_master', req.body, { member_id: req.decoded.member_id }).then((data) => {
		res.json({ "status": true, "message": "Successfully registered." });
	}, err => {
		res.json({ "status": false, "message": "Some error has occured. Please try again later.", err: err });
	})
});
router.post('/complaint_updates', function (req, res, next) {
	for (var propName in req.body) {
		if (req.body[propName] === null || req.body[propName] === undefined || !req.body[propName]) {
			//console.log(propName);
			delete req.body[propName];
		}
	}

	var complaint = req.body.complaint_id;
	var step_to = req.body.step_to_complete;

	delete req.body.complaint_id;
	delete req.body.step_to_complete;
	delete req.body.pain_points_front;
	delete req.body.pain_points_back;
	//console.log(req.body);

	functions.update('complaint_master', req.body, { complaint_id: complaint }).then((data) => {

		if (step_to) {
			functions.update('member_master', { step_to_complete: step_to }, { member_id: req.decoded.member_id }).then((update) => {

			})
		}
		res.json({ "status": true, "message": "Successfully complaints updated." });
	}, err => {
		res.json({ "status": false, "message": "Some error has occured. Please try again later.", err: err });
	})
});
router.post('/complaint_insert', function (req, res, next) {
	req.body.member_id = req.decoded.member_id;
	delete req.body.step_to_complete;
	functions.insert('complaint_master', req.body).then((data) => {
		functions.update('member_master', { step_to_complete: 3 }, { member_id: req.decoded.member_id }).then((update) => {

		})
		res.json({ "status": true, "message": "Successfully complaints inserted.", complaint_id: data.insertId });
	}, err => {
		res.json({ "status": false, "message": "Some error has occured. Please try again later.", err: err });
	})
});


router.post('/complaint_Data', function (req, res, next) {
	user.userDao.complaintUser(req.decoded.member_id, (data) => {
		if (data) {
			res.json({ "status": true, details: data });
		} else {
			res.json({ "status": false, details: data });
		}

	})
});
router.post('/complaintUserCmpId', function (req, res, next) {
	user.userDao.complaintUserCmpId(req.body.complaint_id, (data) => {
		if (req.body.step_to_complete && req.body.step_to_complete == 8) {
			functions.update('member_master', { status: 'Y' }, { member_id: req.decoded.member_id }).then((datta) => {

			})
		}
		res.json({ "status": true, details: data });
	})
});
router.post('/basicInfo', function (req, res, next) {
	user.userDao.basicInfo(req.decoded.member_id, (userdata) => {
		//console.log(userdata);
		if (typeof (userdata['image']) != 'undefined' && userdata['image'] != null && userdata['image'] != '')
			userdata['image'] = config.baseUrl + "images/users/" + userdata['image'] + '?' + config.generateOPT();
		else
			userdata['image'] = '';


		functions.get('assigned_workout_master', { member_id: req.decoded.member_id }).then((data) => {
			res.json({ "status": true, details: userdata, workoutalarm: data });
		}, err => {
			console.log(err);
			res.json({ "status": false });
		})




	})
});

router.post('/updateProfileInfo', function (req, res, next) {
	var userArr = req.body;
	userArr.profile_image = req.body.image;
	userArr.user_id = req.decoded.member_id;

	if (typeof (userArr.user_id) == 'undefined' || userArr.user_id == '') {
		res.json({ "status": false, "message": "Invalid details", "details": "", "response_from": "updateProfileInfo" });
	} else {
		if (userArr.profile_image) {
			var uploadPath = 'public/images/users/';
			try {
				userArr.profile_image = userArr.profile_image.split(',')[1];
				fs.writeFile(uploadPath + "user_" + userArr.user_id + ".png", userArr.profile_image, 'base64', function (err) {
					if (err) throw err;
				});
			} catch (e) {
				res.json({ "status": false, "message": "Some error has occured. Please try again later.", "details": "", "response_from": "updateProfileInfo" });
			}
			userArr.profile_image = "user_" + userArr.user_id + ".png";
			functions.update('member_master', { 'about': req.body.about, 'image': userArr.profile_image, first_name: req.body.first_name, last_name: req.body.last_name }, { member_id: userArr.user_id }).then(updateInfo => {

				if (updateInfo.affectedRows > 0) {
					if (userArr.profile_image) {
						var profile_image = config.baseUrl + "images/users/" + userArr.profile_image + '?' + config.generateOPT();
					} else {
						var profile_image = '';
					}

					res.json({ "status": true, "message": "Profile updated successfully.", "details": profile_image, "response_from": "updateProfileInfo" });
				} else {
					res.json({ "status": false, "message": "Some error has occured. Please try again later.", "details": "", "response_from": "updateProfileInfo" });
				}
			});
		} else {
			functions.update('member_master', { 'about': req.body.about, first_name: req.body.first_name, last_name: req.body.last_name }, { member_id: userArr.user_id }).then(updateInfo => {

				if (updateInfo.affectedRows > 0) {
					if (userArr.profile_image) {
						var profile_image = config.baseUrl + "images/users/" + userArr.profile_image + '?' + config.generateOPT();
					} else {
						var profile_image = '';
					}

					res.json({ "status": true, "message": "Profile updated successfully.", "details": profile_image, "response_from": "updateProfileInfo" });
				} else {
					res.json({ "status": false, "message": "Some error has occured. Please try again later.", "details": "", "response_from": "updateProfileInfo" });
				}
			});
		}


	}
});
router.post('/changePassword', function (req, res, next) {

	//console.log("ujhfd gfdjgh fsdgh fsg shgf sjdghsjfd ");
	var userArr = req.body;
	userArr.user_id = req.decoded.member_id;

	if (typeof (userArr.user_id) == 'undefined' || userArr.user_id == '' || typeof (userArr.old_password) == 'undefined' || userArr.old_password == '' ||
		typeof (userArr.password) == 'undefined' || userArr.password == '') {
		res.json({ "status": false, "message": "Invalid Details", "details": '', "response_from": "changePassword" });
	} else {
		// userArr.old_password = config.encryptPassword(userArr.old_password);
		// userArr.password = config.encryptPassword(userArr.password);

		userArr.old_password = md5(userArr.old_password);
		userArr.password = md5(userArr.password);

		user.userDao.checkPassword(userArr.user_id, userArr.old_password, function (userdata) {
			if (typeof (userdata) != 'undefined' && userdata != '') {
				user.userDao.updatePasswordById(userArr.user_id, userArr.password, function (updateInfo) {
					if (updateInfo.affectedRows > 0) {
						res.json({ "status": true, "message": "Password has been successfully updated.", "details": '', "response_from": "changePassword" });

					} else {
						res.json({ "status": false, "message": "Some error has occured.", "details": '', "response_from": "changePassword" });
					}
				})
			} else {
				res.json({ "status": false, "message": "Current Password is incorrect. Please retry.", "details": "", "response_from": "changePassword" });
			}
		})
	}
});
router.post('/addHealthRating', function (req, res, next) {
	//console.log(req.decoded.member_id);
	functions.get('health_rating', { date: new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate(), member_id: req.decoded.member_id }).then((data) => {
		if (data.length) {
			functions.update('health_rating', { rating: req.body.rating, feel_today: req.body.feel_today }, { rating_id: data[0].rating_id }).then((data) => {
				res.json({ "status": true, "msg": "update" });
			})
		} else {
			functions.insert('health_rating', { member_id: req.decoded.member_id, rating: req.body.rating, feel_today: req.body.feel_today, date: new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate() }).then((data) => {
				res.json({ "status": true, "msg": "aad" });
			})
		}
		//console.log(data);
	})
});

router.post('/getUserHealthRating', function (req, res, next) {
	user.userDao.getUserHealthRating(req.decoded.member_id, req.body.start_date, req.body.end_date, (userdata) => {
		res.json({ "status": true, details: userdata });
	})
});

router.post('/addMyGoal', function (req, res, next) {

	if (req.body.goal_id) {
		functions.update('my_goal', { progress_range: req.body.progress_range, title: req.body.title, description: req.body.description, member_id: req.decoded.member_id }, { goal_id: req.body.goal_id }).then((data) => {
			res.json({ "status": true, "message": "Goal updated successfully" });
		}, err => {
			res.json({ "status": false, "message": 'Some error has occured. Please try again later.' });
		})
	} else {

		functions.insert('my_goal', { title: req.body.title, description: req.body.description, member_id: req.decoded.member_id }).then((data) => {
			res.json({ "status": true, "message": "Goal created successfully", id: data.insertId });
		}, err => {
			res.json({ "status": false, "message": 'Some error has occured. Please try again later.' });
		})
	}

});

router.post('/getMyGoals', function (req, res, next) {
	user.userDao.getMyGoals(req.decoded.member_id, (data) => {
		res.json({ "status": true, 'details': data, "message": "test" });
	})
});

router.post('/setAlam', function (req, res, next) {

	functions.get('alam', { goal_id: req.body.goal_id }).then((data) => {
		if (data && data[0] && data[0].alam_id) {
			functions.update('alam', { member_id: req.decoded.member_id, goal_id: req.body.goal_id, alam_time: req.body.alam_time, alam_repeat: req.body.alam_repeat, is_repeat: req.body.is_repeat, alam_on: req.body.alam_on }, { alam_id: data[0].alam_id }).then((datas) => {
				res.json({ "status": true, "message": "test" });
			}, err => {
				res.json({ "status": false, err: err });
			})
		} else {
			functions.insert('alam', { member_id: req.decoded.member_id, goal_id: req.body.goal_id, alam_time: req.body.alam_time, alam_repeat: req.body.alam_repeat, is_repeat: req.body.is_repeat, alam_on: req.body.alam_on }).then((data) => {
				res.json({ "status": true, "message": "test", id: data.insertId });
			})
		}
	})
});

router.post('/getAlam', function (req, res, next) {
	if (req.body.goal_id) {
		functions.get('alam', { goal_id: req.body.goal_id }).then((data) => {
			res.json({ "status": true, "details": data[0] });
		})
	} else {
		res.json({ "status": false, "message": "Some error has occured. Please try again later.", "details": "", });
	}

});
router.post('/getGoal', function (req, res, next) {

	if (req.body.goal_id) {
		functions.get('my_goal', { goal_id: req.body.goal_id }).then((data) => {
			res.json({ "status": true, "details": data[0] });
		})
	} else {
		res.json({ "status": false, "message": "Some error has occured. Please try again later.", "details": "", });
	}

});
router.post('/getMyWorkOut', function (req, res, next) {
	user.userDao.getMyWorkOut(mediaUrl, req.decoded.member_id, (data) => {
		res.json({ "status": true, "details": data });
	}, err => {
		res.json({ "status": false, "message": 'Some error has occured. Please try again later.' });
	})
});
router.post('/getWorkout', function (req, res, next) {

	user.userDao.getWorkout(mediaUrl, req.body.assigned_id, (data) => {

		res.json({ "status": true, "details": data[0] });
	}, err => {
		res.json({ "status": false, "message": 'Some error has occured. Please try again later.' });
	})
});
router.post('/deleteMyGoal', function (req, res, next) {

	functions.delete('my_goal', { goal_id: req.body.goal_id }).then((data) => {
		functions.delete('alam', { goal_id: req.body.goal_id }).then(() => {
		})
		res.json({ "status": true });
	}, (err) => {
		res.json({ "status": false, "message": 'Some error has occured. Please try again later.' });
	})

});
router.post('/updateWorkoutCount', function (req, res, next) {
	if (req.body.workout_progress_id) {
		functions.update('user_wokout_progress', { assigned_id: req.body.assigned_id, member_id: req.decoded.member_id, count: req.body.count }, { workout_progress_id: req.body.workout_progress_id }).then((data) => {
			res.json({ "status": true });
		}, (err) => {
			res.json({ "status": false, "message": 'Some error has occured. Please try again later.' });
		})

	} else {
		functions.insert('user_wokout_progress', { assigned_id: req.body.assigned_id, member_id: req.decoded.member_id, count: req.body.count }).then((data) => {
			res.json({ "status": true });
		}, (err) => {
			res.json({ "status": false, "message": 'Some error has occured. Please try again later.' });
		})
	}
});
router.post('/setWorkOutAlam', function (req, res, next) {

	functions.get('workout_alarm', { assigned_id: req.body.assigned_id }).then((data) => {
		if (data && data[0] && data[0].alam_id) {
			functions.update('workout_alarm', { member_id: req.decoded.member_id, assigned_id: req.body.assigned_id, alam_time: req.body.alam_time, alam_repeat: req.body.alam_repeat, is_repeat: req.body.is_repeat, alam_on: req.body.alam_on }, { alam_id: data[0].alam_id }).then((data) => {
				res.json({ "status": true, "message": "test" });
			})
		} else {
			functions.insert('workout_alarm', { member_id: req.decoded.member_id, assigned_id: req.body.assigned_id, alam_time: req.body.alam_time, alam_repeat: req.body.alam_repeat, is_repeat: req.body.is_repeat, alam_on: req.body.alam_on }).then((data) => {
				res.json({ "status": true, "message": "test", id: data.insertId });
			})
		}
	})
});
router.post('/getWorkoutAlam', function (req, res, next) {
	if (req.body.assigned_id) {
		functions.get('workout_alarm', { assigned_id: req.body.assigned_id }).then((data) => {
			res.json({ "status": true, "details": data[0] });
		})
	} else {
		res.json({ "status": false, "message": "Some error has occured. Please try again later.", "details": "", });
	}

});
router.post('/logout', function (req, res, next) {
	functions.update('member_master', { fcmToken: '' }, { member_id: req.decoded.member_id }).then((data) => {
		res.json({ "status": false });
	})

});
router.post('/saveEvents', function (req, res, next) {
	req.body.member_id = req.decoded.member_id;
	functions.insert('appointment', req.body).then((data) => {
		res.json({ "status": true, id: data.insertId });

	}, (err) => {
		res.json({ "status": false, "message": "Some error has occured. Please try again later.", "details": err });
	})

});
router.post('/getEvents', function (req, res, next) {


	user.userDao.getEvents(req.decoded.member_id, req.body.date, (data) => {
		//console.log(data);
		res.json({ "status": true, "details": data });
	}, err => {
		res.json({ "status": false, "message": 'Some error has occured. Please try again later.' });
	})

});
router.post('/chatList', function (req, res, next) {
	user.userDao.chatList(req.decoded.member_id, (data) => {
		//console.log(data);
		res.json({ "status": true, "details": data });
	}, err => {
		res.json({ "status": false, "message": 'Some error has occured. Please try again later.' });
	})

});


router.post('/getMessage', function (req, res, next) {


	user.userDao.getMessage(req.body.group_id, mediaUrl + 'images/users/', mediaUrl, (data) => {
		//console.log(data);
		functions.get('chat_members', { group_id: req.body.group_id }).then((count) => {
			res.json({ "status": true, "details": data, count: count.length });
		}, err => {
			res.json({ "status": false, "message": 'Some error has occured. Please try again later.' });
		})

	}, err => {
		res.json({ "status": false, "message": 'Some error has occured. Please try again later.' });
	})

});

router.post('/updateReadCount', function (req, res, next) {
	functions.update('chat_members', { last_read_message_id: req.body.message_id }, { member_id: req.decoded.member_id, group_id: req.body.group_id }).then((data) => {

	}, err => {
		res.json({ "status": false, "message": 'Some error has occured. Please try again later.' });
	})

});

router.post('/saveRequestsnew', upload.single('video_url'), function (req, res, next) {


	if (req.body.type == 'video') {
		var NewThumb = 'public/uploads/' + new Date().getTime() + '.jpg';
		thumbler.extract('public/uploads/' + req.file.filename, NewThumb, '00:00:01', '400x250', function (videoThumb) {
			functions.insert('chat_message', { group_id: req.body.group_id, member_id: req.decoded.member_id, type: req.body.type, message: req.body.message, media_url: req.file.path.split('public/')[1], thumb_nail: NewThumb.split('public/')[1] }).then((messageUpdate) => {
				console.log("test wrking")
				//pushs.
				console.log((req.file.path, (req.file.path.split('public/')[1]), "vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv"))
				pushs.message_push(messageUpdate.insertId, req.body.group_id, req.decoded.member_id, ((req.file.path.split('public/')[1])), mediaUrl);
				res.json({ "status": true, message_id: messageUpdate.insertId, media_url: (mediaUrl + (req.file.path.split('public/')[1])) });

			})

		}, err => {
			console.log("err", err)
			res.json({ "status": false, err: err })
		});
	}
	if (req.body.type == 'image') {
		console.log('new img', { group_id: req.body.group_id, member_id: req.decoded.member_id, type: req.body.type, message: req.body.message, media_url: req.file.path.split('public/')[1] })
		functions.insert('chat_message', { group_id: req.body.group_id, member_id: req.decoded.member_id, type: req.body.type, message: req.body.message, media_url: req.file.path.split('public/')[1] }).then((messageUpdate) => {
			functions.update('chat_members', { last_read_message_id: messageUpdate.insertId }, { member_id: req.decoded.member_id, group_id: req.body.group_id }).then((datas) => {

				//pushs.
				console.log((req.file.path, (req.file.path.split('public/')[1]), "111111111111111111111111111111111111"))
				pushs.message_push(messageUpdate.insertId, req.body.group_id, req.decoded.member_id, ((req.file.path.split('public/')[1])), mediaUrl);

				res.json({ "status": true, message_id: messageUpdate.insertId, media_url: (mediaUrl + (req.file.path.split('public/')[1])) });
			})


		})


	}


	console.log(req.body, req.file)

	// req.file is the `avatar` file
	// req.body will hold the text fields, if there were any
}, err => {
	res.json({ "status": false, "err": err });
});
router.post('/addMessage_old', function (req, res, next) {
	functions.insert('chat_message', { message: req.body.message, group_id: req.body.group_id, member_id: req.decoded.member_id }).then((data) => {

		res.json({ "status": true, message_id: data.insertId });

		functions.update('chat_members', { last_read_message_id: data.insertId }, { member_id: req.decoded.member_id, group_id: req.body.group_id }).then((datas) => {

		})

	}, err => {
		res.json({ "status": false, "message": 'Some error has occured. Please try again later.' });
	})

});


router.post('/addMessage', usercontroller.sendMessage);
router.post('/getMyWorkouts', usercontroller.getMyWorkouts);
router.post('/getAlaramDetails', usercontroller.getAlaramDetails);
router.post('/saveSubscriptionDetails', usercontroller.saveSubscriptionDetails);
module.exports = router;


