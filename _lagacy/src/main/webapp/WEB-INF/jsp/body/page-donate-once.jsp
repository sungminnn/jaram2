<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="s" uri="http://www.springframework.org/security/tags" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<html lang="en">
<head>
	<script>
		$(function () {
			$("#phone").val(common.phoneFormatter("<s:authentication property='principal.user.phone'/>"));
			$("#resiNumDiv").hide();
			/**
			 * form control event validation
			 */
			$(".form-control, .form-select").on("keydown focusout change", function (e) {
				fn_showFormsOk(e, this);
			});

			/**
			 * radio event validation
			 */
			$("input[type='radio'], input[type='checkbox']").on("change", function (e) {
				fn_showFormChecksOk(e, this);
			});

		});


		/**
		 * 후원신청 버튼
		 */
		function fn_donatePay() {
			if (fn_validation()) {
				$("#donateSurvey01").val($("input[name='donateSurvey01rdo']:checked").val());
				$("#donateSurvey02").val($("input[name='donateSurvey02rdo']:checked").val());

				let data = {
			          REQ_NAME: $("#username").val()
					, REQ_PHONE: $("#phone").val()
					, REQ_EMAIL: $("#email").val()
					, DONATE_AMOUNT: $("#donateAmount").val()
					, DONATE_SURVEY_01: $("#donateSurvey01").val()
					, DONATE_SURVEY_TEXT_01: $("#donateSurveyText01").val()
					, DONATE_SURVEY_02: $("#donateSurvey01").val()
					, DONATE_SURVEY_TEXT_02: $("#donateSurveyText01").val()
					, RESI_NUM: $("#resiNum").val()
				};
				cfn_ajaxTransmit("/member/donate-pay", data);
			}
			return false;
		}

		/**
		 * show feedback messages
		 */
		function fn_showFeedback(input, msg) {
			let feedback = $('#' + input + '-feedback');
			if (common.isNotEmpty(msg)) {
				feedback.show();
			} else {
				feedback.text("");
				feedback.hide();
			}
			feedback.text(msg);
		}

		/**
		 * 후원신청 전 valid check
		 */
		function fn_validation() {
			let result = true;

			//form feedback check
			$("span[name=feedback]").each(function (index, item) {
				let id = $(item).attr("id").split('-')[0];
				let itemVal = $("#" + id).val();
				if (common.isEmpty(itemVal)) {
					if (id === 'resiNum' && $("input[name=donateReceipt]:checked").val() === 'N') {
						//기부금영수증 신청 시 주민등록번호 입력
						result = true;
						$(item).hide();
					} else if (id === 'donateSurvey01rdo' && $("input[name='donateSurvey01rdo']:checked").val() !== undefined) {
						//후원설문 미선택 시
						result = true;
						$(item).hide();
					} else if (id === 'donateSurvey02rdo' && $("input[name='donateSurvey02rdo']:checked").val() !== undefined) {
						//후원설문 미선택 시
						result = true;
						$(item).hide();
					} else {
						result = false;
						$(item).show();
					}
				}
			});

			//terms feedback check
			fn_showTermsOk();

			return result;
		}

		/**
		 * form check onchange
		 */
		function fn_showFormChecksOk(e, form) {
			let name = form.name;
			let checkedVal = $("input[name='" + name + "']:checked").val();
			if (name === "donateReceipt") {
				if (checkedVal === 'Y') {
					$("#resiNumDiv").show();
				} else {
					$("#resiNumDiv").hide();
				}
			} else if (name === 'terms') {
				fn_showTermsOk();
			} else if (name === 'donateSurvey01rdo' || name === 'donateSurvey02rdo') {
				if (checkedVal === undefined) {
					$("#" + name + "-feedback").show();
				} else {
					$("#" + name + "-feedback").hide();
				}
			}
		}

		/**
		 * form keydown, focusout
		 */
		function fn_showFormsOk(e, form) {
			let id = form.id;
			let idName = $("label[for=" + id + "]").text();
			let msg = "";
			if (e.type === "focusout" || e.type === "change") {
				//입력값 유효성 검증
				if (common.isEmpty(form.value)) {
					msg = idName + "(을)를 입력해주세요.";
				} else if (common.formValidChk(id, form.value)) {
					msg = "올바른 " + idName + " 형식이 아닙니다.";
				} else {
					msg = "";
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
		function fn_showTermsOk() {
			if ($("#terms").is(':checked')) {
				//메시지 표시
				fn_showFeedback("terms", "");
			} else {
				fn_showFeedback("terms", "필수 안내사항에 동의해 주세요.");
			}
		}

		/**
		 * Ajax callback
		 */
		function fn_callBack(id, res, stat) {
			if (stat === "success") {
				//오더번호 생성
				if (id === '/member/save-donate-pay') {
					$("#ENC_DONATE_SEQ").val(res.ENC_DONATE_SEQ);
					$("#frm").submit();
				}
			}
		}
	</script>
</head>

<body>

<!-- ========== MAIN CONTENT ========== -->
<main id="content" role="main">
	<form action="/member/donate-pay" id="frm">
		<input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}">
		<input type="hidden" id="ENC_DONATE_SEQ" name="ENC_DONATE_SEQ">
		<!-- Content -->
		<div class="container content-space-2 content-space-lg-3">
			<div class="w-lg-75 mx-lg-auto">
				<!-- Card -->
				<div class="card card-lg card-shadow">
					<!-- Header -->
					<div class="card-header bg-dark">
						<h1 class="card-title h2 text-white">일시후원 신청서</h1>
						<p class="card-text text-white">비영리민간단체 자람을 일시적으로 후원해주시기 위해 필요한 양식입니다.</p>
					</div>
					<!-- End Header -->
					
					<!-- Card Body -->
					<div class="card-body">
						<!-- Contact Form -->
						<div class="container">
							<div class="row mb-10">
								<div class="col-lg-6 mb-10 mb-lg-0 ">
									<div class="card-shadow">
										<img class="img-fluid" width="73%" src="/assets/img/others/donate3.jpg"
										     alt="Image Description">
									</div>
								</div>
								<!-- End Col -->
								<div class="col-lg-6">
									<div class="position-relative">
										<!-- Card -->
										<div class="card card-lg">
											<!-- Card Body -->
											<div class="card-body">
												<!-- Form -->
												<div class="mb-4">
													<label class="form-label" for="username">신청자명</label>
													<input type="text" id="username"
													       class="form-control form-control-lg" name="username"
													       value="<s:authentication property='principal.user.username'/>"
													       placeholder="홍길동" maxlength="10">
													<span class="form-feedback" id="username-feedback" name="feedback">신청자명을 입력해 주세요.</span>
												</div>
												<!-- End Form -->
												<!-- Form -->
												<div class="mb-4">
													<label class="form-label" for="phone">연락처</label>
													<input type="text" class="form-control form-control-lg" name="phone"
													       id="phone" placeholder="010-1234-5678" maxlength="13">
													<span class="form-feedback" id="phone-feedback" name="feedback">연락처를 입력해 주세요.</span>
												</div>
												<!-- End Form -->
												<!-- Form -->
												<div class="">
													<label class="form-label" for="email">이메일</label>
													<input type="email" class="form-control form-control-lg"
													       name="email" id="email" placeholder="gildong@email.com"
													       value="<s:authentication property='principal.user.email'/>">
													<span class="form-feedback" id="email-feedback" name="feedback">이메일을 입력해 주세요.</span>
												</div>
											</div>
											<!-- End Card Body -->
										</div>
										<!-- End Card -->
									</div>
								</div>
								<!-- End Col -->
							</div>
							<!-- End Row -->
							<div class="card card-lg">
								<div class="row justify-content-lg-between card-body">
									<div class="col-sm-6 col-lg-6 mb-5 pe-sm-5" style="border-right: 1px solid #dddddd;">
										<!-- Icon Block -->
										<div class="d-flex">
											<div class="flex-grow-1">
												<div class="mb-5">
													<h5><i class="bi bi-caret-right-fill"></i>&nbsp;필수 안내사항</h5>
													<p class="fs-5 lh-base">봉사활동은 1365 자원봉사포털에 봉사실적으로 등록, 인정됩니다. 단, 학생봉사점수
														인정여부는
														교육부(나이스)에서 별도로 관리하며, 기부금/비용을 내는 봉사활동이나 비대면 재택봉사활동의 경우 봉사실적으로 인정하지 않는
														학교도
														있습니다.</p>
													<input type="checkbox" id="terms" class="form-check-input" name="terms"/>
													<label class="ms-2 lh-lg" for="terms">네, 상기사실을 확인하고 신청합니다.</label>
													<br>
													<span class="form-feedback" id="terms-feedback" name="feedback">필수 안내사항에 동의해 주세요.</span>
												</div>
												<div class="mb-5">
													<h5><i class="bi bi-caret-right-fill"></i>&nbsp;후원금이 어디에 쓰이길 원하십니까?</h5>
													<input type="radio" class="form-check-input" name="donateSurvey01rdo" id="rdo11" value="01">
													<label class=" ms-2 lh-lg" for="rdo11">청소년(학교)
														봉사활동 지원</label>
													<br>
													<input type="radio" class="form-check-input" name="donateSurvey01rdo" id="rdo12" value="02">
													<label class=" ms-2 lh-lg" for="rdo12">해외아동 교육활동 지원</label>
													<br>
													<input type="radio" class="form-check-input" name="donateSurvey01rdo" id="rdo13" value="03">
													<label class=" ms-2 lh-lg" for="rdo13">자람 신규활동 개발 및 운영 지원</label>
													<br>
													<input type="radio" class="form-check-input" name="donateSurvey01rdo" id="rdo14" value="04">
													<label class=" ms-2 lh-lg" for="rdo14">기타 의견</label>
													<textarea id=donateSurveyText01" name="donateSurveyText01" rows="3" class="form-control" placeholder="기타 의견을 작성해 주세요."></textarea>
													<span class="form-feedback" id="donateSurvey01rdo-feedback" name="feedback">후원 설문을 선택해 주세요.</span>
												</div>
												
												<div class="mb-5">
													<h5><i class="bi bi-caret-right-fill"></i>&nbsp;자람에 어떻게 후원하게 되었나요?</h5>
													<input type="radio" class="form-check-input" name="donateSurvey02rdo" id="rdo21" value="01">
													<label class=" ms-2 lh-lg" for="rdo21">이전에 후원한 적이 있다.</label>
													<br>
													<input type="radio" class="form-check-input" name="donateSurvey02rdo" id="rdo22" value="02">
													<label class=" ms-2 lh-lg" for="rdo22">지인/주변 추천을 받았다.</label>
													<br>
													<input type="radio" class="form-check-input" name="donateSurvey02rdo" id="rdo23" value="03">
													<label class=" ms-2 lh-lg" for="rdo23">인터넷 검색으로 알게되었다.</label>
													<br>
													<input type="radio" class="form-check-input" name="donateSurvey02rdo" id="rdo24" value="04">
													<label class=" ms-2 lh-lg" for="rdo24">기타</label>
													<textarea id="donateSurveyText02" name="donateSurveyText02" rows="3" class="form-control"
													          placeholder="기타 후원 경로를 작성해 주세요."></textarea>
													<span class="form-feedback" id="donateSurvey02rdo-feedback" name="feedback">후원 설문을 선택해 주세요.</span>
												</div>
											</div>
										</div>
										<!-- End Icon Block -->
									</div>
									<!-- End Col -->
									
									<div class="col-sm-6 col-lg-6 mb-5 ps-sm-5">
										<!-- Icon Block -->
										<div class="d-flex">
											<div class="flex-grow-1">
												<div class="mb-9">
													<h5><i class="bi bi-caret-right-fill"></i>&nbsp;기부금영수증 신청</h5>
													<p class="fs-5 lh-base">2023년도 기부내역은 2024년 1월초 국세청으로 일괄 신고하여, 2024년 1월
														15일
														이후 연말정산시 국세청 홈택스 사이트에서 확인 가능합니다(별도로 개인에게 기부금영수증을 발송해드리지 않습니다).</p>
													<input type="radio" id="formRadio1" class="form-check-input" name="donateReceipt" value="Y">
													<label class=" ms-2 lh-lg" for="formRadio1">네, 기부금영수증을 신청합니다.</label>
													<br>
													<input type="radio" id="formRadio2" class="form-check-input" checked name="donateReceipt" value="N">
													<label class=" ms-2 lh-lg" for="formRadio2">아니오, 기부금영수증을
														신청하지 않습니다.</label>
													<!-- End Checkbox -->
													<div class="mt-4" id="resiNumDiv">
														<label class="form-label" for="resiNum">주민등록번호</label>
														<label class="form-label" style="color:blue;">※ 국세청 등록을 위해 주민등록번호
															뒷자리까지 13자리를 모두 알려주셔야 합니다.</label>
														<input type="text" class="form-control form-control-lg"
														       name="resiNum"
														       id="resiNum" placeholder="000000-0000000" maxlength="13">
														<span class="form-feedback" id="resiNum-feedback" name="feedback">주민등록번호를 입력해 주세요.</span>
													</div>
												</div>
												<!-- Form -->
												<div class="mb-4">
													<h5><i class="bi bi-caret-right-fill"></i>&nbsp;후원 금액 선택</h5>
													<label class="form-label" for="donateAmonut">후원금액</label>
													<!-- Select -->
													<select class="form-select form-select-lg mb-3" name="donateAmount" id="donateAmonut">
														<option value="" selected="">후원금액(필수)</option>
														<option value="10000">10,000원</option>
														<option value="20000">20,000원</option>
														<option value="30000">30,000원</option>
														<option value="40000">40,000원</option>
														<option value="50000">50,000원</option>
													</select>
													<span class="form-feedback" id="donateAmonut-feedback" name="feedback">후원금액을 선택해 주세요.</span>
													<!-- End Select -->
												</div>
												<!-- End Form -->
												<div class="mb-4">
													<label class="form-label"><i class="bi bi-patch-question-fill me-2" style="color: #0abf53;"></i>후원금은 어디에 쓰이나요?</label>
													<br>
													<ul class="list-checked list-checked-dark">
														<li class="list-checked-item form-text mt-0">Industry-leading
															design
														</li>
														<li class="list-checked-item form-text mt-0">Developer community
															support
														</li>
														<li class="list-checked-item form-text mt-0">Simple and
															affordable
														</li>
													</ul>
												</div>
												<div class="d-grid">
													<button type="button" class="btn btn-primary btn-lg" onclick="fn_donatePay();">후원 신청</button>
												</div>
											</div>
										</div>
										<!-- End Icon Block -->
									</div>
									<!-- End Col -->
								</div>
								<!-- End Row -->
							</div>
						</div>
					</div>
					<!-- End Contact Form -->
				</div>
				<!-- End Card Body -->
			</div>
		</div>
		<!-- End Content -->
	</form>
</main>
<!-- ========== END MAIN CONTENT ========== -->
</body>
</html>
