// Pong Game

const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// --- Game settings ---
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 90;
const BALL_RADIUS = 10;
const PLAYER_X = 20;
const AI_X = canvas.width - PLAYER_X - PADDLE_WIDTH;

// --- Game state ---
let playerY = (canvas.height - PADDLE_HEIGHT) / 2;
let aiY = (canvas.height - PADDLE_HEIGHT) / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 6 * (Math.random() > 0.5 ? 1 : -1);
let ballSpeedY = 4 * (Math.random() * 2 - 1);

let playerScore = 0;
let aiScore = 0;

// --- Mouse control for player paddle ---
canvas.addEventListener('mousemove', function(evt) {
    const rect = canvas.getBoundingClientRect();
    let mouseY = evt.clientY - rect.top;
    playerY = mouseY - PADDLE_HEIGHT / 2;

    // Clamp paddle within canvas
    if (playerY < 0) playerY = 0;
    if (playerY + PADDLE_HEIGHT > canvas.height) playerY = canvas.height - PADDLE_HEIGHT;
});

// --- Game Loop ---
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// --- Update game state ---
function update() {
    // Move ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Top and bottom wall collision
    if (ballY - BALL_RADIUS < 0) {
        ballY = BALL_RADIUS;
        ballSpeedY = -ballSpeedY;
    } else if (ballY + BALL_RADIUS > canvas.height) {
        ballY = canvas.height - BALL_RADIUS;
        ballSpeedY = -ballSpeedY;
    }

    // Player paddle collision
    if (
        ballX - BALL_RADIUS < PLAYER_X + PADDLE_WIDTH &&
        ballY > playerY &&
        ballY < playerY + PADDLE_HEIGHT
    ) {
        ballX = PLAYER_X + PADDLE_WIDTH + BALL_RADIUS;
        ballSpeedX = -ballSpeedX;
        // Add some "english"
        let deltaY = ballY - (playerY + PADDLE_HEIGHT / 2);
        ballSpeedY += deltaY * 0.15;
    }

    // AI paddle collision
    if (
        ballX + BALL_RADIUS > AI_X &&
        ballY > aiY &&
        ballY < aiY + PADDLE_HEIGHT
    ) {
        ballX = AI_X - BALL_RADIUS;
        ballSpeedX = -ballSpeedX;
        let deltaY = ballY - (aiY + PADDLE_HEIGHT / 2);
        ballSpeedY += deltaY * 0.15;
    }

    // Score if ball goes past paddles
    if (ballX - BALL_RADIUS < 0) {
        aiScore++;
        resetBall(-1);
    } else if (ballX + BALL_RADIUS > canvas.width) {
        playerScore++;
        resetBall(1);
    }

    // AI paddle movement (simple tracking)
    let aiCenter = aiY + PADDLE_HEIGHT / 2;
    if (aiCenter < ballY - 20) {
        aiY += 5;
    } else if (aiCenter > ballY + 20) {
        aiY -= 5;
    }
    // Clamp AI paddle
    if (aiY < 0) aiY = 0;
    if (aiY + PADDLE_HEIGHT > canvas.height) aiY = canvas.height - PADDLE_HEIGHT;
}

// --- Draw everything ---
function draw() {
    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw net
    ctx.fillStyle = "#444";
    for (let y = 0; y < canvas.height; y += 30) {
        ctx.fillRect(canvas.width / 2 - 2, y, 4, 18);
    }

    // Draw paddles
    ctx.fillStyle = "#fff";
    ctx.fillRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.fillRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Draw ball
    ctx.beginPath();
    ctx.arc(ballX, ballY, BALL_RADIUS, 0, Math.PI * 2, false);
    ctx.fill();

    // Draw scores
    ctx.font = "36px Arial";
    ctx.fillText(playerScore, canvas.width / 4, 50);
    ctx.fillText(aiScore, canvas.width * 3 / 4, 50);
}

// --- Reset ball after score ---
function resetBall(direction) {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = 6 * direction;
    ballSpeedY = 4 * (Math.random() * 2 - 1);
}

// --- Start the game ---
gameLoop();