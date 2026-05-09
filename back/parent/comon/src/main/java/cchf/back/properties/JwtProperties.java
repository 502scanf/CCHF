package cchf.back.properties;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@Data
@ConfigurationProperties(prefix = "cchf.jwt")
public class JwtProperties {
    private String userSecretKey;
    private long userTtl;
    private String userToken;

    private String roomSecretKey;
    private long roomTtl;
    private String roomToken;
    private long inviteTtl;

}
