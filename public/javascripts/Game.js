/**
 * Created by Marlon on 08.03.2017.
 */

/* +++++++++++++++++ */
/* Game entry point */
window.onload = function() {
	game = new Phaser.Game(GAME_WIDTH ,GAME_HEIGHT ,Phaser.AUTO ,'gameContainer');
	game.state.add(STATE_PLAY ,state_play);
	game.state.add(STATE_END ,state_end);
	game.state.start(STATE_PLAY);
};

/* ++++++++++++ */
/* Game states */
/* ----------------------- */
/* Game start and gameplay */
/* ----------------------- */
var state_play = {
	preload: function() {
		UI.load();
		AUDIO.load();
	},

	create: function() {
		// register & subscribe to keyboard string input
		game.input.keyboard.addCallbacks(this ,null ,null ,this.onKeyPress.bind(this));

		// game Logic
		validator_instance = targetValidator.create( $("#gametext").text());
		tracker_instance = scoreTracker.create();

		// ui
		ui_instance = UI.init_Game();

		// audio
		audio_instance = AUDIO.init_Game();

		// gameEvent subscriptions
		gameEvents.on(EVENT_GAME_END ,this.onGameEnd.bind(this));
	},

	/* Event Handlers */
	/* +++++++++++++ */
	/* register keypress & announce event */
	onKeyPress: function(symbol) {
		var newKey = new pressedKey(symbol);
		gameEvents.emit(EVENT_REGISTERKEYPRESS ,newKey);
		gameEvents.emit(EVENT_KEYPRESS ,newKey);

		// write key to writtenText ui
		symbol = (symbol === ' ') ? ' > ' : symbol;
	},

	/* finalize score, transition to end-screen */
	onGameEnd: function(score) {
        let lvlId = $("#lvlId").text();
		let points = score.getScore().toString();
        let errors = score.getErrorAmount().toString();
        
        $.ajax({
            contentType: "application/json; charset=utf-8",
            url: '/sendScore',
            method: 'POST',
            data: JSON.stringify({

                lvlId: lvlId,
				points: points,
				errors: errors

            })
        });

        game.state.start(STATE_END ,true ,false ,score);
    }
};

/* -------- */
/* Game end */
/* -------- */
var state_end = {
	init: function(scoreObj) {
		this.scoreObj = scoreObj;
		gameEvents.clear();
	},

	preload: function() {
		UI.load();
	},

	create: function() {
		UI_instance = ui_instance.init_End(this.scoreObj);
		audio_instance = AUDIO.init_End();
	}
};


/* +++++++++++ */
/* Components - Prototypes */
/* -------------------------------------------------------------------- */
/* Core logic: validate input & manage text progress & emit most events */
/* -------------------------------------------------------------------- */
var targetValidator = {
	create: function(inText) {
		instance = this;

		// Init text
		this.text = inText;
		this.text_splitSpace = inText.split(' ');
		// -- re-add spaces
		// ---- spaces are part of text to write, but we advance by symbols within words
		for (var i = 1; i < this.text_splitSpace.length; i++) {
			this.text_splitSpace[i] = ' ' + this.text_splitSpace[i];
		}

		// Init indices
		this.idx_words = 0;
		this.idx_symbols = 0;
		this.word = this.text_splitSpace[0];
		this.symbol = this.word[this.idx_symbols];

		// Subscriptions
		gameEvents.on(EVENT_KEYPRESS ,this.validateKey.bind(this));

		return instance;
	},

	/* Methods */
	/* ++++++ */
	/* validate pressed key & emit */
	validateKey: function(key) {
		let keySymbol = key.getSymbol();

		// correct key ...
		if (this.symbol === keySymbol) {
			gameEvents.emit(EVENT_KEYPRESS_CORRECT ,key);
			if(this.idx_symbols < this.word.length - 1){				
				this.nextSymbol();
			} else {
				this.nextWord();
			}
			return;
		}

		// ... wrong key
		gameEvents.emit(EVENT_KEYPRESS_WRONG ,key);
		this.resetWord(keySymbol);
	},

	resetWord: function(symbol) {
		this.idx_symbols = -1;
		this.nextSymbol();
	},

	nextSymbol: function() {
		this.idx_symbols += 1;
		this.symbol = this.word[this.idx_symbols];
		gameEvents.emit(EVENT_NEXT_SYMBOL ,this.symbol);
	},

	/* Game End triggered HERE */
	nextWord: function() {
		this.idx_words += 1;
		this.idx_symbols = -1;
		
		// Trigger game end
		if (this.text_splitSpace.length <= this.idx_words) {
			gameEvents.emit(EVENT_TEXT_COMPLETE ,this.word);
			return;
		}
		
		this.word = this.text_splitSpace[this.idx_words];
		this.nextSymbol();

		gameEvents.emit(EVENT_NEXT_WORD ,this.word);
	},

	/* Properties */
	/* +++++++++ */
	getUpcomingWords: function(amount) {
		let startIdx = this.idx_words + 1;
		return this.text_splitSpace.slice(startIdx ,startIdx + amount);
	},

	getAmountWords: function() { return this.text_splitSpace.length;
	},

	getAmountWordsDone: function() { return this.idx_words;
	},

	getCurrentWord: function() { return this.word;
	},

	getCurrentSymbol: function() { return this.symbol;
	}
};

/* -------------- */
/* manage scoring */
/* -------------- */
var scoreTracker = {
	create: function() {
		instance = this;

		// attributes
		this.finalScorePoints = 0;
		this.currentScorePoints = 0;
		this.scoreInc = SCORE_BASE_INC;
		this.errorCounter = 0;
		this.comboMultiplier = 1;
		this.comboInc = SCORE_MULTIPLIER_INC;
		this.pressedKeys = [];
		this.wordStreak = 0;
		this.comboUpStreakThreshold = 3;

		// subscriptions
		gameEvents.on(EVENT_KEYPRESS_WRONG ,this.onKeyWrong.bind(this));
		gameEvents.on(EVENT_TEXT_COMPLETE ,this.onTextComplete.bind(this));
		gameEvents.on(EVENT_NEXT_WORD ,this.onNextWord.bind(this));
		gameEvents.on(EVENT_REGISTERKEYPRESS ,this.onRegisterKeyPress.bind(this));

		return instance;
	},

	/* Event handlers */
	/* +++++++++++++ */
	onNextWord: function(word) {
		++this.wordStreak;

		// comboUp as streak threshold is crossed
		if( (this.wordStreak % this.comboUpStreakThreshold) === 0 ) {
			this.comboMultiplier += this.comboInc;
			gameEvents.emit(EVENT_SCORE_COMBOUP ,this.comboMultiplier);
		}

		// Inc score
		let scoreInc = this.scoreInc * word.length * this.comboMultiplier;
		this.currentScorePoints += scoreInc;
		gameEvents.emit(EVENT_SCORE_SCORE ,scoreInc);
	},

	onRegisterKeyPress: function(key) {
		this.pressedKeys.push(key);
	},

	onKeyWrong: function(key) {
		++this.errorCounter;

		// Reset combo
		this.wordStreak = 0;
		gameEvents.emit(EVENT_SCORE_DOWN ,this.currentScorePoints);
		if (this.comboMultiplier > 1) {
			this.comboMultiplier = 1;
			gameEvents.emit(EVENT_SCORE_COMBODROP ,this.comboMultiplier);
		}
	},

	/*** Game End triggered HERE ***/
	onTextComplete: function(word) {
		// Set score and trigger game end
		this.finalScorePoints = this.currentScorePoints;
		this.finalScore = new gameScore(
			this.finalScorePoints
			,this.errorCounter
			,this.pressedKeys
			,validator_instance.getAmountWords()
		);
		gameEvents.emit(EVENT_GAME_END ,this.finalScore);
	},

	/* Properties */
	/* +++++++++ */
	getCurrentWordStreak: function() {
		return this.wordStreak;
	},

	getCurrentComboMultiplier: function() {	return this.comboMultiplier; 
	},

	getCurrentScorePoints: function() {	return this.currentScorePoints;
	},

	getErrorCounter: function () { return this.errorCounter;
	}
};

/* ------------------------------------ */
/* Use to register and emit game events */
/* ------------------------------------ */
var gameEvents = {
	events: {},
	
	/* subscribe */
	on: function (eventName ,fn) {
		this.events[eventName] = this.events[eventName] || [];
		this.events[eventName].push(fn);
	},
	
	/* unsubscribe */
	off: function(eventName ,fn) {
		if (this.events[eventName]) {
			for (var i = 0; i < this.events[eventName].length; i++) {
				if (this.events[eventName][i] === fn) {
					this.events[eventName].splice(i ,1);
					break;
				}
			};
		}
	},
	
	/* trigger event */
	emit: function (eventName ,data) {
		if (this.events[eventName]) {
			this.events[eventName].forEach(function(fn) {
				fn(data);
				});
		}
	},

	/* unsubscribe all */
	clear: function() {
		this.events = [];
	}
};


/* ++++++++ */
/* Components - Classes */
/* ------------------------------------------ */
/* Score object for after a level is finished */
/* ------------------------------------------ */
class gameScore {
	constructor(scorePoints ,errorAmount ,pressedKeys ,amtWords) {
		this.scorePoints = scorePoints;
		this.errorAmount = errorAmount;
		this.pressedKeys = pressedKeys;
		this.amtWords = amtWords;

		this.timeBonus = Math.max(0 ,this.scorePoints - Math.floor(this.getRequiredTime()/1.368));

		this.writtenText = '';
		for (var i = 0; i < pressedKeys.length; i++) {
			this.writtenText += pressedKeys[i].getSymbol();
		}
	}

	/* Properties */
	/* +++++++++ */
	getScore() {
		let score = this.scorePoints + this.timeBonus;
		return score;
	}

	getRequiredTime() {
		let requiredTime = this.pressedKeys[this.pressedKeys.length-1].getTimestamp() - this.pressedKeys[0].getTimestamp();
		return requiredTime;
	}

	getErrorAmount() { return this.errorAmount;
	}

	getPressedKeys() { return this.pressedKeys;
	}

	getScorePoints () { return this.scorePoints;
	}

	getWrittenText() { return this.writtenText;
	}

	getTimeBonus() { return this.timeBonus;
	}

	getAmtWords() { return this.amtWords;
	}
};

/* ----------------------- */
/* Single pressed key data */
/* ----------------------- */
class pressedKey {
	constructor(symbol) {
		this.symbol = symbol;
		this.timestamp = Date.now();
	}

	/* Properties */
	/* +++++++++ */
	getSymbol() { return this.symbol;
	}

	getTimestamp() { return this.timestamp;
	}
};