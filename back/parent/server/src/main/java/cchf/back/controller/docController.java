package cchf.back.controller;

import cchf.back.constant.MessageConstant;
import cchf.back.dto.DocBuildDto;
import cchf.back.entity.DefineDoc;
import cchf.back.exception.RecycleException;
import cchf.back.result.result;
import cchf.back.service.DocService;
import cchf.back.vo.DocBuildVo;
import cchf.back.vo.DocRecycleVo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@Slf4j
@RestController
@RequestMapping("/cch/docplace")
public class docController {

    @Autowired
    private DocService docService;
    //文件创建
    @PostMapping("/build")
    public result<DocBuildVo> docBuild(@RequestBody DocBuildDto docBuildDto){

        log.info("build...");
        DefineDoc doc = docService.docBuild(docBuildDto);

        DocBuildVo docBuildVo = DocBuildVo.builder()
                .docname(doc.getDocname())
                .doctype(doc.getDoctype())
                .status(doc.getStatus())
                .time(doc.getTime())
                .build();
        return result.success(docBuildVo);
    }
    //回收文件
    @PostMapping("/recycle")
    public result<DocRecycleVo> docRecycle(@RequestBody DocBuildDto docBuildDto){
        log.info("recycle...");
        try{
            DocRecycleVo recycleDoc = docService.recycleDoc(docBuildDto);
            return result.success(recycleDoc);
        }catch (Exception e) {
            log.info("回收失败", e.getMessage());
            throw new RecycleException(MessageConstant.RECYCLE_ERROR+": "+e.getMessage());
        }
    }
    //查询文件
    @GetMapping("/doc")
    public result<DocBuildVo> getdoc(@RequestBody DocBuildDto docBuildDto){

        log.info("find...");

        DocBuildVo docBuildVo = docService.getdoc(docBuildDto);

        return result.success(docBuildVo);
    }
    //查询文件列表
    @GetMapping("/docList/{roomid}")
    public result<List<DocBuildVo>> getDocList(@PathVariable String roomid){
        log.info("finding...");
        List<DocBuildVo> docList = docService.getDocList(roomid);
        return result.success(docList);
    }
}
