package jaram.menu.web;

import jaram.cmm.util.Common;
import jaram.common.service.CommonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import java.util.HashMap;

/**
 * NOTE : 소통공간 컨트롤러
 * DATE : 2023.08.05
 */
@Controller
public class BizController extends Common {

    @Autowired
    CommonService commonService;

    /**
     *  사업영역
     */
    @RequestMapping(value = "/biz")
    public ModelAndView goBizPage(@RequestParam(required = true, value = "page") String page) throws Exception {
        ModelAndView mav = new ModelAndView();
        HashMap<String, Object> param = new HashMap<>();
        param.put("PAGE", page);
        mav.addObject("edtMessage",commonService.selectEditorMessage(param));
        mav.setViewName("/page-biz");
        mav.addObject("page", page);
        return mav;
    }

}
