/* eslint-disable no-unused-vars */
class Game {
  constructor({
    gameAreaId,
    targetSize,
    padding,
    imageSrc,
    creationSpeed,
    movementSpeed,
  }) {
    this.gameArea = document.getElementById(gameAreaId);
    this.targetSize = targetSize;
    this.padding = padding;
    this.imageSrc = imageSrc;
    this.creationSpeed = creationSpeed;
    this.movementSpeed = movementSpeed;
    this.scoreElement = document.getElementById('score');
    this.runBtn = document.getElementById('run-btn');
    this.isGameRunning = false;
    this.runBtn.addEventListener('click', () => this.toggleGame());
    document.addEventListener('visibilitychange', () =>
      this.handleVisibilityChange()
    );
  }

  get gameAreaWidth() {
    return this.gameArea.offsetWidth - this.padding;
  }

  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getRandomLocation() {
    const randomTargetIndex = this.getRandomNumber(
      0,
      Math.floor(this.gameAreaWidth / this.targetSize) - 1
    );
    return (
      randomTargetIndex * this.targetSize +
      (this.gameAreaWidth % this.targetSize) / 2 +
      this.padding / 2
    );
  }

  toggleGame() {
    this.isGameRunning = !this.isGameRunning;
    this.runBtn.innerText = this.isGameRunning ? 'End Game' : 'Start Game';
    this.isGameRunning ? this.startGame() : this.endGame();
  }

  startGame() {
    if (!this.isGameRunning) return;

    this.gameInterval = setInterval(() => {
      const target = this.createTarget();
      this.gameArea.appendChild(target);
      this.animateTarget(target);
    }, this.creationSpeed);
  }

  createTarget() {
    const target = document.createElement('img');
    target.src = this.imageSrc;
    target.width = this.targetSize;
    target.style.position = 'absolute';
    target.style.top = -this.targetSize + 'px';
    target.style.left = this.getRandomLocation() + 'px';
    target.addEventListener('mousedown', () => {
      this.addScore(1);
      target.remove();
    });
    return target;
  }

  animateTarget(target) {
    const frame = () => {
      if (parseInt(target.style.top) > this.gameArea.offsetHeight) {
        target.remove();
      } else {
        target.style.top =
          parseInt(target.style.top) + this.movementSpeed + 'px';
        requestAnimationFrame(frame);
      }
    };
    frame();
  }

  addScore(val) {
    this.scoreElement.innerText = +this.scoreElement.innerText + val;
  }

  endGame() {
    clearInterval(this.gameInterval);
  }

  handleVisibilityChange() {
    if (document.hidden) {
      this.endGame();
    } else {
      this.startGame();
    }
  }
}

const game = new Game({
  gameAreaId: 'game-area',
  targetSize: 50,
  padding: 10,
  imageSrc: 'assets/images/burger.png',
  creationSpeed: 500,
  movementSpeed: 2.5,
});
