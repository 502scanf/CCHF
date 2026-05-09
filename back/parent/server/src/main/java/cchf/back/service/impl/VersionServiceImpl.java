package cchf.back.service.impl;

import cchf.back.dto.RestoreVersionDto;
import cchf.back.dto.UpdateLabelDto;
import cchf.back.dto.CompareVersionsDto;
import cchf.back.entity.DocVersion;
import cchf.back.mapper.DocVersionMapper;
import cchf.back.mapper.DocMapper;
import cchf.back.service.VersionService;
import cchf.back.vo.VersionDiffVo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@Slf4j
public class VersionServiceImpl implements VersionService {

    @Autowired
    private DocVersionMapper docVersionMapper;

    @Autowired
    private DocMapper docMapper;

    @Override
    public Page<Map<String, Object>> getVersions(String docid, int page, int size, String search) {
        log.info("获取文档版本列表: docid={}, page={}, size={}, search={}", docid, page, size, search);

        try {
            // 计算偏移量
            int offset = (page - 1) * size;

            // 获取版本列表
            List<DocVersion> versions = docVersionMapper.getVersionsByDocIdPaged(docid, search, size, offset);

            // 获取总数
            int total = docVersionMapper.countVersionsByDocId(docid, search);

            // 转换为 Map 格式
            List<Map<String, Object>> versionMaps = new ArrayList<>();
            for (DocVersion version : versions) {
                Map<String, Object> versionMap = new HashMap<>();
                versionMap.put("vid", version.getVid());
                versionMap.put("docid", version.getDocid());
                versionMap.put("snapshotType", version.getSnapshotType());
                versionMap.put("labels", version.getLabels());
                versionMap.put("isLocked", version.getIsLocked());
                versionMap.put("diffStats", version.getDiffStats());
                versionMap.put("fileSize", version.getFileSize());
                versionMap.put("parentVid", version.getParentVid());
                versionMap.put("createdAt", version.getCreatedAt());
                versionMap.put("createdBy", version.getCreatedBy());
                versionMaps.add(versionMap);
            }

            PageRequest pageRequest = PageRequest.of(page - 1, size);
            return new PageImpl<>(versionMaps, pageRequest, total);

        } catch (Exception e) {
            log.error("获取版本列表失败", e);
            throw new RuntimeException("获取版本列表失败: " + e.getMessage());
        }
    }

    @Override
    public String getVersionContent(String vid) {
        log.info("获取版本内容: vid={}", vid);

        try {
            DocVersion version = docVersionMapper.getVersionById(vid);
            if (version == null) {
                throw new RuntimeException("版本不存在: " + vid);
            }

            // 将 byte[] 转换为 Base64 字符串返回
            if (version.getContent() != null) {
                return Base64.getEncoder().encodeToString(version.getContent());
            }
            return null;

        } catch (Exception e) {
            log.error("获取版本内容失败", e);
            throw new RuntimeException("获取版本内容失败: " + e.getMessage());
        }
    }

    @Override
    public void restoreVersion(RestoreVersionDto restoreVersionDto) {
        String docid = restoreVersionDto.getDocid();
        String vid = restoreVersionDto.getVid();

        log.info("========== 开始恢复版本 ==========");
        log.info("请求参数: docid={}, vid={}, reason={}", docid, vid, restoreVersionDto.getReason());

        try {
            // 1. 获取版本内容
            log.info("步骤1: 查询版本记录...");
            DocVersion version = docVersionMapper.getVersionById(vid);

            if (version == null) {
                log.error("版本不存在: vid={}", vid);
                throw new RuntimeException("版本不存在: " + vid);
            }

            log.info("版本记录查询成功: vid={}, docid={}, contentSize={}",
                    version.getVid(),
                    version.getDocid(),
                    version.getContent() != null ? version.getContent().length : 0);

            // 2. 检查版本是否属于该文档
            if (!version.getDocid().equals(docid)) {
                log.error("版本不属于该文档: version.docid={}, request.docid={}", version.getDocid(), docid);
                throw new RuntimeException("版本不属于该文档");
            }

            log.info("步骤2: 版本归属检查通过");

            // 3. 更新文档内容为该版本的内容
            log.info("步骤3: 开始更新文档内容...");
            log.info("准备更新: docid={}, contentSize={}", docid,
                    version.getContent() != null ? version.getContent().length : 0);

            int updateCount = docMapper.updateDocContent(docid, version.getContent());
            log.info("SQL 执行完成，影响行数: {}", updateCount);

            log.info("文档内容更新成功");

            // 4. 通知 WebSocket 服务器清除该文档的缓存
            log.info("步骤4: 通知 WebSocket 服务器清除文档缓存...");
            try {
                notifyWebSocketServerToReload(docid);
                log.info("WebSocket 服务器通知成功");
            } catch (Exception wsError) {
                log.warn("WebSocket 服务器通知失败（非致命错误）: {}", wsError.getMessage());
                // 不抛出异常，因为数据库已经更新成功
            }

            log.info("========== 版本恢复成功 ==========");
            log.info("docid={}, vid={}, reason={}, contentSize={}",
                    docid, vid, restoreVersionDto.getReason(),
                    version.getContent() != null ? version.getContent().length : 0);

        } catch (Exception e) {
            log.error("========== 版本恢复失败 ==========");
            log.error("docid={}, vid={}, error={}", docid, vid, e.getMessage(), e);
            throw new RuntimeException("恢复版本失败: " + e.getMessage());
        }
    }

    /**
     * 通知 WebSocket 服务器重新加载文档
     * 通过 HTTP 请求清除 WebSocket 服务器中的文档缓存
     */
    private void notifyWebSocketServerToReload(String docid) {
        try {
            log.info("通知 WebSocket 服务器清除文档缓存: {}", docid);

            // WebSocket 控制服务器地址
            String wsControlUrl = "http://localhost:1235/clear-cache";

            // 创建 HTTP 客户端
            java.net.http.HttpClient client = java.net.http.HttpClient.newHttpClient();

            // 构建请求体
            String requestBody = String.format("{\"docid\":\"%s\"}", docid);

            // 创建请求
            java.net.http.HttpRequest request = java.net.http.HttpRequest.newBuilder()
                    .uri(java.net.URI.create(wsControlUrl))
                    .header("Content-Type", "application/json")
                    .POST(java.net.http.HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            // 发送请求
            java.net.http.HttpResponse<String> response = client.send(request,
                    java.net.http.HttpResponse.BodyHandlers.ofString());

            log.info("WebSocket 服务器响应: status={}, body={}",
                    response.statusCode(), response.body());

            if (response.statusCode() == 200) {
                log.info("WebSocket 服务器缓存清除成功");
            } else {
                log.warn("WebSocket 服务器缓存清除失败: {}", response.body());
            }
        } catch (Exception e) {
            log.error("通知 WebSocket 服务器失败", e);
            // 不抛出异常，因为这不是致命错误
        }
    }

    @Override
    public void updateVersionLabel(String vid, UpdateLabelDto updateLabelDto) {
        log.info("更新版本标签: vid={}, action={}", vid, updateLabelDto.getAction());

        try {
            DocVersion version = docVersionMapper.getVersionById(vid);
            if (version == null) {
                throw new RuntimeException("版本不存在: " + vid);
            }

            List<String> labels = version.getLabels() != null ? new ArrayList<>(version.getLabels())
                    : new ArrayList<>();

            switch (updateLabelDto.getAction()) {
                case "add":
                    if (!labels.contains(updateLabelDto.getLabel())) {
                        labels.add(updateLabelDto.getLabel());
                    }
                    break;
                case "remove":
                    labels.remove(updateLabelDto.getLabel());
                    break;
                case "update":
                    if (updateLabelDto.getLabelIndex() != null &&
                            updateLabelDto.getLabelIndex() >= 0 &&
                            updateLabelDto.getLabelIndex() < labels.size()) {
                        labels.set(updateLabelDto.getLabelIndex(), updateLabelDto.getLabel());
                    }
                    break;
            }

            docVersionMapper.updateVersionLabels(vid, labels);

        } catch (Exception e) {
            log.error("更新版本标签失败", e);
            throw new RuntimeException("更新版本标签失败: " + e.getMessage());
        }
    }

    @Override
    public void toggleVersionLock(String vid) {
        log.info("切换版本锁定状态: vid={}", vid);

        try {
            DocVersion version = docVersionMapper.getVersionById(vid);
            if (version == null) {
                throw new RuntimeException("版本不存在: " + vid);
            }

            boolean newLockStatus = !version.getIsLocked();
            docVersionMapper.updateVersionLock(vid, newLockStatus);

            log.info("版本锁定状态已更新: vid={}, locked={}", vid, newLockStatus);

        } catch (Exception e) {
            log.error("切换版本锁定状态失败", e);
            throw new RuntimeException("切换版本锁定状态失败: " + e.getMessage());
        }
    }

    @Override
    public VersionDiffVo compareVersions(CompareVersionsDto compareVersionsDto) {
        log.info("版本比较: fromVid={}, toVid={}", compareVersionsDto.getFromVid(), compareVersionsDto.getToVid());

        try {
            // 获取两个版本的内容
            DocVersion fromVersion = docVersionMapper.getVersionById(compareVersionsDto.getFromVid());
            DocVersion toVersion = docVersionMapper.getVersionById(compareVersionsDto.getToVid());

            if (fromVersion == null || toVersion == null) {
                throw new RuntimeException("版本不存在");
            }

            // 简单的文本比较实现
            String fromContent = fromVersion.getContent() != null ? new String(fromVersion.getContent()) : "";
            String toContent = toVersion.getContent() != null ? new String(toVersion.getContent()) : "";

            VersionDiffVo diffVo = new VersionDiffVo();
            diffVo.setFromVid(compareVersionsDto.getFromVid());
            diffVo.setToVid(compareVersionsDto.getToVid());
            diffVo.setFromContent(fromContent);
            diffVo.setToContent(toContent);

            // 简单的差异统计
            List<VersionDiffVo.DiffBlock> diffBlocks = new ArrayList<>();
            if (!fromContent.equals(toContent)) {
                VersionDiffVo.DiffBlock diffBlock = new VersionDiffVo.DiffBlock();
                diffBlock.setType("modified");
                diffBlock.setFromStart(0);
                diffBlock.setFromEnd(fromContent.length());
                diffBlock.setToStart(0);
                diffBlock.setToEnd(toContent.length());
                diffBlock.setContent(toContent);
                diffBlocks.add(diffBlock);
            }

            diffVo.setDiffBlocks(diffBlocks);
            return diffVo;

        } catch (Exception e) {
            log.error("版本比较失败", e);
            throw new RuntimeException("版本比较失败: " + e.getMessage());
        }
    }

    @Override
    public byte[] exportVersion(String vid, String format) {
        log.info("导出版本: vid={}, format={}", vid, format);

        try {
            DocVersion version = docVersionMapper.getVersionById(vid);
            if (version == null) {
                throw new RuntimeException("版本不存在: " + vid);
            }

            // 目前只支持原始格式导出
            return version.getContent();

        } catch (Exception e) {
            log.error("导出版本失败", e);
            throw new RuntimeException("导出版本失败: " + e.getMessage());
        }
    }

    @Override
    public void deleteVersion(String vid) {
        log.info("删除版本: vid={}", vid);

        try {
            DocVersion version = docVersionMapper.getVersionById(vid);
            if (version == null) {
                throw new RuntimeException("版本不存在: " + vid);
            }

            if (version.getIsLocked()) {
                throw new RuntimeException("无法删除已锁定的版本");
            }

            docVersionMapper.deleteVersion(vid);
            log.info("版本删除成功: vid={}", vid);

        } catch (Exception e) {
            log.error("删除版本失败", e);
            throw new RuntimeException("删除版本失败: " + e.getMessage());
        }
    }
}