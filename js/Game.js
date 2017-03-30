/*
 * Main part of the game
 * Author: LuYang
 * Date: 2016-03-04
 * */

// Modify URL
var myURL = new objURL();
myURL.set("score", "0");

// Global variables.......................................
var bricks = [];
var bricksCtn = 0;
var sdwCanvas;
var globalID;
var score = 0;
var myURL = new objURL();

// Initialization function
$(document).ready(
    function () {
        // Bind Functions
        $("#result2homeBtn").bind("click tap", result2home);
        $("#restartBtn").bind("click tap", restart);
        $("#enterGameBtn").bind("click tap", enterGame);
        $("#aboutGameBtn").bind("click tap",aboutGame);
        $("#exitAboutGameBtn").bind("click tap",exitAboutGame);
        $("#bestScoreBtn").bind("click tap",bestScore);
        $("#exitBestScoreBtn").bind("click tap",exitBestScore);
        $("#shareGameBtn").bind("click tap",socialShare);
        $("#shareResultBtn").bind("click tap",socialShare);
        $("#exitSocialShareBtn").bind("click tap",exitSocialShare);

        // Device detecion
        deviceDetection();

        // BestScore
        myURL = new objURL();
        myURL.set("best","0");
        window.history.pushState({},0,myURL.url());

    }
)

// Colors.......................................
var cColorHSV = [183, 0.18, 0.99];
var aColorHSV = [183, 0.31, 0.80];
var bColorHSV = [183, 0.28, 0.89];
var aColor = hsv2rgb(aColorHSV);
var bColor = hsv2rgb(bColorHSV);
var cColor = hsv2rgb(cColorHSV);
var changeMode = 0; // 0 for h, 1 for s+, 2 for s-

function colorGenerator() {
    if (bricksCtn % 7 == 0) {
        var now = new Date();
        changeMode = now.getSeconds() % 3;
    }
    if (changeMode == 0) {
        aColorHSV[0] += 8;
        bColorHSV[0] += 8;
        cColorHSV[0] += 8;
        aColorHSV[0] %= 359;
        bColorHSV[0] %= 359;
        cColorHSV[0] %= 359;
    }
    else if (changeMode == 1) {
        if (aColorHSV[1] > 0.55) {
            changeMode = 0;
        }
        else {
            aColorHSV[1] += 0.03;
            bColorHSV[1] += 0.03;
            cColorHSV[1] += 0.03;
            if (aColorHSV[2] > 0.01) {
                aColorHSV[2] -= 0.01;
                bColorHSV[2] -= 0.01;
                cColorHSV[2] -= 0.01;
            }
        }
    }
    else {
        if (aColorHSV[1] < 0.03) {
            changeMode = 0;
        }
        else {
            aColorHSV[1] -= 0.03;
            bColorHSV[1] -= 0.03;
            cColorHSV[1] -= 0.03;
            if (cColorHSV[2] < 0.98) {
                aColorHSV[2] += 0.01;
                bColorHSV[2] += 0.01;
                cColorHSV[2] += 0.01;
            }
        }
    }
    aColor = hsv2rgb(aColorHSV);
    bColor = hsv2rgb(bColorHSV);
    cColor = hsv2rgb(cColorHSV);
}

// JavaScript performance monitor.......................................

 stats = new Stats();
 stats.domElement.style.position = 'absolute';
 stats.domElement.style.left = '0px';
 stats.domElement.style.top = '0px';
 document.getElementById('canvasFrame').appendChild(stats.domElement);


// First brick.......................................

// Initialization x-axis
// Max width of brick is 80 percent of the width of the canvas
var lx_first = ~~(0.5 + canvasW * 0.1); // "~" operation for rounding
var rx_first = ~~(0.5 + canvasW * 0.9);
var ux_first = ~~(0.5 + canvasW * 0.5);
var bx_first = ux_first;

// Initialization y-axis
// Note: TAN_36 = tan(36 degrees) = 0.726542528
var by_first = canvasH - 80;
var ly_first = by_first - 0.4 * canvasW * TAN_36;
var ry_first = ly_first;
var uy_first = ly_first - 0.4 * canvasW * TAN_36;

// User operation.......................................

// Add a brick which appears from the left side
function addLeftBrick() {
    var lastBrick = bricks[bricks.length - 1];
    var leftBrickLx = lastBrick.lmin;
    var offset_x = leftBrickLx - lastBrick.lx;
    var offset_y = offset_x * TAN_36 - CUBE_H;
    var brick = new Brick(
        true,
        lastBrick.lx + offset_x,
        lastBrick.ly + offset_y,
        lastBrick.rx + offset_x,
        lastBrick.ry + offset_y,
        lastBrick.ux + offset_x,
        lastBrick.uy + offset_y,
        lastBrick.bx + offset_x,
        lastBrick.by + offset_y,
        aColor,
        bColor,
        cColor,
        false
    );
    bricks.push(brick);
    lastBrick = null;
}

// Add a brick which appears from the right side
function addRightBrick() {
    var lastBrick = bricks[bricks.length - 1];
    var rightBrickRx = lastBrick.rmax;
    var offset_x = rightBrickRx - lastBrick.rx;
    var offset_y = -(offset_x * TAN_36) - CUBE_H;
    var brick = new Brick(
        false,
        lastBrick.lx + offset_x,
        lastBrick.ly + offset_y,
        lastBrick.rx + offset_x,
        lastBrick.ry + offset_y,
        lastBrick.ux + offset_x,
        lastBrick.uy + offset_y,
        lastBrick.bx + offset_x,
        lastBrick.by + offset_y,
        aColor,
        bColor,
        cColor,
        false
    );
    bricks.push(brick);
    lastBrick = null;
}

function layBrickDown() {
    var bricksAmount = bricks.length;
    bricks[bricksAmount - 1].fixed = true;

    // Crop the brick
    bricks[bricksAmount - 1].crop(bricks[bricksAmount - 2]);

    // All bricks sink
    var lSink = bricks[bricksAmount - 2].uy - bricks[bricksAmount - 1].uy;
    if (bricksCtn > 1 && !isGameOver) {
        for (var i = 0; i < bricksAmount; i++) {
            bricks[i].sink(lSink);
        }
    }

    console.log(bricksCtn);
}

function enterGame() {
    $("#menuScene").fadeOut(function () {
        $("#canvasFrame").css("zIndex", 1);
        $("#menuScene").css("zIndex", 2);
        if (isFirstTime) {
            stage.loopGame();
            isFirstTime = false;
        }
        else {
            isGameOver = false;
        }
    });

}

function result2home() {
    bricks = [];
    stage.initGame();
    $("#shareGuide").fadeOut();
    $("#resultScene").fadeOut(function () {
        $("#menuScene").fadeIn();
    });
}

function restart() {
    bricks = [];
    stage.initGame();
    $("#shareGuide").fadeOut();
    $("#resultScene").fadeOut(function () {
        isGameOver = false;
    });
}

function aboutGame(){
    $(".backdrop").fadeIn(function(){
        $(".aboutGame").fadeIn('fast');
    });
}

function exitAboutGame(){
    $(".aboutGame").fadeOut(function(){
        $(".backdrop").fadeOut('fast');
    });
}

function bestScore(){
    $(".bestScore .bestScoreText").text(myURL.get('best'));
    $(".backdrop").fadeIn(function(){
        $(".bestScore").fadeIn('fast');
    });
}

function exitBestScore(){
    $(".bestScore").fadeOut(function(){
        $(".backdrop").fadeOut('fast');
    });
}

function socialShare(){
    $(".backdrop").fadeIn(function(){
        $(".socialShare").fadeIn('fast');
    });
}

function exitSocialShare(){
    $(".socialShare").fadeOut(function(){
        $(".backdrop").fadeOut('fast');
    });
}

// Animation.......................................

function drawBricks() {
    // Base
    ctx.drawImage(sdwCanvas, bricks[0].lx, bricks[0].ly);

    // Other Bricks
    var i;
    for (i = 0; i < bricks.length; i++) {
        bricks[i].update();
        bricks[i].draw();
    }

    // Here: i = bricks.length
    if (bricks[i - 1].fixed && !bricks[i - 1].isSink && !isGameOver) {
        colorGenerator();
        if (bricksCtn % 2 == 1) {
            addLeftBrick();
        }
        else {
            addRightBrick();
        }
        bricksCtn++;
        score++;
    }
}

function drawScore() {
    if (!isGameOver) {
        ctx.font = "60px 微软雅黑,黑体,STHeitiTC";
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText(bricksCtn, canvasW / 2 - ctx.measureText(bricksCtn + "").width / 2, 100);
    }
}

function gameAnimation() {
    ctx.clearRect(0, 0, canvasW, canvasH);
    drawBricks();
    drawScore();
    globalID = RAF(gameAnimation);
    stats.update();
}

// Stage.......................................

var stage = {
    initOpeningAnimation: function () {
        openingAnimation.init();
    },
    loopOpeningAnimation: function () {
        var _this = this;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        openingAnimation.update(10);
        globalID = RAF(function () {
            _this.loopOpeningAnimation();
        });
        stats.update();
        if (!isStartScene) {
            cancelAnimationFrame(globalID);
            isMenuScene = true;
            $("#menuScene").fadeIn(function () {
                $("#canvasFrame").css("zIndex", 1);
                $("#menuScene").css("zIndex", 2);
                _this.initGame();
            });
        }
    },
    initGame: function () {
        // Bricks
        ctx.clearRect(0, 0, canvasW, canvasH);
        bricks = [];
        bricksCtn = 0;
        score = 0;
        var firstBrick = new Brick(
            true,
            lx_first,
            ly_first,
            rx_first,
            ry_first,
            ux_first,
            uy_first,
            bx_first,
            by_first,
            aColor,
            bColor,
            cColor,
            true
        );
        bricks.push(firstBrick);

        // Shadow
        sdwCanvas = document.createElement("canvas");
        var sdwCtx = sdwCanvas.getContext("2d");
        var sdwCanvasW = CUBE_W;
        var sdwCanvasH = sdwCanvasW * TAN_36 / 2 + 80;
        sdwCanvas.width = sdwCanvasW;
        sdwCanvas.height = sdwCanvasH;
        var sdwGradientA = sdwCtx.createLinearGradient(
            sdwCanvasW / 2, sdwCanvasH - 80, sdwCanvasW / 2 - 80 * TAN_36, sdwCanvasH
        );
        sdwGradientA.addColorStop(0, aColor);
        sdwGradientA.addColorStop(1, "rgba(255,255,255,0)");
        var sdwGradientB = sdwCtx.createLinearGradient(
            sdwCanvasW / 2, sdwCanvasH - 80, sdwCanvasW / 2 + 80 * TAN_36, sdwCanvasH
        );
        sdwGradientB.addColorStop(0, bColor);
        sdwGradientB.addColorStop(1, "rgba(255,255,255,0)");
        drawShape(
            0, 0,
            0, sdwCanvasH,
            sdwCanvasW / 2, sdwCanvasH,
            sdwCanvasW / 2, sdwCanvasH - 80,
            sdwGradientA, sdwCtx
        );
        drawShape(
            sdwCanvasW, 0,
            sdwCanvasW, sdwCanvasH,
            sdwCanvasW / 2, sdwCanvasH,
            sdwCanvasW / 2, sdwCanvasH - 80,
            sdwGradientB, sdwCtx
        );
        // Others
        bricks[0].draw();
        ctx.drawImage(sdwCanvas, bricks[0].lx, bricks[0].ly);
    },
    loopGame: function () {
        addLeftBrick();
        $("#canvasFrame").bind("click tap", layBrickDown);
        gameAnimation();
    }
};

stage.initOpeningAnimation();
stage.loopOpeningAnimation();