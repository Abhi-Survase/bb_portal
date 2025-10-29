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
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `students` (
  `id` int NOT NULL AUTO_INCREMENT,
  `admission_no` varchar(10) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `middle_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `d_o_b` date NOT NULL,
  `gender` enum('M','F','O') NOT NULL,
  `date_of_admission` date DEFAULT NULL,
  `mother_name` varchar(50) DEFAULT NULL,
  `contact_number` varchar(15) NOT NULL,
  `parent_email` varchar(100) DEFAULT NULL,
  `address` text,
  `city` varchar(30) DEFAULT NULL,
  `state` varchar(30) DEFAULT NULL,
  `pincode` varchar(6) DEFAULT NULL,
  `disability` enum('None','Visual','Hearing','Learning','Other') DEFAULT 'None',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `photo_url` varchar(255) DEFAULT NULL,
  `is_active` enum('true','false') DEFAULT 'true',
  PRIMARY KEY (`id`),
  UNIQUE KEY `admission_no` (`admission_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
INSERT INTO `students` VALUES (1,'xxx','Unnati','Dinesh','Patil','1998-11-22','F','2025-07-21','Darshana','06969696969','unnati.patil@email.com','Tarak Smruti, Gnsl Gaon, Gnsl - W, 701','Ghansoli','Maharashtra','400701','None','2025-07-23 21:33:24','2025-07-24 10:14:25',NULL,'false'),(2,'000001','Anupama','Rana','DCruz','2020-12-16','F','2025-05-16','Sabu','8958356578','rana.dcruz-1421@gmail.com','Apt. 396 Jl. Kartini No. 17, Mamberamo Tengah, Srinagar, Tamil Nadu, 33755','Srinagar','Tamil Nadu','033755','None','2025-07-24 10:13:17','2025-07-24 10:13:17',NULL,'true'),(3,'000002','Gurdeep','Sarthak','Patil','2020-04-05','M','2025-06-01','Sayali','9032778693','sarth_patil81@hotmail.com','108/864, Motilal Ngr No 1, Goregaon (w)','Mumbai','Maharashtra','400104','None','2025-07-24 10:23:15','2025-07-24 10:23:15',NULL,'true'),(5,'000003','Rakesh','Raghu','Gupta','2021-04-03','M','2025-06-19','Sarika','7316485164','Raghu71.Gupta23@mail.com','E-8,0/1, Vardhaman Market, Sector 1, Vashi, Navi Mumbai','Vashi','Maharashtra','400705','None','2025-07-24 10:26:56','2025-07-24 10:26:56',NULL,'true'),(6,'000004','Shubham','Navneet','Rao','2018-05-01','M','2024-05-01','Anita','9282655877','navnneet.b.rao25@outlook.com','6, Dalvi Estate, B P Cross Road No 5, Bhayander (e)','Mumbai','Maharashtra','401105','None','2025-07-24 10:31:35','2025-07-24 10:31:35',NULL,'true'),(8,'000005','Dhaval','Anand','Anand','2021-07-10','M','2024-05-01','Anita','7006460453','anand.r.anand@yahoo.com','Shop No A 624, Muslim Nagar, 60 Feet Road, Dharavi','Mumbai','Maharashtra','400017','None','2025-07-24 10:40:25','2025-07-24 10:40:25',NULL,'true'),(10,'000006','Hafsa','Asrif','Begum','2020-12-03','F','2024-07-10','Yasmeen','7006460453','asril.begum83@gmail.com','Shop No A 624, Muslim Nagar, 60 Feet Road, Dharavi','Mumbai','Maharashtra','400017','None','2025-07-24 10:42:41','2025-07-24 11:05:57',NULL,'true'),(11,'000007','Hemant','Randive','Chaudhary','2019-03-12','M','2023-07-10','Preeti','8106460496','preeti.chaudhary@gmail.com','21, Vikrant Bldg, R.b.mehta Rd, Opp Bnk Of Madurai, Ghatkoper (east)','Mumbai','Maharashtra','400089','Hearing','2025-07-24 11:08:42','2025-07-24 11:11:02',NULL,'true'),(12,'000008','Banvi','Uncleji','More','2020-12-02','F','2025-07-10','Auntiji','9206460882','uncle.aunty@email.com','Shukla Compound, Behram Baug, Link Road, Jogeshwari(w)','Mumbai','Maharashtra','400102','Learning','2025-07-24 11:10:23','2025-09-08 20:25:25',NULL,'true'),(35,'000009','Anupama','Rana','DCruz','2020-12-15','F','2025-05-15','Sabu','8958356578','rana.dcruz-1421@gmail.com','Apt. 396 Jl. Kartini No. 17, Mamberamo Tengah, Srinagar, Tamil Nadu, 33755','Srinagar','Tamil Nadu','033755','None','2025-07-27 16:53:20','2025-07-27 16:53:20',NULL,'true'),(37,'000111','Surbhi','Papa','Jhuti','2021-08-16','F','2025-08-13','Mummy','321654789',NULL,'Changni Chowk, West','Insta','Mesopotania','444125','None','2025-08-26 21:56:12','2025-10-10 14:11:26',NULL,'true'),(53,'012','From','Front','End','2025-08-05','M','2025-08-03','','aa',NULL,'','','','',NULL,'2025-08-26 22:12:57','2025-10-10 14:11:44',NULL,'false'),(54,'000013','Fareeha','Harinder',' Gulrukh','2020-09-08','F','2025-05-13','Minali','9159264873',NULL,'Varalakshmicplxhosprdyelablr-64, Hospital Road, Bangalore','Bangalore','Karnataka','560064','None','2025-09-08 20:38:57','2025-09-08 20:38:57',NULL,'true');
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-29 23:41:04
