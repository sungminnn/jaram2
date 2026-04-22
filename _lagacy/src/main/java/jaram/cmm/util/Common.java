package jaram.cmm.util;

import jaram.cmm.login.CustomUser;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringEscapeUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.Field;
import java.nio.file.Files;
import java.util.*;
import java.util.stream.Stream;

@Component
public class Common {

    @Value("${spring.profiles.active}")
    private String mode;

    /**
     * request to hashmap
     *
     * @param request
     * @return HashMap<String, Object>
     */
    public HashMap<String, Object> getHashMap(HttpServletRequest request) {
        HashMap<String, Object> map = new HashMap<>();

        Enumeration<String> enumber = request.getParameterNames();

        while (enumber.hasMoreElements()) {
            String key = enumber.nextElement();
            String value = request.getParameter(key);

            map.put(key, value);
        }

        return map;
    }

    /**
     * object to hashmap
     *
     * @param obj
     * @return HashMap<String, Object>
     */
    public static HashMap<String, Object> ConverObjectToMap(Object obj) {
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            Field[] fields = obj.getClass().getDeclaredFields();
            for (int i = 0; i <= fields.length - 1; i++) {
                fields[i].setAccessible(true);
                resultMap.put(fields[i].getName(), fields[i].get(obj));
            }
        } catch (IllegalArgumentException | IllegalAccessException e) {
            e.printStackTrace();
        }
        return resultMap;
    }

    /**
     * 전달된 파라미터에 맞게 난수를 생성
     *
     * @param len   : 생성할 난수의 길이
     * @param dupCd : 중복 허용 여부 (1: 중복허용, 2:중복제거)
     */
    public static String getRandomNum(int len, int dupCd) {
        Random rand = new Random();
        StringBuilder numStr = new StringBuilder(); //난수가 저장될 변수

        for (int i = 0; i < len; i++) {
            //0~9 까지 난수 생성
            String ran = Integer.toString(rand.nextInt(10));

            if (dupCd == 1) {
                //중복 허용시 numStr에 append
                numStr.append(ran);
            } else if (dupCd == 2) {
                //중복을 허용하지 않을시 중복된 값이 있는지 검사한다
                if (!numStr.toString().contains(ran)) {
                    //중복된 값이 없으면 numStr에 append
                    numStr.append(ran);
                } else {
                    //생성된 난수가 중복되면 루틴을 다시 실행한다
                    i -= 1;
                }
            }
        }
        return numStr.toString();
    }

    /**
     * file to String
     *
     * @param filePath
     * @return
     * @throws IOException
     */
    public static String fileToString(String filePath) throws IOException {
        String content = "";

        ClassPathResource resource = new ClassPathResource(filePath);
        InputStream inputStream = resource.getInputStream();
        File file = File.createTempFile("email-templates", ".html");

        try {
            FileUtils.copyInputStreamToFile(inputStream, file);
        } finally {
            IOUtils.closeQuietly(inputStream);
        }

        Stream<String> lines = Files.lines(file.toPath());
        List<String> strArr = new ArrayList<>();
        lines.forEach(s -> strArr.add(s));

        for (String str : strArr) {
            content += str;
        }

        return content;
    }

    /**
     * get client ip
     */
    public static String getClientIP(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");

        if (ip == null) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null) {
            ip = request.getHeader("HTTP_CLIENT_IP");
        }
        if (ip == null) {
            ip = request.getHeader("HTTP_X_FORWARDED_FOR");
        }
        if (ip == null) {
            ip = request.getRemoteAddr();
        }

        return ip;
    }


    /**
     * 서버 모드 조회(local, prod)
     * @return
     */
    public String getServerMode(){
        return mode;
    }
    /**
     * 게시판별 기본 페이지 수
     * @return pageCnt
     */
    public static int getBoardPageCnt(String boardPage) {
        int pageCnt = 5;
        switch (boardPage) {
            case "notice":
            case "page-qna":
                pageCnt = 5;
                break;
            case "news":
                pageCnt = 2;
                break;
            case "gallery":
                pageCnt = 3;
                break;
            default:
                break;
        }
        return pageCnt;
    }

    /**
     * 로그인 아이디
     * @return loginId
     */
    public static String getLoginId(){
        SecurityContext context = SecurityContextHolder.getContext();
        Object principal = context.getAuthentication().getPrincipal();
        String loginId = "";

        if (principal != "anonymousUser") {
            //로그인 사용자인 경우
            CustomUser customUser = (CustomUser) principal;
            loginId = customUser.getUser().getEmail();
        }

        return loginId;
    }
}
