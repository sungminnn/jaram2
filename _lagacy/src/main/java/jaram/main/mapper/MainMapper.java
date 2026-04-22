package jaram.main.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;

@Mapper
@Repository
public interface MainMapper {

    HashMap<String, Object> selectCommunityNewCnt() throws Exception;

    List<HashMap<String, Object>> selectMainHeaderNews() throws Exception;

}