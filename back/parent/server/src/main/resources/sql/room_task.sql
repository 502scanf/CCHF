-- ----------------------------
-- Table structure for room_task
-- ----------------------------
DROP TABLE IF EXISTS `room_task`;
CREATE TABLE `room_task` (
  `taskid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT '任务ID',
  `roomid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT '房间ID',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT '任务内容',
  `creator` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT '创建者ID',
  `createtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updatetime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`taskid`) USING BTREE,
  INDEX `idx_roomid` (`roomid` ASC) USING BTREE,
  CONSTRAINT `fk_room_task_roomid` FOREIGN KEY (`roomid`) REFERENCES `room` (`roomid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_bin COMMENT = '房间任务表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of room_task (测试数据)
-- ----------------------------
-- 注意：需要先有对应的房间数据，这里使用示例房间ID '87VlXZ8VH'
-- 请根据实际情况修改 roomid 和 creator

INSERT INTO `room_task` VALUES 
('task-001', '87VlXZ8VH', '完成项目需求文档编写', '87Tp0TWuZ', NOW(), NOW()),
('task-002', '87VlXZ8VH', '设计数据库表结构', '87Tp0TWuZ', NOW(), NOW()),
('task-003', '87VlXZ8VH', '实现用户认证功能', '87Tp0TWuZ', NOW(), NOW()),
('task-004', '87VlXZ8VH', '开发任务管理模块', '87Tp0TWuZ', NOW(), NOW()),
('task-005', '87VlXZ8VH', '编写单元测试', '87Tp0TWuZ', NOW(), NOW());

-- 如果需要为其他房间添加测试数据，可以继续添加：
-- INSERT INTO `room_task` VALUES 
-- ('task-101', 'your-room-id', '测试任务1', 'your-user-id', NOW(), NOW()),
-- ('task-102', 'your-room-id', '测试任务2', 'your-user-id', NOW(), NOW());
