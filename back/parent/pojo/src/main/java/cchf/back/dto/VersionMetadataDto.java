package cchf.back.dto;

import cchf.back.entity.DocVersion;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class VersionMetadataDto {
    private Integer vid;
    private String docid;
    private String editor;
    private Timestamp createtime;
    private String snapshotType;
    private List<String> labels;
    private Boolean isLocked;
    private Long fileSize;
    private DocVersion.DiffStats diffStats;
}