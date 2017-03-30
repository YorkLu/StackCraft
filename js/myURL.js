/*
 * 增删改查URL参数
 * */

function objURL(url) {
    this.ourl = url || window.location.href;
    this.href = "";//?前面部分
    this.params = {};//url参数对象
    this.jing = "";//#及后面部分
    this.init = function () {
        var str = this.ourl;
        var index = str.indexOf("#");
        if (index > 0) {
            this.jing = str.substr(index);
            str = str.substring(0, index);
        }
        index = str.indexOf("?");
        if (index > 0) {
            this.href = str.substring(0, index);
            str = str.substr(index + 1);
            var parts = str.split("&");
            for (var i = 0; i < parts.length; i++) {
                var kv = parts[i].split("=");
                this.params[kv[0]] = kv[1];
            }
        } else {
            this.href = this.ourl;
            this.params = {};
        }
    };
    this.set = function (key, val) {
        this.params[key] = encodeURIComponent(val);
    };
    this.remove = function (key) {
        if (key in this.params) this.params[key] = undefined;
    };
    this.get = function (key) {
        return this.params[key];
    };
    this.url = function (key) {
        var strurl = this.href;
        var objps = [];
        for (var k in this.params) {
            if (this.params[k]) {
                objps.push(k + "=" + this.params[k]);
            }
        }
        if (objps.length > 0) {
            strurl += "?" + objps.join("&");
        }
        if (this.jing.length > 0) {
            strurl += this.jing;
        }
        return strurl;
    };
}