package cchf.back.vo;

import cchf.back.dto.VersionMetadataDto;
import cchf.back.entity.DocVersion;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class VersionDiffVo {
    private String fromVid;
    private String toVid;
    private String fromContent;
    private String toContent;
    private VersionMetadataDto fromVersion;
    private VersionMetadataDto toVersion;
    private List<DiffBlock> diffBlocks;
    private DocVersion.DiffStats stats;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class DiffBlock {
        private String type; // "added", "deleted", "modified", "unchanged"
        private String content;
        private int lineNumber;
        private int fromStart;
        private int fromEnd;
        private int toStart;
        private int toEnd;
    }
}