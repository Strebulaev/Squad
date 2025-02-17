import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-tetris',
  templateUrl: './tetris.component.html',
  styleUrls: ['./tetris.component.css']
})
export class TetrisComponent implements OnInit {

  canvas!: HTMLCanvasElement;
  context!: CanvasRenderingContext2D;
  grid!: number[][];
  blockSize: number = 30;
  width: number = 10;
  height: number = 15;
  currentPiece!: number[][];
  isGameStarted: boolean = false;
  isGamePaused: boolean = false;
  currentPieceX!: number;
  currentPieceY!: number;
  score: number = 0;
  gameover: boolean = false;

  constructor() { }

  ngOnInit() {
    this.canvas = document.getElementById('tetris-canvas') as HTMLCanvasElement;
    this.context = this.canvas.getContext('2d')!;
    this.canvas.width = this.blockSize * this.width;
    this.canvas.height = this.blockSize * this.height;
    this.context.scale(this.blockSize, this.blockSize);

    this.grid = this.createGrid();
    this.currentPiece = this.getNewPiece();
    this.currentPieceX = 0;
    this.currentPieceY = 0;
    this.score = 0;
    this.gameover = false;

    this.draw();
    this.update();
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (!this.gameover) {
      if (event.key === 'ArrowLeft') {
        this.movePiece(-1);
      } else if (event.key === 'ArrowRight') {
        this.movePiece(1);
      } else if (event.key === 'ArrowDown') {
        this.movePieceDown();
      } else if (event.key === 'ArrowUp') {
        this.rotatePiece();
      }
    }
  }


  createGrid(): number[][] {
    const grid: number[][] = [];
    for (let row = 0; row < this.height; row++) {
      grid[row] = [];
      for (let col = 0; col < this.width; col++) {
        grid[row][col] = 0;
      }
    }
    return grid;
  }
  startGame(): void {
    if (!this.isGameStarted) {
      console.log('Игра началась!');
      // Инициализация игры, создание фигур и логика начала игры
      this.isGameStarted = true;
    }
  }

  resetGame(): void {
    if (this.isGameStarted) {
      console.log('Игра перезапущена!');
      // Сброс игры, очистка поля и логика перезапуска игры
      this.isGameStarted = false;
      this.isGamePaused = false;
    }
  }

  pauseGame(): void {
    if (this.isGameStarted) {
      if (!this.isGamePaused) {
        console.log('Игра приостановлена');
        // Логика паузы игры - остановка таймера, остановка движения фигур и пометка игры в состояние паузы
        this.isGamePaused = true;
      } else {
        console.log('Игра возобновлена');
        // Логика возобновления игры - возобновление таймера, возобновление движения фигур и пометка игры в состояние возобновления
        this.isGamePaused = false;
      }
    }
  }
  getNewPiece(): number[][] {
    const pieces = [
      [[1, 1, 1, 1]],
      [[1, 1], [1, 1]],
      [[1, 0, 0], [1, 1, 1]],
      [[0, 0, 1], [1, 1, 1]],
      [[0, 1, 1], [1, 1, 0]],
      [[1, 1, 0], [0, 1, 1]],
      [[0, 1], [1, 1], [1, 0]]
    ];
    const randomPiece = Math.floor(Math.random() * pieces.length);
    return pieces[randomPiece];
  }

  draw(): void {
    this.clearScreen();
    this.drawGrid();
    this.drawPiece();
    this.drawScore();
    if (this.gameover) {
      this.drawGameover();
    }
  }

  clearScreen(): void {
    this.context.fillStyle = 'black';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawGrid(): void {
    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        if (this.grid[row][col] !== 0) {
          this.context.fillStyle = '#ad00ff';
          this.context.fillRect(col, row, 1, 1);
        }
      }
    }
  }

  lockPiece(): void {
    for (let row = 0; row < this.currentPiece.length; row++) {
      for (let col = 0; col < this.currentPiece[row].length; col++) {
        if (this.currentPiece[row][col] !== 0) {
          const x = this.currentPieceX + col;
          const y = this.currentPieceY + row;
          this.grid[y][x] = this.currentPiece[row][col];
        }
      }
    }
  }

  drawPiece(): void {
    for (let row = 0; row < this.currentPiece.length; row++) {
      for (let col = 0; col < this.currentPiece[row].length; col++) {
        if (this.currentPiece[row][col] !== 0) {
          const x = this.currentPieceX + col;
          const y = this.currentPieceY + row;
          this.context.fillStyle = '#db00a9';
          this.context.fillRect(x, y, 1, 1);
        }
      }
    }
  }

  drawScore(): void {
    this.context.fillStyle = 'white';
    this.context.font = '1px Arial';
    this.context.fillText(`Рекорд: ${this.score}`, 0, 1);
  }

  drawGameover(): void {
  }
  dropInterval: number = 1000; // Интервал в миллисекундах
  lastDropTime: number = 0; // Последнее время падения фигуры

  update(): void {
    const now = Date.now(); // Текущее время

    if (now - this.lastDropTime > this.dropInterval) {
      if (!this.gameover) {
        if (this.isValidMove(this.currentPiece, this.currentPieceX, this.currentPieceY + 1)) {
          this.currentPieceY++;
        } else {
          this.lockPiece();
          this.clearLines();
          this.currentPiece = this.getNewPiece();
          this.currentPieceX = Math.floor(this.width / 2) - Math.floor(this.currentPiece[0].length / 2);
          this.currentPieceY = 0;
          if (!this.isValidMove(this.currentPiece, this.currentPieceX, this.currentPieceY)) {
            this.gameover = true;
          }
        }
      }
      this.lastDropTime = now;
    }

    this.draw();

    if (!this.gameover) {
      requestAnimationFrame(() => this.update());
    }
  }


  movePiece(dx: number): void {
    if (this.isValidMove(this.currentPiece, this.currentPieceX + dx, this.currentPieceY)) {
      this.currentPieceX += dx;
    }
  }

  movePieceDown(): void {
    if (this.isValidMove(this.currentPiece, this.currentPieceX, this.currentPieceY + 1)) {
      this.currentPieceY++;
    }
  }

  rotatePiece(): void {
    const newPiece = [];
    for (let col = 0; col < this.currentPiece[0].length; col++) {
      const newRow = [];
      for (let row = this.currentPiece.length - 1; row >= 0; row--) {
        newRow.push(this.currentPiece[row][col]);
      }
      newPiece.push(newRow);
    }
    if (this.isValidMove(newPiece, this.currentPieceX, this.currentPieceY)) {
      this.currentPiece = newPiece;
    }
  }

  isValidMove(piece: number[][], x: number, y: number): boolean {
    for (let row = 0; row < piece.length; row++) {
      for (let col = 0; col < piece[row].length; col++) {
        if (piece[row][col] !== 0) {
          const newX = x + col;
          const newY = y + row;
          if (
            newY >= this.height ||
            newX < 0 ||
            newX >= this.width ||
            this.grid[newY][newX] !== 0
          ) {
            return false;
          }
        }
      }
    }
    return true;
  }
  clearLines(): void {
    for (let row = this.height - 1; row >= 0; row--) {
      if (this.grid[row].every(cell => cell !== 0)) {
        this.grid.splice(row, 1);
        this.grid.unshift(new Array(this.width).fill(0));
        this.score += 10;
      }
    }
  }

}
