package cchf.back.service;

import cchf.back.dto.RestoreVersionDto;
import cchf.back.dto.UpdateLabelDto;
import cchf.back.dto.CompareVersionsDto;
import cchf.back.vo.VersionDiffVo;
import org.springframework.data.domain.Page;

import java.util.Map;

public interface VersionService {

    /**
     * 获取文档版本列表（分页）
     */
    Page<Map<String, Object>> getVersions(String docid, int page, int size, String search);

    /**
     * 获取版本内容
     */
    String getVersionContent(String vid);

    /**
     * 恢复版本
     */
    void restoreVersion(RestoreVersionDto restoreVersionDto);

    /**
     * 更新版本标签
     */
    void updateVersionLabel(String vid, UpdateLabelDto updateLabelDto);

    /**
     * 切换版本锁定状态
     */
    void toggleVersionLock(String vid);

    /**
     * 版本比较
     */
    VersionDiffVo compareVersions(CompareVersionsDto compareVersionsDto);

    /**
     * 导出版本
     */
    byte[] exportVersion(String vid, String format);

    /**
     * 删除版本
     */
    void deleteVersion(String vid);
}