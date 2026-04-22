<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="kr">
<head>
	<script type="text/javascript">
		$(function () {
			//이메일 인증 hide
			$("#emailCertDiv").hide();
			$("#btnCheckEmail").hide();

			/**
			 * form control event validation
			 */
			$(".form-control").on("keydown focusout", function (e) {
				fn_showFormsOk(e, this);
			});

			/**
			 * terms checkbox click event
			 */
			$("#term-checkbox, #term1-checkbox").on("click", function (e) {
				fn_showTermsOk(this);
			});

			/**
			 *  add-term checkbox click event
			 */
			$("#add-term-checkbox, #sms-checkbox, #email-checkbox").on("click", function (e) {
				let id = $(this).attr("id");
				let isChecked = $(this).is(":checked");
				if (id === "add-term-checkbox") {
					$("#sms-checkbox").prop("checked", isChecked);
					$("#email-checkbox").prop("checked", isChecked);
					$("#sms-checkbox, #email-checkbox").val(isChecked === true ? 'Y' : 'N');
				} else {
					if (!$("#email-checkbox").is(":checked") && !$("#sms-checkbox").is(":checked")) {
						$("#add-term-checkbox").prop("checked", false);
					} else {
						$("#add-term-checkbox").prop("checked", true);
					}
					$("#" + id).val(isChecked === true ? 'Y' : 'N');
				}
			});
		});

		/**
		 * Ajax callback
		 */
		function fn_callBack(id, res, stat) {
			if (stat === "success") {
				//이메일 중복체크
				if (id === '/email-dup-check') {
					fn_showFeedback('email', res.msg);
					if (res.code === "okEmail") {
						$("#emailCertDiv").show();
					} else {
						$("#emailCertDiv").hide();
					}
					return false;
				}
				//이메일 인증코드 발송
				else if (id === '/send-cert-email') {
					if (res.code === 'success') {
						$.alert(res.msg);
						$("#btnSendMail").text("인증메일 재발송");
						$("#btnCheckEmail").show();
					}
				}
				//이메일 인증코드 확인
				else if (id === '/cert-check-email') {
					if (res.code === 'success') {
						$("#btnSendMail").text("인증완료").attr("disabled", true);
						$("#emailCertCode").val("인증되었습니다.").attr("readonly", true);
						$("#email").attr("readonly", true);
						$("#btnCheckEmail").hide();
					} else {
						$("#btnSendMail").text("인증메일 재발송");
						$.alert(res.msg);
					}
				}
			} else {
				if (id === '/email-dup-check') {
					$("#email").val("");
				}
			}
		}

		/**
		 * show feedback messages
		 */
		function fn_showFeedback(input, msg) {
			let feedback = $('#' + input + '-feedback');
			if (common.isNotEmpty(msg)) {
				if (input === 'email') {
					$("#emailCertDiv").hide();
				}
				feedback.show();
			} else {
				feedback.hide();
			}
			feedback.text(msg);
		}

		/**
		 * 회원가입 버튼
		 */
		function fn_signup() {
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

			//terms feedback check
			fn_showTermsOk($("#term-checkbox"));

			//terms feedback check
			fn_showTermsOk($("#term1-checkbox"));
			
			//email cert check
			if ($("#emailCertCode").val() !== "인증되었습니다.") {
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
					//이메일 중복체크
					if (id === 'email') {
						let data = {email: $("#email").val()};
						cfn_ajaxTransmit("/email-dup-check", data);
						return;
					} else if (id === "pwd") {
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

			} else if (e.type === "keydown") {
				//연락처 하이픈 자동완성
				if (id === "phone") {
					let key = e.charCode || e.keyCode || 0;
					let $text = $(form);
					if (key !== 8 && key !== 9) {
						if ($text.val().length === 3) {
							$text.val($text.val() + '-');
						}
						if ($text.val().length === 8) {
							$text.val($text.val() + '-');
						}
					}
					return (key === 8 || key === 9 || key === 46 || (key >= 48 && key <= 57) || (key >= 96 && key <= 105));
				}
			}
		}

		/**
		 * 약관동의 메시지
		 */
		function fn_showTermsOk(termCheck) {
			if ($(termCheck).is(':checked')) {
				//메시지 표시
				fn_showFeedback($(termCheck).attr("id").split('-')[0], "");
			} else {
				fn_showFeedback($(termCheck).attr("id").split('-')[0], "필수 약관에 동의해 주세요.");
			}
		}

		/**
		 * 인증 코드 이메일 전송
		 */
		function fn_sendCertEmail() {
			let data = {
				PAGE: 'SIGN-UP'
				, EMAIL: $("#email").val()
			};
			cfn_ajaxTransmit("/send-cert-email", data);
			return;
		}

		/**
		 * 인증 코드 이메일 인증확인
		 */
		function fn_certCheckEmail() {
			let data = {
				PAGE: 'SIGN-UP'
				, EMAIL: $("#email").val()
				, CERT_NUM: $("#emailCertCode").val()
			};
			cfn_ajaxTransmit("/cert-check-email", data);
			return;
		}

	</script>

</head>

<body class="align-items-center min-h-100">
<!-- ========== MAIN CONTENT ========== -->
<main id="content" role="main" class="flex-grow-1 overflow-hidden ">
	<!-- Content -->
	<div class="container content-space-t-1 content-space-b-3">
		<div class="mx-lg-auto">
			<div class="d-flex justify-content-center align-items-center flex-column">
				<!-- ========== HEADER ========== -->
				<header id="header" class="navbar navbar-height navbar-light mb-3">
					<div class="container">
						<a class="navbar-brand mx-auto" href="/" aria-label="Unify">
							<img class="navbar-brand-logo" src="assets/svg/logos/jaram-logo.png" alt="Image Description">
						</a>
					</div>
				</header>
				<!-- ========== END HEADER ========== -->
				
				<div class="position-relative w-xxl-65 w-xl-65">
					<!-- Card -->
					<div class="card card-shadow card-login">
						<div class="row">
							<div class="col-md-8">
								<div class="card-body">
									<!-- Form -->
									<form class="js-validate needs-validation" novalidate id="frm" action="/sign-up" method="post">
										<input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}">
										<label class="form-label" for="username">이름</label>
										
										<!-- Form -->
										<div class="row">
											<div class="col-sm-12">
												<!-- Form -->
												<div class="mb-4">
													<input type="text" id="username"
													       class="form-control form-control-lg" name="username" placeholder="홍길동" maxlength="10">
													<span class="form-feedback" id="username-feedback" name="feedback">이름을 입력하세요.</span>
												</div>
												<!-- End Form -->
											</div>
										</div>
										<!-- End Form -->
										
										<!-- Form -->
										<div class="mb-4">
											<label class="form-label" for="email">이메일</label>
											<input type="email" class="form-control form-control-lg" name="email" id="email" placeholder="gildong@email.com">
											<span class="form-feedback" id="email-feedback" name="feedback">이메일을 입력하세요.</span>
											
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
										
										<!-- Form -->
										<div class="mb-4">
											<label class="form-label" for="phone">연락처</label>
											<input type="text" class="form-control form-control-lg" name="phone" id="phone" placeholder="010-1234-5678" maxlength="13">
											<span class="form-feedback" id="phone-feedback" name="feedback">연락처를 입력하세요.</span>
										</div>
										<!-- End Form -->
										
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
										
										<!-- 이용약관 -->
										<div class="form-check">
											<input class="form-check-input" type="checkbox" value="" id="term1-checkbox">
											<label class="form-check-label" for="term1-checkbox"><a href="#"
											                                                       role="button"
											                                                       data-bs-toggle="collapse"
											                                                       data-bs-target="#collapseOne"
											                                                       aria-expanded="true"
											                                                       aria-controls="collapseOne">개인정보
												수집 및 이용</a>에 동의합니다.&nbsp;(필수)</label>
										</div>
										
										<div id="collapseOne" class="show mb-4 ">
											<label class="w100">
												<!-- 개인정보 취급방침 -->
												<textarea class="form-control no-resize-textarea fs-6" rows="4" readonly>
${policy[0].POLICY_CONTENT}
												</textarea>
											</label>
											<span class="form-feedback" id="term1-feedback" name="feedback">필수 약관에 동의해 주세요.</span>
										</div>
										<!-- End Form Check -->
										<!-- Form Check -->
										<div class="form-check">
											<input class="form-check-input" type="checkbox" value="" id="term-checkbox">
											<label class="form-check-label" for="term-checkbox"><a href="#"
											                                                       role="button"
											                                                       data-bs-toggle="collapse"
											                                                       data-bs-target="#collapseTwo"
											                                                       aria-expanded="true"
											                                                       aria-controls="collapseTwo">이용약관</a>에 동의합니다.&nbsp;(필수)</label>
										</div>
										
										<div id="collapseTwo" class="show mb-4 ">
											<label class="w100">
												<!-- 개인정보 취급방침 -->
												<textarea class="form-control no-resize-textarea fs-6" rows="4" readonly>
${policy[1].POLICY_CONTENT}
                                                </textarea>
											</label>
											<span class="form-feedback" id="term-feedback" name="feedback">필수 약관에 동의해 주세요.</span>
										</div>
										<!-- End Form Check -->
										
										<!-- Form Check -->
										<div class="form-check">
											<input class="form-check-input" type="checkbox" value="" id="add-term-checkbox">
											<label class="form-check-label" for="add-term-checkbox"><a href="#"
											                                                           role="button"
											                                                           data-bs-toggle="collapse"
											                                                           data-bs-target="#collapseThree"
											                                                           aria-expanded="true"
											                                                           aria-controls="collapseThree">마케팅
												활용 동의 및 광고 수신</a>에 동의합니다.&nbsp;(선택)</label>
										</div>
										
										<div id="collapseThree" class="show mb-4">
											<label class="w100">
												<!-- 마케팅 활용 동의 및 광고 수신 동의 -->
												<textarea class="form-control no-resize-textarea fs-6" rows="4"  readonly>
${policy[2].POLICY_CONTENT}
                            					</textarea>
											</label>
											
											<div class="form-check float-end">
												<input class="form-check-input" type="checkbox" value="" id="sms-checkbox" name="sms-checkbox">
												<label class="form-check-label" for="sms-checkbox">sms 수신 동의</label>
											</div>
											<div class="form-check float-end  me-2">
												<input class="form-check-input" type="checkbox" value="" id="email-checkbox" name="email-checkbox">
												<label class="form-check-label" for="email-checkbox">e-mail 수신
													동의</label>
											</div>
											
											<br/>
											<br/>
										</div>
										<!-- End Form Check -->
										
										<div class="d-grid gap-4">
											<button type="button" class="btn btn-primary btn-lg" onclick="fn_signup();">회원가입</button>
											<p class="card-text text-muted">이미 계정이 있습니까? <a class="link" href="/page-login-alone">로그인</a>
											</p>
										</div>
									</form>
									<!-- End Form -->
								</div>
							</div>
							<!-- End Col -->
							
							<div
									class="col-md-4 d-md-flex justify-content-center flex-column bg-soft-primary p-8 p-md-5"
									style="background-image: url(assets/svg/components/wave-pattern.svg);">
								<h5 class="mb-4">비영리민간단체 자람의 회원으로 모십니다.</h5>
								
								
								<%--								<!-- List Checked -->--%>
								<%--								<ul class="list-checked list-checked-primary list-py-2">--%>
								<%--									<li class="list-checked-item">일반회원</li>--%>
								<%--									<li class="list-checked-item">특별회원</li>--%>
								<%--									<li class="list-checked-item">정회원</li>--%>
								<%--								</ul>--%>
								<%--								<!-- End List Checked -->--%>
								
								<span class="d-block">
                      <a class="link link-pointer" href="#">자세히 보기</a>
                    </span>
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
