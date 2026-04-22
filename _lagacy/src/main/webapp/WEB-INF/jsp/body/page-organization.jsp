<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="s" uri="http://www.springframework.org/security/tags" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="en">
<head>
	<script>
	</script>
</head>
<body>

<div class="container content-space-3 content-space-lg-3">
	<div class="row">
		<div id="stickyBlockStartPointEg2" class="col-md-3 col-lg-2 mb-3 mb-md-0">
			<!-- Navbar -->
			<div class="navbar-expand-md">
				<!-- Navbar Toggle -->
				<div class="d-grid">
					<button type="button" class="navbar-toggler btn btn-white mb-3" data-bs-toggle="collapse" data-bs-target="#navbarVerticalNavMenuEg2" aria-label="Toggle navigation"
					        aria-expanded="false" aria-controls="navbarVerticalNavMenuEg2">
            <span class="d-flex justify-content-between align-items-center">
              <span class="text-dark mb-0">Menu</span>

              <span class="navbar-toggler-default">
                <i class="bi-list"></i>
              </span>

              <span class="navbar-toggler-toggled">
                <i class="bi-x"></i>
              </span>
            </span>
					</button>
				</div>
				<!-- End Navbar Toggle -->
				
				<!-- Navbar Collapse -->
				<div id="navbarVerticalNavMenuEg2" class="collapse navbar-collapse">
					<ul id="navbarSettingsEg2" class="js-sticky-block js-scrollspy nav nav-tabs nav-link-gray nav-vertical"
					    data-hs-sticky-block-options='{
										               "parentSelector": "#navbarVerticalNavMenuEg2",
										               "targetSelector": "#header",
										               "breakpoint": "md",
										               "startPoint": "#navbarVerticalNavMenuEg2",
										               "endPoint": "#stickyBlockEndPointEg2",
										               "stickyOffsetTop": 100
										             }'>
						<li class="nav-item">
							<a class="nav-link" href="/ceo">1. 대표 소개</a>
						</li>
						<li class="nav-item">
							<a class="nav-link" href="/page-purpose-of-esta">2. 설립취지문</a>
						</li>
						<li class="nav-item">
							<a class="nav-link" href="/page-vision-mission">3. 비전과 미션</a>
						</li>
						<li class="nav-item">
							<a class="nav-link active" href="/page-organization">4. 조직도</a>
						</li>
						<li class="nav-item">
							<a class="nav-link" href="/page-location">5. 오시는길</a>
						</li>
					</ul>
				</div>
				<!-- End Navbar Collapse -->
			</div>
			<!-- End Navbar -->
		</div>
		<!-- End Col -->
		
		<!-- Testimonials -->
		<div class="col-md-9 col-lg-10">
			<h2>조직도</h2>
			<hr/>
			<!-- 조직도 이미지 -->
			<div class="image-container">
				<div class="organization-image"></div>
			</div>
			<hr/>
			
			<%--      <!-- Team -->--%>
			<%--      <div class="container content-space-1">--%>
			<%--        <!-- Heading -->--%>
			<%--        <!-- End Heading -->--%>
			
			<%--        <div class="row row-cols-1 row-cols-sm-2 row-cols-lg-3">--%>
			<%--          <div class="col mb-10">--%>
			<%--            <!-- Team -->--%>
			<%--            <div class="w-sm-65 text-center mx-auto">--%>
			<%--              <img class="img-fluid rounded-3 mb-4"  src="../assets/img/others/ceo-02.jpg" alt="" style="height:250px;width:300px;">--%>
			<%--              <h5 class="mb-1">권정문</h5>--%>
			<%--              <span class="d-block">CEO</span>--%>
			<%--            </div>--%>
			<%--            <!-- End Team -->--%>
			<%--          </div>--%>
			<%--          <!-- End Col -->--%>
			
			<%--          <div class="col mb-10">--%>
			<%--            <!-- Team -->--%>
			<%--            <div class="w-sm-65 text-center mx-auto">--%>
			<%--              <img class="img-fluid rounded-3 mb-4"  src="../assets/img/others/ceo-01.jpg"  alt="" style="height:250px;width:300px;">--%>
			<%--              <h5 class="mb-1">하숙자</h5>--%>
			<%--              <span class="d-block">volunteer</span>--%>
			<%--            </div>--%>
			<%--            <!-- End Team -->--%>
			<%--          </div>--%>
			<%--          <!-- End Col -->--%>
			<%--        </div>--%>
			<%--        <!-- End Row -->--%>
			<%--      </div>--%>
			<%--      <!-- End Team -->--%>
			
			<!-- End Sticky End Point -->
			<div id="stickyBlockEndPointEg2"></div>
		</div>
	</div>
</div>
<!-- End Icon Blocks -->
<script>
	(function () {
		// INITIALIZATION OF STICKY BLOCKS
		// =======================================================
		new HSStickyBlock('.js-sticky-block', {
			targetSelector: document.getElementById('header').classList.contains('navbar-fixed') ? '#header' : null
		})
	})()
</script>
</body>
</html>
