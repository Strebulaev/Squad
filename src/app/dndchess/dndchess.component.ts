import { Component } from '@angular/core';

@Component({
  selector: 'app-dndchess',
  templateUrl: './dndchess.component.html',
  styleUrls: ['./dndchess.component.css']
})
export class DndchessComponent {
  chessBoard: ChessCell[] = [];
  selectedCell: ChessCell | null = null;
  currentPlayer: 'white' | 'black' = 'white';
  isCheck: boolean = false;
  dragStartCell: ChessCell | null = null;
  possibleMoves: number[] = []; // Для подсветки возможных ходов
  kingPosition: number = -1; // Позиция короля текущего игрока

  constructor() {
    this.initializeChessBoard();
    this.kingPosition = this.findKingPosition();
  }

  initializeChessBoard() {
    const startingPosition = [
      '♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜',
      '♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟',
      '', '', '', '', '', '', '', '',
      '', '', '', '', '', '', '', '',
      '', '', '', '', '', '', '', '',
      '', '', '', '', '', '', '', '',
      '♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙',
      '♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖'
    ];

    for (let i = 0; i < 64; i++) {
      const row = Math.floor(i / 8);
      const col = i % 8;
      const color = (row + col) % 2 === 0 ? 'black' : '#FF7F00';

      this.chessBoard.push({ piece: startingPosition[i], position: i, color: color });
    }
  }

  getChessPieceClass(cell: ChessCell): string {
    if (!cell.piece) return '';

    switch (cell.piece) {
      case '♙':
      case '♟':
        return 'pawn';
      case '♖':
      case '♜':
        return 'rook';
      case '♘':
      case '♞':
        return 'knight';
      case '♗':
      case '♝':
        return 'bishop';
      case '♕':
      case '♛':
        return 'queen';
      case '♔':
      case '♚':
        return 'king';
      default:
        return '';
    }
  }

  selectCell(cell: ChessCell) {
    if (this.isCheck && !this.isMoveResolvingCheck(cell)) {
      return;
    }

    if (cell.piece !== '' && this.isCurrentPlayerPiece(cell)) {
      this.selectedCell = cell;
      this.possibleMoves = this.getPossibleMoves(cell);
    } else if (this.selectedCell) {
      if (this.isValidMove(this.selectedCell, cell)) {
        this.movePiece(this.selectedCell, cell);
        this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
        this.checkForCheck();
        this.kingPosition = this.findKingPosition();
      }
      this.selectedCell = null;
      this.possibleMoves = [];
    }
  }

  isCurrentPlayerPiece(cell: ChessCell): boolean {
    const whitePieces = ['♙', '♖', '♘', '♗', '♕', '♔'];
    const blackPieces = ['♟', '♜', '♞', '♝', '♛', '♚'];
    return (this.currentPlayer === 'white' && whitePieces.includes(cell.piece)) ||
      (this.currentPlayer === 'black' && blackPieces.includes(cell.piece));
  }

  isValidMove(sourceCell: ChessCell, targetCell: ChessCell): boolean {
    const piece = sourceCell.piece;
    const targetPiece = targetCell.piece;
    const sourceRow = Math.floor(sourceCell.position / 8);
    const sourceCol = sourceCell.position % 8;
    const targetRow = Math.floor(targetCell.position / 8);
    const targetCol = targetCell.position % 8;

    if (piece === '') return false;

    const isWhitePiece = ['♙', '♖', '♘', '♗', '♕', '♔'].includes(piece);
    const isBlackPiece = ['♟', '♜', '♞', '♝', '♛', '♚'].includes(piece);

    if ((isWhitePiece && this.currentPlayer === 'black') || (isBlackPiece && this.currentPlayer === 'white')) {
      return false;
    }

    switch (piece) {
      case '♙':
      case '♟':
        return this.isValidPawnMove(sourceRow, sourceCol, targetRow, targetCol, isWhitePiece, targetPiece);
      case '♖':
      case '♜':
        return this.isValidRookMove(sourceRow, sourceCol, targetRow, targetCol);
      case '♘':
      case '♞':
        return this.isValidKnightMove(sourceRow, sourceCol, targetRow, targetCol);
      case '♗':
      case '♝':
        return this.isValidBishopMove(sourceRow, sourceCol, targetRow, targetCol);
      case '♕':
      case '♛':
        return this.isValidQueenMove(sourceRow, sourceCol, targetRow, targetCol);
      case '♔':
      case '♚':
        return this.isValidKingMove(sourceRow, sourceCol, targetRow, targetCol);
      default:
        return false;
    }
  }

  isValidPawnMove(sourceRow: number, sourceCol: number, targetRow: number, targetCol: number, isWhitePiece: boolean, targetPiece: string): boolean {
    const direction = isWhitePiece ? -1 : 1;
    const startRow = isWhitePiece ? 6 : 1;

    if (sourceCol === targetCol) {
      if (targetPiece !== '') return false;
      if (sourceRow + direction === targetRow) return true;
      if (sourceRow === startRow && sourceRow + 2 * direction === targetRow) return true;
    } else if (Math.abs(sourceCol - targetCol) === 1 && sourceRow + direction === targetRow) {
      return targetPiece !== '';
    }

    return false;
  }

  isValidRookMove(sourceRow: number, sourceCol: number, targetRow: number, targetCol: number): boolean {
    if (sourceRow !== targetRow && sourceCol !== targetCol) return false;
    return this.isPathClear(sourceRow, sourceCol, targetRow, targetCol);
  }

  isValidKnightMove(sourceRow: number, sourceCol: number, targetRow: number, targetCol: number): boolean {
    const rowDiff = Math.abs(sourceRow - targetRow);
    const colDiff = Math.abs(sourceCol - targetCol);
    return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
  }

  isValidBishopMove(sourceRow: number, sourceCol: number, targetRow: number, targetCol: number): boolean {
    if (Math.abs(sourceRow - targetRow) !== Math.abs(sourceCol - targetCol)) return false;
    return this.isPathClear(sourceRow, sourceCol, targetRow, targetCol);
  }

  isValidQueenMove(sourceRow: number, sourceCol: number, targetRow: number, targetCol: number): boolean {
    if (sourceRow !== targetRow && sourceCol !== targetCol && Math.abs(sourceRow - targetRow) !== Math.abs(sourceCol - targetCol)) return false;
    return this.isPathClear(sourceRow, sourceCol, targetRow, targetCol);
  }

  isValidKingMove(sourceRow: number, sourceCol: number, targetRow: number, targetCol: number): boolean {
    const rowDiff = Math.abs(sourceRow - targetRow);
    const colDiff = Math.abs(sourceCol - targetCol);
    return rowDiff <= 1 && colDiff <= 1;
  }

  isPathClear(sourceRow: number, sourceCol: number, targetRow: number, targetCol: number): boolean {
    const rowStep = targetRow > sourceRow ? 1 : -1;
    const colStep = targetCol > sourceCol ? 1 : -1;

    if (sourceRow === targetRow) {
      for (let col = sourceCol + colStep; col !== targetCol; col += colStep) {
        if (this.chessBoard[sourceRow * 8 + col].piece !== '') return false;
      }
    } else if (sourceCol === targetCol) {
      for (let row = sourceRow + rowStep; row !== targetRow; row += rowStep) {
        if (this.chessBoard[row * 8 + sourceCol].piece !== '') return false;
      }
    } else {
      for (let row = sourceRow + rowStep, col = sourceCol + colStep; row !== targetRow; row += rowStep, col += colStep) {
        if (this.chessBoard[row * 8 + col].piece !== '') return false;
      }
    }

    return true;
  }

  movePiece(sourceCell: ChessCell, targetCell: ChessCell) {
    if (this.isValidMove(sourceCell, targetCell)) {
      const movedPiece = sourceCell.piece;
      sourceCell.piece = '';
      targetCell.piece = movedPiece;
    }
  }

  checkForCheck() {
    this.isCheck = this.isUnderAttack(this.kingPosition);
  }

  findKingPosition(): number {
    const king = this.currentPlayer === 'white' ? '♔' : '♚';
    return this.chessBoard.findIndex(cell => cell.piece === king);
  }

  isUnderAttack(position: number): boolean {
    const row = Math.floor(position / 8);
    const col = position % 8;

    for (let i = 0; i < 64; i++) {
      const cell = this.chessBoard[i];
      if (cell.piece !== '' && !this.isCurrentPlayerPiece(cell)) {
        if (this.isValidMove(cell, { piece: '', position: position, color: '' })) {
          return true;
        }
      }
    }

    return false;
  }

  isMoveResolvingCheck(targetCell: ChessCell): boolean {
    if (!this.selectedCell) return false;

    const tempBoard = JSON.parse(JSON.stringify(this.chessBoard)); // Копируем доску
    const sourceIndex = this.selectedCell.position;
    const targetIndex = targetCell.position;

    // Делаем временный ход
    tempBoard[targetIndex].piece = tempBoard[sourceIndex].piece;
    tempBoard[sourceIndex].piece = '';

    // Проверяем, остался ли король под шахом
    const kingPosition = this.findKingPosition();
    const isStillInCheck = this.isUnderAttack(kingPosition);

    return !isStillInCheck;
  }

  getPossibleMoves(cell: ChessCell): number[] {
    const moves: number[] = [];
    for (let i = 0; i < 64; i++) {
      const targetCell = this.chessBoard[i];
      if (this.isValidMove(cell, targetCell)) {
        moves.push(i);
      }
    }
    return moves;
  }

  // Drag-and-drop методы
  onDragStart(cell: ChessCell) {
    if (cell.piece !== '' && this.isCurrentPlayerPiece(cell)) {
      this.dragStartCell = cell;
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault(); // Разрешаем drop
  }

  onDrop(cell: ChessCell) {
    if (this.dragStartCell && this.isValidMove(this.dragStartCell, cell)) {
      this.movePiece(this.dragStartCell, cell);
      this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
      this.checkForCheck();
      this.kingPosition = this.findKingPosition();
    }
    this.dragStartCell = null;
  }
}

interface ChessCell {
  piece: string;
  position: number;
  color: string;
}
