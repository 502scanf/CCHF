package cchf.back.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class VersionOperation {
    private Integer id;
    private Integer vid;
    private String docid;
    private OperationType operationType;
    private String operatorId;
    private Map<String, Object> operationData;
    private Timestamp createdAt;
    
    public enum OperationType {
        CREATE("create"),
        RESTORE("restore"),
        LABEL("label"),
        LOCK("lock"),
        UNLOCK("unlock"),
        EXPORT("export"),
        DELETE("delete");
        
        private final String value;
        
        OperationType(String value) {
            this.value = value;
        }
        
        public String getValue() {
            return value;
        }
        
        public static OperationType fromValue(String value) {
            for (OperationType type : OperationType.values()) {
                if (type.value.equals(value)) {
                    return type;
                }
            }
            throw new IllegalArgumentException("Unknown operation type: " + value);
        }
    }
}