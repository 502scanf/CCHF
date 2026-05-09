package cchf.back.service.impl;

import cchf.back.constant.BaseContext;
import cchf.back.dto.TaskCreateDto;
import cchf.back.dto.TaskUpdateDto;
import cchf.back.entity.RoomTask;
import cchf.back.mapper.TaskMapper;
import cchf.back.service.TaskService;
import cchf.back.service.TaskNotificationService;
import cchf.back.vo.TaskVo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
public class TaskServiceImpl implements TaskService {

    @Autowired
    private TaskMapper taskMapper;

    @Autowired
    private TaskNotificationService taskNotificationService;

    @Override
    public TaskVo createTask(TaskCreateDto taskCreateDto) {
        log.info("创建任务: {}", taskCreateDto);

        // 检查任务数量是否超过10个
        int taskCount = taskMapper.getTaskCountByRoomId(taskCreateDto.getRoomid());
        if (taskCount >= 10) {
            throw new RuntimeException("任务数量已达上限（10个）");
        }

        // 创建任务实体
        RoomTask task = RoomTask.builder()
                .taskid(UUID.randomUUID().toString())
                .roomid(taskCreateDto.getRoomid())
                .content(taskCreateDto.getContent())
                .creator(BaseContext.getCurrentId())
                .createtime(new Timestamp(System.currentTimeMillis()))
                .updatetime(new Timestamp(System.currentTimeMillis()))
                .build();

        taskMapper.createTask(task);

        // 创建任务变更通知
        taskNotificationService.createTaskNotification(
                task.getRoomid(),
                task.getTaskid(),
                "CREATE",
                task.getContent(),
                task.getCreator());

        // 转换为VO返回
        return convertToVo(task);
    }

    @Override
    public List<TaskVo> getTasksByRoomId(String roomid) {
        log.info("获取房间任务列表: {}", roomid);

        List<RoomTask> tasks = taskMapper.getTasksByRoomId(roomid);

        return tasks.stream()
                .map(this::convertToVo)
                .collect(Collectors.toList());
    }

    @Override
    public TaskVo updateTask(TaskUpdateDto taskUpdateDto) {
        log.info("更新任务: {}", taskUpdateDto);

        // 查询任务是否存在
        RoomTask existingTask = taskMapper.getTaskById(taskUpdateDto.getTaskid());
        if (existingTask == null) {
            throw new RuntimeException("任务不存在");
        }

        // 更新任务内容
        existingTask.setContent(taskUpdateDto.getContent());
        existingTask.setUpdatetime(new Timestamp(System.currentTimeMillis()));

        taskMapper.updateTask(existingTask);

        // 创建任务变更通知
        taskNotificationService.createTaskNotification(
                existingTask.getRoomid(),
                existingTask.getTaskid(),
                "UPDATE",
                existingTask.getContent(),
                BaseContext.getCurrentId());

        // 返回更新后的任务
        return convertToVo(existingTask);
    }

    @Override
    public void deleteTask(String taskid) {
        log.info("删除任务: {}", taskid);

        // 查询任务是否存在
        RoomTask task = taskMapper.getTaskById(taskid);
        if (task == null) {
            throw new RuntimeException("任务不存在");
        }

        // 先创建删除通知（在删除任务之前）
        taskNotificationService.createTaskNotification(
                task.getRoomid(),
                null, // 删除后任务ID不存在，设为null
                "DELETE",
                task.getContent(),
                BaseContext.getCurrentId());

        // 删除任务
        taskMapper.deleteTask(taskid);
    }

    // 转换为VO
    private TaskVo convertToVo(RoomTask task) {
        TaskVo vo = new TaskVo();
        BeanUtils.copyProperties(task, vo);
        return vo;
    }
}
