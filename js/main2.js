//loading 动画
	var i =1;//图片闪动出现
	window.setInterval(function(){
		if(i<6){
			$('.loadImg'+ i).fadeIn()
			i++;
		}else{
			$('.loading_footer img').fadeOut();
			i=1;
		}
		
	},800)

	// 进度条加载
	var prg = 0;
	var timer =0;
	progress([80,90],[1,3],100)

	window.onload=function(){ /*全部加载完毕*/
		progress(100, [1,5],10,function(){
			window.setTimeout(function(){
				$('.Loading').hide();
				$('.introduce').show()
			},1000)
		})
	}

	function progress(dist, speed, delay, callback){
		var _dist = random(dist)
		var _delay = random(delay)
		var _speed = random(speed)

		window.clearTimeout(timer)
		timer = window.setTimeout(function(){
			if (prg + _speed >= _dist) {
				prg = _dist
				callback && callback()
			} else {
				prg += _speed
				progress(_dist, speed, delay, callback) 
			}
			$('.progress').html(parseInt(prg) + '%')
		}, _delay)
	}

	function random (n){ //获取随机数
		if (typeof n === 'object') {
			var times = n[1] - n[0]
			var offset = n[0]
			return Math.random()*times +offset
		} else {
			return n
		}
	}
//laoding动画结束

$(document).ready(function(){
	$('.in_mid').click(function(){
		$('.Food').addClass('active')
	})

	$('.Green').on('click',function(){
			$('.upLoad').addClass('active');
	})

	//detail
	$('.List dt').on('click',function(){
		var i = $(this).index() +1;
		$('.detail' + i).fadeIn(300)
	})
	$('.detail_close svg').click(function(){
		 $(this).parent().parent().fadeOut(300);
	})

	//.Food_footer转到rules
	$('.Food_footer').click(function(){
			$('.upLoad').addClass('active');	
	})

	//top 
	// 检测电话号码
	$('.phoneSubmit').on('click',function(){//点击时检测号码
		var Num =$('.phoneNum').val();
		var myreg=/^[1][3,4,5,7,8][0-9]{9}$/; 
		if(!myreg.test(Num)){
			alert('请输入正确号码')
		}else{ //触发点击事件
			$('.cover_share').fadeOut(200);
			$('.successWrap').fadeIn(200);
			$('.successWrap').on('click',function(){
				$('.successWrap').fadeOut(200);
			})
			setTimeout(function(){
				$('.successWrap').fadeOut(200);
			},2000)
			}
	})

	//input高度固定
	var HEIGHT = $('body').height();
	    $(window).resize(function() {
        	$('.user_choose').height(HEIGHT);
        	$('.cover_share').height(HEIGHT);
        	
    	});

	// share
	$('.share').on('click',function(){
		$(this).stop().fadeOut(200)
	})
	$('.contain_foot, .foot1').on('click',function(){
		$('.share').stop().fadeIn(200)
	})

	$('.head_close').on('click', function(){
		$('.cover_share').stop().fadeOut(200)
	})

	$('.lists2').click(function(){
		$('.user_choose').addClass('active');
	})

	$('.upLoadHref').click(function() {
		$('.rules').stop().fadeIn()
	})
	$('.icon_back').click(function(){
		$('.rules').stop().fadeOut()
	})


	$('.foot2_left').click(function(){
		$('.upLoad').addClass('active');

	})

		// user_choose	名次图标插入
		var jinpai = $('<svg class="icon_reward" aria-hidden="true"><use xlink:href="#icon-jinpai"></use></svg>')
		var yinpai = $('<svg class="icon_reward" aria-hidden="true"><use xlink:href="#icon-yinpai"></use></svg>')
		var tongpai = $('<svg class="icon_reward" aria-hidden="true"><use xlink:href="#icon-tongpai"></use></svg>')
		
		var myicon = 'http://onnqgmh3m.bkt.clouddn.com/sofyicon.png'
		var userIcon = $("<div class='user_icon'><img src='"+ myicon +"'/></div>") 

		$('.Tbody tr:first-child td:first-child').prepend(jinpai);
		$('.Tbody tr:nth-child(2) td:first-child').prepend(yinpai);
		$('.Tbody tr:nth-child(3) td:first-child').prepend(tongpai);
		$('.Tbody tr:nth-child(4) td:first-child').prepend(userIcon);

})


