function OpeningAnimation() {

// Dot class.......................................

    var dots = [];
    var dotsNum;
    var dotsNumCopy;

    var Dot = function (x, y, vx, vy, tox, toy) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.tox = tox;
        this.toy = toy;
        this.size = 6;
        this.holdCtn = 100 + Math.random() * 100;
        this.hold = false;
        this.spread = false;
        this.spreadX = -20 -20 * Math.random();
        this.spreadY = -10 - Math.random() * 10;
    }

    var dotCanvas = document.createElement("canvas");
    var dotCtx = dotCanvas.getContext("2d");
    dotCanvas.width = 6;
    dotCanvas.height = 6;
    dotCtx.fillStyle = "rgba(255,255,255,0.85)";
    dotCtx.fillRect(0,0,6,6);

    Dot.prototype = {
        draw: function () {
            if(useCache){
                ctx.drawImage(dotCanvas, this.x - this.size / 2, this.y - this.size / 2);
            }
            else{
                ctx.fillStyle = "rgba(255,255,255,0.85)";
                ctx.fillRect(this.x - this.size / 2,this.y - this.size / 2,6,6);
            }
        },

        update: function (time) {
            this.x += this.vx * time;
            this.y += this.vy * time;
            if (!this.spread) {
                var dy = this.toy - this.y;
                var dx = this.tox - this.x;
                this.dis = Math.sqrt(dx * dx + dy * dy);

                var scale = 20;
                var ax = scale * (dx / this.dis);
                var ay = scale * (dy / this.dis);

                this.vx = (this.vx + ax * time) * 0.91;
                this.vy = (this.vy + ay * time) * 0.91;
            }
            else {
                this.vy += this.spreadY * time;
                this.vx += this.spreadX * time;

                if (Math.abs(this.y) > canvas.height || Math.abs(this.x) > canvas.width) {
                    dots.splice(dots.indexOf(this), 1, null);
                    dotsNum--;
                }
            }
            if (this.hold) {
                this.holdCtn--;
                if (this.holdCtn < 0) {
                    this.hold = false;
                    this.spread = true;
                    this.vy = -40;
                }
            }
        },

        loop: function (time) {
            this.update(time);
            this.draw();
        }
    }

    var OpeningAnimation = function () {
        this.state = "first"
    };

    var ap = OpeningAnimation.prototype;

    ap.init = function () {

        this.cacheCanvas = document.createElement("canvas");
        var cacheCtx = this.cacheCanvas.getContext("2d");
        this.cacheCanvas.width = 350;
        this.cacheCanvas.height = 150;
        cacheCtx.textAlign = "center";
        cacheCtx.textBaseline = "middle";
        cacheCtx.font = "70px 微软雅黑,黑体";
        cacheCtx.fillStyle = "#FFFFFF";
        cacheCtx.fillText("STACK", this.cacheCanvas.width / 2, this.cacheCanvas.height / 2 - 40);
        cacheCtx.fillText("CRAFT", this.cacheCanvas.width / 2, this.cacheCanvas.height / 2 + 50);
        var pixelData = cacheCtx.getImageData(0, 0, this.cacheCanvas.width, this.cacheCanvas.height);

        dots = [];
        for (var x = 0; x < pixelData.width; x += 5) {
            for (var y = 0; y < pixelData.height; y += 3) {
                var i = (y * pixelData.width + x) * 4;
                if (pixelData.data[i + 3] > 128) {
                    var dot = new Dot(
                        //初始位置
                        canvas.width / 2,
                        canvas.height / 2 - 30,
                        //速度
                        0,
                        0,
                        //结束位置
                        x + (canvas.width / 2 - this.cacheCanvas.width / 2),
                        y + (canvas.height / 2 - this.cacheCanvas.height / 2 - 30)
                    );
                    dots.push(dot);
                }
            }
        }
        dotsNum = dots.length;
        dotsNumCopy = dots.length;
    }

    ap.changeState = function () {

        var d;
        dots.sort(function () {
            return Math.random() - Math.random();
        });

        for (var i = 0;i<dots.length;i++) {
            dots[i].vx = 0;
            dots[i].vy = 0;
            dots[i].hold = true;
        }
    }

    ap.update = function (time) {
        var i, d;
        time /= 100;

        var completeNum = 0;
        for (i = 0; i < dots.length; i++) {
            if (!(d = dots[i])) {
                continue;
            }
            d.loop(time);
            if (d.dis < 3) {
                completeNum++;
            }
        }

        if (completeNum >= 5 * dots.length / 6 && this.state == 'first') {
            this.state = "second";
            this.changeState();
        }

        if (dotsNum == 0) {
            isStartScene = false;
        }
    };
    return new OpeningAnimation();
}

var openingAnimation = new OpeningAnimation();