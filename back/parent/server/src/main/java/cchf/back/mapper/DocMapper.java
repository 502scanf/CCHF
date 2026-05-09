package cchf.back.mapper;

import cchf.back.dto.DocBuildDto;
import cchf.back.dto.UpdateDocDto;
import cchf.back.entity.DefineDoc;
import cchf.back.vo.DocBuildVo;
import cchf.back.vo.DocRecycleVo;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

@Mapper
public interface DocMapper {
        void docBuild(DefineDoc defineDoc);

        DocBuildVo getdoc(DocBuildDto docBuildDto);

        void recycleDoc(DocBuildDto docBuildDto);

        List<DocBuildVo> getDocList(String roomid);

        Long countDocList(@Param("roomid") String roomid);

        List<DocBuildVo> getDocListPage(@Param("roomid") String roomid, @Param("offset") Integer offset,
                        @Param("pageSize") Integer pageSize);

        DefineDoc getdocById(String docid);

        void updateDoc(@Param("docid") String docid, @Param("updatetime") Timestamp updatetime,
                        @Param("owner") String owner, @Param("content") byte[] content);

        byte[] getContent(@Param("docid") String docid);

        void recycleDocsByRoomId(String roomid);

        void restoreDocsByRoomId(String roomid);

        void restoreDoc(String docid);

        void deleteDocsByRoomId(String roomid);

        void deleteDocPermanently(String docid);

        List<DocBuildVo> getRecycledDocs(String roomid);

        List<DefineDoc> getExpiredDocs(LocalDateTime dateTime);

        void renameDoc(@Param("docid") String docid, @Param("newName") String newName);

        void deleteDocAndVersions(@Param("docid") String docid);

        // 新增：更新文档内容（用于版本恢复）
        int updateDocContent(@Param("docid") String docid, @Param("content") byte[] content);
}
