let canvas = document.getElementById('game'),
    ctx = canvas.getContext('2d'),
    ballRadius = 9,
    x = canvas.width / (Math.floor(Math.random() * Math.random() * 10) + 3),
    y = canvas.height - 40,
    dx = 2,
    dy = -2;

let paddleHeight = 12,
    paddleWidth = 72;

// starting location...
let paddleX = (canvas.width - paddleWidth) / 2;

// bricks...
let rowCount = 5,
    columnCount = 9,
    brickWidth = 54,
    brickHeight = 18,
    brickPadding = 12,
    topOffset = 40,
    leftOffset = 33,
    score = 0;

// bricks array...
let bricks = [];
for (let c = 0; c < columnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < rowCount; r++) {
        // sets bricks possition...
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

// mouse moving listener...
document.addEventListener("mousemove", mouseMoveHandler, false);

// move paddle with the mouse...
function mouseMoveHandler(e){
    var canvasLeft = canvas.getBoundingClientRect().left;
    var relativeX = e.clientX - canvasLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

// draw paddle...
function drawPaddle() {
    ctx.beginPath();
    ctx.roundRect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight, 30);
    ctx.fillStyle = '#333';
    ctx.fill();
    ctx.closePath();
}

// draw ball...
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#333';
    ctx.fill();
    ctx.closePath();
}

// draw bricks...
function drawBricks() {
    for (let c = 0; c < columnCount; c++) {
        for(let r = 0; r < rowCount; r++) {
            if(bricks[c][r].status === 1) {
                let brickX = (c * (brickWidth + brickPadding)) + leftOffset;
                let brickY = (r * (brickHeight + brickPadding)) + topOffset;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.roundRect(brickX, brickY, brickWidth, brickHeight, 30);
                ctx.fillStyle = '#333';
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

// track score...
function trackScore() {
    ctx.font = 'bold 16px sans-serif';
    ctx.fillStyle = '#333';
    ctx.fillText('Score : ' + score, 8, 24);
}

// hit detection...
function hitDetection() {
    for(let c = 0; c < columnCount; c++) {
        for(let r = 0; r < rowCount; r++) {
            let b = bricks[c][r];
            if(b.status === 1) {
                if(x > b.x &&x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    playPop();
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if(score === rowCount * columnCount) {
                        alert('You Won!');
                        document.location.reload();
                    }
                }
            }
        }
    }
}

let boing = new Audio("sounds/boing-2-44164.mp3");
let fart = new Audio("sounds/086424_small-realpoot106wav-37403.mp3");
let pop = new Audio("sounds/pop-94319.mp3");

let startButton = document.getElementById('start-button');

startButton.addEventListener('click', function() {
        
    boing.load();
    fart.load();
    pop.load();

    // main...
    function init() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        trackScore();
        drawBricks();
        drawBall();
        drawPaddle();
        hitDetection();

        // detect right left walls...
        if(x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
            dx = -dx;
        }

        // detect top wall...
        if(y + dy < ballRadius) {
            dy = -dy;
        } else if (y + dy > canvas.height - ballRadius) {
            // detect paddle hits...
            if( x > paddleX && x < paddleX + paddleWidth) {
                dy = - dy;
                playBoing();
            } else {
                // if you miss the ball...
                playFart();
                alert('Game Over');
                document.location.reload();
            }
        }

        // botom wall...
        if(y + dy > canvas.height - ballRadius || y + dy < ballRadius) {
            dy = -dy;
        }

        // move ball...
        x += dx;
        y += dy;

    }

    setInterval(init, 10);

})

function playBoing() {
    boing.currentTime = 0;
    boing.play();
}

function playFart() {
    fart.currentTime = 0;
    fart.play();
}

function playPop() {
    pop.currentTime = 0;
    pop.play();
}