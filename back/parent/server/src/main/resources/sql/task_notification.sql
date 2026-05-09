-- ----------------------------
-- Table structure for task_notification
-- ----------------------------
DROP TABLE IF EXISTS `task_notification`;
CREATE TABLE `task_notification` (
  `notificationid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT '通知ID',
  `roomid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT '房间ID',
  `taskid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT '任务ID（可为空，删除任务时任务ID已不存在）',
  `action_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT '操作类型：CREATE, UPDATE, DELETE',
  `task_content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin COMMENT '任务内容（用于显示）',
  `operator` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT '操作者ID',
  `createtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `is_read` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否已读：0-未读，1-已读',
  PRIMARY KEY (`notificationid`) USING BTREE,
  INDEX `idx_roomid` (`roomid` ASC) USING BTREE,
  INDEX `idx_createtime` (`createtime` DESC) USING BTREE,
  CONSTRAINT `fk_task_notification_roomid` FOREIGN KEY (`roomid`) REFERENCES `room` (`roomid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_bin COMMENT = '任务变更通知表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of task_notification (测试数据)
-- ----------------------------
INSERT INTO `task_notification` VALUES 
('notif-001', '87VlXZ8VH', 'task-001', 'CREATE', '完成项目需求文档编写', '87Tp0TWuZ', DATE_SUB(NOW(), INTERVAL 2 HOUR), 0),
('notif-002', '87VlXZ8VH', 'task-002', 'CREATE', '设计数据库表结构', '87Tp0TWuZ', DATE_SUB(NOW(), INTERVAL 1 HOUR), 0),
('notif-003', '87VlXZ8VH', 'task-001', 'UPDATE', '完成项目需求文档编写和评审', '87Tp0TWuZ', DATE_SUB(NOW(), INTERVAL 30 MINUTE), 1),
('notif-004', '87VlXZ8VH', NULL, 'DELETE', '临时测试任务', '87Tp0TWuZ', DATE_SUB(NOW(), INTERVAL 10 MINUTE), 0);