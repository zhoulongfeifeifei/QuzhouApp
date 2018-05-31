MFS.Oauth = (new(function() {
    // 隐式授权，调出授权界面，直接获取accessToken
	this.authorize = function(pms){
		if (os.iphone) {
			Fw.device.Device.addEvent('904', JSON.stringify(pms));
		} else {
			SysClientJs.getAuthorizeMsg(JSON.stringify(pms));
		}
	}     

	//获取access Token
	this.getAccessToken = function(pms){
        pms.params.oauthFlag = "2";
		if(os.iphone){
			Fw.device.Device.addEvent('903',JSON.stringify(pms));
		}else{
			SysClientJs.getTokenOpenIdMsg(JSON.stringify(pms));
		}
	}

	// 调出授权界面，获取oauthCode
	this.getOauthCode = function(pms){
		if(os.iphone){
			Fw.device.Device.addEvent('902',JSON.stringify(pms));//ios
		}else{
			SysClientJs.getScopeQryMsg(JSON.stringify(pms));
		}
	}

	// 根据clientId查询是否已经生成了openId并获取
	this.queryOpenId = function(pms) {
		pms.params.oauthFlag = "5";
		if(os.iphone){
			Fw.device.Device.addEvent('903', JSON.stringify(pms));
		}else{
			SysClientJs.getTokenOpenIdMsg(JSON.stringify(pms));
		}
	}

	// 根据refreshToken刷新accessToken
	this.refreshAccessToken = function(pms) {
		pms.params.oauthFlag = "6";
		if(os.iphone){
			Fw.device.Device.addEvent('903', JSON.stringify(pms));
		}else{
			SysClientJs.getTokenOpenIdMsg(JSON.stringify(pms));
		}
	}

	// 根据accessToken生成OpenId, 初次授权时使用
	this.getOpenId = function(pms){
        pms.params.oauthFlag = "3";
		if(os.iphone){
			Fw.device.Device.addEvent('903',JSON.stringify(pms));
		}else{
			SysClientJs.getTokenOpenIdMsg(JSON.stringify(pms));
		}
	}
})());
