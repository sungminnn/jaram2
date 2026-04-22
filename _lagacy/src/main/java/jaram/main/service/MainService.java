package jaram.main.service;


import jaram.main.mapper.MainMapper;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;

@Service
public class MainService {

    private final MainMapper mainMapper;

    public MainService(MainMapper mainMapper) {
        this.mainMapper = mainMapper;
    }

    /**
     * 소통공간 게시글 신규 여부
     */
    public HashMap<String, Object> selectCommunityNewCnt() throws Exception {
        return mainMapper.selectCommunityNewCnt();
    }

    /**
     * 메인 헤더 새소식 2개
     */
    public List<HashMap<String, Object>> selectMainHeaderNews() throws Exception {
        return mainMapper.selectMainHeaderNews();
    }
}
