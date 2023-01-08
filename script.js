const game = document.querySelector("#game");
const context = game.getContext("2d");
const score = document.querySelector("#score");
const reset = document.querySelector("#reset");
const canvasWidth = game.width;
const canvasHeight = game.height;
const gameBackgroundColor = "white";
const snakeColor = "lightgreen";
const foodColor = "red";
const unit = 25;
const nextTickDelay = 100;

let running = false;
let xVelocity = unit;
let yVelocity = 0;

let foodX;
let foodY;
let scoreValue = 0;

const keyCodes = new Map([
    ["left", 37],
    ["up", 38],
    ["right", 39],
    ["down", 40],
]);

let snake = [
    { x: unit * 4, y: 0 },
    { x: unit * 3, y: 0 },
    { x: unit * 2, y: 0 },
    { x: unit, y: 0 },
    { x: 0, y: 0 },
];


// массив всех клеток, не занятых змеей [{x: 0, y: 1}, ...]
let freeCells = [];
for (let i = 0; i < Math.floor(canvasWidth/unit); i++) {
    for (let j = 0; j < Math.floor(canvasHeight/unit); j++) {
        let elem = {x: i * unit, y: j * unit};
        freeCells.push(elem);
    }
}
freeCells = freeCells.filter( elem => {
    partOfSnake = (snakeCell) => (elem.x === snakeCell.x && elem.y === snakeCell.y)
    // partOfSnake == true для хотя бы одного элемента snake -> вернуть false
    return !snake.some(partOfSnake)
});


window.addEventListener("keydown", changeDirection);
reset.addEventListener("click", resetGame);

gameStart();

function gameStart() {
    running = true;
    score.textContent = scoreValue;
    createFood();
    drawFood();
    nextTick();
}

// function createFood() {
//     function randomFoodPosition(min, max) {
//         const randomNumber =
//             Math.round((Math.random() * (max - min) + min) / unit) * unit;
//         return randomNumber;
//     }
    
//     foodX = randomFoodPosition(0, canvasWidth - unit);
//     foodY = randomFoodPosition(0, canvasHeight - unit);

//     snake.forEach((part) => {
//         if (part.x == foodX && part.y == foodY) {
//             createFood();
//         } else {
//             return;
//         }
//     });
// }

function createFood() {
    // взять случайный элемент массива freeCells: randomCell
    let randomNumber = Math.floor(Math.random() * freeCells.length);
    let randomCell = freeCells[randomNumber];

    foodX = randomCell.x;
    foodY = randomCell.y;
}

function drawFood() {
    context.fillStyle = foodColor;
    context.fillRect(foodX, foodY, unit, unit);
}

function nextTick() {
    if (running == true) {
        setTimeout(() => {
            clearCanvas();
            drawFood();
            moveSnake();
            drawSnake();
            checkGameOver();
            nextTick();
        }, nextTickDelay);
    } else {
        showGameOver();
    }
}

function clearCanvas() {
    context.fillStyle = gameBackgroundColor;
    context.fillRect(0, 0, canvasWidth, canvasHeight);
}

function drawSnake() {
    context.fillStyle = snakeColor;
    snake.forEach((part) => {
        context.fillRect(part.x, part.y, unit, unit);
    });
}

function moveSnake() {
    const head = { x: snake[0].x + xVelocity, y: snake[0].y + yVelocity };
    snake.unshift(head);
    freeCells = freeCells.filter(elem => !(elem.x === head.x && elem.y === head.y))
    
    if (snake[0].x == foodX && snake[0].y == foodY) {
        scoreValue++;
        score.textContent = scoreValue;
        createFood();
        drawFood();
    } else {
        freeCells.push(snake[snake.length-1]);
        snake.pop();
    }
}

function changeDirection(event) {
    const keyPress = event.keyCode;

    const goingUp = yVelocity == -unit;
    const goingDown = yVelocity == unit;
    const goingRight = xVelocity == unit;
    const goingLeft = xVelocity == -unit;

    switch (keyPress) {
        case keyCodes.get("left"):
            if (goingRight) {
                break;
            } else {
                xVelocity = -unit;
                yVelocity = 0;
            }
            break;
        case keyCodes.get("up"):
            if (goingDown) {
                break;
            } else {
                xVelocity = 0;
                yVelocity = -unit;
            }
            break;
        case keyCodes.get("right"):
            if (goingLeft) {
                break;
            } else {
                xVelocity = unit;
                yVelocity = 0;
            }
            break;
        case keyCodes.get("down"):
            if (goingUp) {
                break;
            } else {
                xVelocity = 0;
                yVelocity = unit;
            }
            break;
    }
}

function checkGameOver() {
    switch (true) {
        case snake[0].x < 0:
            running = false;
            break;
        case snake[0].x > canvasWidth:
            running = false;
            break;
        case snake[0].y < 0:
            running = false;
            break;
        case snake[0].y > canvasHeight:
            running = false;
            break;
    }

    for (let i = 1; i < snake.length; i++) {
        if (snake[0].x == snake[i].x && snake[0].y == snake[i].y) {
            running = false;
        }
    }
}

function showGameOver() {
    context.font = "50px Zen Dots, cursive";
    context.fillStyle = "black";
    context.textAlign = "center";
    context.fillText("GAME OVER!", canvasWidth / 2, canvasHeight / 2);
    running = false;
}

function resetGame() {
    scoreValue = 0;
    xVelocity = unit;
    yVelocity = 0;
    snake = [
        { x: unit * 4, y: 0 },
        { x: unit * 3, y: 0 },
        { x: unit * 2, y: 0 },
        { x: unit, y: 0 },
        { x: 0, y: 0 },
    ];
    gameStart();
}
