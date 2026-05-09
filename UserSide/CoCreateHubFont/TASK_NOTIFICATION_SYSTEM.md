# 任务变更通知系统

## 概述

任务变更通知系统是一个完整的前后端集成功能，当用户对任务列表进行任何操作（增加、编辑、删除）时，会自动在公告面板中显示相应的通知。

## 功能特性

### 前端功能
- **实时通知显示**: 铃铛图标显示未读通知数量的红点提示
- **任务变更记录**: 显示所有任务的增加、编辑、删除操作
- **已读/未读状态**: 支持单个标记已读和全部标记已读
- **自动刷新**: 每30秒自动刷新通知列表
- **即时更新**: 任务操作后立即刷新通知

### 后端功能
- **自动通知创建**: 任务CRUD操作时自动创建通知记录
- **通知管理**: 完整的通知CRUD API
- **数据清理**: 自动保留最近100条通知记录
- **房间隔离**: 通知按房间进行隔离显示

## 数据库结构

### task_notification 表
```sql
CREATE TABLE `task_notification` (
  `notificationid` varchar(255) NOT NULL COMMENT '通知ID',
  `roomid` varchar(255) NOT NULL COMMENT '房间ID',
  `taskid` varchar(255) DEFAULT NULL COMMENT '任务ID（删除时为空）',
  `action_type` varchar(50) NOT NULL COMMENT '操作类型：CREATE, UPDATE, DELETE',
  `task_content` text COMMENT '任务内容（用于显示）',
  `operator` varchar(255) NOT NULL COMMENT '操作者ID',
  `createtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `is_read` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否已读：0-未读，1-已读',
  PRIMARY KEY (`notificationid`),
  KEY `idx_roomid` (`roomid`),
  KEY `idx_createtime` (`createtime` DESC),
  CONSTRAINT `fk_task_notification_roomid` FOREIGN KEY (`roomid`) REFERENCES `room` (`roomid`) ON DELETE CASCADE ON UPDATE CASCADE
);
```

## API 接口

### 获取通知列表
- **URL**: `GET /cch/task-notification/list/{roomid}`
- **功能**: 获取指定房间的任务通知列表（最近50条）

### 获取未读数量
- **URL**: `GET /cch/task-notification/unread-count/{roomid}`
- **功能**: 获取指定房间的未读通知数量

### 标记已读
- **URL**: `PUT /cch/task-notification/mark-read/{notificationid}`
- **功能**: 标记指定通知为已读

### 全部标记已读
- **URL**: `PUT /cch/task-notification/mark-all-read/{roomid}`
- **功能**: 标记指定房间所有通知为已读

## 使用方式

### 1. 数据库初始化
执行 `CoCreateHubFont/cch.sql` 文件中的 `task_notification` 表创建语句。

### 2. 后端启动
确保后端服务正常启动，新增的通知相关类会自动被Spring扫描并注册。

### 3. 前端使用
- 点击右上角的铃铛图标查看任务变更通知
- 红点表示有未读通知
- 点击通知项可标记为已读
- 点击"全部已读"按钮可标记所有通知为已读

## 通知格式

每个通知显示格式为：
- **标题**: "任务变更"
- **内容**: "{操作类型}任务，请留意"
  - 增加任务，请留意
  - 编辑任务，请留意  
  - 删除任务，请留意
- **时间**: MM-dd HH:mm 格式

## 技术实现

### 前端技术栈
- React Hooks (useState, useEffect, useRef, forwardRef, useImperativeHandle)
- Redux (useSelector)
- Ant Design Icons
- CSS3 动画和样式

### 后端技术栈
- Spring Boot
- MyBatis
- MySQL
- 自动事务管理

### 数据流
1. 用户执行任务操作（增加/编辑/删除）
2. TaskService 执行业务逻辑
3. TaskNotificationService 自动创建通知记录
4. 前端 TaskList 组件通知父组件刷新
5. AnnouncementPanel 重新加载通知数据
6. 用户界面实时更新显示

## 注意事项

1. **数据库约束**: 通知表与房间表有外键约束，删除房间时会级联删除相关通知
2. **性能优化**: 自动清理机制保留最近100条通知，避免数据过多
3. **实时性**: 通知会在任务操作成功后立即刷新，同时有30秒定时刷新机制
4. **错误处理**: 所有API调用都有完整的错误处理和用户提示

## 扩展性

系统设计具有良好的扩展性：
- 可以轻松添加新的操作类型
- 支持添加更多通知字段
- 可以扩展为支持其他类型的通知（如文档变更、用户操作等）
- 前端组件可以复用到其他页面