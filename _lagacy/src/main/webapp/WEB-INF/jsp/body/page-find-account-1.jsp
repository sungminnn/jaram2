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
			$(".form-control").on("focusout", function (e) {
				fn_showFormsOk(e, this);
			});
		});

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
		 * 계정 확인 전 valid check
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
		 * 이메일/연락처로 계정 조회
		 */
		function fn_nextPage() {
			if (fn_validation()) {
                $("#frm").submit();
            } else {
                return false;
            }
		}
	</script>
</head>

<body class="align-items-center min-h-100">
<!-- ========== MAIN CONTENT ========== -->
<main id="content" role="main" class="flex-grow-1 overflow-hidden ">
	<!-- Content -->
	<div class="container content-space-t-1 content-space-b-3">
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
									<form class="js-validate needs-validation" novalidate id="frm" action="/find-account-1"  method="post">
										<input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}">
										<div class="text-center">
											<div class="mb-5">
												<h4 class="card-title">이메일/비밀번호 찾기</h4>
											</div>
										</div>
										
										<!-- Form -->
										<div class="mb-4">
											<label class="form-label" for="username">이름</label>
											<input type="text" id="username"
											       class="form-control form-control-lg" name="username"
											       placeholder="" maxlength="10">
											<span class="form-feedback" id="username-feedback" name="feedback">이름을 입력하세요.</span>
										</div>
										<!-- End Form -->
										
										<!-- Form -->
										<div class="mb-4">
											<label class="form-label" for="email_phone">이메일 또는 연락처</label>
											<input type="text" class="form-control form-control-lg" name="email_phone"
											       placeholder="" id="email_phone">
											<span class="form-feedback" id="email_phone-feedback" name="feedback">이메일 또는 연락처를 입력하세요.</span>
										</div>
										<!-- End Form -->
										
										<div class="d-grid gap-4">
											<button type="button" class="btn btn-primary btn-lg"
											        onclick="fn_nextPage();">다음
											</button>
											<p class="card-text text-muted">계정을 찾으셨나요?
												<a class="link" href="/page-login-alone">로그인</a>
											</p>
										</div>
									</form>
									<!-- End Form -->
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

<!-- JS Plugins Init. -->
<script>
	(function () {
	})()
</script>
</body>
</html>
