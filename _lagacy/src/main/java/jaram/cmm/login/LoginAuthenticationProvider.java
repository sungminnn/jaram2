package jaram.cmm.login;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import jaram.cmm.exception.ErrorCode;
import jaram.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;


@Component
public class LoginAuthenticationProvider implements AuthenticationProvider{

	@Autowired
	private UserService userService;
	
	private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

	private ErrorCode messages;

	@Override
	public Authentication authenticate(Authentication authentication) throws AuthenticationException {
		String username  = authentication.getName();
		String password  = authentication.getCredentials().toString();

		Collection<? extends GrantedAuthority> authority;

		CustomUser userDetails = null;

		try {
			//아이디 유무 체크
			userDetails = (CustomUser) userService.loadUserByUsername(username);
			authority = userDetails.getAuthorities();

			//비밀번호 체크
			String passwordFromDb = userDetails.getPassword();
			if (!passwordEncoder.matches(password, passwordFromDb)) {
				throw new BadCredentialsException("등록되지 않은 사용자이거나 비밀번호가 일치하지 않습니다.");
			}
		}catch(UsernameNotFoundException e) {
			e.printStackTrace();
			throw new UsernameNotFoundException(e.getMessage());
		}catch(BadCredentialsException e) {
			e.printStackTrace();
			throw new BadCredentialsException(e.getMessage());
		}catch(Exception e) {
			e.printStackTrace();
			throw new AuthenticationServiceException("시스템에 오류가 발생했습니다.\n관리자에게 문의해 주십시오.");
		}
		// 리턴 : 아이디 / 패스워드 / 권한
		return new UsernamePasswordAuthenticationToken(userDetails, password, authority);
	}

	@Override
	public boolean supports(Class<?> authentication) {
		return UsernamePasswordAuthenticationToken.class.isAssignableFrom(authentication);
	}

	/* 권한 조회 */
	public Collection<? extends GrantedAuthority> getGrantedAuthorities(String username) {
		return userService.loadUserByUsername(username).getAuthorities();
	}
}
