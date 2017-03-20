/* AppView.js */

function AppView(){
	//Variables
	this.start_btn;
	this.timer;
	this.timerInterval;
	this.puzzle;

	//Events
	this.onStartClicked = new Event(this);
	this.onPuzzlePieceClicked = new Event(this);
	this.onTimerStoped = new Event(this);

	return this.init();
}

AppView.prototype = {
	init: function(){
		this.start_btn = $("#start_btn");
		this.puzzle = $("#puzzle");
		this.timer = $("#timer");
		this.initEvents();
	},

	initEvents: function(){
		var _this = this;
		this.start_btn.on("click", function(){
			_this.onStartClicked.notify();
		});
		this.puzzle.on("click", ".puzzle_piece", function(){
			var index = $(this).attr('attr-data');
			_this.onPuzzlePieceClicked.notify({index : index});
		});
	},

	shufflePuzzle: function(puzzle){
		var sorted_puzzle = [];
		for (var i = 0; i < puzzle.length; i++){
			var piece = this.puzzle.find(".puzzle_piece[attr-data='"+puzzle[i].index+"']");
			sorted_puzzle.push(piece);
		}
		this.puzzle.empty();
		for (var i = 0; i < puzzle.length; i++){
			this.puzzle.append(sorted_puzzle[i]);
		}
		this.disableStartBtn();
	},

	swapPuzzlePieces: function(piece_index1, piece_index2){
		var piece1 = this.puzzle.find(".puzzle_piece[attr-data='"+piece_index1+"']");
		var piece2 = this.puzzle.find(".puzzle_piece[attr-data='"+piece_index2+"']");
	    piece1.after(piece2.clone());
	    piece2.after(piece1).remove();
	},

	showTimer: function(time){
		this.timer.text(time);
	},

	stopTimer: function(){
		clearInterval(this.timerInterval);
		alert("Congratulations, you solved the puzzle");
		this.enableStartBtn();
		this.onTimerStoped.notify({time : this.timer.text()});
	},

	disableStartBtn: function(){
		this.start_btn.attr({"disabled" : "disabled"});
	},

	enableStartBtn: function(){
		this.start_btn.removeAttr("disabled");
		this.start_btn.attr("value", "Restart");
	}
}
