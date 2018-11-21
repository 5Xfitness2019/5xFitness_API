var express = require('express');
let connectionProvider = require("../server/dbConnectionProvider");
//var user = require('.././server/DataAccessObject/userDao');
//var functions = require('.././server/functions');
var router = express.Router();

//var validator = require('email-validator');
var jwt = require('jsonwebtoken');
var config = require('.././server/config');
var multer = require('multer');
var upload = multer({ dest: 'public/uploads/' });



usercontroller = require('../controllers/userController'),

  /* GET users listing. */
  router.get('/', function (req, res, next) {
    res.send('respond with a resource');
  });


router.post('/login', usercontroller.login);

router.use(function (req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, config.jwt_secret, function (err, decoded) {
      if (err) {
        return res.json({ status: 'fail', error: "Failed to authenticate token.", invalidToken: true });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.json({
      status: "fail",
      error: "No token provided",
      errorCode: "notoken"
    })
  }
})


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    var uploadPath = 'public/uploads/workouts/';
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    var ext = file.originalname.split('.').pop();
    cb(null, 'vid_' + req.decoded.member_id + '_' + (Math.floor(Math.random() * 90000) + 10000) + '.' + ext);
  }
});
var upload = multer({ storage: storage });

router.post('/logout', usercontroller.logout);
router.post('/editProfile', usercontroller.editProfile);
router.post('/changePassword', usercontroller.changePassword);
//---------------------------- new code ----------------5x

router.get('/getUsers', usercontroller.getUsers);
router.get('/getUserdetails', usercontroller.getUserdetails);
router.get('/getHealthInfo', usercontroller.getHealthInfo);
router.get('/getWorkouts', usercontroller.getWorkouts);
router.get('/deleteWorkout', usercontroller.deleteWorkout);
router.get('/getWorkoutdetails', usercontroller.getWorkoutdetails);
router.get('/getAssignedWorkouts', usercontroller.getAssignedWorkouts);
router.get('/getPainChartRecords', usercontroller.getPainChartRecords);
router.get('/getDailyLogWorkouts', usercontroller.getDailyLogWorkouts);
router.get('/getSettings', usercontroller.getSettings);
router.get('/getCategories', usercontroller.getCategories);
router.get('/getDashboardCounts', usercontroller.getDashboardCounts);
router.get('/deleteAssigns', usercontroller.deleteAssigns);
router.get('/deleteUser', usercontroller.deleteUser);
router.get('/deleteCategory', usercontroller.deleteCategory);
router.get('/getSubCategories', usercontroller.getSubCategories);
router.get('/deleteSubCategory', usercontroller.deleteSubCategory);
router.get('/getGroups', usercontroller.getGroups);
router.get('/getChatHistory', usercontroller.getChatHistory);


router.post('/changeUserStatus', usercontroller.changeUserStatus);
router.post('/saveWorkoutAssign', usercontroller.saveWorkoutAssign);
router.post('/changePassword', usercontroller.changePassword);
router.post('/saveWorkout', upload.single('file'), usercontroller.saveWorkout);
router.post('/changeCategoryStatus', usercontroller.changeCategoryStatus);
router.post('/saveCategory', usercontroller.saveCategory);
router.post('/saveSubCategory', usercontroller.saveSubCategory);
router.post('/sendMessage', usercontroller.sendMessage);
router.post('/sendVideoMessage', upload.single('file'), usercontroller.sendVideoMessage);
router.post('/getMyWorkouts', usercontroller.getMyWorkouts);
router.get('/saveGroupMembers', usercontroller.saveGroupMembers);
router.get('/creatGroups', usercontroller.creatGroups);
router.get('/deleteGroup', usercontroller.deleteGroup);
router.get('/getMebers', usercontroller.getMebers);
router.get('/getSubscription', usercontroller.getSubscription);


module.exports = router;
