import { Component } from '@angular/core';

declare var particlesJS: any;

@Component({
  selector: 'app-dndchess',
  templateUrl: './dndchess.component.html',
  styleUrls: ['./dndchess.component.css']
})
export class DndchessComponent{
  chessBoard: ChessCell[] = [];
  selectedCell: ChessCell | null = null;
  constructor() {
    this.initializeChessBoard();
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

      this.chessBoard.push({ piece: startingPosition[i], position: i, color: color, name: "", symbol: "" });    }
  }

  getPawnMoves(cell: ChessCell, isWhite: boolean): number[] {
    const moves: number[] = [];
    const col = cell.position % 8;
    const row = Math.floor(cell.position / 8);
    const direction = isWhite ? -1 : 1;
    const targetRow = row + direction;

    if (targetRow >= 0 && targetRow < 8) {
      const moveForward = targetRow * 8 + col;
      if (this.isPieceTransparent(this.chessBoard[moveForward].piece)) {
        moves.push(moveForward);
        if (row === (isWhite ? 6 : 1)) {
          const doubleMoveForward = (targetRow + direction) * 8 + col;
          if (this.isPieceTransparent(this.chessBoard[doubleMoveForward].piece)) {
            moves.push(doubleMoveForward);
          }
        }
      }

      const targetColLeft = col - 1;
      if (targetColLeft >= 0) {
        const moveAttackLeft = targetRow * 8 + targetColLeft;
        if (!this.isPieceTransparent(this.chessBoard[moveAttackLeft].piece) &&
          this.getCellPieceColor(cell) !== this.getCellPieceColor(this.chessBoard[moveAttackLeft])) {
          moves.push(moveAttackLeft);
        }
      }

      const targetColRight = col + 1;
      if (targetColRight < 8) {
        const moveAttackRight = targetRow * 8 + targetColRight;
        if (!this.isPieceTransparent(this.chessBoard[moveAttackRight].piece) &&
          this.getCellPieceColor(cell) !== this.getCellPieceColor(this.chessBoard[moveAttackRight])) {
          moves.push(moveAttackRight);
        }
      }
    }

    return moves;
  }


  getRookMoves(cell: ChessCell): number[] {
    const moves: number[] = [];
    const col = cell.position % 8;
    const row = Math.floor(cell.position / 8);

    for (let i = col + 1; i < 8; i++) {
      const move = row * 8 + i;
      if (this.isPieceTransparent(this.chessBoard[move].piece)) {
        moves.push(move);
      } else {
        if (this.getCellPieceColor(cell) !== this.getCellPieceColor(this.chessBoard[move])) {
          moves.push(move);
        }
        break;
      }
    }

    for (let i = col - 1; i >= 0; i--) {
      const move = row * 8 + i;
      if (this.isPieceTransparent(this.chessBoard[move].piece)) {
        moves.push(move);
      } else {
        if (this.getCellPieceColor(cell) !== this.getCellPieceColor(this.chessBoard[move])) {
          moves.push(move);
        }
        break;
      }
    }

    for (let i = row + 1; i < 8; i++) {
      const move = i * 8 + col;
      if (this.isPieceTransparent(this.chessBoard[move].piece)) {
        moves.push(move);
      } else {
        if (this.getCellPieceColor(cell) !== this.getCellPieceColor(this.chessBoard[move])) {
          moves.push(move);
        }
        break;
      }
    }

    for (let i = row - 1; i >= 0; i--) {
      const move = i * 8 + col;
      if (this.isPieceTransparent(this.chessBoard[move].piece)) {
        moves.push(move);
      } else {
        if (this.getCellPieceColor(cell) !== this.getCellPieceColor(this.chessBoard[move])) {
          moves.push(move);
        }
        break;
      }
    }

    return moves;
  }


  getBishopMoves(cell: ChessCell): number[] {
    const moves: number[] = [];
    const col = cell.position % 8;
    const row = Math.floor(cell.position / 8);

    for (let i = 1; col + i < 8 && row + i < 8; i++) {
      const move = (row + i) * 8 + (col + i);
      if (this.isPieceTransparent(this.chessBoard[move].piece)) {
        moves.push(move);
      } else {
        if (this.getCellPieceColor(cell) !== this.getCellPieceColor(this.chessBoard[move])) {
          moves.push(move);
        }
        break;
      }
    }

    for (let i = 1; col - i >= 0 && row + i < 8; i++) {
      const move = (row + i) * 8 + (col - i);
      if (this.isPieceTransparent(this.chessBoard[move].piece)) {
        moves.push(move);
      } else {
        if (this.getCellPieceColor(cell) !== this.getCellPieceColor(this.chessBoard[move])) {
          moves.push(move);
        }
        break;
      }
    }

    for (let i = 1; col + i < 8 && row - i >= 0; i++) {
      const move = (row - i) * 8 + (col + i);

      if (this.isPieceTransparent(this.chessBoard[move].piece)) {
        moves.push(move);
      } else {
        if (this.getCellPieceColor(cell) !== this.getCellPieceColor(this.chessBoard[move])) {
          moves.push(move);
        }
        break;
      }
    }

    for (let i = 1; col - i >= 0 && row - i >= 0; i++) {
      const move = (row - i) * 8 + (col - i);
      if (this.isPieceTransparent(this.chessBoard[move].piece)) {
        moves.push(move);
      } else {
        if (this.getCellPieceColor(cell) !== this.getCellPieceColor(this.chessBoard[move])) {
          moves.push(move);
        }
        break;
      }
    }

    return moves;
  }

  getQueenMoves(cell: ChessCell): number[] {
    const moves: number[] = [];
    moves.push(...this.getRookMoves(cell));
    moves.push(...this.getBishopMoves(cell));
    return moves;
  }

  getKnightMoves(cell: ChessCell): number[] {
    const moves: number[] = [];
    const col = cell.position % 8;
    const row = Math.floor(cell.position / 8);
    const potentialMoves = [
      row + 2, col + 1,
      row + 1, col + 2,
      row - 1, col + 2,
      row - 2, col + 1,
      row - 2, col - 1,
      row - 1, col - 2,
      row + 1, col - 2,
      row + 2, col - 1
    ];

    for (let i = 0; i < potentialMoves.length; i += 2) {
      const moveRow = potentialMoves[i];
      const moveCol = potentialMoves[i + 1];
      if (moveRow >= 0 && moveRow < 8 && moveCol >= 0 && moveCol < 8) {
        const move = moveRow * 8 + moveCol;
        if (this.isPieceTransparent(this.chessBoard[move].piece) ||
          this.getCellPieceColor(cell) !== this.getCellPieceColor(this.chessBoard[move])) {
          moves.push(move);
        }
      }
    }

    return moves;
  }



  isPieceTransparent(piece: string): boolean {
    return piece === '' || piece === ' ';
  }

  getCellPieceColor(cell: ChessCell): string {
    if ('♙♖♘♗♕♔'.includes(cell.piece)) {
      return 'white'; 
    } else if ('♟♜♞♝♛♚'.includes(cell.piece)) {
      return 'black'; 
    } else {
      return ''; 
    }
  }

  getChessPieceClass(cell: ChessCell): string {
    return cell.piece.toLowerCase();
  }

  selectCell(cell: ChessCell) {
    if (cell.piece !== '') {
      this.selectedCell = cell;
    } else if (this.selectedCell) {
      if (this.isValidMove(this.selectedCell, cell)) {
        this.movePiece(this.selectedCell, cell);
      }
      this.selectedCell = null;
    }
  }
  isValidMove(sourceCell: ChessCell, targetCell: ChessCell): boolean {
    const sourcePiece = sourceCell.piece;
    const targetPiece = targetCell.piece;
    const isCapture = targetPiece !== '';

    switch (sourcePiece) {
      case '♙':
        if (isCapture && targetPiece !== '' && this.getCellPieceColor(sourceCell) !== this.getCellPieceColor(targetCell)) {
          const colDiff = Math.abs(sourceCell.position % 8 - targetCell.position % 8);
          const rowDiff = Math.floor(targetCell.position / 8) - Math.floor(sourceCell.position / 8);
          if (colDiff === 1 && rowDiff === -1) {
            return true;
          }
        } else if (targetPiece === '' && this.getPawnMoves(sourceCell, true).includes(targetCell.position)) {
          return true;
        }
        break;

      case '♟':
        if (isCapture && targetPiece !== '' && this.getCellPieceColor(sourceCell) !== this.getCellPieceColor(targetCell)) {
          const colDiff = Math.abs(sourceCell.position % 8 - targetCell.position % 8);
          const rowDiff = Math.floor(targetCell.position / 8) - Math.floor(sourceCell.position / 8);
          if (colDiff === 1 && rowDiff === 1) {
            return true;
          }
        } else if (targetPiece === '' && this.getPawnMoves(sourceCell, false).includes(targetCell.position)) {
          return true;
        }
        break;
      case '♖':
      case '♜':
        if (isCapture && targetPiece !== '' && this.getCellPieceColor(sourceCell) !== this.getCellPieceColor(targetCell)) {
          if (this.getRookMoves(sourceCell).includes(targetCell.position)) {
            return true;
          }
        } else if (targetPiece === '' && this.getRookMoves(sourceCell).includes(targetCell.position)) {
          return true;
        }
        break;
      case '♗':
      case '♝':
        if (isCapture && targetPiece !== '' && this.getCellPieceColor(sourceCell) !== this.getCellPieceColor(targetCell)) {
          if (this.getBishopMoves(sourceCell).includes(targetCell.position)) {
            return true;
          }
        } else if (targetPiece === '' && this.getBishopMoves(sourceCell).includes(targetCell.position)) {
          return true;
        }
        break;
      case '♕':
      case '♛':
        if (isCapture && targetPiece !== '' && this.getCellPieceColor(sourceCell) !== this.getCellPieceColor(targetCell)) {
          if (this.getRookMoves(sourceCell).includes(targetCell.position) || this.getBishopMoves(sourceCell).includes(targetCell.position)) {
            return true;
          }
        } else if (targetPiece === '' && (this.getRookMoves(sourceCell).includes(targetCell.position) || this.getBishopMoves(sourceCell).includes(targetCell.position))) {
          return true;
        }
        break;
      case '♔':
      case '♚':
        if (isCapture && targetPiece !== '' && this.getCellPieceColor(sourceCell) !== this.getCellPieceColor(targetCell)) {
          const colDiff = Math.abs(sourceCell.position % 8 - targetCell.position % 8);
          const rowDiff = Math.abs(Math.floor(sourceCell.position / 8) - Math.floor(targetCell.position / 8));
          if (colDiff <= 1 && rowDiff <= 1) {
            return true;
          }
        } else if (targetPiece === '' && (this.getRookMoves(sourceCell).includes(targetCell.position) || this.getBishopMoves(sourceCell).includes(targetCell.position))) {
          const colDiff = Math.abs(sourceCell.position % 8 - targetCell.position % 8);
          const rowDiff = Math.abs(Math.floor(sourceCell.position / 8) - Math.floor(targetCell.position / 8));
          if (colDiff <= 1 && rowDiff <= 1) {
            return true;
          }
        }
        break;
      case '♞':
      case '♘':
        if (isCapture && targetPiece !== '' && this.getCellPieceColor(sourceCell) !== this.getCellPieceColor(targetCell)) {
          const colDiff = Math.abs(sourceCell.position % 8 - targetCell.position % 8);
          const rowDiff = Math.abs(Math.floor(sourceCell.position / 8) - Math.floor(targetCell.position / 8));
          if ((colDiff === 2 && rowDiff === 1) || (colDiff === 1 && rowDiff === 2)) {
            return true;
          }
        } else if (targetPiece === '' && (this.getKnightMoves(sourceCell).includes(targetCell.position))) {
          const colDiff = Math.abs(sourceCell.position % 8 - targetCell.position % 8);
          const rowDiff = Math.abs(Math.floor(sourceCell.position / 8) - Math.floor(targetCell.position / 8));
          if ((colDiff === 2 && rowDiff === 1) || (colDiff === 1 && rowDiff === 2)) {
            return true;
          }
        }
        break;
      default:
        break;
    }

    return false;
  }

  movePiece(sourceCell: ChessCell, targetCell: ChessCell) {
    if (this.isValidMove(sourceCell, targetCell)) {
      const movedPiece = sourceCell.piece;
      sourceCell.piece = '';
      targetCell.piece = movedPiece;
    }
  }

  startDrag(event: DragEvent, cell: ChessCell) {
    if (cell.piece !== '') {
      this.selectedCell = cell;
      event.dataTransfer!.setData('text/plain', '');
    }
  }

  dragOver(event: DragEvent) {
    event.preventDefault();
  }

  drop(event: DragEvent, targetCell: ChessCell) {
    event.preventDefault();
    if (this.selectedCell) {
      if (this.isValidMove(this.selectedCell, targetCell)) {
        this.movePiece(this.selectedCell, targetCell);
      }
    }
  }
}
interface ChessPiece {
  name: string;
  symbol: string;
  color: string;
  health: number;
}

interface ChessCell {
  name: string;
  symbol: string;
  piece: string;
  position: number;
  color: string;
}
