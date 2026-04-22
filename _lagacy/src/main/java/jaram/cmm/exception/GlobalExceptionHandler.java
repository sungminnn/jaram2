package jaram.cmm.exception;


import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.nio.file.AccessDeniedException;

@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler {
    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    /**
     * javax.validation.Valid or @Validated 으로 binding error 발생시 발생한다.
     * HttpMessageConverter 에서 등록한 HttpMessageConverter binding 못할경우 발생
     * 주로 @RequestBody, @RequestPart 어노테이션에서 발생
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    protected ResponseEntity<ErrorResponse> handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {
        logger.error("handleMethodArgumentNotValidException", e);
        final ErrorResponse response = ErrorResponse.of(ErrorCode.INVALID_INPUT_VALUE, e.getBindingResult());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    /**
     * @ModelAttribut 으로 binding error 발생시 BindException 발생한다.
     * ref https://docs.spring.io/spring/docs/current/spring-framework-reference/web.html#mvc-ann-modelattrib-method-args
     */
    @ExceptionHandler(BindException.class)
    protected ResponseEntity<ErrorResponse> handleBindException(BindException e) {
        logger.error("handleBindException", e);
        final ErrorResponse response = ErrorResponse.of(ErrorCode.INVALID_INPUT_VALUE, e.getBindingResult());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    /**
     * enum type 일치하지 않아 binding 못할 경우 발생
     * 주로 @RequestParam enum으로 binding 못했을 경우 발생
     */
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    protected ResponseEntity<ErrorResponse> handleMethodArgumentTypeMismatchException(MethodArgumentTypeMismatchException e) {
        logger.error("handleMethodArgumentTypeMismatchException", e);
        final ErrorResponse response = ErrorResponse.of(e);
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    /**
     * 지원하지 않은 HTTP method 호출 할 경우 발생
     */
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    protected String handleHttpRequestMethodNotSupportedException(HttpRequestMethodNotSupportedException e) {
        logger.error("handleHttpRequestMethodNotSupportedException", e);
        final ErrorResponse response = ErrorResponse.of(ErrorCode.METHOD_NOT_ALLOWED);
        //return new ResponseEntity<>(response, HttpStatus.METHOD_NOT_ALLOWED);
        return "/error";
    }

    /**
     * Authentication 객체가 필요한 권한을 보유하지 않은 경우 발생합
     */
    @ExceptionHandler(AccessDeniedException.class)
    protected ResponseEntity<ErrorResponse> handleAccessDeniedException(AccessDeniedException e) {
        logger.error("handleAccessDeniedException", e);
        final ErrorResponse response = ErrorResponse.of(ErrorCode.HANDLE_ACCESS_DENIED);
        return new ResponseEntity<>(response, HttpStatus.valueOf(ErrorCode.HANDLE_ACCESS_DENIED.getStatus()));
    }

    @ExceptionHandler(BizException.class)
    protected ResponseEntity<ErrorResponse> handleBusinessException(final BizException e) {
        logger.error("handleBusinessException", e);
        final ErrorCode errorCode = e.getErrorCode();
        final ErrorResponse response = ErrorResponse.of(errorCode);

        //응답정보 중에 header에 데이터를 add해서 보낸다.
        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.add("Content-type", "text/html; charset=UTF-8");

        String msg = "<head>\n" +
                "\t<script src=\"https://code.jquery.com/jquery-3.6.0.min.js\" integrity=\"sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=\" crossorigin=\"anonymous\"></script>\n" +
                "\t<link rel=\"stylesheet\" href=\"assets/css/theme-temp.css\">\n" +
                "\t<link rel=\"stylesheet\" href=\"assets/css/jquery-confirm.min.css\">\n" +
                "\t<script src=\"assets/js/jquery-confirm.min.js\"></script>" +
                "<script>" +
                "$.confirm({\n" +
               "                  title: '알림'\n" +
               "                , content: \"" + e.getMessage() + "\"\n" +
               "                , buttons: {\n" +
               "                    confirm: {\n" +
               "                        text: '확인'\n" +
               "                        , btnClass: 'btn-blue'\n" +
               "                        , action: function () {\n" +
                "                           if( document.referrer && (document.referrer.indexOf('seoul-jaram') != -1 || document.referrer.indexOf('localhost') != -1 )){\n" +
               "                             //뒤로갈 히스토리가 있으면\n " +
               "                              window.history.back();\n" +
               "                           }else{\n"+
               "                               //없으면\n"+
               "                               location.href = '/'; \n"+
               "                           }\n"+
               "                        }\n" +
               "                    }\n" +
               "                }\n" +
               "            });" +
                "</script></head><body class='container'></body>";

        return new ResponseEntity(msg, responseHeaders, HttpStatus.valueOf(errorCode.getStatus()));
    }


    @ExceptionHandler(Exception.class)
    protected ResponseEntity<ErrorResponse> handleException(Exception e) {
        logger.error("Exception", e);

        //응답정보 중에 header에 데이터를 add해서 보낸다.
        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.add("Content-type", "text/html; charset=UTF-8");

        String errorMsg = "오류가 발생하였습니다.<br/>관리자에게 문의하세요";

        String msg = "<head>\n" +
                "\t<script src=\"https://code.jquery.com/jquery-3.6.0.min.js\" integrity=\"sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=\" crossorigin=\"anonymous\"></script>\n" +
                "\t<link rel=\"stylesheet\" href=\"assets/css/theme-temp.css\">\n" +
                "\t<link rel=\"stylesheet\" href=\"assets/css/jquery-confirm.min.css\">\n" +
                "\t<script src=\"assets/js/jquery-confirm.min.js\"></script>" +
                "<script>" +
                "$.confirm({\n" +
                "                  title: '알림'\n" +
                "                , content: \"" + errorMsg + "\"\n" +
                "                , buttons: {\n" +
                "                    confirm: {\n" +
                "                        text: '확인'\n" +
                "                        , btnClass: 'btn-blue'\n" +
                "                        , action: function () {\n" +
                "                           if( document.referrer && (document.referrer.indexOf('seoul-jaram') != -1 || document.referrer.indexOf('localhost') != -1 )){\n" +
                "                             //뒤로갈 히스토리가 있으면\n " +
                "                              window.history.back();\n" +
                "                           }else{\n"+
                "                               //없으면\n"+
                "                               location.href = '/'; \n"+
                "                           }\n"+
                "                        }\n" +
                "                    }\n" +
                "                }\n" +
                "            });" +
                "</script></head><body class='container'></body>";

        return new ResponseEntity(msg, responseHeaders, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
