package cchf.back.service;

import cchf.back.dto.DocBuildDto;
import cchf.back.entity.DefineDoc;
import cchf.back.vo.DocBuildVo;
import cchf.back.vo.DocRecycleVo;

import java.util.List;

public interface DocService {
    DefineDoc docBuild(DocBuildDto docBuildDto);
    
    DocRecycleVo recycleDoc(DocBuildDto docBuildDto);

    DocBuildVo getdoc(DocBuildDto docBuildDto);

    List<DocBuildVo> getDocList(String roomid);
}
