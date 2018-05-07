$(function(){
  var _base64_l,data=[], base64=[],_newsrc,source,_opens=false;
  var imgout = new Array(4);
  var _sw = $('.filedLoad').outerWidth();
  var _sh = $('.filedLoad').outerHeight();
  var count_left = [];
  var count_right = [];
  var _cw,_ch,_ct,_cl,_maxoutline,_rotates,_dark;
  var _eyebrow = [];
  var _leye=[];
  var _reye=[];
  var _mouth=[];

  var u = navigator.userAgent;
  var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
  var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

  function rotateImage(image) {
    var width = image.width;
    var height = image.height;

    var canvas = document.createElement("canvas")
    var ctx = canvas.getContext('2d');

    var newImage = new Image();

    //旋转图片操作
    EXIF.getData(image,function () {
        var orientation = EXIF.getTag(this,'Orientation');
        // orientation = 6;//测试数据
        console.log('orientation:'+orientation);
        switch (orientation){
          //正常状态
          case 1:
            console.log('旋转0°');
            // canvas.height = height;
            // canvas.width = width;
            newImage = image;
            break;
          //旋转90度
          case 6:
            console.log('旋转90°');
            canvas.height = width;
            canvas.width = height;
            ctx.rotate(Math.PI/2);
            ctx.translate(0,-height);

            ctx.drawImage(image,0,0)
            imageDate = canvas.toDataURL('Image/jpeg',1)
            newImage.src = imageDate;
            break;
          //旋转180°
          case 3:
            console.log('旋转180°');
            canvas.height = height;
            canvas.width = width;
            ctx.rotate(Math.PI);
            ctx.translate(-width,-height);

            ctx.drawImage(image,0,0)
            imageDate = canvas.toDataURL('Image/jpeg',1)
            newImage.src = imageDate;
            break;
          //旋转270°
          case 8:
            console.log('旋转270°');
            canvas.height = width;
            canvas.width = height;
            ctx.rotate(-Math.PI/2);
            ctx.translate(-height,0);

            ctx.drawImage(image,0,0)
            imageDate = canvas.toDataURL('Image/jpeg',1)
            newImage.src = imageDate;
            break;
          //undefined时不旋转
          case undefined:
            console.log('undefined  不旋转');
            newImage = image;
            break;
        }
      }
    );
    return newImage;
  }

  $('input[name=uploadPicture]').on('change', function(e){
    clearCanvas();
    data=[];
    base64=[];
    _newsrc = '';
    _opens=false;
    var _that = this.files[0];
    if(isiOS){
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
    }
    else{
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (function (file) {
        return function (e) {
          _base64_l = this.result;
          data = [_base64_l];
          $("#img").addClass("upImg");
          var textHtml = "<img src='"+_base64_l+"'/>";
          $("#img").html(textHtml);
          hecheng();
        };
      })(e.target.files[0]);
    }
  });
  function hecheng(){
    draw(function(){
      $('.img-two').html('<img src="'+base64[0]+'">');
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
      img.src=data[n];
      img.onload=function(){
        var newImage = rotateImage(img);
        source = newImage;
        getimgsize(source.naturalWidth, source.naturalHeight, _sw, _sh, imgout);
                   //图片真实宽度        真实高度               盒子宽度 盒子高度 自定义数组
        ctx.drawImage(source, imgout[0], imgout[1], imgout[2], imgout[3], 0, 0, c.width, c.height);
        //保存生成作品图片
        $('.img-two').html('');
        base64.push(c.toDataURL("image/jpeg",0.8));
        _newsrc = base64;
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
        return_attributes:"eyestatus,headpose"
      },
      success: function (res) {
        _cw='';_ch='';_ct='';_cl='';_maxoutline=[];_rotates='';_dark='';
        count_left = [];
        count_right = [];
        _eyebrow = [];
        _leye=[];
        _reye=[];
        _mouth=[];
        if(res.faces.length>0){
          _rotates = res.faces[0].attributes.headpose.roll_angle;
          _dark = res.faces[0].attributes.glass.value;//None
          if(_dark == "None"){
            if(Math.abs(_rotates)<10){
              _cw = res.faces[0].face_rectangle.width;
              _ch = res.faces[0].face_rectangle.height;
              _ct = res.faces[0].face_rectangle.top;
              _cl = res.faces[0].face_rectangle.left;
              for(var i = 1;i<17;i++){
                count_left.push(res.faces[0].landmark['contour_left'+i+'']);
                count_right.push(res.faces[0].landmark['contour_right'+i+'']);
              }
              _eyebrow.push(res.faces[0].landmark['right_eyebrow_upper_right_quarter']);
              _eyebrow.push(res.faces[0].landmark['right_eyebrow_upper_middle']);
              _eyebrow.push(res.faces[0].landmark['left_eyebrow_upper_middle']);
              _eyebrow.push(res.faces[0].landmark['left_eyebrow_upper_left_quarter']);
              //左边眼睛
              _leye.push(res.faces[0].landmark['left_eye_left_corner']);
              _leye.push(res.faces[0].landmark['left_eye_upper_left_quarter']);
              _leye.push(res.faces[0].landmark['left_eye_top']);
              _leye.push(res.faces[0].landmark['left_eye_upper_right_quarter']);
              _leye.push(res.faces[0].landmark['left_eye_right_corner']);
              _leye.push(res.faces[0].landmark['left_eye_lower_right_quarter']);
              _leye.push(res.faces[0].landmark['left_eye_bottom']);
              _leye.push(res.faces[0].landmark['left_eye_lower_left_quarter']);
              //右边眼睛
              _reye.push(res.faces[0].landmark['right_eye_left_corner']);
              _reye.push(res.faces[0].landmark['right_eye_upper_left_quarter']);
              _reye.push(res.faces[0].landmark['right_eye_top']);
              _reye.push(res.faces[0].landmark['right_eye_upper_right_quarter']);
              _reye.push(res.faces[0].landmark['right_eye_right_corner']);
              _reye.push(res.faces[0].landmark['right_eye_lower_right_quarter']);
              _reye.push(res.faces[0].landmark['right_eye_bottom']);
              _reye.push(res.faces[0].landmark['right_eye_lower_left_quarter']);
              //嘴巴外唇
              _mouth.push(res.faces[0].landmark['mouth_left_corner']);
              _mouth.push(res.faces[0].landmark['mouth_upper_lip_left_contour2']);
              _mouth.push(res.faces[0].landmark['mouth_upper_lip_left_contour1']);
              _mouth.push(res.faces[0].landmark['mouth_upper_lip_top']);
              _mouth.push(res.faces[0].landmark['mouth_upper_lip_right_contour1']);
              _mouth.push(res.faces[0].landmark['mouth_upper_lip_right_contour2']);
              _mouth.push(res.faces[0].landmark['mouth_right_corner']);
              _mouth.push(res.faces[0].landmark['mouth_lower_lip_right_contour2']);
              _mouth.push(res.faces[0].landmark['mouth_lower_lip_right_contour3']);
              _mouth.push(res.faces[0].landmark['mouth_lower_lip_bottom']);
              _mouth.push(res.faces[0].landmark['mouth_lower_lip_left_contour3']);
              _mouth.push(res.faces[0].landmark['mouth_lower_lip_left_contour2']);
              count_right = count_right.reverse();
              _maxoutline = count_left.concat(count_right);
              _maxoutline = _maxoutline.concat(_eyebrow);
              //_newc(_cw,_ch,_maxoutline,_leye,_reye,_mouth,_ct,_cl,_srcs,_rotates);
              $('.upLoadFooter').addClass('active');
            }
            else{
              alert('脸部请不要过度倾斜!!!');
            }
          }
          else{
            alert('请不要佩戴墨镜或普通眼镜!!!');
          }
        }
        else{
          alert('请上传清晰的正脸照!!!');
        }
        $('.LoadingCall').stop().hide();
      },
      error: function (err) {
        $('.LoadingCall').stop().hide();
        alert('系统故障，请重试!!!');
      }
    })
  }
  var _srcs = '';
  var _ba_src = [],_loadDate=[],_loadBase=[];
  $('.upLoadTos').click(function () {
    clearCanvas();
    if(_newsrc){
      var _datab = _newsrc[0].split('data:image/jpeg;base64,')[1];
      if(!_opens){
        return false
      }
      else{
        _srcs = '';
        _ba_src = [];
        _srcs = $('.selectBlessing-container .item.active').children().attr('src');
        $('.LoadingCall').stop().show();
        setTimeout(function () {
          _ajaxs(_datab);
        },500);
        // if(_srcs){
        //   $('.prompt').stop().show();
        //   setTimeout(function () {
        //     _ajaxs(_datab);
        //   },500);
        // }
        // else{
        //   alert('没有选择国家');
        // }
      }
    }
    else{
      alert('请上传图片')
    }
  });
  $('.selectBlessing-container').on('click','.item',function () {
    clearCanvas();
    if(_newsrc){
      var _datab = _newsrc[0].split('data:image/jpeg;base64,')[1];
      if(!_opens){
        return false
      }
      else{
        $('.selectBlessing-container .item').removeClass('active');
        $(this).addClass('active');
        _srcs = '';
        _ba_src = [];
        _srcs = $('.selectBlessing-container .item.active').children().attr('src');
        if(_srcs){
          _newc(_cw,_ch,_maxoutline,_leye,_reye,_mouth,_ct,_cl,_srcs,_rotates);
        }
        else{
          alert('没有选择国家');
        }
      }
    }
    else{
      alert('请上传图片')
    }
  });
  $('.up_btns').click(function () {
    _written();
  });
  $('.lists1').click(function () {
    clearCanvas();
    $('.img-two').html('');
    $("#img").html('');
    _cw='';_ch='';_ct='';_cl='';_maxoutline=[];_rotates='';_dark='';
    count_left = [];
    count_right = [];
    _eyebrow = [];
    _leye=[];
    _reye=[];
    _mouth=[];
    _opens = false;
    _newsrc='';
    $('.selectBlessing-container .item').removeClass('active');
    $('.upLoadImgs,.upLoadFooter').removeClass('active');
  })
  $('.foot2_left').click(function(){
    clearCanvas();
    $('.img-two').html('');
    $("#img").html('');
    _cw='';_ch='';_ct='';_cl='';_maxoutline=[];_rotates='';_dark='';
    count_left = [];
    count_right = [];
    _eyebrow = [];
    _leye=[];
    _reye=[];
    _mouth=[];
    _opens = false;
    _newsrc='';
    $('.selectBlessing-container .item').removeClass('active');
    $('.upLoadImgs,.upLoadFooter').removeClass('active');
    $('.user_choose ').removeClass('active');
  })
  //绘制人脸
  function _newc(_cw,_ch,dada,_leye,_reye,_mouth,_ct,_cl,_srcs,_rotates) {
    var can = document.getElementById('canvasTwo');
    var ctx = can.getContext('2d');
    can.width=_sw;
    can.height=_sh;
    //ctx.fillStyle = '#f5f5f5';
    //ctx.fillRect(0,0,_sw, _sh);
    ctx.globalAlpha="0.8";
    ctx.lineCap="round";
    ctx.beginPath();
    ctx.strokeStyle ="transparent";
    ctx.moveTo(dada[0]['x'],dada[0]['y']);
    for (var i = 1;i<dada.length;i++){//dada.length
       ctx.lineTo(dada[i]['x'],dada[i]['y']);
      //var ctrlP=getCtrlPoint(dada,i-1);
      //ctx.bezierCurveTo(ctrlP.pA.x, ctrlP.pA.y, ctrlP.pB.x,ctrlP.pB.y, dada[i].x, dada[i].y);
    }
    //绘制贝塞尔曲线
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
    ctx.lineCap="round";
    ctx.closePath();
    //最后，按照绘制路径画出直线
    ctx.stroke();
    ctx.clip();
    //添加图片
    function drawing() {
      var img=new Image;
      img.src=""+_srcs+"";
      img.style.opacity='0.6';
      // img.style.transform="rotateZ("+_rotates+"deg)";
      img.onload=function(){
        source = img;
        ctx.drawImage(source, _cl, _ct,_cw,_ch);
        _deletel();
        _deleter();
        _deletem();
        _leyes();_reyes();_mouths();
        _ba_src.push(can.toDataURL("image/png",0.8));
        $('.newImg').attr('src',_ba_src[0]);
      }
    }
    drawing();
    //扣掉左睛
    function _deletel() {
      _deleteMain(_leye);
    }
    //扣掉右眼
    function _deleter() {
      _deleteMain(_reye);
    }
    //扣掉嘴巴
    function _deletem() {
      _deleteMain(_mouth);
    }
    //方法汇总
    function _deleteMain(handel) {
      //找到最大值最小值
      var _xtol = [];
      var _ytol = [];
      for(var y = 0;y<handel.length;y++){
        _xtol.push(handel[y]['x']);
        _ytol.push(handel[y]['y']);
      }
      //起始坐标
      var _x1 = Math.min.apply(null,_xtol)-2;
      var _y1 = Math.min.apply(null,_ytol)-2;
      //终点坐标
      var _x2 = Math.max.apply(null,_xtol)+2;
      var _y2 = Math.max.apply(null,_ytol)+2;
      //x轴长度
      var _a = Math.abs(_x2-_x1);
      //y轴长度
      var _b = Math.abs(_y2-_y1);
      //定义椭圆原点
      var _x0 = _a/2+_x1;//x轴
      var _y0 = _b/2+_y1;//y轴
      //定义坐标数组
      var _kong = [];
      //定义此区域像素矩阵个数
      var _lens = _a*_b*4;
      //定义此区域像素矩阵
      // console.log(_x0,_y0,_x1,_y1,_x2,_y2,_a,_b);
      //循环此区域所有像素点
      for(var r = _x1;r< _x2;r++){
        for(var k = _y1;k < _y2;k++){
          _kong.push({"x":r,"y":k});
        }
      }
      // console.log(_kong);
      //查找符合区域的像素点
      /*
                 * @param _a 椭圆长
                 * @param _b 椭圆宽
                 * @param x 鼠标x坐标
                 * @param y 鼠标y坐标
                 * @parm true 在椭圆内 false 不在椭圆内
                 * （x-x1)^2/A^2+(y-y1)^2/B^2=1
      */
      //Math.pow((_kong[x/4]['x']/_a),2) + Math.pow((_kong[x/4]['y']/_b),2) < 1
      //Math.abs(_kong[x/4]['x']-_x0)<_a&&Math.abs(_kong[x/4]['y']-_y0)<_b
      var canvasData = ctx.getImageData(_x1, _y1, _a, _b);
      var binaryData = canvasData.data;
      for(var w = 0;w < _lens; w+=4){
        //if(Math.pow((Math.abs((_kong[x/4]['x']-_x0))/_b),2) + Math.pow((Math.abs(_kong[x/4]['y']-_y0)/_a),2) < 1){}
        //if(((_kong[x/4]['x']-_x0)^2/(_a/2)^2)+((_kong[x/4]['y']-_y0)^2/(_b/2)^2)<1){}
        //if(Math.pow(_kong[x/4]['x']-_x0)<_a&&Math.abs(_kong[x/4]['y']-_y0)<_b){}
        var rs = canvasData.data[w];
        var gs = canvasData.data[w+1];
        var bs = canvasData.data[w+2];
        var as = 0;
        canvasData.data[w] = rs;
        canvasData.data[w+1] = gs;
        canvasData.data[w+2] = bs;
        canvasData.data[w+3] = as;
      }
      ctx.putImageData(canvasData, _x1, _y1);
    }
    //画出左眼
    function _leyes() {
      //绘制左边眼睛
      ctx.beginPath();
      ctx.lineCap="round";
      ctx.strokeStyle ="#eee";
      ctx.moveTo(_leye[0]['x'],_leye[0]['y']);
      for (var i = 1;i<_leye.length;i++){//dada.length
        ctx.lineTo(_leye[i]['x'],_leye[i]['y']);
      }
      ctx.closePath();
      //最后，按照绘制路径画出直线
      ctx.stroke();
    }
    //画出右眼
    function _reyes() {
      //绘制右边眼睛
      ctx.beginPath();
      ctx.lineCap="round";
      ctx.strokeStyle ="#eee";
      ctx.moveTo(_reye[0]['x'],_reye[0]['y']);
      for (var i = 1;i<_reye.length;i++){//dada.length
        ctx.lineTo(_reye[i]['x'],_reye[i]['y']);
      }
      ctx.closePath();
      //最后，按照绘制路径画出直线
      ctx.stroke();
    }
    //画出嘴巴
    function _mouths() {
      //绘制嘴巴
      ctx.beginPath();
      ctx.lineCap="round";
      ctx.strokeStyle ="#eee";
      ctx.moveTo(_mouth[0]['x'],_mouth[0]['y']);
      for (var i = 1;i<_mouth.length;i++){//dada.length
        ctx.lineTo(_mouth[i]['x'],_mouth[i]['y']);
      }
      ctx.closePath();
      //最后，按照绘制路径画出直线
      ctx.stroke();
    }
  }
  //清除画布
  function clearCanvas() {
    var cxt=document.getElementById("canvasTwo").getContext("2d");
    cxt.clearRect(0,0,_sw,_sh);
  }
  function _loadImg() {
    var c=document.createElement('canvas'),
      ctx=c.getContext('2d'),
      len=_loadDate.length;
      c.width=_sw;
      c.height=_sh;
      ctx.rect(0,0,c.width,c.height);
      ctx.fillStyle='transparent';
      ctx.fill();
    function drawing(n){
      if(n<len){
        var img=new Image;
        //img.crossOrigin = 'Anonymous'; //解决跨域
        img.src=_loadDate[n];
        img.onload=function(){
          ctx.drawImage(img,0,0,c.width,c.height);
          drawing(n+1);//递归
        }
      }else{
        //保存生成作品图片
        _loadBase.push(c.toDataURL("image/png",0.8));
        //alert(JSON.stringify(base64));
        $('.loadImg').attr('src','');
        $('.loadImg').attr('src',_loadBase);
        $('.upLoadImgs').addClass('active');
        setTimeout(function () {
          $('.WrittenWords').stop().fadeOut();
        },500)
      }
    }
    drawing(0);
  }
  function _written() {
    $('.WrittenWords .list').css({'top':'-50px','opacity':'0'})
    $('.WrittenWords').stop().fadeIn(function () {
      var imes = 0;
      $('.WrittenWords .list').each(function (i,e) {
        imes+=300;
        $(e).stop().delay(imes).animate({
          top:'0',
          opacity:'1'
        },500,function () {
          if(!$('.WrittenWords .list').is(':animated')){
            if(_newsrc){
              if(_opens){
                if(_srcs){
                  _loadDate=[];
                  _loadBase=[];
                  _loadDate.push(_newsrc[0],_ba_src[0]);
                  _loadImg();
                }
                else{
                  alert('没有选择国家')
                }
              }
              else {
                return false
              }
            }
            else{
              alert('请上传图片')
            }
          }
        })
      })
    });
  }
});