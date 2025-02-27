package cchf.back.mapper;

import cchf.back.dto.DocBuildDto;
import cchf.back.entity.DefineDoc;
import cchf.back.vo.DocBuildVo;
import cchf.back.vo.DocRecycleVo;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface DocMapper {
    void docBuild(DefineDoc defineDoc);

    DocBuildVo getdoc(DocBuildDto docBuildDto);

    void recycleDoc(DocBuildDto docBuildDto);

    List<DocBuildVo> getDocList(String roomid);
}
