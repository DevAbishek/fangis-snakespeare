import React, { Component } from 'react';
import Snake from './Snake';
import Food from './Food';
import './App.css'

import foodSound from './audio/food.mp3'
import gameOverSound from './audio/gameover.mp3'
import moveSound from './audio/move.mp3'
import musicSound from './audio/music.mp3'

const getRandomCoordinates = () => {
  let min = 1;
  let max = 98;
  let x = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
  let y = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
  return [x, y]
}

const initialState = {
  food: getRandomCoordinates(),
  speed: 200,
  direction: 'RIGHT',
  snakeDots: [
    [0, 0],
    [2, 0]
  ],
  score: 0,
  hiscore: 0,
  foodSound: new Audio(foodSound),
  gameOverSound: new Audio(gameOverSound),
  moveSound: new Audio(moveSound),
  musicSound: new Audio(musicSound)

}

class App extends Component {

  state = initialState;

  componentDidMount() {
    setInterval(this.moveSnake, this.state.speed);
    document.onkeydown = this.onKeyDown;
    this.highScore();
  }

  componentDidUpdate() {
    this.checkIfOutOfBorders();
    this.checkIfCollapsed();
    this.checkIfEat();
  }

  highScore = () => {
    let highScore = localStorage.getItem("highscore")
    if (highScore === null) {
      localStorage.setItem("highscore", JSON.stringify(this.state.score))
    }
    else {
      this.setState({ hiscore: highScore })
    }

    if (this.state.score > this.state.hiscore) {
      this.setState({ hiscore: this.state.score })
      localStorage.setItem("highscore", JSON.stringify(this.state.score))
    }

  }

  // highScore = () => {
  //   let highscore = localStorage.getItem("highscore");
  //   let highScoreVal = 0;
  //   if(highscore === null){
  //     localStorage.setItem("highscore", JSON.stringify(highScoreVal))
  //   }
  //   else {
  //     console.log("hi: ", highScoreVal)
  //   }
  // }

  onKeyDown = (e) => {
    this.state.musicSound.play()
    e = e || window.event;
    switch (e.keyCode) {
      case 38:
        this.setState({ direction: 'UP' });
        break;
      case 40:
        this.setState({ direction: 'DOWN' });
        break;
      case 37:
        this.setState({ direction: 'LEFT' });
        break;
      case 39:
        this.setState({ direction: 'RIGHT' });
        break;
    }
  }

  moveSnake = () => {
    this.state.moveSound.play();
    let dots = [...this.state.snakeDots];
    let head = dots[dots.length - 1];

    switch (this.state.direction) {
      case 'RIGHT':
        head = [head[0] + 2, head[1]];
        break;
      case 'LEFT':
        head = [head[0] - 2, head[1]];
        break;
      case 'DOWN':
        head = [head[0], head[1] + 2];
        break;
      case 'UP':
        head = [head[0], head[1] - 2];
        break;
    }
    dots.push(head);
    dots.shift();
    this.setState({
      snakeDots: dots
    })
  }

  checkIfOutOfBorders() {
    let head = this.state.snakeDots[this.state.snakeDots.length - 1];
    if (head[0] >= 100 || head[1] >= 100 || head[0] < 0 || head[1] < 0) {
      this.onGameOver();
    }
  }

  checkIfCollapsed() {
    let snake = [...this.state.snakeDots];
    let head = snake[snake.length - 1];
    snake.pop();
    snake.forEach(dot => {
      if (head[0] == dot[0] && head[1] == dot[1]) {
        this.onGameOver();
      }
    })
  }

  checkIfEat() {
    let head = this.state.snakeDots[this.state.snakeDots.length - 1];
    let food = this.state.food;
    if (head[0] == food[0] && head[1] == food[1]) {
      this.state.foodSound.play();
      this.setState({
        food: getRandomCoordinates(),
        score: this.state.score + 1
      })
      this.enlargeSnake();
      this.increaseSpeed();
    }
  }

  enlargeSnake() {
    let newSnake = [...this.state.snakeDots];
    newSnake.unshift([])
    this.setState({
      snakeDots: newSnake
    })
  }

  increaseSpeed() {
    if (this.state.speed > 10) {
      this.setState({
        speed: this.state.speed - 10
      })
    }
  }

  onGameOver() {
    this.state.gameOverSound.play();
    this.state.musicSound.pause()
    alert(`Game Over. Snake length is ${this.state.snakeDots.length}`);
    this.setState(initialState);
    this.highScore();
  }

  render() {
    return (
      <>
        <div className='game-container'>
          <div className='game-details'>
            <h1 className='game-title'>Fangis Snakespeare</h1>
            <div>
              <h2 className='game-score'>Score: {this.state.score}</h2>
              <h2 className='game-score'>HighScore: {this.state.hiscore}</h2>
            </div>
          </div>
          <div className="game-area">
            <Snake snakeDots={this.state.snakeDots} />
            <Food dot={this.state.food} />
          </div>
        </div>
      </>
    );
  }
}

export default App;