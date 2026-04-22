package jaram.user.mapper;

import jaram.cmm.login.User;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.HashMap;

@Mapper
@Repository
public interface UserMapper {
    int insertUserInfo(HashMap<String, Object> map) throws Exception;

    User getLoginUserInfo(HashMap<String, Object> map) throws Exception;

    HashMap<String, Object> getUserInfo(HashMap<String, Object> map) throws Exception;

    HashMap<String, Object> getOAuthUserInfo(Object object) throws Exception;

    int getEmailDupChk (String userId) throws Exception;

    int insertPhoneAuthNum (HashMap<String, Object> map) throws Exception;

    /**
     * 인증코드 이메일 저장
     */
    int insertEmailCertNum(HashMap<String, Object> map) throws Exception;

    /**
     * 인증코드 조회
     */
    HashMap<String, Object> selectEmailCertNum(HashMap<String, Object> map) throws Exception;

    /**
     * 인증코드 인증 완료 여부 변경
     */
    int updateEmailCertYn(HashMap<String, Object> map) throws Exception;

    /**
     * 인증여부 조회
     */
    HashMap<String, Object> selectEmailConfirm(HashMap<String, Object> map) throws Exception;

    /**
     * 비밀번호 변경
     */
    int updateUserPwd(HashMap<String, Object> map) throws Exception;



}