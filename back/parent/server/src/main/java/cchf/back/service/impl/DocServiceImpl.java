package cchf.back.service.impl;

import cchf.back.constant.MessageConstant;
import cchf.back.dto.DocBuildDto;
import cchf.back.entity.DefineDoc;
import cchf.back.exception.DocExistException;
import cchf.back.mapper.DocMapper;
import cchf.back.service.DocService;
import cchf.back.util.uIdCreate;
import cchf.back.vo.DocBuildVo;
import cchf.back.vo.DocRecycleVo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;

@Service
@Slf4j
public class DocServiceImpl implements DocService {

    @Autowired
    private DocMapper docMapper;
    @Override
    public DefineDoc docBuild(DocBuildDto docBuildDto) {

        log.info("only test...");

        DocBuildVo docBuildVo = docMapper.getdoc(docBuildDto);

        if(docBuildVo != null){
            throw new DocExistException(MessageConstant.DOC_EXISTS);
        }
        DefineDoc defineDoc = DefineDoc.builder()
                .docid(uIdCreate.generateId())
                .docname(docBuildDto.getDocname())
                .doctype(docBuildDto.getDoctype())
                .docroomid(docBuildDto.getDocroomid())
                .time(new Timestamp(System.currentTimeMillis()))
                .status(0)
                .build();

        docMapper.docBuild(defineDoc);
        return defineDoc;
    }

    @Override
    public DocRecycleVo recycleDoc(DocBuildDto docBuildDto){

         docMapper.recycleDoc(docBuildDto);
        DocRecycleVo docRecycleVo = DocRecycleVo.builder()
                .docname(docBuildDto.getDocname())
                .doctype(docBuildDto.getDoctype())
                .build();
        return docRecycleVo;
    }

    @Override
    public DocBuildVo getdoc(DocBuildDto docBuildDto) {

        DocBuildVo docBuildVo = docMapper.getdoc(docBuildDto);

        if (docBuildVo == null){
            throw new DocExistException(MessageConstant.DOC_NO_EXISTS);
        }
        return docBuildVo;
    }

    @Override
    public List<DocBuildVo> getDocList(String roomid) {

        List<DocBuildVo> docList = docMapper.getDocList(roomid);

        if (docList.isEmpty()){
            throw  new DocExistException(MessageConstant.DOC_NUMBER_NULL);
        }
        return null;
    }
}
