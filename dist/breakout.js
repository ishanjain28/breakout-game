var canvas = document.getElementById('breakout'),
    ctx = canvas.getContext('2d'),
    canvasHeight = canvas.height,
    canvasWidth = canvas.width,
    ballMovedx = 2,
    ballMovedy = -2,
    ballInitialX = canvas.width / 2,
    ballInitialY = canvas.height - 30,
    ballRadius = 10,
    paddleHeight = 10,
    paddleWidth = 75,
    paddleX = (canvasWidth - paddleWidth) / 2,
    rightPressed = false,
    leftPressed = false,
    isGameOver = false,
    brickRowCount = 6,
    brickColumnCount = 8,
    brickWidth = 75,
    brickHeight = 20,
    brickPadding = 10,
    brickOffsetTop = 30,
    brickOffsetLeft = 60,
    score = 0;

// Bricks Object
var bricks = [];
for (var j = 0; j < brickColumnCount; j++) {
    bricks[j] = [];
    for (var i = 0; i < brickRowCount; i++) {
        bricks[j][i] = { x: 0, y: 0, status: 1 };
    }
}

// Register KeyUp/KeyDown listeners
document.addEventListener('keyup', keyUpHandler, false);
document.addEventListener('keydown', keyDownHandler, false);

// Keyboard Control Handlers
function keyDownHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = true;
    }
    if (e.keyCode == 37) {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = false;
    }
    if (e.keyCode == 37) {
        leftPressed = false;
    }
}

function drawBall() {
    // Draws the ball
    ctx.beginPath();
    ctx.arc(ballInitialX, ballInitialY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095dd";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    // Draws paddle 
    ctx.beginPath();
    ctx.rect(paddleX, canvasHeight - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
}

function drawGameOver() {
    // Draws te Game Over Screen
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.font = "60px serif";
    ctx.fillStyle = "red";
    ctx.fillText("Game Over!", (canvasWidth - 300) / 2, (canvasHeight - 60) / 2);
    ctx.fillText('Score: ' + score, (canvasWidth - 200) / 2, (canvasHeight - 100 / 2));
}

function drawBricks() {
    for (var j = 0; j < brickColumnCount; j++) {
        for (var i = 0; i < brickRowCount; i++) {
            var brick = bricks[j][i];
            if (brick.status == 1) {
                brick.x = (j * (brickWidth + brickPadding)) + brickOffsetLeft;
                brick.y = (i * (brickHeight + brickPadding)) + brickOffsetTop;
                // Draw the bricks
                ctx.beginPath();
                ctx.rect(brick.x, brick.y, brickWidth, brickHeight);
                ctx.fillStyle = "#0095dd";
                ctx.fill();
                ctx.closePath();
                // Brick Drawing complete
            }
        }
    }
}

function brickCollisionDetection() {
    // Collision detection b/w brick and ball
    for (var j = 0; j < brickColumnCount; j++) {
        for (var i = 0; i < brickRowCount; i++) {
            var brick = bricks[j][i];
            if (brick.status == 1 &&
                ballInitialX > brick.x &&
                ballInitialX < brick.x + brickWidth &&
                ballInitialY > brick.y &&
                ballInitialY < brick.y + brickHeight) {
                ballMovedy = -ballMovedy;
                brick.status = 0;
                score++;
            }
        }
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "black";
    ctx.fillText('Score: ' + score, 8, 20);
}

function draw() {
    /*
     * Clear the display before repaint
     * This way it doesn't leaves a trail of everything that moves
     */
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    // Draw Ball
    drawBall();
    // Draw Paddle
    drawPaddle();
    // Draw Bricks
    drawBricks();
    // Enable Collision Detection b/w brick and ball
    brickCollisionDetection();
    // Draws Score
    drawScore();
    // For Left and Right edges
    if (ballInitialX + ballMovedx < ballRadius || ballInitialX + ballMovedx > canvasWidth - ballRadius) {
        ballMovedx = -ballMovedx;
    }
    // For Top Edge
    if (ballInitialY + ballMovedy < ballRadius) {
        ballMovedy = -ballMovedy;
    } else if (ballInitialY + ballMovedy > canvasHeight - ballRadius) {
        // Check if the ball's position on horizontal axis is falls inside
        // the paddle's position on X axis, If this is true, it means that ball
        // has hit the paddle, So we would want to rebound it now
        // If it is false, Then it means that ball is going to hit the bottom edges
        // Which means that someone just lose in the game.. :) 
        if (ballInitialX > paddleX && ballInitialX < paddleX + paddleWidth) {
            ballMovedy = -ballMovedy;
        } else {
            isGameOver = true;
            drawGameOver();
            setTimeout(function() {
                document.location.reload();
            }, 5000);
        }
    }

    if (rightPressed && paddleX < canvasWidth - paddleWidth) {
        paddleX += 7;
    }
    if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }
    ballInitialX += ballMovedx;
    ballInitialY += ballMovedy;
}


setInterval(function() {
    if (!isGameOver) {
        draw();
    }
}, 10);