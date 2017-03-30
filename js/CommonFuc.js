/*
 * Game
 * Author: LuYang
 * Date: 2016-03-04
 * */

// Basic Function.......................................

// Draw a quadrilateral with coordinates of its 4 vertexes
function drawShape(ax, ay, bx, by, cx, cy, dx, dy, color, ctx) {
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.lineTo(cx, cy);
    ctx.lineTo(dx, dy);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
}

// Request animation frame
var RAF = (function () {
    return requestAnimationFrame ||
        webkitRequestAnimationFrame ||
        mozRequestAnimationFrame ||
        oRequestAnimationFrame ||
        msRequestAnimationFrame ||
        function (callback) {
            setTimeout(callback, 1000 / 60);
        };
})();


// Key down listener
function keyDown(e) {
    var e = e || event;
    var currKey = e.keyCode || e.which || e.charCode;
    if ((currKey > 7 && currKey < 14) || (currKey > 31 && currKey < 47)) {
        switch (currKey) {
            default :
                break;
        }
    }
}
document.onkeydown = keyDown;

// HSV to RGB
function hsv2rgb(hsv) {
    var h = hsv[0];
    var s = hsv[1];
    var v = hsv[2];

    var r, g, b;
    var f, p, q, t;
    var hMod;					//h mod 6
    hMod = (Math.floor(h / 60)) % 6;

    f = h / 60 - hMod;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);

    switch (hMod) {
        case 0:
            r = v;
            g = t;
            b = p;
            break;
        case 1:
            r = q;
            g = v;
            b = p;
            break;
        case 2:
            r = p;
            g = v;
            b = t;
            break;
        case 3:
            r = p;
            g = q;
            b = v;
            break;
        case 4:
            r = t;
            g = p;
            b = v;
            break;
        case 5:
            r = v;
            g = p;
            b = q;
            break;
        default:
            break;
    }
    r = ~~(0.5 + r * 255);
    g = ~~(0.5 + g * 255);
    b = ~~(0.5 + b * 255);
    return "rgba(" + r + "," + g + "," + b + ",1)";
}

// Device detection
function deviceDetection() {
    myURL.init();
    var isJumped = myURL.get('jumped');
    if (/AppleWebKit.*Mobile/i.test(navigator.userAgent) || (/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/.test(navigator.userAgent))) {
        if (window.location.href.indexOf("?mobile") < 0) {
            try {
                if (/Android/i.test(navigator.userAgent)) {
                }
                else if (/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
                }
                else {
                }
            } catch (e) {
            }
        }
    }
    else {
        if (isJumped != "1") {
            window.location.href = "device.html";
        }
        else{

        }
    }
}