package cchf.back.controller;

import cchf.back.dto.RestoreVersionDto;
import cchf.back.dto.UpdateLabelDto;
import cchf.back.dto.CompareVersionsDto;
import cchf.back.result.result;
import cchf.back.service.VersionService;
import cchf.back.vo.VersionDiffVo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/cch/cch/version")
@Slf4j
public class VersionController {

    @Autowired
    private VersionService versionService;

    /**
     * 获取版本列表
     */
    @GetMapping("/{docid}/list")
    public result<Map<String, Object>> getVersions(
            @PathVariable String docid,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "") String search) {

        log.info("获取文档版本列表: docid={}, page={}, size={}", docid, page, size);

        try {
            Page<Map<String, Object>> versions = versionService.getVersions(docid, page, size, search);

            // 转换为前端期望的格式
            Map<String, Object> response = new HashMap<>();
            response.put("records", versions.getContent());
            response.put("pages", versions.getTotalPages());
            response.put("total", versions.getTotalElements());
            response.put("current", page);
            response.put("size", size);

            return result.success(response);
        } catch (Exception e) {
            log.error("获取版本列表失败", e);
            return result.error("获取版本列表失败: " + e.getMessage());
        }
    }

    /**
     * 获取版本内容
     */
    @GetMapping("/content/{vid}")
    public result<String> getVersionContent(@PathVariable String vid) {
        log.info("获取版本内容: vid={}", vid);

        try {
            String content = versionService.getVersionContent(vid);
            return result.success(content);
        } catch (Exception e) {
            log.error("获取版本内容失败", e);
            return result.error("获取版本内容失败: " + e.getMessage());
        }
    }

    /**
     * 恢复版本
     */
    @PostMapping("/{docid}/restore")
    public result<?> restoreVersion(
            @PathVariable String docid,
            @RequestBody RestoreVersionDto restoreVersionDto) {

        log.info("恢复版本: docid={}, vid={}", docid, restoreVersionDto.getVid());

        try {
            restoreVersionDto.setDocid(docid);
            versionService.restoreVersion(restoreVersionDto);
            return result.success();
        } catch (Exception e) {
            log.error("恢复版本失败", e);
            return result.error("恢复版本失败: " + e.getMessage());
        }
    }

    /**
     * 更新版本标签
     */
    @PostMapping("/label/{vid}")
    public result<?> updateVersionLabel(
            @PathVariable String vid,
            @RequestBody UpdateLabelDto updateLabelDto) {

        log.info("更新版本标签: vid={}, action={}", vid, updateLabelDto.getAction());

        try {
            versionService.updateVersionLabel(vid, updateLabelDto);
            return result.success();
        } catch (Exception e) {
            log.error("更新版本标签失败", e);
            return result.error("更新版本标签失败: " + e.getMessage());
        }
    }

    /**
     * 切换版本锁定状态
     */
    @PostMapping("/lock/{vid}")
    public result<?> toggleVersionLock(@PathVariable String vid) {
        log.info("切换版本锁定状态: vid={}", vid);

        try {
            versionService.toggleVersionLock(vid);
            return result.success();
        } catch (Exception e) {
            log.error("切换版本锁定状态失败", e);
            return result.error("切换版本锁定状态失败: " + e.getMessage());
        }
    }

    /**
     * 版本比较
     */
    @PostMapping("/compare")
    public result<VersionDiffVo> compareVersions(@RequestBody CompareVersionsDto compareVersionsDto) {
        log.info("版本比较: fromVid={}, toVid={}", compareVersionsDto.getFromVid(), compareVersionsDto.getToVid());

        try {
            VersionDiffVo diffVo = versionService.compareVersions(compareVersionsDto);
            return result.success(diffVo);
        } catch (Exception e) {
            log.error("版本比较失败", e);
            return result.error("版本比较失败: " + e.getMessage());
        }
    }

    /**
     * 导出版本
     */
    @GetMapping("/export/{vid}")
    public ResponseEntity<byte[]> exportVersion(
            @PathVariable String vid,
            @RequestParam(defaultValue = "raw") String format) {

        log.info("导出版本: vid={}, format={}", vid, format);

        try {
            byte[] content = versionService.exportVersion(vid, format);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", "version_" + vid + ".txt");

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(content);

        } catch (Exception e) {
            log.error("导出版本失败", e);
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * 删除版本
     */
    @DeleteMapping("/{vid}")
    public result<?> deleteVersion(@PathVariable String vid) {
        log.info("删除版本: vid={}", vid);

        try {
            versionService.deleteVersion(vid);
            return result.success();
        } catch (Exception e) {
            log.error("删除版本失败", e);
            return result.error("删除版本失败: " + e.getMessage());
        }
    }
}