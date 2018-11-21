-- MySQL dump 10.15  Distrib 10.0.28-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: localhost
-- ------------------------------------------------------
-- Server version	10.0.28-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `alam`
--

DROP TABLE IF EXISTS `alam`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `alam` (
  `alam_id` int(11) NOT NULL AUTO_INCREMENT,
  `member_id` int(11) DEFAULT NULL,
  `goal_id` int(11) DEFAULT NULL,
  `alam_time` time DEFAULT NULL,
  `alam_repeat` varchar(255) DEFAULT NULL,
  `is_repeat` enum('Yes','No') DEFAULT NULL,
  `alam_on` enum('Yes','No') DEFAULT NULL,
  PRIMARY KEY (`alam_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alam`
--

LOCK TABLES `alam` WRITE;
/*!40000 ALTER TABLE `alam` DISABLE KEYS */;
/*!40000 ALTER TABLE `alam` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `complaint_master`
--

DROP TABLE IF EXISTS `complaint_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `complaint_master` (
  `complaint_id` int(11) NOT NULL AUTO_INCREMENT,
  `member_id` int(255) DEFAULT NULL,
  `major_complaint` varchar(255) DEFAULT NULL,
  `date_of_onset` date DEFAULT NULL,
  `prev_treatment` varchar(255) DEFAULT NULL,
  `other_complaints` varchar(255) DEFAULT NULL,
  `is_large_part_work` enum('Y','N') DEFAULT NULL,
  `is_activity_pattern` enum('Y','N') DEFAULT NULL,
  `activity_type` varchar(255) DEFAULT NULL,
  `minutes_per_session` varchar(255) DEFAULT NULL,
  `session_per_week` varchar(255) DEFAULT NULL,
  `intensity` enum('Y','N') DEFAULT NULL,
  `other_step_2` varchar(255) DEFAULT NULL,
  `year_of_exercise` varchar(255) DEFAULT NULL,
  `is_regular_exercise` enum('Y','N') DEFAULT NULL,
  `is_activity_level_change_last_5_year` enum('Y','N') DEFAULT NULL,
  `is_pain_during_exercise` enum('Y','N') DEFAULT NULL,
  `is_stop_excercising` enum('Y','N') DEFAULT NULL,
  `diseases` text,
  `other_diseases` varchar(255) DEFAULT NULL,
  `goal_1` varchar(255) DEFAULT NULL,
  `goal_2` varchar(255) DEFAULT NULL,
  `goal_3` varchar(255) DEFAULT NULL,
  `pains` enum('Yes','No') DEFAULT NULL,
  `shortness_of_breath` enum('Yes','No') DEFAULT NULL,
  `dizziness` enum('Yes','No') DEFAULT NULL,
  `attack_of_shortness` enum('Yes','No') DEFAULT NULL,
  `woken_at_night` enum('Yes','No') DEFAULT NULL,
  `swelling_accumulation` enum('Yes','No') DEFAULT NULL,
  `heart_beating_faster` enum('Yes','No') DEFAULT NULL,
  `pains_in_calves` enum('Yes','No') DEFAULT NULL,
  `fatigue` enum('Yes','No') DEFAULT NULL,
  `smoke_cigarettes` enum('Yes','No') DEFAULT NULL,
  `quit_smoking` enum('Yes','No') DEFAULT NULL,
  `how_may_cigarettes` enum('Yes','No') DEFAULT NULL,
  `close_relative` enum('Yes','No') DEFAULT NULL,
  `relation` enum('Yes','No') DEFAULT NULL,
  `blood_pressure` enum('Yes','No') DEFAULT NULL,
  `pain_points_front_5x` text,
  `pain_points_back_5x` text,
  PRIMARY KEY (`complaint_id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `complaint_master`
--

LOCK TABLES `complaint_master` WRITE;
/*!40000 ALTER TABLE `complaint_master` DISABLE KEYS */;
INSERT INTO `complaint_master` VALUES (2,25,'Hfhfh','2018-06-05','Cxvx','Fyfug',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'','','','','','','','','','','',NULL,'',NULL,'',NULL,NULL),(3,19,'Hfhfh','2018-06-05','Cxvx','Fyfug',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'','','','','','','','','','','',NULL,'',NULL,'',NULL,NULL),(4,19,'Hfhfh','2018-06-05','Cxvx','Fyfug',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'','','','','','','','','','','',NULL,'',NULL,'',NULL,NULL),(5,21,'Bhni','2018-06-05','Gxhcfh','Cgghhn',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'','','','','','','','','','','',NULL,'',NULL,'',NULL,NULL),(6,21,'Uguh','2018-06-05','Vnvj','V b i',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'','','','','','','','','','','',NULL,'',NULL,'',NULL,NULL),(8,22,'Hfjf','2018-06-05','Ufjf','Gchd',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'','','','','','','','','','','',NULL,'',NULL,'',NULL,NULL),(9,23,'Yguh','2018-06-05',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'','','','','','','','','','','',NULL,'',NULL,'',NULL,NULL),(10,24,'Gxgh',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'','','','','','','','','','','',NULL,'',NULL,'',NULL,NULL),(11,25,'Hch',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'','','','','','','','','','','',NULL,'',NULL,'',NULL,NULL),(12,25,'Gxyv',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'','','','','','','','','','','',NULL,'',NULL,'',NULL,NULL),(13,27,'Xhchc',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'','','','','','','','','','','',NULL,'',NULL,'',NULL,NULL),(14,28,' B j',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'','','','','','','','','','','',NULL,'',NULL,'',NULL,NULL),(15,29,'Ab','2018-06-06','Ab','Ab',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(16,30,'Bn','2018-06-06','Bn','Bn',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(17,31,'Cgioo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(18,31,'Cgioo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(19,31,'Cgioo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(20,32,'Gioo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(21,32,'Hikll',NULL,NULL,NULL,'','','G????????','Yfhfu','Hchvjv','','Hchv','Gcugy','','','','','[\"bacon\",\"olives\",\"xcheese\",\"peppers\",\"mushrooms\"]','Xhfugi','Tdyd','Gxbc','Xvcjv','Yes','No','Yes','No','Yes','No','Yes','No','Yes','Yes','No','Yes','No','Yes','No','{\"1\":\"1\",\"6\":\"6\",\"10\":\"10\"}',NULL),(22,37,'Hvjbkb',NULL,NULL,NULL,'Y','Y','V hvj','V hv','V b h','Y',NULL,' Hvhvj','Y','Y',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(23,38,'Tcuguh',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(25,39,'Hchc','2018-06-05',NULL,NULL,'Y',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'[\"bacon\"]',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(26,40,'Fyfhf',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'[\"bacon\"]',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'null',NULL),(27,41,'Dgfh',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'[\"olives\"]',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(28,42,'Cbcj',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'[\"bacon\",\"olives\"]',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(29,43,'Chcj','2018-06-03','Iyyyyy',NULL,'Y',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'\"[\\\"bacon\\\",\\\"xcheese\\\"]\"',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'{}',NULL),(30,44,'V bvj',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'[\"olives\",\"peppers\",\"mushrooms\"]',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'{\"2\":\"2\",\"3\":\"3\"}',NULL),(31,45,'Zgch ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'\"[\\\"bacon\\\",\\\"xcheese\\\",\\\"mushrooms\\\"]\"',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'{\"2\":\"2\"}',NULL),(32,46,'Khfjh',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'[\"olives\",\"peppers\"]',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'{\"7\":\"7\",\"10\":\"10\"}',NULL),(33,47,'Cnv ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'[\"xcheese\",\"peppers\"]',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'{\"2\":\"2\",\"3\":\"3\",\"4\":\"4\"}','{\"2\":\"2\",\"3\":\"3\",\"4\":\"4\"}'),(34,48,'Vjv',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'[\"bacon\"]',NULL,NULL,NULL,NULL,'No',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'No',NULL,NULL,NULL,NULL,NULL,'{\"4\":\"4\"}',NULL),(35,49,'Gfug',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'[\"bacon\"]',NULL,NULL,NULL,NULL,'No',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'No',NULL,NULL,NULL,NULL,NULL,'{\"4\":\"4\"}',NULL),(36,50,'Hcjgk',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'[\"olives\"]',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'{}','{\"3\":\"3\",\"4\":\"4\"}'),(37,51,'8546',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'[\"olives\"]',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(38,52,'Qwerty',NULL,NULL,NULL,'Y',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'[\"bacon\",\"olives\"]',NULL,NULL,NULL,NULL,'Yes','Yes','No','No','Yes','Yes','No','No','Yes','Yes','Yes','No','Yes','Yes','No','{\"2\":\"2\",\"3\":\"3\",\"4\":\"4\"}','{\"1\":\"1\",\"2\":\"2\"}'),(39,54,'Headache','2016-05-01','Migrane treated','Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has su','Y','Y','Meditation','15','7','Y','Testother','2','Y','N','N','N','[\"bacon\",\"olives\"]','Nothing Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. I','Test1','Test2','Test3','Yes','Yes','No','No','Yes','Yes','No','No','Yes','No','No','Yes','Yes','No','No','{\"6\":\"6\"}','{\"7\":\"7\"}');
/*!40000 ALTER TABLE `complaint_master` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `general_emails`
--

DROP TABLE IF EXISTS `general_emails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `general_emails` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(60) NOT NULL,
  `email_title` varchar(100) NOT NULL,
  `email_template` text NOT NULL,
  `email_subject` varchar(255) NOT NULL,
  `status` char(1) NOT NULL DEFAULT 'Y',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `general_emails`
--

LOCK TABLES `general_emails` WRITE;
/*!40000 ALTER TABLE `general_emails` DISABLE KEYS */;
INSERT INTO `general_emails` VALUES (1,'register_email','Registration Successful','<table class=\"tableContent\" style=\"font-family: Helvetica,Arial,serif; width: 100%;\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" align=\"center\" bgcolor=\"#ffffff\">\r\n<tbody>\r\n<tr>\r\n<td>\r\n<table class=\"MainContainer\" style=\"width: 800px;\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" align=\"center\" bgcolor=\"#ffffff\">\r\n<tbody>\r\n<tr>\r\n<td>\r\n<table style=\"background-color: #AD3208; padding-bottom: 35px; width: 100%;\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\r\n<tbody>\r\n<tr>\r\n<td class=\"right_box\" valign=\"top\" width=\"40\">&nbsp;</td>\r\n<td>\r\n<table style=\"width: 100%;\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\r\n<tbody><!-- =============================== Header ====================================== -->\r\n<tr>\r\n<td style=\"text-align: center; color: #FF6138; font-size: xx-large;\" height=\"75\">\r\n    <p style=\"color: white; font-size: xx-large;\"> CIVIL WAR </p>\r\n    <!--<img src=\"http://newagesme.com/Possumus/logo.png\" width=\"257\" height=\"60\">-->\r\n    \r\n</td>\r\n<!-- =============================== Body ====================================== --></tr>\r\n<tr style=\"background: #fff;\">\r\n<td class=\"movableContentContainer \" valign=\"top\">\r\n<div class=\"movableContent\" style=\"border: 0px; padding-top: 0px; position: relative;\">\r\n<table style=\"width: 100%;\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\r\n<tbody>\r\n<tr>\r\n<td height=\"35\">&nbsp;</td>\r\n</tr>\r\n<tr>\r\n<td>\r\n<table style=\"width: 100%;\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\r\n<tbody>\r\n<tr>\r\n<td class=\"specbundle\" align=\"center\" valign=\"top\">\r\n<div class=\"contentEditableContainer contentTextEditable\">\r\n<div class=\"contentEditable\">\r\n<p style=\"text-align: center; margin: 0; font-family: Helvetica,Arial,serif; font-size: 36px; color: #222222;\"><span class=\"specbundle2\"><span class=\"font1\">#HEADING#</span></span></p>\r\n</div>\r\n</div>\r\n</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n</div>\r\n<div class=\"movableContent\" style=\"border: 0px; padding-top: 0px; position: relative;\">\r\n<table style=\"width: 100%;\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" align=\"center\">\r\n<tbody>\r\n<tr>\r\n<td height=\"55\">&nbsp;</td>\r\n</tr>\r\n<tr>\r\n<td align=\"left\">\r\n<div class=\"contentEditableContainer contentTextEditable\">\r\n<div style=\"padding: 10px;\" align=\"center\">\r\n<h2 style=\"margin: 0; text-align: left; color: #222222; font-size: 19px; font-weight: normal;\">Hi #FULL_NAME#,</h2>\r\n</div>\r\n</div>\r\n</td>\r\n</tr>\r\n<tr>\r\n<td align=\"left\">\r\n<div class=\"contentEditableContainer contentTextEditable\">\r\n<div style=\"padding: 10px;\" align=\"center\">\r\n<p style=\"color: #999999; font-size: 14px; font-weight: normal; line-height: 19px; text-align: left;\">Thank you for registering with CivilWar.</p>\r\n</div>\r\n</div>\r\n</td>\r\n</tr>\r\n<tr>\r\n<td align=\"left\">\r\n<div class=\"contentEditableContainer contentTextEditable\">\r\n<div style=\"padding: 10px;\" align=\"center\">\r\n<!--<p style=\"color: #999999; font-size: 14px; font-weight: normal; line-height: 19px; text-align: left;\">Your feedback is always appreciated and your concerns are our concerns. We can be contacted via our contact us page by clicking here #LINK# </p>-->\r\n</div>\r\n</div>\r\n</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n</div>\r\n<div class=\"movableContent\" style=\"border: 0px; padding-top: 0px; position: relative;\">\r\n<table style=\"width: 100%;\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\r\n<tbody>\r\n<tr>\r\n<td style=\"border-bottom: 1px solid #DDDDDD;\">&nbsp;</td>\r\n</tr>\r\n<tr>\r\n<td height=\"25\">&nbsp;</td>\r\n</tr>\r\n<tr>\r\n<td>\r\n<table style=\"width: 100%;\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\r\n<tbody>\r\n</tbody>\r\n</table>\r\n</td>\r\n</tr>\r\n<tr>\r\n<td height=\"40\">&nbsp;</td>\r\n</tr>\r\n<tr>\r\n<td class=\"specbundle\" valign=\"top\">\r\n<div class=\"contentEditableContainer contentTextEditable\">\r\n<div class=\"contentEditable\" align=\"center\">\r\n<p style=\"text-align: center; color: #cccccc; font-size: 12px; font-weight: normal; line-height: 20px;\"><span style=\"font-weight: bold;\">&copy; #YEAR# civilwar.com, All rights reserved.</span></p>\r\n</div>\r\n</div>\r\n</td>\r\n</tr>\r\n<tr>\r\n<td height=\"40\">&nbsp;</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n</div>\r\n<!-- =============================== footer ====================================== --></td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n</td>\r\n<td class=\"left_row\" valign=\"top\" width=\"40\">&nbsp;</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n</td>\r\n</tr>\r\n</tbody>\r\n</table>','Registration Successful','Y'),(2,'forgot_password','Forgot Password','<table class=\"tableContent\" style=\"font-family: Helvetica,Arial,serif; width: 100%;\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" align=\"center\" bgcolor=\"#ffffff\">\r\n<tbody>\r\n<tr>\r\n<td>\r\n<table class=\"MainContainer\" style=\"width: 800px;\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" align=\"center\" bgcolor=\"#ffffff\">\r\n<tbody>\r\n<tr>\r\n<td>\r\n<table style=\"background-color: #AD3208; padding-bottom: 35px; width: 100%;\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\r\n<tbody>\r\n<tr>\r\n<td class=\"right_box\" valign=\"top\" width=\"40\">&nbsp;</td>\r\n<td>\r\n<table style=\"width: 100%;\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\r\n<tbody><!-- =============================== Header ====================================== -->\r\n<tr>\r\n<td style=\"text-align: center; color: #FF6138; font-size: xx-large;\" height=\"75\">\r\n    <p style=\"color: white; font-size: xx-large;\"> CIVIL WAR </p>\r\n    <!--<img src=\"http://newagesme.com/Possumus/logo.png\" width=\"257\" height=\"60\">-->\r\n    \r\n</td>\r\n<!-- =============================== Body ====================================== --></tr>\r\n<tr style=\"background: #fff;\">\r\n<td class=\"movableContentContainer \" valign=\"top\">\r\n<div class=\"movableContent\" style=\"border: 0px; padding-top: 0px; position: relative;\">\r\n<table style=\"width: 100%;\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\r\n<tbody>\r\n<tr>\r\n<td height=\"35\">&nbsp;</td>\r\n</tr>\r\n<tr>\r\n<td>\r\n<table style=\"width: 100%;\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\r\n<tbody>\r\n<tr>\r\n<td class=\"specbundle\" align=\"center\" valign=\"top\">\r\n<div class=\"contentEditableContainer contentTextEditable\">\r\n<div class=\"contentEditable\">\r\n<p style=\"text-align: center; margin: 0; font-family: Helvetica,Arial,serif; font-size: 36px; color: #222222;\"><span class=\"specbundle2\"><span class=\"font1\">#HEADING#</span></span></p>\r\n</div>\r\n</div>\r\n</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n</div>\r\n<div class=\"movableContent\" style=\"border: 0px; padding-top: 0px; position: relative;\">\r\n<table style=\"width: 100%;\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" align=\"center\">\r\n<tbody>\r\n<tr>\r\n<td height=\"55\">&nbsp;</td>\r\n</tr>\r\n<tr>\r\n<td align=\"left\">\r\n<div class=\"contentEditableContainer contentTextEditable\">\r\n<div style=\"padding: 10px;\" align=\"center\">\r\n<h2 style=\"margin: 0; text-align: left; color: #222222; font-size: 19px; font-weight: normal;\">Hi #FULL_NAME#,</h2>\r\n</div>\r\n</div>\r\n</td>\r\n</tr>\r\n<tr>\r\n<td align=\"left\">\r\n<div class=\"contentEditableContainer contentTextEditable\">\r\n<div style=\"padding: 10px;\" align=\"center\">\r\n<p style=\"color: #999999; font-size: 14px; font-weight: normal; line-height: 19px; text-align: left;\">Please find the Reset Code for your CivilWar App account</p>\r\n<p style=\"color: #999999; font-size: 14px; font-weight: normal; line-height: 19px; text-align: left;\">Reset Code : #RESETCODE#</p>\r\n</div>\r\n</div>\r\n</td>\r\n</tr>\r\n<tr>\r\n<td align=\"left\">\r\n<div class=\"contentEditableContainer contentTextEditable\">\r\n<div style=\"padding: 10px;\" align=\"center\">\r\n<!--<p style=\"color: #999999; font-size: 14px; font-weight: normal; line-height: 19px; text-align: left;\">Your feedback is always appreciated and your concerns are our concerns. We can be contacted via our contact us page by clicking here #LINK# </p>-->\r\n</div>\r\n</div>\r\n</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n</div>\r\n<div class=\"movableContent\" style=\"border: 0px; padding-top: 0px; position: relative;\">\r\n<table style=\"width: 100%;\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\r\n<tbody>\r\n<tr>\r\n<td style=\"border-bottom: 1px solid #DDDDDD;\">&nbsp;</td>\r\n</tr>\r\n<tr>\r\n<td height=\"25\">&nbsp;</td>\r\n</tr>\r\n<tr>\r\n<td>\r\n<table style=\"width: 100%;\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\r\n<tbody>\r\n</tbody>\r\n</table>\r\n</td>\r\n</tr>\r\n<tr>\r\n<td height=\"40\">&nbsp;</td>\r\n</tr>\r\n<tr>\r\n<td class=\"specbundle\" valign=\"top\">\r\n<div class=\"contentEditableContainer contentTextEditable\">\r\n<div class=\"contentEditable\" align=\"center\">\r\n<p style=\"text-align: center; color: #cccccc; font-size: 12px; font-weight: normal; line-height: 20px;\"><span style=\"font-weight: bold;\">&copy; #YEAR# civilwar.com, All rights reserved.</span></p>\r\n</div>\r\n</div>\r\n</td>\r\n</tr>\r\n<tr>\r\n<td height=\"40\">&nbsp;</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n</div>\r\n<!-- =============================== footer ====================================== --></td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n</td>\r\n<td class=\"left_row\" valign=\"top\" width=\"40\">&nbsp;</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n</td>\r\n</tr>\r\n</tbody>\r\n</table>','Forgot Password','Y');
/*!40000 ALTER TABLE `general_emails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `health_rating`
--

DROP TABLE IF EXISTS `health_rating`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `health_rating` (
  `rating_id` int(11) NOT NULL AUTO_INCREMENT,
  `member_id` int(11) DEFAULT NULL,
  `rating` varchar(255) DEFAULT NULL,
  `feel_today` enum('bad','good') DEFAULT NULL,
  `date` date DEFAULT NULL,
  PRIMARY KEY (`rating_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `health_rating`
--

LOCK TABLES `health_rating` WRITE;
/*!40000 ALTER TABLE `health_rating` DISABLE KEYS */;
INSERT INTO `health_rating` VALUES (1,5,'2','bad','2018-06-11'),(2,52,'5','bad','2018-06-11'),(3,52,'8','good','2018-07-19'),(4,52,'10','bad','2018-06-09'),(5,52,'2','good','2018-06-08'),(6,52,'5','good','2018-06-12'),(7,52,'1',NULL,'2018-06-13'),(8,54,'5','good','2018-06-13');
/*!40000 ALTER TABLE `health_rating` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member_master`
--

DROP TABLE IF EXISTS `member_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `member_master` (
  `member_id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `verification_code` varchar(255) DEFAULT NULL,
  `fcm_token` varchar(255) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `gender` enum('male','female') DEFAULT NULL,
  `postcode` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `mobile` varchar(255) DEFAULT NULL,
  `marital_status` enum('married','single') DEFAULT NULL,
  `about` longtext,
  `occupation` varchar(255) DEFAULT NULL,
  `referred` varchar(255) DEFAULT NULL,
  `platform` enum('ios','android') DEFAULT NULL,
  `step_to_complete` enum('1','2','3','4','5','6','7','8','9','10') DEFAULT '1',
  `reset_code` int(11) DEFAULT NULL,
  `blocked` enum('Y','N') DEFAULT 'N',
  `status` enum('Y','N') DEFAULT 'N',
  PRIMARY KEY (`member_id`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member_master`
--

LOCK TABLES `member_master` WRITE;
/*!40000 ALTER TABLE `member_master` DISABLE KEYS */;
INSERT INTO `member_master` VALUES (1,'nitu','roy','nitu@gmail.com',NULL,'e10adc3949ba59abbe56e057f20f883e',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'1',NULL,'N','N'),(2,'bibin','varghese','bibin@gmail.com',NULL,'e10adc3949ba59abbe56e057f20f883e',NULL,NULL,'2018-06-13',NULL,NULL,NULL,'87899',NULL,NULL,NULL,NULL,NULL,'2',81953,'N','N'),(3,'bibin','varghese','mahi@gmail.com',NULL,'e10adc3949ba59abbe56e057f20f883e',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'1',NULL,'N','N'),(4,'siby','m','siby@gmail.com',NULL,'e10adc3949ba59abbe56e057f20f883e',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'1',NULL,'N','N'),(5,'umesh','k','umesh@gmail.com',NULL,'e10adc3949ba59abbe56e057f20f883e',NULL,NULL,'0000-00-00','male','682301','test address','9895267895','single',NULL,'test','test referred',NULL,'3',NULL,'N','N'),(29,'Ab','Cd','ab@gmail.com',NULL,'e10adc3949ba59abbe56e057f20f883e',NULL,NULL,'2018-06-06','male','Ab','Ab','123456789','married',NULL,'Ab','Ab',NULL,'5',NULL,'N','N'),(30,'Bn','Bn','bn@gmail.com',NULL,'e10adc3949ba59abbe56e057f20f883e',NULL,NULL,'2018-06-06','male','Bn','Bn','123456','married',NULL,'Bn','Bn',NULL,'4',NULL,'N','N'),(31,'Vj','Vyy','fygy@ghj.hvu',NULL,'e10adc3949ba59abbe56e057f20f883e',NULL,NULL,'2018-06-06',NULL,'Gcgcg','Ccyg','8058',NULL,NULL,NULL,NULL,NULL,'3',NULL,'N','N'),(32,'Hvib',' Hvh','guii@thh.hjk',NULL,'e10adc3949ba59abbe56e057f20f883e',NULL,NULL,'2018-06-06',NULL,NULL,NULL,'25858888',NULL,NULL,NULL,NULL,NULL,'3',NULL,'N','N'),(33,'Fhjk','Ghhj','ghj@fgh.hhj',NULL,'e10adc3949ba59abbe56e057f20f883e',NULL,NULL,'2018-06-06',NULL,NULL,NULL,'366',NULL,NULL,NULL,NULL,NULL,'2',NULL,'N','N'),(34,'Hfjfj','Bfjjf','hufjf@gfuf.hfjf',NULL,'e10adc3949ba59abbe56e057f20f883e',NULL,NULL,'2018-06-06',NULL,NULL,NULL,'98 ,,',NULL,NULL,'Xubib',NULL,NULL,'2',NULL,'N','N'),(35,'Gxtc','Ycycy','fyc@gxy.ubu',NULL,'e10adc3949ba59abbe56e057f20f883e',NULL,NULL,'2018-06-06',NULL,NULL,NULL,'28844',NULL,NULL,NULL,NULL,NULL,'2',NULL,'N','N'),(36,'Hvj','Hcci','yfihi@hcjgi.jvk',NULL,'e10adc3949ba59abbe56e057f20f883e',NULL,NULL,'2018-06-06','',NULL,NULL,'76968',NULL,NULL,NULL,NULL,NULL,'2',NULL,'N','N'),(37,'Jvib','F????????','fgjj@tty.hjj',NULL,'e10adc3949ba59abbe56e057f20f883e',NULL,NULL,'2018-06-06',NULL,NULL,NULL,'5868353',NULL,NULL,NULL,NULL,NULL,'2',NULL,'N','N'),(38,'Gvuhi','Cgchv','ffhhy@fgh.hhu',NULL,'827ccb0eea8a706c4c34a16891f84e7b',NULL,NULL,'2018-06-06',NULL,NULL,NULL,'883939',NULL,NULL,NULL,NULL,NULL,'2',NULL,'N','N'),(39,'Chchc','Hchgjg','ufuf@fuf.hfh',NULL,'e10adc3949ba59abbe56e057f20f883e',NULL,NULL,'2018-06-07',NULL,NULL,NULL,'3585758',NULL,NULL,NULL,NULL,NULL,'2',NULL,'N','N'),(40,'Hvjgj','Gxhcj','jfhgj@djg.jcjv',NULL,'e10adc3949ba59abbe56e057f20f883e',NULL,NULL,'2018-06-07',NULL,NULL,NULL,'258',NULL,NULL,NULL,NULL,NULL,'8',NULL,'N','N'),(41,'Hchc','Xgxgd','gxgc@hfj.hcj',NULL,'e10adc3949ba59abbe56e057f20f883e',NULL,NULL,'2018-06-07',NULL,NULL,NULL,'5458',NULL,NULL,NULL,NULL,NULL,'7',NULL,'N','N'),(42,'Bcn','Hfhf','xhfh@ufuf.jfj',NULL,'e10adc3949ba59abbe56e057f20f883e',NULL,NULL,'2018-06-07',NULL,NULL,NULL,'8686',NULL,NULL,NULL,NULL,NULL,'7',NULL,'N','N'),(43,'Xhvj','Hch','gxgj@yfy.hfu',NULL,'e10adc3949ba59abbe56e057f20f883e',NULL,NULL,'2018-06-07','male',NULL,NULL,'55568','single',NULL,NULL,'Rygffff',NULL,'8',NULL,'N','N'),(44,'Nvjb','Vjvj','vufug@yu.ihi',NULL,'e10adc3949ba59abbe56e057f20f883e',NULL,NULL,'2018-06-07',NULL,NULL,NULL,'85868639',NULL,NULL,NULL,NULL,NULL,'8',NULL,'N','N'),(45,'Gx hi','Ggxh','hcbvj@ugi.ihi',NULL,'c4ca4238a0b923820dcc509a6f75849b',NULL,NULL,'2018-06-07',NULL,NULL,NULL,'868989',NULL,NULL,NULL,NULL,NULL,'8',NULL,'N','N'),(46,'Hkckhf','Gkfkh','gjfkhg@yofk.jglz',NULL,'e10adc3949ba59abbe56e057f20f883e',NULL,NULL,'2018-06-07',NULL,NULL,NULL,'657686',NULL,NULL,NULL,NULL,NULL,'8',NULL,'N','N'),(47,'Bvjg','Hfhc','gfugu@ygu.gfj',NULL,'202cb962ac59075b964b07152d234b70',NULL,NULL,'2018-06-07',NULL,NULL,NULL,'836',NULL,NULL,NULL,NULL,NULL,'8',NULL,'N','N'),(48,'Hfhf','Hfhg','tdhf@hfgi.jg',NULL,'202cb962ac59075b964b07152d234b70',NULL,NULL,'2018-06-07',NULL,NULL,NULL,'586',NULL,NULL,NULL,NULL,NULL,'7',NULL,'N','N'),(49,' B ','Hfhc','hgjg@uggi.ugi',NULL,'c4ca4238a0b923820dcc509a6f75849b',NULL,NULL,'2018-06-07',NULL,NULL,NULL,'5353',NULL,NULL,NULL,NULL,NULL,'7',NULL,'N','N'),(50,'Hchv','Hfj','jgjvg@hf.jf',NULL,'e10adc3949ba59abbe56e057f20f883e',NULL,NULL,'2018-06-07',NULL,NULL,NULL,'88989',NULL,NULL,NULL,NULL,NULL,'8',NULL,'N','N'),(51,'iuihiui','uihiu','uiuih@hgy.uyghy',NULL,'e10adc3949ba59abbe56e057f20f883e',NULL,NULL,'2018-06-07',NULL,NULL,NULL,'6592854',NULL,NULL,NULL,NULL,NULL,'6',NULL,'N','N'),(52,'Abc','Abc','abc@abc.com','user_52.png','e10adc3949ba59abbe56e057f20f883e',NULL,NULL,'2018-06-07',NULL,NULL,NULL,'12345',NULL,'Waaas met ghdhdhd hfdj fhjf fjf fhfvfudbfufbbfh fhfbfuf fjf fuf fif fjf fhf fjf fhf f fjfbfbjf n\nHfjjfjjfjfjjcjn h hf. Jfj jfkrjkfjhdhdhshhshshbsb hfjjd jfjrjkdr hfjfjjfjf jfjkfkf ufjfkkfkdjjf hfjdj jdjdjndbdndjdj hdjdj fc. d dd \nB\n\nB\nCv\nC\nCccccc\n\nGf',NULL,NULL,NULL,'9',3854,'N','N'),(53,'Bibin','V','bibinv@newagesmb.com',NULL,'e2fc714c4727ee9395f324cd2e7f331f',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'1',9322,'N','N'),(54,'Metcy','Varghese','metcy@newagesmb.com','user_54.png','e10adc3949ba59abbe56e057f20f883e',NULL,NULL,'1990-06-01','female','06101','119/2A main street','8281452088','single','Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.','QA','Google searchh',NULL,'9',NULL,'N','N');
/*!40000 ALTER TABLE `member_master` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `my_goal`
--

DROP TABLE IF EXISTS `my_goal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `my_goal` (
  `goal_id` int(11) NOT NULL AUTO_INCREMENT,
  `member_id` int(11) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `create_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `alam_time` longtext,
  `alam_repeat` longtext,
  PRIMARY KEY (`goal_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `my_goal`
--

LOCK TABLES `my_goal` WRITE;
/*!40000 ALTER TABLE `my_goal` DISABLE KEYS */;
INSERT INTO `my_goal` VALUES (1,NULL,'gfdg','gdhggfhg','2018-06-12 11:05:43',NULL,NULL),(2,5,'gfdg','gdhggfhg','2018-06-12 11:09:35',NULL,NULL),(3,52,'Hcjck','Qert ghjj jjkl hjkk','2018-06-12 11:25:47',NULL,NULL),(4,52,'Ydhgi','Fzhfj jglh khljm khl lnl\n\nJfjg\nNvkgl\nKgkhk\nKvkhkhl','2018-06-12 11:26:29',NULL,NULL),(5,5,'gfdg','gdhggfhg','2018-06-12 12:35:31',NULL,NULL),(6,52,'Anad','Hi','2018-06-13 07:40:43',NULL,NULL);
/*!40000 ALTER TABLE `my_goal` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-06-13 21:05:17
