package cchf.back.service;

import cchf.back.entity.DocVersion;
import cchf.back.mapper.DocVersionMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;

@Service
@Slf4j
public class SmartSnapshotStrategy {

    @Autowired
    private DocVersionMapper docVersionMapper;

    // 配置参数
    @Value("${version.strategy.change-threshold:0.3}")
    private double changeThreshold;

    @Value("${version.strategy.merge-window-minutes:5}")
    private int mergeWindowMinutes;

    @Value("${version.strategy.max-versions:100}")
    private int maxVersions;

    /**
     * 处理新版本创建
     */
    public void processNewVersion(String docid, byte[] content, String editorId) {
        try {
            log.debug("处理文档版本快照: docid={}, editor={}", docid, editorId);

            // 1. 获取最新版本
            DocVersion latestVersion = docVersionMapper.getLatestVersionByDocId(docid);

            // 2. 判断是否需要创建新版本
            boolean shouldCreateVersion = shouldCreateNewVersion(latestVersion, content);

            if (shouldCreateVersion) {
                // 3. 确定快照类型
                String snapshotType = determineSnapshotType(latestVersion, content);

                // 4. 检查是否需要合并到时间窗口内的版本
                if (shouldMergeWithRecentVersion(docid, snapshotType)) {
                    mergeWithRecentVersion(docid, content, editorId);
                } else {
                    // 5. 创建新版本
                    createNewVersion(docid, content, editorId, snapshotType, latestVersion);
                }

                // 6. 清理旧版本
                cleanupOldVersions(docid);
            }

        } catch (Exception e) {
            log.error("处理版本快照失败: docid={}", docid, e);
            // 不抛出异常，避免影响文档保存
        }
    }

    /**
     * 判断是否需要创建新版本
     */
    private boolean shouldCreateNewVersion(DocVersion latestVersion, byte[] newContent) {
        if (latestVersion == null) {
            return true; // 第一个版本
        }

        // 内容完全相同则不创建
        if (latestVersion.getContent() != null &&
                java.util.Arrays.equals(latestVersion.getContent(), newContent)) {
            return false;
        }

        return true;
    }

    /**
     * 确定快照类型
     */
    private String determineSnapshotType(DocVersion latestVersion, byte[] newContent) {
        if (latestVersion == null) {
            return "auto_milestone"; // 第一个版本作为里程碑
        }

        // 计算变化程度
        double changeRatio = calculateChangeRatio(latestVersion.getContent(), newContent);

        if (changeRatio >= changeThreshold) {
            return "auto_milestone";
        } else {
            return "auto_save";
        }
    }

    /**
     * 计算内容变化比例
     */
    private double calculateChangeRatio(byte[] oldContent, byte[] newContent) {
        if (oldContent == null || oldContent.length == 0) {
            return 1.0; // 完全变化
        }

        if (newContent == null || newContent.length == 0) {
            return 1.0; // 完全变化
        }

        // 简单的长度差异比较
        int oldLength = oldContent.length;
        int newLength = newContent.length;
        int maxLength = Math.max(oldLength, newLength);
        int lengthDiff = Math.abs(oldLength - newLength);

        return (double) lengthDiff / maxLength;
    }

    /**
     * 检查是否应该合并到最近的版本
     */
    private boolean shouldMergeWithRecentVersion(String docid, String snapshotType) {
        if (!"auto_save".equals(snapshotType)) {
            return false; // 只有自动保存才考虑合并
        }

        try {
            // 获取时间窗口内的最新版本
            Timestamp windowStart = new Timestamp(System.currentTimeMillis() - mergeWindowMinutes * 60 * 1000L);
            DocVersion recentVersion = docVersionMapper.getRecentVersionInWindow(docid, windowStart);

            return recentVersion != null && "auto_save".equals(recentVersion.getSnapshotType());
        } catch (Exception e) {
            log.warn("检查合并条件失败", e);
            return false;
        }
    }

    /**
     * 合并到最近的版本
     */
    private void mergeWithRecentVersion(String docid, byte[] content, String editorId) {
        try {
            Timestamp windowStart = new Timestamp(System.currentTimeMillis() - mergeWindowMinutes * 60 * 1000L);
            DocVersion recentVersion = docVersionMapper.getRecentVersionInWindow(docid, windowStart);

            if (recentVersion != null) {
                // 更新现有版本的内容和时间
                docVersionMapper.updateVersionContent(recentVersion.getVid(), content,
                        new Timestamp(System.currentTimeMillis()));
                log.debug("合并到现有版本: vid={}", recentVersion.getVid());
            }
        } catch (Exception e) {
            log.error("合并版本失败", e);
            // 失败时创建新版本
            createNewVersion(docid, content, editorId, "auto_save", null);
        }
    }

    /**
     * 创建新版本
     */
    private void createNewVersion(String docid, byte[] content, String editorId, String snapshotType,
            DocVersion parentVersion) {
        try {
            String vid = generateVersionId();
            Timestamp now = new Timestamp(System.currentTimeMillis());

            DocVersion newVersion = new DocVersion();
            newVersion.setVid(vid);
            newVersion.setDocid(docid);
            newVersion.setContent(content);
            newVersion.setEditor(editorId); // 设置编辑者
            newVersion.setCreatetime(now);
            newVersion.setSnapshotType(snapshotType);
            newVersion.setFileSize(content != null ? (long) content.length : 0L);
            newVersion.setParentVid(parentVersion != null ? parentVersion.getVid() : null);
            newVersion.setCreatedAt(now);
            newVersion.setCreatedBy(editorId);
            newVersion.setIsLocked(false);

            docVersionMapper.insertVersionObject(newVersion);
            log.info("创建新版本快照: vid={}, type={}, docid={}", vid, snapshotType, docid);

        } catch (Exception e) {
            log.error("创建版本失败", e);
        }
    }

    /**
     * 清理旧版本
     */
    private void cleanupOldVersions(String docid) {
        try {
            int currentCount = docVersionMapper.countVersionsByDocId(docid, "");

            if (currentCount > maxVersions) {
                int toDelete = currentCount - maxVersions;
                List<String> oldVersionIds = docVersionMapper.getOldestVersionIds(docid, toDelete);

                for (String vid : oldVersionIds) {
                    DocVersion version = docVersionMapper.getVersionById(vid);
                    if (version != null && !version.getIsLocked()) {
                        docVersionMapper.deleteVersion(vid);
                        log.debug("清理旧版本: vid={}", vid);
                    }
                }
            }
        } catch (Exception e) {
            log.error("清理旧版本失败", e);
        }
    }

    /**
     * 生成版本ID
     */
    private String generateVersionId() {
        return "v_" + System.currentTimeMillis() + "_" + (int) (Math.random() * 1000);
    }
}