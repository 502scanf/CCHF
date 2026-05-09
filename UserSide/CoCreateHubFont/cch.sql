/*
 Navicat MySQL Dump SQL

 Source Server         : scanf57
 Source Server Type    : MySQL
 Source Server Version : 50744 (5.7.44-log)
 Source Host           : localhost:3306
 Source Schema         : cch

 Target Server Type    : MySQL
 Target Server Version : 50744 (5.7.44-log)
 File Encoding         : 65001

 Date: 15/04/2026 23:40:46
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for doc
-- ----------------------------
DROP TABLE IF EXISTS `doc`;
CREATE TABLE `doc`  (
  `index` int(11) NOT NULL AUTO_INCREMENT COMMENT '序列',
  `docid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT '文件id',
  `docname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT '文件名',
  `doctype` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT '文件类型',
  `docroomid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT '房间id',
  `status` tinyint(4) NOT NULL COMMENT '文件状态',
  `content` longblob NULL COMMENT '文档内容(Yjs状态)',
  `owner` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL DEFAULT NULL COMMENT '创建者id',
  `createtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updatetime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `recycletime` timestamp NULL DEFAULT NULL COMMENT '回收时间',
  PRIMARY KEY (`docid`) USING BTREE,
  INDEX `index`(`index`) USING BTREE,
  INDEX `docroomid`(`docroomid`) USING BTREE,
  CONSTRAINT `doc_ibfk_1` FOREIGN KEY (`docroomid`) REFERENCES `room` (`roomid`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_bin ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of doc
-- ----------------------------
INSERT INTO `doc` VALUES (3, '88LAM22M4', 'VS的v', 'txt', '87VIXZ8VH', 0, 0x0102BDECBAD20D0007010938384C414D32324D34060400BDECBAD20D0015E58F91E5A3ABE5A4A7E5A4ABE5A3ABE5A4A7E5A4AB00, '87Tp0TWuZ', '2026-04-14 00:00:53', '2026-04-14 01:11:24', NULL);

-- ----------------------------
-- Table structure for doc_version
-- ----------------------------
DROP TABLE IF EXISTS `doc_version`;
CREATE TABLE `doc_version`  (
  `vid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT '版本ID',
  `docid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT '文件id',
  `content` longblob NOT NULL COMMENT '状态快照',
  `editor` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT '最后编辑者',
  `createtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `created_by` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL DEFAULT NULL COMMENT '创建者',
  `snapshot_type` enum('auto_save','auto_milestone') CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL DEFAULT 'auto_save' COMMENT '快照类型',
  `labels` json NULL COMMENT '版本标签数组',
  `is_locked` tinyint(1) NULL DEFAULT 0 COMMENT '是否锁定',
  `diff_stats` json NULL COMMENT '差异统计信息',
  `file_size` bigint(20) NULL DEFAULT 0 COMMENT '版本文件大小',
  `parent_vid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL DEFAULT NULL COMMENT '父版本ID（用于合并追踪）',
  PRIMARY KEY (`vid`) USING BTREE,
  INDEX `docid`(`docid`) USING BTREE,
  INDEX `idx_docid_createtime`(`docid`, `createtime`) USING BTREE,
  INDEX `idx_snapshot_type`(`snapshot_type`) USING BTREE,
  INDEX `idx_is_locked`(`is_locked`) USING BTREE,
  CONSTRAINT `doc_version_ibfk_1` FOREIGN KEY (`docid`) REFERENCES `doc` (`docid`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_bin ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of doc_version
-- ----------------------------
INSERT INTO `doc_version` VALUES ('v_1776096096370_831', '88LAM22M4', 0x0102BDECBAD20D0007010938384C414D32324D34060400BDECBAD20D0015E58F91E5A3ABE5A4A7E5A4ABE5A3ABE5A4A7E5A4AB00, '502', '2026-04-14 00:01:36', '2026-04-14 00:01:36', '502', 'auto_milestone', NULL, 0, NULL, 52, NULL);

-- ----------------------------
-- Table structure for room
-- ----------------------------
DROP TABLE IF EXISTS `room`;
CREATE TABLE `room`  (
  `index` int(11) NOT NULL AUTO_INCREMENT COMMENT '序列',
  `roomname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT '房间名',
  `roomid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT '房间id',
  `onerid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT '房主id',
  `status` tinyint(4) NOT NULL COMMENT '房间状态',
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '创建时间',
  `recycletime` timestamp NULL DEFAULT NULL COMMENT '回收时间',
  PRIMARY KEY (`roomid`) USING BTREE,
  INDEX `index`(`index`) USING BTREE,
  INDEX `onerid`(`onerid`) USING BTREE,
  CONSTRAINT `room_ibfk_1` FOREIGN KEY (`onerid`) REFERENCES `user` (`uid`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_bin ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of room
-- ----------------------------
INSERT INTO `room` VALUES (1, '123', '87VIXZ8VH', '87Tp0TWuZ', 0, '2026-03-10 13:39:01', NULL);

-- ----------------------------
-- Table structure for room_task
-- ----------------------------
DROP TABLE IF EXISTS `room_task`;
CREATE TABLE `room_task`  (
  `taskid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT '任务ID',
  `roomid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT '房间ID',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT '任务内容',
  `creator` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT '创建者ID',
  `createtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updatetime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`taskid`) USING BTREE,
  INDEX `idx_roomid`(`roomid`) USING BTREE,
  INDEX `idx_createtime`(`createtime`) USING BTREE,
  CONSTRAINT `room_task_ibfk_1` FOREIGN KEY (`roomid`) REFERENCES `room` (`roomid`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_bin COMMENT = '房间任务表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of room_task
-- ----------------------------
INSERT INTO `room_task` VALUES ('c4c17e8c-1fdf-4f6a-b313-b8b69afee551', '87VIXZ8VH', '法大师傅大师傅大师傅', '87Tp0TWuZ', '2026-04-13 23:45:58', '2026-04-13 23:45:58');
INSERT INTO `room_task` VALUES ('task-002', '87VIXZ8VH', '设计数据库表结构并创建ER图', '87Tp0TWuZ', '2026-04-13 09:30:00', '2026-04-13 09:30:00');
INSERT INTO `room_task` VALUES ('task-003', '87VIXZ8VH', '实现用户认证和授权模块', '87Tp0TWuZ', '2026-04-13 10:00:00', '2026-04-13 10:00:00');
INSERT INTO `room_task` VALUES ('task-004', '87VIXZ8VH', '编写单元测试和集成测试', '87Tp0TWuZ', '2026-04-13 10:30:00', '2026-04-13 10:30:00');
INSERT INTO `room_task` VALUES ('task-005', '87VIXZ8VH', '优化前端页面性能和用户体验', '87Tp0TWuZ', '2026-04-13 11:00:00', '2026-04-13 11:00:00');

-- ----------------------------
-- Table structure for roommate
-- ----------------------------
DROP TABLE IF EXISTS `roommate`;
CREATE TABLE `roommate`  (
  `index` int(11) NOT NULL AUTO_INCREMENT COMMENT '序列',
  `roomid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT '房间id',
  `memberid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL DEFAULT NULL COMMENT '成员id',
  `membername` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL DEFAULT NULL COMMENT '成员名称',
  PRIMARY KEY (`index`) USING BTREE,
  INDEX `roomate_ibfk_1`(`roomid`) USING BTREE,
  INDEX `roomate_ibfk_2`(`memberid`) USING BTREE,
  CONSTRAINT `roomate_ibfk_1` FOREIGN KEY (`roomid`) REFERENCES `room` (`roomid`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `roomate_ibfk_2` FOREIGN KEY (`memberid`) REFERENCES `user` (`uid`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_bin ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of roommate
-- ----------------------------
INSERT INTO `roommate` VALUES (1, '87VIXZ8VH', '87Tp0TWuZ', '502');

-- ----------------------------
-- Table structure for task_notification
-- ----------------------------
DROP TABLE IF EXISTS `task_notification`;
CREATE TABLE `task_notification`  (
  `notificationid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT '通知ID',
  `roomid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT '房间ID',
  `taskid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL DEFAULT NULL COMMENT '任务ID（可为空，删除任务时任务ID已不存在）',
  `action_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT '操作类型：CREATE, UPDATE, DELETE',
  `task_content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL COMMENT '任务内容（用于显示）',
  `operator` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT '操作者ID',
  `createtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `is_read` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否已读：0-未读，1-已读',
  PRIMARY KEY (`notificationid`) USING BTREE,
  INDEX `idx_roomid`(`roomid`) USING BTREE,
  INDEX `idx_createtime`(`createtime`) USING BTREE,
  CONSTRAINT `fk_task_notification_roomid` FOREIGN KEY (`roomid`) REFERENCES `room` (`roomid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_bin COMMENT = '任务变更通知表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of task_notification
-- ----------------------------
INSERT INTO `task_notification` VALUES ('notif-001', '87VIXZ8VH', 'task-002', 'CREATE', '设计数据库表结构并创建ER图', '87Tp0TWuZ', '2026-04-13 23:33:55', 0);
INSERT INTO `task_notification` VALUES ('notif-002', '87VIXZ8VH', 'task-003', 'CREATE', '实现用户认证和授权模块', '87Tp0TWuZ', '2026-04-14 00:33:55', 0);
INSERT INTO `task_notification` VALUES ('notif-003', '87VIXZ8VH', 'task-002', 'UPDATE', '设计数据库表结构并创建ER图和文档', '87Tp0TWuZ', '2026-04-14 01:03:55', 1);
INSERT INTO `task_notification` VALUES ('notif-004', '87VIXZ8VH', NULL, 'DELETE', '临时测试任务', '87Tp0TWuZ', '2026-04-14 01:23:55', 0);

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `index` int(11) NOT NULL AUTO_INCREMENT COMMENT '序列',
  `uid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT '用户id',
  `uname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT '用户名',
  `mail` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT '邮箱',
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT '密码',
  `logo` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL COMMENT '头像',
  PRIMARY KEY (`uid`) USING BTREE,
  INDEX `index`(`index`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_bin ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (1, '87Tp0TWuZ', '502', '123456jjn', '123456', 'sljdfaksjfklsf');

SET FOREIGN_KEY_CHECKS = 1;
