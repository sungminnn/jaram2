package jaram.menu.service;


import jaram.cmm.exception.BizException;
import jaram.cmm.login.CustomUser;
import jaram.cmm.login.User;
import jaram.cmm.util.FileUtils;
import jaram.common.service.CommonService;
import jaram.menu.mapper.CommunityMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.List;

import static jaram.cmm.exception.ErrorCode.INTERNAL_SERVER_ERROR;


@Transactional
@Service
public class CommunityService {

    @Autowired
    CommonService commonService;

    @Autowired
    private FileUtils fileutils;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    private final CommunityMapper communityMapper;

    public CommunityService(CommunityMapper communityMapper) {
        this.communityMapper = communityMapper;
    }

    // 조회수 증가 로직
    public void updateViewCnt(HashMap<String, Object> paramMap, HttpServletRequest request, HttpServletResponse response) throws Exception {
        // 조회 수 중복 방지
        Cookie oldCookie = null;
        Cookie[] cookies = request.getCookies();
        try {
            if (cookies != null) {
                for (Cookie cookie : cookies) {
                    if (cookie.getName().equals("postView")) {
                        oldCookie = cookie;
                    }
                }
            }
            if (oldCookie != null) {
                if (!oldCookie.getValue().contains("[" + paramMap.get("SEQ").toString() + "]")) {
                    communityMapper.updateViewCnt(paramMap);
                    oldCookie.setValue(oldCookie.getValue() + "_[" + paramMap.get("SEQ").toString() + "]");
                    oldCookie.setPath("/");
                    oldCookie.setMaxAge(60 * 60 * 24);
                    response.addCookie(oldCookie);
                }
            } else {
                communityMapper.updateViewCnt(paramMap);
                Cookie newCookie = new Cookie("postView", "[" + paramMap.get("SEQ").toString() + "]");
                newCookie.setPath("/");
                newCookie.setMaxAge(60 * 60 * 24);
                response.addCookie(newCookie);
            }
        } catch (NullPointerException e) {
            e.printStackTrace();
            //잘못된 경로로 접근하였습니다.
            throw new BizException(INTERNAL_SERVER_ERROR);
        }
    }


    /**
     * 게시글 조회 성공 시 SESSION 저장
     */
    public void updateNowSession(HashMap<String, Object> paramMap, HttpServletRequest request) throws Exception {
        HttpSession session = request.getSession(true);
        paramMap.put("NOW_SESSION", session.getId());
        communityMapper.updateNowSession(paramMap);
    }

    /**
     * 댓글 저장
     */
    public List<HashMap<String, Object>> insertComment(HashMap<String, Object> param, List<MultipartFile> files) throws Exception {
        SecurityContext context = SecurityContextHolder.getContext();
        Object principal = context.getAuthentication().getPrincipal();
        CustomUser customUser;
        User user;

        //댓글 비밀번호 암호화
        if (param.get("COMMENT_PASSWORD") != null) {
            param.put("COMMENT_PASSWORD", passwordEncoder.encode(param.get("COMMENT_PASSWORD").toString()));
        }

        if (files != null) {
            //파일업로드
            param.put("IMG_PATH", fileutils.uploadFiles(files).get(0).get("UPLOAD_PATH") );
        }

       if (principal != "anonymousUser") {
           //로그인 후 작성
           customUser = (CustomUser) principal;
           user = customUser.getUser();
           param.put("INPUT_ID", user.getEmail());
           param.put("INPUT_NAME", user.getUsername());
       } else {
           //로그인 X
           param.put("INPUT_NAME", param.get("INPUT_NAME"));
       }

        //댓글 저장
        communityMapper.insertComment(param);

        //댓글 목록
        return communityMapper.selectCommentList(param);
    }

    /**
     * 댓글 조회
     */
    public HashMap<String, Object> selectComment(HashMap<String, Object> param) throws Exception {
        //댓글 목록
        return communityMapper.selectComment(param);
    }

    /**
     * 댓글 목록 조회
     */
    public List<HashMap<String, Object>> selectCommentList(HashMap<String, Object> param) throws Exception {
        //댓글 목록
        return communityMapper.selectCommentList(param);
    }


    /**
     * 댓글 삭제
     */
    public void deleteComment(HashMap<String, Object> paramMap) throws Exception {
        communityMapper.deleteComment(paramMap);
    }

    /**
     * 댓글 수정
     */
    public List<HashMap<String, Object>> updateComment(HashMap<String, Object> param, List<MultipartFile> files) throws Exception {
        SecurityContext context = SecurityContextHolder.getContext();
        Object principal = context.getAuthentication().getPrincipal();
        CustomUser customUser;
        User user;

        if (files != null) {
            //파일업로드
            param.put("IMG_PATH", fileutils.uploadFiles(files).get(0).get("UPLOAD_PATH") );
        }

        if (principal != "anonymousUser") {
            //로그인 후 작성
            customUser = (CustomUser) principal;
            user = customUser.getUser();
            param.put("INPUT_ID", user.getEmail());
            param.put("INPUT_NAME", user.getUsername());
        } else {
            //로그인 X
            param.put("INPUT_NAME", param.get("INPUT_NAME"));
        }

        //댓글 수정
        communityMapper.updateComment(param);

        //댓글 목록
        return communityMapper.selectCommentList(param);
    }
}
