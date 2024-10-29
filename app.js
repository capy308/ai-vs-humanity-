// Quiz Variables
let score = 0;
let questionIndex = 0;
const questions = [
    { question: "Who is better at repetitive tasks?", options: ["AI", "Humans"], correct: 0 },
    { question: "Who demonstrates creativity?", options: ["AI", "Humans"], correct: 1 },
    { question: "Who learns from data patterns?", options: ["AI", "Humans"], correct: 0 },
    { question: "Who adapts to emotional cues?", options: ["AI", "Humans"], correct: 1 },
    { question: "Who can analyze large datasets instantly?", options: ["AI", "Humans"], correct: 0 },
    { question: "Who can operate 24/7 without rest?", options: ["AI", "Humans"], correct: 0 },
    { question: "Who excels in ethical decisions?", options: ["AI", "Humans"], correct: 1 },
    { question: "Who can generate new art styles?", options: ["AI", "Humans"], correct: 1 },
    { question: "Who can process thousands of images in seconds?", options: ["AI", "Humans"], correct: 0 },
    { question: "Who makes personalized decisions?", options: ["AI", "Humans"], correct: 1 },
    { question: "Who adjusts based on past experiences?", options: ["AI", "Humans"], correct: 1 },
    { question: "Who does not feel emotions?", options: ["AI", "Humans"], correct: 0 },
    { question: "Who is better at creative problem-solving?", options: ["AI", "Humans"], correct: 1 },
    { question: "Who can write original poetry?", options: ["AI", "Humans"], correct: 1 },
    { question: "Who can follow strict programming rules?", options: ["AI", "Humans"], correct: 0 }
];

// Navigation
function navigateTo(sectionId) {
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('hidden');
        section.classList.remove('active');
    });
    const targetSection = document.getElementById(sectionId);
    targetSection.classList.remove('hidden');
    targetSection.classList.add('active');
    if (sectionId === 'quiz-section') startGame();
}

// Quiz Functionality
function startGame() {
    score = 0;
    questionIndex = 0;
    document.getElementById('score').textContent = "Score: 0";
    showQuestion();
}

function showQuestion() {
    const current = questions[questionIndex];
    document.getElementById('question-title').textContent = current.question;
    document.getElementById('option1').textContent = current.options[0];
    document.getElementById('option2').textContent = current.options[1];
}

function checkAnswer(selected) {
    const current = questions[questionIndex];
    if (selected === current.correct) score += 10;
    else score -= 5;
    document.getElementById('score').textContent = "Score: " + score;
    questionIndex++;
    if (questionIndex < questions.length) showQuestion();
    else endGame();
}

function endGame() {
    document.getElementById('quiz-section').innerHTML = `
        <h2>Quiz Complete! Your score is ${score}.</h2>
        <button class="nav-button" onclick="navigateTo('home-section')">Back to Home</button>`;
}

// AI Game Functionality
let aiNumber = Math.floor(Math.random() * 50) + 1;

function guessNumber() {
    const userGuess = parseInt(document.getElementById("guessInput").value);
    const feedback = document.getElementById("gameFeedback");

    if (isNaN(userGuess) || userGuess < 1 || userGuess > 50) {
        feedback.textContent = "Please enter a valid number between 1 and 50.";
        return;
    }

    if (userGuess === aiNumber) {
        feedback.textContent = "Congratulations! You've guessed the correct number!";
        aiNumber = Math.floor(Math.random() * 50) + 1; // Reset for a new game
    } else if (userGuess < aiNumber) {
        feedback.textContent = "Too low! Try a higher number.";
    } else {
        feedback.textContent = "Too high! Try a lower number.";
    }
}

// Tetris Game JavaScript

const canvas = document.getElementById('tetrisCanvas');
const context = canvas.getContext('2d');
context.scale(20, 20);

function arenaSweep() {
    let rowCount = 1;
    outer: for (let y = arena.length - 1; y > 0; --y) {
        for (let x = 0; x < arena[y].length; ++x) {
            if (arena[y][x] === 0) {
                continue outer;
            }
        }

        const row = arena.splice(y, 1)[0].fill(0);
        arena.unshift(row);
        ++y;

        player.score += rowCount * 10;
        rowCount *= 2;
    }
}

function collide(arena, player) {
    const [m, o] = [player.matrix, player.pos];
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

function createMatrix(w, h) {
    const matrix = [];
    while (h--) {
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
}

function createPiece(type) {
    if (type === 'T') {
        return [
            [0, 0, 0],
            [1, 1, 1],
            [0, 1, 0],
        ];
    } else if (type === 'O') {
        return [
            [2, 2],
            [2, 2],
        ];
    } else if (type === 'L') {
        return [
            [0, 3, 0],
            [0, 3, 0],
            [0, 3, 3],
        ];
    } else if (type === 'J') {
        return [
            [0, 4, 0],
            [0, 4, 0],
            [4, 4, 0],
        ];
    } else if (type === 'I') {
        return [
            [0, 5, 0, 0],
            [0, 5, 0, 0],
            [0, 5, 0, 0],
            [0, 5, 0, 0],
        ];
    } else if (type === 'S') {
        return [
            [0, 6, 6],
            [6, 6, 0],
            [0, 0, 0],
        ];
    } else if (type === 'Z') {
        return [
            [7, 7, 0],
            [0, 7, 7],
            [0, 0, 0],
        ];
    }
}

function draw() {
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);

    drawMatrix(arena, {x: 0, y: 0});
    drawMatrix(player.matrix, player.pos);
}

function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = colors[value];
                context.fillRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
    });
}

function merge(arena, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                arena[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}

function playerDrop() {
    player.pos.y++;
    if (collide(arena, player)) {
        player.pos.y--;
        merge(arena, player);
        playerReset();
        arenaSweep();
        updateScore();
    }
    dropCounter = 0;
}

function playerMove(dir) {
    player.pos.x += dir;
    if (collide(arena, player)) {
        player.pos.x -= dir;
    }
}

function playerReset() {
    const pieces = 'ILJOTSZ';
    player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
    player.pos.y = 0;
    player.pos.x = (arena[0].length / 2 | 0) - (player.matrix[0].length / 2 | 0);
    if (collide(arena, player)) {
        arena.forEach(row => row.fill(0));
        player.score = 0;
        updateScore();
    }
}

function playerRotate(dir) {
    const pos = player.pos.x;
    let offset = 1;
    rotate(player.matrix, dir);
    while (collide(arena, player)) {
        player.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > player.matrix[0].length) {
            rotate(player.matrix, -dir);
            player.pos.x = pos;
            return;
        }
    }
}

function rotate(matrix, dir) {
    for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x) {
            [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
        }
    }
    if (dir > 0) {
        matrix.forEach(row => row.reverse());
    } else {
        matrix.reverse();
    }
}

let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;

function update(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;

    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
        playerDrop();
    }

    draw();
    requestAnimationFrame(update);
}

function updateScore() {
    document.getElementById('score').innerText = `Score: ${player.score}`;
}

const colors = [
    null,
    '#FF0D72',
    '#0DC2FF',
    '#0DFF72',
    '#F538FF',
    '#FF8E0D',
    '#FFE138',
    '#3877FF',
];

const arena = createMatrix(10, 20);

const player = {
    pos: {x: 0, y: 0},
    matrix: null,
    score: 0,
};

document.addEventListener('keydown', event => {
    if (event.keyCode === 37) {
        playerMove(-1);
    } else if (event.keyCode === 39) {
        playerMove(1);
    } else if (event.keyCode === 40) {
        playerDrop();
    } else if (event.keyCode === 81) {
        playerRotate(-1);
    } else if (event.keyCode === 87) {
        playerRotate(1);
    }
});

playerReset();
updateScore();
update();
