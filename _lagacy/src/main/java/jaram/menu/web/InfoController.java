package jaram.menu.web;

import jaram.cmm.util.Common;
import jaram.common.service.CommonService;
import jaram.menu.service.InfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import java.util.HashMap;

/**
 * NOTE : 소개 컨트롤러
 * DATE : 2023.08.05
 */
@Controller
public class InfoController extends Common {

    @Autowired
    InfoService infoService;

    @Autowired
    CommonService commonService;

    /**
     * 대표 소개 화면 이동
     */
    @RequestMapping(value = "/ceo")
    public ModelAndView goCeoIntroPage() throws Exception {
        ModelAndView mav = new ModelAndView();
        HashMap<String, Object> param = new HashMap<>();
        param.put("PAGE", "ceo");
        mav.addObject("edtMessage",commonService.selectEditorMessage(param));
        mav.setViewName("/page-ceo");
        return mav;
    }


    /**
     * 설립취지문 화면 이동
     */
    @RequestMapping(value = "/page-purpose-of-esta")
    public ModelAndView goPurposeOfEstaPage() throws Exception {
        ModelAndView mav = new ModelAndView();
        HashMap<String, Object> param = new HashMap<>();
        param.put("PAGE", "esta");
        mav.addObject("edtMessage",commonService.selectEditorMessage(param));
        mav.setViewName("/page-purpose-of-esta");
        return mav;
    }


    /**
     * 비전과 미션 화면 이동
     */
    @RequestMapping(value = "/page-vision-mission")
    public ModelAndView goVisionMissionPage() throws Exception {
        ModelAndView mav = new ModelAndView();
        HashMap<String, Object> param = new HashMap<>();
        param.put("PAGE", "/page-vision-mission");
        mav.setViewName("/page-vision-mission");
        return mav;
    }


    /**
     * 조직도 화면 이동
     */
    @RequestMapping(value = "/page-organization")
    public ModelAndView goOraganizationPage() throws Exception {
        ModelAndView mav = new ModelAndView();
        HashMap<String, Object> param = new HashMap<>();
        param.put("PAGE", "/page-organization");
        mav.setViewName("/page-organization");
        return mav;
    }

    /**
     * 오시는길 화면 이동
     */
    @RequestMapping(value = "/page-location")
    public ModelAndView goLocationPage() throws Exception {
        ModelAndView mav = new ModelAndView();
        HashMap<String, Object> param = new HashMap<>();
        param.put("PAGE", "/page-location");
        mav.setViewName("/page-location");
        return mav;
    }



}