package cchf.back.service;

import cchf.back.dto.TaskCreateDto;
import cchf.back.dto.TaskUpdateDto;
import cchf.back.vo.TaskVo;

import java.util.List;

public interface TaskService {

    // 创建任务
    TaskVo createTask(TaskCreateDto taskCreateDto);

    // 获取房间任务列表
    List<TaskVo> getTasksByRoomId(String roomid);

    // 更新任务
    TaskVo updateTask(TaskUpdateDto taskUpdateDto);

    // 删除任务
    void deleteTask(String taskid);
}
