package jaram.cmm.exception;
import com.fasterxml.jackson.annotation.JsonFormat;

@JsonFormat(shape = JsonFormat.Shape.OBJECT)
public enum ErrorCode {

    // Common
    INVALID_INPUT_VALUE(400, "C001", " Invalid Input Value"),
    METHOD_NOT_ALLOWED(405, "C002", " Invalid Input Value"),
    ENTITY_NOT_FOUND(400, "C003", " Entity Not Found"),
    INTERNAL_SERVER_ERROR(500, "C004", "잘못된 경로로 접근하였습니다."),
    INVALID_TYPE_VALUE(400, "C005", " Invalid Type Value"),
    HANDLE_ACCESS_DENIED(403, "C006", "Access is Denied"),


    // Board
    INVALID_QNA_PASSWORD(400, "B001", "비밀번호가 일치하지 않습니다."),
    INVALID_BOARD_NUM(400, "B002", "존재하지 않는 게시물입니다."),
    BOARD_NOT_ALLOWED(400, "B003", "권한이 없습니다."),
    INVALID_COMMENT_SEQ(400, "B004", "존재하지 않는 댓글입니다."),
    ;

    private final String code;
    private final String message;
    private final int status;

    ErrorCode(final int status, final String code, final String message) {
        this.status = status;
        this.message = message;
        this.code = code;
    }

    public String getMessage() {
        return this.message;
    }

    public String getCode() {
        return code;
    }

    public int getStatus() {
        return status;
    }


}