//IOS桥接JS

//获取浏览器类型
var ua = navigator.userAgent;
//
var os = {};
var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
var iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);
var ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
if (android) os.android = true;
if (iphone && !ipod) os.ios = os.iphone = true;

/**
 * @name Fw.util.JSON
 * @class JSON工具类
 * @example : <br>
 * 			json --> string 
 *          Fw.encode({...});<br>
 *          string --> json
 *          Fw.decode('{...}');
 */
var Fw = {};
Fw.util = {};
Fw.util.JSON = (new(function() {
    var me = this,
    encodingFunction,
    decodingFunction,
    useNative = null,
    useHasOwn = !! {}.hasOwnProperty,
    isNative = function() {
        if (useNative === null) {
            //useNative = Fw.USE_NATIVE_JSON && window.JSON && JSON.toString() == '[object JSON]';
            useNative =  window.JSON && JSON.toString() == '[object JSON]';
        }
        return useNative;
    },
    pad = function(n) {
        return n < 10 ? "0" + n : n;
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
            return isFinite(o) ? String(o) : "null";
        } else if (Fw.isBoolean(o)) {
            return String(o);
        }
        else if (o.toJSON) {
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
            return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"';
    },
    encodeArray = function(o, newline) {
        var a = ["[", ""],
            len = o.length,
            i;
        for (i = 0; i < len; i += 1) {
            a.push(Fw.util.JSON.encodeValue(o[i]), ',');
        }
        a[a.length - 1] = ']';
        return a.join("");
    },
    encodeObject = function(o, newline) {
        var a = ["{", ""],
            i, val;
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
        var val = o.getFullYear() + "-"
        + pad(o.getMonth() + 1) + "-"
        + pad(o.getDate()) + "T"
        + pad(o.getHours()) + ":"
        + pad(o.getMinutes()) + ":"
        + pad(o.getSeconds());
        //
        if(returnString !== false){
            val = '"' + val + '"';
        }
        return val;
    };
    me.encode = function(o) {
        if (!encodingFunction) {
            encodingFunction = isNative() ? JSON.stringify : me.encodeValue;
        }
        return encodingFunction(o);
    };
    me.decode = function(json, safe) {
        if (!decodingFunction) {
            decodingFunction = isNative() ? JSON.parse : doDecode;
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

/*
 * IOS桥接JS
 */
Fw.device = {
	Device:{
	    //事件队列
	    eventQueue: [],
	    //向IOS客户端添加事件
	    addEvent:function(code, options) {
	    	//alert('进入addEvent方法');
	        if (options && code) {
	             this.eventQueue.push(Fw.encode({
	                code : code,
	                name : Fw.isObject(options) ? Fw.encode(options) : options
	            }));
	        }
	    },
	    //IOS客户端调用此方法获取事件的信息
	    getEvent : function() {
	        return this.eventQueue.length > 0 ? this.eventQueue.shift() : '0';
	        }
	    }
	}
                      
var getWebkitEvent = getWebkitEvent || function () {};
                      
                      
