package cchf.back.task;

import cchf.back.entity.DefineDoc;
import cchf.back.entity.Room;
import cchf.back.mapper.DocMapper;
import cchf.back.mapper.DocVersionMapper;
import cchf.back.mapper.MateMapper;
import cchf.back.mapper.RoomMapper;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.List;

@Component
@Slf4j
public class RecycleCleanupTask {

    @Autowired
    private RoomMapper roomMapper;

    @Autowired
    private DocMapper docMapper;

    @Autowired
    private DocVersionMapper docVersionMapper;

    @Autowired
    private MateMapper mateMapper;

    // 每天凌晨2点执行
    @Scheduled(cron = "0 0 2 * * ?")
    public void cleanupRecycledData() {

        log.info("开始清理回收站过期数据...");

        LocalDateTime date = LocalDateTime.now().minusDays(7);
        // 1. 清理过期文档 (7天以前回收的)
        List<DefineDoc> expiredDocs = docMapper.getExpiredDocs(date);
        if (expiredDocs != null && !expiredDocs.isEmpty()) {
            for (DefineDoc doc : expiredDocs) {
                log.info("永久删除过期文档: {}", doc.getDocid());
                // 先删除文档的所有版本记录
                docVersionMapper.deleteVersionsByDocId(doc.getDocid());
                // 再删除文档本身
                docMapper.deleteDocPermanently(doc.getDocid());
            }
        }

        // 2. 清理过期房间 (7天以前回收的)
        List<Room> expiredRooms = roomMapper.getExpiredRooms(date);
        if (expiredRooms != null && !expiredRooms.isEmpty()) {
            for (Room room : expiredRooms) {
                log.info("永久删除过期房间及其内容: {}", room.getRoomname());
                String roomid = room.getRoomid();

                // 级联删除相关的版本记录 (通过查doc表)
                docVersionMapper.deleteVersionsByRoomId(roomid);
                // 级联删除相关的文档
                docMapper.deleteDocsByRoomId(roomid);
                // 级联删除房间成员记录
                mateMapper.deleteAllByRoomId(roomid);
                // 最后永久删除房间
                roomMapper.deleteRoomPermanently(roomid);
            }
        }

        log.info("回收站过期数据清理完毕.");
    }
}
