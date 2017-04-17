/**
 * Created by Marlon on 08.03.2017.
 */

/* +++++++++++++++ */
/* Main UI module */
var UI = {
	/* load required assets */
	load: function() {
		game.load.bitmapFont(ASSET_FONT_PARPG ,ASSET_FONT_PARPG_BMP ,ASSET_FONT_PARPG_XML);
		game.load.bitmapFont(ASSET_FONT_MINECRAFTIA ,ASSET_FONT_MINECRAFTIA_BMP ,ASSET_FONT_MINECRAFTIA_XML);

		game.load.image(ASSET_SPRITE_KEY_CURRENT ,ASSET_SPRITE_KEY_CURRENT_PATH);
		
		slickUI = game.plugins.add(Phaser.Plugin.SlickUI);
		slickUI.load(KENNEY_JSON);
	},

	init_Game: function() {
		instance = this;

		UI_keyboard.create();
		UI_writtenText.create();
		UI_upcomingWords.create();
		UI_currentWord.create();
		UI_comboPanel.create();
		UI_currentSymbol.create();

		return instance;
	},

	init_End: function(scoreObj) {
		instance = this;

		UI_endScreen.create(scoreObj);

		return instance;
	}
};

/* +++++++++++ */
/* Components - Prototypes */
var UI_endScreen = {
	create: function(scoreObj) {
		this.scoreObj = scoreObj;
		this.writtenText = this.scoreObj.getWrittenText().toString();

		// Base panel
		slickUI.add(this.panel = new SlickUI.Element.Panel(GAME_WIDTH*0.1 ,GAME_HEIGHT*0.1 ,GAME_WIDTH*0.8 ,GAME_HEIGHT*0.8));

		// Final Score =
		this.panel.add(this.text_scoreHeader = new SlickUI.Element.Text(20 ,10 ,'Final Score' ,20));
		this.panel.add(this.text_score = new SlickUI.Element.Text(20 ,30 
			,this.scoreObj.getScore().toString() 
			,44)
		);

		// Scorepoints
		this.panel.add(this.text_scorePointsHeader = new SlickUI.Element.Text(300 ,20 ,'=  Points + Time Bonus' ,16));
		this.panel.add(this.text_scorePoints = new SlickUI.Element.Text(300 ,40 
			,'= ' + this.scoreObj.getScorePoints().toString() + ' + ' + this.scoreObj.getTimeBonus().toString() 
			,24)
		);

		// Errors
		this.panel.add(this.text_errorHeader = new SlickUI.Element.Text(650 ,20 ,'Errors' ,16));
		this.panel.add(this.text_error = new SlickUI.Element.Text(650 ,40 
			,this.scoreObj.getErrorAmount().toString() + '   / ' + this.scoreObj.getAmtWords().toString() + ' words.'
			,24)
		);

		// Written text, adjusted size in case of overflow
		let textSize = 24;
		if (this.writtenText.length > 350) this.textSize = 14;
		this.panel.add(this.text_text = new SlickUI.Element.Text(20 ,200 ,this.writtenText ,textSize ,ASSET_FONT_PARPG)).center();

		// Button Continue
		this.panel.add(this.button_cont = new SlickUI.Element.Button(680 ,420 ,200 ,60));
		this.button_cont.add(this.button_cont_text = new SlickUI.Element.Text(0 ,0 ,'CONTINUE' ,26)).center();
		//this.button_cont.input.useHandCursor = true;
		this.button_cont.events.onInputUp.add( function() {
			window.location.href = "/setupMenu";
		});
	}
};

var UI_comboPanel = {
	create: function() {
		this.combo_panel_x = GAME_WIDTH*0.76;
		this.combo_panel_y = 234;

		slickUI.add(this.score_panel = new SlickUI.Element.Panel(GAME_WIDTH*0.79 ,180 ,GAME_WIDTH*0.22 ,190));
		slickUI.add(this.combo_panel = new SlickUI.Element.Panel(this.combo_panel_x ,this.combo_panel_y ,80 ,80));
		this.combo_panel.add(this.combo_text = new SlickUI.Element.Text(0,0,'x 1')).center();

		this.score_text_x = 52;
		this.score_text_y = 72;
		this.score_panel.add(this.score_text_h = new SlickUI.Element.Text(this.score_text_x+2,this.score_text_y-17,'Score',16));
		this.score_panel.add(this.score_text = new SlickUI.Element.Text(this.score_text_x,this.score_text_y,'0',32));

		this.error_text_x = 10;
		this.error_text_y = this.score_text_y - 52;
		this.score_panel.add(this.error_text_h = new SlickUI.Element.Text(this.error_text_x,this.error_text_y,'Errors',12));
		this.score_panel.add(this.error_text = new SlickUI.Element.Text(this.error_text_x+65,this.error_text_y-2,'0',20));

		this.words_text_x = 16;
		this.words_text_y = this.score_text_y + 68;
		this.score_panel.add(this.words_text_h = new SlickUI.Element.Text(this.words_text_x,this.words_text_y,'Words',12));
		this.score_panel.add(this.words_text = new SlickUI.Element.Text(this.words_text_x+56,this.words_text_y-10
			,validator_instance.getAmountWordsDone().toString()
			,16)
		);
		this.score_panel.add(this.words_text_total = new SlickUI.Element.Text(this.words_text_x+75,this.words_text_y-8
			,'/' + validator_instance.getAmountWords().toString()
			,20)
		);

		gameEvents.on(EVENT_SCORE_SCORE ,this.onScore.bind(this));
		gameEvents.on(EVENT_SCORE_COMBOUP ,this.onComboUp.bind(this));
		gameEvents.on(EVENT_SCORE_COMBODROP ,this.onComboDrop.bind(this));
		gameEvents.on(EVENT_KEYPRESS_WRONG ,this.onKeyPressWrong.bind(this));
		gameEvents.on(EVENT_NEXT_WORD, this.onNextWord.bind(this));
	},

	onScore: function(scoreInc) {
		// update text
		this.score_text.value = tracker_instance.getCurrentScorePoints().toString();

		// bump box into score
		let bump = game.add.tween(this.combo_panel);
		this.combo_panel.x = this.combo_panel_x; //reset pos: avoid stuck-in-tween bug
		bump.to({ x:this.combo_panel_x+4 } ,4 ,Phaser.Easing.Bounce.In);
		bump.yoyo(true ,40)
		bump.start();
	},

	onNextWord: function() {
		this.words_text.value = validator_instance.getAmountWordsDone().toString();
	},

	onKeyPressWrong: function(newScore) {
		this.error_text.value = tracker_instance.getErrorCounter().toString();

		// bump score down
		this.score_panel.y = 180; //reset pos: avoid stuck-in-tween bug
		let bump = game.add.tween(this.score_panel);
		bump.to({ y:180+1 } ,10 ,Phaser.Easing.Bounce.In);
		bump.yoyo(true ,10)
		bump.start();
	},

	onComboUp: function() {
		this.combo_text.value = 'x ' + tracker_instance.getCurrentComboMultiplier();
		this.combo_text.center();
	},

	onComboDrop: function() {
		this.combo_text.value = ('x 1');
		this.combo_text.center();
	}
};

var UI_currentWord = {
	create: function() {
		slickUI.add(this.panel = new SlickUI.Element.Panel(GAME_WIDTH*0 ,234 ,GAME_WIDTH*0.225 ,80));
		this.panel.add(this.text = new SlickUI.Element.Text(0,0,'',20,ASSET_FONT_MINECRAFTIA));
		this.text.value = validator_instance.getCurrentWord();
		this.text.center();

		gameEvents.on(EVENT_NEXT_WORD ,this.onNextWord.bind(this));
	},

	onNextWord: function(word) {
		let displayString = '';
		for (var i = 0; i < word.length; i++) {
			if(word[i] === ' ') {
				displayString += '[_] ';
			} else if (word[i] === '.') {
				displayString += ' [.]';
			} else if (word[i] === ',') {
				displayString += ' [,]';
			} else {
				displayString += word[i];
			}
		}
		this.text.value = displayString;
		this.text.centerHorizontally();
	}
};

var UI_upcomingWords = {
	create: function() {		
		slickUI.add(this.panel = new SlickUI.Element.Panel(GAME_WIDTH*0.222 ,239 ,GAME_WIDTH*0.565 ,70 ,ASSET_FONT_MINECRAFTIA));

		// setup text slots
		this.words = [];
		for (var i = 0; i <= UI_UPCOMING_CONCURRENT; i++) {
			this.words.push( new SlickUI.Element.Text(30 ,105 + i * 60 ,'' ,16 ,ASSET_FONT_MINECRAFTIA) );
			this.panel.add(this.words[i]);
			this.words[i].align = 'center';
			this.words[i].center();
			this.words[i].x = 40 + i * 140;
		}

		this.refresh();

		gameEvents.on(EVENT_NEXT_WORD ,this.onNextWord.bind(this));
	},

	/* get latest upcoming words from validator and change text values */
	refresh: function() {
		let upcomingWords = validator_instance.getUpcomingWords(UI_UPCOMING_CONCURRENT);

		for (var i = 0; i < upcomingWords.length; i++) {
			this.words[i].value = upcomingWords[i];
			this.words[i].center();
			this.words[i].x = 40 + i * 140;
		}

		// catch end of text
		for (var i = upcomingWords.length; i <= UI_UPCOMING_CONCURRENT; i++) {
			this.words[i].value = '';
		}
	},

	onNextWord: function() {
		this.refresh();

		// bump panel left
		this.panel.x = GAME_WIDTH*0.222; //reset pos: avoid stuck-in-tween bug
		let bump = game.add.tween(this.panel);
		bump.to({ x:GAME_WIDTH*0.222-2 } ,30 ,Phaser.Easing.Bounce.In);
		bump.yoyo(true ,30);
		bump.start();
	}
};

var UI_writtenText = {
	create: function() {
		this.resized = false;
		
		slickUI.add(this.panel = new SlickUI.Element.Panel(5 ,5 ,GAME_WIDTH*0.775 ,game.height - 400 ,'' ,20));
		this.panel.add(this.text = new SlickUI.Element.Text(0,0,'BEGIN TYPING TO START',48,ASSET_FONT_MINECRAFTIA)).center();

		this.firstPress = false;

		gameEvents.on(EVENT_KEYPRESS ,this.onKeyPress.bind(this));
		gameEvents.on(EVENT_KEYPRESS_WRONG ,this.onKeyPressWrong.bind(this));
		gameEvents.on(EVENT_KEYPRESS_CORRECT ,this.onKeyPressCorrect.bind(this));
	},

	/* Event handlers */
	/* +++++++++++++ */
	onKeyPress: function(key) {
		// replace start message with input
		if (!this.firstPress) {
			this.firstPress = true;
			this.text.value = '';
			this.panel.add(this.text = new SlickUI.Element.Text(0 ,0 ,'' ,20 ,ASSET_FONT_PARPG)).center();
		}

		// resize text to delay overflow
		if ((this.text.value.length > 485) && (!this.resized)) {
			this.resized = true;
			let cache = this.text.value;
			this.text.value = '';
			this.panel.add(this.text = new SlickUI.Element.Text(0 ,0 ,cache ,14 ,ASSET_FONT_PARPG)).center();
		}

		// update text
		let symbol = key.getSymbol();	
		let val = ((symbol === ' ') ? ' [_] ' : symbol);
		this.text.value += symbol;
		this.text.center();
	},

	onKeyPressWrong: function() {
		// bump panel right
		this.panel.x = 5; //reset pos: avoid stuck-in-tween bug
		let bump = game.add.tween(this.panel);
		bump.to({ x:5+2 } ,20 ,Phaser.Easing.Bounce.In);
		bump.yoyo(true ,20);
		bump.start();
	},

	onKeyPressCorrect: function() {
		// bump panel down
		this.panel.y = 5; //reset pos: avoid stuck-in-tween bug
		let bump = game.add.tween(this.panel);
		bump.to({ y:5+2 } ,1 ,Phaser.Easing.Bounce.In);
		bump.yoyo(true ,1);
		bump.start();
	}
};

var UI_currentSymbol = {
	create: function() {
		// generate UI
		slickUI.add(this.panel = new SlickUI.Element.Panel(220 ,245 ,56 ,56));
		this.panel.add(this.sprite = new SlickUI.Element.DisplayObject(0 ,0 ,game.make.sprite(0 ,0 ,ASSET_SPRITE_KEY_CURRENT)));
		this.panel.add(this.text = new SlickUI.Element.Text(0 ,0 ,'' ,16 ,ASSET_FONT_MINECRAFTIA));

		// subscriptions
		gameEvents.on(EVENT_NEXT_SYMBOL ,this.onNextSymbol.bind(this));
		gameEvents.on(EVENT_KBMYPOSNEXT ,this.onKBMyPosNext.bind(this));

		// init game start state
		let firstSymbol = validator_instance.getCurrentSymbol();
		this.onNextSymbol(firstSymbol.toString());
		gameEvents.emit(EVENT_NEXT_SYMBOL + '#' + firstSymbol.toString());
	},

	/* Event handlers */
	/* +++++++++++++ */
	onNextSymbol: function(symbol) {
		let displaySymbol = symbol;
		
		if (symbol === ' ') {
			displaySymbol = '[_]';
		} else if (symbol === ',') {
			displaySymbol = '[,]';
		} else if (symbol === '.') {
			displaySymbol = '[.]';
		}

		this.text.value = displaySymbol;
		this.text.center();
	},

	onKBMyPosNext: function(pos) {
		// move panel to target pos
		let move = game.add.tween(this.panel);
		move.to(pos ,100 ,Phaser.Easing.Bounce.In);
		move.start();
	}
};

var UI_keyboard = {
	create: function() {
		this.x = 60;
		this.y = 330;
		this.keySize = 56;
		this.keyOffsetX = this.keySize + 8;
		this.keyOffsetY = this.keySize + 10;
		this.keys = [];

		this.rowOffset = 0;
		this.row = 0;
		this.col = 0;

		/* generate each key, adjust offsets */
		// 1st row: numbers / special symbols
		this.addKey(this.x + this.rowOffset + this.keyOffsetX*this.col ,this.y + this.keyOffsetY*this.row ,this.keySize ,'1' ,'!'); this.col++;
		this.addKey(this.x + this.rowOffset + this.keyOffsetX*this.col ,this.y + this.keyOffsetY*this.row ,this.keySize ,'2' ,'"'); this.col++;
		this.addKey(this.x + this.rowOffset + this.keyOffsetX*this.col ,this.y + this.keyOffsetY*this.row ,this.keySize ,'3' ,'§'); this.col++;
		this.addKey(this.x + this.rowOffset + this.keyOffsetX*this.col ,this.y + this.keyOffsetY*this.row ,this.keySize ,'4' ,'$'); this.col++;
		this.addKey(this.x + this.rowOffset + this.keyOffsetX*this.col ,this.y + this.keyOffsetY*this.row ,this.keySize ,'5' ,'%'); this.col++;
		this.addKey(this.x + this.rowOffset + this.keyOffsetX*this.col ,this.y + this.keyOffsetY*this.row ,this.keySize ,'6' ,'&'); this.col++;
		this.addKey(this.x + this.rowOffset + this.keyOffsetX*this.col ,this.y + this.keyOffsetY*this.row ,this.keySize ,'7' ,'/'); this.col++;
		this.addKey(this.x + this.rowOffset + this.keyOffsetX*this.col ,this.y + this.keyOffsetY*this.row ,this.keySize ,'8' ,'('); this.col++;
		this.addKey(this.x + this.rowOffset + this.keyOffsetX*this.col ,this.y + this.keyOffsetY*this.row ,this.keySize ,'9' ,')'); this.col++;
		this.addKey(this.x + this.rowOffset + this.keyOffsetX*this.col ,this.y + this.keyOffsetY*this.row ,this.keySize ,'0' ,'='); this.col++;
		this.addKey(this.x + this.rowOffset + this.keyOffsetX*this.col ,this.y + this.keyOffsetY*this.row ,this.keySize ,'ß' ,'?'); this.col=0;
		
		// 2nd row: qwer..
		this.row++;
		this.rowOffset = this.keySize/2;
		this.addKey(this.x + this.rowOffset + this.keyOffsetX*this.col ,this.y + this.keyOffsetY*this.row ,this.keySize ,'q' ,'Q'); this.col++;
		this.addKey(this.x + this.rowOffset + this.keyOffsetX*this.col ,this.y + this.keyOffsetY*this.row ,this.keySize ,'w' ,'W'); this.col++;
		this.addKey(this.x + this.rowOffset + this.keyOffsetX*this.col ,this.y + this.keyOffsetY*this.row ,this.keySize ,'e' ,'E'); this.col++;
		this.addKey(this.x + this.rowOffset + this.keyOffsetX*this.col ,this.y + this.keyOffsetY*this.row ,this.keySize ,'r' ,'R'); this.col++;
		this.addKey(this.x + this.rowOffset + this.keyOffsetX*this.col ,this.y + this.keyOffsetY*this.row ,this.keySize ,'t' ,'T'); this.col++;
		this.addKey(this.x + this.rowOffset + this.keyOffsetX*this.col ,this.y + this.keyOffsetY*this.row ,this.keySize ,'z' ,'Z'); this.col++;
		this.addKey(this.x + this.rowOffset + this.keyOffsetX*this.col ,this.y + this.keyOffsetY*this.row ,this.keySize ,'u' ,'U'); this.col++;
		this.addKey(this.x + this.rowOffset + this.keyOffsetX*this.col ,this.y + this.keyOffsetY*this.row ,this.keySize ,'i' ,'I'); this.col++;
		this.addKey(this.x + this.rowOffset + this.keyOffsetX*this.col ,this.y + this.keyOffsetY*this.row ,this.keySize ,'o' ,'O'); this.col++;
		this.addKey(this.x + this.rowOffset + this.keyOffsetX*this.col ,this.y + this.keyOffsetY*this.row ,this.keySize ,'p' ,'P'); this.col++;
		this.addKey(this.x + this.rowOffset + this.keyOffsetX*this.col ,this.y + this.keyOffsetY*this.row ,this.keySize ,'ü' ,'Ü'); this.col=0;
		
		// 3rd row: asdf...
		this.row++;
		this.rowOffset += this.keySize/4;
		this.addKey(this.x + this.rowOffset + this.keyOffsetX*this.col ,this.y + this.keyOffsetY*this.row ,this.keySize ,'a' ,'A'); this.col++;
		this.addKey(this.x + this.rowOffset + this.keyOffsetX*this.col ,this.y + this.keyOffsetY*this.row ,this.keySize ,'s' ,'S'); this.col++;
		this.addKey(this.x + this.rowOffset + this.keyOffsetX*this.col ,this.y + this.keyOffsetY*this.row ,this.keySize ,'d' ,'D'); this.col++;
		this.addKey(this.x + this.rowOffset + this.keyOffsetX*this.col ,this.y + this.keyOffsetY*this.row ,this.keySize ,'f' ,'F'); this.col++;
		this.addKey(this.x + this.rowOffset + this.keyOffsetX*this.col ,this.y + this.keyOffsetY*this.row ,this.keySize ,'g' ,'G'); this.col++;
		this.addKey(this.x + this.rowOffset + this.keyOffsetX*this.col ,this.y + this.keyOffsetY*this.row ,this.keySize ,'h' ,'H'); this.col++;
		this.addKey(this.x + this.rowOffset + this.keyOffsetX*this.col ,this.y + this.keyOffsetY*this.row ,this.keySize ,'j' ,'J'); this.col++;
		this.addKey(this.x + this.rowOffset + this.keyOffsetX*this.col ,this.y + this.keyOffsetY*this.row ,this.keySize ,'k' ,'K'); this.col++;
		this.addKey(this.x + this.rowOffset + this.keyOffsetX*this.col ,this.y + this.keyOffsetY*this.row ,this.keySize ,'l' ,'L'); this.col++;
		this.addKey(this.x + this.rowOffset + this.keyOffsetX*this.col ,this.y + this.keyOffsetY*this.row ,this.keySize ,'ö' ,'Ö'); this.col++;
		this.addKey(this.x + this.rowOffset + this.keyOffsetX*this.col ,this.y + this.keyOffsetY*this.row ,this.keySize ,'ä' ,'Ä'); this.col=0;
		
		// 4th row: yxcv..
		this.row++;
		this.rowOffset += this.keySize/2;
		this.addKey(this.x + this.rowOffset + this.keyOffsetX*this.col ,this.y + this.keyOffsetY*this.row ,this.keySize ,'y' ,'Y'); this.col++;
		this.addKey(this.x + this.rowOffset + this.keyOffsetX*this.col ,this.y + this.keyOffsetY*this.row ,this.keySize ,'x' ,'X'); this.col++;
		this.addKey(this.x + this.rowOffset + this.keyOffsetX*this.col ,this.y + this.keyOffsetY*this.row ,this.keySize ,'c' ,'C'); this.col++;
		this.addKey(this.x + this.rowOffset + this.keyOffsetX*this.col ,this.y + this.keyOffsetY*this.row ,this.keySize ,'v' ,'V'); this.col++;
		this.addKey(this.x + this.rowOffset + this.keyOffsetX*this.col ,this.y + this.keyOffsetY*this.row ,this.keySize ,'b' ,'B'); this.col++;
		this.addKey(this.x + this.rowOffset + this.keyOffsetX*this.col ,this.y + this.keyOffsetY*this.row ,this.keySize ,'n' ,'N'); this.col++;
		this.addKey(this.x + this.rowOffset + this.keyOffsetX*this.col ,this.y + this.keyOffsetY*this.row ,this.keySize ,'m' ,'M'); this.col++;
		this.addKey(this.x + this.rowOffset + this.keyOffsetX*this.col ,this.y + this.keyOffsetY*this.row ,this.keySize ,',' ,';'); this.col++;
		this.addKey(this.x + this.rowOffset + this.keyOffsetX*this.col ,this.y + this.keyOffsetY*this.row ,this.keySize ,'.' ,':'); this.col++;
		this.addKey(this.x + this.rowOffset + this.keyOffsetX*this.col ,this.y + this.keyOffsetY*this.row ,this.keySize ,'-' ,'_'); this.col=0;

		// spacebar
		this.row++;
		this.addKey(this.x + this.rowOffset + this.keyOffsetX*2 ,this.y + this.keyOffsetY*this.row ,this.keySize ,' ' ,' ', true);

		gameEvents.on(EVENT_KEYPRESS, this.onKeyPress.bind(this));
		gameEvents.on(EVENT_NEXT_SYMBOL, this.onNextSymbol.bind(this));

		gameEvents.emit(EVENT_NEXT_SYMBOL ,validator_instance.getCurrentSymbol());
	},

	/* Properties */
	/* +++++++++ */
	addKey: function(x ,y ,keySize ,symbolLow ,symbolCap ,isSpace) {
		if (isSpace === undefined) isSpace = false;
		if (isSpace) {
			this.keys.push(new UI_Key_Space(x ,y ,keySize));
			return;
		}
		this.keys.push(new UI_Key(x ,y ,keySize ,symbolLow ,symbolCap ,isSpace));
	},

	onKeyPress: function(key) {
		gameEvents.emit(EVENT_KEYPRESS + '#' + key.getSymbol() ,key);
	},

	onNextSymbol: function(symbol) {
		gameEvents.emit(EVENT_NEXT_SYMBOL + '#' + symbol ,symbol);
	}
};

/* ++++++++ */
/* Components - Classes */
class UI_Key {
	constructor(x ,y ,size ,symbolLow ,symbolCap) {
		this.x = x;
		this.y = y;
		this.size = size;
		this.symbolLow = symbolLow;
		this.symbolCap = symbolCap;
		this.symbol = this.symbolLow;
		this.symbols = new Array(this.symbolLow, this.symbolCap);

		slickUI.add(this.panel = new SlickUI.Element.Panel(this.x ,this.y ,this.size ,this.size));
		this.panel.add(this.text = new SlickUI.Element.Text(0 ,0 ,this.symbol, 16 ,ASSET_FONT_MINECRAFTIA)).center();

		gameEvents.on(EVENT_KEYPRESS + '#' + this.symbolLow, this.onPress.bind(this));
		gameEvents.on(EVENT_KEYPRESS + '#' + this.symbolCap, this.onPress.bind(this));
		gameEvents.on(EVENT_NEXT_SYMBOL + '#' + this.symbolLow, this.onMeNext.bind(this));
		gameEvents.on(EVENT_NEXT_SYMBOL + '#' + this.symbolCap, this.onMeNext.bind(this));
	}

	/* Event handlers */
	/* +++++++++++++ */
	onPress() {
		// bump panel down
		this.panel.y = this.y; //reset pos: avoid stuck-in-tween bug
		let bump = game.add.tween(this.panel);
		bump.to({ y:this.y+5, x:this.x+2 } ,40 ,Phaser.Easing.Bounce.In);
		bump.yoyo(true ,50);
		bump.start();
	}

	onMeNext() {
		gameEvents.emit(EVENT_KBMYPOSNEXT, {x:this.x, y:this.y});
	}
}

class UI_Key_Space extends UI_Key {
	constructor (x ,y ,size) {
		super(x ,y ,size ,' ', ' ');
		this.panel.width = size*5;
		this.text.value = '[_]';
	}

	onMeNext() {
		gameEvents.emit(EVENT_KBMYPOSNEXT, {x:this.x + this.size*2.2 ,y:this.y-5});
	}
}