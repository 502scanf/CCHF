package cchf.back.controller;

import cchf.back.constant.MessageConstant;
import cchf.back.dto.DocActiveDto;
import cchf.back.dto.DocBuildDto;
import cchf.back.dto.DocImportDto;
// import cchf.back.dto.DocRenameDto;
import cchf.back.dto.UpdateDocDto;
import cchf.back.entity.DefineDoc;
import cchf.back.exception.RecycleException;
import cchf.back.result.result;
import cchf.back.service.DocService;
import cchf.back.vo.DocBuildVo;
import cchf.back.vo.DocRecycleVo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Base64;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/cch/docplace")
public class docController {

    @Autowired
    private DocService docService;

    // 文件创建
    @PostMapping("/build")
    public result<DocBuildVo> docBuild(@RequestBody DocBuildDto docBuildDto) {

        log.info("build...");
        DefineDoc doc = docService.docBuild(docBuildDto);

        DocBuildVo docBuildVo = DocBuildVo.builder()
                .docname(doc.getDocname())
                .doctype(doc.getDoctype())
                .status(doc.getStatus())
                .createtime(doc.getCreatetime())
                .build();
        return result.success(docBuildVo);
    }

    // 回收文件
    @PostMapping("/recycle")
    public result<DocRecycleVo> docRecycle(@RequestBody DocBuildDto docBuildDto) {
        log.info("recycle...");
        try {
            DocRecycleVo recycleDoc = docService.recycleDoc(docBuildDto);
            return result.success(recycleDoc);
        } catch (Exception e) {
            log.info("回收失败", e.getMessage());
            throw new RecycleException(MessageConstant.RECYCLE_ERROR + ": " + e.getMessage());
        }
    }

    // 查询文件
    @GetMapping("/doc")
    public result<DocBuildVo> getdoc(@RequestBody DocBuildDto docBuildDto) {

        log.info("find...");

        DocBuildVo docBuildVo = docService.getdoc(docBuildDto);

        return result.success(docBuildVo);
    }

    // 查询文件列表
    @GetMapping("/docList/{roomid}")
    public result<List<DocBuildVo>> getDocList(@PathVariable String roomid) {
        log.info("finding...");
        List<DocBuildVo> docList = docService.getDocList(roomid);
        return result.success(docList);
    }

    // 分页查询文件列表
    @GetMapping("/docList/{roomid}/page")
    public result<cchf.back.vo.PageResultVo<DocBuildVo>> getDocListPage(
            @PathVariable String roomid,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        log.info("finding doc list with pagination, roomid: {}, page: {}, pageSize: {}", roomid, page, pageSize);
        cchf.back.vo.PageResultVo<DocBuildVo> pageResult = docService.getDocListPage(roomid, page, pageSize);
        return result.success(pageResult);
    }

    // 保存文档内容（Yjs 二进制，Base64 传输）
    @PostMapping("/saveContent")
    public result<?> saveContent(@RequestBody UpdateDocDto updateDocDto) {
        String docid = updateDocDto.getDocid();
        String base64Content = updateDocDto.getContent();
        String editorId = updateDocDto.getEditorId();

        byte[] content = Base64.getDecoder().decode(base64Content);
        docService.saveContent(docid, content, editorId);

        return result.success();
    }

    // 获取文档内容（返回 Base64）
    @GetMapping("/contentFind/{docid}")
    public result<String> docContent(@PathVariable String docid) {
        byte[] content = docService.getDocContentBytes(docid);
        if (content == null) {
            return result.success(null);
        }
        return result.success(Base64.getEncoder().encodeToString(content));
    }

    // 文档活跃
    @PostMapping("docActive")
    public result<?> docActiveJudge(@RequestBody DocActiveDto docActiveDto) {

        docService.docActiveJudge(docActiveDto);

        return result.success();
    }

    // 恢复回收站文件
    @PostMapping("/restore/{docid}")
    public result<?> restoreDoc(@PathVariable String docid) {
        log.info("restore doc...");
        docService.restoreDoc(docid);
        return result.success();
    }

    // 查询回收站文件列表
    @GetMapping("/recycled/{roomid}")
    public result<List<DocBuildVo>> getRecycledDocs(@PathVariable String roomid) {
        log.info("finding recycled docs...");
        List<DocBuildVo> docList = docService.getRecycledDocs(roomid);
        return result.success(docList);
    }

    // 文件导入
    @PostMapping("/import")
    public result<DocBuildVo> docImport(@RequestBody DocImportDto docImportDto) {
        log.info("importing document: {}", docImportDto.getDocname());

        DefineDoc doc = docService.docImport(docImportDto);

        DocBuildVo docBuildVo = DocBuildVo.builder()
                .docid(doc.getDocid())
                .docname(doc.getDocname())
                .doctype(doc.getDoctype())
                .status(doc.getStatus())
                .createtime(doc.getCreatetime())
                .build();

        return result.success(docBuildVo);
    }

    // 文件重命名 - 暂时注释掉
    /*
     * @PostMapping("/rename")
     * public result<?> renameDoc(@RequestBody DocRenameDto docRenameDto) {
     * log.info("renaming document: {} to {}", docRenameDto.getDocid(),
     * docRenameDto.getNewName());
     * docService.renameDoc(docRenameDto.getDocid(), docRenameDto.getNewName());
     * return result.success();
     * }
     */

    // 文件删除
    @PostMapping("/delete/{docid}")
    public result<?> deleteDoc(@PathVariable String docid) {
        log.info("deleting document: {}", docid);
        docService.deleteDoc(docid);
        return result.success();
    }
}
