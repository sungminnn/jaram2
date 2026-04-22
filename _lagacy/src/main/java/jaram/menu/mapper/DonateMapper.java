package jaram.menu.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.HashMap;

@Mapper
@Repository
public interface DonateMapper {
    /* 후원신청서 저장 */
    void insertDonateReqForm(HashMap<String, Object> map) throws Exception;

    /* 후원신청서 암호화 시퀀스 저장 */
    void updateEncDonateSeq(HashMap<String, Object> map) throws Exception;

    /* 후원신청서 상세 조회 */
    HashMap<String, Object> selectDonateReqForm(HashMap<String, Object> map) throws Exception;

}