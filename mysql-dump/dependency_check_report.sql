/*
 Navicat MySQL Data Transfer

 Source Server         : project
 Source Server Type    : MySQL
 Source Server Version : 80100 (8.1.0)
 Source Host           : localhost:3306
 Source Schema         : dependency_check_report

 Target Server Type    : MySQL
 Target Server Version : 80100 (8.1.0)
 File Encoding         : 65001

 Date: 10/10/2023 11:36:55
*/

DROP database IF EXISTS dependency_check_report;
CREATE database dependency_check_report;

USE dependency_check_report;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for dependency_check_results
-- ----------------------------
DROP TABLE IF EXISTS `report`;

CREATE TABLE `report`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `project_name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `scan_date` timestamp NULL DEFAULT NULL,
  `vulnerabilities` json NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
