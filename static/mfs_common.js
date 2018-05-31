var MFS = {};

//设置标题栏
MFS.initNav = function(cfg) {
	if(os.iphone){
		//格式化标题栏
		Fw.device.Device.addEvent('02',JSON.stringify(cfg));
	}else{
		//格式化标题栏
		SysClientJs.initPageTitle(JSON.stringify(cfg));
	}
}

MFS.hideNav = function() {
	var args = {"type":"hide"};
	if(os.iphone){
		//格式化标题栏
		Fw.device.Device.addEvent('901',JSON.stringify(args));
	}else{
		//格式化标题栏
		SysClientJs.isShowPageTitle(JSON.stringify(args));
	}
}

MFS.showNav = function() {
	var args = {"type":"show"};
	if(os.iphone){
		//格式化标题栏
		Fw.device.Device.addEvent('901',JSON.stringify(args));
	}else{
		//格式化标题栏
		SysClientJs.isShowPageTitle(JSON.stringify(args));
	}
}

MFS.goBack = function() {
    if(os.iphone){
        Fw.device.Device.addEvent('31','{}');
    }else{
        SysClientJs.gotoIndex();
    }
}

MFS.goToHomePage = function() {
    if(os.iphone){
        Fw.device.Device.addEvent('32','{}');
    }else{
        SysClientJs.gotoHomePage();
    }
}

MFS.login = function(params) {
    if(os.iphone){
        Fw.device.Device.addEvent('900',JSON.stringify(params));
    }else{
        SysClientJs.commonLogin(JSON.stringify(params));
    }
}

MFS.share = function(params) {
    if(os.iphone){
        Fw.device.Device.addEvent('67',JSON.stringify(params));
    }else{
        SysClientJs.pupShareDialog(JSON.stringify(params));
    }
}

MFS.getLocation = function(params) {
    if(os.iphone){
        Fw.device.Device.addEvent('905',JSON.stringify(params));
    }else{
        SysClientJs.getLocationOfGCJ(JSON.stringify(params));
    }
}

MFS.openAccount = function(env) {
    if (env == "test") {
        window.location.href = "http://60.190.244.46:39880/mfs/page/accountOpen/inputIdNo.html";
    } else if (env == "preRelease") {
        window.location.href = "http://60.190.244.46:39880/mfs2/page/accountOpen/inputIdNo.html";
    } else if (env == "release") {
        window.location.href = "https://fshl.zj96596.com/mfs/page/accountOpen/inputIdNo.html";
    }
}

MFS.loginCallback = function(data) {
	console.info("登录回调调用, 回调数据: " + data);
}

MFS.navRightCallback = function(data) {
	console.info("导航栏右侧回调调用, 回调数据: " + data);
}

MFS.navLeftCallback = function(data) {
	console.info("导航栏左侧回调调用, 回调数据: " + data);
}



