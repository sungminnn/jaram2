package jaram.cmm.login;

import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;

import java.util.List;

@Getter
public class User {
    private String email;
    private String pwd;
    @Setter
    private String username;
    private String phone;
    private String sms_yn;
    private String email_yn;
    private String input_dt;
    @Setter
    private List<GrantedAuthority> role;
}