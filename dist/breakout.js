var canvas = document.getElementById('breakout'),
    ctx = canvas.getContext('2d'),
    canvasHeight = canvas.height,
    canvasWidth = canvas.width,
    dMove = {
        ball: {
            x: generateRandomMovementVector().x,
            y: generateRandomMovementVector().y
        },
        paddle: {
            x: 7
        }
    },
    ballProps = {
        X: Math.floor(Math.random() * (480 - 300) + 300),
        Y: Math.floor(Math.random() * (480 - 300) + 300),
        radius: 10
    },
    paddleHeight = 10,
    paddleWidth = 75,
    paddleX = (canvasWidth - paddleWidth) / 2,
    rightPressed = false,
    leftPressed = false,
    isGameOver = false,
    brickProps = {
        rowCount: 6,
        columnCount: 8,
        width: 75,
        height: 20,
        padding: 10,
        offsetTop: 30,
        offsetLeft: 60
    },
    score = 0,
    initialRender = 1;

function generateRandomMovementVector() {
    var vector;
    while (!(vector < -3) && !(vector > 3)) {
        vector = Math.floor(Math.random() * (4 - (-4)) + (-4));
    }
    return { x: vector, y: -vector };
}

console.log(ballProps);
console.log(dMove);
// Bricks Object
var bricks = [];

function makeBrickObject() {
    for (var j = 0; j < brickProps.columnCount; j++) {
        bricks[j] = [];
        for (var i = 0; i < brickProps.rowCount; i++) {
            bricks[j][i] = { x: 0, y: 0, status: 1 };
        }
    }
}

makeBrickObject();

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
    ctx.arc(ballProps.X, ballProps.Y, ballProps.radius, 0, Math.PI * 2);
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
    ctx.font = "40px serif";
    ctx.fillText("Restarting in 2 seconds!", (canvasWidth - 400) / 2, canvasHeight - 230);
}

function drawBricks() {
    for (var j = 0; j < brickProps.columnCount; j++) {
        for (var i = 0; i < brickProps.rowCount; i++) {
            var brick = bricks[j][i];
            if (brick.status == 1) {
                brick.x = (j * (brickProps.width + brickProps.padding)) + brickProps.offsetLeft;
                brick.y = (i * (brickProps.height + brickProps.padding)) + brickProps.offsetTop;
                // Draw the bricks
                ctx.beginPath();
                ctx.rect(brick.x, brick.y, brickProps.width, brickProps.height);
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
    for (var j = 0; j < brickProps.columnCount; j++) {
        for (var i = 0; i < brickProps.rowCount; i++) {
            var brick = bricks[j][i];
            if (brick.status == 1 &&
                ballProps.X > brick.x &&
                ballProps.X < brick.x + brickProps.width &&
                ballProps.Y > brick.y &&
                ballProps.Y < brick.y + brickProps.height) {
                dMove.ball.y = -dMove.ball.y;
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

function Congratulate() {
    // Draws te Game Over Screen
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.font = "60px serif";
    ctx.fillStyle = "green";
    ctx.fillText("Congratulations!!", (canvasWidth - 450) / 2, (canvasHeight - 60) / 2);
    ctx.fillText('Score: ' + score, (canvasWidth - 200) / 2, (canvasHeight - 100 / 2));
    ctx.font = "40px serif";
}

function draw() {

    /*
     * Checks if player has reached 48 score
     * If they have reached this score it means that player has blown all the bricks
     * Game over, Congratulate player
     */
    if (score == (brickProps.columnCount * brickProps.rowCount)) {
        isGameOver = true;
        Congratulate();
    }
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
    if (ballProps.X + dMove.ball.x < ballProps.radius || ballProps.X + dMove.ball.x > canvasWidth - ballProps.radius) {
        dMove.ball.x = -dMove.ball.x;
    }
    // For Top Edge
    if (ballProps.Y + dMove.ball.y < ballProps.radius) {
        dMove.ball.y = -dMove.ball.y;
    } else if (ballProps.Y + dMove.ball.y > canvasHeight - ballProps.radius) {
        // Check if the ball's position on horizontal axis is falls inside
        // the paddle's position on X axis, If this is true, it means that ball
        // has hit the paddle, So we would want to rebound it now
        // If it is false, Then it means that ball is going to hit the bottom edges
        // Which means that someone just lose in the game.. :) 
        if (ballProps.X > paddleX && ballProps.X < paddleX + paddleWidth) {
            dMove.ball.y = -dMove.ball.y;
        } else {
            isGameOver = true;
            drawGameOver();
            setTimeout(function() {
                document.location.reload();
            }, 2000);
        }
    }

    if (rightPressed && paddleX < canvasWidth - paddleWidth) {
        paddleX += dMove.paddle.x;
    }
    if (leftPressed && paddleX > 0) {
        paddleX -= dMove.paddle.x;
    }

    ballProps.X += dMove.ball.x;
    ballProps.Y += dMove.ball.y;

    window.requestAnimationFrame(function() {
        if (!isGameOver) {
            if (initialRender) {
                initialRender = 0;
                setTimeout(draw, 2000);
            } else {
                initialRender = 0;
                draw();
            }
        }
    });
}

window.requestAnimationFrame(function() {
    if (!isGameOver) {
        draw();
    }
});