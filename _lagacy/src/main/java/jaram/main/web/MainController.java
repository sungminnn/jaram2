package jaram.main.web;

import jaram.common.service.CommonService;
import jaram.main.service.MainService;
import jaram.menu.service.InfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import java.util.HashMap;

@Controller
public class MainController {

    @Autowired
    MainService mainService;

    @Autowired
    CommonService commonService;

    @Autowired
    InfoService infoService;

    /**
     * 메인 화면
     */
    @RequestMapping(value = "/")
    public ModelAndView main() {
        SecurityContext context = SecurityContextHolder.getContext();
        ModelAndView mav = new ModelAndView();

        HashMap<String, Object> result;
        HashMap<String, Object> param = new HashMap<>();
        param.put("PAGE", "news");
        result = commonService.selectEditorMessagePagingList(param);

        mav.addObject("newsList", result.get("list"));
        mav.addObject("newsPageInfo", result.get("pageInfo"));

        mav.setViewName("/index");
        return mav;
    }

    /**
     * 메인 화면
     */
    @RequestMapping(value = "/main-header", method = RequestMethod.POST)
    public ModelAndView getMainHeaderData() throws Exception {
        ModelAndView mav = new ModelAndView("jsonView");
        mav.addObject("communityNew", mainService.selectCommunityNewCnt());
        mav.addObject("communityNews", mainService.selectMainHeaderNews());
        return mav;
    }

}
