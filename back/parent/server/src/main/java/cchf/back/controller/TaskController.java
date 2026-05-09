package cchf.back.controller;

import cchf.back.dto.TaskCreateDto;
import cchf.back.dto.TaskUpdateDto;
import cchf.back.result.result;
import cchf.back.service.TaskService;
import cchf.back.vo.TaskVo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/cch/task")
public class TaskController {

    @Autowired
    private TaskService taskService;

    /**
     * 创建任务
     */
    @PostMapping("/create")
    public result<TaskVo> createTask(@RequestBody TaskCreateDto taskCreateDto) {
        log.info("创建任务: {}", taskCreateDto);
        try {
            TaskVo taskVo = taskService.createTask(taskCreateDto);
            return result.success(taskVo);
        } catch (Exception e) {
            log.error("创建任务失败", e);
            return result.error(e.getMessage());
        }
    }

    /**
     * 获取房间任务列表
     */
    @GetMapping("/list/{roomid}")
    public result<List<TaskVo>> getTaskList(@PathVariable String roomid) {
        log.info("获取房间任务列表: {}", roomid);
        try {
            List<TaskVo> tasks = taskService.getTasksByRoomId(roomid);
            return result.success(tasks);
        } catch (Exception e) {
            log.error("获取任务列表失败", e);
            return result.error(e.getMessage());
        }
    }

    /**
     * 更新任务
     */
    @PutMapping("/update")
    public result<TaskVo> updateTask(@RequestBody TaskUpdateDto taskUpdateDto) {
        log.info("更新任务: {}", taskUpdateDto);
        try {
            TaskVo taskVo = taskService.updateTask(taskUpdateDto);
            return result.success(taskVo);
        } catch (Exception e) {
            log.error("更新任务失败", e);
            return result.error(e.getMessage());
        }
    }

    /**
     * 删除任务
     */
    @DeleteMapping("/delete/{taskid}")
    public result<?> deleteTask(@PathVariable String taskid) {
        log.info("删除任务: {}", taskid);
        try {
            taskService.deleteTask(taskid);
            return result.success();
        } catch (Exception e) {
            log.error("删除任务失败", e);
            return result.error(e.getMessage());
        }
    }
}
