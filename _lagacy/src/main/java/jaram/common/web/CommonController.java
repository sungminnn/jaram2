package jaram.common.web;

import jaram.cmm.util.Common;
import jaram.cmm.util.FileUtils;
import jaram.common.service.CommonService;
import jaram.menu.service.CommunityService;
import net.sf.json.JSONArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;

/**
 * NOTE : Common 컨트롤러
 * DATE : 2023.08.05
 */
@Controller
public class CommonController extends Common {

    @Autowired
    CommonService commonService;

    @Autowired
    CommunityService communityService;

    @Autowired
    private FileUtils fileutils;


    /**
     * ckeditor file upload
     */
    @RequestMapping(value = "/common/file/ckeditor5Upload.do")
    public ModelAndView ckeditor5Upload(MultipartHttpServletRequest request) {
        ModelAndView mav = new ModelAndView("jsonView");
        String uploadPath;
        try {
            uploadPath = commonService.uploadFile(request);

            mav.addObject("uploaded", true); // 업로드 완료
            mav.addObject("url", uploadPath); // 업로드 파일의 경로
        } catch (Exception e) {
            e.printStackTrace();
        }
        return mav;
    }

    /**
     * 첨부파일 다운로드
     *
     * @param fileSeq 파일순번
     * @return ResponseEntity<Resource> 파일 다운로드
     * @throws Exception 예외
     */
    @RequestMapping("/files/{fileSeq}/download")
    public ResponseEntity<Resource> downloadFile(@PathVariable final Long fileSeq) throws Exception {
        HashMap<String, Object> file = commonService.selectOneFile(fileSeq);
        Resource resource = fileutils.readFileAsResource(file);
        try {
            String filename = URLEncoder.encode(file.get("ORG_FILE_NAME").toString(), StandardCharsets.UTF_8);
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; fileName=\"" + filename + "\";")
                    .header(HttpHeaders.CONTENT_LENGTH, file.get("FILE_SIZE") + "")
                    .body(resource);
        } catch (Exception e) {
            throw new RuntimeException("filename encoding failed : " + file.get("ORG_FILE_NAME"));
        }
    }

    /**
     * 첨부파일 삭제 ajax
     */
    @RequestMapping(value = "/delete-file-info", method = RequestMethod.POST)
    public ModelAndView deleteFileInfo(@RequestParam HashMap<String, Object> paramMap) throws Exception {
        ModelAndView mav = new ModelAndView("jsonView");
        commonService.deleteFileInfo(paramMap);
        return mav;
    }

    /**
     * editor message 저장 ajax
     */
    @RequestMapping(value = "/save-editor-message", method = RequestMethod.POST)
    public ModelAndView insertEditorMessage(@RequestPart(value = "key") HashMap<String, Object> paramMap,
                                            @RequestPart(value = "file", required = false) List<MultipartFile> files) throws Exception {
        ModelAndView mav = new ModelAndView("jsonView");
        mav.addObject("EDT_INFO", commonService.insertEditorMessage(paramMap, files));
        mav.addObject("msg", "success");
        return mav;
    }

    /**
     * editor message 조회(paging) ajax
     */
    @RequestMapping(value = "/board-list-paging", method = RequestMethod.POST)
    public ModelAndView getBoardListPaging(@RequestParam(required = false) HashMap<String, Object> paramMap) {
        ModelAndView mav = new ModelAndView("jsonView");
        HashMap<String, Object> result;
        result = commonService.selectEditorMessagePagingList(paramMap);

        mav.addObject("list", result.get("list"));
        mav.addObject("pageInfo", result.get("pageInfo"));
        return mav;
    }

    /**
     * editor message 상세 조회
     */
    @RequestMapping(value = "/board-detail")
    public ModelAndView getBoardDetail(@RequestParam(required = true, value = "seq") String seq
            , @RequestParam(required = true, value = "page") String page, @RequestParam(required = false, value = "pageNum") String pageNum, HttpServletRequest request, HttpServletResponse response) throws Exception {
        ModelAndView mav = new ModelAndView();
        HashMap<String, Object> result;

        if( ("").equals(pageNum) || pageNum == null ){
            pageNum = "1";
        }
        //게시글 접근 체크로직
        result = commonService.chkAuthenticate(page, seq, request, "select");

        //조회수 증가
        communityService.updateViewCnt((HashMap<String, Object>) result.get("paramMap"), request, response);

        mav.addObject("boardInfo", result.get("boardInfo"));
        mav.addObject("uploadFiles", result.get("uploadFiles"));
        mav.addObject("commentList", JSONArray.fromObject(result.get("commentList")));
        mav.addObject("page", page);
        mav.addObject("pageNum", pageNum);
        mav.addObject("LOGIN_ID", result.get("loginId"));
        mav.addObject("LOGIN_NAME", result.get("loginName"));
        mav.setViewName("/page-board-detail");
        return mav;
    }

    /**
     * 사이트 정책 조회
     */
    @RequestMapping(value = "/site-policy")
    public ModelAndView getSitePolicy(@RequestParam HashMap<String, Object> paramMap) throws Exception {
        ModelAndView mav = new ModelAndView("jsonView");
        mav.addObject("data", commonService.selectSitePolicy(paramMap));
        return mav;
    }


}
