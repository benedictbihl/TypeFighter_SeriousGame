/**
 * Created by Marlon on 08.03.2017.
 */

/* Game public objects */
var game;
var validator_instance;
var tracker_instance;
var ui_instance;
var audio_instance;


/* Game States */
const STATE_PLAY = 'STATE_PLAY';
const STATE_END = 'STATE_END';


/* UI */
const GAME_WIDTH = 1136;
const GAME_HEIGHT = 640;
const UI_UPCOMING_CONCURRENT = 4;


/* Assets */
const KENNEY_JSON = 'assets/kenney-theme/kenney.json';

const ASSET_FONT_PARPG_BMP = 'assets/font/bmp/PARPG.png';
const ASSET_FONT_PARPG_XML = 'assets/font/bmp/PARPG.xml';
const ASSET_FONT_PARPG = 'ASSET_FONT_PARPG';

const ASSET_FONT_MINECRAFTIA_BMP = 'assets/font/bmp/Minecraftia.png';
const ASSET_FONT_MINECRAFTIA_XML = 'assets/font/bmp/Minecraftia.xml';
const ASSET_FONT_MINECRAFTIA = 'ASSET_FONT_MINECRAFTIA';

const ASSET_SPRITE_KEY = 'ASSET_SPRITE_KEY';
const ASSET_SPRITE_KEY_PATH = 'assets/kenney-theme/images/grey_button12.png';
const ASSET_SPRITE_KEY_CURRENT = 'ASSET_SPRITE_KEY_CURRENT'
const ASSET_SPRITE_KEY_CURRENT_PATH = 'assets/kenney-theme/images/yellow_button12.png';
const ASSET_SPRITE_KEY_LAST = 'ASSET_SPRITE_KEY_LAST';
const ASSET_SPRITE_KEY_LAST_PATH = 'assets/kenney-theme/images/blue_button12.png';

const ASSET_SPRITE_SPC = 'ASSET_SPRITE_SPC';
const ASSET_SPRITE_SPC_PATH = 'assets/kenney-theme/images/grey_button03.png';
const ASSET_SPRITE_SPC_CURRENT = 'ASSET_SPRITE_SPC_CURRENT';
const ASSET_SPRITE_SPC_CURRENT_PATH = 'assets/kenney-theme/images/yellow_button03.png';
const ASSET_SPRITE_SPC_LAST = 'ASSET_SPRITE_SPC_LAST';
const ASSET_SPRITE_SPC_LAST_PATH = 'assets/kenney-theme/images/blue_button03.png';

/* Assets - Audio */
const SOUND_MUSIC_PATH = 'assets/assets/sfx/music.mp3';
const SOUND_MUSIC = 'SOUND_MUSIC';
const SOUND_KP1_PATH = 'assets/assets/sfx/keypress/kp2.wav';
const SOUND_KP1 = 'SOUND_KP1';
const SOUND_KP2_PATH = 'assets/assets/sfx/keypress/kp3.wav';
const SOUND_KP2 = 'SOUND_KP2';
const SOUND_KP3_PATH = 'assets/assets/sfx/keypress/kp4.wav';
const SOUND_KP3 = 'SOUND_KP3';
const SOUND_WRONG_PATH = 'assets/assets/sfx/ding1.wav';
const SOUND_WRONG = 'SOUND_WRONG';
const SOUND_COMBOUP_PATH = 'assets/assets/sfx/increase2.ogg';
const SOUND_COMBOUP = 'SOUND_COMBOUP';
const SOUND_COMBODROP_PATH = 'assets/assets/sfx/win.ogg';
const SOUND_COMBODROP = 'SOUND_COMBODROP';
const SOUND_SCOREUP_PATH = 'assets/assets/sfx/affirm.ogg';
const SOUND_SCOREUP = 'SOUND_SCOREUP';
const SOUND_END_PATH = 'assets/assets/sfx/glitchsplosion.ogg';
const SOUND_END = 'SOUND_END';


/* Game Events */
const EVENT_NEXT_WORD = 'EVENT_NEXT_WORD';
const EVENT_NEXT_SYMBOL = 'EVENT_NEXT_SYMBOL';
const EVENT_REGISTERKEYPRESS = 'EVENT_REGISTERKEYPRESS';
const EVENT_KEYPRESS = 'EVENT_KEYPRESS';
const EVENT_KEYPRESS_WRONG = 'EVENT_KEYPRESS_WRONG';
const EVENT_KEYPRESS_CORRECT = 'EVENT_KEYPRESS_CORRECT';
const EVENT_TEXT_COMPLETE = 'EVENT_TEXT_COMPLETE';
const EVENT_GAME_END = 'EVENT_GAME_END';
const EVENT_SCORE_SCORE = 'EVENT_SCORE_SCORE';
const EVENT_SCORE_COMBOUP = 'EVENT_SCORE_COMBOUP';
const EVENT_SCORE_COMBODROP = 'EVENT_SCORE_COMBODRUP';
const EVENT_SCORE_DOWN = 'EVENT_SCORE_DOWN';
const EVENT_KBMYPOSNEXT = 'EVENT_KBMYPOSNEXT';
const EVENT_KBSETUPDONE = 'EVENT_KBSETUPDONE';


/* Mechanic Params */
const SCORE_BASE_INC = 100;
const SCORE_MULTIPLIER_INC = 0.25;