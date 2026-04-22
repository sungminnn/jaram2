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
          <button type="button" class="navbar-toggler btn btn-white mb-3" data-bs-toggle="collapse" data-bs-target="#navbarVerticalNavMenuEg2" aria-label="Toggle navigation"  aria-expanded="false" aria-controls="navbarVerticalNavMenuEg2">
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
              <a class="nav-link" href="/page-organization">4. 조직도</a>
            </li>
            <li class="nav-item">
              <a class="nav-link active" href="/page-location">5. 오시는길</a>
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
      <h2>오시는 길</h2>
      <hr/>

      <!-- Team -->
      <div class="container content-space-1">
        <!-- Card -->
        <div class="card">
          <div class="card-header" id="kakaoMap" style="height:500px;">
          </div>
          <!-- kakao api map -->
          <script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=a339e74e296927865b9772b78ebeeae0"></script>
          <script type="text/javascript">

            var container = document.getElementById('kakaoMap'); //지도를 담을 영역의 DOM 레퍼런스
            var options = { //지도를 생성할 때 필요한 기본 옵션
              center: new kakao.maps.LatLng(37.491691770880585, 127.08294486778291), //지도의 중심좌표.
              level: 3 //지도의 레벨(확대, 축소 정도)
            };

            var map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴

            // 지도를 클릭한 위치에 표출할 마커입니다
            var marker = new kakao.maps.Marker({
              // 지도 중심좌표에 마커를 생성합니다
              position: map.getCenter()
            });
            // 지도에 마커를 표시합니다
            marker.setMap(map);

          </script>


          <div class="card-body">
            <h5 class="card-title">주소</h5>
            <p class="card-text">서울특별시 강남구 일원로 5길 29, 지층 101호</p>
          </div>
        </div>
        <!-- End Card -->

      </div>
      <!-- End Team -->

      <!-- End Sticky End Point -->
      <div id="stickyBlockEndPointEg2"></div>
    </div>
  </div>
</div>
<!-- End Icon Blocks -->

<script>
  (function() {
    // INITIALIZATION OF STICKY BLOCKS
    // =======================================================
    new HSStickyBlock('.js-sticky-block', {
      targetSelector: document.getElementById('header').classList.contains('navbar-fixed') ? '#header' : null
    })
  })()
</script>
</body>
</html>
