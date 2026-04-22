package jaram.common.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;

@Mapper
@Repository
public interface CommonMapper {
    /* editior message merge */
    void insertEditorMessage(HashMap<String, Object> map) throws Exception;

    /* editor message delete */
    void deleteEditorMessage(HashMap<String, Object> map) throws Exception;

    /* editor message list 조회 */
    List<HashMap<String, Object>> selectEditorMessageList(HashMap<String, Object> map) throws Exception;

    /* editor message 상세 조회 */
    HashMap<String, Object> selectEditorMessage(HashMap<String, Object> map) throws Exception;

    /* file 저장 */
    void insertFileInfo(HashMap<String, Object> map) throws Exception;

    /* file list 조회 */
    List<HashMap<String, Object>> selectFileList(HashMap<String, Object> map) throws Exception;

    /* file 단건 조회 */
    HashMap<String, Object> selectOneFile(Long fileSeq) throws Exception;

    /* file 삭제 */
    void deleteFileInfo(HashMap<String, Object> map) throws Exception;

    /* 에러 로그  저장 */
    void insertErrorLog(HashMap<String, Object> map) throws Exception;

    /* 사이트 정책 조회 */
    HashMap<String, Object> selectSitePolicy(HashMap<String, Object> paramMap) throws Exception;

    /* 사이트 정책 목록 조회 */
    List<HashMap<String, Object>>  selectSitePolicyList() throws Exception;
}
