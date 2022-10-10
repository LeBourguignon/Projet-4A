var canvas = document.getElementById("application");
var ctx = canvas.getContext("2d");

var rightPressed = false;
var leftPressed = false;
var upPressed = false;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = true;
    }
    if(e.keyCode == 37) {
        leftPressed = true;
    }
    if(e.keyCode == 38) {
        upPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = false;
    }
    if(e.keyCode == 37) {
        leftPressed = false;
    }
    if(e.keyCode == 38) {
        upPressed = false;
    }
}

var x = canvas.width/2;
var y = canvas.height/2;
var size = 20;
var floorY = canvas.height*0.9;
var jumping = 0;
var falling = 0;

function drawPlayer() {
    ctx.beginPath();
    ctx.rect(x, y, size, size);
    ctx.fillStyle = "#0000FF";
    ctx.fill();
    ctx.closePath();
}

function drawFloor() {
    ctx.beginPath();
    ctx.rect(0, floorY, canvas.width, canvas.height*0.1);
    ctx.fillStyle = "#262626";
    ctx.fill();
    ctx.closePath();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawFloor();

    if(rightPressed && x < canvas.width-size) {
        x += 5;
    }
    if(leftPressed && x > 0) {
        x -= 5;
    }
    if(upPressed && y == floorY-size) {
        jumping = 20;
    }

    if(upPressed && jumping > 0 && y >= 5) {
        jumping--;
        y-=jumping;
    }
    else if(y<canvas.height*0.9-size && falling == 0) {
        jumping = 0;
        falling = 1;
    }

    if (falling > 0) {
        y+=falling;
        falling++;
        if(y>=canvas.height*0.9-size) {
            y=canvas.height*0.9-size;
            falling = 0;
        }
    }
}

setInterval(draw, 10);