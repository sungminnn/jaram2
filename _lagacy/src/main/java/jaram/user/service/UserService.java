package jaram.user.service;


import com.nhncorp.lucy.security.xss.XssPreventer;
import jaram.cmm.login.CustomUser;
import jaram.cmm.login.User;
import jaram.cmm.util.Common;
import jaram.cmm.util.Constants;
import jaram.common.service.CommonService;
import jaram.user.mapper.UserMapper;
import net.nurigo.sdk.NurigoApp;
import net.nurigo.sdk.message.model.Message;
import net.nurigo.sdk.message.request.SingleMessageSendingRequest;
import net.nurigo.sdk.message.response.SingleMessageSentResponse;
import net.nurigo.sdk.message.service.DefaultMessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;

@Service
@Transactional
public class UserService implements UserDetailsService {

    @Autowired
    private CommonService commonService;

    private final UserMapper userMapper;

    public UserService(UserMapper userMapper) {
        this.userMapper = userMapper;
        this.messageService = NurigoApp.INSTANCE.initialize("NCSHZDVULPIZ57YC", "4BGEGM8T3BP8OVCKPTOEUZEOGFWGCLVM", "https://api.coolsms.co.kr");
    }

    private final DefaultMessageService messageService;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    /**
     * 로그인 사용자 정보 조회 및 권한부여
     */
    public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {
        List<GrantedAuthority> authorities = new ArrayList<>();
        User user = new User();
        CustomUser customUser;
        try {
            // 권한부여
            if (("k0421jm@naver.com").equals(userId) || ("io1027@naver.com").equals(userId)) {
                authorities.add(new SimpleGrantedAuthority(Constants.ADMIN));
                authorities.add(new SimpleGrantedAuthority(Constants.MEMBER));
            } else {
                authorities.add(new SimpleGrantedAuthority(Constants.MEMBER));
            }

            // 계정유무
            HashMap<String, Object> param = new HashMap<>();
            param.put("email", userId);
            user = userMapper.getLoginUserInfo(param);
            user.setUsername(XssPreventer.unescape(user.getUsername()));

            if (user == null) {
                throw new UsernameNotFoundException(userId);
            }
            //권한 추가
            user.setRole(authorities);
            customUser = new CustomUser(user);
        } catch (Exception e) {
            throw new UsernameNotFoundException("등록되지 않은 사용자이거나 비밀번호가 일치하지 않습니다.");
        }
        return customUser;
    }


    /**
     * 회원가입
     */
    public void signUp(HashMap<String, Object> map, HttpServletRequest req) throws Exception {
        Collection<? extends GrantedAuthority> authority;

        CustomUser userDetails = null;

        String pwd;
        if (map.get("pwd") == null) {
            pwd = map.get("oAuthKey").toString();
        } else {
            pwd = map.get("pwd").toString();
        }
        map.put("encodePwd", passwordEncoder.encode(pwd));
        HashMap<String, Object> certMap = userMapper.selectEmailConfirm(map);
        if (!("Y").equals(certMap.get("CERT_YN"))) {
            throw new Exception("오류가 발생하였습니다.");
        }

        // 사용자 정보 저장
        int insertCnt = userMapper.insertUserInfo(map);
        if (insertCnt > 0) {
            // SET TOKEN (자동 로그인)
            SecurityContext sc = SecurityContextHolder.getContext();
            //아이디 유무 체크
            userDetails = (CustomUser) this.loadUserByUsername(map.get("email").toString());
            authority = userDetails.getAuthorities();
            sc.setAuthentication( new UsernamePasswordAuthenticationToken(userDetails, map.get("encodePwd"), authority));
            HttpSession session = req.getSession(true);

            // 위에서 설정한 값을 Spring security에서 사용할 수 있도록 세션에 설정해줍니다.
            session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, sc);
        }
    }

    /**
     * 소셜 로그인
     */
    public String oAuthLogin(HashMap<String, Object> map, HttpServletRequest req) throws Exception {
        String resultUrl;
        HashMap<String, Object> userInfo;
        // 기존유저 - 로그아웃 후 기존회원 로그인 후 메인으로 이동
        // 신규유저 - 로그아웃 후 회원가입 화면으로 이동
        userInfo = userMapper.getOAuthUserInfo(map);

        if (userInfo != null) {
            SecurityContext sc = SecurityContextHolder.getContext();
            // 아이디, 패스워드, 권한을 설정합니다. 아이디는 Object단위로 넣어도 무방하며
            // 패스워드는 null로 하여도 값이 생성됩니다.
            sc.setAuthentication(new UsernamePasswordAuthenticationToken(userInfo.get("NAME"), userInfo.get("PWD"), List.of(new SimpleGrantedAuthority("ROLE_MEMBER"))));
            HttpSession session = req.getSession(true);

            // 위에서 설정한 값을 Spring security에서 사용할 수 있도록 세션에 설정해줍니다.
            session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, sc);

            resultUrl = "redirect:/";
        } else {
            resultUrl = "redirect:/page-signup";
        }

        return resultUrl;
    }

    /**
     * 이메일 중복 체크
     */
    public HashMap<String, Object> getEmailDupChk(String userId) throws Exception {
        HashMap<String, Object> resultMap = new HashMap<>();
        String code;
        String msg;
        if (("").equals(userId)) {
            code = "noEmail";
            msg = "이메일을 입력해주십시오.";
        } else {
            if (userMapper.getEmailDupChk(userId) > 0) {
                code = "dupEmail";
                msg = "중복된 이메일입니다.";
            } else {
                code = "okEmail";
                msg = ""; //사용가능한 이메일입니다.
            }
        }
        resultMap.put("code", code);
        resultMap.put("msg", msg);
        return resultMap;
    }

    /**
     * 인증코드 이메일 발송 ajax
     */
    public HashMap<String, Object> sendCertEmail(HashMap<String, Object> paramMap, HttpServletRequest request) throws Exception {
        HashMap<String, Object> resultMap = new HashMap<>();
        String code;
        String msg;

        String content;
        String[] toEmailUrl;

        paramMap.put("SESSION_ID", request.getSession().getId());        //SESSION ID
        paramMap.put("CERT_NUM", Common.getRandomNum(4, 2));  //인증번호생성
        //인증코드 이메일 저장
        int resultCnt = userMapper.insertEmailCertNum(paramMap);
        if (resultCnt > 0) {
            //이메일 발송
            content = Common.fileToString("/static/assets/templates/email-templates.html");
            content = content.replace("##CERT_CODE##", paramMap.get("CERT_NUM").toString());
            toEmailUrl = new String[]{paramMap.get("EMAIL").toString()};
            commonService.sendMail(toEmailUrl, content);
            code = "success";
            msg = "메일이 발송되었습니다.";
        } else {
            code = "error";
            msg = "에러가 발생하였습니다. 관리자에게 문의하세요.";
        }

        resultMap.put("code", code);
        resultMap.put("msg", msg);
        return resultMap;
    }

    /**
     * 이메일 인증코드 확인
     */
    public HashMap<String, Object> certCheckEmail(HashMap<String, Object> paramMap, HttpServletRequest request) throws Exception {
        HashMap<String, Object> resultMap = new HashMap<>();
        String code;
        String msg;

        paramMap.put("SESSION_ID", request.getSession().getId());        //SESSION ID

        //인증코드 조회
        HashMap<String, Object> result = userMapper.selectEmailCertNum(paramMap);

        if (result != null) {
            userMapper.updateEmailCertYn(result);
            //이메일 발송
            code = "success";
            msg = "인증되었습니다.";
        } else {
            code = "fail";
            msg = "인증코드가 일치하지 않습니다. 다시 시도해주세요.";
        }

        resultMap.put("code", code);
        resultMap.put("msg", msg);
        return resultMap;
    }

    /**
     * 단일 메시지 발송 예제
     */
    public HashMap<String, Object> sendAuthNum(HashMap<String, Object> map) {
        HashMap<String, Object> resultMap = new HashMap<>();
        SingleMessageSentResponse response;
        String ranNum;

        try {
            //인증번호생성
            ranNum = Common.getRandomNum(4, 2);

            Message message = new Message();
            //FROM
            message.setFrom("01037986026");
            //TO
            message.setTo(map.get("phone").toString().replaceAll("-", ""));
            //TEXT
            message.setText("인증번호 [" + ranNum + "]");

            response = this.messageService.sendOne(new SingleMessageSendingRequest(message));

            map.put("USER_NAME", map.get("idName").toString());
            map.put("AUTH_NUM", ranNum);
            map.put("TO_PHONE", map.get("phone").toString().replaceAll("-", ""));
            map.put("GROUP_ID", response.getGroupId());
            map.put("MSG_ID", response.getMessageId());
            map.put("ACCOUNT_ID", response.getAccountId());
            map.put("STAT_CODE", response.getStatusCode());
            map.put("STAT_MSG", response.getStatusMessage());
            map.put("COUNTRY", response.getCountry());

            int seq = userMapper.insertPhoneAuthNum(map);

            resultMap.put("code", "success");
            resultMap.put("msg", "인증번호가 발송되었습니다.");
            resultMap.put("seq", seq);
        } catch (Exception e) {
            e.printStackTrace();
            resultMap.put("code", "fail");
            resultMap.put("msg", e.getMessage());
        }

        return resultMap;
    }

    /**
     * 이메일/비밀번호 찾기 다음
     */
    public HashMap<String, Object> findAccount1(HashMap<String, Object> map) throws Exception {
        return userMapper.getUserInfo(map);
    }

    /**
     * 비밀번호 재설정
     */
    public HashMap<String, Object> reSavePwd(HashMap<String, Object> paramMap) throws Exception {
        HashMap<String, Object> resultMap = new HashMap<>();
        String code;
        String msg;

        paramMap.put("encodePwd", passwordEncoder.encode(paramMap.get("PWD").toString()));

        int resultCnt = userMapper.updateUserPwd(paramMap);

        if (resultCnt > 0) {
            //비밀번호 변경 완료
            code = "success";
            msg = "성공적으로 변경되었습니다.";
        } else {
            code = "fail";
            msg = "비밀번호 변경에 실패하였습니다.";
        }

        resultMap.put("code", code);
        resultMap.put("msg", msg);
        return resultMap;
    }
}
