package jaram.cmm.login;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.WebAttributes;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.stereotype.Component;

@Component
public class CustomLogoutHandler  implements LogoutHandler {

	    @Override
	    public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
	    	SecurityContextLogoutHandler securityContextLogHandler = new SecurityContextLogoutHandler();
	    	if( securityContextLogHandler.isInvalidateHttpSession() ) {
	    		HttpSession session = request.getSession(false);
	    		if( session != null ) {
	    			session.invalidate();
	    		}
	    	}
	    	
	    	SecurityContext context = SecurityContextHolder.getContext();
	    	if( context.getAuthentication() != null ) {
	    		context.setAuthentication(null);
	    	}

	    	SecurityContextHolder.clearContext();
	    }
	}