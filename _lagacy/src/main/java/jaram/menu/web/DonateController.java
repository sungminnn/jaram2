package jaram.menu.web;

import jaram.cmm.util.Common;
import jaram.common.service.CommonService;
import jaram.menu.service.DonateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.HashMap;

/**
 * NOTE : 후원 컨트롤러
 * DATE : 2023.08.05
 */
@Controller
public class DonateController extends Common {

    @Autowired
    DonateService donateService;

    @Autowired
    CommonService commonService;

    /**
     * 정기/일시후원 화면 이동
     */
    @RequestMapping(value = "/page-donate")
    public ModelAndView goDonatePage() {
        ModelAndView mav = new ModelAndView("jsonView");
        mav.setViewName("/page-donate");
        return mav;
    }

    /**
     * 일시후원 신청서 작성 화면 이동
     */
    @RequestMapping(value = "/member/page-donate-once")
    public ModelAndView goDonateOncePage() {
        ModelAndView mav = new ModelAndView();
        mav.setViewName("/page-donate-once");
        return mav;
    }

    /**
     * 후원 결제 정보 저장
     */
    @RequestMapping(value = "/member/save-donate-pay", method = RequestMethod.POST)
    public ModelAndView saveDonatePayInfo(@RequestParam(required = false) HashMap<String, Object> paramMap) throws Exception {
        ModelAndView mav = new ModelAndView("jsonView");
        HashMap<String, Object> info = donateService.insertDonateReqForm(paramMap);

        mav.addObject("donateSeq", info.get("ENC_DONATE_SEQ"));
        mav.addObject("code", "success");
        return mav;
    }
    /**
     * 후원 결제 화면 이동
     */
    @RequestMapping(value = "/member/donate-pay")
    public ModelAndView goDonatePayPage(@RequestParam(required = false) HashMap<String, Object> paramMap) throws Exception {
        ModelAndView mav = new ModelAndView("jsonView");
        HashMap<String, Object> info = donateService.selectDonateReqForm(paramMap);
        mav.addObject("result", info);
        return mav;
    }

}