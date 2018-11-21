let express = require('express'),
    app = express(),
    jwt = require('jsonwebtoken'),
    config = require('../server/config'),
    emailValidator = require('email-validator'),

    user = require('.././models/userModel'),
    moment = require('moment'),
    multer = require('multer'),
    //NodeGeocoder = require('node-geocoder'),
    functions = require('../helpers/functions'),
    thumbler = require('video-thumb'),
    //ffmpeg = require('ffmpeg'),

    //FCM = require('fcm-push'),
    https = require('https'),
    functions2 = require('../server/functions');
let pushs = require('../helpers/pushs');

var async = require("async");
//var mediaUrl = 'http://10.10.10.41:7071/';
var mediaUrl = 'http://newagesme.com:7071/'
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
                console.log(result.length, "step 2")
                if (result.length) {
                    if (result[0].status == 'N') {
                        res.json({ "status": false, "message": "Your account is not activated." });
                    } else if (result[0].blocked == 'Y') {
                        res.json({ "status": false, "message": "Your account is blocked by the super admin." });
                    } else {
                        console.log("step 1")
                        functions2.decryptPass(result[0].password, (pass) => {
                            console.log("step 3")
                            if (req.body.password == pass) {
                                console.log("step 4")
                                var token = jwt.sign({ "email": result[0].email, "member_id": result[0].member_id }, config.jwt_secret, {
                                    expiresIn: "240000h"
                                });
                                if (result[0].member_type == '0') {
                                    console.log("step 5")
                                    res.json({ "status": true, "user": result[0], "userToken": token, "message": "Logged In Successfully." });
                                } else if (result[0].member_type == '1') {
                                    res.json({ "status": true, "user": result[0], "userToken": token, "message": "Logged In Successfully." });
                                } else {
                                    res.json({ "status": true, "user": result[0], "userToken": token, "message": "Logged In Successfully ." });
                                }
                            } else {
                                res.json({ "status": false, "message": "Incorrect password." });
                            }
                        }, err => {
                            console.log(err, "e3rr")
                        })
                    }
                } else {
                    res.json({ "status": false, "message": "User does not exist." });
                }
            }).catch((err) => {
                res.json({ "status": false, "message": "Oops! something went wrong.", err: err });
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
            if (!req.body.details.category_id) res.json({ "status": false, "message": "Category is required", "errorcode": "validationError" });
            else if (!req.body.details.subcategory_id) res.json({ "status": false, "message": "Sub Category is required", "errorcode": "validationError" });
            else if (!req.body.details.workout_name) res.json({ "status": false, "message": "Workout name is required", "errorcode": "validationError" });
            else if (!req.body.details.duration) res.json({ "status": false, "message": "Sets is required", "errorcode": "validationError" });
            else if (!req.body.details.weight) res.json({ "status": false, "message": "weight is required", "errorcode": "validationError" });
            else if (!req.body.details.rest && !req.body.details.rest_sec) res.json({ "status": false, "message": "Rest is required", "errorcode": "validationError" });
            else if (!req.body.details.repeat_times) res.json({ "status": false, "message": "Repeat is required", "errorcode": "validationError" });
            else if (req.body.details.image_url == '' && req.body.details.oldimage_url == '') res.json({ "status": false, "message": "Image is required", "errorcode": "validationError" });
            else {


                if (req.file != undefined || req.body.details.oldvideo_url != '') {
                    let image_url = '';
                    if (req.body.details.image_url != '' && req.body.details.image_url != undefined) {
                        let uploadPath = 'public/uploads/thumbs/';
                        let timeSec = new Date().getTime();
                        image_url = 'uploads/thumbs/' + timeSec + ".png";
                        if (req.body.details.image_url != '' && req.body.details.image_url != undefined) {
                            let b = [];
                            b = req.body.details.image_url.split(',');
                            fs.writeFile(uploadPath + timeSec + ".png", b[1], 'base64', function (err) {

                            });
                        }
                    } else {
                        image_url = req.body.details.oldimage_url;
                    }
                    let video_url = '';
                    if (req.file) {
                        video_url = 'uploads/workouts/' + req.file.filename;
                    } else {
                        video_url = req.body.details.oldvideo_url;
                    }


                    var s_details = {
                        category_id: req.body.details.category_id,
                        subcategory_id: req.body.details.subcategory_id,
                        workout_name: req.body.details.workout_name,
                        duration: req.body.details.duration,
                        rest: req.body.details.rest,
                        repeat_times: req.body.details.repeat_times,
                        image_url: image_url,
                        video_url: video_url,
                        rest_sec: req.body.details.rest_sec,
                        weight: req.body.details.weight,
                    };
                    console.log(s_details)
                    if (req.body.details.workout_id != undefined && req.body.details.workout_id != '') {

                        functions.update('workout_master', s_details, { "workout_id": req.body.details.workout_id }).then((result) => {
                            if (result.affectedRows) {
                                s_details['workout_id'] = req.body.details.workout_id;
                                res.json({ "status": true, "message": "Workout updated successfully", "data": s_details });
                            } else
                                throw "serverError";
                        }).catch((err) => {
                            res.json({ "status": false, "message": err, "errorcode": "serverError" });
                        })
                    } else {
                        functions.insert('workout_master', s_details).then((result) => {
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
    saveGroupMembers(req, res, next) {

        functions.delete('chat_members', { group_id: req.query.group_id }).then(data => {
            if (req.query.group_members && req.query.group_members.length) {
                console.log(typeof (req.query.group_members), req.query.group_members.length, "GFDHFGHF GFDHGFDH GFDH GFDH");
                if (typeof (req.query.group_members) == 'object') {
                    req.query.group_members.map((item) => {
                        functions.insert('chat_members', { member_id: item, group_id: req.query.group_id }).then(dtaa => {

                        })
                    })
                } else {
                    functions.insert('chat_members', { member_id: req.query.group_members, group_id: req.query.group_id }).then(dtaa => {
                    })
                }

            }
            setTimeout(() => {
                res.json({ "status": true });
            }, 300);


        })
        console.log("test")
        console.log(req.query, "bodyysaduy");
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

        console.log(req.body)

        var details = {
            workout_id: req.body.workout_id,
            member_id: req.body.member_id,
            category_id: req.body.category_id,
            subcategory_id: req.body.subcategory_id,
            repeat_times: req.body.repeat_times,
            created_date: moment().format("YYYY-MM-DD H:m:s"),
            work_times: req.body.work_times,
            onetime_date: moment(req.body.onetime_date).format("YYYY-MM-DD"),
            work_period: req.body.work_period,
            chosen_week: req.body.chosen_week,
            workout_details: req.body.workout_details,
            duration: req.body.duration,
            rest: req.body.rest,
            rest_sec: req.body.rest_sec,
            weight: req.body.weight,
        }

        if (req.body.assigned_id) {

            if (req.body.workout_id != '' && req.body.workout_id != undefined) {
                functions2.update('assigned_workout_master', details, { assigned_id: req.body.assigned_id }, function (updatetRes) {
                    if (updatetRes.affectedRows) {
                        details.assigned_id = req.body.assigned_id;
                        pushs.sendWorkOutUpdatedPush(details);
                        res.json({ "status": true, "message": "successfully added" });
                    } else {
                        res.json({ "status": false, "message": "Network connection problem. Please try again." });
                    }
                })
            } else {
                res.json({ "status": false, "message": "Please select workout" });
            }


        } else {
            if (req.body.workout_id != '' && req.body.workout_id != undefined) {
                functions2.insert('assigned_workout_master', details, function (updatetRes) {
                    if (updatetRes.affectedRows) {
                        details.assigned_id = updatetRes.insertId;
                        pushs.sendWorkOutPush(details);
                        res.json({ "status": true, "message": "successfully added" });
                    } else {
                        res.json({ "status": false, "message": "Network connection problem. Please try again." });
                    }
                })
            } else {
                res.json({ "status": false, "message": "Please select workout" });
            }
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
        req.query.date = moment(req.query.date).format("YYYY-MM-DD");
        user.getDailyLogWorkouts(req.query)
            .then((details) => {
                res.json({ "status": true, "message": "Details", "data": details });
            })
            .catch((err) => {
                res.json({ "status": false, "message": err });
            })
    },
    getDashboardCounts(req, res, next) {
        user.getDashboardCounts(req.query)
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

    getCategories(req, res, next) {
        user.getCategories(req.query)
            .then((categories) => {
                res.json({ "status": true, "message": "Categories", "categories": categories });
            })
            .catch((err) => {
                res.json({ "status": false, "message": err });
            })
    },
    changeCategoryStatus(req, res, next) {
        var details = {
            status: req.body.status
        }
        if (req.body.category_id != '' && req.body.category_id != undefined) {
            functions2.update('category_master', details, { category_id: req.body.category_id }, function (updatetRes) {
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
    deleteCategory(req, res, next) {
        if (req.query.category_id) {
            functions2.delete('category_master', { category_id: req.query.category_id }, function (result) {
                if (result.affectedRows) {
                    res.json({ "status": true, "message": "Category deleted successfully." });
                } else {
                    res.json({ "status": false, "message": "Network connection problem. Please try again." });
                }
            })
        } else {
            res.json({ "status": false, "message": "Cannot find the Workout." });
        }
    },

    saveCategory(req, res, next) {
        var details = {
            category_name: req.body.category_name,
            status: 'Y'
        }
        if (req.body.category_id == '') {
            functions2.insert('category_master', details, function (updatetRes) {
                if (updatetRes.affectedRows) {
                    res.json({ "status": true, "message": "successfully added" });
                } else {
                    res.json({ "status": false, "message": "Network connection problem. Please try again." });
                }
            })

        } else {
            functions2.update('category_master', details, { category_id: req.body.category_id }, function (updatetRes) {
                if (updatetRes.affectedRows) {
                    res.json({ "status": true, "message": "successfully updated" });
                } else {
                    res.json({ "status": false, "message": "Network connection problem. Please try again." });
                }
            })
        }


    },
    getSubCategories(req, res, next) {
        user.getSubCategories(req.query)
            .then((categories) => {
                res.json({ "status": true, "message": "Sub Categories", "subcategories": categories });
            })
            .catch((err) => {
                res.json({ "status": false, "message": err });
            })
    },
    saveSubCategory(req, res, next) {
        var details = {
            category_id: req.body.category_id,
            sub_category_name: req.body.sub_category_name,
            status: 'Y'
        }
        if (req.body.sub_category_id == '') {
            functions2.insert('sub_category_master', details, function (updatetRes) {
                if (updatetRes.affectedRows) {
                    res.json({ "status": true, "message": "successfully added" });
                } else {
                    res.json({ "status": false, "message": "Network connection problem. Please try again." });
                }
            })

        } else {
            functions2.update('sub_category_master', details, { sub_category_id: req.body.sub_category_id }, function (updatetRes) {
                if (updatetRes.affectedRows) {
                    res.json({ "status": true, "message": "successfully updated" });
                } else {
                    res.json({ "status": false, "message": "Network connection problem. Please try again." });
                }
            })
        }


    },
    deleteSubCategory(req, res, next) {
        if (req.query.sub_category_id) {
            functions2.delete('sub_category_master', { sub_category_id: req.query.sub_category_id }, function (result) {
                if (result.affectedRows) {
                    res.json({ "status": true, "message": "Sub Category deleted successfully." });
                } else {
                    res.json({ "status": false, "message": "Network connection problem. Please try again." });
                }
            })
        } else {
            res.json({ "status": false, "message": "Cannot find the Workout." });
        }
    },

    sendMessage(req, res, next) {

        if (req.decoded.member_id) {
            var details = {
                group_id: req.body.group_id,
                member_id: req.decoded.member_id,
                message: req.body.message,
                type: 'text'
            }
            let image_url = '';
            if (req.body.textimage != '' && req.body.textimage != undefined) {
                let uploadPath = 'public/uploads/thumbs/';
                let timeSec = new Date().getTime();
                image_url = 'uploads/thumbs/' + timeSec + ".png";
                details.media_url = image_url;
                details.type = 'image';
                if (req.body.textimage != '' && req.body.textimage != undefined) {
                    let b = [];
                    b = req.body.textimage.split(',');
                    fs.writeFile(uploadPath + timeSec + ".png", b[1], 'base64', function (err) {

                    });
                }
            }
            functions.insert('chat_message', details).then((result) => {
                if (result.affectedRows) {
                    res.json({ "status": true, "message": "Message send successfully", "data": details });
                    pushs.message_push(result.insertId, req.body.group_id, req.decoded.member_id, mediaUrl, mediaUrl);
                } else
                    throw "serverError";
            })
                .catch((err) => {
                    res.json({ "status": false, "message": err, "errorcode": "serverError" });
                })

        } else {
            res.json({ "status": false, "message": "Unauthorized Access", "errorcode": "serverError" });
        }
    },
    sendVideoMessage(req, res, next) {
        if (req.decoded.member_id) {
            if (req.file) {
                video_url = 'uploads/workouts/' + req.file.filename;
            } else {
                video_url = '';
            }
            var details = {
                group_id: req.body.group_id,
                member_id: req.decoded.member_id,
                message: req.body.message,
                type: 'video',
                media_url: video_url
            }
            functions.insert('chat_message', details).then((result) => {
                if (result.affectedRows) {


                    let video_thumb = '';

                    if (req.file != '' && req.file != undefined) {
                        let ar = req.file.filename.split('.');
                        video_thumb = 'uploads/workouts/' + ar[0] + '.jpg';
                        video_url = 'uploads/' + req.file.filename;
                        thumbler.extract('public/uploads/workouts/' + req.file.filename, 'public/uploads/workouts/' + ar[0] + '.jpg', '00:00:01', '400x250', (data) => {
                            functions.update('chat_message', { thumb_nail: video_thumb }, { message_id: result.insertId }).then((msgInsert) => {
                                pushs.message_push(result.insertId, req.body.group_id, req.decoded.member_id, mediaUrl, mediaUrl);
                            })
                        });
                    } else {
                        pushs.message_push(result.insertId, req.body.group_id, req.decoded.member_id, mediaUrl, mediaUrl);
                    }


                    res.json({ "status": true, "message": "Message send successfully", "data": details });

                } else
                    throw "serverError";
            })
                .catch((err) => {
                    res.json({ "status": false, "message": err, "errorcode": "serverError" });
                })
        } else {
            res.json({ "status": false, "message": "Unauthorized Access", "errorcode": "serverError" });
        }
    },
    getGroups(req, res, next) {
        user.getGroups(req.query)
            .then((groups) => {
                res.json({ "status": true, "message": "Groups", "data": groups });
            })
            .catch((err) => {
                res.json({ "status": false, "message": err });
            })
    },
    getAlaramDetails(req, res, next) {
        user.myGoal(req.decoded.member_id)
            .then((myGoal) => {
                user.myWorkout(req.decoded.member_id)
                    .then((myWorkout) => {
                        res.json({ "status": true, "myGoal": myGoal, myWorkout: myWorkout });
                    })
            })
            .catch((err) => {
                res.json({ "status": false, "message": err });
            })
    },
    saveSubscriptionDetails(req, res, next) {
        functions.insert('subscription', { member_id: req.decoded.member_id, subscription_id: req.body.subscription_id, device: req.decoded.device }).then((data) => {
            res.json({ "status": true });
        }).catch((err) => {
            res.json({ "status": false });
        })
    },

    getChatHistory(req, res, next) {
        console.log(req.query);
        user.getChatHistory(req.query)
            .then((chats) => {
                res.json({ "status": true, "message": "Groups", "data": chats });
            })
            .catch((err) => {
                res.json({ "status": false, "message": err });
            })
    },
    creatGroups(req, res, next) {
        if (req.query.group_id) {
            functions.update('chat_groups', { group_name: req.query.group_name }, { group_id: req.query.group_id }).then((data) => {
                res.json({ "status": true, details: { group_id: data.insertId } });
            })
        } else {
            functions.insert('chat_groups', { group_name: req.query.group_name }).then((data) => {
                res.json({ "status": true, details: { group_id: data.insertId } });
            })
        }

    },
    deleteGroup(req, res, next) {
        functions.delete('chat_groups', { group_id: req.query.group_id }).then((data) => {
            res.json({ "status": true });
        })
    },
    getMebers(req, res, next) {
        console.log(req.query.group_id);
        functions.get('member_master', { member_type: '1' }).then((data) => {
            functions.get('chat_members', { group_id: req.query.group_id }).then((datas) => {
                res.json({ "status": true, group_members: datas, members: data });
            })
        })
    },
    getSubscription(req, res, next) {
        
        user.getSubscription()
        .then((data) => {
            res.json({ "status": true, "message": "subscription", "subscription": data });
        }).catch((err) => {
            res.json({ "status": false, "message": "No record found." });
        })
    },
    

    
    //--------------------------------------------


























    register(req, res, next) {
        //console.log(req.body.email);
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


    getCategoriesTopics(req, res, next) {
        //console.log(req.decoded.member_id);
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
        //console.log(req.decoded.member_id);
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

    getMyWorkouts(req, res, next) {

        // req.decoded.member_id = 52;
        user
            .getMyWorkouts(req.decoded)
            .then(myworkouts => {
                var req_date = req.body.date;
                var check = moment(req_date, "YYYY/MM/DD");
                var m = check.format("M");
                var y = check.format("Y");
                if (m.length == 1) {
                    var date = new Date("" + y + "-0" + m + "-" + "01 12:00:00");
                } else {
                    var date = new Date("" + y + "-" + m + "-" + "01 12:00:00");
                }
                var obj = [];

                while (date.getMonth() + 1 == m) {

                    var newDate = new Date(date);
                    var d = newDate.getDate();
                    --d; //to avoid null at index 0 of output array
                    var workout = 0;
                    singleworkoutFiller = myworkout => {
                        return (singleworkout = {
                            date: newDate.getDate(),
                            month: newDate.getMonth(),
                            year: newDate.getFullYear(),
                            workout_id: myworkouts[workout].workout_id,
                            assigned_id: myworkouts[workout].assigned_id,
                            work_period: myworkouts[workout].work_period,
                            workout_details: myworkouts[workout].workout_details,
                            // repeat_times: myworkouts[workout].repeat_times,
                            // category_id: myworkouts[workout].category_id,
                            // subcategory_id: myworkouts[workout].subcategory_id,
                            work_times: myworkouts[workout].work_times
                        });
                    };

                    while (workout < myworkouts.length) {

                        weekday = newDate
                            .toString()
                            .split(" ")[0]
                            .toLowerCase();
                        if (myworkouts[workout].work_period == "daily") {
                            singleworkout = singleworkoutFiller(myworkouts[workout]);
                            obj.push(singleworkout);
                        } else if (myworkouts[workout].work_period == "weekly") {
                            if (myworkouts[workout].chosen_week.match(weekday)) {
                                singleworkout = singleworkoutFiller(myworkouts[workout]);
                                obj.push(singleworkout);
                            }
                        } else if (myworkouts[workout].work_period == "onetime") {
                            if (
                                moment(myworkouts[workout].onetime_date).format("YYYY/MM/DD") ==
                                moment(newDate).format("YYYY/MM/DD")
                            ) {
                                singleworkout = singleworkoutFiller(myworkouts[workout]);
                                obj.push(singleworkout);
                            }
                        } else {
                        }
                        workout++;
                    }

                    date.setDate(date.getDate() + 1);
                }

                res.json({
                    status: true,
                    message: "myworkouts",
                    myworkouts: obj,

                });
            })
            .catch(err => {
                console.log(err);
                res.json({ status: false, message: "No record found." });
            });
    }




}

module.exports = handler;