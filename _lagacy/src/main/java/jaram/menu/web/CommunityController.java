package jaram.menu.web;

import jaram.cmm.exception.BizException;
import jaram.cmm.exception.ErrorCode;
import jaram.cmm.login.CustomUser;
import jaram.cmm.util.Common;
import jaram.common.service.CommonService;
import jaram.menu.service.CommunityService;
import net.sf.json.JSONArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;

/**
 * NOTE : 소통공간 컨트롤러
 * DATE : 2023.08.05
 */
@Controller
public class CommunityController extends Common {

    @Autowired
    CommunityService communityService;

    @Autowired
    CommonService commonService;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    /**
     * 공지사항 화면 이동
     */
    @RequestMapping(value = "/board")
    public ModelAndView goNoticePage(@RequestParam(required = true, value = "page") String page, @RequestParam(required = false, value = "pageNum") String pageNum) {
        ModelAndView mav = new ModelAndView("jsonView");
        HashMap<String, Object> result;
        if( ("").equals(pageNum) || pageNum == null ){
            pageNum = "1";
        }
        mav.addObject("LOGIN_ID", Common.getLoginId());
        mav.addObject("pageNum", pageNum);
        mav.setViewName("/page-"+page);
        return mav;
    }

    /**
     * 글쓰기 화면 이동
     */
    @RequestMapping(value = "/admin/page-board-write")
    public ModelAndView goBoardPage(@RequestParam(value = "page") String page) {
        ModelAndView mav = new ModelAndView();
        mav.addObject("PAGE", page);
        mav.setViewName("/page-board-write");
        return mav;
    }

    /**
     * QNA 작성 화면 이동
     */
    @RequestMapping(value = "/qna-write")
    public ModelAndView goQnaWrite() {
        ModelAndView mav = new ModelAndView();
        mav.setViewName("/page-qna-write");
        return mav;
    }

    /**
     * 게시글 수정 화면 이동
     */
    @RequestMapping(value = "/admin/page-board-update")
    public ModelAndView goBoardUpdatePage(@RequestParam(required = true, value = "seq") String seq
            , @RequestParam(required = true, value = "page") String page
            , HttpServletRequest request) throws Exception {
        ModelAndView mav = new ModelAndView("jsonView");
        HashMap<String, Object> result;

        //게시글 접근 체크로직
        result = commonService.chkAuthenticate(page, seq, request, "update");

        mav.addObject("boardInfo", result.get("boardInfo"));
        mav.addObject("uploadFiles", result.get("uploadFiles"));
        mav.addObject("PAGE", page);
        mav.setViewName("/page-board-write");
        return mav;
    }

    /**
     * 게시글 삭제
     */
    @RequestMapping(value = "/admin/page-board-delete")
    public String goBoardDeletePage(@RequestParam(required = true, value = "seq") String seq
            , @RequestParam(required = true, value = "page") String page, HttpServletRequest request) throws Exception {
        ModelAndView mav = new ModelAndView("jsonView");
        HashMap<String, Object> paramMap = new HashMap<>();

        //게시글 접근 체크로직
        commonService.chkAuthenticate(page, seq, request, "delete");

        paramMap.put("PAGE", page);
        paramMap.put("SEQ", seq);
        //게시글 삭제
        commonService.deleteEditorMessage(paramMap);

        return "redirect:/board?page=" + page;
    }

    /**
     * 문의게시글 저장
     */
    @RequestMapping(value = "/save-qna-board", method = RequestMethod.POST)
    public ModelAndView saveQnaBoard(@RequestPart(value = "key") HashMap<String, Object> paramMap,
                                     @RequestPart(value = "file", required = false) List<MultipartFile> files) throws Exception {
        ModelAndView mav = new ModelAndView("jsonView");

        paramMap.put("PAGE", "qna");
        if (paramMap.get("QNA_PASSWORD") != null) {
            paramMap.put("QNA_PASSWORD", passwordEncoder.encode(paramMap.get("QNA_PASSWORD").toString()));
        }
        mav.addObject("EDT_INFO", commonService.insertEditorMessage(paramMap, files));
        mav.addObject("msg", "success");
        return mav;
    }

    /**
     * 문의 게시판 게시글 수정 화면 이동
     */
    @RequestMapping(value = "/qna-update")
    public ModelAndView goQnaUpdatePage(@RequestParam(required = true, value = "seq") String seq
            , HttpServletRequest request) throws Exception {
        ModelAndView mav = new ModelAndView("jsonView");
        HashMap<String, Object> result;

        //게시글 접근 체크로직
        result = commonService.chkAuthenticate("qna", seq, request, "update");

        mav.addObject("boardInfo", result.get("boardInfo"));
        mav.addObject("uploadFiles", result.get("uploadFiles"));
        mav.addObject("PAGE", "qna");
        mav.setViewName("/page-qna-write");
        return mav;
    }

    /**
     * 게시글 삭제
     */
    @RequestMapping(value = "/qna-delete")
    public String goQnaDeletePage(@RequestParam(required = true, value = "seq") String seq, HttpServletRequest request) throws Exception {
        ModelAndView mav = new ModelAndView();
        HashMap<String, Object> paramMap = new HashMap<>();

        //게시글 접근 체크로직
        commonService.chkAuthenticate("qna", seq, request, "delete");

        paramMap.put("PAGE", "qna");
        paramMap.put("SEQ", seq);

        //게시글 삭제
        commonService.deleteEditorMessage(paramMap);

        return "redirect:/board?page=qna";
    }

    /**
     * 문의게시글 권한 체크 ajax
     */
    @RequestMapping(value = "/qna-auth-chk", method = RequestMethod.POST)
    public ModelAndView goQnaQuthChk(@RequestParam(required = false) HashMap<String, Object> paramMap, HttpServletRequest request) throws Exception {
        ModelAndView mav = new ModelAndView("jsonView");
        HashMap<String, Object> result;
        HashMap<String, Object> boardInfo;
        SecurityContext context = SecurityContextHolder.getContext();
        Object principal = context.getAuthentication().getPrincipal();
        String loginId = "";
        paramMap.put("PAGE", "qna");
        try {
            if (principal != "anonymousUser") {
                //로그인 사용자인 경우
                CustomUser customUser = (CustomUser) principal;
                loginId = customUser.getUser().getEmail();
            }

            //게시글 조회
            result = commonService.selectEditorMessage(paramMap);
            if (result.get("boardInfo") == null) {
                //존재하지 않는 게시물입니다.
                throw new BizException(ErrorCode.INVALID_BOARD_NUM);
            }

            boardInfo = (HashMap<String, Object>) result.get("boardInfo");

            //조회
            mav.addObject("code", "success-show-detail");

            if (boardInfo.get("INPUT_ID") != null && !(loginId).equals(boardInfo.get("INPUT_ID")) && ("Y").equals(boardInfo.get("QNA_SECURE_YN"))) {
                //권한이 없습니다.
                throw new BizException(ErrorCode.BOARD_NOT_ALLOWED);
            } else if (loginId.isEmpty() && ("Y").equals(boardInfo.get("QNA_SECURE_YN"))) {
                //익명, 비밀글인 경우
                //이전 비밀번호 검증 시 사용한 세션정보가 일치할 경우 그냥 조회
                if (    boardInfo.get("NOW_SESSION") == null
                    || !boardInfo.get("NOW_SESSION").toString().equals(request.getSession().getId())) {

                    //비밀번호 확인
                    mav.addObject("code", "success-chk-pwd");
                }else {

                }
            }
            mav.addObject("seq", paramMap.get("SEQ"));
        } catch (BizException e) {
            mav.addObject("code", "fail");
            mav.addObject("msg", e.getMessage());
        }
        return mav;
    }

    /**
     * 문의게시글 비밀번호 체크 ajax
     */
    @RequestMapping(value = "/qna-chk-password", method = RequestMethod.POST)
    public ModelAndView goChkQnaPassword(@RequestParam(required = false) HashMap<String, Object> paramMap, HttpServletRequest request) throws Exception {
        ModelAndView mav = new ModelAndView("jsonView");
        HashMap<String, Object> result;
        HashMap<String, String> boardInfo;
        try {
            paramMap.put("PAGE", "qna");
            result = commonService.selectEditorMessage(paramMap);
            if (result.get("boardInfo") == null) {
                //존재하지 않는 게시물입니다.
                throw new BizException(ErrorCode.INVALID_BOARD_NUM);
            }
            boardInfo = (HashMap<String, String>) result.get("boardInfo");
            if (!passwordEncoder.matches((CharSequence) paramMap.get("QNA_PASSWORD"), boardInfo.get("QNA_PASSWORD"))) {
                //비밀번호가 일치하지 않습니다.
                throw new BizException(ErrorCode.INVALID_QNA_PASSWORD);
            }
            //session 저장
            communityService.updateNowSession(paramMap, request);
            mav.addObject("code", "success");
            mav.addObject("seq", paramMap.get("SEQ"));
        } catch (BizException e) {
            mav.addObject("code", "fail");
            mav.addObject("msg", e.getMessage());
        }
        return mav;
    }

    /**
     * 댓글 저장 ajax
     */
    @RequestMapping(value = "/insert-comment", method = RequestMethod.POST)
    public ModelAndView insertComment(@RequestPart(value = "key") HashMap<String, Object> paramMap,
                                      @RequestPart(value = "file", required = false) List<MultipartFile> files) throws Exception {
        ModelAndView mav = new ModelAndView("jsonView");
        List<HashMap<String, Object>> result = communityService.insertComment(paramMap, files);

        mav.addObject("code", "success");
        mav.addObject("commentList", result);
        return mav;
    }

    /**
     * 댓글 수정/삭제 권한 체크 ajax
     */
    @RequestMapping(value = "/comment-chk", method = RequestMethod.POST)
    public ModelAndView goChkCommentAuth(@RequestParam(required = false) HashMap<String, Object> paramMap, HttpServletRequest request) throws Exception {
        ModelAndView mav = new ModelAndView("jsonView");
        HashMap<String, Object> result;
        HashMap<String, String> commentInfo;
        String loginId = "";
        try {
            loginId = Common.getLoginId();
            result = communityService.selectComment(paramMap);
            if (result == null) {
                //존재하지 않는 댓글입니다.
                throw new BizException(ErrorCode.INVALID_COMMENT_SEQ);
            }
            if("".equals(loginId) || !loginId.equals(result.get("INPUT_ID"))){
                mav.addObject("code", "success_chk_pwd");
                mav.addObject("seq", paramMap.get("COMMENT_SEQ"));
            }else{
                mav.addObject("code", "success_"+paramMap.get("GUBN"));
                mav.addObject("seq" , paramMap.get("COMMENT_SEQ"));
                mav.addObject("gubn", paramMap.get("GUBN"));
                mav.addObject("comment", result);
            }
            mav.addObject("gubn", paramMap.get("GUBN"));
        } catch (BizException e) {
            mav.addObject("code", "fail");
            mav.addObject("msg", e.getMessage());
        }
        return mav;
    }
    
    
    /**
     * 댓글 비밀번호 체크 ajax
     */
    @RequestMapping(value = "/comment-chk-password", method = RequestMethod.POST)
    public ModelAndView goChkCommentPassword(@RequestParam(required = false) HashMap<String, Object> paramMap, HttpServletRequest request) throws Exception {
        ModelAndView mav = new ModelAndView("jsonView");
        HashMap<String, Object> result;
        String loginId = "";
        try {
            loginId = Common.getLoginId();
            result = communityService.selectComment(paramMap);
            if (result == null) {
               //존재하지 않는 댓글입니다.
               throw new BizException(ErrorCode.INVALID_COMMENT_SEQ);
            }
            if("".equals(loginId) || !loginId.equals(result.get("INPUT_ID"))) {
                if (!passwordEncoder.matches((CharSequence) paramMap.get("COMMENT_PASSWORD"), (String) result.get("COMMENT_PASSWORD"))) {
                    //비밀번호가 일치하지 않습니다.
                    throw new BizException(ErrorCode.INVALID_QNA_PASSWORD);
                }
            }
            mav.addObject("code", "success");
            mav.addObject("seq" , paramMap.get("COMMENT_SEQ"));
            mav.addObject("gubn", paramMap.get("GUBN"));
            mav.addObject("comment_pwd", paramMap.get("COMMENT_PASSWORD"));
            mav.addObject("comment", result);
        } catch (BizException e) {
            mav.addObject("code", "fail");
            mav.addObject("msg", e.getMessage());
        }
        return mav;
    }

    /**
     * 댓글 삭제
     */
    @RequestMapping(value = "/qna-comment-delete", method = RequestMethod.POST)
    public ModelAndView deleteComment(@RequestParam(required = false) HashMap<String, Object> paramMap, HttpServletRequest request) throws Exception {
        ModelAndView mav = new ModelAndView("jsonView");
        HashMap<String, Object> result;
        List<HashMap<String, Object>> commentList;
        String loginId = "";
        try {
            loginId = Common.getLoginId();
            result = communityService.selectComment(paramMap);

            if (result == null) {
                //존재하지 않는 댓글입니다.
                throw new BizException(ErrorCode.INVALID_COMMENT_SEQ);
            }
            if("".equals(loginId) || !loginId.equals(result.get("INPUT_ID"))) {
                if (!passwordEncoder.matches((CharSequence) paramMap.get("COMMENT_PASSWORD"), (String) result.get("COMMENT_PASSWORD"))) {
                    //비밀번호가 일치하지 않습니다.
                    throw new BizException(ErrorCode.INVALID_QNA_PASSWORD);
                }
            }
            //댓글삭제
            communityService.deleteComment(paramMap);

            //댓글목록 조회
            commentList = communityService.selectCommentList(paramMap);
            mav.addObject("code", "success");
            mav.addObject("seq" , paramMap.get("COMMENT_SEQ"));
            mav.addObject("gubn", paramMap.get("GUBN"));
            mav.addObject("commentList", commentList);
        } catch (BizException e) {
            mav.addObject("code", "fail");
            mav.addObject("msg", e.getMessage());
        }
        return mav;
    }

    /**
     * 댓글 수정 ajax
     */
    @RequestMapping(value = "/update-comment", method = RequestMethod.POST)
    public ModelAndView updateComment(@RequestPart(value = "key") HashMap<String, Object> paramMap,
                                      @RequestPart(value = "file", required = false) List<MultipartFile> files) throws Exception {
        ModelAndView mav = new ModelAndView("jsonView");
        List<HashMap<String, Object>> result = communityService.updateComment(paramMap, files);

        mav.addObject("code", "success");
        mav.addObject("commentList", result);
        return mav;
    }
    
}
