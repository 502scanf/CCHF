package cchf.back.service.impl;

import cchf.back.constant.BaseContext;
import cchf.back.constant.MessageConstant;
import cchf.back.dto.DocActiveDto;
import cchf.back.dto.DocBuildDto;
import cchf.back.dto.DocImportDto;
import cchf.back.entity.DefineDoc;
import cchf.back.entity.User;
import cchf.back.exception.DocExistException;
import cchf.back.mapper.DocMapper;
import cchf.back.mapper.DocVersionMapper;
import cchf.back.mapper.UserMapper;
import cchf.back.service.DocService;
import cchf.back.service.SmartSnapshotStrategy;
import cchf.back.util.uIdCreate;
import cchf.back.vo.DocBuildVo;
import cchf.back.vo.DocRecycleVo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import static cchf.back.constant.RedisContext.*;
import java.sql.Timestamp;
import java.util.List;

@Service
@Slf4j
public class DocServiceImpl implements DocService {

    @Autowired
    private DocMapper docMapper;
    @Autowired
    private DocVersionMapper docVersionMapper;
    @Autowired
    private StringRedisTemplate srt;
    @Autowired
    private SmartSnapshotStrategy smartSnapshotStrategy;
    @Autowired
    private UserMapper userMapper;

    @Override
    public DefineDoc docBuild(DocBuildDto docBuildDto) {

        log.info("only test...");

        DocBuildVo docBuildVo = docMapper.getdoc(docBuildDto);

        if (docBuildVo != null) {
            throw new DocExistException(MessageConstant.DOC_EXISTS);
        }
        DefineDoc defineDoc = DefineDoc.builder()
                .docid(uIdCreate.generateId())
                .docname(docBuildDto.getDocname())
                .doctype("txt")
                .docroomid(docBuildDto.getDocroomid())
                .createtime(new Timestamp(System.currentTimeMillis()))
                .owner(BaseContext.getCurrentId())
                .updatetime(new Timestamp(System.currentTimeMillis()))
                .status(0)
                .build();

        docMapper.docBuild(defineDoc);
        return defineDoc;
    }

    @Override
    public DocRecycleVo recycleDoc(DocBuildDto docBuildDto) {

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

        if (docBuildVo == null) {
            throw new DocExistException(MessageConstant.DOC_NO_EXISTS);
        }
        return docBuildVo;
    }

    @Override
    public List<DocBuildVo> getDocList(String roomid) {
        return docMapper.getDocList(roomid);
    }

    @Override
    public cchf.back.vo.PageResultVo<DocBuildVo> getDocListPage(String roomid, Integer page, Integer pageSize) {
        int offset = (page - 1) * pageSize;
        Long total = docMapper.countDocList(roomid);
        List<DocBuildVo> records = docMapper.getDocListPage(roomid, offset, pageSize);
        int totalPages = (int) Math.ceil((double) total / pageSize);

        return cchf.back.vo.PageResultVo.<DocBuildVo>builder()
                .total(total)
                .records(records)
                .page(page)
                .pageSize(pageSize)
                .totalPages(totalPages)
                .build();
    }

    @Override
    public DefineDoc docContent(String docid) {
        DefineDoc doc = docMapper.getdocById(docid);
        if (doc == null) {
            throw new DocExistException(MessageConstant.DOC_NO_EXISTS);
        }
        return doc;
    }

    @Override
    public void docActiveJudge(DocActiveDto docActiveDto) {

        if (docActiveDto.getActiveAction() == '+') {
            srt.opsForHash().put("ActiveStatus",
                    "name",
                    docActiveDto.getNumber());
        } else if (docActiveDto.getActiveAction() == '-') {

        }
    }

    @Override
    public void saveContent(String docid, byte[] content, String editorId) {
        // 1. Redis 节流：太频繁就跳过
        String lastTime = srt.opsForValue().get("doc:save:" + docid);
        if (lastTime != null &&
                System.currentTimeMillis() - Long.valueOf(lastTime) < UPDATE_OUT_TIME) {
            return;
        }

        Timestamp time = new Timestamp(System.currentTimeMillis());

        // 获取编辑者的用户ID
        String ownerId = null;
        try {
            User editor = userMapper.getByName(editorId);
            if (editor != null) {
                ownerId = editor.getUid();
            }
        } catch (Exception e) {
            log.warn("获取用户ID失败，使用当前上下文ID: {}", e.getMessage());
            ownerId = BaseContext.getCurrentId();
        }

        // 如果还是获取不到，使用当前上下文ID
        if (ownerId == null) {
            ownerId = BaseContext.getCurrentId();
        }

        // 2. 保存到 doc 表（最新内容）
        docMapper.updateDoc(docid, time, ownerId, content);

        // 3. 使用智能快照策略保存版本
        smartSnapshotStrategy.processNewVersion(docid, content, editorId);

        // 4. 更新 Redis 时间戳
        srt.opsForValue().set("doc:save:" + docid,
                String.valueOf(System.currentTimeMillis()));

        log.info("文档 {} 内容已保存并创建版本快照，更新人: {}", docid, editorId);
    }

    @Override
    public byte[] getDocContentBytes(String docid) {
        DefineDoc doc = docMapper.getdocById(docid);
        if (doc == null)
            return null;
        return doc.getContent();
    }

    @Override
    public void restoreDoc(String docid) {
        docMapper.restoreDoc(docid);
    }

    @Override
    public List<DocBuildVo> getRecycledDocs(String roomid) {
        return docMapper.getRecycledDocs(roomid);
    }

    @Override
    public DefineDoc docImport(DocImportDto docImportDto) {
        log.info("importing document...");

        // 检查文档是否已存在
        DocBuildDto checkDto = new DocBuildDto();
        checkDto.setDocname(docImportDto.getDocname());
        checkDto.setDocroomid(docImportDto.getDocroomid());
        DocBuildVo existingDoc = docMapper.getdoc(checkDto);

        if (existingDoc != null) {
            throw new DocExistException(MessageConstant.DOC_EXISTS);
        }

        // 创建新文档
        DefineDoc defineDoc = DefineDoc.builder()
                .docid(uIdCreate.generateId())
                .docname(docImportDto.getDocname())
                .doctype(docImportDto.getDoctype() != null ? docImportDto.getDoctype() : "txt")
                .docroomid(docImportDto.getDocroomid())
                .createtime(new Timestamp(System.currentTimeMillis()))
                .owner(BaseContext.getCurrentId())
                .updatetime(new Timestamp(System.currentTimeMillis()))
                .status(0)
                .content(docImportDto.getContent() != null ? docImportDto.getContent().getBytes() : null)
                .build();

        docMapper.docBuild(defineDoc);

        // 如果有内容，创建初始版本快照
        if (docImportDto.getContent() != null && !docImportDto.getContent().isEmpty()) {
            docVersionMapper.insertVersion(
                    defineDoc.getDocid(),
                    docImportDto.getContent().getBytes(),
                    BaseContext.getCurrentId().toString());
        }

        log.info("文档导入成功: {}", defineDoc.getDocid());
        return defineDoc;
    }

    @Override
    public void renameDoc(String docid, String newName) {
        log.info("重命名文档: {} -> {}", docid, newName);

        // 检查文档是否存在
        DefineDoc doc = docMapper.getdocById(docid);
        if (doc == null) {
            throw new DocExistException(MessageConstant.DOC_NO_EXISTS);
        }

        // 执行重命名
        docMapper.renameDoc(docid, newName);
        log.info("文档重命名成功: {}", docid);
    }

    @Override
    public void deleteDoc(String docid) {
        log.info("删除文档及其关联数据: {}", docid);

        // 检查文档是否存在
        DefineDoc doc = docMapper.getdocById(docid);
        if (doc == null) {
            throw new DocExistException(MessageConstant.DOC_NO_EXISTS);
        }

        // 先删除文档版本记录
        docVersionMapper.deleteVersionsByDocId(docid);
        log.info("已删除文档版本记录: {}", docid);

        // 再删除文档本身
        docMapper.deleteDocAndVersions(docid);
        log.info("文档删除成功: {}", docid);
    }
}
