package cchf.back.mapper;

import cchf.back.entity.RoomTask;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface TaskMapper {

    // 创建任务
    void createTask(RoomTask task);

    // 根据房间ID查询任务列表
    List<RoomTask> getTasksByRoomId(@Param("roomid") String roomid);

    // 根据任务ID查询任务
    RoomTask getTaskById(@Param("taskid") String taskid);

    // 更新任务内容
    void updateTask(RoomTask task);

    // 删除任务
    void deleteTask(@Param("taskid") String taskid);

    // 获取房间任务数量
    int getTaskCountByRoomId(@Param("roomid") String roomid);
}
