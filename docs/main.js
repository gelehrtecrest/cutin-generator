(function($){
	//画像関連
	var img;
	var img2;
	var img_cutin;
	var stage;

	//画像ロード
	function loadImage (imageData, logoImageData, imageData_cutin, imageIni_cutin){
		//画像のロード
		//ローカル
		if($('input[name=logo]:checked').val() === 'local'){
			if(logoImageData !== null) {
				var baseImg = new Image();
				var canvas = document.getElementById('canvas');
				baseImg.src = canvas.toDataURL();
				img = new createjs.Bitmap(baseImg);
			} else {
				img = null;
			}
		} else if($('input[name=logo]:checked').val() === 'url'){
			// URL
			var baseImg = new Image();
			baseImg.src = $('#logourl').val()
			img = new createjs.Bitmap(baseImg);
		} else {
			// none
			img = null;
		}

		//画像が選択されている時のみ合成
		if(imageData !== null) {
			var baseImg2 = new Image();
			baseImg2.src = imageData;
			img2 = new createjs.Bitmap(baseImg2);
			$('#result').attr({
				'width': baseImg2.width,
				'height': baseImg2.height
			});
		}

		//カットイン画像のロード
		if(imageData_cutin !== null) {
			var baseImg_cutin = new Image();
			baseImg_cutin.src = imageData_cutin;
			img_cutin = new createjs.Bitmap(baseImg_cutin);
			$('#canvas_cutin').attr({
				'width': baseImg_cutin.width,
				'height': baseImg_cutin.height / 4
			});
			try{
				//イメージの拡大
				img_cutin.x = imageIni_cutin.xPos * 10 + img_cutin.getBounds().width / 2 * (1 + imageIni_cutin.Scale / 10);
				img_cutin.y = imageIni_cutin.yPos * 10 + img_cutin.getBounds().height / 2 * (1 + imageIni_cutin.Scale / 10);
				//拡縮は10％ずつ
				img_cutin.scaleX = img_cutin.scaleX * (1 + imageIni_cutin.Scale / 10);
				img_cutin.scaleY = img_cutin.scaleY * (1 + imageIni_cutin.Scale / 10);

				// x軸は真ん中をキープ
				// y軸は上から4分の1ぐらいで
				var cx = img_cutin.getBounds().width * (imageIni_cutin.Scale / 10 / 2);
				var cy = baseImg_cutin.height / 4 + imageIni_cutin.mHeight;

				// 画像を切り抜く
				/*
				img_cutin.set({
					sourceRect: new createjs.Rectangle(cx, cy, baseImg_cutin.width, baseImg_cutin.height / 4)
				});
				*/
				//img_cutin.regX = baseImg_cutin.height;
				//img_cutin.regY = baseImg_cutin.height;
				img_cutin.sourceRect = { x:0, y:cy, width:baseImg_cutin.width * (1 + imageIni_cutin.Scale / 10), height:baseImg_cutin.height / 4 / (1 + imageIni_cutin.Scale / 10)}
				console.log(baseImg_cutin.width * (1 + imageIni_cutin.Scale / 10));


				// 再描画
				//loadcutincanvas(img_cutin);
			} catch(e){
				console.log(e);
			}
		}
		stage = new createjs.Stage('result');
	}

	//ロゴを合成する処理
	function genImage (imageIni, imageIni_cutin){
		var logo_flag = true;
		try {
			//合成画像の設定
			//回転
			img.rotation = imageIni.rotation;
			//回転の中心は、画像の中央
			img.regX = img.getBounds().width / 2;
			img.regY = img.getBounds().height / 2;

			//上下は10ピクセルごと移動
			// 中央点からの補正
			//拡縮は10％ずつと過程 = いずれ定数化する必要がある
			img.x = imageIni.xPos * 10 + img.getBounds().width / 2 * (1 + imageIni.Scale / 10);
			img.y = imageIni.yPos * 10 + img.getBounds().height / 2 * (1 + imageIni.Scale / 10);

			//拡縮は10％ずつ
			img.scaleX = img.scaleX * (1 + imageIni.Scale / 10);
			img.scaleY = img.scaleY * (1 + imageIni.Scale / 10);

			//透明化
			img.alpha = imageIni.alpha;	
		} catch(e){
			logo_flag = false;
		}

		//cutin画像
		img_cutin.x = imageIni_cutin.xPos * 10;
		img_cutin.y = img2.getBounds().height / 3;

		//ステージ生成
		stage.addChild(img2);
		stage.addChild(img_cutin);
		if(logo_flag){
			stage.addChild(img);
		}

		//ステージ反映
		stage.update();
	}

	$(function(){
		//設定のデフォルト値
		$('#logourl').val('./default_logo.png');
		//loadlogocanvas('./default_logo.png', false);
	
		//ロゴURL変更時の処理
		$(document).on('input', '#logourl', function() {
			$.ajax({
				url: $('#logourl').val()
			}).done(function(data){
				var baseImg = new Image();
				baseImg.src = $('#logourl').val();
				img = new createjs.Bitmap(baseImg);
				$('#alert').text('');
				//URL再生成
				write_settingurl(imageIni, imageIni_cutin);
				loadlogocanvas($('#logourl').val(), false);
			}).fail(function(data){
				//$('#alert').text('ロゴのURLが間違っています。ヒント：httpsから始まるURLにしてください。');
			});
		});

/*	
		//ロゴURL変更時の処理
		$(document).on('input', '#cutinurl', function() {
			$.ajax({
				url: $('#cutinurl').val()
			}).done(function(data){
				var baseImg = new Image();
				baseImg.src = $('#cutinurl').val();
				img = new createjs.Bitmap(baseImg);
				$('#alert').text('');
				//URL再生成
				write_settingurl(imageIni);
				loadcutincanvas($('#cutinurl').val(), false);
			}).fail(function(data){
				$('#alert').text('カットインのURLが間違っています。ヒント：httpsから始まるURLにしてください。');
			});
		});
*/

		//読込画像のオブジェクト
		var imageIni = {
			xPos : 126,
			yPos : 26,
			Scale : 8,
			rotation : 0,
			alpha : 1.0,
			imageData : null,
			logoImageData : null,
			imageData_cutin : null,
			resetImage : function(){
				this.xPos = 2;
				this.yPos = 2;
				this.Scale = -5;
				this.rotation = 0;
			},
			makeImage : function(){
				if(this.imageData !== null) {
					loadImage(this.imageData, this.logoImageData, this.imageData_cutin, imageIni_cutin);
					genImage(this, imageIni_cutin);
				}
			}
		};

		//カットイン画像のオブジェクト
		var imageIni_cutin = {
			xPos : 0,
			yPos : 0,
			Scale : 0,
			rotation : 0,
			alpha : 1.0,
			mHeight: 10,
			imageData : null,
			logoImageData : null,
			imageData_cutin : null,
			resetImage : function(){
				this.xPos = 0;
				this.yPos = 0;
				this.Scale = 0;
				this.rotation = 0;
			},
			makeImage : function(){
				if(this.imageData !== null) {
					loadImage(this.imageData, this.logoImageData, this.imageData_cutin, this);
					genImage(imageIni, this);
				}
			}
		};


		//get情報
		var url = location.href;
		var parameters = url.split('?');
		var queries = (parameters[1] || 'dummy=dummy').split('&');
		i = 0;

		for(i; i < queries.length; i ++) {
			var t = queries[i].split('=');
			if(t['0'] == 'logourl'){
				$('#logourl').val(decodeURIComponent(t['1']));
			} else if(t['0'] == 'xpos'){
				imageIni.xPos = parseFloat(t['1']);
			} else if(t['0'] == 'ypos'){
				imageIni.yPos = parseFloat(t['1']);
			} else if(t['0'] == 'scale'){
				imageIni.Scale = parseFloat(t['1']);
			} else if(t['0'] == 'rotation'){
				imageIni.rotation = parseFloat(t['1']);
			} else if(t['0'] == 'alpha'){
				imageIni.alpha = parseFloat(t['1']);
			} else if(t['0'] == 'logo'){
				if(t['1'] == 'local'){
					$('input[name=logo]').val(['local']);
				}
			} else if(t['0'] == 'mheight'){
				imageIni_cutin.mHeight = parseFloat(t['1']);
			} else if(t['0'] == 'title'){
				$('title').text(decodeURIComponent(t['1']));
				$('h1').text(decodeURIComponent(t['1']));
			} else if(t['0'] == 'comment'){
				$('#comment').text(decodeURIComponent(t['1']));
			}
		}

		//イベント関連処理
		//画像読込
		$('#getfile').change(function (){
			//読み込み
			var fileList =$('#getfile').prop('files');
			var reader = new FileReader();
			reader.readAsDataURL(fileList[0]);

			//読み込み後
			$(reader).on('load',function(){
				$('#preview').prop('src',reader.result);
				imageIni.imageData = reader.result;
			});
		});

		//画像読込
		$('#getfile_cutin').change(function (){
			//読み込み
			var fileList =$('#getfile_cutin').prop('files');
			var reader = new FileReader();
			reader.readAsDataURL(fileList[0]);

			//読み込み後
			$(reader).on('load',function(){
				$('#preview_cutin').prop('src',reader.result);
				imageIni.imageData_cutin = reader.result;
				loadcutincanvas_first(reader.result, false, imageIni_cutin);
				loadImage(imageIni.imageData, imageIni.logoImageData, imageIni.imageData_cutin, imageIni_cutin);
			});
		});

	
		//ロゴ画像読込
		$('#logogetfile').change(function (){
			//読み込み
			var fileList =$('#logogetfile').prop('files');
			var reader = new FileReader();
			reader.readAsDataURL(fileList[0]);
			//読み込み後
			$(reader).on('load',function(){
				imageIni.logoImageData = reader.result;
				//loadlogocanvas(reader.result, false);
				loadImage(imageData, logoImageData, imageData_cutin, imageIni_cutin);
			});
		});

		//ロゴ画像読込(白抜き)
		$('#logogetfilealpha').change(function (){
			//読み込み
			var fileList =$('#logogetfilealpha').prop('files');
			var reader = new FileReader();
			reader.readAsDataURL(fileList[0]);
			//読み込み後
			$(reader).on('load',function(){
				imageIni.logoImageData = reader.result;
				//loadlogocanvas(reader.result, true);
				loadImage(imageData, logoImageData, imageData_cutin, imageIni_cutin);
			});
		});



		function loadlogocanvas(url, flag){
			var image = new Image();
			image.onload = function() {
				$('#canvas').attr({
					'width': image.width,
					'height': image.height
				});
				var canvas = document.getElementById('canvas');
				var context = canvas.getContext('2d');
 				context.drawImage(image, 0, 0);
				var imageData = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
				var data = imageData.data;
				for (var i = 0; i < data.length; i += 4) {
					//各カラーチャンネルで、一番暗い値を取得
					var minLuminance = 255;
					if(data[i] < minLuminance)
						minLuminance = data[i];
					if(data[i + 1] < minLuminance)
						minLuminance = data[i + 1];
					if(data[i + 2] < minLuminance)
						minLuminance = data[i + 2];

					if(flag){
						//一番暗い値を、アルファチャンネルに反映(明るいところほど透明に)
						data[i + 3] = 255 - minLuminance;
					}
				}
				context.putImageData(imageData, 0, 0);
			};
			image.src = url;
		}
	
		/*
		function loadcutincanvas(url, flag, mHeight){
			var image = new Image();
			image.onload = function() {
				$('#canvas_cutin').attr({
					'width': image.width,
					'height': image.height / 4
				});
				var canvas = document.getElementById('canvas_cutin');
 				var context = canvas.getContext('2d');
				context.drawImage(image, 0, context.canvas.height + mHeight, context.canvas.width, context.canvas.height, 0, 0, context.canvas.width, context.canvas.height);
			};
			image.src = url;
		}
		*/


		//ボタンイベントまとめ
		$('.btn').on('click',function(e){
			if (e.target.id === 'update'){
			}else if (e.target.id === 'up_cutin'){
				imageIni_cutin.mHeight += 5;
			}else if (e.target.id === 'down_cutin'){
				imageIni_cutin.mHeight -= 5;
			}else if (e.target.id === 'zoomin_cutin') {
				imageIni_cutin.Scale += 1;
				if(imageIni_cutin.Scale > 0){
					$('#zoomout_cutin').prop("disabled", false);
				}
			}else if (e.target.id === 'zoomout_cutin') {
				imageIni_cutin.Scale -= 1;
				if(imageIni_cutin.Scale <= 0){
					imageIni_cutin.Scale = 0;
					$('#zoomout_cutin').prop("disabled", true);
				}
			}else if (e.target.id === 'left_cutin'){
				imageIni_cutin.xPos -= 5;
			}else if (e.target.id === 'right_cutin') {
				imageIni_cutin.xPos += 5;
			}else if (e.target.id === 'up'){
				imageIni.yPos -= 1;
			}else if (e.target.id === 'down'){
				imageIni.yPos += 1;
			}else if (e.target.id === 'left'){
				imageIni.xPos -= 1;
			}else if (e.target.id === 'right') {
				imageIni.xPos += 1;
			}else if (e.target.id === 'zoomin') {
				imageIni.Scale += 1;
			}else if (e.target.id === 'zoomout') {
				imageIni.Scale -= 1;
			}else if (e.target.id === 'rotation_r') {
				imageIni.rotation += 7.5;
			}else if (e.target.id === 'rotation_l') {
				imageIni.rotation -= 7.5;
			}else if (e.target.id === 'alpha_up') {
				imageIni.alpha += 0.1;
				if(imageIni.alpha >= 0.9){
					imageIni.alpha = 1.0;
					$('#alpha_up').prop("disabled", true);
				}
				$('#alpha_down').prop("disabled", false);
			}else if (e.target.id === 'alpha_down') {
				imageIni.alpha -= 0.1;
				if(imageIni.alpha <= 0.1){
					imageIni.alpha = 0.0;
					$('#alpha_down').prop("disabled", true);
				}
				$('#alpha_up').prop("disabled", false);
			}else if (e.target.id === 'reset'){
				imageIni.resetImage();
			}else if (e.target.id === 'dl'){
				return;
			}

			//画像操作時は再描画を行う
			if(imageIni.imageData !== null){
				imageIni.makeImage();
			}else{
				$('#alert').text('スクリーンショットを入力してから画像生成を行ってください');
			}

			//画面操作時はURLを再生成する
			write_settingurl(imageIni, imageIni_cutin);
		});

		$('input[name=logo]').click(function() {
			//チェックボックス操作時は再描画を行う
			if(imageIni.imageData !== null){
				imageIni.makeImage();
			}else{
				$('#alert').text('スクリーンショットを入力してから画像生成を行ってください');
			}

			//チェックボックス操作時はURLを再生成する
			write_settingurl(imageIni, imageIni_cutin);
		});

		//初回URL生成
		write_settingurl(imageIni, imageIni_cutin);

		//Canvas Download
		$('#btnDownload').on("click", function() {
			$('#alert').text('ダウンロード ボタンクリック');
			//if($('input[name=logo]:checked').val() === 'local'){
				DownloadStart();
			//} else if($('input[name=logo]:checked').val() === 'local_white'){
			//	DownloadStart();
			//} else {
			//	alert('ロゴがURL指定のため、ダウンロードボタンは使用できません。')
			//}
			$('#alert').text('ダウンロード処理終了');
		});
		$('#btnNewWindow').on("click", function() {
			NewWindow();
		});
	});

	//画像先読み込み
	$(window).on('load',function(){
		//画像のロード
		var baseImg = new Image();
		baseImg.src = $('#logourl').val();
		img = new createjs.Bitmap(baseImg);

		loadImage(null, null, null, null);
	});

	// URL生成
	function geturl(imageIni, imageIni_cutin) {
		var url;
		var baseurl = location.href.split('?')[0];
		url = baseurl;

		//設定をgetに追加
		//ロゴURL
		url = url + '?logourl=' + encodeURIComponent($('#logourl').val());
		//ロゴ位置・サイズ
		url = url + '&xpos=' + imageIni.xPos;
		url = url + '&ypos=' + imageIni.yPos;
		url = url + '&scale=' + imageIni.Scale;
		//ロゴ回転
		url = url + '&rotation=' + imageIni.rotation;
		//ロゴ透過
		url = url + '&alpha=' + imageIni.alpha;
		//ロゴ読み出し場所
		if($('input[name=logo]:checked').val() === 'local'){
			url = url + '&logo=local';
		}
		//カットインの高さ
		url = url + '&mheight=' + imageIni_cutin.mHeight;
		//タイトル
		url = url + '&title=' + encodeURIComponent($('title').text());
		//コメント
		url = url + '&comment=' + encodeURIComponent($('#comment').text());
		return url;
	}

	// URL書き込み
	function write_settingurl(imageIni, imageIni_cutin) {
		var url = geturl(imageIni, imageIni_cutin);
		$('#settingurl a').text(url);
		$('#settingurl a').attr('href', url);
	}

	function loadcutincanvas(image_cutin){
		var canvas = document.getElementById('canvas_cutin');
		var stage  = new createjs.Stage(canvas);
		stage.addChild(image_cutin);
		stage.update();
	}

	function loadcutincanvas_first(url, flag, imageIni_cutin){
		var image = new Image();
		image.onload = function() {
			$('#canvas_cutin').attr({
				'width': image.width,
				'height': image.height / 4,
			});
			var canvas = document.getElementById('canvas_cutin');
 			var context = canvas.getContext('2d');

			//拡大の分の半分だけdx,dyずらす
			var dx = 0 - context.canvas.width * (imageIni_cutin.Scale / 10 / 2);
			var dy = 0 - context.canvas.height * (imageIni_cutin.Scale / 10 / 2);
			//拡大の分だけdw,dhを増やす
			var dw =  context.canvas.width * (1 + imageIni_cutin.Scale / 10);
			var dh =  context.canvas.height * (1 + imageIni_cutin.Scale / 10);

			context.drawImage(image, 0, context.canvas.height + imageIni_cutin.mHeight, context.canvas.width, context.canvas.height, dx, dy, dw, dh)

		};
		image.src = url;
		return image;
	}



})($);

function DownloadStart(){
	
	var cve = document.getElementById("result");
	if (cve.getContext) {
		// ダウンロード ファイル名
		var now = new Date();
		var year = now.getYear();
		var month = now.getMonth() + 1;
		var day = now.getDate();
		var hour = now.getHours();
		var min = now.getMinutes();
		var sec = now.getSeconds();

		var filename = 'download_' + year + month + day + hour + min + sec + '.png';

		var ctx = cve.getContext('2d');
		var base64;
		try {
			base64 = cve.toDataURL();
		}catch(e) {
			alert("ロゴが外部URLをしているため、ダウンロードボタンを使用できません。")
			return;
		}
		document.getElementById("newImg").src = base64;

		var blob = Base64toBlob(base64);
		const url = window.URL.createObjectURL(blob);
		document.getElementById("dlImg").href = url;
		document.getElementById("dlImg").download = filename;

		$('#alert').text("ブラウザ判定");
		//  ダウンロード開始
		if (window.navigator.msSaveBlob) {
			// IE
			window.navigator.msSaveBlob(Base64toBlob(base64), filename);
		} else {
			// Chrome, Firefox, Edge
			document.getElementById("dlImg").click();
		}
		window.URL.revokeObjectURL(url);
	}
}

function Base64toBlob(base64)
{
	var tmp = base64.split(',');
	var data = atob(tmp[1]);
	var mime = tmp[0].split(':')[1].split(';')[0];
	var buf = new Uint8Array(data.length);
	for (var i = 0; i < data.length; i++) {
		buf[i] = data.charCodeAt(i);
	}
	var blob = new Blob([buf], { type: mime });
	return blob;
}

function NewWindow(){
	
	var cve = document.getElementById("result");
	if (cve.getContext) {
		var dataUrl;
		try {
			dataUrl = cve.toDataURL();
		}catch(e) {
			alert("ロゴが外部URLをしているため、ダウンロードボタンを使用できません。")
			return;
		}
		var w = window.open('about:blank');
		w.document.write("<img src='" + dataUrl + "'/>");
	} else {
	}
}
