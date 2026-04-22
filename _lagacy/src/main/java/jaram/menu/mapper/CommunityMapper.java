package jaram.menu.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;

@Mapper
@Repository
public interface CommunityMapper {

    int updateViewCnt(HashMap<String, Object> param) throws Exception;

    int updateNowSession(HashMap<String, Object> param) throws Exception;

    int insertComment(HashMap<String, Object> param) throws Exception;
    
    /* 댓글 목록조회 */
    List<HashMap<String, Object>> selectCommentList(HashMap<String, Object> map) throws Exception;

    /* 댓글 조회 */
    HashMap<String, Object> selectComment(HashMap<String, Object> map) throws Exception;

    /* 댓글 삭제 */
    int deleteComment(HashMap<String, Object> param) throws Exception;

    /* 댓글 수정 */
    int updateComment(HashMap<String, Object> param) throws Exception;
}
