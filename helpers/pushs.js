let connectionProvider = require('../server/dbConnectionProvider'),
	merge = require('merge'),
	nodemailer = require('nodemailer'),
	config = require('../server/config');

var FCM = require('fcm-push');
var user = require('../models/userDao');
var functions = require('../helpers/functions');
let serverKey = 'AAAAXjuAsKE:APA91bFlsXGv2-EFD3YjqpbtuaV4rnwXDwbGQ46sdVOvCxa3w0fOxRLWJd7_FKlEVSqgeck0u_YlzmIcV-HgeGjYC8IXAo7k_MI0pXPib9PcyCPOd0k-2-Kyk98icKKOCWk6rPJDpgjnN_RRaSP9hXFAXRm_EaZ2bw';




let pushs = {

	sendPush($arr, data) {

		//put your server key here
		var fcm = new FCM(serverKey);

		var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
			to: $arr.fcm_token,

			notification: {
				title: $arr.title,
				body: $arr.body,
				click_action: "FCM_PLUGIN_ACTIVITY",
			},

			data: {  //you can send only notification or only data(or include both)
				location_id: $arr.id,
				message: $arr.title,
				body: $arr.bodyArr,
			},
			priority: 'high',

		};

		fcm.send(message, function (err, response) {
			if (err) {
				console.log("Something has gone wrong!");
			} else {
				console.log("Successfully sent with response: ", response);
			}
		});
		data('sucs')
	},
	message_push(message_id, group_id, member_id, mediaUrl, url = '') {
		//user.userDao.getMessageDetails(
		var mediaUrlLocal;

		user.userDao.getPushMessageDetails(message_id, (data) => {
			if (data[0].thumb_nail) {
				data[0].thumb_nail = url + data[0].thumb_nail
			}

			user.userDao.getMessageDetails(group_id, member_id, (datas) => {
				data[0].first_name = datas[0].first_name;
				data[0].last_name = datas[0].last_name;
				data[0].message_from = datas[0].first_name + ' ' + datas[0].last_name;
				data[0].timeInsec = 'Now'
				if (datas[0] && datas[0].member_type == '1' && config.socketUSER) {
					if (datas[0].image) {
						data[0].image = datas[0].image;
					}
					config.socketUSER.emit("notification", data[0]);
				}
				if (data[0].media_url) {
					mediaUrlLocal = data[0].media_url = url + data[0].media_url;
				}
				datas.map((item) => {
					if (item.fcmToken) {
						if (item.image) {
							data[0].image = url + 'images/users/' + item.image;
						}
						if (mediaUrlLocal) {
							data[0].media_url = mediaUrlLocal;
						}


						this.sendPushMessage(data[0], item.fcmToken, 'You have New Message', 'message')
					}
				})
			})
		})
	},
	sendWorkOutPush(datas) {

		console.log("wwwwwwwwwwwwwwwwww", datas.member_id)
		functions.get('member_master', { member_id: datas.member_id }).then((userdta) => {
			console.log("xxxxxxxxxxxxxx", userdta, userdta[0].fcmToken)
			if (userdta[0].fcmToken) {
				datas.message = 'You have been assigned a new workout ';
				this.sendPushMessage(datas, userdta[0].fcmToken, 'You have been assigned a new workout ', 'workout')
			}
		})
	},
	sendWorkOutUpdatedPush(datas) {

		console.log("wwwwwwwwwwwwwwwwww", datas.member_id)
		functions.get('member_master', { member_id: datas.member_id }).then((userdta) => {
			console.log("xxxxxxxxxxxxxx", userdta, userdta[0].fcmToken)
			if (userdta[0].fcmToken) {
				datas.message = 'Your workout has been updated';
				this.sendPushMessage(datas, userdta[0].fcmToken, 'You Workout has been Updated', 'workout')
			}
		})
	},

	sendPushMessage(dta, tokn, ttl, type) {
		console.log(dta, tokn, "tokn ne")
		dta.timeInsec = 'Now';
		var fcm = new FCM(serverKey);

		var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
			to: tokn,

			notification: {
				title: ttl,
				body: dta.message,
				click_action: "FCM_PLUGIN_ACTIVITY",
			},
			data: {  //you can send only notification or only data(or include both)
				type: type,
				message: dta.message,
				body: dta,
			},
			priority: 'high',

		};

		fcm.send(message, function (err, response) {
			if (err) {
				console.log("Something has gone wrong!", err);
			} else {
				console.log("Successfully sent with response: ", response);
			}
		});
		//data('sucs')


		console.log("tets wrkimg")
	}

}

module.exports = pushs;
