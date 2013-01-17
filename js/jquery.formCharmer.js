(function( $ ) {
	$.fn.formCharm = function(options) {
	
		var element = this;
		var son = element.children()
		var total = son.length
		
		
		$.fn.addNav = function(){
				var chk = $(this).find('.charmerNav').size();
				if(chk==0 && chk<1){
					$(this).append('<div class="charmerNav"><ul><li><span class="backStep">Anterior</span></li><li><span class="nextStep">Siguiente</span></li></ul></div>')
				}
		}
		
		
			
			
		element.addClass('formCharmed')
		son.addClass('itemSlide')
		element.children(':first').addClass('active')
		
		
		// ENTREGA CUAL ES EL HIJO ACTIVO Y REDIMENSIONA EL PARENT	
		function activo(){
			var current = 0;		
			son.each(function(i,e){
				if($(e).hasClass('active')){
					current = $(this).index();
				}
			})			
			return current;		
		}
				
		
		// DEFAULT OPTIONS
		 var defaults = { 
		    counter:      true,		
		 }; 
		var options = $.extend({}, defaults, options);
		
		
		if(options.counter){
			element.addClass('wCounter')
			element.append('<div class="charmerCount"><span class="charmCurrent"></span>/<span class="charmTotal"></span></div>')
			$('.charmCurrent').append(activo()+1)
			$('.charmTotal').append(total)	
      	}
		if(options.callback){
			$.call(this);
		}
		
		$('.itemSlide.active > :input[required]').live("keyup", function() {
			var entradas = $(this).parent().find(':input[required]').size();
			var completados = $(this).parent().find(':input[required]').filter(function() { return $(this).val().trim() != ""; }).size()
			if(completados == entradas){
				$(this).parent().addNav()
				var newHeight = $(this).parent().height()
				$('.formCharmed').css({'height':newHeight})
			}else{
				$(this).parent().children('.charmerNav').remove()
				var newHeight = $(this).parent().height()
				$('.formCharmed').css({'height':newHeight})
			}
		})
		
		$('.itemSlide.active input:last').live("keydown", function(e){
			if (e.keyCode == 9 || e.which == 9) {	 	
					e.preventDefault();
					var entradas = $(this).parent().find(':input[required]').size();
					var completados = $(this).parent().find(':input[required]').filter(function() { return $(this).val() != ""; }).size()
					if(completados == entradas){
						nextSlide();
					}	 
				}
			})

		function nextSlide(){
			if(activo()<total-1/* && options.effect == 'slide'*/){
				//SI TIENE ACTIVADO EL COUNTER, MUESTRA CUAL ES EL ITEM ACTIVO
				var elCurrent = $('.formCharmed > .itemSlide.active')
				var chkIn = elCurrent.next('.itemSlide').children(':input[required]').size()
				if(chkIn==0){
					var chkNav = elCurrent.next('.itemSlide').find('.charmerNav').size()
					if(chkNav==0){
						elCurrent.next('.itemSlide').addNav()
					}
				}
				alto = elCurrent.next('.itemSlide').height()
				
				if(options.counter){$('.charmerCount').fadeOut('fast', function(){ $(this).children('.charmCurrent').html(activo()+1)})}
				if(!Modernizr.csstransitions){
					elCurrent.animate({ left: '-100%'}, 'linear', function(){
					      $(this).removeClass('active')
						  $(this).next('.itemSlide').animate({ left: '0%'}, 'linear', function(){
						  $(this).addClass('active')})
						  $('.formCharmed').css({'height':alto})
						  var coord = elCurrent.next('.itemSlide').offset();
						  $("html:not(:animated),body:not(:animated)").animate({ scrollTop: coord.top-20}, 300);
						  if(options.counter){ $('.charmerCount').fadeIn('fast')}
				  	})
				}else{
					elCurrent.addClass('animated fadeOutLeftBig').removeClass('active')
					elCurrent.next('.itemSlide').addClass('animated fadeInLeftBig active');
					$('.formCharmed').css({'height':alto})
					var coord = elCurrent.next('.itemSlide').offset();
					$("html:not(:animated),body:not(:animated)").animate({ scrollTop: coord.top-20}, 300);
					if(options.counter){ $('.charmerCount').fadeIn('fast')}
					window.setTimeout(function() {
						elCurrent.addClass('pass')
						elCurrent.removeClass('fadeOutLeftBig')
						elCurrent.next('.itemSlide').removeClass('fadeInLeftBig')
					}, 7*100);	
				}				
			}else{
				console.log(element.children('.active').index())
			}
		}
		
		function backSlide(){
			if(activo()>0 /*&& element.children('.active').index()<=total && options.effect == 'slide'*/){
				// SI TIENE ACTIVADO EL COUNTER, MUESTRA CUAL ES EL ITEM ACTIVO
				var elCurrent = $('.formCharmed > .itemSlide.active')
				var chkIn = elCurrent.prev('.itemSlide').children(':input[required]').size()
				if(chkIn==0){
					var chkNav = elCurrent.prev('.itemSlide').find('.charmerNav').size()
					if(chkNav==0){
						elCurrent.prev('.itemSlide').addNav()
					}
				}
				alto = elCurrent.prev('.itemSlide').height();
				
				if(options.counter){ $('.charmerCount').fadeOut('fast', function(){ $(this).children('.charmCurrent').html(activo()+1)})}
				if(!Modernizr.csstransitions) {
					elCurrent.animate({ left: '100%'}, 'linear', function() {
					      $(this).removeClass('active')
						  $(this).prev('.itemSlide').animate({ left: '0%'}, 'linear', function() {
						  $(this).addClass('active')})
						  $('.formCharmed').css({'height':alto}) 
						  var coord = elCurrent.prev('.itemSlide').offset();
						  $("html:not(:animated),body:not(:animated)").animate({ scrollTop: coord.top-20}, 300);
						  if(options.counter){ $('.charmerCount').fadeIn('fast')}
					})
					
				}else{
					elCurrent.addClass('fadeOutRightBig').removeClass('active')
					elCurrent.prev('.itemSlide').addClass('fadeInRightBig active').removeClass('pass');
					$('.formCharmed').css({'height':alto})
					var coord = elCurrent.prev('.itemSlide').offset();
					$("html:not(:animated),body:not(:animated)").animate({ scrollTop: coord.top-20}, 300);
					if(options.counter){ $('.charmerCount').fadeIn('fast')}
					window.setTimeout(function() {
						elCurrent.removeClass('fadeOutRightBig')
						elCurrent.prev('.itemSlide').removeClass('fadeInRightBig')
					}, 7*100);	
				}
			}
		}
		
		
		if($('.charmerNav')){
			
			$('.backStep').live('tap', function(e){
				if($(e.target).data('oneTapBack')!='yes'){
					$(this).fadeOut('fast', function(){backSlide();})
					$(this).fadeIn('fast');
				}$(e.target).data('oneTapBack','yes');
				setTimeout(function() {$(e.target).removeData('oneTapBack','yes')} , 500);
			});
			
			$('.nextStep').live('tap', function(e){
				if($(e.target).data('oneTapNext')!='yes'){
					$(this).fadeOut('fast', function(){nextSlide();})
					$(this).fadeIn('fast');
				}$(e.target).data('oneTapNext','yes');
				setTimeout(function() {$(e.target).removeData('oneTapNext','yes')} , 500);
			})
			
			element.live('swiperight', function(e){
				if($(e.target).data('oneSwipeBack')!='yes'){
					backSlide();
				}$(e.target).data('oneSwipeBack','yes');
				setTimeout(function() {$(e.target).removeData('oneSwipeBack','yes')} , 500);
			})	
			
		}
		
		
		//ASIGNA LA ALTURA INICIAL		
		var initHeight = element.children('.active').height();
		element.css({'height':initHeight})
		
		
		// REAJUSTA SIEMPRE EL TAMAÑO DEL FORMULARIO SIN IMPORTAR SI LA PANTALLA SE REDIMENSIONA.
		$(window).resize(function(){
			var alto = $('.formCharmed > .itemSlide.active')
			$('.formCharmed').css({'height':alto})
		})
		
		
		$(document).keydown(function (e) {
			 if (!$(':input').is(':focus')){
		      	  var keyCode = e.keyCode || e.which,
		          arrow = {left: 37, up: 38, right: 39, down: 40 }	
			      switch (keyCode) {
			        case arrow.left:
			          backSlide();
			        break;
			        case arrow.up:
			          //$status.html('up!');
			        break;
			        case arrow.right:
			          nextSlide();
			        break;
			        case arrow.down:
			          //$status.html('down!');
			        break;
			      }
			 }
	    });
	};
})(jQuery);