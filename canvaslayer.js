
canvasFn = {};
canvasFn.isEmpty = function($var) {
	if (typeof $var == 'undefined' || $var == 0 || $var == '' || $var == null || $var == false) {
		return true;
	}
	return false;
}
/**
 * 得到canvas
 */
canvasFn.getCanvas = function( $name, $width, $height ){
	var $canvas = {};
	/*-----------filter-----------*/
	$canvas.filter = {};
	$canvas.errors = [];
	$canvas.filter.core= {};
	$canvas.filter.core.alpha = function( $data,picLength,$alphaNum ) {
		for (var i = 0; i < picLength * 4; i += 4) {
		  $data[i + 3] = $alphaNum;
		}
		return $data;
	}

	$canvas.filter.alpha = function($x,$y,$width,$height,$alphaNum){
		var $data = $canvas.target.getImageData($x,$y,$width,$height);
		var picLength = $width*$height;
		$data = $canvas.filter.core.alpha($data,picLength,$alphaNum);
		$canvas.target.putImageData($data, $x, $y);
	}
	var canvas = document.createElement('canvas');
	$($name).after('<div id="remove_div"></div>');
	$($name).remove();
	canvas.id = $name.substr(1);
	canvas.setAttribute('width', $width);
	canvas.setAttribute('height', $height);
	$('body').find('#remove_div').before(canvas);
	$('body').find('#remove_div').remove();
	$canvas.element = $($name);
	$canvas.element.width = $width;
	$canvas.element.height = $height;
	$canvas.element.css('width',$width);
	$canvas.element.css('height',$height);
	$canvas.target = $($canvas.element)[0].getContext("2d"); 

	/**
	 * img 图片 new image
	 */
	$canvas.rotateImage= function(img, degree)
	{
	   var canvas =null;
	   if($('body').find('#nonecanvas').size()  == 0){	
		   console.log('#nonecanvas canvas create !');
		   canvas = document.createElement('canvas');
		   $('body').append(canvas);  
		   $(canvas).attr('id','nonecanvas');
		   $(canvas).css('display','none');
	   }
	   canvas = $('body').find('#nonecanvas')[0];
	   if(!canvas || !canvas.getContext){
		   console.log('canvas none!');
	   }else{
	       var cContext = canvas.getContext('2d');
	       var width = img.width, height = img.height;
	       
	       
	       cw = Math.abs(height*Math.sin(degree*Math.PI/180))+Math.abs(width*Math.cos(degree*Math.PI/180));
	       ch = Math.abs(width*Math.sin(degree*Math.PI/180))+Math.abs(height*Math.cos(degree*Math.PI/180));
	       //  Rotate image            
		   canvas.setAttribute('width', cw);
		   canvas.setAttribute('height', ch);
		   cContext.translate(cw/2, ch/2);
		   cContext.rotate(degree * Math.PI / 180);
		   cContext.translate(-cw/2, -ch/2);
		   cContext.drawImage(img,cw/2-img.width/2,ch/2-img.height/2);
	    }
	  //  $(canvas).remove();
	    var $img = new Image();
	    $img.src = canvas.toDataURL();
	    return  $img;
	}
	
	$canvas.cut = function($img,$x,$y,$width,$height){
		console.log($x,$y,$width,$height);
		var canvas =null;
		   if($('body').find('#nonecanvas').size()  == 0){	
			   console.log('#nonecanvas canvas create !');
			   canvas = document.createElement('canvas');
			   $('body').append(canvas);  
			   $(canvas).attr('id','nonecanvas');
			   $(canvas).css('display','none');
		   }
		   canvas = $('body').find('#nonecanvas')[0];
		   if(!canvas || !canvas.getContext){
			   console.log('canvas none!');
		   }else{
		       var cContext = canvas.getContext('2d'); 
			   canvas.setAttribute('width', $width);
			   canvas.setAttribute('height', $height);
			   cContext.clearRect(0,0,$width,$height);
			   cContext.drawImage( $img, $x, $y, $width, $height,0,0,$width,$height);
		    }
		    var $img = new Image();
		    
		    $img.src = canvas.toDataURL();
		    return  $img;
	}
	
	/********get layer********/
	$canvas.getlayer = function($arguments) {
		var $layer = {},$defaultLayer = {
				'name':'layer',
				'x':0,//中心点
				'y':0,
				'px':0,//实际值 左上
				'py':0,
				'width':100,
				'oriwidth':100,
				'prelandFn':[],
				'height':100,
				'isold':false,
				'oriheight':100,
				'z':0,
				'color':'rgba(0,0,0,0)',
				'img':null,
				'oriimg':null,
				'other':null,
				'txt':null,
				'css':{
					'fontsize':'12px',
					'fontweight':'700',
					'fontcolor':'#000',
					'fontfamily':'Arial',
					'display':'block',
					'rotate':0,
					'scale':1
				},
				'fn':{ 'mouseup':[],'mousedown':[],'drag':[], 'leftclick':[], 'rightclick':[], 'mousemove':[] },
				'name':'layer',
				'childs':[],
				'persondata':{},
				'isadd':false,
				'parent':null
		};
		if( !canvasFn.isEmpty( arguments[1] ) ){
			$layer = arguments[1];
			$defaultLayer = $layer;
		}else{
			$layer = $defaultLayer;
		}
		if(canvasFn.isEmpty($arguments['name'])){
			$layer.name = $defaultLayer['name']+$canvas.uniqueId;
			$canvas.uniqueId++;
		}else{
			$layer.name = $arguments['name'];
		}
		$layer.constructor = 'layer';
		if( canvasFn.isEmpty( $layer.id  )){
			$layer.id = Math.random();
		}	
		$layer.x = canvasFn.isEmpty($arguments['x']) ? $defaultLayer['x'] : $arguments['x'];
		$layer.y = canvasFn.isEmpty($arguments['y']) ? $defaultLayer['y'] : $arguments['y'];
		$layer.width = canvasFn.isEmpty($arguments['width']) ? $defaultLayer['width'] : $arguments['width'];
		$layer.height = canvasFn.isEmpty($arguments['height']) ? $defaultLayer['height'] : $arguments['height'];
		$layer.z = canvasFn.isEmpty($arguments['z']) ? $defaultLayer['z'] : $arguments['z'];
		$layer.color = canvasFn.isEmpty($arguments['color']) ? $defaultLayer['color'] : $arguments['color'];
		$layer.img = canvasFn.isEmpty($arguments['img']) ? $defaultLayer['img'] : $arguments['img'];
		$layer.oriimg = $layer.img;
		
		$layer.txt = canvasFn.isEmpty($arguments['txt']) ? $defaultLayer['txt'] : $arguments['txt'];
		
		/**
		 * css
		 */
		if(!canvasFn.isEmpty($arguments['css'])){
			for(var $i in $layer.css){
				if($arguments['css'].hasOwnProperty($i)){
					$layer.css[$i] = $arguments['css'][$i];
				}
			}
		}
		if (!canvasFn.isEmpty($layer.img)) {
			$layer.width == 100 ? $layer.width = $layer.img.width : $layer.width = $layer.width;
			$layer.height == 100 ? $layer.height = $layer.img.height : $layer.height = $layer.height;
		}
		$layer.oriwidth  = $layer.width;
		$layer.oriheight  = $layer.height;
		$layer.x1 = $layer.x + $layer.width;
		$layer.y1 = $layer.y + $layer.height;
		if( canvasFn.isEmpty( $layer.fn  )){
			$layer.fn = { 'mouseup':[],'mousedown':[],'drag':[], 'leftclick':[], 'rightclick':[], 'mousemove':[] };
		}
		$layer.mouseup = function( $fn ){
			$layer.fn['mouseup'].push( $fn );
		}
		$layer.mousedown = function( $fn ){
			$layer.fn['mousedown'].push( $fn );
		}
		$layer.leftclick = function( $fn ){
			$layer.fn['leftclick'].push( $fn );
		}
		$layer.rightclick = function( $fn ){
			$layer.fn['rightclick'].push( $fn );
		}
		$layer.mousemove = function( $fn ){
			$layer.fn['mousemove'].push( $fn );
		}
		$layer.drag = function( $fn ){
			$layer.fn['drag'].push( $fn );
		}
		$layer.addChild =  function( $param ){
			if( $param.constructor != 'layer'){
				var $param= $canvas.getlayer( $param );
			}
			$canvas.addLayerCore($layer.childs,$param);
			$param['parent'] =  $layer;
			return $param;
		}
		$layer.remove = $layer.del = function(){
			var newlayers = [];
			for(var $i in $layer.parent.childs ){
				if($layer.parent.childs[$i] == $layer){
					continue;
				}
				newlayers.push($layer.parent.childs[$i]);
			}
			$layer.parent.childs = newlayers;
			$layer = null;
		}
		$layer.rotate = function( $degree ){
			if(typeof $degree == 'string' ){
				if($degree.substr(0,1) == '+'){
					$degree = parseInt($degree.substr(1))+$layer.css['rotate'];
				}
			}
			if($layer.img != null){
				$layer.img = $canvas.rotateImage($layer.oriimg,$degree);
			}
			$layer.css['rotate'] = $degree;
			$layer.isold = true;
		}
		$layer.scale = function( $float ){
			if(typeof $float != 'number' || $float < 0 ){
				return ;
			}
			$layer.css['scale'] = $float;
			$layer.isold = true;
		}
		$layer.preland = function( $fn ){
			$layer.prelandFn.push($fn);
		}
		$layer.setOther = function( $fn ){
			$layer.other = $fn;
		}
		$layer.cut = function( $x,$y,$width,$height ){
			$layer.img = $canvas.cut($layer.img, $x, $y, $width, $height);
			$layer.isold = true;
			return $layer;
		}
		return $layer;
	}
	/********get layer end********/
	
	
	
	
	
	$canvas.rootLayers = $canvas.getlayer({});//layer
	$canvas.selectLayer = function( $name ){
		if( typeof $name == 'object' && $name.constructor == 'layer' ){
			return $name;
		}
		for(var $i in $canvas.rootLayers.childs ){
			if($canvas.rootLayers.childs[$i].name == $name){
				return $canvas.rootLayers.childs[$i];
			}
		}
	}
	$canvas.uniqueId = 1;
	$canvas.addLayer = function($layer) {
		$canvas.addLayerCore($canvas.rootLayers.childs,$layer);
		$layer['parent'] = $canvas.rootLayers;
	}
	$canvas.addLayerCore = function($layers,$layer){
		if($layer['isadd'] == true){
			$canvas.errors.push('已经添加过层'+$layer.name);
			return false;
		}
		$layers.push($layer);
		if ($layers.length > 1) {
			$layers.sort(function(a, b) {
				return a['z'] - b['z'];
			})
		}
		$layer['isadd'] = true;
	}
	
	$canvas.createLayerAndIn = function($arguments) {
		var $layer = $canvas.getlayer($arguments);
		$canvas.addLayer($layer);
		return $layer;
	}
	
	$canvas.addImg = function() {
		var $params = {'img':''};
		if(!canvasFn.isEmpty( arguments[1] )){
			$params = arguments[1];
		}
		
		var img = new Image();
		img.src = arguments[0];
		$params['img'] = img;
		var $layer = $canvas.getlayer({});
		$canvas.addLayer( $layer );
		if(!canvasFn.isEmpty( arguments[2] )){
			$layer.preland( arguments[2] );
		}
		img.onload = function() {
			$layer = $canvas.getlayer( $params, $layer );
			$layer.x = $layer.img.width/2;
			$layer.y = $layer.img.height/2;
			if($layer.prelandFn.length>0){
				for(var $i in $layer.prelandFn){
					$layer.prelandFn[$i].call($layer);
				}
			}
		}
		return $layer;
	}
	$canvas.frameTime = 0;
	
	/**
	 * 一个layer
	 */
	$canvas.initOneLayer = function( $layer, $parentLayer ){
		//$canvas.target.clearRect($layer.x, $layer.y, $layer.width, $layer.height);
		if($layer.css.display == 'none'){
			return true;
		}
		
		//计算width height
		if($layer.isold){
			if($layer.img!=null){
				$layer.width = $layer.img.width*$layer.css.scale;
			}else{
				$layer.width = $layer.oriwidth*$layer.css.scale;
			}
			if($layer.img!=null){
				$layer.height = $layer.img.height*$layer.css.scale;
			}else{
				$layer.height = $layer.oriheight*$layer.css.scale;
			}
			$layer.isold = false;
		}
		
		if(!canvasFn.isEmpty($parentLayer)){
			$layer['px'] = $layer.x+$parentLayer.x-($parentLayer.width+$layer.width)/2;
			$layer['py'] = $layer.y+$parentLayer.y-($parentLayer.height+$layer.height)/2;
		}else{
			$layer['px'] = $layer.x-$layer.width/2;
			$layer['py'] = $layer.y-$layer.height/2;
		}
		
		//颜色

		$canvas.target.fillStyle = $layer.color;
		if( $layer.other != null ){
			$layer.other.call($layer,$canvas.target);
		}else{
			if (!canvasFn.isEmpty($layer.img)) {
				$canvas.target.drawImage( $layer.img, $layer.px, $layer.py, $layer.width, $layer.height);
				//console.log( $layer.px, $layer.py, $layer.width, $layer.height);
				$canvas.target.stroke();
			}else {
				$canvas.target.fillRect($layer.px, $layer.py, $layer.width, $layer.height);
				$canvas.target.stroke();
			}
			if(!canvasFn.isEmpty($layer.txt)){
				$canvas.target.fillStyle=$layer.css.fontcolor;
				$canvas.target.font = $layer.css.fontweight+" "+$layer.css.fontsize+" "+$layer.css.fontfamily;
				$canvas.target.fillText( $layer.txt, $layer.px, $layer.py+20 );  
				$canvas.target.stroke();
			}
		}
		if( $layer.childs.length > 0 ){
			for (var $i in $layer.childs) {
				$canvas.initOneLayer( $layer.childs[$i],$layer );
			}
		}
		
		return true;
	}
	
	$canvas.init = function() {
		$canvas.target.clearRect(0,0,this.element.width,this.element.height);
		for (var $i in this.rootLayers.childs) {
			var $layer = this.rootLayers.childs[$i];
			this.initOneLayer( $layer );
		}
		this.frameTime++;
		if (this.frameTime > 1000000) {
			this.frameTime = 0;
		}
	}
	$canvas.inits = null;
	$canvas.frame = function() {
		$canvas.inits =  setTimeout(function() {
			$canvas.init();
			$canvas.frame()
		}, 5);
	}
	//暂停
	$canvas.stopFrame = function(){
		clearTimeout($canvas.inits);
		$canvas.inits = null;
		console.log(1);
		clearInterval($canvas.fpsFns);
		$canvas.fpsFns = null;
	}
	$canvas.fps = 0;
	$canvas.fpsspan = null;
	$canvas.fpsFns = null;
	$canvas.fpsFn = function() {
		$(this.element).after('<span style="position:absolute;left:0px;bottom:0px;color:white;"></span>');
		$(this.element).parent().css('position','relative');
		$canvas.fpsspan = $(this.element).next();
		$canvas.fpsFn.prev = $canvas.frameTime;
		$canvas.fpsFns =  setInterval(
		function() {
			$canvas.fpsFn.now = $canvas.frameTime;
			$canvas.fps = ($canvas.fpsFn.now - $canvas.fpsFn.prev) / 0.1
			$canvas.fpsFn.prev = $canvas.fpsFn.now;
			$canvas.fpsspan.text($canvas.fps);
		}, 100);
	}
	$canvas.actionPoint = {
		'x': 0,
		'y': 0,
		'time': 0
	};
	$canvas.action = {};
	$canvas.action.points = {'mouseup':[],'mousedown':[],'drag':[], 'leftclick':[], 'rightclick':[], 'mousemove':[]};
	$canvas.action.callFn = function( $name ){
		for( var $i in $canvas.action.targets[$name] ){
			var $target = $canvas.action.targets[$name][$i];;
			if($target.fn[$name].length == 0 ){
				continue;
			}
			var $result = true;
			for( var $i in $target.fn[$name] ){
				var $fn = $target.fn[$name][$i];
			    if( $fn.call( $target,$canvas.action.points[$name] ) == false){
			    	$result = false;
			    }
			}
			if(!$result){
				break;
			}
		}
	}
	/**
	 * 添加对象
	 */
	$canvas.action.addTarget = function( $name, e ){
		$canvas.action.targets[$name] = [];
		$canvas.action.addTargetCore($canvas.rootLayers.childs,$name, e );
	}
	$canvas.action.addTargetCore = function( $layers, $name, e){
		$length = $layers.length;
		for (var $i = $length - 1; $i > -1; $i--) {
			$layers[$i].px1 = $layers[$i].px + $layers[$i].width;
			$layers[$i].py1 = $layers[$i].py + $layers[$i].height;
			if ($layers[$i].px < e.offsetX && $layers[$i].py < e.offsetY && $layers[$i].px1 > e.offsetX && $layers[$i].py1 > e.offsetY) {
				$canvas.action.targets[$name].push( $layers[$i] );
			}
			if($layers[$i].childs.length>0){
				$canvas.action.addTargetCore($layers[$i].childs,$name,e);
			}
		}
	}
	
	$canvas.action.targets = { 'mouseup':[],'mousedown':[],'drag':[], 'leftclick':[], 'rightclick':[], 'mousemove':[] };
	/**
	 * 添加作用点
	 */
	$canvas.action.addActionPoints = function( $action, $e ){
		if( $action == 'drag' ||  $action == 'mousemove' ){
			if( $canvas.action.points[$action].length > 20 ){
				$canvas.action.points[$action].shift();
			}
			$canvas.action.points[$action].push($e);
		}else{
			$canvas.action.points[$action] = [$e];
		}
	}
	$canvas.action.init = function(){
		$(document).ready(function(){   
				   $($canvas.element).bind("contextmenu",function(e){   
					   return false;   
				   });   
		});
		$($canvas.element).mousedown(function(e) {
			$canvas.action.addActionPoints('mousedown',e);
			$canvas.action.addTarget('mousedown',e);
			$canvas.action.callFn('mousedown');
			if( e.button == 0 ){
				$canvas.action.points['drag'] = [];
				$canvas.action.addActionPoints('drag',e);
			}
		});
	    
		$($canvas.element).mousemove( function(e) {
			$canvas.action.addActionPoints('mousemove',e);
			$canvas.action.addTarget('mousemove',e);
			$canvas.action.callFn('mousemove');
			if($canvas.action.points['mousedown'].length>0 ){
				var $downe = $canvas.action.points['mousedown'][$canvas.action.points['mousedown'].length -1];
				if( $canvas.action.points['mouseup'].length>0 ){
					if( $canvas.action.points['mouseup'][$canvas.action.points['mouseup'].length -1]['timeStamp'] > $downe.timeStamp){
						return ;
					}
				}
				if( $downe.button == 0 ){
					$canvas.action.targets['drag'] = $canvas.action.targets['mousedown'];
					$canvas.action.addActionPoints('drag',e);
					$canvas.action.callFn('drag');
				}
			}
		} )
		
		$($canvas.element).mouseup(function(e) {
			$canvas.action.addActionPoints('mouseup',e);
			$canvas.action.addTarget('mouseup',e);
			$canvas.action.callFn('mouseup');
			if($canvas.action.points['mousedown'].length>0){
				var $downe = $canvas.action.points['mousedown'][$canvas.action.points['mousedown'].length -1];
				if(e.timeStamp - $downe.timeStamp < 250){
					if( e.button == 0 ){
						$canvas.action.addTarget('leftclick',e);
						$canvas.action.addActionPoints('leftclick',e);
						$canvas.action.callFn('leftclick');
					}
					if( e.button == 2  ){
						$canvas.action.addTarget('rightclick',e);
						$canvas.action.addActionPoints('rightclick',e);
						$canvas.action.callFn('rightclick');
					}
				}
			}
		});
	}
	$canvas.replaceCanvas = function($name, $width, $height){
		 var canvas = document.createElement('canvas');
		 $($name).after('<div id="remove_div"></div>');
		 $($name).remove();
		 canvas.id = $name.substr(1);
		 canvas.setAttribute('width', $width);
		 canvas.setAttribute('height', $height);
		 $('body').find('#remove_div').before(canvas);
		 $('body').find('#remove_div').remove();
		 this.element = null
		 this.element = $('#'+canvas.id);
		 this.element.width = $width;
		 this.element.height = $height;
		 this.target = $(this.element)[0].getContext("2d");  
		 this.action.init();
	}
	$canvas.frame();
	$canvas.fpsFn();
	$canvas.action.init();
	return $canvas;
}


canvasFn.setCanVas = function( $name, $width, $height ){
	return canvasFn.getCanvas( $name, $width, $height);
}


