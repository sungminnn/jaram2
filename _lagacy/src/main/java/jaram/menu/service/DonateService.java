package jaram.menu.service;


import jaram.cmm.login.CustomUser;
import jaram.common.service.CommonService;
import jaram.menu.mapper.DonateMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.HashMap;

@Service
public class DonateService {


    @Autowired
    CommonService commonService;

    private final DonateMapper donateMapper;

    public DonateService(DonateMapper donateMapper) {
        this.donateMapper = donateMapper;
    }

    /**
     * 후원신청서 저장
     */
    public HashMap<String, Object> insertDonateReqForm(HashMap<String, Object> param) throws Exception {
        SecurityContext context = SecurityContextHolder.getContext();
        Object principal = context.getAuthentication().getPrincipal();

        if (principal != "anonymousUser") {
            //로그인 사용자인 경우
            CustomUser customUser = (CustomUser) principal;
            param.put("INPUT_ID", customUser.getUser().getEmail());
            param.put("INPUT_NAME", customUser.getUser().getUsername());
        }

        //후원신청서 생성
        donateMapper.insertDonateReqForm(param);
        //후원신청서 암호화 시퀀스 저장
        donateMapper.updateEncDonateSeq(param);

        return donateMapper.selectDonateReqForm(param);
    }

    /**
     * 후원신청서 상세 조회
     */
    public HashMap<String, Object> selectDonateReqForm(HashMap<String, Object> param) throws Exception {
        return donateMapper.selectDonateReqForm(param);
    }
}
