package jaram.cmm.exception;

import jaram.cmm.util.Common;
import jaram.common.service.CommonService;
import jaram.user.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;

/**
 * NOTE : Error 컨트롤러
 * DATE : 2023.07.19
 */
@Controller
public class ErrorController implements org.springframework.boot.web.servlet.error.ErrorController {
    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    CommonService commonService;

    @RequestMapping("/error")
    public ModelAndView handleNoHandlerFoundException(HttpServletResponse response, HttpServletRequest request) throws Exception {
        ModelAndView mav = new ModelAndView("jsonView");
        HashMap<String, Object> param = new HashMap<>();
        int status = response.getStatus();
        logger.error("status : " + status);
        mav.setViewName("/error");
        return mav;
    }
}