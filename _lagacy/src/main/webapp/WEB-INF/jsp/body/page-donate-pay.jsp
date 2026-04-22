<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="s" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<html lang="en">
<head>
	<script>
		$(function () {

		});
	
	</script>
</head>

<body>

<!-- ========== MAIN CONTENT ========== -->
<main id="content" role="main">
	<form action="/member/donate-pay" method="post" id="frm">
		<input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}">
		<input type="hidden" name="donateSeq" id="donateSeq" value="${param.donateSeq}">
		<!-- Content -->
		<div class="container content-space-2 content-space-lg-3">
			<div class="w-lg-75 mx-lg-auto">
				<!-- Card -->
				<div class="card card-lg card-shadow">
					<!-- Header -->
					<div class="card-header bg-dark">
						<h1 class="card-title h2 text-white">결제하기</h1>
						<p class="card-text text-white">결제 전 정보를 확인하세요.</p>
					</div>
					<!-- End Header -->
					
					<!-- Card Body -->
					<div class="card-body">
						<!-- Contact Form -->
						<div class="container">
							<div class="row mb-10">
								<div class="col-lg-6 mb-10 mb-lg-0 ">
									<div class="card-shadow">
										<div class="row">
											<div class="col-lg-3">
												<img class="img-fluid m-3" src="/assets/img/others/donate3.jpg" alt="Image Description">
											</div>
											<div class="col-lg-8">
												<h6>일시후원</h6>
												<label class="form-label">후원금액 : <strong><fmt:formatNumber type="number" maxFractionDigits="3" value="${param.donateAmount}"/>원</strong></label>
											</div>
										</div>
									</div>
									
									<!-- Icon Block -->
									<div class="d-flex">
										<div class="flex-grow-1">
											
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
									</div>
									<!-- End Icon Block -->
								</div>
								<!-- End Col -->
								<div class="col-lg-6">
									<div class="position-relative">
										<!-- Card -->
										<div class="card card-lg">
											<!-- Card Body -->
											<div class="card-body">
												<!-- Form -->
												<!-- Icon Block -->
												<div class="d-flex">
													<div class="flex-grow-1">
														<div class="mb-9">
															<h5><i class="bi bi-caret-right-fill"></i>&nbsp;결제요약</h5>
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
															<div class="mt-4" id="regiNumDiv">
																<label class="form-label" for="regiNum">주민등록번호</label>
																<label class="form-label" style="color:blue;">※ 국세청 등록을 위해 주민등록번호
																	뒷자리까지 13자리를 모두 알려주셔야 합니다.</label>
																<input type="text" class="form-control form-control-lg"
																       name="regiNum"
																       id="regiNum" placeholder="000000-0000000" maxlength="13">
																<span class="form-feedback" id="regiNum-feedback" name="feedback">주민등록번호를 입력해 주세요.</span>
															</div>
														</div>
														<!-- Form -->
														<div class="mb-4">
															<h5><i class="bi bi-caret-right-fill"></i>&nbsp;결제 수단 선택</h5>
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
														<!-- Form -->
														<div class="mb-4">
															<!-- 전체동의 -->
														</div>
														<div class="d-grid">
															<button type="button" class="btn btn-primary btn-lg" onclick="fn_donatePay();">후원 신청</button>
														</div>
													</div>
												</div>
												<!-- End Icon Block -->
											</div>
											<!-- End Card Body -->
										</div>
										<!-- End Card -->
									</div>
								</div>
								<!-- End Col -->
							</div>
							<!-- End Row -->
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
