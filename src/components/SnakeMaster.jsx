import React, { useState, useEffect } from 'react';

const SnakeMaster = () => {
    const GRID_SIZE = 30; // Size of the grid
    const CELL_SIZE = 20; // Size of each cell in pixels
    const INIT_SNAKE = [{ x: 5, y: 10 }]; // Initial snake position
    const INIT_FOOD = { x: 10, y: 10 }; // Initial food position
    const INIT_DIRECTION = "RIGHT"; // Initial direction

    const [snake, setSnake] = useState(INIT_SNAKE);
    const [food, setFood] = useState(INIT_FOOD);
    const [direction, setDirection] = useState(INIT_DIRECTION);
    const [isGameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [isGameStarted, setIsGameStarted] = useState(false);

    function generateFood() {
        let newFood = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE),
        };
        return snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)
            ? generateFood()
            : newFood;
    }

    function moveSnake() {
        if (isGameOver || isPaused) return;

        let snakeHead = { ...snake[0] }; // Copy the head of the snake
        switch (direction) {
            case "UP":
                snakeHead.y -= 1;
                break;
            case "DOWN":
                snakeHead.y += 1;
                break;
            case "LEFT":
                snakeHead.x -= 1;
                break;
            case "RIGHT":
                snakeHead.x += 1;
                break;
            default:
                break;
        }

        // Check for collisions with walls or self
        if (
            snakeHead.x < 0 ||
            snakeHead.x >= GRID_SIZE ||
            snakeHead.y < 0 ||
            snakeHead.y >= GRID_SIZE ||
            snake.some(segment => segment.x === snakeHead.x && segment.y === snakeHead.y)
        ) {
            setGameOver(true);
            return;
        }

        let newSnake = [snakeHead, ...snake];

        // Check if snake eats food
        if (snakeHead.x === food.x && snakeHead.y === food.y) {
            setFood(generateFood());
            setScore(score + 1);
        } else {
            newSnake.pop(); // Remove the tail
        }

        setSnake(newSnake);
    }

    useEffect(() => {
        const handleKeyPress = (e) => {
            switch (e.key) {
                case "ArrowUp":
                    if (direction !== "DOWN") setDirection("UP");
                    break;
                case "ArrowDown":
                    if (direction !== "UP") setDirection("DOWN");
                    break;
                case "ArrowLeft":
                    if (direction !== "RIGHT") setDirection("LEFT");
                    break;
                case "ArrowRight":
                    if (direction !== "LEFT") setDirection("RIGHT");
                    break;
                default:
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => {
            window.removeEventListener("keydown", handleKeyPress);
        };
    }, [direction]);

    useEffect(() => {
        if (isPaused || isGameOver || !isGameStarted) return;

        const interval = setInterval(
            moveSnake,
            score < 25 ? 150 : score < 50 ? 100 : 50
        );
        return () => clearInterval(interval);
    }, [snake, direction, isPaused, isGameOver, isGameStarted]);

    const renderGrid = () => {
        let grid = [];
        for (let i = 0; i < GRID_SIZE; i++) {
            for (let j = 0; j < GRID_SIZE; j++) {
                let isSnakeSegment = snake.some(
                    (segment) => segment.x === j && segment.y === i
                );
                let isFoodCell = food.x === j && food.y === i;
                grid.push(
                    <div
                        key={`${j}-${i}`}
                        className={`cell ${isSnakeSegment ? "snake" : ""} ${
                            isFoodCell ? "food" : ""
                        }`}
                    ></div>
                );
            }
        }
        return grid;
    };

    const reStart = () => {
        setIsGameStarted(false); // Stop the game loop
        setSnake(INIT_SNAKE); // Reset snake position
        setFood(generateFood()); // Generate new food
        setDirection(INIT_DIRECTION); // Reset direction
        setGameOver(false); // Reset game over state
        setScore(0); // Reset score
        setIsPaused(false); // Ensure the game is not paused
        setTimeout(() => setIsGameStarted(true), 100); // Restart the game loop
    };

    const togglePause = () => {
        setIsPaused((prev) => !prev); // Toggle the pause state
    };

    const playAgain = () => {
        reStart();
        setIsGameStarted(true);
    };

    const startGame = () => {
        setIsGameStarted(true);
        setFood(generateFood());
    };

    return (
        <>
            <h1 className='tittle'>Snake Master</h1>
            <div className="game-container">
                <div className="btn-group">
                    <p className="score">Score: {score}</p>
                    <button onClick={startGame}>Start Game</button>
                    <button onClick={togglePause}>
                        {isPaused ? "Resume" : "Pause"}
                    </button>
                    <button onClick={reStart}>Restart</button>
                </div>
                <div
                    className="game-board"
                    style={{
                        gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
                        width: `${GRID_SIZE * CELL_SIZE}px`,
                        height: `${GRID_SIZE * CELL_SIZE}px`,
                    }}
                >
                    {renderGrid()}
                </div>
                {isGameOver && (
                    <div className="game-over">
                        <h2>Game Over</h2>
                        <p>Your Score: {score}</p>
                        <button onClick={playAgain}>Play Again</button>
                    </div>
                )}
            </div>
        </>
    );
};

export default SnakeMaster;