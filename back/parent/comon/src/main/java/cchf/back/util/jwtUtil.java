package cchf.back.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Map;


public class jwtUtil {
    public static String createJwt(Map<String, Object> claims, String userSecretKey, long userTtl){
        SignatureAlgorithm signatureAlgorithm = SignatureAlgorithm.HS256;

        long expMillis = System.currentTimeMillis()+userTtl;
        Date exp = new Date(expMillis);

        JwtBuilder builder = Jwts.builder()
                .setClaims(claims)
                .signWith(signatureAlgorithm, userSecretKey.getBytes(StandardCharsets.UTF_8))
                .setExpiration(exp);
        return builder.compact();
    }
    public static Claims parseJwt(String token, String userSecretKey){
        Claims claims = Jwts.parser()
                .setSigningKey(userSecretKey.getBytes(StandardCharsets.UTF_8))
                .parseClaimsJws(token).getBody();
        return claims;
    }

}

