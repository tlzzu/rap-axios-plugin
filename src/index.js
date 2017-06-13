'use strict';
//var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var axios = require('axios');
var mockjs = require('mockjs');
const defaultOptions = {
    rootUrl: 'http://rapapi.org', //默认为这个地址
    mock: 'mockjs',
    projectId: '',
    requestUrl: '',
    ismock: true,
    method: 'GET',
    params: undefined //参数
};
let currentOpt = defaultOptions;
// /**
//  * 根据method 获取新配置参数
//  * @param {Object} opt defaultOptions默认配置
//  */
/**
 * 
 * @param {Object} opt 
 * @param {Object} defaultOpt defaultOptions默认配置
 */
const getNewOptions = function(opt, defaultOpt) {
    let newOpt = deepCopy(defaultOpt, opt);
    if (newOpt.method === 'GET' && newOpt.params) {
        newOpt.requestUrl = getParamsUrl(newOpt.requestUrl, newOpt);
    } else if (newOpt.method === 'POST') {

    }
    return newOpt;
};
/**
 * 获取请求的url
 * @param {Object} opt 配置参数 结构类似 defaultOptions
 */
const getRequestUrl = function(opt) {
    let arr = [];
    if (opt.rootUrl !== '') arr.push(opt.rootUrl);
    if (opt.mock !== '') arr.push(opt.mock);
    if (opt.projectId !== '') arr.push(opt.projectId);
    if (opt.requestUrl !== '') arr.push(opt.requestUrl);
    if (arr.length > 0) return arr.join('/');
    else return '';
};
/**
 * 将get 请求的url的参数拼接到url中
 * @param {String} url url地址
 * @param {Object} options 参数
 */
const getParamsUrl = function(url, options) {
    let param = [];
    if (options && options !== null && options.params) {
        for (let p in options.params) {
            param.push(p + '=' + options.params[p]);
        }
    }
    return url + (url.indexOf('?') > 0 ? '&' : '?') + param.join('&');
};

/**
 * 深拷贝，
 * 第一个参数是default
 * 第二个及第二个之后的都是是变动的值，最后会融合进default里面
 */
const deepCopy = function() {
    let src, copyIsArray, copy, name, options, clone,
        target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = false;

    // Handle a deep copy situation
    if (typeof target === "boolean") {
        deep = target;

        // skip the boolean and the target
        target = arguments[i] || {};
        i++;
    }

    // Handle case when target is a string or something (possible in deep copy)
    if (typeof target !== "object" && !this.isFunction(target)) {
        target = {};
    }

    // extend jQuery itself if only one argument is passed
    if (i === length) {
        target = this;
        i--;
    }

    for (; i < length; i++) {
        // Only deal with non-null/undefined values
        if ((options = arguments[i]) != null) {
            // Extend the base object
            for (name in options) {
                src = target[name];
                copy = options[name];

                // Prevent never-ending loop
                if (target === copy) {
                    continue;
                }

                // Recurse if we're merging plain objects or arrays
                if (deep && copy && (this.isPlainObject(copy) || (copyIsArray = this.isArray(copy)))) {
                    if (copyIsArray) {
                        copyIsArray = false;
                        clone = src && this.isArray(src) ? src : [];

                    } else {
                        clone = src && this.isPlainObject(src) ? src : {};
                    }

                    // Never move original objects, clone them
                    target[name] = this.deepCopy(deep, clone, copy);

                    // Don't bring in undefined values
                } else if (copy !== undefined) {
                    target[name] = copy;
                }
            }
        }
    }

    // Return the modified object
    return target;
};
/**
 * 全局注册 XMLHttpRequest 对象的 responseText属性,让获取时的属性经过mock
 */
const initXMLHttpRequest = function(isMock) {
    if (typeof XMLHttpRequest === 'undefined') return;
    if (isMock) {
        XMLHttpRequest.prototype.__defineGetter__('responseText', function() {
            // let obj = !this.responseType || this.responseType === 'text' ? this.responseText : this.response;
            // if (typeof obj === 'object') obj = JSON.stringify(obj); //转换成字符串
            //debugger;
            return mockjs.mock(JSON.parse(this.responseText));
        });
        XMLHttpRequest.prototype.__defineGetter__('response', function() {
            //debugger;
            return mockjs.mock(this.response);
        });
    } else {
        XMLHttpRequest.prototype.__defineGetter__('responseText', function() {
            return this.responseText;
        });
        XMLHttpRequest.prototype.__defineGetter__('response', function() {
            return this.response;
        });
    }
};


var rapaxios = {
    /**
     * 配置参数
     */
    config: function(opt) {
        if (opt && opt !== undefined) currentOpt = deepCopy(defaultOptions, opt);
        else currentOpt = defaultOptions;
    },
    /**
     * get请求
     */
    get: function(url, options) {
        if (!options) options = {};
        options['method'] = "GET";
        options.requestUrl = url;
        let o = getNewOptions(options, currentOpt);
        initXMLHttpRequest(o.ismock);
        return axios.get(getRequestUrl(o));
    },
    /**
     * post请求
     */
    post: function(url, params) {
        let options = {};
        options.method = "POST";
        options.requestUrl = url;
        let o = getNewOptions(options, currentOpt);
        initXMLHttpRequest(o.ismock);
        return axios.post(getRequestUrl(o), params);
    },
    /**
     * 
     */
    all: function(arr) {
        initXMLHttpRequest(currentOpt.ismock);
        return axios.all(arr);
    },
    spread: function(fun) {
        return axios.spread.call(this, fun);
    }
};
module.exports = rapaxios;
module.exports.default = rapaxios;