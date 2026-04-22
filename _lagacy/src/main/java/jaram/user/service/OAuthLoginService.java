package jaram.user.service;


import jaram.cmm.util.Constants;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Service
public class OAuthLoginService implements OAuth2UserService<OAuth2UserRequest, OAuth2User>{

    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2UserService<OAuth2UserRequest, OAuth2User> delegate = new DefaultOAuth2UserService();
        OAuth2User oAuth2User = delegate.loadUser(userRequest);

        // OAuth2 서비스 id (구글, 카카오, 네이버)
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        // OAuth2 로그인 진행 시 키가 되는 필드 값(PK)
        String userNameAttributeName = userRequest.getClientRegistration().getProviderDetails().getUserInfoEndpoint().getUserNameAttributeName();
        // OAuth2 반환하는 유저 정보 Map
        Map<String, Object> map = new HashMap<String, Object>();

        try {
            map = setUserInfo(oAuth2User.getAttributes(), registrationId);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return new DefaultOAuth2User(Collections.singleton(new SimpleGrantedAuthority(Constants.MEMBER)), map, userNameAttributeName);
    }


    public Map<String, Object> setUserInfo(Map<String, Object> map, String registrationId) throws Exception {
        Map<String, Object> resultMap = new HashMap<>();

        try {
            //GOOGLE
            if (("google").equals(registrationId)) {
                resultMap.put("sub", map.get("name"));
                resultMap.put("name", map.get("name"));
                resultMap.put("email", map.get("email"));
                resultMap.put("oAuthKey", map.get("sub"));
                resultMap.put("oAuthType", "G");
            }
            //NAVER
            else if (("naver").equals(registrationId)) {
                Map<String, Object> response = (Map<String, Object>) map.get("response");
                resultMap.put("response", response.get("name"));
                resultMap.put("name", response.get("name"));
                resultMap.put("email", response.get("email"));
                resultMap.put("mobile", response.get("mobile"));
                resultMap.put("oAuthKey", response.get("id"));
                resultMap.put("oAuthType", "N");
            }
            //KAKAO
            else if (("kakao").equals(registrationId)) {
                Map<String, Object> kakao_account = (Map<String, Object>) map.get("kakao_account");
                Map<String, Object> profile = (Map<String, Object>) kakao_account.get("profile");
                resultMap.put("id", map.get("id"));
                resultMap.put("name", profile.get("nickname"));
                resultMap.put("email", kakao_account.get("email"));
                resultMap.put("oAuthKey", map.get("id"));
                resultMap.put("oAuthType", "K");
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
        return resultMap;

    }
}
