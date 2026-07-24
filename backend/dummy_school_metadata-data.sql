-- MySQL dump 10.13  Distrib 9.3.0, for Win64 (x86_64)
--
-- Host: localhost    Database: school_metadata
-- ------------------------------------------------------
-- Server version	9.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `school_metadata`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `school_metadata` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `school_metadata`;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `event_date` date NOT NULL,
  `event_time` time DEFAULT NULL,
  `is_all_day` tinyint(1) NOT NULL DEFAULT '0',
  `color` varchar(50) NOT NULL DEFAULT 'bg-blue-500',
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_event_date` (`event_date`),
  KEY `fk_events_users` (`created_by`),
  CONSTRAINT `fk_events_users` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (1,'Birthday','Happy','2025-06-18',NULL,1,'bg-red-500',NULL,'2026-07-24 21:11:01','2026-07-24 21:11:01'),(2,'Scooby','Dooby','2026-06-18',NULL,1,'bg-red-500',NULL,'2026-07-24 21:20:29','2026-07-24 21:20:29');
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_academic_details`
--

DROP TABLE IF EXISTS `student_academic_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_academic_details` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_detail_id` int NOT NULL,
  `roll_no` varchar(10) DEFAULT NULL,
  `standard` enum('PlayGr','Nur','JrKG','SrKG') DEFAULT NULL,
  `division` enum('A','B','C','D','TBC') DEFAULT 'TBC',
  `academic_year` year NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `student_detail_id` (`student_detail_id`),
  CONSTRAINT `student_academic_details_ibfk_1` FOREIGN KEY (`student_detail_id`) REFERENCES `student_details` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_academic_details`
--

LOCK TABLES `student_academic_details` WRITE;
/*!40000 ALTER TABLE `student_academic_details` DISABLE KEYS */;
INSERT INTO `student_academic_details` VALUES (1,2,NULL,'SrKG','TBC',2025,'2025-07-24 10:13:17','2025-07-24 10:13:17'),(2,3,NULL,'SrKG','TBC',2025,'2025-07-24 10:23:15','2025-07-24 10:23:15'),(3,4,NULL,'SrKG','TBC',2025,'2025-07-24 10:26:56','2025-07-24 10:26:56'),(4,5,NULL,'SrKG','TBC',2024,'2025-07-24 10:31:35','2025-07-24 10:31:35'),(5,6,NULL,'SrKG','TBC',2024,'2025-07-24 10:40:25','2025-07-24 10:40:25'),(6,7,NULL,'SrKG','TBC',2024,'2025-07-24 10:42:41','2025-07-24 11:05:57'),(7,8,NULL,'SrKG','TBC',2023,'2025-07-24 11:08:42','2025-07-24 11:11:02'),(8,9,NULL,'SrKG','TBC',2025,'2025-07-24 11:10:23','2025-09-08 20:25:25'),(9,10,NULL,'SrKG','TBC',2025,'2025-07-27 16:53:20','2025-07-27 16:53:20'),(10,13,NULL,'SrKG','TBC',2025,'2025-09-08 20:38:57','2025-09-08 20:38:57'),(11,14,NULL,'SrKG','TBC',2025,'2025-10-08 20:38:57','2025-10-08 20:38:57'),(12,12,NULL,'SrKG','TBC',2025,'2025-08-26 22:12:57','2026-03-18 15:11:18'),(13,15,NULL,'SrKG','TBC',2025,'2025-09-08 20:38:57','2025-09-08 20:38:57'),(14,16,NULL,'SrKG','TBC',2025,'2025-06-08 20:38:57','2026-03-18 15:11:18'),(15,17,NULL,'SrKG','TBC',2025,'2025-05-08 20:38:57','2025-05-08 20:38:57'),(16,18,NULL,'SrKG','TBC',2025,'2025-11-08 20:38:57','2025-11-08 20:38:57'),(17,19,NULL,'SrKG','TBC',2025,'2025-09-18 20:38:57','2025-09-18 20:38:57'),(18,20,NULL,'SrKG','TBC',2025,'2025-04-28 20:38:57','2026-03-18 15:11:18'),(19,21,NULL,'SrKG','TBC',2025,'2025-10-18 20:38:57','2025-10-18 20:38:57'),(20,11,NULL,'SrKG','TBC',2025,'2025-08-26 21:56:12','2025-10-10 14:11:26'),(21,1,NULL,'SrKG','TBC',2025,'2025-07-23 21:33:24','2026-03-18 15:11:18');
/*!40000 ALTER TABLE `student_academic_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_address_details`
--

DROP TABLE IF EXISTS `student_address_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_address_details` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_contact_id` int NOT NULL,
  `current_address` text,
  `permanent_address` text,
  `city` varchar(30) DEFAULT NULL,
  `state` varchar(30) DEFAULT NULL,
  `pincode` varchar(6) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `contact_id` (`student_contact_id`),
  CONSTRAINT `student_address_details_ibfk_1` FOREIGN KEY (`student_contact_id`) REFERENCES `student_contact_info` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_address_details`
--

LOCK TABLES `student_address_details` WRITE;
/*!40000 ALTER TABLE `student_address_details` DISABLE KEYS */;
INSERT INTO `student_address_details` VALUES (1,1,'Tarak Smruti, Gnsl Gaon, Gnsl - W, 701','Tarak Smruti, Gnsl Gaon, Gnsl - W, 701','Ghansoli','Maharashtra','400701','2026-03-19 23:36:31'),(2,2,'Apt. 396 Jl. Kartini No. 17, Mamberamo Tengah, Srinagar, Tamil Nadu, 33755','Apt. 396 Jl. Kartini No. 17, Mamberamo Tengah, Srinagar, Tamil Nadu, 33755','Srinagar','Tamil Nadu','033755','2026-03-19 23:36:31'),(3,3,'108/864, Motilal Ngr No 1, Goregaon (w)','108/864, Motilal Ngr No 1, Goregaon (w)','Mumbai','Maharashtra','400104','2026-03-19 23:36:31'),(4,4,'E-8,0/1, Vardhaman Market, Sector 1, Vashi, Navi Mumbai','E-8,0/1, Vardhaman Market, Sector 1, Vashi, Navi Mumbai','Vashi','Maharashtra','400705','2026-03-19 23:36:31'),(5,5,'6, Dalvi Estate, B P Cross Road No 5, Bhayander (e)','6, Dalvi Estate, B P Cross Road No 5, Bhayander (e)','Mumbai','Maharashtra','401105','2026-03-19 23:36:31'),(6,6,'Shop No A 624, Muslim Nagar, 60 Feet Road, Dharavi','Shop No A 624, Muslim Nagar, 60 Feet Road, Dharavi','Mumbai','Maharashtra','400017','2026-03-19 23:36:31'),(7,7,'Shop No A 624, Muslim Nagar, 60 Feet Road, Dharavi','Shop No A 624, Muslim Nagar, 60 Feet Road, Dharavi','Mumbai','Maharashtra','400017','2026-03-19 23:36:31'),(8,8,'21, Vikrant Bldg, R.b.mehta Rd, Opp Bnk Of Madurai, Ghatkoper (east)','21, Vikrant Bldg, R.b.mehta Rd, Opp Bnk Of Madurai, Ghatkoper (east)','Mumbai','Maharashtra','400089','2026-03-19 23:36:31'),(9,9,'Shukla Compound, Behram Baug, Link Road, Jogeshwari(w)','Shukla Compound, Behram Baug, Link Road, Jogeshwari(w)','Mumbai','Maharashtra','400102','2026-03-19 23:36:31'),(10,10,'Apt. 396 Jl. Kartini No. 17, Mamberamo Tengah, Srinagar, Tamil Nadu, 33755','Apt. 396 Jl. Kartini No. 17, Mamberamo Tengah, Srinagar, Tamil Nadu, 33755','Srinagar','Tamil Nadu','033755','2026-03-19 23:36:31'),(11,11,'Changni Chowk, West','Changni Chowk, West','Insta','Mesopotania','444125','2026-03-19 23:36:31'),(12,12,'','','','','','2026-03-19 23:36:31'),(13,13,'ngni Chowk, West, Bangalore','ngni Chowk, West, Bangalore','Bangalore','Karnataka','560064','2026-03-19 23:36:31'),(14,14,'Varalakshmicplxhosprdyelablr-64, Hospital Road, Mumbai','Varalakshmicplxhosprdyelablr-64, Hospital Road, Mumbai','Mumbai','Maharashtra','160064','2026-03-19 23:36:31'),(15,15,'Varaicplxhos, Market Road, Madurai','Varaicplxhos, Market Road, Madurai','Madurai','Tamil Nadu','560064','2026-03-19 23:36:31'),(16,16,'Varshmicplabl, Pipeline Road, Bagha','Varshmicplabl, Pipeline Road, Bagha','Bagha','Goa','260064','2026-03-19 23:36:31'),(17,17,'Vshmicplxhordyelr, Tulsi Road, Vishakapatnum','Vshmicplxhordyelr, Tulsi Road, Vishakapatnum','Vishakapatnum','Andhra Pradesh','360064','2026-03-19 23:36:31'),(18,18,'Alakshmicplxholr, Muhammed Ali Road, Jabalpur','Alakshmicplxholr, Muhammed Ali Road, Jabalpur','Jabalpur','Madhya Pradesh','460064','2026-03-19 23:36:31'),(19,19,'Varakshmicpelablr, Back Road, Mangalore','Varakshmicpelablr, Back Road, Mangalore','Mangalore','Karnataka','660064','2026-03-19 23:36:31'),(20,20,'Varardyelablr, Side Road, Patna','Varardyelablr, Side Road, Patna','Patna','Bihar','140064','2026-03-19 23:36:31'),(21,21,'Varalakshelablr, Front Road, Muzaffarpur','Varalakshelablr, Front Road, Muzaffarpur','Muzaffarpur','Bihar','541064','2026-03-19 23:36:31');
/*!40000 ALTER TABLE `student_address_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_contact_info`
--

DROP TABLE IF EXISTS `student_contact_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_contact_info` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_detail_id` int NOT NULL,
  `mother_name` varchar(50) DEFAULT NULL,
  `father_name` varchar(50) DEFAULT NULL,
  `guardian_name` varchar(50) DEFAULT NULL,
  `parent_contact_number` varchar(15) DEFAULT NULL,
  `guardian_contact_number` varchar(15) DEFAULT NULL,
  `parent_email` varchar(100) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `student_detail_id` (`student_detail_id`),
  CONSTRAINT `student_contact_info_ibfk_1` FOREIGN KEY (`student_detail_id`) REFERENCES `student_details` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_contact_info`
--

LOCK TABLES `student_contact_info` WRITE;
/*!40000 ALTER TABLE `student_contact_info` DISABLE KEYS */;
INSERT INTO `student_contact_info` VALUES (1,1,'Darshana',NULL,'Darshana','06969696969','06969696969',NULL,'2026-03-19 22:27:38'),(2,2,'Sabu','Gaunda','Sabu','8958356578','8958356578','gaundapuma@email.gz','2026-07-23 03:34:22'),(3,3,'Sayali',NULL,'Sayali','9032778693','9032778693',NULL,'2026-03-19 22:27:38'),(4,4,'Sarika','Dhananjay','Sarika','7316485164','7316485164',NULL,'2026-07-23 02:37:06'),(5,5,'Anita',NULL,'Anita','9282655877','9282655877',NULL,'2026-03-19 22:27:38'),(6,6,'Anita',NULL,'Anita','7006460453','7006460453',NULL,'2026-03-19 22:27:38'),(7,7,'Yasmeen',NULL,'Yasmeen','7006460453','7006460453',NULL,'2026-03-19 22:27:38'),(8,8,'Preeti',NULL,'Preeti','8106460496','8106460496',NULL,'2026-03-19 22:27:38'),(9,9,'Auntiji',NULL,'Auntiji','9206460882','9206460882',NULL,'2026-03-19 22:27:38'),(10,10,'Sabu',NULL,'Sabu','8958356578','8958356578',NULL,'2026-03-19 22:27:38'),(11,11,'Mummy',NULL,'Mummy','321654789','321654789',NULL,'2026-03-19 22:27:38'),(12,12,'',NULL,'','aa','aa',NULL,'2026-03-19 22:27:38'),(13,13,'Minali',NULL,'Minali','9159264873','9159264873',NULL,'2026-03-19 22:27:38'),(14,14,'Minali',NULL,'Minali','9159271873','9159271873',NULL,'2026-03-19 22:27:38'),(15,15,'Minali',NULL,'Minali','9159264873','9159264873',NULL,'2026-03-19 22:27:38'),(16,16,'Binali',NULL,'Binali','9159264873','9159264873',NULL,'2026-03-19 22:27:38'),(17,17,'Pinali',NULL,'Pinali','9159264873','9159264873',NULL,'2026-03-19 22:27:38'),(18,18,'Sinali',NULL,'Sinali','9159264873','9159264873',NULL,'2026-03-19 22:27:38'),(19,19,'Minali',NULL,'Minali','9159264873','9159264873',NULL,'2026-03-19 22:27:38'),(20,20,'Kinali',NULL,'Kinali','9159264873','9159264873',NULL,'2026-03-19 22:27:38'),(21,21,'Jinali',NULL,'Jinali','9159264873','9159264873',NULL,'2026-03-19 22:27:38');
/*!40000 ALTER TABLE `student_contact_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_details`
--

DROP TABLE IF EXISTS `student_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_details` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `date_of_birth` date NOT NULL,
  `gender` enum('M','F','O') NOT NULL,
  `disability` enum('None','Visual','Hearing','Learning','Other') DEFAULT 'None',
  `photo_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `student_id` (`student_id`),
  CONSTRAINT `student_details_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_details`
--

LOCK TABLES `student_details` WRITE;
/*!40000 ALTER TABLE `student_details` DISABLE KEYS */;
INSERT INTO `student_details` VALUES (1,1,'Unnati','Patil','1998-11-22','F','None',NULL,'2025-07-23 21:33:24','2026-03-18 15:11:18'),(2,2,'Anupama','DCruz','2020-12-16','F','None',NULL,'2025-07-24 10:13:17','2025-07-24 10:13:17'),(3,3,'Gurdeep','Patil','2020-04-05','M','None',NULL,'2025-07-24 10:23:15','2025-07-24 10:23:15'),(4,4,'Rakesh','Gupta','2021-04-02','M','None',NULL,'2025-07-24 10:26:56','2026-07-23 02:37:06'),(5,5,'Shubham','Rao','2018-05-01','M','None',NULL,'2025-07-24 10:31:35','2025-07-24 10:31:35'),(6,6,'Dhaval','Anand','2021-07-10','M','None',NULL,'2025-07-24 10:40:25','2025-07-24 10:40:25'),(7,7,'Hafsa','Begum','2020-12-03','F','None',NULL,'2025-07-24 10:42:41','2025-07-24 11:05:57'),(8,8,'Hemant','Chaudhary','2019-03-12','M','Hearing',NULL,'2025-07-24 11:08:42','2025-07-24 11:11:02'),(9,9,'Banvi','More','2020-12-02','F','Learning',NULL,'2025-07-24 11:10:23','2025-09-08 20:25:25'),(10,10,'Anupama','DCruz','2020-12-15','F','None',NULL,'2025-07-27 16:53:20','2025-07-27 16:53:20'),(11,11,'Surbhi','Jhuti','2021-08-16','F','None',NULL,'2025-08-26 21:56:12','2025-10-10 14:11:26'),(12,12,'From','End','2025-08-05','M','None',NULL,'2025-08-26 22:12:57','2026-03-19 22:15:19'),(13,13,'Fareeha','Gulrukh','2020-09-08','F','None',NULL,'2025-09-08 20:38:57','2025-09-08 20:38:57'),(14,14,'Gurdeep','Rao','2020-07-10','M','None',NULL,'2025-10-08 20:38:57','2025-10-08 20:38:57'),(15,15,'Fareeha','Hulrukh','2020-09-08','F','Learning',NULL,'2025-09-08 20:38:57','2025-09-08 20:38:57'),(16,16,'Mateha','Mulrukh','2020-07-08','F','None',NULL,'2025-06-08 20:38:57','2026-03-18 15:11:18'),(17,17,'Bareha','Fulrukh','2020-09-08','F','None',NULL,'2025-05-08 20:38:57','2025-05-08 20:38:57'),(18,18,'Lareeha','Bulrukh','2020-02-08','F','Visual',NULL,'2025-11-08 20:38:57','2025-11-08 20:38:57'),(19,19,'Pareha','Pulrukh','2020-11-08','F','None',NULL,'2025-09-18 20:38:57','2025-09-18 20:38:57'),(20,20,'Tabeeha','Falrukh','2020-10-08','F','None',NULL,'2025-04-28 20:38:57','2026-03-18 15:11:18'),(21,21,'Safeeha','Tulrukh','2020-07-08','F','Other',NULL,'2025-10-18 20:38:57','2025-10-18 20:38:57');
/*!40000 ALTER TABLE `student_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `students` (
  `id` int NOT NULL AUTO_INCREMENT,
  `admission_no` varchar(10) NOT NULL,
  `date_of_admission` date DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `admission_no` (`admission_no`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
INSERT INTO `students` VALUES (1,'xxx','2025-07-21',0,'2025-07-23 21:33:24','2026-03-18 15:11:18'),(2,'000001','2025-05-16',1,'2025-07-24 10:13:17','2025-07-24 10:13:17'),(3,'000002','2025-06-01',1,'2025-07-24 10:23:15','2025-07-24 10:23:15'),(4,'000003','2025-06-18',1,'2025-07-24 10:26:56','2026-07-23 03:37:51'),(5,'000004','2024-05-01',1,'2025-07-24 10:31:35','2025-07-24 10:31:35'),(6,'000005','2024-05-01',1,'2025-07-24 10:40:25','2025-07-24 10:40:25'),(7,'000006','2024-07-10',1,'2025-07-24 10:42:41','2025-07-24 11:05:57'),(8,'000007','2023-07-10',1,'2025-07-24 11:08:42','2025-07-24 11:11:02'),(9,'000008','2025-07-10',1,'2025-07-24 11:10:23','2025-09-08 20:25:25'),(10,'000009','2025-05-15',1,'2025-07-27 16:53:20','2025-07-27 16:53:20'),(11,'000111','2025-08-13',1,'2025-08-26 21:56:12','2025-10-10 14:11:26'),(12,'000012','2025-08-03',0,'2025-08-26 22:12:57','2026-03-18 15:11:18'),(13,'000010','2025-05-13',1,'2025-09-08 20:38:57','2025-09-08 20:38:57'),(14,'000011','2025-05-13',1,'2025-10-08 20:38:57','2025-10-08 20:38:57'),(15,'000013','2025-05-13',1,'2025-09-08 20:38:57','2025-09-08 20:38:57'),(16,'000014','2025-05-13',0,'2025-06-08 20:38:57','2026-03-18 15:11:18'),(17,'000015','2025-05-13',1,'2025-05-08 20:38:57','2025-05-08 20:38:57'),(18,'000016','2025-05-13',1,'2025-11-08 20:38:57','2025-11-08 20:38:57'),(19,'000017','2025-05-13',1,'2025-09-18 20:38:57','2025-09-18 20:38:57'),(20,'000018','2025-05-13',0,'2025-04-28 20:38:57','2026-03-18 15:11:18'),(21,'000019','2025-05-13',1,'2025-10-18 20:38:57','2025-10-18 20:38:57');
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teacher_contact_info`
--

DROP TABLE IF EXISTS `teacher_contact_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teacher_contact_info` (
  `id` int NOT NULL AUTO_INCREMENT,
  `teacher_info_id` int NOT NULL,
  `contact_number` varchar(12) NOT NULL,
  `email_id` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `teacher_info_id` (`teacher_info_id`),
  CONSTRAINT `teacher_contact_info_ibfk_1` FOREIGN KEY (`teacher_info_id`) REFERENCES `teacher_details` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teacher_contact_info`
--

LOCK TABLES `teacher_contact_info` WRITE;
/*!40000 ALTER TABLE `teacher_contact_info` DISABLE KEYS */;
/*!40000 ALTER TABLE `teacher_contact_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teacher_details`
--

DROP TABLE IF EXISTS `teacher_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teacher_details` (
  `id` int NOT NULL AUTO_INCREMENT,
  `teacher_id` int NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `middle_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `gender` enum('M','F','O') DEFAULT NULL,
  `date_of_joining` date NOT NULL DEFAULT (curdate()),
  `UPDATED_AT` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `photo_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teacher_details`
--

LOCK TABLES `teacher_details` WRITE;
/*!40000 ALTER TABLE `teacher_details` DISABLE KEYS */;
/*!40000 ALTER TABLE `teacher_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teachers`
--

DROP TABLE IF EXISTS `teachers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teachers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_code` varchar(8) NOT NULL,
  `subject` varchar(16) DEFAULT NULL,
  `is_teaching` tinyint(1) DEFAULT '1',
  `CREATED_AT` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `UPDATED_AT` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teachers`
--

LOCK TABLES `teachers` WRITE;
/*!40000 ALTER TABLE `teachers` DISABLE KEYS */;
INSERT INTO `teachers` VALUES (1,'000001','Principal',1,'2026-03-29 17:41:47','2026-03-29 17:41:47');
/*!40000 ALTER TABLE `teachers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_details`
--

DROP TABLE IF EXISTS `user_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_details` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `middle_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `gender` enum('M','F','O') DEFAULT NULL,
  `photo_url` varchar(255) DEFAULT NULL,
  `CREATED_AT` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `UPDATED_AT` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `contact_number` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `user_details_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_details`
--

LOCK TABLES `user_details` WRITE;
/*!40000 ALTER TABLE `user_details` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `access_level` enum('1','2','3') NOT NULL DEFAULT '3',
  `email_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `CREATED_AT` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `UPDATED_AT` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_deleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`email_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'1','admin@email.com','$2b$10$H.hx3wGka.RnQaSeZ0raMuwYMd.TxpjxQ0xEfwrW3ZWSUtQ.MeIEG','2026-04-17 19:30:27','2026-04-17 19:31:23',0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-25  2:51:55
