/**
 * @FileName    jaram-common.js
 * @Creator     sungminnn
 * @CreateDate  2024-04-19
 * @Description 공통
 * 
 * 
 * @cfn_ajaxTransmit          Ajax 공통
 * @cfn_ajaxTransmitMain      Ajax 공통(callback 이름이 다름)
 * @cfn_checkFileName         파일 확장자 검사
 * 
 * @common.isNotEmpty         !빈 값 체크
 * @common.isEmpty            빈 값 체크
 * @common.formValidChk       input form 체크
 * @common.uploadChk          업로드 사이즈 체크
 * @common.phoneFormatter     전화번호 포맷 하이픈 리턴
 */

const token = $("meta[name='_csrf']").attr("content")
const header = $("meta[name='_csrf_header']").attr("content");

/**
 * Ajax 공통
 */
function cfn_ajaxTransmit(url, data, async, contentType) {
    async = async == null;
    let processData = typeof contentType === 'undefined';
    contentType = typeof contentType === 'undefined' ? "application/x-www-form-urlencoded; charset=UTF-8" : contentType;

    $.ajax({
        url: url
        , type: "post"
        , data: data
        , dataType: "json"
        , contentType: contentType
        , processData: processData
        , async: async
        , success: function (result, textStatus, data) {
            fn_callBack(url, result, textStatus);
        }
        , error: function (xhr, errorName, error) {
            fn_callBack(url, xhr, "error");
            $(".spinner-border").hide();
        }, beforeSend: function (xhr) {
            xhr.setRequestHeader(header, token);
            $(".spinner-border").show();
        }
        , complete: function () {
            $(".spinner-border").hide();
        }
    });
}


/**
 * Ajax 공통
 */
function cfn_ajaxTransmitMain(url, data, async, contentType) {
    async = async == null;
    let processData = typeof contentType === 'undefined';
    contentType = typeof contentType === 'undefined' ? "application/x-www-form-urlencoded; charset=UTF-8" : contentType;

    $.ajax({
        url: url
        , type: "post"
        , data: data
        , dataType: "json"
        , contentType: contentType
        , processData: processData
        , async: async
        , success: function (result, textStatus, data) {
            fn_callBackMain(url, result, textStatus);
        }
        , error: function (xhr, errorName, error) {
            fn_callBackMain(url, xhr, "error");
            $(".spinner-border").hide();
        }, beforeSend: function (xhr) {
            xhr.setRequestHeader(header, token);
            $(".spinner-border").show();
        }
        , complete: function () {
            $(".spinner-border").hide();
        }
    });
}

/**
 * 파일 확장자 검사
 */
function cfn_checkFileName(str) {
    //1. 확장자 체크
    var ext =  str.slice(str.indexOf(".")+1).toLowerCase();
    if($.inArray(ext, ['jpg', 'png', 'jpeg', 'gif']) === -1) {
        $.alert(ext+' 파일은 업로드 하실 수 없습니다.');
		return false;
    }
	return true;
}



let common = {
    /**
     * 빈 값 체크
     * @param value
     * @returns {boolean}
     */
    isNotEmpty: function (_str) {
        let obj = String(_str);
        if (obj === null || obj === undefined || obj === 'null' || obj === 'undefined' || obj === '') return false;
        else return true;

    }
    , isEmpty: function (_str) {
        return !common.isNotEmpty(_str);
    }

    /**
     * 휴대폰번호, 이메일 유효성 검증
     * @param value
     * @returns {boolean}
     */
    , formValidChk: function (form, _str) {
        let regExp;

        if (form === "email") {
            regExp = /^([0-9a-zA-Z_.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
        } else if (form === "phone") {
            regExp = /^(?:(010-\d{4})|(01[1|6|7|8|9]-\d{3,4}))-(\d{4})$/;
        }

        if (this.isNotEmpty(regExp) && !regExp.test(_str)) {
            return true;
        }
        return false;
    }
    /**
     * 파일업로드 사이즈 체크
     * @param element
     * @returns {boolean}
     */
    , uploadChk: function (element) {
        const file = element.files[0];
        const filename = file.name;

        // 1. 파일 선택 창에서 취소 버튼이 클릭된 경우
        if (!file) {
            filename.value = '';
            return false;
        }

        // 2. 파일 크기가 10MB를 초과하는 경우
        const fileSize = Math.floor(file.size / 1024 / 1024);
        if (fileSize > 10) {
            $.alert('10MB 이하의 파일로 업로드해 주세요.');
            filename.value = '';
            element.value = '';
            return false;
        }

        // 3. 파일명 지정
        filename.value = file.name;
    }
    /**
     * 핸드폰 포맷 리턴
     * @param num
     * @returns {*}
     */
    , phoneFormatter: function (num) {
        let formatNum = '';
        try {
            if (num.length === 11) {
                formatNum = num.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
            } else if (num.length === 8) {
                formatNum = num.replace(/(\d{4})(\d{4})/, '$1-$2');
            } else {
                if (num.indexOf('02') === 0) {
                    formatNum = num.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
                } else {
                    formatNum = num.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
                }
            }
        } catch (e) {
            formatNum = num;
        }
        return formatNum;
    }
};
