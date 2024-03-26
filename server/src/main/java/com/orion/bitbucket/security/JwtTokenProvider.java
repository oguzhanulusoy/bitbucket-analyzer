package com.orion.bitbucket.security;

import io.jsonwebtoken.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtTokenProvider {

    @Value("${lab.app.secret}")
    private String APP_SECRET;

    @Value("${lab.expires.in}")
    private long EXPIRES_IN;

    public String generateJwtToken(Authentication auth) {
        JwtUserDetails userDetails = (JwtUserDetails) auth.getPrincipal();
        Date expiredDate = new Date(System.currentTimeMillis()+ EXPIRES_IN);
        return Jwts.builder()
            .claim("userId", userDetails.getId())
            .claim("email", userDetails.getEmail())
            .claim("username", userDetails.getUsername())
            .claim("role", userDetails.getUserRole())
            .setIssuedAt(new Date()).setExpiration(expiredDate)
            .signWith(SignatureAlgorithm.HS512, APP_SECRET).compact();
    }

    public Long getUserIdFromJwt(String token) {
        Claims claims = Jwts.parser().setSigningKey(APP_SECRET).parseClaimsJws(token).getBody();
        return claims.get("userId", Long.class);
    }

    boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(APP_SECRET).parseClaimsJws(token);
            return !isTokenExpired(token);
        } catch (SignatureException e) {
            return false;
        } catch (MalformedJwtException e) {
            return false;
        } catch (ExpiredJwtException e) {
            return false;
        } catch (UnsupportedJwtException e) {
            return false;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }

    public GrantedAuthority getRoleFromToken(String token) {
        Claims claims = Jwts.parser().setSigningKey(APP_SECRET).parseClaimsJws(token).getBody();
        GrantedAuthority role = null;

        String userRole = claims.get("role", String.class);
        Boolean isAdmin = userRole.equals("SUPER_USER");

        if (isAdmin != null && isAdmin) {
            role = new SimpleGrantedAuthority("SUPER_USER");
        } else {
            role = new SimpleGrantedAuthority("USER");
        }
        
        return role;
    }

    private boolean isTokenExpired(String token) {
        Date expiration = Jwts.parser().setSigningKey(APP_SECRET).parseClaimsJws(token).getBody().getExpiration();
        return expiration.before(new Date());
    }
}