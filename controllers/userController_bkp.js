let express = require('express'),
    app = express(),
    jwt = require('jsonwebtoken'),
    config = require('../server/config'),
    emailValidator = require('email-validator'),
    user = require('.././models/userModel'),
    moment = require('moment'),
    multer = require('multer'),
    NodeGeocoder = require('node-geocoder'),
    functions = require('../helpers/functions'),
    thumbler = require('video-thumb'),
    //ffmpeg = require('ffmpeg'),

    //FCM = require('fcm-push'),
    //https = require('https'),
    functions2 = require('.././server/functions');
var async = require("async");

//var maintain = require('.././server/DataAccessObject/maintainDao');


var fs = require('fs');
var upload = multer({ dest: 'uploads/' })
//var stripe = require('stripe')('sk_test_FXxEPC8iragnohuFaT58oAca');

let handler = {

    index(req, res, next) {
        res.send('respond with a resource');
    },

    login(req, res, next) {
        if (!req.body.email) {
            res.json({ "status": false, "message": "Email is required." });
        } else if (!req.body.password) {
            res.json({ "status": false, "message": "Password is required." });
        } else if (!emailValidator.validate(req.body.email)) {
            res.json({ "status": false, "message": "Invalid email." });
        } else {
            user.getUserByEmail(req.body.email).then((result) => {
                if (result.length) {
                    if (result[0].status == 'N') {
                        res.json({ "status": false, "message": "Your account is not activated." });
                    } else if (result[0].blocked == 'Y') {
                        res.json({ "status": false, "message": "Your account is blocked by the super admin." });
                    } else {
                        functions2.decryptPass(result[0].password, function (pass) {
                            if (req.body.password == pass) {
                                var token = jwt.sign({ "email": result[0].email, "member_id": result[0].member_id }, config.jwt_secret, {
                                    expiresIn: "240000h"
                                });
                                if (result[0].member_type == '0') {
                                    res.json({ "status": true, "user": result[0], "userToken": token, "message": "Logged In Successfully." });
                                } else if (result[0].member_type == '1') {
                                    res.json({ "status": true, "user": result[0], "userToken": token, "message": "Logged In Successfully." });
                                } else {
                                    res.json({ "status": true, "user": result[0], "userToken": token, "message": "Logged In Successfully ." });
                                }
                            } else {
                                res.json({ "status": false, "message": "Incorrect password." });
                            }
                        })
                    }
                } else {
                    res.json({ "status": false, "message": "User does not exist." });
                }
            }).catch((err) => {
                res.json({ "status": false, "message": "Oops! something went wrong." });
            })
        }
    },
    getUsers(req, res, next) {
        user.getUsers(req.query)
            .then((users) => {
                res.json({ "status": true, "message": "users", "users": users });
            }).catch((err) => {
                res.json({ "status": false, "message": "No record found." });
            })
    },
    getUserdetails(req, res, next) {
        user.getUserdetails(req.query)
            .then((users) => {
                res.json({ "status": true, "message": "users", "data": users });
            }).catch((err) => {
                res.json({ "status": false, "message": "No record found." });
            })
    },
    getHealthInfo(req, res, next) {
        user.getHealthInfo(req.query)
            .then((healthinfo) => {
                res.json({ "status": true, "message": "users", "healthinfo": healthinfo });
            }).catch((err) => {
                res.json({ "status": false, "message": "No record found." });
            })
    },
    getWorkouts(req, res, next) {
        user.getWorkouts(req.query)
            .then((data) => {
                res.json({ "status": true, "message": "Workouts", "data": data });
            }).catch((err) => {
                res.json({ "status": false, "message": "No record found." });
            })
    },
    saveWorkout(req, res, next) {
        //console.log(req.body);
        if (req.decoded.member_id) {
            if (!req.body.details.workout_name) res.json({ "status": false, "message": "Workout name is required", "errorcode": "validationError" });
            else if (!req.body.details.duration) res.json({ "status": false, "message": "Duration is required", "errorcode": "validationError" });
            else if (!req.body.details.rest) res.json({ "status": false, "message": "Rest is required", "errorcode": "validationError" });
            else if (!req.body.details.repeat_times) res.json({ "status": false, "message": "Repeat is required", "errorcode": "validationError" });
            else if (req.body.details.image_url == '' && req.body.details.oldimage_url == '' ) res.json({ "status": false, "message": "Image is required", "errorcode": "validationError" });
            else {


                if (req.file != undefined || req.body.details.oldvideo_url != ''    ) {
                    let image_url = '';
                    if(req.body.details.image_url != '' && req.body.details.image_url != undefined){
                        let uploadPath = 'public/uploads/thumbs/';
                        let timeSec = new Date().getTime();
                        image_url = 'uploads/thumbs/' + timeSec + ".png";
                        if (req.body.details.image_url != '' && req.body.details.image_url != undefined) {
                            let b = [];
                            b = req.body.details.image_url.split(',');
                            fs.writeFile(uploadPath + timeSec + ".png", b[1], 'base64', function (err) {
    
                            });
                        }
                    }else{
                        image_url = req.body.details.oldimage_url;
                    }
                    let video_url = '';
                    if(req.file){
                        video_url = 'uploads/workouts/' + req.file.filename;
                    }else{
                        video_url = req.body.details.oldvideo_url;
                    }

                    
                    var s_details = {
                        workout_name: req.body.details.workout_name,
                        duration: req.body.details.duration,
                        rest: req.body.details.rest,
                        repeat_times: req.body.details.repeat_times,
                        image_url: image_url,
                        video_url: video_url,
                    };
                    if (req.body.details.workout_id != undefined && req.body.details.workout_id != '') {
                       
                        functions.update('workout_master',s_details, { "workout_id": req.body.details.workout_id }).then((result) => {
                            if (result.affectedRows) {
                                s_details['workout_id']= req.body.details.workout_id ;
                                res.json({ "status": true, "message": "Workout updated successfully", "data": s_details });
                            } else
                                throw "serverError";
                        }).catch((err) => {
                            res.json({ "status": false, "message": err, "errorcode": "serverError" });
                        })
                    } else {
                        functions.insert('workout_master',s_details).then((result) => {
                            if (result.affectedRows) {
                                s_details['workout_id'] = result.insertId;
                                res.json({ "status": true, "message": "Workout added successfully", "data": s_details });
                            } else
                                throw "serverError";
                        })
                        .catch((err) => {
                            res.json({ "status": false, "message": err, "errorcode": "serverError" });
                        })

                    }

                } else {
                    res.json({ "status": false, "message": "Video is required" });
                }

            }
        } else res.json({ "status": false, "message": "Unauthorized Access", "errorcode": "serverError" });

        //res.json({ "status": false, "message": "No record found." });
        // user.getWorkouts(req.query)
        // .then((data) => {
        //     res.json({ "status": true, "message": "Workouts", "data": data });
        // }).catch((err) => {
        //     res.json({ "status": false, "message": "No record found." });
        // })
    },
    deleteWorkout(req, res, next) {
        if (req.query.workout_id) {
            functions2.delete('workout_master', { workout_id: req.query.workout_id }, function (result) {
                if (result.affectedRows) {
                    res.json({ "status": true, "message": "Workout deleted successfully." });
                } else {
                    res.json({ "status": false, "message": "Network connection problem. Please try again." });
                }
            })
        } else {
            res.json({ "status": false, "message": "Cannot find the Workout." });
        }
    },
    getWorkoutdetails(req, res, next) {
        user.getWorkoutdetails(req.query)
        .then((details) => {
            res.json({ "status": true, "message": "Details", "data": details });
        })
        .catch((err) => {
            res.json({ "status": false, "message": err });
        })
    },
    getAssignedWorkouts(req, res, next) {
        user.getAssignedWorkouts(req.query)
        .then((details) => {
            res.json({ "status": true, "message": "Details", "data": details });
        })
        .catch((err) => {
            res.json({ "status": false, "message": err });
        })
    },
    deleteAssigns(req, res, next) {
        if (req.query.assigned_id) {
            functions2.delete('assigned_workout_master', { assigned_id: req.query.assigned_id }, function (result) {
                if (result.affectedRows) {
                    res.json({ "status": true, "message": "Assigned Workout deleted successfully." });
                } else {
                    res.json({ "status": false, "message": "Network connection problem. Please try again." });
                }
            })
        } else {
            res.json({ "status": false, "message": "Cannot find the Workout." });
        }
    },
    deleteUser(req, res, next) {
        if (req.query.member_id) {
            functions2.delete('member_master', { member_id: req.query.member_id }, function (result) {
                if (result.affectedRows) {
                    res.json({ "status": true, "message": "User deleted successfully." });
                } else {
                    res.json({ "status": false, "message": "Network connection problem. Please try again." });
                }
            })
        } else {
            res.json({ "status": false, "message": "Cannot find the Workout." });
        }
    },
    changeUserStatus(req, res, next) {
        var details = {
            status: req.body.status
        }
        if (req.body.member_id != '' && req.body.member_id != undefined) {
            functions2.update('member_master', details, { member_id: req.body.member_id }, function (updatetRes) {
                if (updatetRes.affectedRows) {
                res.json({ "status": true, "message": "successfully updated" });
                } else {
                res.json({ "status": false, "message": "Network connection problem. Please try again." });
                }
            })
        } else {
            res.json({ "status": false, "message": "Cannot find the Category." });
        }
        
    },
    saveWorkoutAssign(req, res, next) {
        var details = {
            workout_id: req.body.workout_id,
            member_id: req.body.member_id,
            repeat_times: req.body.repeat_times,
            created_date: moment().format("YYYY-MM-DD H:m:s")
        }
        if (req.body.workout_id != '' && req.body.workout_id != undefined) {
            functions2.insert('assigned_workout_master', details, function (updatetRes) {
                if (updatetRes.affectedRows) {
                    res.json({ "status": true, "message": "successfully added" });
                } else {
                    res.json({ "status": false, "message": "Network connection problem. Please try again." });
                }
            })
        } else {
            res.json({ "status": false, "message": "Please select workout" });
        }
        
    },
    getPainChartRecords(req, res, next) {
        user.getPainChartRecords(req.query)
        .then((details) => {
            res.json({ "status": true, "message": "Details", "data": details });
        })
        .catch((err) => {
            res.json({ "status": false, "message": err });
        })
    },
    getDailyLogWorkouts(req, res, next) {
        user.getDailyLogWorkouts(req.query)
        .then((details) => {
            res.json({ "status": true, "message": "Details", "data": details });
        })
        .catch((err) => {
            res.json({ "status": false, "message": err });
        })
    },

    getSettings(req, res, next) {
        user.getSettings(req.query)
        .then((details) => {
            res.json({ "status": true, "result": details });
        })
        .catch((err) => {
            res.json({ "status": false, "message": err });
        })
        
    },
    changePassword(req, res, next){
        if (req.decoded.member_id) {
            let member_id = req.decoded.member_id;
            if (!req.body.oldpassword) res.json({ "status": false, "message": "Old Password is required", "errorcode": "validationError" });
            else if (!req.body.newPassword) res.json({ "status": false, "message": "New Password is required", "errorcode": "validationError" });
            else {
                functions.get('member_master', { member_id: member_id })
                .then((result) => {
                    if (result.length) {

                        functions2.decryptPass(result[0].password, function (pass) {
                            if (pass != req.body.oldpassword) {
                                res.json({ "status": false, "message": "Incorrect Old Password" });
                            } else {
                                functions2.encryptPass(req.body.newPassword, function (enc_pass) {
                                    functions2.update('member_master', { "password": enc_pass }, { "member_id": member_id }, function (result) {
                                        if (result.affectedRows) {
                                            res.json({ "status": true, "message": "Password changed successfully." });
                                        } else {
                                            res.json({ "status": false, "message": "Network connection problem. Please try again." });
                                        }
                                    })
                                })

                            }

                        });

                    }
                    else throw 'No User exist';
                })
                .catch((err) => {
                    res.json({ "status": false, "message": err, "errorcode": "serverError" });
                })
            }
        } else {
            res.json({ "status": false, "message": "Unauthorized Access", "errorcode": "serverError" });
        }
    },

    //--------------------------------------------



    register(req, res, next) {
        console.log(req.body.email);
        if (!req.body.first_name) {
            res.json({ "status": false, "message": "First Name is required." });
        } else if (!req.body.last_name) {
            res.json({ "status": false, "message": "Last Name is required." });
        } else if (!req.body.email) {
            res.json({ "status": false, "message": "Email is required." });
        } else if (!req.body.password) {
            res.json({ "status": false, "message": "Password is required." });
        } else {
            user.getUserByEmail(req.body.email).then((result) => {
                if (result.length) {
                    res.json({ "status": false, "message": "Email ID already exist." });
                } else {

                    var verify_code = Math.floor((Math.random() * 9999) + 1000);

                    functions2.encryptPass(req.body.password, function (enc_pass) {
                        functions.insert('member_master', {
                            first_name: req.body.first_name, last_name: req.body.last_name, email: req.body.email,
                            password: enc_pass, member_type: 1, created_date: moment().format("YYYY-MM-DD H:m:s")
                        })
                            .then((result) => {
                                if (result.affectedRows) {
                                    functions2.update("member_master", { "verify_code": verify_code, "status": 'N' }, { "member_id": result.insertId }, function (results) {
                                        if (results.affectedRows) {
                                            functions2.get('email_config', { "name": "account_activation" }, function (template) {

                                                if (template) {
                                                    var email_template = template[0];
                                                    email_template.template = email_template.template.replace("#FIRST_NAME#", req.body.first_name);
                                                    email_template.template = email_template.template.replace("#LAST_NAME#", req.body.last_name);
                                                    email_template.template = email_template.template.replace("#CODE#", verify_code);
                                                    functions2._send(req.body.email, email_template.subject, email_template, true, function (emailres) {
                                                        if (emailres.status == true) {
                                                            //res.json(emailres);
                                                        } else {
                                                            //res.json({ "status": false, "message": "Email sending failed." });
                                                        }
                                                    })
                                                } else {
                                                    //res.json({ "status": false, "message": "Email template for account activation is not found." });
                                                }
                                            })
                                            res.json({ "status": true, "message": "We have sent a verification code to your email id." });
                                        } else {
                                            res.json({ "status": false, "message": "Error" });
                                        }
                                    });
                                } else
                                    throw "Database Error";
                            })
                            .catch((err) => {

                                res.json({ "status": false, "message": err, "errorcode": "serverError" });
                            })
                    })

                }
            }).catch((err) => {
                res.json({ "status": false, "message": "Oops! something went wrong." });
            })
        }



    },


    getCategories(req, res, next) {
        user.getCategories(req.body, req.decoded.member_id)
            .then((categories) => {
                res.json({ "status": true, "message": "Categories", "categories": categories });
            })
            .catch((err) => {
                res.json({ "status": false, "message": err });
            })
    },
    getCategoriesTopics(req, res, next) {
        console.log(req.decoded.member_id);
        user.getCategoriesTopics(req.body)
            .then((topics) => {
                return Promise.all([topics, user.getTopicPurchasedChecking(req.decoded.member_id, req.body.category_id)]);
                //res.json({ "status": true, "message": "Categories", "topics": topics });
            }).then((topics) => {
                res.json({ "status": true, "message": "Categories", "topics": topics[0], "purchaseDetails": topics[1] });
            }).catch((err) => {
                res.json({ "status": false, "message": err });
            })
    },
    getSearchResults(req, res, next) {
        let questions = [];
        user.getSearchResults(req.body)
            .then((chapters) => {
                user.getSearchResultsTexts(req.body)
                    .then((texts) => {
                        res.json({ "status": true, "message": "Search Results", "chapters": chapters, "texts": texts, "questions": questions });
                    })
            })
            .catch((err) => {
                res.json({ "status": false, "message": err });
            })
    },
    getTopicDetails(req, res, next) {
        //console.log(req.body);
        user.getTopicDetails(req.body)
            .then((details) => {
                let uploadPath = 'public/uploads/topics/' + req.body.topic_id + '/';
                let imagePath = 'uploads/topics/' + req.body.topic_id + '/';
                let typeAr = new Array();
                //res.json({ "status": true, "message": "Categories", "details": details ,"images":typeAr});
                fs.readdir(uploadPath, (err, files) => {
                    //res.json({ "status": true, "message": "Categories", "details": details ,"images":typeAr});
                    async.forEachOf(files, (value, key, callback) => {
                        typeAr.push(imagePath + value);
                        callback();
                    }, err => {
                        if (err) console.error(err.message);
                        //req.response.data[0].images = typeAr;
                        res.json({ "status": true, "message": "Categories", "details": details, "images": typeAr });
                        //next();	
                    });

                })

            })
            .catch((err) => {
                res.json({ "status": false, "message": err });
            })
    },

    editProfile(req, res, next) {
        //console.log(req.decoded.member_id);
        if (req.decoded.member_id) {
            let member_id = req.decoded.member_id;
            if (!req.body.first_name) res.json({ "status": false, "message": "First name is required", "errorcode": "validationError" });
            else if (!req.body.last_name) res.json({ "status": false, "message": "Last name is required", "errorcode": "validationError" });
            else {
                var base64Data = req.body.image;
                var uploadPath = 'public/uploads/profile/';
                if (base64Data != '') {
                    let timeSec = new Date().getTime();
                    fs.writeFile(uploadPath + member_id + '_' + timeSec + ".png", base64Data, 'base64', function (err) {
                        let profilePath = 'uploads/profile/' + member_id + '_' + timeSec + ".png";
                        functions.update('member_master', {
                            "profileImage": profilePath, first_name: req.body.first_name, last_name: req.body.last_name
                        },
                            { member_id: req.decoded.member_id })
                            .then((result) => {
                                if (result.affectedRows) {
                                    functions.get('member_master', { member_id: req.decoded.member_id })
                                        .then((result) => {
                                            res.json({ "status": true, "message": "Profile updated successfully", "UserDetails": result });
                                        });
                                } else
                                    throw "No member found";
                            })
                            .then(() => {
                            })
                            .catch((err) => {
                                res.json({ "status": false, "message": err, "errorcode": "serverError" });
                            })

                    });
                } else {
                    functions.update('member_master', { first_name: req.body.first_name, last_name: req.body.last_name },
                        { member_id: req.decoded.member_id })
                        .then((result) => {
                            if (result.affectedRows) {
                                functions.get('member_master', { member_id: req.decoded.member_id })
                                    .then((result) => {
                                        res.json({ "status": true, "message": "Profile updated successfully", "UserDetails": result });
                                    });
                            } else
                                throw "No member found";
                        })
                        .then(() => {
                        })
                        .catch((err) => {
                            res.json({ "status": false, "message": err, "errorcode": "serverError" });
                        })
                }



            }
        } else {
            res.json({ "status": false, "message": "Unauthorized Access", "errorcode": "serverError" });
        }
    },

    changePassword(req, res, next) {
        if (req.decoded.member_id) {
            let member_id = req.decoded.member_id;
            if (!req.body.oldpassword) res.json({ "status": false, "message": "Old Password is required", "errorcode": "validationError" });
            else if (!req.body.newPassword) res.json({ "status": false, "message": "New Password is required", "errorcode": "validationError" });
            else {
                functions.get('member_master', { member_id: member_id })
                    .then((result) => {
                        if (result.length) {

                            functions2.decryptPass(result[0].password, function (pass) {
                                if (pass != req.body.oldpassword) {
                                    res.json({ "status": false, "message": "Incorrect Old Password" });
                                } else {
                                    functions2.encryptPass(req.body.newPassword, function (enc_pass) {
                                        functions2.update('member_master', { "password": enc_pass }, { "member_id": member_id }, function (result) {
                                            if (result.affectedRows) {
                                                res.json({ "status": true, "message": "Password changed successfully." });
                                            } else {
                                                res.json({ "status": false, "message": "Network connection problem. Please try again." });
                                            }
                                        })
                                    })

                                }

                            });

                        }
                        else throw 'No User exist';
                    })
                    .catch((err) => {
                        res.json({ "status": false, "message": err, "errorcode": "serverError" });
                    })
            }
        } else {
            res.json({ "status": false, "message": "Unauthorized Access", "errorcode": "serverError" });
        }
    },





    //----------------------



    logout(req, res, next) {
        console.log(req.decoded.member_id);
        if (req.decoded.member_id) {
            functions.update('member_master', { device_token: '', device_type: "" },
                { member_id: req.decoded.member_id })
                .then((result) => {
                    res.json({ "status": true, "message": "Logout successfully", });
                }).catch((err) => {
                    res.json({ "status": false, "message": err, "errorcode": "serverError" });
                })
        } else res.json({ "status": false, "message": "Unauthorized Access", "errorcode": "serverError" });


    },



}
module.exports = handler;