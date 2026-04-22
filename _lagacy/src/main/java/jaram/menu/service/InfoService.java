package jaram.menu.service;


import jaram.menu.mapper.InfoMapper;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;

@Service
public class InfoService  {

    private final InfoMapper infoMapper;

    public InfoService(InfoMapper infoMapper) {
        this.infoMapper = infoMapper;
    }


}
