package jaram.common.service;


import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import jaram.cmm.exception.BizException;
import jaram.cmm.exception.ErrorCode;
import jaram.cmm.login.CustomUser;
import jaram.cmm.login.User;
import jaram.cmm.util.Common;
import jaram.cmm.util.FileUtils;
import jaram.common.mapper.CommonMapper;
import jaram.menu.mapper.CommunityMapper;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import javax.mail.internet.MimeMessage;
import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class CommonService {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private JavaMailSender javaMailSender;

    @Value("${jaram.ckeditor.image.upload.path2}")
    String imagePath;

    @Autowired
    CommonMapper commonMapper;

    @Autowired
    CommunityMapper communityMapper;

    @Autowired
    private FileUtils fileutils;

    /**
     * ckeditor 파일 업로드
     */
    public String uploadFile(MultipartHttpServletRequest request) throws IOException {
        // ckeditor 에서 파일을 보낼 때 upload : [파일] 형식으로 해서 넘어오기 때문에 upload라는 키의 밸류를 받아서 uploadFile에 저장함
        MultipartFile uploadFile = request.getFile("upload");

        // 파일의 오리지널 네임
        assert uploadFile != null;
        String originalFileName = uploadFile.getOriginalFilename();

        // 파일의 확장자
        assert originalFileName != null;
        String ext = originalFileName.substring(originalFileName.indexOf("."));

        // 서버에 저장될 때 중복된 파일 이름인 경우를 방지하기 위해 UUID에 확장자를 붙여 새로운 파일 이름을 생성
        String newFileName = UUID.randomUUID() + ext;

        // 파일이 업로드 될 경로를 지정한다.
        LocalDate now = LocalDate.now();

        String addFilePath = File.separator + now.getYear()
                + File.separator + String.format("%02d", now.getMonth().getValue())
                + File.separator + String.format("%02d", now.getDayOfMonth());
        String savePath = imagePath + addFilePath;

        // 저장될 경로와 파일명
        String saveFilePath = savePath + File.separator + newFileName;

        // savePath에 해당되는 파일의 File 객체를 생성한다.
        File fileFolder = new File(savePath);

        if (!fileFolder.exists()) {
            // 부모 폴더까지 포함하여 경로에 폴더를 만든다.
            if (fileFolder.mkdirs()) {
                logger.info("[file.mkdirs] : Success");
            } else {
                logger.error("[file.mkdirs] : Fail");
            }
        }

        // 저장 경로로 파일 객체 생성
        File file = new File(saveFilePath);

        // 파일 업로드
        uploadFile.transferTo(file);
        logger.info("[file.path] : " + "/ckeditor/upload" + addFilePath + "/" + newFileName);
        return "/ckeditor/upload" + addFilePath + "/" + newFileName;
    }


    /**
     * 이메일 발송 함수
     */
    public void sendMail(String[] toEmailList, String content) {
        MimeMessage message = javaMailSender.createMimeMessage();

        try {
            MimeMessageHelper messageHelper = new MimeMessageHelper(message, true, "UTF-8");

            // 0. 메일 발신자 설정
            messageHelper.setFrom("noreply@jaram.com");

            // 1. 메일 수신자 설정
            messageHelper.setTo(toEmailList);

            // 2. 메일 제목 설정
            messageHelper.setSubject("자람 이메일 인증코드");

            // 3. 메일 내용 설정
            // HTML 적용됨
            messageHelper.setText(content, true);

            // 4. 메일 전송
            javaMailSender.send(message);
            logger.info("MailServiceImpl.sendMail() :: SUCCESS");
        } catch (Exception e) {
            logger.error("MailServiceImpl.sendMail() :: FAILED");
            e.printStackTrace();
        }
    }

    /**
     * editor message 저장 후 값 리턴
     */
    public HashMap<String, Object> insertEditorMessage(HashMap<String, Object> param, List<MultipartFile> files) throws Exception {
        SecurityContext context = SecurityContextHolder.getContext();
        Object principal = context.getAuthentication().getPrincipal();
        if (principal != "anonymousUser") {
            //로그인 후 작성
            CustomUser customUser = (CustomUser) principal;
            if (param.get("SEQ") != "") {
                param.put("UPDATE_ID", customUser.getUser().getEmail());
                param.put("UPDATE_NAME", customUser.getUser().getUsername());
            } else {
                param.put("INPUT_ID", customUser.getUser().getEmail());
                param.put("INPUT_NAME", customUser.getUser().getUsername());
            }
        } else {
            //로그인 X
            if (param.get("SEQ") != "") {
                param.put("UPDATE_NAME", param.get("INPUT_NAME"));
            } else {
                param.put("INPUT_NAME", param.get("INPUT_NAME"));
            }
        }
        commonMapper.insertEditorMessage(param);

        if (files != null) {
            List<HashMap<String, Object>> filesInfo = fileutils.uploadFiles(files);
            this.saveFiles(Long.parseLong(param.get("SEQ").toString()), filesInfo);
        }

        return commonMapper.selectEditorMessage(param);
    }

    /**
     * editor message 조회
     */
    public HashMap<String, Object> selectEditorMessage(HashMap<String, Object> param) throws Exception {
        HashMap<String, Object> result = new HashMap<>();

        result.put("boardInfo", commonMapper.selectEditorMessage(param));
        result.put("uploadFiles", commonMapper.selectFileList(param));
        param.put("EDT_SEQ", param.get("SEQ"));
        result.put("commentList", communityMapper.selectCommentList(param));

        return result;
    }

    /**
     * editor message list 조회 (Paging)
     */
    public HashMap<String, Object> selectEditorMessagePagingList(@RequestParam(required = false) HashMap<String, Object> param) {
        HashMap<String, Object> result = new HashMap<>();
        PageInfo<HashMap<String, Object>> pageInfo = new PageInfo<>();
        HashMap<String, Object> pageInfoMap = new HashMap<>();
        int pageNum;
        try {
            pageNum = param.get("pageNum") == null ? 1 : Integer.parseInt(String.valueOf(param.get("pageNum")));
            System.out.println("@@@ page Num = " + pageNum);
            //페이징
            PageHelper.startPage(pageNum, Common.getBoardPageCnt((String) param.get("PAGE")));
            pageInfo = PageInfo.of(commonMapper.selectEditorMessageList(param));
            pageInfoMap.put("pageNum", pageInfo.getPageNum());
            pageInfoMap.put("pages", pageInfo.getPages());
            pageInfoMap.put("prePage", pageInfo.getPrePage());
            pageInfoMap.put("nextPage", pageInfo.getNextPage());
            pageInfoMap.put("startPage", pageInfo.getNavigateFirstPage());
            pageInfoMap.put("endPage", pageInfo.getNavigateLastPage());
            result.put("list", pageInfo.getList());
            result.put("pageInfo", pageInfoMap);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

    /**
     * 첨부파일 저장
     */
    public void saveFiles(Long edtSeq, List<HashMap<String, Object>> files) throws Exception {
        SecurityContext context = SecurityContextHolder.getContext();
        if (CollectionUtils.isEmpty(files)) {
            return;
        }
        for (HashMap<String, Object> file : files) {
            file.put("EDT_SEQ", edtSeq);
            file.put("INPUT_ID", context.getAuthentication().getName());
            commonMapper.insertFileInfo(file);
        }
    }

    /**
     * 단건 파일 조회
     */
    public HashMap<String, Object> selectOneFile(Long fileSeq) throws Exception {
        return commonMapper.selectOneFile(fileSeq);
    }

    /**
     * 첨부파일 삭제 ajax
     */
    public void deleteFileInfo(HashMap<String, Object> param) throws Exception {
        commonMapper.deleteFileInfo(param);
    }

    /**
     * editor message 삭제
     */
    public void deleteEditorMessage(HashMap<String, Object> param) throws Exception {
        commonMapper.deleteEditorMessage(param);
    }

    /**
     * 에러 로그 저장
     */
    public void insertErrorLog(HashMap<String, Object> param) throws Exception {
        commonMapper.insertErrorLog(param);
    }

    /**
     * 게시글 접근 체크로직
     */
    public HashMap<String, Object> chkAuthenticate(String page, String seq, HttpServletRequest request, String gubn) throws Exception {
        SecurityContext context = SecurityContextHolder.getContext();
        Object principal = context.getAuthentication().getPrincipal();
        HashMap<String, Object> paramMap = new HashMap<>();
        HashMap<String, Object> result;
        HashMap<String, Object> boardInfo;
        String loginId = "";
        String loginName = "";
        //로그인 사용자인 경우
        User user;
        CustomUser customUser;

        if (principal != "anonymousUser") {
            customUser = (CustomUser) principal;
            user = customUser.getUser();
            loginId = user.getEmail();
            loginName = user.getUsername();
        }

        paramMap.put("PAGE", page);
        paramMap.put("SEQ", seq);
        result = this.selectEditorMessage(paramMap);

        boardInfo = (HashMap<String, Object>) result.get("boardInfo");

        if (boardInfo == null) {
            //존재하지 않는 게시물입니다.
            throw new BizException(ErrorCode.INVALID_BOARD_NUM);
        }

        if (("delete").equals(gubn) || ("update").equals(gubn)) {
            if (boardInfo.get("INPUT_ID") != null && !(loginId).equals(boardInfo.get("INPUT_ID"))) {
                //권한이 없습니다.
                throw new BizException(ErrorCode.BOARD_NOT_ALLOWED);
            }
            //비밀번호 미인증 접근 시
            if (boardInfo.get("NOW_SESSION") != null && !boardInfo.get("NOW_SESSION").equals(request.getSession().getId())) {
                //비밀번호가 일치하지 않습니다.
                throw new BizException(ErrorCode.INVALID_QNA_PASSWORD);
            }
        } else {
            if (boardInfo.get("INPUT_ID") != null && !(loginId).equals(boardInfo.get("INPUT_ID")) && ("Y").equals(boardInfo.get("QNA_SECURE_YN"))) {
                //권한이 없습니다.
                throw new BizException(ErrorCode.BOARD_NOT_ALLOWED);
            }

            //비밀번호 미인증 접근 시
            if (loginId == null && boardInfo.get("NOW_SESSION") != null && !boardInfo.get("NOW_SESSION").equals(request.getSession().getId()) && ("Y").equals(boardInfo.get("QNA_SECURE_YN"))) {
                //비밀번호가 일치하지 않습니다.
                throw new BizException(ErrorCode.INVALID_QNA_PASSWORD);
            }
        }
        result.put("loginId", loginId);
        result.put("loginName", loginName);
        result.put("paramMap", paramMap);
        return result;
    }

    /**
     * 사이트 정책 조회
     */
    public HashMap<String, Object> selectSitePolicy(HashMap<String, Object> paramMap) throws Exception {
        return commonMapper.selectSitePolicy(paramMap);
    }

    /**
     * 사이트 정책 목록 조회
     */
    public List<HashMap<String, Object>>  selectSitePolicyList() throws Exception {
        return commonMapper.selectSitePolicyList();
    }
}
