/*
 Navicat Premium Data Transfer

 Source Server         : localmysql
 Source Server Type    : MySQL
 Source Server Version : 50726
 Source Host           : 127.0.0.1:3306
 Source Schema         : cs493final

 Target Server Type    : MySQL
 Target Server Version : 50726
 File Encoding         : 65001

 Date: 13/06/2019 17:23:10
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for assignments
-- ----------------------------
DROP TABLE IF EXISTS `assignments`;
CREATE TABLE `assignments`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `courseid` int(11) NOT NULL,
  `title` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `points` int(11) NOT NULL,
  `due` datetime(0) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of assignments
-- ----------------------------
INSERT INTO `assignments` VALUES (1, 2, 'Install linux on your computer', 40, '2019-06-07 00:00:00');
INSERT INTO `assignments` VALUES (2, 2, 'Keiyh', 100, '2019-06-07 00:00:00');
INSERT INTO `assignments` VALUES (5, 1, 'SetupServerNew', 1440, '2019-06-27 00:00:00');
INSERT INTO `assignments` VALUES (6, 1, 'SetupServer', 110, '2019-06-27 00:00:00');

-- ----------------------------
-- Table structure for courses
-- ----------------------------
DROP TABLE IF EXISTS `courses`;
CREATE TABLE `courses`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `subject` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `number` int(11) NOT NULL,
  `title` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `term` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `instructor` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of courses
-- ----------------------------
INSERT INTO `courses` VALUES (0, 'CS', 493, 'Cloud Application Development', 'sp19', 1);
INSERT INTO `courses` VALUES (1, 'CS', 492, 'Mobile Application Development', 'sp19', 1);
INSERT INTO `courses` VALUES (2, 'CS', 290, 'Web Development', 'sp19', 1);
INSERT INTO `courses` VALUES (3, 'CS', 150, 'CPP Program', 'SP19', 2);
INSERT INTO `courses` VALUES (4, 'CS', 171, 'Python', 'SP19', 2);
INSERT INTO `courses` VALUES (5, 'MTH', 271, 'Matrix Maths', 'SP19', 2);
INSERT INTO `courses` VALUES (6, 'ECE', 271, 'Digital Ocean', 'Su18', 1);
INSERT INTO `courses` VALUES (7, 'ECE', 291, 'CuteAnankke', 'Su18', 1);

-- ----------------------------
-- Table structure for enrollment
-- ----------------------------
DROP TABLE IF EXISTS `enrollment`;
CREATE TABLE `enrollment`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `courseid` int(11) NOT NULL,
  `studentid` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of enrollment
-- ----------------------------
INSERT INTO `enrollment` VALUES (1, 1, 2);

-- ----------------------------
-- Table structure for submissions
-- ----------------------------
DROP TABLE IF EXISTS `submissions`;
CREATE TABLE `submissions`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `assignmentid` int(11) NOT NULL,
  `studentid` int(11) NOT NULL,
  `timestamp` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
  `file` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of submissions
-- ----------------------------
INSERT INTO `submissions` VALUES (1, 5, 3, '2019-06-07 00:00:00', '/assignment/media/${fid}');
INSERT INTO `submissions` VALUES (2, 5, 3, '2019-06-14 00:09:02', '/assignment/media/${fid}');
INSERT INTO `submissions` VALUES (3, 5, 3, '2019-06-14 00:09:07', '/assignment/media/${fid}');
INSERT INTO `submissions` VALUES (4, 5, 3, '2019-06-14 00:10:55', '/assignment/files/5d02e60e5959e053b4751c41');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `password` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `role` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `email`(`email`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1, 'Rob Hess', 'robhess@oregonstate.edu', '$2a$08$Og1tNzAWbCNG1Lmsalo1guYRYsvNzLzz6VSd0ksXA50BmSaLtjYAC', 'instructor');
INSERT INTO `users` VALUES (2, 'Zhuohong Gu', 'guz@oregonstate.edu', '$2a$08$6xcP/PS/TRG.b6dBSyJ.M.VayiXST5L/vJd3PLmYVRJK9a27ZgWCa', 'admin');
INSERT INTO `users` VALUES (3, 'Fetanson', 'fetanson@oregonstate.edu', '$2a$08$Dvmcm3ur4AhttHj8VJnJVuUdTzXm8yDHdOPlATAS/tudxP7HwMkCm', 'student');

SET FOREIGN_KEY_CHECKS = 1;
