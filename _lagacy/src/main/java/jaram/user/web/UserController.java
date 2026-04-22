package jaram.user.web;

import jaram.cmm.login.CustomLogoutHandler;
import jaram.cmm.util.Common;
import jaram.common.service.CommonService;
import jaram.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.HashMap;

/**
 * NOTE : 사용자 컨트롤러
 * DATE : 2023.07.19
 */
@Controller
public class UserController extends Common {

    @Autowired
    UserService userService;

    @Autowired
    CommonService commonService;

    @Autowired
    CustomLogoutHandler logoutHandler;

    /**
     * [모달팝업]로그인 화면 이동
     */
    @RequestMapping(value = "/page-login")
    public ModelAndView goLoginPage(HttpServletRequest request) {
        ModelAndView mav = new ModelAndView();
        // 이전 페이지로 되돌아가기 위한 Referer 헤더값을 세션의 prevPage attribute로 저장
        String uri = request.getHeader("Referer");
        if (uri != null && !uri.contains("login") && uri.contains("/page")) {
            //이전 페이지
            request.getSession().setAttribute("prevPage", uri);
            //로그인 페이지에서 에러가 발생한 경우
            request.getSession().setAttribute("loginPage", null);
        }
        mav.setViewName("/login/page-login");
        return mav;
    }

    /**
     * [단독화면]로그인 화면 이동
     */
    @RequestMapping(value = "/page-login-alone")
    public ModelAndView goLoginPageAlone(HttpServletRequest request) {
        ModelAndView mav = new ModelAndView();
        // 이전 페이지로 되돌아가기 위한 Referer 헤더값을 세션의 prevPage attribute로 저장

        String uri = request.getHeader("Referer");
        if (uri != null && !uri.contains("login")) {
            request.getSession().setAttribute("prevPage", uri);
            request.getSession().setAttribute("loginPage", request.getRequestURI());
        }
        mav.setViewName("/alone/page-login-alone");
        return mav;
    }


    /**
     * 에러난 경우 로그인 모달 재 표시
     */
    @RequestMapping("/page-login-err")
    public ModelAndView pageLoginErr(@RequestParam(value = "error", required = false) String error,
                                     @RequestParam(value = "exception", required = false) String exception, HttpServletRequest request) throws URISyntaxException {
        ModelAndView mav = new ModelAndView();
        try {
            String uri = (String) request.getSession().getAttribute("prevPage");
            String path = "";
            if( uri == null ){
                path = "/";
            }else {
                path = new URI(uri).getPath();
            }
            mav.addObject("error", error);
            mav.addObject("exception", exception);
            if (("/").equals(path) ) {
                path = "/index";
            }
            mav.setViewName(path);
        }catch (Exception e){
            e.printStackTrace();
        }
        return mav;
    }

    /**
     * 회원가입 화면 이동
     */
    @RequestMapping(value = "/page-signup")
    public ModelAndView goSignUpPage() throws Exception {
        ModelAndView mav = new ModelAndView();
        mav.addObject("policy", commonService.selectSitePolicyList());
        mav.setViewName("/alone/page-signup");
        return mav;
    }

    /**
     * 회원가입
     *
     */
    @RequestMapping(value = "/sign-up", method = RequestMethod.POST)
    public ModelAndView signUp(HttpServletRequest req) throws Exception {
        ModelAndView mav = new ModelAndView("redirect:/");
        userService.signUp(getHashMap(req), req);
        return mav;
    }

    /**
     * 이메일/비밀번호 찾기 page1
     */
    @RequestMapping(value = "/page-find-account-1")
    public String goResetPasswordPage() {
        return "/alone/page-find-account-1";
    }


    /**
     * 이메일/비밀번호 찾기 page2
     */
    @RequestMapping(value = "/page-find-account-2")
    public String goResetPasswordPage2() {
        return "/alone/page-find-account-2";
    }

    /**
     * 이메일 중복검사 ajax
     */
    @RequestMapping(value = "/email-dup-check", method = RequestMethod.POST)
    public ModelAndView getEmailDupChk(@RequestParam(required = false) HashMap<String, Object> paramMap) throws Exception {
        ModelAndView mav = new ModelAndView("jsonView");
        HashMap<String, Object> map;
        map = userService.getEmailDupChk(paramMap.get("email").toString());
        mav.addObject("code", map.get("code"));
        mav.addObject("msg", map.get("msg"));
        return mav;
    }

    /**
     * 인증코드 이메일 발송 ajax
     */
    @RequestMapping(value = "/send-cert-email", method = RequestMethod.POST)
    public ModelAndView sendCertEmail(@RequestParam(required = false) HashMap<String, Object> paramMap, HttpServletRequest request) throws Exception {
        ModelAndView mav = new ModelAndView("jsonView");
        HashMap<String, Object> map;
        map = userService.sendCertEmail(paramMap, request);
        mav.addObject("code", map.get("code"));
        mav.addObject("msg", map.get("msg"));
        return mav;
    }

    /**
     * 이메일 인증코드 확인 ajax
     */
    @RequestMapping(value = "/cert-check-email", method = RequestMethod.POST)
    public ModelAndView certCheckEmail(@RequestParam(required = false) HashMap<String, Object> paramMap, HttpServletRequest request) throws Exception {
        ModelAndView mav = new ModelAndView("jsonView");
        HashMap<String, Object> map;
        map = userService.certCheckEmail(paramMap, request);
        mav.addObject("code", map.get("code"));
        mav.addObject("msg", map.get("msg"));
        return mav;
    }

    /**
     * OAUTH 로그인
     */
    @RequestMapping(value = "/oauth-login")
    public ModelAndView oAuthLogin(HttpServletRequest req, HttpServletResponse response) {
        ModelAndView mav = new ModelAndView();
        HashMap<String, Object> resultMap = new HashMap<>();

        try {
            //OAUTH USER 정보
            SecurityContext context = SecurityContextHolder.getContext();

            if (context.getAuthentication().getClass().getName().equals(OAuth2AuthenticationToken.class.getName())) {
                DefaultOAuth2User oAuthUser = (DefaultOAuth2User) context.getAuthentication().getPrincipal();
                resultMap.put("oAuthName", oAuthUser.getAttribute("name"));
                resultMap.put("oAuthEmail", oAuthUser.getAttribute("email"));
                resultMap.put("oAuthMobile", oAuthUser.getAttribute("mobile"));
                resultMap.put("oAuthKey", oAuthUser.getAttribute("oAuthKey"));
                resultMap.put("oAuthType", oAuthUser.getAttribute("oAuthType"));
            }

            //로그아웃
            logoutHandler.logout(req, response, context.getAuthentication());

            //기존/신규 유저 분리
            String resultUrl = userService.oAuthLogin(resultMap, req);

            if (!("redirect:/").equals(resultUrl)) {
                mav.addAllObjects(resultMap);
            }

            SecurityContext context2 = SecurityContextHolder.getContext();

            mav.setViewName(resultUrl);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return mav;
    }

    /**
     * 이메일/비밀번호 찾기 다음
     */
    @RequestMapping(value = "/find-account-1", method = RequestMethod.POST)
    public ModelAndView findAccount1(HttpServletRequest req) throws Exception {
        ModelAndView mav = new ModelAndView("redirect:/");
        HashMap<String, Object> userInfo = userService.findAccount1(getHashMap(req));
        mav.setViewName("/alone/page-find-account-2");
        mav.addAllObjects(userInfo);
        return mav;
    }

    /**
     * 비밀번호 재설정 ajax
     */
    @RequestMapping(value = "/re-save-pwd", method = RequestMethod.POST)
    public ModelAndView reSavePwd(@RequestParam(required = false) HashMap<String, Object> paramMap) throws Exception {
        ModelAndView mav = new ModelAndView("jsonView");
        HashMap<String, Object> map;
        map = userService.reSavePwd(paramMap);
        mav.addObject("code", map.get("code"));
        mav.addObject("msg", map.get("msg"));
        return mav;
    }

}