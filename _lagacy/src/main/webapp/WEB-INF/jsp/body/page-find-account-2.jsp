<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="s" uri="http://www.springframework.org/security/tags" %>
<!DOCTYPE html>
<html lang="kr">
<head>
	<script>
		$(function () {
            $("#btnCheckEmail").hide();
            $("#divConfirm").hide();

            /**
             * form control event validation
             */
            $(".form-control").on("focusout", function (e) {
                fn_showFormsOk(e, this);
            });

        });

        /**
         * Ajax callback
         */
        function fn_callBack(id, res, stat) {
            if (stat === "success") {
                //이메일 인증코드 발송
                if (id === '/send-cert-email')
                {
                    if( res.code === 'success' ){
                        $.alert(res.msg);
                        $("#btnSendMail").text("인증메일 재발송");
                        $("#btnCheckEmail").show();
                    }
                }
                //이메일 인증코드 확인
                else if( id === '/cert-check-email')
                {
                    if( res.code === 'success' ){
                        $("#btnSendMail").text("인증완료");
                        $("#btnSendMail").attr("disabled", true);
                        $("#emailCertCode").val("인증되었습니다.");
                        $("#emailCertCode").attr("readonly", true);
                        $("#email").attr("readonly", true);
                        $("#btnCheckEmail").hide();
                        $("#divConfirm").show();
                    }else{
                        $.alert(res.msg);
                        $("#btnSendMail").text("인증메일 재발송");
                    }
                }
                //비밀번호 재설정 후 로그인 페이지 이동
	            else if( id === '/re-save-pwd' )
	            {
                    $.alert(res.msg);
                    if( res.code === 'success' ){
                        location.href = '/page-login-alone';
                    }
                }
            } else {
                $.alert(id + "\n" + res + "\n" + stat);
            }
        }

        /**
         * 인증 코드 이메일 전송
         */
        function fn_sendCertEmail() {
            let data = {
                  PAGE  : 'FIND_PW'
                , EMAIL : $("#email").val()
            };
            cfn_ajaxTransmit("/send-cert-email", data);
            return;
        }

        /**
         * 비밀번호 변경 ajax
         */
        function fn_reSavePwd() {
            if(!fn_validation()){
                return false;
            }
            let data = {
                  PWD   : $("#pwd").val()
	            , EMAIL : $("#email").val()
            };
            cfn_ajaxTransmit("/re-save-pwd", data);
            return;
        }

        /**
         * 인증 코드 이메일 인증확인
         */
        function fn_certCheckEmail(){
            let data = {
                  PAGE     : 'FIND_PW'
                , EMAIL    : $("#email").val()
                , CERT_NUM : $("#emailCertCode").val()
            };
            cfn_ajaxTransmit("/cert-check-email", data);
            return;
        }

        /**
         * show feedback messages
         */
        function fn_showFeedback(input, msg) {
            let feedback = $('#' + input + '-feedback');
            if (common.isNotEmpty(msg)) {
                feedback.show();
            } else {
                feedback.hide();
            }
            feedback.text(msg);
        }


        /**
         * 비밀번호 설정 전 valid check
         */
        function fn_validation() {
            let result = true;

            //form feedback check
            $("span[name=feedback]").each(function (index, item) {
                if (common.isNotEmpty($(item).text())) {
                    result = false;
                    $(item).show();
                }
            });

            //email cert check
            if( $("#emailCertCode").val() != "인증되었습니다." ) {
                $.alert("이메일 인증을 완료해주세요.");
                return false;
            }

            return result;
        }

        /**
         * form show messages
         */
        function fn_showFormsOk(e, form) {
            let id = form.id;
            let idName = $("label[for=" + id + "]").text();
            let msg = "";

            if (e.type === "focusout") {
                //입력값 유효성 검증
                if (common.isEmpty(form.value)) {
                    msg = idName + "(을)를 입력해주세요.";
                } else if (common.formValidChk(id, form.value)) {
                    msg = "올바른 " + idName + " 형식이 아닙니다.";
                } else {
                    if (id === "pwd") {
                        if (form.value.length < 8 || form.value.length > 20) {
                            msg = "8자리 ~ 20자리 이내로 입력해주세요.";
                        }
                    } else if (id === "pwd2") {
                        if (form.value !== $("#pwd").val()) {
                            msg = "비밀번호가 일치하지 않습니다.";
                        }
                    } else {
                        msg = "";
                    }
                }

                //메시지 표시
                fn_showFeedback(id, msg);
            }
        }



	</script>
</head>

<body class="align-items-center min-h-100">
<!-- ========== MAIN CONTENT ========== -->
<main id="content" role="main" class="flex-grow-1 overflow-hidden ">
	<!-- Content -->
	<div class="container content-space-t-3 content-space-b-3">
		<div class="mx-lg-auto" style="max-width: 55rem;">
			<div class="d-flex justify-content-center align-items-center flex-column">
				<!-- ========== HEADER ========== -->
				<header id="header" class="navbar navbar-height navbar-light mb-3">
					<div class="container">
						<a class="navbar-brand mx-auto" href="/" aria-label="Unify">
							<img class="navbar-brand-logo" src="assets/svg/logos/jaram-logo.png" alt="로고">
						</a>
					</div>
				</header>
				<!-- ========== END HEADER ========== -->
				
				<div class="position-relative col-md-6">
					<!-- Card -->
					<div class="card card-shadow card-login">
						<div class="row">
								<div class="card-body">
									<!-- Form -->
									<form class="js-validate needs-validation" novalidate id="frm" action="/find-account-2"  method="post">
										<input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}">
										<div class="text-center">
											<div class="mb-5">
												<h4 class="card-title">이메일/비밀번호 찾기</h4>
											</div>
										</div>

										<c:if test="${EMAIL == null}">
											<div style="text-align:center;">
												<h6 class="d_inline">회원가입 정보가 없습니다.</h6>
												<a href="/page-find-account-1" class="link-primary link-bordered d_inline">다시 시도</a>
											</div>
										</c:if>

										<c:if test="${EMAIL != null}">

										<!-- Form -->
										<div class="mb-4" >
											<label class="form-label" for="email">가입된 이메일</label>
											<input type="text" class="form-control form-control-lg" name="email"
											       placeholder="" id="email" value="<c:out value="${EMAIL}"/>" disabled>
											<div class="input-card input-card-sm my-1" id="emailCertDiv" style="padding:0px;">
												<button type="button" class="btn btn-soft-info" onclick="fn_sendCertEmail();"
												        id="btnSendMail"
												        style="margin:5px;--bs-btn-border-width: 0rem;">인증메일 발송
													<i class="bi-envelope-check ms-1"></i>
												</button>
												<div class="input-card-form" style="padding:0px !important;">
													<input type="text" class="form-control form-control-lg" placeholder="인증코드를 입력하세요." id="emailCertCode" name="emailCertCode" maxlength="4">
												</div>
												<button type="button" class="btn btn-soft-info"
												        id="btnCheckEmail" onclick="fn_certCheckEmail();"
												        style="margin:5px;--bs-btn-border-width: 0rem;">확인
												</button>
											</div>
										</div>
										<!-- End Form -->

										<div id="divConfirm">
											<!-- Form -->
											<div class="mb-4">
												<label class="form-label" for="pwd">비밀번호</label>

												<div class="input-group-merge">
													<input type="password"
													       class="js-toggle-password form-control form-control-lg"
													       name="pwd" id="pwd" placeholder="8자리 이상 입력하세요."
													       data-hs-toggle-password-options='{
                                                                                         "target": [".js-toggle-password-target-1", ".js-toggle-password-target-2"],
                                                                                         "defaultClass": "bi-eye-slash",
                                                                                         "showClass": "bi-eye",
                                                                                         "classChangeTarget": ".js-toggle-password-show-icon-1"
                                                                                       }'>
													<a class="js-toggle-password-target-1 input-group-append input-group-text"
													   href="javascript:;">
														<i class="js-toggle-password-show-icon-1 bi-eye"></i>
													</a>
												</div>
												<span class="form-feedback" id="pwd-feedback" name="feedback">올바른 비밀번호가 아닙니다. 다시 입력하세요.</span>
											</div>
											<!-- End Form -->

											<!-- Form -->
											<div class="mb-4">
												<label class="form-label" for="pwd2">비밀번호 확인</label>

												<div class="input-group-merge">
													<input type="password"
													       class="js-toggle-password form-control form-control-lg"
													       name="confirmPassword" id="pwd2"
													       placeholder="8자리 이상 입력하세요." aria-label="8자리 이상 입력하세요."
													       data-hs-toggle-password-options='{
                                                                                         "target": [".js-toggle-password-target-1", ".js-toggle-password-target-2"],
                                                                                         "defaultClass": "bi-eye-slash",
                                                                                         "showClass": "bi-eye",
                                                                                         "classChangeTarget": ".js-toggle-password-show-icon-2"
                                                                                       }'>
													<a class="js-toggle-password-target-2 input-group-append input-group-text"
													   href="javascript:;">
														<i class="js-toggle-password-show-icon-2 bi-eye"></i>
													</a>
												</div>
												<span class="form-feedback" id="pwd2-feedback" name="feedback">비밀번호가 일치하지 않습니다. 다시 입력하세요.</span>
											</div>
											<!-- End Form -->
											<button type="button" class="btn btn-primary btn-lg w100" onclick="fn_reSavePwd();">비밀번호재설정</button>
										</div>

										</c:if>
									</form>
									<!-- End Form -->
									<p class="card-text text-muted form-text">계정을 찾으셨나요?
										<a class="link" href="/page-login-alone">로그인</a>
									</p>
								</div>
							<!-- End Col -->

						</div>
						<!-- End Row -->
					</div>
					<!-- End Card -->
					
					<!-- SVG Shape -->
					<figure class="position-absolute top-0 end-0 zi-n1 d-none d-sm-block mt-n7 me-n10"
					        style="width: 4rem;">
						<img class="img-fluid" src="assets/svg/components/pointer-up.svg" alt="Image Description">
					</figure>
					<!-- End SVG Shape -->
					
					<!-- SVG Shape -->
					<figure class="position-absolute bottom-0 start-0 d-none d-sm-block ms-n10 mb-n10"
					        style="width: 15rem;">
						<img class="img-fluid" src="assets/svg/components/curved-shape.svg" alt="Image Description">
					</figure>
					<!-- End SVG Shape -->
				</div>
			</div>
		</div>
	</div>
	<!-- End Content -->
</main>
<!-- ========== END MAIN CONTENT ========== -->
<!-- JS Implementing Plugins -->
<script src="assets/vendor/hs-toggle-password/dist/js/hs-toggle-password.js"></script>

<!-- JS Plugins Init. -->
<script>
    (function () {
        // INITIALIZATION OF TOGGLE PASSWORD
        // =======================================================
        new HSTogglePassword('.js-toggle-password')
    })()
</script>
</body>
</html>
