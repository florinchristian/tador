# ************************************************************
# Sequel Ace SQL dump
# Version 20025
#
# https://sequel-ace.com/
# https://github.com/Sequel-Ace/Sequel-Ace
#
# Host: localhost (MySQL 8.0.27)
# Database: tador
# Generation Time: 2022-02-26 5:36:12 PM +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
SET NAMES utf8mb4;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE='NO_AUTO_VALUE_ON_ZERO', SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table blacklist
# ------------------------------------------------------------

DROP TABLE IF EXISTS `blacklist`;

CREATE TABLE `blacklist` (
  `userId` varchar(100) DEFAULT NULL,
  `userValue` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



# Dump of table reports
# ------------------------------------------------------------

DROP TABLE IF EXISTS `reports`;

CREATE TABLE `reports` (
  `userId` varchar(100) DEFAULT NULL,
  `body` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



# Dump of table requests
# ------------------------------------------------------------

DROP TABLE IF EXISTS `requests`;

CREATE TABLE `requests` (
  `userId` varchar(100) DEFAULT NULL,
  `destUserId` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



# Dump of table userinfo
# ------------------------------------------------------------

DROP TABLE IF EXISTS `userinfo`;

CREATE TABLE `userinfo` (
  `userId` varchar(100) NOT NULL,
  `birthdate` varchar(100) DEFAULT NULL,
  `gender` varchar(100) DEFAULT NULL,
  `seeking` varchar(100) DEFAULT NULL,
  `snapchat` varchar(100) DEFAULT NULL,
  `banned` tinyint(1) DEFAULT NULL,
  `banReason` varchar(200) DEFAULT NULL,
  `canChangeSnapchat` tinyint(1) DEFAULT NULL,
  `xCoord` double(11,6) DEFAULT NULL,
  `yCoord` double(11,6) DEFAULT NULL,
  `preferredGender` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `considerDateLocation` tinyint(1) DEFAULT (true),
  `considerDtfLocation` tinyint(1) DEFAULT (true),
  `considerFwbLocation` tinyint(1) DEFAULT (true),
  PRIMARY KEY (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `userinfo` WRITE;
/*!40000 ALTER TABLE `userinfo` DISABLE KEYS */;

INSERT INTO `userinfo` (`userId`, `birthdate`, `gender`, `seeking`, `snapchat`, `banned`, `banReason`, `canChangeSnapchat`, `xCoord`, `yCoord`, `preferredGender`, `considerDateLocation`, `considerDtfLocation`, `considerFwbLocation`)
VALUES
	('76EBB69F-E381-4E81-93B6-974BF32BC77A','1999-01-28T09:19:32.000Z','female','dating','jessica',0,NULL,1,37.785834,-122.406417,'male',0,0,0),
	('AA5DEE46-7589-481F-AF22-A23E69E0EC8F','2001-01-26T15:19:28.000Z','male','dating','cristian',0,NULL,1,0.000000,0.000000,'female',1,1,1);

/*!40000 ALTER TABLE `userinfo` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `userId` varchar(50) NOT NULL,
  PRIMARY KEY (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;

INSERT INTO `users` (`userId`)
VALUES
	('76EBB69F-E381-4E81-93B6-974BF32BC77A'),
	('AA5DEE46-7589-481F-AF22-A23E69E0EC8F');

/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
