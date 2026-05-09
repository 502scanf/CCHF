package cchf.back.service;

import cchf.back.dto.DocActiveDto;
import cchf.back.dto.DocBuildDto;
import cchf.back.dto.DocImportDto;
import cchf.back.entity.DefineDoc;
import cchf.back.vo.DocBuildVo;
import cchf.back.vo.DocRecycleVo;
import cchf.back.vo.PageResultVo;

import java.util.List;

public interface DocService {
    DefineDoc docBuild(DocBuildDto docBuildDto);

    DocRecycleVo recycleDoc(DocBuildDto docBuildDto);

    DocBuildVo getdoc(DocBuildDto docBuildDto);

    List<DocBuildVo> getDocList(String roomid);

    PageResultVo<DocBuildVo> getDocListPage(String roomid, Integer page, Integer pageSize);

    DefineDoc docContent(String docid);

    void docActiveJudge(DocActiveDto docActiveDto);

    void saveContent(String docid, byte[] content, String editorId);

    byte[] getDocContentBytes(String docid);

    void restoreDoc(String docid);

    List<DocBuildVo> getRecycledDocs(String roomid);

    DefineDoc docImport(DocImportDto docImportDto);

    void renameDoc(String docid, String newName);

    void deleteDoc(String docid);
}
