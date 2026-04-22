package jaram.cmm.security;

import jaram.cmm.login.CustomLoginFailureHandler;
import jaram.cmm.login.CustomLoginSuccessHandler;
import jaram.cmm.login.CustomLogoutHandler;
import jaram.cmm.login.LoginAuthenticationProvider;
import jaram.cmm.util.Common;
import jaram.user.service.OAuthLoginService;
import jaram.user.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebSecurity
@AllArgsConstructor
public class SecurityConfig implements WebMvcConfigurer {

    CustomLogoutHandler customLogoutHandler;

    private LoginAuthenticationProvider loginAuthenticationProvider;

    private UserService service;

    private OAuthLoginService oAuthService;

    private CustomLoginSuccessHandler customSuccessHandler;

    private CustomLoginFailureHandler customFailureHandler;

    private Common common;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // -- Static resources
        registry.addResourceHandler("/admin/**", "/member/**").addResourceLocations("classpath:/static/assets");
    }

    @Bean
    @Order(1)
    public SecurityFilterChain exceptionSecurityFilterChain(HttpSecurity http) throws Exception {
        // static 디렉터리의 하위 파일 목록은 인증 무시 ( = 항상통과 )
        http.requestMatchers((matchers) -> matchers.antMatchers("/css/**", "/js/**", "/img/**", "/vendors/**", "/assets/**", "/admin/assets/**", "/member/assets/**", "/error", "/ckeditor/upload/**", "/naver19e061d2550753608d0f8e3152b67371.html", "robots.txt", "sitemap.xml", "favicon.png"
        ))
                .authorizeHttpRequests((authorize) -> authorize.anyRequest().permitAll())
                .requestCache().disable()
                .securityContext().disable()
                .sessionManagement().disable()
                .headers(headers -> headers
                        .cacheControl(HeadersConfigurer.CacheControlConfig::disable)
                )
                /* xss filter **/
                .headers()
                .xssProtection()
                .block(true)
                .and()
                .contentSecurityPolicy("script-src 'self'");

        return http.build();
    }

    @Bean
    @Order(2)
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        // 페이지 권한 설정
        http.authorizeRequests()
                .antMatchers("/admin/**").hasRole("ADMIN") // /admin/*   - 권한 : ADMIN
                .antMatchers("/member/**").hasRole("MEMBER") // /member/*   - 권한 : MEMBER
                .antMatchers("/*").permitAll()             // *          - 권한 : ALL
                .antMatchers("/files/*/*").permitAll()             // *          - 권한 : ALL
                .antMatchers("/").permitAll()             // 메인페이지 - 권한 : ALL
                .anyRequest().authenticated()             // 그 외 인증 필요

                .and()

                // 사이트 위변조 요청 방지
                //.csrf().disable()
                .csrf()
                .ignoringAntMatchers("/common/file/ckeditor5Upload.do")
                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())

                .and()

                // 로그인 설정
                .formLogin()
                .loginProcessingUrl("/login")
                .loginPage("/page-login-alone")               // 로그인페이지
                .failureUrl("/page-login?err")          // 로그인 실패 시
                .defaultSuccessUrl("/")
                .successHandler(customSuccessHandler)    // 성공시 수행할 핸들러
                .failureHandler(customFailureHandler) // 로그인 실패 핸들러
                .permitAll()
                .usernameParameter("email")              // 로그인 폼 파라미터 (default : username)
                .passwordParameter("pwd")                  // 로그인 폼 파라미터 (default : password)
                .and()

                // 로그아웃 설정
                .logout()
                .logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
                .addLogoutHandler(customLogoutHandler)
                .logoutSuccessUrl("/")
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID")
                .permitAll()
                .and()

                .authenticationProvider(loginAuthenticationProvider)

                .oauth2Login()
                .defaultSuccessUrl("/oauth-login")          //  로그인 성공 시 이동
                .permitAll()
                .userInfoEndpoint()                          // oauth2 로그인 성공 후 가져올 때의 설정들
                .userService(oAuthService);           // 소셜로그인 성공 시 후속 조치를 진행할 UserService 인터페이스 구현체 등록


        // 사용자 인증 처리 컴포넌트 서비스 등록
        http.userDetailsService(service);

        // 운영에서만 돌아가도록 설정
        if (("prod").equals(common.getServerMode())) {
            /* http -> https 로 redirect */
            http.requiresChannel()
                .anyRequest()
                .requiresSecure();
        }

        return http.build();
    }

    @Bean
    public PasswordEncoder PasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

}
