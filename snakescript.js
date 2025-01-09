let snakeHead = []; 
let box = 20;
let position = { x: 0, y: 0 };
let gameArea = document.getElementById('gameArea');
let direction = null;
let gameInterval;
let timer = 0;
let timerInterval;
let scoreInterval;
let enemySpawnInterval; 
let food = document.getElementById('food');
let foodItems = []; 
let gamewon = false;


food.style.display = 'none';

document.addEventListener('keydown', keyDown);

function keyDown(e) {
    if (e.key === 'd' || e.key === 'D') {
        direction = 'RIGHT';
    } else if (e.key === 'a' || e.key === 'A') {
        direction = 'LEFT';
    } else if (e.key === 'w' || e.key === 'W') {
        direction = 'UP';
    } else if (e.key === 's' || e.key === 'S') {
        direction = 'DOWN';
    }
}

function initializeSnake() {
    try {
        let initialSegment = document.createElement('div');
        document.getElementById('zen').style.display = 'block';
        initialSegment.classList.add('snake-head');
        let initialPosition = {
            x: (gameArea.clientWidth / 2) - (box / 2),
            y: (gameArea.clientHeight / 2) - (box / 2)
        };
        position = initialPosition;
        initialSegment.style.left = position.x + 'px';
        initialSegment.style.top = position.y + 'px';
        initialSegment.classList.add('visible');
        gameArea.appendChild(initialSegment); 
        snakeHead.push(initialSegment); 
        console.log('Snake initialized:', snakeHead);
    } catch (error) {
        console.error('Error initializing snake:', error);
    }
}

function startTimer() {
    timer = 0;
    updateTimerDisplay();
    timerInterval = setInterval(function() {
        timer++;
        updateTimerDisplay();
        console.log(timer);
    }, 1000);

    
    setTimeout(() => {
        console.log('30 seconds passed, spawning megafood');
        spawnMegaFood();
    }, 30000); 
}

function spawnMegaFood() {
    let megaFood = document.createElement('div');
    megaFood.classList.add('megafood');
    megaFood.style.width = '30px';
    megaFood.style.height = '30px';
    let maxX = gameArea.clientWidth - 30;
    let maxY = gameArea.clientHeight - 30;
    let megaFoodX = Math.floor(Math.random() * maxX);
    let megaFoodY = Math.floor(Math.random() * maxY);
    megaFood.style.left = megaFoodX + 'px';
    megaFood.style.top = megaFoodY + 'px';
    gameArea.appendChild(megaFood);
    console.log('Megafood spawned at:', megaFoodX, megaFoodY);
}

function updateTimerDisplay() {
    let minutes = Math.floor(timer / 60);
    let seconds = timer % 60;
    let formattedTime = 
        String(minutes).padStart(2, '0') + ':' + 
        String(seconds).padStart(2, '0');
    document.getElementById('timer').innerText = 'Survival: ' + formattedTime;
}

function placeFood(numFoodItems = 20) { 
    
    foodItems.forEach(item => gameArea.removeChild(item));
    foodItems = [];

    for (let i = 0; i < numFoodItems; i++) {
        let foodItem = food.cloneNode(true); 
        let maxX = gameArea.clientWidth - box;
        let maxY = gameArea.clientHeight - box;
        let foodX = Math.floor(Math.random() * maxX);
        let foodY = Math.floor(Math.random() * maxY);
        foodItem.style.left = foodX + 'px';
        foodItem.style.top = foodY + 'px';
        foodItem.style.display = 'block';
        gameArea.appendChild(foodItem);
        foodItems.push(foodItem); 
    }
}

function checkFoodCollision() {
    for (let foodItem of foodItems) {
        let foodX = parseInt(foodItem.style.left, 10);
        let foodY = parseInt(foodItem.style.top, 10);
        if (position.x < foodX + box &&
            position.x + snakeHead[0].clientWidth > foodX &&
            position.y < foodY + box &&
            position.y + snakeHead[0].clientHeight > foodY) {
            gameArea.removeChild(foodItem); 
            foodItems = foodItems.filter(item => item !== foodItem); 
            return true;
        }
    }
    return false;
}

function handleFoodCollision() {
    if (checkFoodCollision()) {
        growSnake();
        if (foodItems.length === 0) {
            placeFood();
        }
        updateScore();
    }

    // Check for collision with megafood
    let megaFood = document.querySelector('.megafood');
    if (megaFood) {
        let megaFoodX = parseInt(megaFood.style.left, 10);
        let megaFoodY = parseInt(megaFood.style.top, 10);
        if (position.x < megaFoodX + box &&
            position.x + snakeHead[0].clientWidth > megaFoodX &&
            position.y < megaFoodY + box &&
            position.y + snakeHead[0].clientHeight > megaFoodY) {
            gameArea.removeChild(megaFood);
            growSnake(3); 
            updateScore(30); 
        }
    }
}

function updateScore(points = 10) {
    let scoreElement = document.getElementById('score');
    let scoreText = scoreElement.innerText;
    let score = parseInt(scoreText.split(': ')[1], 10);
    if (isNaN(score)) {
        score = 0;
    }
    score += points;
    scoreElement.innerText = 'Score: ' + score;

    displayscoreonchar(points > 0 ? `+${points}` : `${points}`);
}

function NegupdateScore(points = -10) {
    let scoreElement = document.getElementById('score');
    let scoreText = scoreElement.innerText;
    let score = parseInt(scoreText.split(': ')[1], 10);
    if (isNaN(score)) {
        score = 0;
    }
    score += points;
    scoreElement.innerText = 'Score: ' + score;

    displayscoreonchar(points > 0 ? `+${points}` : `${points}`);
}

function growSnake(times = 1) {
    try {
        for (let t = 0; t < times; t++) {
            const lastSegment = snakeHead[snakeHead.length - 1];
            const newSegment = document.createElement('div');
            newSegment.className = 'snake-segment';
            newSegment.style.width = box + 'px';
            newSegment.style.height = box + 'px';

            let lastSegmentX = parseInt(lastSegment.style.left, 10);
            let lastSegmentY = parseInt(lastSegment.style.top, 10);

            if (direction === 'RIGHT') {
                newSegment.style.left = (lastSegmentX - box) + 'px';
                newSegment.style.top = lastSegmentY + 'px';
            } else if (direction === 'LEFT') {
                newSegment.style.left = (lastSegmentX + box) + 'px';
                newSegment.style.top = lastSegmentY + 'px';
            } else if (direction === 'UP') {
                newSegment.style.left = lastSegmentX + 'px';
                newSegment.style.top = (lastSegmentY + box) + 'px';
            } else if (direction === 'DOWN') {
                newSegment.style.left = lastSegmentX + 'px';
                newSegment.style.top = (lastSegmentY - box) + 'px';
            }

            gameArea.appendChild(newSegment);
            snakeHead.push(newSegment);
        }
    } catch (error) {
        console.error('Error growing snake:', error);
    }
}

function moveSnake() {
    try {
        let segmentPositions = snakeHead.map(segment => ({
            x: parseInt(segment.style.left, 10),
            y: parseInt(segment.style.top, 10)
        }));

        if (direction === 'RIGHT') {
            position.x += box;
        } else if (direction === 'LEFT') {
            position.x -= box;
        } else if (direction === 'UP') {
            position.y -= box;
        } else if (direction === 'DOWN') {
            position.y += box;
        }

        let gameAreaRect = gameArea.getBoundingClientRect();
        if (position.x >= gameAreaRect.width) position.x = gameAreaRect.width - box;
        if (position.x < 0) position.x = 0;
        if (position.y < 0) position.y = 0;
        if (position.y >= gameAreaRect.height) position.y = gameAreaRect.height - box;

        snakeHead[0].style.left = position.x + 'px';
        snakeHead[0].style.top = position.y + 'px';

        for (let i = snakeHead.length - 1; i > 0; i--) {
            snakeHead[i].style.left = segmentPositions[i - 1].x + 'px';
            snakeHead[i].style.top = segmentPositions[i - 1].y + 'px';
        }

        handleFoodCollision(); 
        zen();
        checkCollision();

        if (checkSelfCollision()) {
            gameOver();
        }

        if (handleEnemyCollision()) {
            NegupdateScore();
        }

        
        let zenText = document.getElementById('zenText');
        if (zenText.style.display === 'block') {
            displayscoreonchar(zenText.innerText);
        }
    } catch (error) {
        console.error('Error moving snake:', error);
    }
}

function checkCollision() {
    // Check collision with walls
    if (position.x < 0 || position.x >= gameArea.clientWidth || position.y < 0 || position.y >= gameArea.clientHeight) {
        gameOver();
        return;
    }

    // Check collision with itself
    if (checkSelfCollision()) {
        gameOver();
        return;
    }
}



function checkSelfCollision() {
    for (let i = 1; i < snakeHead.length; i++) {
        if (position.x === parseInt(snakeHead[i].style.left, 10) &&
            position.y === parseInt(snakeHead[i].style.top, 10)) {
            return true;
        }
    }
    return false;
}

function handleEnemyCollision() {
    let enemies = document.querySelectorAll('.enemy');
    for (let enemy of enemies) {
        let enemyX = parseInt(enemy.style.left, 10);
        let enemyY = parseInt(enemy.style.top, 10);
        if (position.x < enemyX + box &&
            position.x + snakeHead[0].clientWidth > enemyX &&
            position.y < enemyY + box &&
            position.y + snakeHead[0].clientHeight > enemyY) {
            createEffect(enemyX, enemyY); 
            gameArea.removeChild(enemy); 
            if (snakeHead.length > 1) {
                let lastSegment = snakeHead.pop(); 
                gameArea.removeChild(lastSegment);
                checkCollision();
            } else {
                gameOver(); 
            }
            return true;
        }
    }
    return false;
}

function overlayclear(){
    let overlay = document.querySelector('.overlay');
    if (overlay) {
        overlay.remove();
    }   
}


function resetGame() {
    clearInterval(gameInterval);
    clearInterval(timerInterval);
    clearInterval(scoreInterval);
    clearInterval(enemySpawnInterval);
    clearsnake();
    clearscore();
    resettmer();
    clearEnemies();
    direction = null;
    gamewon = false;
}

function gameOver() {
    if (gamewon) return;
    createEffect(position.x, position.y); 
    overlay();
    resetGame();
}

function clearsnake() {
    for (let i = 0; i < snakeHead.length; i++) {
        gameArea.removeChild(snakeHead[i]);
        document.getElementById('zen').style.display = 'none';
    }
    snakeHead = [];
}

function clearscore() {
    document.getElementById('score').innerText = 'Score: 000';
}

function clearEnemies() {
    clearInterval(enemySpawnInterval); 
    let enemies = document.querySelectorAll('.enemy');
    enemies.forEach(enemy => gameArea.removeChild(enemy));
}

function resettmer() {
    clearInterval(timerInterval);
    document.getElementById('timer').innerText = 'Survival: 00:00';
}

function startScoreInterval() {
    scoreInterval = setInterval(() => updateScore(10), 10000); 
}

function clearScoreInterval() {
    clearInterval(scoreInterval);
}

function enemyspawninterval(interval = 10000) {
    clearInterval(enemySpawnInterval); 
    enemySpawnInterval = setInterval(() => {
        let numEnemies = Math.floor(Math.random() * 10) + 1; 
        spawnenemy(numEnemies);
    }, interval);
}

function zen(offsetX = -90, offsetY = -90) {
    let zenDiv = document.getElementById('zen');
    let snakeHeadX = parseInt(snakeHead[0].style.left, 10);
    let snakeHeadY = parseInt(snakeHead[0].style.top, 10);

    
    if (direction === 'LEFT') {
        zenDiv.style.transform = 'scaleX(-1)'; 
    } else if (direction === 'RIGHT') {
        zenDiv.style.transform = 'scaleX(1)'; 
    }

   
    zenDiv.style.left = (snakeHeadX + offsetX) + 'px';
    zenDiv.style.top = (snakeHeadY + offsetY) + 'px';
    
    console.log('Zen moved to:', snakeHeadX + offsetX, snakeHeadY + offsetY);
}

let isDisplayingScore = false;

function displayscoreonchar(text) {
    let zenText = document.getElementById('zenText');
    let existingClone = document.getElementById('zenText1');
    let snakeHeadX = parseInt(snakeHead[0].style.left, 10);
    let snakeHeadY = parseInt(snakeHead[0].style.top, 10);

    let textColor = text.startsWith('-') ? 'red' : 'rgb(224, 192, 11)';

    if (zenText.style.display === 'block') {
        if (existingClone) {
            existingClone.style.left = snakeHeadX + 'px';
            existingClone.style.top = (snakeHeadY - 30) + 'px';
            existingClone.innerText = text;
            existingClone.style.color = textColor;
            existingClone.style.display = 'block';
            existingClone.classList.add('animate-move-down-fade-out');

            setTimeout(() => {
                existingClone.style.display = 'none';
                existingClone.classList.remove('animate-move-down-fade-out');
            }, 500);
        } else {
            let newZenText = zenText.cloneNode(true);
            newZenText.id = 'zenText1';
            newZenText.style.left = snakeHeadX + 'px';
            newZenText.style.top = (snakeHeadY - 30) + 'px';
            newZenText.innerText = text;
            newZenText.style.color = textColor;
            newZenText.style.display = 'block';
            newZenText.classList.add('animate-move-down-fade-out');
            gameArea.appendChild(newZenText);

            setTimeout(() => {
                newZenText.style.display = 'none';
                newZenText.classList.remove('animate-move-down-fade-out');
                gameArea.removeChild(newZenText);
            }, 500);
        }
    } else {
        zenText.style.left = snakeHeadX + 'px';
        zenText.style.top = (snakeHeadY - 30) + 'px';
        zenText.innerText = text;
        zenText.style.color = textColor;
        zenText.style.display = 'block';
        zenText.classList.add('animate-move-down-fade-out');

        setTimeout(() => {
            zenText.style.display = 'none';
            zenText.classList.remove('animate-move-down-fade-out');
        }, 500);
    }

    console.log('Score text displayed:', text);
}

function spawnenemy(numEnemies = 1) {
    for (let i = 0; i < numEnemies; i++) {
        let enemy = document.createElement('div');
        enemy.classList.add('enemy');
        enemy.style.width = '150px';
        enemy.style.height = '75px';
        let maxX = gameArea.clientWidth - 150;
        let maxY = gameArea.clientHeight - 50;
        let enemyX = Math.floor(Math.random() * maxX);
        let enemyY = Math.floor(Math.random() * maxY);
        enemy.style.left = enemyX + 'px';
        enemy.style.top = enemyY + 'px';
        gameArea.appendChild(enemy);
        console.log('Enemy spawned at:', enemyX, enemyY);

        setInterval(() => moveEnemyTowardsSnake(enemy), 15);

        setTimeout(() => {
            if (gameArea.contains(enemy)) {
                createEffect(enemyX, enemyY);
                gameArea.removeChild(enemy);
            }
        }, 5000);
    }
}

function createEffect(x, y) {
    let effect = document.createElement('div');
    effect.classList.add('effect');
    effect.style.left = x + 'px';
    effect.style.top = y + 'px';
    gameArea.appendChild(effect);

   
    setTimeout(() => {
        if (gameArea.contains(effect)) {
            gameArea.removeChild(effect);
        }
    }, 500); 
}

function moveEnemyTowardsSnake(enemy) {
    let enemyX = parseInt(enemy.style.left, 10);
    let enemyY = parseInt(enemy.style.top, 10);
    let snakeHeadX = parseInt(snakeHead[0].style.left, 10);
    let snakeHeadY = parseInt(snakeHead[0].style.top, 10);

    if (enemyX < snakeHeadX) {
        enemyX += 1; 
        enemy.style.transform = 'scaleX(1)';
    } else if (enemyX > snakeHeadX) {
        enemyX -= 1;
        enemy.style.transform = 'scaleX(-1)'; 
    }

    if (enemyY < snakeHeadY) {
        enemyY += 1; 
    } else if (enemyY > snakeHeadY) {
        enemyY -= 1; 
    }

    enemy.style.left = enemyX + 'px';
    enemy.style.top = enemyY + 'px';
}

addVideoBackground();
createNavbar();

async function startGame() {
    overlayclear();
    resetGame();
    initializeSnake();
    checkCollision();
    gameInterval = setInterval(moveSnake, 200);
    zen();
    startTimer();
    placeFood();
    startScoreInterval();
    enemyspawninterval();
    
    await checkSnakeLength(51);
    overlay();
    gameOver();
    checkCollision();
    gamewonreset(gamewon);
};

document.getElementById('startButton').addEventListener('click', startGame);


document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('W').addEventListener('click', function() {
        direction = 'UP';
        
    });

    document.getElementById('A').addEventListener('click', function() {
        direction = 'LEFT';
        
    });

    document.getElementById('S').addEventListener('click', function() {
        direction = 'DOWN';
        
    });

    document.getElementById('D').addEventListener('click', function() {
        direction = 'RIGHT';
        
    });
});

function countSnakeSegments() {
    return snakeHead.length;
}

function checkSnakeLength(targetLength) {
    return new Promise((resolve) => {
        const interval = setInterval(() => {
            if (countSnakeSegments() >= targetLength) {
                clearInterval(interval);
                gamewon=true;
                resolve();
            }
        }, 100);
    });
}

function gamewonreset(gamewon){
if (gamewon) {
    resetGame();
}}



function overlay(){
    let overlay = document.createElement('div');
    food.style.display = 'none';
    overlay.classList.add('overlay');
    overlay.style.position = 'absolute';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'black';
    overlay.style.color = 'white';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.fontSize = '2em';
    overlay.style.textAlign = 'center';
    overlay.style.zIndex = '3';
    if (gamewon){
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('win');
    messageDiv.innerText = 'CONGRATULATIONS! ' + 'YOUR SCORE IS: ' + document.getElementById('score').innerText.split(': ')[1];
    overlay.appendChild(messageDiv);
} else {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('win');
    messageDiv.innerText = 'YOU HAVE LOST! YOUR SCORE IS: ' + document.getElementById('score').innerText.split(': ')[1];
    overlay.appendChild(messageDiv);
    const restartinfo = document.createElement('div');
    restartinfo.classList.add('restartinfo');
    restartinfo.innerText = 'Click the button to restart';
    overlay.appendChild(restartinfo);

}
    
    
    gameArea.appendChild(overlay);
    console.log('overlay has been added');
}




function addVideoBackground() {
    const videoBackground = document.createElement('div');
    videoBackground.classList.add('video-background');

    const video = document.createElement('video');
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.id = 'bg-video';

    const source = document.createElement('source');
    source.src = 'img/img_website/background1.mp4';
    source.type = 'video/mp4';

    video.appendChild(source);
    videoBackground.appendChild(video);
    document.body.appendChild(videoBackground);
    checkCollision();
}

function createNavbar() {
    const navbar = document.createElement('nav');
    navbar.classList.add('navbar');

    const ul = document.createElement('ul');

    const links = [
        { name: 'Home', href: '/index.html' },
        { name: 'About', href: '/about.html' },
        { name: 'Contact', href: '/contact.html' },
        { name: 'Projects', href: '/projects.html' }
    ];

    links.forEach(link => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.textContent = link.name;
        a.href = link.href;
        li.appendChild(a);
        ul.appendChild(li);
    });

    navbar.appendChild(ul);
    document.body.appendChild(navbar);

    setActiveLink();
    checkCollision();
}

function setActiveLink() {
    const currentPath = window.location.pathname;
    const links = document.querySelectorAll('.navbar a');

    links.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });

    checkCollision();
}