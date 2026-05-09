package cchf.back.entity;

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
public class DocVersion {
    private String vid; // 改为 String 类型
    private String docid;
    private byte[] content;
    private String editor;
    private Timestamp createtime;

    // 新增字段
    private String snapshotType; // 暂时使用 String 类型，避免 TypeHandler 问题
    private List<String> labels;
    private Boolean isLocked;
    private DiffStats diffStats;
    private Long fileSize;
    private String parentVid; // 改为 String 类型

    // 新增字段
    private Timestamp createdAt;
    private String createdBy;

    public enum SnapshotType {
        AUTO_SAVE("auto_save"),
        AUTO_MILESTONE("auto_milestone");

        private final String value;

        SnapshotType(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }

        public static SnapshotType fromValue(String value) {
            for (SnapshotType type : SnapshotType.values()) {
                if (type.value.equals(value)) {
                    return type;
                }
            }
            throw new IllegalArgumentException("Unknown snapshot type: " + value);
        }
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class DiffStats {
        private int additions;
        private int deletions;
        private int modifications;
    }
}
