package cchf.back.mapper;

import cchf.back.entity.DocVersion;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.sql.Timestamp;
import java.util.List;

@Mapper
public interface DocVersionMapper {

        // 原有方法
        void insertVersion(@Param("docid") String docid,
                        @Param("content") byte[] content,
                        @Param("editor") String editor);

        void insertVersionWithType(@Param("docid") String docid,
                        @Param("content") byte[] content,
                        @Param("editor") String editor,
                        @Param("snapshotType") String snapshotType,
                        @Param("fileSize") Long fileSize);

        // 新增：插入完整版本对象
        void insertVersionObject(DocVersion version);

        List<DocVersion> getVersionsByDocId(@Param("docid") String docid);

        List<DocVersion> getVersionsByDocIdWithPaging(@Param("docid") String docid,
                        @Param("offset") int offset,
                        @Param("limit") int limit,
                        @Param("search") String search);

        // 新增：支持搜索的分页查询
        List<DocVersion> getVersionsByDocIdPaged(@Param("docid") String docid,
                        @Param("search") String search,
                        @Param("limit") int limit,
                        @Param("offset") int offset);

        // 新增：支持搜索的计数
        int countVersionsByDocId(@Param("docid") String docid, @Param("search") String search);

        // 通过字符串 vid 获取版本
        DocVersion getVersionById(@Param("vid") String vid);

        // 新增：获取最新版本
        DocVersion getLatestVersionByDocId(@Param("docid") String docid);

        // 新增：获取时间窗口内的最新版本
        DocVersion getRecentVersionInWindow(@Param("docid") String docid, @Param("windowStart") Timestamp windowStart);

        List<DocVersion> getVersionsInTimeWindow(@Param("docid") String docid,
                        @Param("cutoffTime") Timestamp cutoffTime);

        // 新增：获取最旧的版本ID列表（字符串类型）
        List<String> getOldestVersionIds(@Param("docid") String docid, @Param("limit") int limit);

        // 新增：删除单个版本
        void deleteVersion(@Param("vid") String vid);

        void deleteVersionsByDocId(String docid);

        void deleteVersionsByRoomId(String roomid);

        // 新增：更新版本标签（字符串 vid，List 类型）
        void updateVersionLabels(@Param("vid") String vid, @Param("labels") List<String> labels);

        // 新增：更新版本锁定状态（字符串 vid）
        void updateVersionLock(@Param("vid") String vid, @Param("isLocked") Boolean isLocked);

        // 新增：更新版本内容
        void updateVersionContent(@Param("vid") String vid, @Param("content") byte[] content,
                        @Param("updatedAt") Timestamp updatedAt);
}