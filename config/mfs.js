// const MFS = {}

// IOS桥接JS

// 获取浏览器类型
var ua = navigator.userAgent
//
var os = {}
var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/)
var ipad = ua.match(/(iPad).*OS\s([\d_]+)/)
var iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/)
var ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/)
if (android) os.android = true
if (iphone && !ipod) os.ios = os.iphone = true

/**
 * @name Fw.util.JSON
 * @class JSON工具类
 * @example : <br>
 * json --> string
 *          Fw.encode({...});<br>
 *          string --> json
 *          Fw.decode('{...}');
 */
var Fw = {}
Fw.util = {}
Fw.util.JSON = (new(function() {
  var me = this,
    encodingFunction,
    decodingFunction,
    useNative = null,
    useHasOwn = !!{}.hasOwnProperty,
    isNative = function() {
      if (useNative === null) {
        //useNative = Fw.USE_NATIVE_JSON && window.JSON && JSON.toString() == '[object JSON]';
        useNative = window.JSON && JSON.toString() == '[object JSON]';
      }
      return useNative;
    },
    pad = function(n) {
      return n < 10
        ? "0" + n
        : n;
    },
    doDecode = function(json) {
      return eval("(" + json + ')');
    },
    doEncode = function(o, newline) {
      if (o === null || o === undefined) {
        return "null";
      } else if (Fw.isDate(o)) {
        return Fw.util.JSON.encodeDate(o);
      } else if (Fw.isString(o)) {
        return Fw.util.JSON.encodeString(o);
      } else if (typeof o == "number") {
        return isFinite(o)
          ? String(o)
          : "null";
      } else if (Fw.isBoolean(o)) {
        return String(o);
      } else if (o.toJSON) {
        return o.toJSON();
      } else if (Fw.isArray(o)) {
        return encodeArray(o, newline);
      } else if (Fw.isObject(o)) {
        return encodeObject(o, newline);
      } else if (typeof o === "function") {
        return "null";
      }
      return 'undefined';
    },
    m = {
      "\b": '\\b',
      "\t": '\\t',
      "\n": '\\n',
      "\f": '\\f',
      "\r": '\\r',
      '"': '\\"',
      "\\": '\\\\',
      '\x0b': '\\u000b' //ie doesn't handle \v
    },
    charToReplace = /[\\\"\x00-\x1f\x7f-\uffff]/g,
    encodeString = function(s) {
      return '"' + s.replace(charToReplace, function(a) {
        var c = m[a];
        return typeof c === 'string'
          ? c
          : '\\u' + (
          '0000' + a.charCodeAt(0).toString(16)).slice(-4);
      }) + '"';
    },
    encodeArray = function(o, newline) {
      var a = [
          "[", ""
        ],
        len = o.length,
        i;
      for (i = 0; i < len; i += 1) {
        a.push(Fw.util.JSON.encodeValue(o[i]), ',');
      }
      a[a.length - 1] = ']';
      return a.join("");
    },
    encodeObject = function(o, newline) {
      var a = [
          "{", ""
        ],
        i,
        val;
      for (i in o) {
        val = o[i];
        if (!useHasOwn || o.hasOwnProperty(i)) {
          if (typeof val === 'function' || val === undefined) {
            continue;
          }
          a.push(Fw.util.JSON.encodeValue(i), ":", Fw.util.JSON.encodeValue(val), ',');

        }
      }
      a[a.length - 1] = '}';
      return a.join("");
    };
  me.encodeString = encodeString;
  me.encodeValue = doEncode;
  me.encodeDate = function(o, returnString) {
    var val = o.getFullYear() + "-" + pad(o.getMonth() + 1) + "-" + pad(o.getDate()) + "T" + pad(o.getHours()) + ":" + pad(o.getMinutes()) + ":" + pad(o.getSeconds());
    //
    if (returnString !== false) {
      val = '"' + val + '"';
    }
    return val;
  };
  me.encode = function(o) {
    if (!encodingFunction) {
      encodingFunction = isNative()
        ? JSON.stringify
        : me.encodeValue;
    }
    return encodingFunction(o);
  };
  me.decode = function(json, safe) {
    if (!decodingFunction) {
      decodingFunction = isNative()
        ? JSON.parse
        : doDecode;
    }
    try {
      return decodingFunction(json);
    } catch (e) {
      if (safe === true) {
        return null;
      }
    }
  };
})());
//
Fw.encode = Fw.util.JSON.encode;
Fw.decode = Fw.util.JSON.decode;

/**
 * 是否是函数
 * @param {} v
 */
Fw.isFunction = function(v) {
  return Fw.toString(v) === '[object Function]';
},

/**
 * 是否是对象
 * @param {} v
 */
Fw.isObject = function(v) {
  return !!v && Fw.toString(v) === '[object Object]' && !Fw.isNumber(v.length) && !Fw.isFunction(v.splice) && (!Fw.isFunction(v.propertyIsEnumerable) || !v.propertyIsEnumerable('splice'));
}

/**
 * 转换为字符
 * @param {Object} v
 */
Fw.toString = function(v) {
  return Object.prototype.toString.apply(v);
}

/**
 * 是否是数值型
 * @param {} v
 */
Fw.isNumber = function(v) {
  return typeof v === 'number' && isFinite(v);
}

/* IOS桥接JS */
Fw.device = {
  Device: {
    //事件队列
    eventQueue: [],
    //向IOS客户端添加事件
    addEvent: function(code, options) {
      alert('进入addEvent方法');
      if (options && code) {
        this.eventQueue.push(Fw.encode({
          code: code,
          name: Fw.isObject(options)
            ? Fw.encode(options)
            : options
        }));
      }
    },
    //IOS客户端调用此方法获取事件的信息
    getEvent: function() {
      return this.eventQueue.length > 0
        ? this.eventQueue.shift()
        : '0';
    }
  }
}

var getWebkitEvent = getWebkitEvent || function() {};

export const MFS = {
  // 设置标题栏
  initNav (cfg) {
    if (os.iphone) {
      // 格式化标题栏
      Fw.device.Device.addEvent('02', JSON.stringify(cfg))
    } else {
      // 格式化标题栏
      SysClientJs.initPageTitle(JSON.stringify(cfg))
    }
  },

  hideNav () {
    var args = {
      'type': 'hide'
    }
    if (os.iphone) {
      //格式化标题栏
      Fw.device.Device.addEvent('901', JSON.stringify(args));
    } else {
      //格式化标题栏
      SysClientJs.isShowPageTitle(JSON.stringify(args));
    }
  },

  showNav () {
    var args = {
      "type": "show"
    };
    if (os.iphone) {
      //格式化标题栏
      Fw.device.Device.addEvent('901', JSON.stringify(args));
    } else {
      //格式化标题栏
      SysClientJs.isShowPageTitle(JSON.stringify(args));
    }
  },

  goBack () {
    if (os.iphone) {
      Fw.device.Device.addEvent('31', '{}');
    } else {
      SysClientJs.gotoIndex();
    }
  },

  goToHomePage () {
    if (os.iphone) {
      Fw.device.Device.addEvent('32', '{}');
    } else {
      SysClientJs.gotoHomePage();
    }
  },

  login (params) {
    if (os.iphone) {
      Fw.device.Device.addEvent('900', JSON.stringify(params));
    } else {
      SysClientJs.commonLogin(JSON.stringify(params));
    }
  },

  share (params) {
    if (os.iphone) {
      Fw.device.Device.addEvent('67', JSON.stringify(params));
    } else {
      SysClientJs.pupShareDialog(JSON.stringify(params));
    }
  },

  getLocation (params) {
    if (os.iphone) {
      Fw.device.Device.addEvent('905', JSON.stringify(params));
    } else {
      SysClientJs.getLocationOfGCJ(JSON.stringify(params));
    }
  },

  openAccount (env) {
    if (env == "test") {
      window.location.href = "http://60.190.244.46:39880/mfs/page/accountOpen/inputIdNo.html";
    } else if (env == "preRelease") {
      window.location.href = "http://60.190.244.46:39880/mfs2/page/accountOpen/inputIdNo.html";
    } else if (env == "release") {
      window.location.href = "https://fshl.zj96596.com/mfs/page/accountOpen/inputIdNo.html";
    }
  },

  loginCallback (data) {
    console.info("登录回调调用, 回调数据: " + data);
  },

  navRightCallback (data) {
    console.info("导航栏右侧回调调用, 回调数据: " + data);
  },

  navLeftCallback (data) {
    console.info("导航栏左侧回调调用, 回调数据: " + data);
  }
}

MFS.Oauth = {
  // 隐式授权，调出授权界面，直接获取accessToken
  authorize (pms) {
    if (os.iphone) {
      Fw.device.Device.addEvent('904', JSON.stringify(pms));
    } else {
      SysClientJs.getAuthorizeMsg(JSON.stringify(pms));
    }
  },

  //获取access Token
  getAccessToken (pms) {
    pms.params.oauthFlag = "2";
    if (os.iphone) {
      Fw.device.Device.addEvent('903', JSON.stringify(pms));
    } else {
      SysClientJs.getTokenOpenIdMsg(JSON.stringify(pms));
    }
  },

  // 调出授权界面，获取oauthCode
  getOauthCode (pms) {
    if (os.iphone) {
      Fw.device.Device.addEvent('902', JSON.stringify(pms)); //ios
    } else {
      SysClientJs.getScopeQryMsg(JSON.stringify(pms));
    }
  },

  // 根据clientId查询是否已经生成了openId并获取
  queryOpenId (pms) {
    pms.params.oauthFlag = "5";
    if (os.iphone) {
      Fw.device.Device.addEvent('903', JSON.stringify(pms));
    } else {
      SysClientJs.getTokenOpenIdMsg(JSON.stringify(pms));
    }
  },

  // 根据refreshToken刷新accessToken
  refreshAccessToken (pms) {
    pms.params.oauthFlag = "6";
    if (os.iphone) {
      Fw.device.Device.addEvent('903', JSON.stringify(pms));
    } else {
      SysClientJs.getTokenOpenIdMsg(JSON.stringify(pms));
    }
  },

  // 根据accessToken生成OpenId, 初次授权时使用
  getOpenId (pms) {
    pms.params.oauthFlag = "3";
    if (os.iphone) {
      Fw.device.Device.addEvent('903', JSON.stringify(pms));
    } else {
      SysClientJs.getTokenOpenIdMsg(JSON.stringify(pms));
    }
  }
}

// export default MFS
