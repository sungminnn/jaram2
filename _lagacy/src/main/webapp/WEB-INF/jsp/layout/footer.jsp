<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<script>
  /**
  	 * 정책 Dialog 팝업
  	 * @param gubn
  	 */
  	function fn_openDialog(gubn){
        let data = {
            POLICY_CODE : gubn
        };
  		//조회
  		cfn_ajaxTransmit("/site-policy", data);
        $.ajax({
              url: "/site-policy"
            , type: "post"
            , data: data
            , dataType: "json"
            , contentType: "application/x-www-form-urlencoded; charset=UTF-8contentType"
            , async: true
            , success: function (result, textStatus, data) {
                $.dialog({
                         title   : result.data.POLICY_NAME
                       , content : result.data.POLICY_CONTENT
                       , columnClass: 'col-md-12'
               });
            }
            , error: function (xhr, errorName, error) {
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


</script>
<!-- ========== FOOTER ========== -->
<footer class="bg-dark">
  <div class="container">
    <div class="row align-items-center pt-8 pb-4">
      <div class="col-md mb-5 mb-md-0">
        <h2 class="fw-medium text-white-70 mb-0">함께 나아가는<br><span class="fw-bold text-white">비영리민간단체 자람</span> 입니다.</h2>
      </div>
      <!-- End Col -->

      <div class="col-md-auto">
        <div class="d-grid d-sm-flex gap-3">
          <a class="btn btn-primary" href="/board?page=notice">공지사항</a>
          <a class="btn btn-ghost-light btn-pointer" href="/board?page=qna">문의하기</a>
        </div>
      </div>
      <!-- End Col -->
    </div>
    <!-- End Row -->

    <div class="border-bottom border-white-10">
      <!-- Clients -->
      <div class="container content-space-1">
        <!-- Heading -->
        <div class="w-lg-65 text-center mx-lg-auto mb-7 ">
          <p class="text-white-70">자람&nbsp;&nbsp;|&nbsp;&nbsp;서울시 강남구 일원로 5길 29&nbsp&nbsp;|&nbsp;&nbsp;전화번호 : 02-3411-2555
            |&nbsp;&nbsp;대표자 : 권정문&nbsp;&nbsp;|&nbsp;&nbsp;고유번호 : 586-80-02519 </p>
          <p class="text-white-70">복지사업 제안 및 문의 : 02-3411-2555 &nbsp;&nbsp;|&nbsp;&nbsp;email : k0421jm@naver.com </p>
        </div>
        <!-- End Heading -->

        <div class="w-lg-65 text-center mx-lg-auto">
          <a class="btn btn-primary">후원계좌 : 하나은행 303-910024-16404 자람</a>
        </div>
      </div>
      <!-- End Clients -->
    </div>

    <div class="row align-items-md-center py-6">
      <div class="col-md mb-3 mb-md-0">
        <!-- List -->
        <ul class="list-inline list-px-2 mb-0">
          <li class="list-inline-item"><a class="link link-light link-light-75 pointer" onclick="fn_openDialog('P')">개인정보취급방침</a></li>
          <li class="list-inline-item"><a class="link link-light link-light-75 pointer" onclick="fn_openDialog('T')">이용약관</a></li>
          <li class="list-inline-item"><a class="link link-light link-light-75 pointer" onclick="fn_openDialog('M')">마케팅 활용 및 광고 수신 정책</a></li>
          <li class="list-inline-item">
            <!-- Button Group -->
            <div class="btn-group">
              <a class="link link-light link-light-75" href="javascript:;" id="selectLanguage" data-bs-toggle="dropdown" aria-expanded="false">
                  <span class="d-flex align-items-center">
                    <img class="avatar avatar-xss avatar-circle me-2" src="assets/vendor/flag-icon-css/flags/1x1/kr.svg" alt="Image description" width="16"/>
                    <span>English</span>
                  </span>
              </a>
<%--              <a href="https://www.flaticon.com/kr/free-icons/-" title="공중 위생 아이콘">공중 위생 아이콘 제작자: Elzicon - Flaticon</a>--%>
<%--              <a href="https://www.flaticon.com/kr/free-icons/-" title="사회적 책임 아이콘">사회적 책임 아이콘 제작자: Freepik - Flaticon</a>--%>
<%--              <a href="https://www.flaticon.com/kr/free-icons/" title="건강 아이콘">건강 아이콘 제작자: mia elysia - Flaticon</a>--%>
              <!-- 다국어 dropdown -->
              <!--
			  <div class="dropdown-menu">
				<a class="dropdown-item d-flex align-items-center active" href="#">
				  <img class="avatar avatar-xss avatar-circle me-2" src="assets/vendor/flag-icon-css/flags/1x1/kr.svg" alt="Image description" width="16"/>
				  <span>English</span>
				</a>
				<a class="dropdown-item d-flex align-items-center" href="#">
				  <img class="avatar avatar-xss avatar-circle me-2" src="assets/vendor/flag-icon-css/flags/1x1/de.svg" alt="Image description" width="16"/>
				  <span>Deutsch</span>
				</a>
				<a class="dropdown-item d-flex align-items-center" href="#">
				  <img class="avatar avatar-xss avatar-circle me-2" src="assets/vendor/flag-icon-css/flags/1x1/es.svg" alt="Image description" width="16"/>
				  <span>Español</span>
				</a>
			  </div>
			  -->
            </div>
            <!-- End Button Group -->
          </li>
        </ul>
        <!-- End List -->
      </div>
      <!-- End Col -->

      <div class="col-md-auto">
        <p class="fs-5 text-white-70 mb-0">Copyright ⓒ 2023 Jaram. All Rights Reserved.</p>
        <p class="fs-5 text-white-70 mb-0">Design by SungMin</p>
      </div>
      <!-- End Col -->
    </div>
    <!-- End Row -->
  </div>
</footer>
<!-- ========== END FOOTER ========== -->
