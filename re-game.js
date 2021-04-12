

const GRID_SIZE_ROW = 39;
const GRID_SIZE_COLUMN = 59;

const SNAKE_BODY = [ { x: 25, y: 25 } ];
const GAME_BOARD = document.getElementById('game');

let SNAKE_SPEED = 10;
let EXPANSION_RATE = 2;

let gameOver = false;
let autoExpand = false;

let lastInput = { x: 0, y: 0 };
let lastDirection = { x: 0, y: 0 };
let foodMovCount = 0;
let renderCount = 0;
let lastRender = 0;
let score = 0;
let expandValue = 0;

let food = randomPosition();



function loop(currentTime) {


	checkFail();

	if(gameOver){
		return alert('You Lose');
	}

	window.requestAnimationFrame(loop);

	// Render delay decided by SNAKE_SPEED
	if ((currentTime - lastRender) / 1000 < 1 / SNAKE_SPEED){
		return;
	}

	lastRender = currentTime;

	// Update Elements
	document.getElementById('score').innerHTML = score;
	document.getElementById('speed-value').innerHTML = SNAKE_SPEED;
	document.getElementById('expand-value').innerHTML = EXPANSION_RATE;
	
	// Game Functions
	updateSnake();
	updateFood();
	

	if (score < 10){
		if (renderCount % 5 == 0 && renderCount != 0){
			moveFood(document.getElementById('food-switch').checked);
		}
	} else if (score => 10 && score < 30){
		if (renderCount % 2 == 0 && renderCount != 0){
			moveFood(document.getElementById('food-switch').checked);
		}
	} else if (score > 30) {
		moveFood(document.getElementById('food-switch').checked);
		
	}
	renderCount++
	
}

window.requestAnimationFrame(loop);


let inputDirection = { x: 0, y: 0};

function getInput() {
	window.addEventListener('keydown', e => {
		switch(e.key) {
			case 'ArrowUp':
				if(lastInput.y !== 0) break;	// Do not permit 90* turn.
				inputDirection = { x: 0, y: -1};
				break;
			case 'ArrowDown':
				if(lastInput.y !== 0) break;
				inputDirection = { x: 0, y: 1};
				break;
			case 'ArrowLeft':
				if(lastInput.x !== 0) break;
				inputDirection = { x: -1, y: 0};
				break;
			case 'ArrowRight':
				if(lastInput.x !== 0) break;
				inputDirection = { x: 1, y: 0};
				break;
		}
	})

	lastInput = inputDirection;

	return inputDirection;
}



function updateSnake() {

	input = getInput();
	
	
	//	Add segments
	for(let i = 0; i < expandValue; i++) {
		SNAKE_BODY.push( { ...SNAKE_BODY[SNAKE_BODY.length - 1 ]});
		console.log("Expand Added");
	}

	expandValue = 0;


	//	Move Snake
	for (let i = SNAKE_BODY.length - 2; i >= 0; i--) {
		SNAKE_BODY[i+1].x = SNAKE_BODY[i].x;
		SNAKE_BODY[i+1].y = SNAKE_BODY[i].y;
	}

	SNAKE_BODY[0].x += input.x;
	SNAKE_BODY[0].y += input.y;


	//	Render
	GAME_BOARD.innerHTML = '';	// Erase the last snake render

	SNAKE_BODY.forEach (segment => {
		const snakePoint = document.createElement('div');

		snakePoint.style.gridRowStart = segment.y;
		snakePoint.style.gridColumnStart = segment.x;

		snakePoint.classList.add('snake');
		GAME_BOARD.appendChild(snakePoint);
	})
}

function randomPosition() {

	let newPosition = { x: 0, y: 0 };

	newPosition.x = Math.floor(Math.random() * GRID_SIZE_COLUMN) + 1;
	newPosition.y = Math.floor(Math.random() * GRID_SIZE_ROW) + 1;

	for (let i = 0; i == SNAKE_BODY.length - 1; i++) {
		if (SNAKE_BODY[i].x == newPosition.x && SNAKE_BODY[i].y == newPosition.y) {
			return randomPosition();
		}
	}
	return newPosition;
}

function updateFood() {
	


	// 	Let hungry snake eat food
	if (SNAKE_BODY[0].x == food.x && SNAKE_BODY[0].y == food.y){
		expandValue += EXPANSION_RATE;
		food = randomPosition();
		score += 1;
		
		// Modifier
		autoIncreseSpeed(document.getElementById('speed-switch').checked)


	}

	// 	Render Food
	const foodElement = document.createElement('div');

	foodElement.style.gridRowStart = food.y;
	foodElement.style.gridColumnStart = food.x;

	foodElement.classList.add('food');
	GAME_BOARD.appendChild(foodElement);
}



function checkFail() {
	if (SNAKE_BODY[0].x < 1 || SNAKE_BODY[0].x > GRID_SIZE_COLUMN ||
	    SNAKE_BODY[0].y < 1 || SNAKE_BODY[0].y > GRID_SIZE_ROW) {

		gameOver = true;
		return;
	}	

	if (SNAKE_BODY.length != 1){

		const failure = (segment) => {
			if(segment == SNAKE_BODY[0]) return false;
			return segment.x === SNAKE_BODY[0].x && segment.y ===SNAKE_BODY[0].y;
		}
		gameOver = SNAKE_BODY.some(failure);
		return;
	}
}


//	UI SETTERS


function incrementSpeed() {
	SNAKE_SPEED += 5;
}

function decrementSpeed() {
	if(SNAKE_SPEED != 5) {
		SNAKE_SPEED -= 5;
	} else return;
}

function incrementExpand() {
	EXPANSION_RATE += 1;
}

function decrementExpand() {
	if (EXPANSION_RATE != 1) {
		EXPANSION_RATE -= 1;
	} else return;
}


// Modifiers


function autoIncreseSpeed (condition) {
	if (condition) {
		if (score != 0) {
			if (score % 5 == 0){
				SNAKE_SPEED += 5;
			}
		}
	}
}



function moveFood(condition) {

	if (condition && foodMovCount != 0) {
		moveFoodFunc();
		--foodMovCount;

	} else if (foodMovCount == 0) {
		
		// Reset the count and direction
		
		lastDirection = randomDirection();

		if (score >= 0 && score <= 10){ foodMovCount = 10;}
		else if (score > 10 && score <= 20) { foodMovCount = 5;}
		else if (score > 20 && score <= 30) { foodMovCount = 3;}
		else if (score > 30 && score <= 40) { foodMovCount = 2;}
		else if (score > 40) { foodMovCount = 1;}
	}
}

function moveFoodFunc() {
	console.log(lastDirection);
	food.x += lastDirection.x;
	food.y += lastDirection.y;

}

function randomDirection() {

	let cond1 = Math.round(Math.random());
	
	if (cond1 == 0){
		//Left or Right
		let cond2 = Math.round(Math.random());
		if (cond2 == 0) {
			// Left
			return { x: -1, y: 0 };

		} else if (cond2 == 1) {
			// Right
			return { x: 1, y: 0 };
		}

	}else if(cond1 == 1){
		//Top or Bottom
		let cond3 = Math.round(Math.random());
		if (cond3 == 0) {
			// Top
			return { x: 0, y: -1 };

		} else if (cond3 == 1) {
			// Bottom
			return { x: 0, y: 1 };
		}
	}
}