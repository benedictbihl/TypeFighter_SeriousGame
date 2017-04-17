/**
 * Created by Marlon on 08.03.2017.
 */

/* ++++++++++++++++++ */
/* Main Audio module */
var AUDIO = {
	load: function() {
		game.load.audio(SOUND_MUSIC, SOUND_MUSIC_PATH);

		game.load.audio(SOUND_KP1, SOUND_KP1_PATH);
		game.load.audio(SOUND_KP2, SOUND_KP2_PATH);
		game.load.audio(SOUND_KP3, SOUND_KP3_PATH);

		game.load.audio(SOUND_WRONG, SOUND_WRONG_PATH);
		game.load.audio(SOUND_COMBOUP, SOUND_COMBOUP_PATH);
		game.load.audio(SOUND_COMBODROP, SOUND_COMBODROP_PATH);
		game.load.audio(SOUND_SCOREUP, SOUND_SCOREUP_PATH);
		
		game.load.audio(SOUND_END, SOUND_END_PATH);
	},

	init_Game: function() {
		instance = this;

		// add sounds to game
		this.sound_Wrong = game.add.audio(SOUND_WRONG);
		this.sound_comboUp = game.add.audio(SOUND_COMBOUP, 0.5);
		this.sound_comboDrop = game.add.audio(SOUND_COMBODROP, 0.6);
		this.sound_scoreUp = game.add.audio(SOUND_SCOREUP, 0.3);
		// -- array for keypress randomisation
		this.sounds_kp = [];
		this.sounds_kp.push( this.sound_kp1 = game.add.audio(SOUND_KP1) );
		this.sounds_kp.push( this.sound_kp2 = game.add.audio(SOUND_KP2) );
		this.sounds_kp.push( this.sound_kp3 = game.add.audio(SOUND_KP3) );

		// event subscriptions
		gameEvents.on(EVENT_KEYPRESS, this.onKeyPress.bind(this));
		gameEvents.on(EVENT_KEYPRESS_WRONG, this.onKeyPressWrong.bind(this));
		gameEvents.on(EVENT_SCORE_COMBOUP, this.onComboUp.bind(this));
		gameEvents.on(EVENT_SCORE_COMBODROP, this.onComboDrop.bind(this));
		gameEvents.on(EVENT_SCORE_SCORE, this.onScoreUp.bind(this));
		return instance;
	},

	init_End: function() {
		instance = this;

		// play transition sound
		this.sound_end = game.add.audio(SOUND_END);
		this.sound_end.play();

		// start music
		this.music = game.add.audio(SOUND_MUSIC, 0.65, true);
		this.music.play();


		return instance;
	},

	/* Event handlers */
	/* +++++++++++++ */
	onKeyPress: function() {
		this.sounds_kp[Math.floor(Math.random()*this.sounds_kp.length)].play();
	},

	onKeyPressWrong: function() {
		this.sound_Wrong.play();
	},

	onComboUp: function() {
		this.sound_comboUp.play();
	},

	onComboDrop: function() {
		this.sound_comboDrop.play();
	},

	onScoreUp: function() {
		this.sound_scoreUp.play();
	}
}