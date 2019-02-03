$(document).ready(function(){
	// $('header div.link>a').on('click', function (evt) {
	// 	$(evt.target).fadeOut();
	// 	$(evt.target.nextElementSibling).fadeIn();	
	// });
	// $('ul.sub-link li a.go-back').on( 'click', function (evt) {
	// 	$(evt.target).parent().parent().slideUp();
	// 	$(evt.target).parent().parent().prev().slideDown();
	// });	

	$('header div.link>a').on('click', function (evt) {
		$(evt.target).animate({ width: 'hide' }, 'fast');
		$(evt.target.nextElementSibling).animate({ width: 'show' });	
	});
	$('ul.sub-link li a.go-back').on( 'click', function (evt) {
		$(evt.target).parent().parent().animate({ width: 'hide' }, 'fast');
		$(evt.target).parent().parent().prev().animate({ width: 'show' });	
	});	


	// menu 2:
	$('.link_2 .front a').on('click', (evt)=>{
		evt.preventDefault();
		$(evt.target).parent().parent().css({
			transform:'rotateY(180deg)'
		})
	});
	$('.link_2 .back a.go-back').on('click', (evt)=>{
		evt.preventDefault();
		$(evt.target).parent().parent().parent().parent().css({
			transform:'rotateY(0deg)'
		})
	});

});// end ready


