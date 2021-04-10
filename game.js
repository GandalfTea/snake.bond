
const GRID_SIZE_ROW = 40;
const GRID_SIZE_COLUMN = 60;
SNAKE_SPEED = 10;
EXPANSION_RATE = 2;
const SNAKE_BODY = [ {x: 25, y: 25 }]
const gameBoard = document.getElementById('game');

let gameOver = false;
let lastRenderTime = 0;
let inputDirection = { x: 0, y: 0};
let food = getRandomFoodPosition();
let newSegments = 0;

let score = 0;

function main(currentTime) {

	if(gameOver){
		return alert("You Lose");
	}

	window.requestAnimationFrame(main);
	if ((currentTime - lastRenderTime) / 1000 < 1 / SNAKE_SPEED) return;
	lastRenderTime = currentTime;
	console.log("Render");


	updateSnake();
	updateFood();
	checkDeath();
	renderSnake(gameBoard);
	renderFood(gameBoard);

	document.getElementById('score').innerHTML = score;
	document.getElementById('speed-value').innerHTML = SNAKE_SPEED;
	document.getElementById('expand-value').innerHTML = EXPANSION_RATE;

}

window.requestAnimationFrame(main);

// SNAKE
function updateSnake() {

	addSegments();

	const inputDirection = getInputDirection();

	for (let i = SNAKE_BODY.length - 2; i >= 0; i--) {
		SNAKE_BODY[i+1] = { ...SNAKE_BODY[i] }
	}

	SNAKE_BODY[0].x += inputDirection.x;
	SNAKE_BODY[0].y += inputDirection.y;
}

function renderSnake(gameBoard) {
	gameBoard.innerHTML = '';
	SNAKE_BODY.forEach(segment => {
		const snakeElement = document.createElement('div');
		snakeElement.style.gridRowStart = segment.y;
		snakeElement.style.gridColumnStart = segment.x;
		snakeElement.classList.add('snake');
		gameBoard.appendChild(snakeElement);
	})
}

function expandSnake(amount) {
	newSegments += amount;
	score += amount / 2;
}

function addSegments() {
	for (let i = 0; i < newSegments; i++) {
		SNAKE_BODY.push({ ...SNAKE_BODY[SNAKE_BODY.length -1]})
	}

	newSegments = 0;
}

// FOOD

function onSnake(position, { ignoreHead = false } = {}) {
	return SNAKE_BODY.some((segment, index) => {
		
		if(ignoreHead && index === 0) return false;

		return segment.x === position.x && segment.y === position.y;
	})
}

function updateFood() {
	if (onSnake(food)) {
		expandSnake(EXPANSION_RATE);
		food = getRandomFoodPosition();
	}
}

function renderFood(gameBoard) {
	const foodElement = document.createElement('div');
	foodElement.style.gridRowStart = food.y;
	foodElement.style.gridColumnStart = food.x;
	foodElement.classList.add('food');
	gameBoard.appendChild(foodElement);
}

let lastInputDirection = { x:0, y:0 };

function getRandomFoodPosition() {
	let newFoodPosition;

	while (newFoodPosition == null || onSnake(newFoodPosition)) {
		newFoodPosition = randomGridPosition();
	}
	return newFoodPosition;
}

function randomGridPosition() {
	return {
		x: Math.floor(Math.random() * GRID_SIZE_COLUMN) + 1,
		y: Math.floor(Math.random() * GRID_SIZE_ROW) + 1
	}	
}

// INPUT

function getInputDirection() {
	window.addEventListener('keydown', e => {
		switch(e.key) {
			case 'ArrowUp':
				if (lastInputDirection.y !== 0) break;
				inputDirection = { x: 0, y: -1};
				break;
			case 'ArrowDown':
				if (lastInputDirection.y !== 0) break;
				inputDirection = { x: 0, y: 1};
				break;
			case 'ArrowLeft':
				if (lastInputDirection.x !== 0) break;
				inputDirection = { x: -1, y: 0};
				break;
			case 'ArrowRight':
				if (lastInputDirection.x !== 0) break;
				inputDirection = { x: 1, y: 0};
				break;
		}
	})

	lastInputDirection = inputDirection;

	return inputDirection;
}


function checkDeath() {
	gameOver = outsideGrid(getSnakeHead()) || snakeIntersection();
}

function outsideGrid(position) {
	return (
		position.x < 1 || position.x > GRID_SIZE_COLUMN ||
		position.y < 1 || position.y > GRID_SIZE_ROW
	)
}

function getSnakeHead() {
	return SNAKE_BODY[0];
}

function snakeIntersection() {
	return onSnake(SNAKE_BODY[0], { ignoreHead: true })
}


// Setters

function incrementSpeed(){
	SNAKE_SPEED += 5;
}

function decrementSpeed(){
	SNAKE_SPEED -= 5;
}

function incrementExpand() {
	EXPANSION_RATE += 1;
}

function decrementExpand() {
	EXPANSION_RATE -= 1;
}

// Make grid
// Render one single snake ball.
// var SNAKE_LEN
// var SNAKE_SPEED
// Add movement function:
// 	* Bind keys to movements
// 	* Move snake in that direction by 1 per SNAKE_SPEED.
// Add random position food.
// When eating food, increase SNAKE_LEN
// Add losing function.
// Display Score


// Fluid movement?
// Mouse movement?
