<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="s" uri="http://www.springframework.org/security/tags" %>
<!DOCTYPE html>
<html lang="kr">
<head>
	
	<script>

		$(function () {
			/**
			 * form control event validation
			 */
			$(".form-control").on("keydown focusout", function (e) {
				fn_showFormsOk(e, this);
			});
		});


		/**
		 * 로그인 버튼
		 */
		function fn_login() {
			if (fn_validation()) {
				$("#frm").submit();
			} else {
				return false;
			}
		}

		/**
		 * 회원가입 전 valid check
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
				}

				//메시지 표시
				fn_showFeedback(id, msg);
			}
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
	</script>

</head>

<body class="align-items-center min-h-100">

<!-- ========== MAIN CONTENT ========== -->
<main id="content" role="main" class="flex-grow-1 overflow-hidden ">
	<!-- Content -->
	<div class="container" style="padding-right: 0px; padding-left:0px;">
		<div class="mx-lg-auto">
			<div class="d-flex justify-content-center flex-column">
				<div class="position-relative">
					<!-- Card -->
					<div class="card card-shadow card-login">
						
						<h3 class="mx-sm-7 mb-2 mt-4 text-center" style="border-bottom: 1px solid #dddddd;padding-bottom: 20px;">
							<img src="assets/img/custom/logo-only-image.png">
							로그인</h3>
						
						<div class="row">
							<div class="col-md-12">
								<div class="card-body">
									<!-- Form -->
									<form class="js-validate needs-validation" novalidate id="frm" method="post" action="/login">
										<input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}">
										<!-- Form -->
										<div class="mb-4">
											<label class="form-label" for="email">이메일</label>
											<input type="email" class="form-control form-control-lg" name="email"
											       id="email" tabindex="1" placeholder="email@address.com"
											       aria-label="email@address.com">
											<span class="form-feedback" id="email-feedback"
											      name="feedback"> 이메일을 입력하세요.</span>
										</div>
										<!-- End Form -->
										
										<!-- Form -->
										<div class="mb-4">
											<label class="form-label" for="pwd" tabindex="0">비밀번호</label>
											
											<div class="input-group-merge">
												<input type="password"
												       class="js-toggle-password form-control form-control-lg"
												       name="pwd" id="pwd" tabindex="2" placeholder="8자리 이상 입력"
												       aria-label="8자리 이상 입력" autocomplete="off"
												       data-hs-toggle-password-options='{
                                   "target": "#changePassTarget",
                                   "defaultClass": "bi-eye-slash",
                                   "showClass": "bi-eye",
                                   "classChangeTarget": "#changePassIcon"
                                 }'>
												<a id="changePassTarget" class="input-group-append input-group-text"
												   href="javascript:;">
													<i id="changePassIcon" class="bi-eye"></i>
												</a>
											</div>
											<span class="form-feedback" id="pwd-feedback"
											      name="feedback">비밀번호를 입력하세요.</span>
										</div>
										<!-- End Form -->
										
										<div class="d-flex justify-content-end mb-4">
											<a class="form-label-link" href="/page-find-account-1">아이디/비밀번호 찾기</a>
										</div>
										
										${exception}
										<c:if test="${exception != null }">
											dddd
										</c:if>
										
										<!-- 에러 메세지가 null이 아니면 -->
										<span id="err-msg" class="text-danger fw-bold my-sm-4">
										<c:if test="${not empty SPRING_SECURITY_LAST_EXCEPTION }">
                                          <c:out escapeXml="false" value="${fn:replace(SPRING_SECURITY_LAST_EXCEPTION.message, LF, '<br>')}"/>
										<c:remove var="SPRING_SECURITY_LAST_EXCEPTION" scope="session"/>
										</c:if>
										</span>
										
										<div class="d-grid gap-4">
											<button type="button" class="btn btn-primary btn-lg" onclick="fn_login();">
												로그인
											</button>
											<p class="card-text text-muted">아직 회원이 아니세요?<a class="link" href="/page-signup">&nbsp;회원가입</a>
											</p>
										</div>
									</form>
									<!-- End Form -->
								</div>
							</div>
							<!-- End Col -->
						</div>
						<!-- End Row -->
					</div>
					<!-- End Card -->
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
