<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="s" uri="http://www.springframework.org/security/tags" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<html lang="en">
<head>
	<script>
        $(function () {

        });
	</script>
</head>

<body>
<div class="container content-space-3 content-space-lg-3">
	<!-- Pricing -->
	<div class="container content-space-1">
		<div class="w-lg-65 text-center mx-lg-auto mb-5 mb-sm-7 mb-lg-10">
			<h2>아이들을 위해 동참해 주세요 <i class="bi bi-emoji-smile"></i></h2>
		</div>

		<div class="position-relative">
			<div class="row mb-5">
				<div class="col-lg-6 mb-4 mb-lg-0">
					<!-- Card -->
					<div class="card card-lg h-100 card-shadow">
						<div class="card-body">
							<div class="mb-3">
								<h4 class="mb-1">매달 정기적으로</h4>
								<p>직접 입금하지 않고 매월 자동출금되는 후원 방식</p>
							</div>

							<!-- Media -->
							<div class="d-flex mb-5">
								<div class="flex-shrink-0">
									<span class="display-6 lh-1 text-dark"><i class="bi bi-calendar-heart"></i>&nbsp;정기후원</span>
								</div>
								<div class="flex-grow-1 align-self-end ms-3">
									<span class="d-block">donate monthly</span>
								</div>
							</div>
							<!-- End Media -->

							<div class="row">
								<div class="col-sm-6">
									<!-- List Checked -->
									<ul class="list-checked list-checked-soft-bg-warning fs-4 mb-2">
										<li class="list-checked-item">은행 자동이체</li>
										<li class="list-checked-item">CMS 자동이체</li>
										<li class="list-checked-item">Code extensibility</li>
									</ul>
									<!-- End List Checked -->
								</div>
								<!-- End Col -->

								<div class="col-sm-6">
									<!-- List Checked -->
									<ul class="list-checked list-checked-soft-bg-warning fs-4 mb-2">
										<li class="list-unchecked-item">Custom reports</li>
										<li class="list-unchecked-item">Product support</li>
										<li class="list-unchecked-item">Activity reporting</li>
									</ul>
									<!-- End List Checked -->
								</div>
								<!-- End Col -->
							</div>
							<!-- End Row -->
						</div>

						<div class="card-footer pt-0">
							<div class="row align-items-center">
								<div class="col">
									<span class="fs-5 text-muted d-block">Cancel anytime.</span>
									<span class="fs-5 text-muted d-block">No card required.</span>
								</div>
								<!-- End Col -->

								<div class="col-auto">
									<a class="btn btn-white" href="#">정기후원 하러가기</a>
								</div>
								<!-- End Col -->
							</div>
							<!-- End Row -->
						</div>
					</div>
					<!-- End Card -->
				</div>
				<!-- End Col -->

				<div class="col-lg-6">
					<!-- Card -->
					<div class="card card-lg card-shadow card-pinned h-100">
						<span class="badge bg-dark text-white card-pinned-top-end">Most popular</span>

						<div class="card-body">
							<div class="mb-3">
								<h4 class="mb-1">한 번씩 후원</h4>
								<p>일시적 또는 직접 입금을 통한 후원 방식</p>
							</div>

							<!-- Media -->
							<div class="d-flex mb-5">
								<div class="flex-shrink-0">
									<span class="display-6 lh-1 text-dark"><i class="bi bi-bag-heart"></i>&nbsp;일시후원</span>
								</div>
								<div class="flex-grow-1 align-self-end ms-3">
									<span class="d-block">USD / monthly</span>
								</div>
							</div>
							<!-- End Media -->

							<div class="row">
								<div class="col-sm-6">
									<!-- List Checked -->
									<ul class="list-checked list-checked-soft-bg-warning fs-4 mb-2">
										<li class="list-checked-item">청소년(학교) 봉사활동 지원</li>
										<li class="list-checked-item">해외아동 교육활동 지원</li>
										<li class="list-checked-item">신규활동 개발 및 운영 지원</li>
									</ul>
									<!-- End List Checked -->
								</div>
								<!-- End Col -->

								<div class="col-sm-6">
									<!-- List Checked -->
									<ul class="list-checked list-checked-soft-bg-warning fs-4 mb-2">
										<li class="list-checked-item">카드결제</li>
										<li class="list-checked-item">실시간 계좌이체</li>
										<li class="list-checked-item">무통장 입금</li>
									</ul>
									<!-- End List Checked -->
								</div>
								<!-- End Col -->
							</div>
							<!-- End Row -->
						</div>

						<div class="card-footer pt-0">
							<div class="row align-items-center">
								<div class="col">
									<span class="fs-5 text-muted d-block">간단한 신청서 작성 후 후원할 수 있습니다.</span>
									<span class="fs-5 text-muted d-block">No card required.</span>
								</div>
								<!-- End Col -->

								<div class="col-auto">
									<s:authorize access="isAnonymous()">
										<a class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onclick="fn_openLoginModal();">일시후원 하러가기</a>
									</s:authorize>
									<s:authorize access="isAuthenticated()">
										<a class="btn btn-primary" href="/member/page-donate-once222">일시후원 하러가기</a>
									</s:authorize>
								</div>
								<!-- End Col -->
							</div>
							<!-- End Row -->
						</div>
					</div>
					<!-- End Card -->
				</div>
				<!-- End Col -->
			</div>
			<!-- End Row -->

			<!-- SVG Shape -->
			<figure class="position-absolute top-0 end-0 zi-n1 d-none d-md-block mt-10 me-n10" style="width: 4rem;">
				<img class="img-fluid" src="../assets/svg/components/pointer-up.svg" alt="Image Description">
			</figure>
			<!-- End SVG Shape -->

			<!-- SVG Shape -->
			<figure class="position-absolute bottom-0 start-0 zi-n1 ms-n10 mb-n10" style="width: 15rem;">
				<img class="img-fluid" src="../assets/svg/components/curved-shape.svg" alt="Image Description">
			</figure>
			<!-- End SVG Shape -->
		</div>

		<div class="text-center">
			<p class="fs-6 text-muted mb-0">기부금 영수증 발행 가능</p>
		</div>
	</div>
	<!-- End Pricing -->
</div>

</body>
</html>
