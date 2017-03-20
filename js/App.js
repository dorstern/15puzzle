/* App.js */

function App(){
	//Variables
	this.view = new AppView();
	this.puzzle = [];
	this.completed_puzzle = [];
	this.num_pieces = 16;

	var _this = this;

	//Event Handling
	this.view.onStartClicked.attach(function(){
		_this.onStartClicked();
	});

	this.view.onPuzzlePieceClicked.attach(function(sender, args){
		_this.onPuzzlePieceClicked(args.index);
	});

	this.view.onTimerStoped.attach(function(sender, args){
		_this.saveScore(args.time);
	});

	return this.init();
}

App.prototype = {
	init: function(){
		var index = 1;
		var rows = Math.sqrt(this.num_pieces);
		var cols = Math.sqrt(this.num_pieces);
		for (var i = 0; i < rows; i++){
			for (var j = 0; j < cols; j++){
				var piece = new PuzzlePiece(i,j,index);
				this.puzzle.push(piece);
				var completed_piece = new PuzzlePiece(i,j,index);
				this.completed_puzzle.push(completed_piece);
				index = index + 1;
			}
		}
	},

	onStartClicked: function(){
		this.shuffle(this.puzzle);
		this.startTimer();
		this.view.shufflePuzzle(this.puzzle);
	},

	shuffle: function(array){
		var currentIndex = array.length, temporaryValue, randomIndex;
		var counter = 0;
		while (currentIndex !== 0) {
			counter++;
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;
			this.swapPuzzlePieces(array[currentIndex], array[randomIndex]);
		}

		return array;
	},

	swapPuzzlePieces: function(puzzlePiece1, puzzlePiece2){
		temporaryIndex = puzzlePiece1.index
		puzzlePiece1.index = puzzlePiece2.index;
		puzzlePiece2.index = temporaryIndex;
	},

	startTimer: function(){
		this.showTimer();
	},

	showTimer: function(time){
		var _this = this;
		var offset = Date.now();
		var clock = 0;
		this.timerInterval = setInterval(function(){
		   var now = Date.now();
		   var date = now - offset;
		   var time = _this.formatTime(date);
			_this.view.showTimer(time);
		}, 1000);
	},

	formatTime: function(time) {
		var h = m = s = ms = 0;
		var newTime = '';

		h = Math.floor( time / (60 * 60 * 1000) );
		time = time % (60 * 60 * 1000);
		m = Math.floor( time / (60 * 1000) );
		time = time % (60 * 1000);
		s = Math.floor( time / 1000 );
		ms = time % 1000;

		newTime = this.pad(h, 2) + ':' + this.pad(m, 2) + ':' + this.pad(s, 2);
		return newTime;
	},

	pad: function(num, size) {
		var s = "0000" + num;
		return s.substr(s.length - size);
	},

	onPuzzlePieceClicked: function(index){
		var piece = this.puzzle.filter(function( piece ){
			return piece.index == index;
		});
		var piece_row = piece[0].row;
		var piece_col = piece[0].col;
		var next_to_pieces = this.puzzle.filter(function( piece ){
			return (((piece.row == piece_row - 1) && (piece.col == piece_col)) || ((piece.row == piece_row + 1) && (piece.col == piece_col)) || 
				((piece.row == piece_row) && (piece.col == piece_col - 1)) || ((piece.row == piece_row) && (piece.col == piece_col + 1)));
		});
		for (var i = 0; i < next_to_pieces.length; i++){
			if (next_to_pieces[i].index == 16){
				this.swapPuzzlePieces(piece[0], next_to_pieces[i]);
				this.view.swapPuzzlePieces(piece[0].index, next_to_pieces[i].index);
				this.checkPuzzleCompleted();
				break;
			}
		}
	},

	checkPuzzleCompleted: function(){
		for (var i = 0; i < this.num_pieces; i++){
			if (this.completed_puzzle[i].index != this.puzzle[i].index){
				return false;
			}
		}

		this.view.stopTimer();
	},

	saveScore: function(time){
		var scores = JSON.parse(localStorage.getItem("scores"));
		if (!scores){
			scores = [time];
		} else {
			scores.push(time);
		}
		localStorage.setItem("scores", JSON.stringify(scores));
	}

}

/* Puzzle Piece */
function PuzzlePiece(row, col, index){
	this.row = row;
	this.col = col;
	this.index = index;
}


$(function(){
	var app = new App();
});
