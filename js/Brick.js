/*
 * Class definitions
 * Author: LuYang
 * Date: 2016-03-04
 * */

// Constant and global variables.......................................
var TAN_36 = 0.726542528; // The tilt angle of the brick will be 36
var canvasW = canvas.width;
var canvasH = canvas.height;
var CUBE_H = ~~(0.5 + canvasH * 0.04);
var CUBE_W = ~~(0.5 + canvasW * 0.8);
var vSink = 3;
var isGameOver = false;
var isFirstTime = true;
var useCache = true;

// Constructor.......................................

Brick = function (isLeft, lx, ly, rx, ry, ux, uy, bx, by, aColor, bColor, cColor, fixed) {
    // Position and size
    this.isLeft = isLeft;               // appears from witch direction
    this.lx = lx;                       // l for left, r for right...
    this.ly = ly;
    this.rx = rx;
    this.ry = ry;
    this.ux = ux;
    this.uy = uy;
    this.bx = bx;
    this.by = by;

    // Color of each side
    this.aColor = aColor;               // left side
    this.bColor = bColor;               // right side
    this.cColor = cColor;               // top

    // Animation parameters
    this.fixed = fixed;
    this.lmin = ~~(0.5 + (lx - rx) / 2);// left border
    this.rmax = canvasW - this.lmin;    // right border
    this.vx = 0;
    this.vy = 0;
    this.isSink = false;
    this.lsink = 0;
    this.isfade = false;
    this.fadeFrom = 0.4;

    //Off-screen canvas
    this.cacheCanvas = document.createElement("canvas");
    this.cacheCtx = this.cacheCanvas.getContext("2d");
    this.cacheCanvas.width = this.rx - this.lx;
    this.cacheCanvas.height = this.by - this.uy + CUBE_H;
    if (useCache) {
        this.cache();
    }
};

// Prototype.......................................

Brick.prototype = {
    cache: function () {
        drawShape(
            0, this.ly - this.uy + CUBE_H,
            0, this.ly - this.uy,
            this.bx - this.lx, this.by - this.uy,
            this.bx - this.lx, this.by - this.uy + CUBE_H,
            this.aColor, this.cacheCtx);
        drawShape(
            this.rx - this.lx, this.ry - this.uy + CUBE_H,
            this.rx - this.lx, this.ry - this.uy,
            this.bx - this.lx, this.by - this.uy,
            this.bx - this.lx, this.by - this.uy + CUBE_H,
            this.bColor, this.cacheCtx);
        drawShape(
            this.ux - this.lx, 0,
            0, this.ly - this.uy,
            this.bx - this.lx, this.by - this.uy,
            this.rx - this.lx, this.ry - this.uy,
            this.cColor, this.cacheCtx);
    },
    reCache: function () {
        this.cacheCtx.clearRect(0, 0, this.cacheCanvas.width, this.cacheCanvas.height);
        this.cache();
    },
    draw: function () {
        if (useCache) {
            ctx.drawImage(this.cacheCanvas, this.lx, this.uy - CUBE_H);
        }
        else {
            drawShape(
                this.lx, this.ly,
                this.lx, this.ly - CUBE_H,
                this.bx, this.by - CUBE_H,
                this.bx, this.by,
                this.aColor, ctx
            );
            drawShape(
                this.rx, this.ry,
                this.rx, this.ry - CUBE_H,
                this.bx, this.by - CUBE_H,
                this.bx, this.by,
                this.bColor, ctx
            );
            drawShape(
                this.ux, this.uy - CUBE_H,
                this.lx, this.ly - CUBE_H,
                this.bx, this.by - CUBE_H,
                this.rx, this.ry - CUBE_H,
                this.cColor, ctx
            );
        }
    },
    // Boundary detection
    boundary: function () {
        if (this.lx <= this.lmin) {
            if (this.isLeft) {
                this.vy = 4 * TAN_36;
                this.vx = 4;
            }
            else {
                this.vx *= -1;
                this.vy *= -1;
            }
        }
        else if (this.rx >= this.rmax) {
            if (this.isLeft) {
                this.vx *= -1;
                this.vy *= -1;
            }
            else {
                this.vy = 4 * TAN_36;
                this.vx = -4;
            }
        }
    },
    // Animation
    update: function () {
        if (!this.fixed) {
            this.boundary();
            this.lx += this.vx;
            this.rx += this.vx;
            this.ux += this.vx;
            this.bx += this.vx;
            this.ly += this.vy;
            this.ry += this.vy;
            this.uy += this.vy;
            this.by += this.vy;
        }
        else if (this.isSink) {
            this.ly += vSink;
            this.ry += vSink;
            this.uy += vSink;
            this.by += vSink;
            this.lsink -= vSink;
            if (this.lsink <= 0) {
                this.isSink = false;
                this.lsink = 0;
            }
        }
        else if (this.isfade) {
            this.fadeFrom -= 0.01;
            this.aColor = "rgba(255,255,255," + this.fadeFrom + ")";
            this.bColor = "rgba(255,255,255," + this.fadeFrom + ")";
            this.cColor = "rgba(255,255,255," + this.fadeFrom + ")";
            if (this.fadeFrom < 0 && isGameOver) {
                this.isfade = false;
                cancelAnimationFrame(globalID);
                $("#resultScene").fadeIn();
            }
        }
    },
    // In fact, y-axis increases
    sink: function (l) {
        this.lsink = l;
        this.isSink = true;
    },
    // Brick or part of a brick disappear
    fade: function () {
        this.isfade = true;
        this.aColor = "rgba(255,255,255," + this.fadeFrom + ")";
        this.bColor = "rgba(255,255,255," + this.fadeFrom + ")";
        this.cColor = "rgba(255,255,255," + this.fadeFrom + ")";
    },
    // Crop the brick,
    crop: function (lastBrick) {
        var yMin = lastBrick.uy - CUBE_H;
        var yMax = lastBrick.by - CUBE_H;
        if (Math.abs(this.ux - lastBrick.ux) < 4) {
            this.lx = lastBrick.lx;
            this.ly = lastBrick.ly - CUBE_H;
            this.rx = lastBrick.rx;
            this.ry = lastBrick.ry - CUBE_H;
            this.ux = lastBrick.ux;
            this.uy = yMin;
            this.bx = lastBrick.bx;
            this.by = yMax;
            console.log("fullIn");
        }
        else if (
            this.isLeft && (this.ry <= yMin || this.ly >= yMax) ||
                !this.isLeft && (this.ly <= yMin || this.ry >= yMax)
            ) {
            this.fade();
            isGameOver = true;
            console.log("fullOut");
            $("#resultScene .resultText>span").text(score+'');
            document.title = "我在Stackcraft中叠到了第" + bricksCtn + "层，你也来试试看吧~";
            if(parseInt(myURL.get('best'))<score){
                myURL.set('best',score+"");
                window.history.pushState({},0,myURL.url());
            }
        }
        else if (this.isLeft) {
            if (this.lx < lastBrick.lx) {
                this.lx = lastBrick.lx;
                this.ly = lastBrick.ly - CUBE_H;
                this.ux = lastBrick.ux;
                this.uy = yMin;
                this.lmin = ~~(0.5 + (this.lx - this.rx) / 2);
                this.rmax = canvasW - this.lmin;


                console.log("leftUp");
            }
            else {
                this.rx = lastBrick.rx;
                this.ry = lastBrick.ry - CUBE_H;
                this.bx = lastBrick.bx;
                this.by = yMax;
                this.lmin = ~~(0.5 + (this.lx - this.rx) / 2);
                this.rmax = canvasW - this.lmin;
                console.log("leftDown");
            }
        }
        else {
            if (this.lx < lastBrick.lx) {
                this.lx = lastBrick.lx;
                this.ly = lastBrick.ly - CUBE_H;
                this.bx = lastBrick.bx;
                this.by = yMax;
                this.lmin = ~~(0.5 + (this.lx - this.rx) / 2);
                this.rmax = canvasW - this.lmin;
                console.log("rightUp");
            }
            else if (this.lx > lastBrick.lx) {
                this.rx = lastBrick.rx;
                this.ry = lastBrick.ry - CUBE_H;
                this.ux = lastBrick.ux;
                this.uy = yMin;
                this.lmin = ~~(0.5 + (this.lx - this.rx) / 2);
                this.rmax = canvasW - this.lmin;
                console.log("rightDown");
            }
        }
        this.reCache();
    }
}