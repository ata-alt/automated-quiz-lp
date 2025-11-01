/*
 * HMI Technologies Mumbai
 ** Javascript **
 *
 * This is the default js file.
 *
*/
(function($) {

	"use strict";

	var fciPopUpjs = {

		init: function () {

			if (tradeUsersID) {
				$('[name="fname"]').val(tradeUsersNM);
				$('[name="lname"]').val(tradeUsersLN);
				$('[name="email"]').val(tradeUsersEmail);
				$('[name="phone"]').val(tradeUsersPhone*1);
				return false;
			}

			// check page meta - popup name ...
			var popid = $('meta[name=popup]').attr("content")*1;
			if (popid===0) return false;

			// check cookie
			var pCookie = fciPopUpjs.getCookie('__nofpshow');
			if (pCookie!=='') return false;

			// getpopup data via ajax
			$.getJSON( "/api?action=getpu&popid="+popid, function(data) {
				if (!data.html) return false;
				fciPopUpjs.data = data;
				setTimeout(fciPopUpjs.showPopUp,data.delay*1000);
			}).fail(function() {
				console.log('Failed to load popup data!');
			});

			//remove numb of reviews from reviews.io widget
			$('.header__inner').children('div').eq(3).empty();
						
		},

		getCookie: function (cname) {
			var name = cname + "=";
			var decodedCookie = decodeURIComponent(document.cookie);
			var ca = decodedCookie.split(';');
			for(var i = 0; i <ca.length; i++) {
				var c = ca[i];
				while (c.charAt(0) == ' ') c = c.substring(1);
				if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
			}
			return '';
		},

		setCookie: function (cname, cvalue, exdays) {
			var d = new Date();
			d.setTime(d.getTime() + (exdays*24*60*60*1000));
			var expires = "expires="+ d.toUTCString();
			document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
		},

		showPopUp: function () {
			$('<div id="fcipopup-overlay"><form id="popup-form"><a href="#" class="icon-x"></a>'+
			  fciPopUpjs.data.html+'</form></div>').appendTo('body').hide().fadeIn("slow");
			$('#popup-form > a.icon-x').click(fciPopUpjs.hidePopUp);
			$('#popup-form .popclose').click(fciPopUpjs.hidePopUp);
			//$('#fcipopup-overlay').click(fciPopUpjs.hidePopUp);
			$('#popup-form .booknowclckd').click(fciPopUpjs.openBookNow);
			$('#popup-form').submit(fciPopUpjs.submitPopUp);
			$('<input type="hidden" name="popname">').val(fciPopUpjs.data.name)
				.appendTo('#popup-form');
			//add partial leads code
			$('#popup-form input[required]').on('invalid', function(e){ 
				var form = $(this).closest('#popup-form');
				var formid = form.prop('id');
				if ( ((form.find("[name='fname']").val())||(form.find("[name='lname']").val())) && ((form.find("[name='email']").val())||(form.find("[name='phone']").val())) ) {
					var postdata = $(form).serialize();
					if (postdata==localStorage.getItem("partialpost")) return true;
					localStorage.setItem("partialpost", postdata);
					$.post( '/api?action=partial&formid='+formid, postdata, function(data) {
						if (data.status == 'done') 	console.log('awesome');
					}, "json").fail( function() { 
						console.log('Failed: The request failed.'); 
					});
				}
			});
		},

		hidePopUp: function () {
			$('#fcipopup-overlay').fadeOut("slow",function(){
				$('#fcipopup-overlay').remove();
			});
			// set hidedays cookie here !
			fciPopUpjs.setCookie('__nofpshow','Y',fciPopUpjs.data.hidedays);
			return false;
		},

		openBookNow: function () {
			fciPopUpjs.setCookie('__nofpshow','Y',fciPopUpjs.data.hidedays);
		},

		submitPopUp: function () {

			$.post( '/form.submit?form=popup',$('#popup-form').serialize(),function(data) {
				if (data=='0') {
					$('#fcipopup-overlay').fadeOut("slow",function(){
						$('#fcipopup-overlay').remove();
					});
					// set the cookie here for covn days
					fciPopUpjs.setCookie('__nofpshow','Y',fciPopUpjs.data.convdays);
					window.dataLayer = window.dataLayer || [];
					window.dataLayer.push({ 'formID': 'popup', 'event': 'formsubmit', 'popname':fciPopUpjs.data.name,'pageurl':window.location.href});
				} else alert('Error: '+ data);
			}).fail( function() { 
				alert('Failed: The request failed.'); 
			});
			return false;
		}

	}

	$(function(){
		var req;
		var searchPageEle = $('#autocomplete-pagelist-dd').html();
		var searchProdEle = $('#autocomplete-prodlist-dd').html();
		var setClickCookie = function (ele) {
			var d = new Date();
			d.setTime(d.getTime() + (300000));
			var expires = "expires="+ d.toUTCString();
			var area = 3;
			if(ele.closest('#cat-list-dd').length) area = 2;
			if(ele.closest('#autocomplete-list-dd').length) area = 1;
			document.cookie = "__clogarea="+area+ ";" + expires + ";path=/";
			document.cookie = "__clogterm="+escape($('#search-term').val())+ ";" + expires + ";path=/";
			return true
		}

		//Initialize FCI Popup
		fciPopUpjs.init();

		//hbutk cookie
		var tCookie = fciPopUpjs.getCookie('__nohtSent');
		if (tCookie =='') {
			$.get('/api?action=hbkutk');
			fciPopUpjs.setCookie('__nohtSent','Y',1);
		}

		var cCookie = fciPopUpjs.getCookie('__noCclk');

		$('input[name="phone"]').attr("required",true);
		$('#search-dd').on('click','a', function () {
			return setClickCookie($(this));
		});
		$('#page-header a').click(function () {
			return setClickCookie($(this));
		});
		$('#menu-trigger, .header-nav-form .input-icon-wrap').click(function () {
			if ($(this).find('.input-icon').hasClass('icon-menu')) $('#search-term').focus();
		});
		$('#search-term').focusin(function(){
			$('#search-dd').show().css('height', '100vh !important');
			$('.main').css('margin-top', '0');
			$('.header-nav-form .input-icon-wrap').css('border-color', '#666666');
			$('#search-term').next().find('.input-icon').removeClass('icon-menu').addClass('icon-x');
			$('#search-term').next().width('20px').find('label').hide();
			$('.main, .footer').hide();
			window.scrollTo(0, 0);
		});
		$('#search-term').focusout(function(){
			setTimeout(function(){
				$('#search-dd').hide().css('height', 'auto');
				$('.main').css('margin-top', '97px');
				$('.header-nav-form .input-icon-wrap').css('border-color', '#d1d1d1');
				$('#search-term').next().find('.input-icon').addClass('icon-menu').removeClass('icon-x');
				$('#search-term').next().width('180px').find('label').show();
				$('.main, .footer').show();
			}, 300);
		});
		$('#search-term').on('input', function(){
			var term = $(this).val().trim();
			if (req) req.abort();
			if (term.length > 2) {
				var req = $.getJSON( "/search.html?term="+term+"&uiac", function(data) {
					$('#autocomplete-pagelist-dd, #autocomplete-prodlist-dd').empty();
					data.pages.forEach( function (item) {
						var rec = $(searchPageEle).appendTo('#autocomplete-pagelist-dd');
						rec.find('a').prop({
							'href': item.url,
							'alt' : item.name,
						}).text(item.name);
					});
					data.products.forEach( function (item) {
						var rec = $(searchProdEle).appendTo('#autocomplete-prodlist-dd');
						rec.prop({
							'href': item.url,
							'title' : item.name,
						});
						rec.find('img').prop({
							'src': item.img,
							'alt' : item.name,
						});
						rec.find('.swatch-each-view').text(item.name);
					});
					$('#cat-list-dd').hide();
					$('.main, .footer').hide();
					$('#autocomplete-list-dd').show();
				});
			} else {
				$('#cat-list-dd').show();
				$('#autocomplete-list-dd').hide();
				$('.main, .footer').hide();
			}
		});
		$('#autocomplete-list-dd').hide();
		$('.main, .footer').show();
		$("img[data-src]").lazy();
		setTimeout(function(){ 
			$("img.img-thumbnail[data-src]").each(function() {
				$(this).prop('src', $(this).data('src') ).removeAttr('data-src')
			});
		}, 1000);
		// -------------------------------------
		// Read More Button	
		$('#full-story-btn').click( function () {
			if ($(this).text() == 'Show less') {
				$(this).text( $(this).data('captext') );
			} else {
				$(this).data('captext', $(this).text() )
				$(this).text( 'Show less' );
			}
			$('#full-story-content').slideToggle(400);
			return false;
		});

		// -------------------------------------
		// CS Select: Custom elastic selects
		[].slice.call( document.querySelectorAll( 'select.cs-select' ) ).forEach( function(el) {  
			new SelectFx(el);
		});

		// -------------------------------------
		// Custom Dropdown Element
		$(".js-dropdown-parent").on("click", function() {
			$(this).next().slideToggle();
		});

		// -------------------------------------
		// Collapsible element: Basic

		$('.js-collapse-trigger').on('click', function(e) {
			e.preventDefault();
			$(this).next().slideToggle();
		});

		// -------------------------------------
		// Responsive Videos: fitVids Plugin
		$(".embed-responsive").fitVids();

		// -------------------------------------
		//Menu: Link
		$(window).click(function(){
			$(".js-main-nav-sm").removeClass("main-nav-sm-open");
		});
		$(".js-menu-link").click(function(event){
			event.preventDefault();
			event.stopPropagation();
			$(".js-main-nav-sm").toggleClass("main-nav-sm-open");
		});     
		$(".js-main-nav-sm").click(function(event){
			event.stopPropagation();
			//event.stopImmediatePropagation();
		});
		$(".main-nav-sm-close").on("click", function(){
			$(".js-main-nav-sm").removeClass("main-nav-sm-open");
		});

		// -------------------------------------
		//Menu: Dropdowns    
		$(".js-nav-sm li:has(ul)").click(function(event){
			event.stopPropagation();
			var thisNav = $(this).closest(".js-nav-sm").find('ul');
			$(".js-nav-sm ul").not(thisNav).slideUp().closest('.js-nav-sm').children('li:has(ul)').removeClass('clicked');
			if (this == event.target || this == $(event.target).parent()[0]) {
				$(this).toggleClass('clicked').children('ul').slideToggle();
				$(this).find('li:has(ul)').removeClass('clicked').find("ul").slideUp();
				$(this).siblings().removeClass('clicked').find("ul").slideUp();
				return false;
			}
		}).addClass('has_ul');

		// -------------------------------------
		// Slider Carousel: Home
		$(".js-carousel-home").lightSlider({
			item: 6,
			loop: true,
			pager: false,
			speed: 4000,
			slideMargin: 20,

			responsive: [
				{
					breakpoint: 640,
					settings: {
						item: 3
					}  
				}
			]
		});

		// Slider: Fade: Banner
		$(".js-banner-block-slider").lightSlider({
			item: 1,
			loop: true,
			pager: false,
			slideMargin: 0,
			controls: false,
			pause: 5000,
			speed: 2000,
			auto: true,
			mode: 'fade',
			onSliderLoad: function() {
				$('.js-banner-block-slider li:eq(1)').removeClass('hide');
			},
		});
		
		$(".js-banner-block-slider").lightSlider({
			item: 1,
			loop: true,
			pager: false,
			slideMargin: 0,
			controls: false,
			pause: 5000,
			speed: 2000,
			auto: true,
			mode: 'fade',
			onSliderLoad: function() {
				$('.js-banner-block-slider').removeClass('cS-hidden'); 
			} 
		});

		// -------------------------------------
		// Accordion: Search Filter
		$(".js-accordion-sort-filter").accordion({
			"transitionSpeed": 400
		});

		// Accordion: Search Filter
		$(".js-faqs").accordion({
			"transitionSpeed": 400
		});

		// close alert -------------------------------------
		// Alert Close: Click
		$('.alert-close').click( function () {
			$(this).parent().hide('slow');
		});	

		// -------------------------------------
		// Slider Carousel: Contemporary garden furniture
		$(".js-carousel-garden-furniture").lightSlider({
			item: 4,
			loop: true,
			pager: false,
			autoWidth: true,
			slideMargin: 20,
			onSliderLoad: function() {
				$('.js-carousel-showroom').removeClass('cS-hidden');
			}, 
			responsive: [
				{
					breakpoint: 640,
					settings: {
						item: 2
					}  
				}
			]
		});

		//--------------------------------------
		//Carousel for Related Products
		$(".js-carousel-product").lightSlider({
			item: 4,
			loop: true,
			pager: false,
			slideMargin: 20,
			responsive: [
				{
					breakpoint: 640,
					settings: {
						item: 3
					}  
				}
			]
		});	

		// -------------------------------------
		// Slider Carousel: Visit Our Showroom
		$(".js-carousel-showroom").lightSlider({
			item: 4,
			loop: true,
			pager: false,
			autoWidth: true,
			slideMargin: 20,
			onSliderLoad: function() {
				$('.js-carousel-showroom').removeClass('cS-hidden');
			}, 
			responsive: [
				{
					breakpoint: 640,
					settings: {
						item: 2
					}  
				}
			]
		});

		// -------------------------------------
		// Slider Gallery: Product
		$("#js-light-slider-product").lightSlider({
			gallery: true,
			item: 1,
			loop:true,
			slideMargin: 0,
			thumbItem: 6,
			controls: false,
		}); 

		// Slider Interior Designing Projects: ID
		$("#project-slider").lightSlider({
			gallery: true,
			item: 1,
			loop:true,
			controls: true,
			slideMargin: 0,
			thumbItem: 6,
			adaptiveHeight: true,
			onSliderLoad: function() {
				$('#project-slider').removeClass('cS-hidden');
			}
		});
		
		$("#showroom-slider").lightSlider({
			gallery: false,
			item: 1,
			loop:true,
			controls: true,
			slideMargin: 0,
			thumbItem: 6,
			adaptiveHeight: true,
		});

		// Slider: wardrobe pages (only on desktop)
		if ($(window).width() > 768) {
			$("#wardrobes-slider").lightSlider({
				item: 1,
				loop:true,
				controls: true,
				slideMargin: 0,
				adaptiveHeight: true,
				pager: false,
			});
		}

		// Destroy slider on resize if going to mobile
		$(window).on('resize', function() {
			if ($(window).width() <= 768) {
				const slider = $("#wardrobes-slider");
				if (slider.parent().hasClass('lSSlideOuter')) {
					slider.parent().replaceWith(slider);
					slider.removeAttr('style').addClass('mobile-scroll');
				}
			}
		});

		// -------------------------------------
		// Lightbox: Global: Images
		$(".js-rbox-img").rbox();

		// Lightbox: Global: Inline: Sizes
		$('.rbox-inline').rbox();
		$('.rbox-inline-mid').rbox({
			'layoutcustom' : 'rbox-overlay-mid'
		});
		$('.rbox-inline-sm').rbox({
			'layoutcustom' : 'rbox-overlay-sm'
		});

		// -------------------------------------
		// Headroom plugin for animated header on scroll
		//if ( typeof $("header") != "undefined") {
		var headroom = new Headroom($("header")[0], {
			"offset": 100,
			"tolerance": 5,
			"classes": {
				"initial": "animated",
				"pinned": "slideDown",
				"unpinned": "slideUp"
			}
		}); 
		headroom.init();
		//}

		// -------------------------------------
		// Header: Drop Down Sub navigation
		$('#header-nav .sub-nav .mid-hover-nav li').mouseenter( function () { 
			var subNav = $(this).closest('.sub-nav').find('.col-3:last-child > ul'),
				subImg = $(this).closest('.sub-nav').find('.col-6 > a'),
				subIdx = $(this).index();
			subNav.stop().hide().eq(subIdx).fadeIn(300);
			subImg.hide().eq(subIdx+1).show();
			$(this).closest('.sub-nav').find('a').removeClass('active-nav');
			$(this).find('a').addClass('active-nav');
		});

		// ----------------------
		// Partial Form Fill Code
		$('input[required]').on('invalid', function(e){ 
			var form = $(this).closest('.webform');
			var formid = form.prop('id');
			if ( ((form.find("[name='fname']").val())||(form.find("[name='lname']").val())) && ((form.find("[name='email']").val())||(form.find("[name='phone']").val())) ) {
				var postdata = $(form).serialize();
				if (postdata==localStorage.getItem("partialpost")) return true;
				localStorage.setItem("partialpost", postdata);
				$.post( '/api?action=partial&formid='+formid, postdata, function(data) {
					if (data.status == 'done') 	console.log('awesome');
				}, "json").fail( function() { 
					console.log('Failed: The request failed.'); 
				});
			}
		});

		// -------------------------------------
		// Page: Wardrobe: Form
		$(".js-btn-wardrobe-next").on("click", function(){
			$(".wardrobe-calculator-measure").addClass("wardrobe-calculator-animate");
			$(".wardrobe-calculator-contact").removeClass("hide").addClass("wardrobe-calculator-animate");
		});

		// -------------------------------------
		// Page: Webforms: Form
		$('.webform').submit(function(e) {	
			e.preventDefault();
			$('input[type=submit]').attr('disabled','disabled');
			var thisform = $(this).prop('id');
			$.post( '/form.submit?form='+thisform,$('#'+thisform).serialize(),function(data) {
				if (data=='0') {
					if ( (thisform == 'vipform') || (thisform == 'vipfci') ) {
						$('#'+thisform).empty().html(
							'<h4>Thanks for the info.<br>'+
							'We&rsquo;ve added you onto the guest list and look forward to seeing you on the 5th.<br>'+
							'We&rsquo;ll send you an email shortly with more details.<br>'+
							'FCI2 Launch Team</h4>');
					} else if (thisform == 'scshowroomlead') {
						$('#'+thisform).empty().html("<h4>Thank you - your lead has been saved and has been assigned to you in the database.</h4><br>"+
													 "<a href='#' onclick='location.reload()' class='btn'>Add another client.</a>");
					} else if (thisform == 'dcqr') {
						$('#'+thisform).empty().html("<h4>Thank You.</h4>");
					} else if (thisform == 'dwnldcalligaris') {
						$('#'+thisform).empty().html("<h4>Thank you for your Info </h4><br>"+
													 "<a href='/site-assets/pdfs/why-buy-calligaris.pdf' class='btn'>Click here to Download Calligaris Data Sheet</a>");
					} else if (thisform == 'wishlistadd') {
						$('#'+thisform).empty().html("<h4>Thank you </h4>");
					} else if (thisform == 'showroomqr') {
						$('#'+thisform).empty().html(
							'<h4>Thank you!<br>'+
							'You have now been entered into our prize draw.<br>'+
							'The draw will take place on the 3rd and the winner will be notified via email.</h4>');
					} else if (thisform == 'birdeyereferral') {
						$('#'+thisform).empty().html(
							'<h4>Thank you!<br>'+
							"You'll receive your individual FCI Referral Code by email & SMS within the next 5 minutes.</h4>");
						
					} else if ( (thisform == 'propertyconsultantform') || (thisform == 'dubaiconsult') ) {
						$('#' + thisform).empty().html(
							'<h4 class="text-center">Thank you.<br>' +
							'We&rsquo;ll drop you an email and get one of the team to reach out shortly.<br>' +
							'If you need us in the meantime, please don&rsquo;t hesitate to call us.<br>' +
							'<a href="tel:+442081531235">020 8153 1235</a>.</h4>');
					} else {
						$('#'+thisform).empty().html(
							'<h4>Thank you.<br>'+
							'We&rsquo;ll drop you an email and get one of the team to reach out shortly.<br>'+
							'If you need us in the meantime, please don&rsquo;t hesitate to call us.<br>'+
							'<a href="tel:+442081531235">020 8153 1235.</a></h4>');			 
					}
					window.dataLayer = window.dataLayer || [];
					window.dataLayer.push({ 'formID': thisform, 'event': 'formsubmit'});
				} else alert('Error: '+ data);
			}).fail( function() { 
				alert('Failed: The request failed.'); 
			});
			return false;
		});
	});
})(jQuery);	
