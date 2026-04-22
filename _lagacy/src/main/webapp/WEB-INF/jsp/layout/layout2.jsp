<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="s" uri="http://www.springframework.org/security/tags" %>

<!DOCTYPE html>
<html>
<head>
	<meta name="_csrf" content="${_csrf.token}"/>
	<meta name="_csrf_header" content="${_csrf.headerName}"/>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">

	<link rel="icon" href="assets/img/custom/sprout.png"/>
	<link rel="apple-touch-icon" href="assets/img/custom/sprout.png"/>

	<!-- Required Meta Tags Always Come First -->
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

	<!-- Title -->
	<title>비영리민간단체 자람</title>

	<!-- jquery -->
	<script src="https://code.jquery.com/jquery-3.6.0.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>

	<!-- Favicon -->
	<link rel="shortcut icon" href="favicon.ico">

	<!-- Font -->
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">

	<!-- CSS Implementing Plugins -->
	<link rel="stylesheet" href="assets/vendor/bootstrap-icons/font/bootstrap-icons.css">
	<link rel="stylesheet" href="assets/vendor/hs-mega-menu/dist/hs-mega-menu.min.css">
	<link rel="stylesheet" href="assets/vendor/swiper/swiper-bundle.min.css">

	<!-- jquery confirm -->
	<link rel="stylesheet" href="assets/css/jquery-confirm.min.css">
	<script src="assets/js/jquery-confirm.min.js"></script>

	<!-- CSS Unify Template -->
	<link rel="stylesheet" href="assets/css/theme-temp.css">

	<!-- 자람 커스텀 CSS -->
	<link rel="stylesheet" href="assets/css/jaram-custom.css">

	<!-- 자람 커스텀 JS -->
	<script src="assets/js/jaram-common.js"></script>

	<!-- ckeditor -->
	<script src="assets/js/ckeditor.js"></script>
	<script src="assets/js/UploadAdapter.js"></script>
	<style>
		body {
			opacity: 0;
		}
	</style>

	<script>
        $(function () {
            //ajax 통신시 화면 block 처리
            $(document).ajaxStart($.blockUI).ajaxStop($.unblockUI);

            //페이지 로드 시 animate 효과
            $("body").animate({"opacity": "1"}, 500);

            //로딩 spinner
            let spinner;
            jQuery(function () {
                spinner = "<div class=\"spinner-border\" role=\"status\" style=\"top:50%;position:fixed;\" >\n" +
                    "  <span class=\"visually-hidden\">Loading...</span>\n" +
                    "</div>";
                jQuery(document.body).append(spinner);
                $(".spinner-border").hide();
            });

            window.onbeforeunload = function (e) {
                if (e !== null && e !== undefined) {
                    $(".spinner-border").show();
                }
            };
        });

	</script>

	<script src="/assets/vendor/hs-sticky-block/dist/hs-sticky-block.min.js"></script>

</head>
<body>

<!-- ========== MAIN CONTENT ========== -->
<main id="content" role="main">
<tiles:insertAttribute name="body"/>
</main>


<!-- JS Global Compulsory  -->
<script src="assets/vendor/bootstrap/dist/js/bootstrap.bundle.min.js"></script>

<!-- JS Implementing Plugins -->
<script src="assets/vendor/hs-header/dist/hs-header.min.js"></script>
<script src="assets/vendor/hs-mega-menu/dist/hs-mega-menu.min.js"></script>
<script src="assets/vendor/hs-go-to/dist/hs-go-to.min.js"></script>
<script src="assets/vendor/swiper/swiper-bundle.min.js"></script>

<!-- JS Unify -->
<script src="assets/js/theme.min.js"></script>

<!-- JS Plugins Init. -->

<!-- Jquery block UI -->
<script src="assets/js/jquery.blockUI.js"/>

<script>
</script>

</body>
</html>