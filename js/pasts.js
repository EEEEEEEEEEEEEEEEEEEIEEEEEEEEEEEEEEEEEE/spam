$(function(){
  var _base64_l,data=[], base64=[],_newsrc,source,_opens=false;
  var imgout = new Array(4);
  var _sw = $('.filedLoad').outerWidth();
  var _sh = $('.filedLoad').outerHeight();
  var count_left = [];
  var count_right = [];
  var _cw,_ch,_ct,_cl,_maxoutline;
  $('input[name=uploadPicture]').on('change', function(e){
    data=[];
    base64=[];
    _newsrc = '';
    _opens=false;
    var _that = this.files[0];
    // var reader = new FileReader();
    // reader.readAsDataURL(e.target.files[0]);
    // reader.onload = (function (file) {
    //   return function (e) {
    //     _base64_l = this.result;
    //     data = [_base64_l];
    //     $("#img").addClass("upImg");
    //     var textHtml = "<img src='"+_base64_l+"'/>";
    //     $("#img").html(textHtml);
    //     hecheng();
    //   };
    // })(e.target.files[0]);
    lrz(this.files[0], {width: 1080,height :1080}).then(function (rst) {
      var textHtml = "<img src='"+rst.base64+"'/>";
      $("#img").html(textHtml);
      $("#img").addClass("upImg");
      _base64_l = rst.base64;
      data = [_base64_l];
      hecheng();
      return rst;
    }).always(function () {

    });
  });
  function hecheng(){
    draw(function(){
      document.getElementById('img-two').innerHTML='<img src="'+base64[0]+'">';
      _opens = true;
    })
  }
  function draw(fn){
    var c=document.createElement('canvas'),
      ctx=c.getContext('2d'),
      len=data.length;
    c.width=_sw;
    c.height=_sh;
    ctx.rect(0,0,c.width,c.height);
    ctx.fillStyle='#fff';
    ctx.fill();
    function drawing(n) {
      var img=new Image;
      //img.crossOrigin = 'Anonymous'; //解决跨域
      img.src=data[n];
      img.onload=function(){
        source = img;
        getimgsize(source.naturalWidth, source.naturalHeight, _sw, _sh, imgout);
        ctx.drawImage(source, imgout[0], imgout[1], imgout[2], imgout[3], 0, 0, c.width, c.height);
        //保存生成作品图片
        $('#img-two').html('');
        base64.push(c.toDataURL("image/jpeg",0.8));
        _newsrc = base64;
        //alert(JSON.stringify(base64));
        fn();
      }
    }
    drawing(0);
  };
  function _ajaxs(_base_64) {
    $.ajax({
      type: 'POST',
      dataType: "json",
      url: "https://api-cn.faceplusplus.com/facepp/v3/detect",
      data: {
        api_key: "dX1PVOe3npeexqw54ePyJuuJ49FVe_4F",
        api_secret: "zRMLUFdJHkzxeLbJ4CaYh6EuXYU0Fnrs",
        image_base64: ""+_base_64+"",
        return_landmark: "2",
      },
      success: function (res) {
        if(res.faces.length>0){
          console.log(res)
          _cw = res.faces[0].face_rectangle.width;
          _ch = res.faces[0].face_rectangle.height;
          _ct = res.faces[0].face_rectangle.top;
          _cl = res.faces[0].face_rectangle.left;
          for(var i = 1;i<17;i++){
            count_left.push(res.faces[0].landmark['contour_left'+i+'']);
            count_right.push(res.faces[0].landmark['contour_right'+i+'']);
          }
          count_right = count_right.reverse();
          _maxoutline = count_left.concat(count_right);
          // _newc(_maxoutline)
        }
        else{
          alert('请上传清晰的正脸照!!!')
        }
        $('.prompt').stop().hide();
      },
      error: function (err) {
        $('.prompt').stop().hide();
        alert('请上传清晰的正脸照!!!')
      }
    })
  }
  $('.up_btns').click(function () {
    $('.prompt').stop().show();
    var _datab = _newsrc[0].split('data:image/jpeg;base64,')[1];
    if(!_opens){return false}
    else{
      setTimeout(function () {
        _ajaxs(_datab);
      },500)
    }
  });
  var dada = [
    {y: 161, x: 17},
    {y: 173, x: 16},
    {y: 185, x: 16},
    {y: 196, x: 16},
    {y: 208, x: 17},
    {y: 219, x: 19},
    {y: 231, x: 21},
    {y: 243, x: 24},
    {y: 254, x: 27},
    {y: 266, x: 31},
    {y: 276, x: 37},
    {y: 286, x: 43},
    {y: 295, x: 51},
    {y: 303, x: 60},
    {y: 310, x: 70},
    {y: 315, x: 81},
    {y: 316, x: 112},
    {y: 312, x: 127},
    {y: 307, x: 142},
    {y: 300, x: 155},
    {y: 292, x: 168},
    {y: 283, x: 179},
    {y: 272, x: 188},
    {y: 260, x: 195},
    {y: 247, x: 200},
    {y: 233, x: 203},
    {y: 219, x: 204},
    {y: 205, x: 205},
    {y: 191, x: 205},
    {y: 177, x: 204},
    {y: 163, x: 203},
    {y: 148, x: 201},
    {y: 135, x: 144},
    {y: 133, x: 128},
    {y: 140, x: 40},
    {y: 143, x: 28}];
  var cws = 191;
  var chs = 191;
  var _leye = [
    {y: 170, x: 33},
    {y: 164, x: 39},
    {y: 161, x: 48},
    {y: 164, x: 57},
    {y: 171, x: 64},
    {y: 172, x: 56},
    {y: 174, x: 48},
    {y: 173, x: 40}
  ];
  var _reye = [
    {y: 169, x: 113},
    {y: 161, x: 119},
    {y: 157, x: 128},
    {y: 158, x: 139},
    {y: 164, x: 148},
    {y: 167, x: 140},
    {y: 170, x: 130},
    {y: 170, x: 121}
  ];
  var _mouth = [
    {y: 257, x: 73},
    {y: 254, x: 107},
    {y: 252, x: 122},
    {y: 255, x: 107},
    {y: 256, x: 88},
    // {y: 251, x: 87},
    {y: 256, x: 72},
    {y: 255, x: 62}
  ];
  function _newc(cws,chs,dada,_leye,_reye) {
    var can = document.getElementById('canvasTwo');
    var ctx = can.getContext('2d');
    can.width=_sw;
    can.height=_sh;
    // ctx.fillStyle = '#f5f5f5';
    // ctx.fillRect(0,0,_sw, _sh);
    ctx.globalAlpha="0.6";
    ctx.beginPath();
    ctx.lineCap="round";
    ctx.strokeStyle ="transparent";
    ctx.moveTo(dada[0]['x'],dada[0]['y']);
    for (var i = 1;i<dada.length;i++){//dada.length
      // ctx.lineTo(dada[i]['x'],dada[i]['y']);
      var ctrlP=getCtrlPoint(dada,i-1);
      ctx.bezierCurveTo(ctrlP.pA.x, ctrlP.pA.y, ctrlP.pB.x,ctrlP.pB.y, dada[i].x, dada[i].y);
    }
    // ctx.closePath();
    //最后，按照绘制路径画出直线
    ctx.stroke();
    ctx.clip();
    function getCtrlPoint(ps, i, a, b){
      if(!a||!b){
        a=0.25;
        b=0.25;
      }
      //处理两种极端情形
      if(i<1){
        var pAx = ps[0].x + (ps[1].x-ps[0].x)*a;
        var pAy = ps[0].y + (ps[1].y-ps[0].y)*a;
      }else{
        var pAx = ps[i].x + (ps[i+1].x-ps[i-1].x)*a;
        var pAy = ps[i].y + (ps[i+1].y-ps[i-1].y)*a;
      }
      if(i>ps.length-3){
        var last=ps.length-1
        var pBx = ps[last].x - (ps[last].x-ps[last-1].x)*b;
        var pBy = ps[last].y - (ps[last].y-ps[last-1].y)*b;
      }else{
        var pBx = ps[i+1].x - (ps[i+2].x-ps[i].x)*b;
        var pBy = ps[i+1].y - (ps[i+2].y-ps[i].y)*b;
      }
      return {
        pA:{x:pAx,y:pAy},
        pB:{x:pBx,y:pBy}
      }
    }
    function drawing() {
      var img=new Image;
      img.src='images/China.png';
      img.onload=function(){
        source = img;
        ctx.drawImage(source, 16, 129, cws, chs);
        _sles();
        _sres();
      }
    }
    drawing();
    function _leyes() {
      //绘制左边眼睛
      ctx.beginPath();
      ctx.lineCap="round";
      ctx.strokeStyle ="blue";
      ctx.moveTo(_leye[0]['x'],_leye[0]['y']);
      for (var i = 1;i<_leye.length;i++){//dada.length
        ctx.lineTo(_leye[i]['x'],_leye[i]['y']);
      }
      ctx.lineCap="round";
      ctx.closePath();
      //最后，按照绘制路径画出直线
      ctx.stroke();
    }
    function _reyes() {
      //绘制右边眼睛
      ctx.beginPath();
      ctx.lineCap="round";
      ctx.strokeStyle ="blue";
      ctx.moveTo(_reye[0]['x'],_reye[0]['y']);
      for (var i = 1;i<_reye.length;i++){//dada.length
        ctx.lineTo(_reye[i]['x'],_reye[i]['y']);
      }
      ctx.lineCap="round";
      ctx.closePath();
      //最后，按照绘制路径画出直线
      ctx.stroke();
    }
    function _mouths() {
      //绘制嘴巴
      ctx.beginPath();
      ctx.lineCap="round";
      ctx.strokeStyle ="blue";
      ctx.moveTo(_mouth[0]['x'],_mouth[0]['y']);
      for (var i = 1;i<_mouth.length;i++){//dada.length
        ctx.lineTo(_mouth[i]['x'],_mouth[i]['y']);
      }
      ctx.lineCap="round";
      ctx.closePath();
      //最后，按照绘制路径画出直线
      ctx.stroke();
    }
    function _sles() {
      var _lens = 31*13*4;
      var x0 = 48;
      var y0 = 167;
      var _a = 31;
      var _b = 13;
      var _kong = [];
      for(var i = 33;i< 64;i++){
        for(var j = 161;j < 174;j++){
          _kong.push({"x":i,"y":j});
        }
      }
      var _cd = ctx.getImageData(33, 161, 31, 13);
      var _bd = _cd.data;
      for(var x = 0;x < _lens; x+=4){
        if(Math.abs(_kong[x/4]['x']-x0)<_a&&Math.abs(_kong[x/4]['y']-y0)<_b){
          var r = _bd[i];
          var g = _bd[i+1];
          var b = _bd[i+2];
          var a = 0;
          _bd[x] = r;
          _bd[x+1] = g;
          _bd[x+2] = b;
          _bd[x+3] = a;
        }
      }
      ctx.putImageData(_cd, 33, 161);
    }
    function _sres() {
      var _lens = 35*13*4;
      var x0 = 130;//初始x原点
      var y0 = 163;//初始y原点
      var _a = 35;//x轴长度
      var _b = 13;//y轴高度
      var _kong = [];
      for(var i = 113;i< 148;i++){
        for(var j = 157;j < 170;j++){
          _kong.push({"x":i,"y":j});
        }
      }
      var _cd = ctx.getImageData(113, 157, 35, 13);
      var _bd = _cd.data;
      for(var x = 0;x < _lens; x+=4){
        if(Math.abs(_kong[x/4]['x']-x0)<_a&&Math.abs(_kong[x/4]['y']-y0)<_b){
          var r = _bd[i];
          var g = _bd[i+1];
          var b = _bd[i+2];
          var a = 0;
          _bd[x] = r;
          _bd[x+1] = g;
          _bd[x+2] = b;
          _bd[x+3] = a;
        }
      }
      ctx.putImageData(_cd, 113, 157);
    }
    _leyes();_reyes();_mouths();
    // //画出左眼
    // function _leyes() {
    //   //绘制左边眼睛
    //   ctx.beginPath();
    //   ctx.lineCap="round";
    //   ctx.strokeStyle ="transparent";
    //   ctx.moveTo(_leye[0]['x'],_leye[0]['y']);
    //   for (var i = 1;i<_leye.length;i++){//dada.length
    //     ctx.lineTo(_leye[i]['x'],_leye[i]['y']);
    //   }
    //   ctx.closePath();
    //   //最后，按照绘制路径画出直线
    //   ctx.stroke();
    // }
    // //画出右眼
    // function _reyes() {
    //   //绘制右边眼睛
    //   ctx.beginPath();
    //   ctx.lineCap="round";
    //   ctx.strokeStyle ="transparent";
    //   ctx.moveTo(_reye[0]['x'],_reye[0]['y']);
    //   for (var i = 1;i<_reye.length;i++){//dada.length
    //     ctx.lineTo(_reye[i]['x'],_reye[i]['y']);
    //   }
    //   ctx.closePath();
    //   //最后，按照绘制路径画出直线
    //   ctx.stroke();
    // }
    // //画出嘴巴
    // function _mouths() {
    //   //绘制嘴巴
    //   ctx.beginPath();
    //   ctx.lineCap="round";
    //   ctx.strokeStyle ="transparent";
    //   ctx.moveTo(_mouth[0]['x'],_mouth[0]['y']);
    //   for (var i = 1;i<_mouth.length;i++){//dada.length
    //     ctx.lineTo(_mouth[i]['x'],_mouth[i]['y']);
    //   }
    //   ctx.closePath();
    //   //最后，按照绘制路径画出直线
    //   ctx.stroke();
    // }
    // _leyes();_reyes();_mouths();
  }
  _newc(cws,chs,dada,_leye,_reye,_mouth)
});