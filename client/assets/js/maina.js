
/* 
- Author : Charlou Nicolas.
-
-
*/


   
window.onload = function () {

    var game, socket;

    var _gameW = 0, 
        _gameH = 0;
   
    var form = document.getElementById ('myForm');

    form.onsubmit = function ( e ) {

        e.preventDefault();

        document.getElementById('game_login').style.display = 'none';
        document.getElementById('game_div').style.display = 'block';
        
        enterGame ();
        
    }

    readDeviceOrientation();

    this.addEventListener("orientationchange", function() {
        readDeviceOrientation()
    });

    function readDeviceOrientation () {

        if ( window.orientation == undefined ) return;

        var portrait = Math.abs ( window.orientation) == 90;

        var btn_enter =  document.getElementById('btnEnter');

        btn_enter.disabled = ( portrait ) ? true : false; 

        var message_div =  document.getElementById('messageDiv');

        message_div.innerHTML = ( !portrait ) ? '' : '<small>Please set device orientation to portrait.</small>';

    }

    function enterGame () {

        var maxW = 720;

        var container = document.getElementById('game_container');

        var contW = container.clientWidth,
            contH = container.clientHeight;

        var tmpWidth = contW > maxW ? maxW : contW,
            tmpHeight = Math.ceil(tmpWidth * 16/9);

        console.log ( contW, contH );

        var gameH = 0, gameW = 0;

        if ( tmpHeight >= contH ) {

            gameH = contH;
            gameW = Math.ceil(gameH * 9/16);

            console.log ( 'game dimensions adjusted by screen height' )

        }else {

            gameW = tmpWidth;
            gameH = tmpHeight;
            console.log ( 'game dimensions adjusted by screen width' )
        }

        var game_div = document.getElementById('game_div');
        game_div.style.width = gameW + 'px';
        game_div.style.height = gameH + 'px';
        //game_div.style.overflow = 'hidden'
        
        _gameW = gameW;
        _gameH = gameH;

        console.log ('dimensions : ', _gameW, _gameH );

        var config = {

            type: Phaser.AUTO,
            width: gameW,
            height: gameH,
            backgroundColor: '#dedede',
            audio: {
                disableWebAudio: false
            },
            parent:'game_div',
            physics : {
                default : 'arcade',
                arcade : {
                    debug : false,
                    gravity: { y: 200 }
                }
            },
            scene: [ SceneA, SceneB ]

        };

        game = new Phaser.Game(config);

        //socket = io();

        //socket.emit ('initUser', username.value );

    }

    var SceneA = new Phaser.Class({

        Extends: Phaser.Scene,

        initialize:

        function SceneA ()
        {
            Phaser.Scene.call(this, { key: 'sceneA' });
        },

        preload: function ()
        {
        //...

            var _this = this;
            
            var txtConfig =  { 
                color: '#000', 
                fontSize: Math.floor ( 30 * _gameH/1280 ),
                fontFamily : 'Coda'
            };
            this.loadtxt = this.add.text (_gameW/2, _gameH/2, 'Loading Files..', txtConfig ).setOrigin(0.5);

            this.chalTxt = this.add.text ( _gameW/2, _gameH *  0.95, '@chalnicol', { color:'gray', fontSize: Math.floor ( 30 * _gameH/1280 ), fontFamily:'Oswald' } ).setOrigin(0.5);

            this.load.audioSprite('sfx', 'client/assets/sfx/fx_mixdown.json', [
                'client/assets/sfx/sfx.ogg',
                'client/assets/sfx/sfx.mp3'
            ]);
            this.load.audio ('bgsound', [ 'client/assets/sfx/drumsofwar.ogg', 'client/assets/sfx/drumsofwar.mp3'] );
            this.load.audio ('bingosound', [ 'client/assets/sfx/bingosound.ogg', 'client/assets/sfx/bingosound.mp3'] );
       
    
            this.load.image ('footer', 'client/assets/images/scenea/footer.png');
            this.load.image ('lotto_bg', 'client/assets/images/scenea/lotto_bg.png');
            this.load.image ('select', 'client/assets/images/scenea/select.png');
            this.load.image ('title', 'client/assets/images/scenea/title.png');

            this.load.spritesheet('lotto_btns', 'client/assets/images/scenea/buttons_menu1.png', { frameWidth: 210, frameHeight: 210 });
            

            this.load.image ('suction', 'client/assets/images/sceneb/suction.png');
            this.load.image ('imgCircle', 'client/assets/images/sceneb/circle.png');
            this.load.image ('imgCircle2', 'client/assets/images/sceneb/circle2.png');
            
            this.load.image ('ticketbg', 'client/assets/images/sceneb/ticket_bg.png');
            this.load.image ('keys_panel', 'client/assets/images/sceneb/keys_panel.png');
            this.load.image ('winpanel', 'client/assets/images/sceneb/winpanel.png');

            this.load.spritesheet('circle_keys', 'client/assets/images/sceneb/circle_keys.png', { frameWidth: 78, frameHeight: 78 });

            //594 x 110 == 580 x 94
            this.load.spritesheet('control_btns', 'client/assets/images/sceneb/control_btns.png', { frameWidth: 594, frameHeight: 110 });

            //144 x 67 == 144 x 50
            this.load.spritesheet('back_btn', 'client/assets/images/sceneb/back_btn.png', { frameWidth: 144, frameHeight: 67 });

            this.load.spritesheet('control_keys', 'client/assets/images/sceneb/keyboard_btns.png', { frameWidth: 168, frameHeight: 65 });
            
            this.load.spritesheet('lotto_balls', 'client/assets/images/scenec/lotto_anim.png', { frameWidth: 50, frameHeight: 50 });

            this.load.on('progress', function (value) {
                var perc = Math.floor ( value * 100 );
                _this.loadtxt.text = 'Loading Files.. ' + perc + '%';
            });

            this.load.on('complete', function () {
                _this.loadtxt.destroy();
            });

        },
        create: function ()
        {

            this.loadtxt.destroy();

            this.initializeSound();

            this.initGraphics ();

            this.initMenu ();


        },
        initializeSound :  function () {

            this.music = this.sound.addAudioSprite('sfx');

            this.bgmusic = this.sound.add('bgsound').setVolume(0.1).setLoop(true);

            this.bgmusic.play();
        }, 
        initGraphics : function () {

            var img = this.add.image (0,0,'lotto_bg').setScale( _gameW/720 ).setOrigin(0);

            var title = this.add.image (0, -_gameH*0.25,'title').setScale( _gameW/720 ).setOrigin(0);

            this.tweens.add ({
                targets : title,
                y : 0,
                duration : 800,
                ease : 'Bounce',
                easeParams : [0.5, 1],
                //delay : 300
            });

            var select = this.add.image ( 0, 0,'select').setScale( _gameW/720 ).setOrigin(0).setAlpha(0);

            this.tweens.add ({
                targets : select,
                alpha : 1,
                duration : 800,
                ease : 'Power3',
                easeParams : [0.5, 1],
                delay : 1000
            });


        },
        initMenu : function () {

            var butsArr = [ 
                { 'text' : '6/42', 'value' : 42, 'desc' : 'Lotto' }, 
                { 'text' : '6/45', 'value' : 45, 'desc' : 'Mega Lotto' }, 
                { 'text' : '6/49', 'value' : 49, 'desc' : 'Super Lotto' }, 
                { 'text' : '6/55', 'value' : 55, 'desc' : 'Grand Lotto' }, 
                { 'text' : '6/58', 'value' : 58, 'desc' : 'Ultra Lotto' }, 
            ];

            this.menu = [];
          
            var btsz = Math.floor ( 195 * _gameW/720 )
                btspx = Math.floor ( 102 * _gameW/720 ),
                btspy = Math.floor (  35 * _gameH/1280 ),
                btx = Math.floor ( 114 * _gameW/720 ),
                bty = Math.floor ( 420 * _gameH/1280 );

            var cols = 2;

            var _this = this;

            for ( var i = 0; i < 5; i++) {

                var ix = Math.floor ( i/cols ), iy = i%cols;

                var xp = btx + iy * ( btsz + btspx ) + (btsz/2),
                    yp =  bty + ix * ( btsz + btspy ) + (btsz/2);

                var menu_btn = this.add.container (xp + _gameW, yp )

                var img = this.add.image ( 0,0, 'lotto_btns', 0 ).setScale( _gameW/720 ).setData ('id', i).setInteractive();

                img.on ( 'pointerover', function () {
                    this.setFrame ( 1 );
                });
                img.on ( 'pointerup', function () {
                    this.setFrame ( 0 );
                });
                img.on ( 'pointerout', function () {
                    this.setFrame ( 0 );
                });
                img.on ( 'pointerdown', function () {
                    
                    _this.music.play ('clickb');

                    _this.bgmusic.stop();

                    _this.scene.start ('sceneB', butsArr [ this.getData('id') ] );

                });

                var txt = this.add.text ( 0, 0, butsArr[i].text, { color:"#fff", fontFamily:'Coda', fontSize: Math.floor (45 * _gameH/1280 )} ).setOrigin (0.5);
                txt.setShadow (0, 2, '#6e6e6e', 2 )


                menu_btn.add ( [img, txt] );

                this.tweens.add ({
                    targets : menu_btn,
                    x : xp,
                    duration : 300,
                    ease : 'Power2',
                    easeParams : [ 0.5, 1 ],
                    delay : (i * 100) + 1500
                });

                //this.menu.push ( menu_btn );

            }
           
           

        }

        
    });

    var SceneB = new Phaser.Class({

        Extends: Phaser.Scene,

        initialize:

        function SceneB ()
        {
            Phaser.Scene.call(this, { key: 'sceneB' });
        },
        init: function (data) {

            this.gameData = data;

            this.buttons = [];

            this.keyBoardElements = [];

            this.dataCombi = [];

            this.winningCombo = [];
            
            this.circs = [];
            
            this.isStartPlaying = false;

            this.ticketData = {};

        },
        preload: function ()
        {
            //...
        },
        create: function ()
        {

            this.initSound();

            this.initTicket ();

            this.initButtons ();

        },
        update : function () {

            if ( this.isStartPlaying ) {

                var eW = this.containerData.w,
                    eH = this.containerData.h,
                    eX = this.containerData.x,
                    eY = this.containerData.y;
                    
                var vel = Math.floor ( 15 * _gameW/720 );

                for ( var i in this.circs ) {

                    var circ = this.circs[i];

                    if ( !circ.isCaptured ) {

                        circ.x = circ.x + Math.sin ( circ.txtRotation ) * vel;
                        circ.y = circ.y + Math.cos ( circ.txtRotation ) * vel;
                        
                        var left = eX + circ.rad,
                            right = eX + eW - circ.rad,
                            top = eY + circ.rad,
                            bot = eY + eH - circ.rad ;


                        if ( circ.x <= left ) {
                            circ.x = left;
                            circ.txtRotation = ( Math.PI/180 * (Math.floor(Math.random() * 360 )));
                        }
                        if ( circ.x >= right ) {
                            circ.x = right;
                            circ.txtRotation = ( Math.PI/180 * (Math.floor(Math.random() * 360 )));
                        }
                        if ( circ.y <= top ) {
                            circ.y= top;
                            circ.txtRotation = ( Math.PI/180 * (Math.floor(Math.random() * 360 )));
                        }
                        if ( circ.y >= bot ) {
                            circ.y = bot;
                            circ.txtRotation = ( Math.PI/180 * (Math.floor(Math.random() * 360 )));
                        }

                    }

                }

            }

            if ( this.toCapture ) {

                //console.log ('..');
                var teW = this.containerData.w,
                    teH = this.containerData.h,
                    teX = this.containerData.x,
                    teY = this.containerData.y;

                var seS = teW * 0.25,
                    seX = teX + ( teW - seS ) /2,
                    seY = teY + teH * 0.34;

                var isHit = this.getHit ( seX, seY, seS, seS );

                if ( isHit != '' ) {

                    this.toCapture = false;

                    this.animateUp ( isHit );
                    
                }

            }


        },
        initSound: function () {

            this.music = this.sound.addAudioSprite('sfx').setVolume (0.8);

            this.bingosound = this.sound.add('bingosound').setVolume(0.2).setLoop(true);

            this.bgmusic = this.sound.add('bgsound').setVolume(0.1).setLoop(true);

            //this.bgmusic.play();
        },
        initTicket : function () {

            var img = this.add.image (0, 0,'lotto_bg').setScale( _gameW/720 ).setOrigin(0);

            var ticketbg = this.add.image (0, 0,'ticketbg').setScale( _gameW/720 ).setOrigin(0);

            var txtConfig = { 
                fontFamily: 'Coda', 
                fontSize: Math.floor( 60 * _gameH/1280 ), 
                color: '#ffffff' 
            };

            var txt = this.add.text ( _gameW/2, Math.floor (195*_gameH/1280), this.gameData.text, txtConfig).setOrigin (0.5);

            var captionTxtConfig = { 
                fontFamily: 'Oswald', 
                fontSize: Math.floor( 30 * _gameH/1280 ), 
                color: '#ffffff' 
            };

            var txta = this.add.text ( _gameW/2, Math.floor (247*_gameH/1280), this.gameData.desc, captionTxtConfig).setOrigin (0.5);

            
        },
        initButtons : function () {

            this.buttons = [];

            var _this = this;

            //back btn...
            var backx = Math.floor( 60 * _gameW/720 ),
                backy = Math.floor( 45 * _gameH/1280 );

            var back_btn = this.add.image ( backx, backy, 'back_btn', 0 ).setOrigin(0).setScale(_gameW/720).setInteractive();

            back_btn.on ('pointerover', function () {
                this.setFrame(1);
            });
            back_btn.on ('pointerup', function () {
                this.setFrame(0);
            });
            back_btn.on ('pointerout', function () {
                this.setFrame(0);
            });
            back_btn.on ('pointerdown', function () {
                this.setFrame (2);
                _this.leaveScene ();

            });


            var buttonsArr = [{ id:'addentry', txt: 'Add Entry'}, { id:'playlotto', txt: 'Play Lotto'}];

            var btx = _gameW/2,
                bth = Math.floor ( 110 * _gameH/1280 ),
                bts = bth * 0.03,
                bty =  Math.floor ( 1018 * _gameH/1280 );

            for ( var i=0; i < buttonsArr.length; i++ ) {
                
                var yp = bty + (i*(bth + bts));

                var miniContainer = this.add.container ( btx, yp );

                var buts = this.add.image ( 0, 0, 'control_btns', 0 ).setScale( _gameW/720 ).setInteractive().setData( 'id', buttonsArr[i].id );
                
                buts.on ('pointerover', function () {
                  
                    this.setFrame(1);
                });
                buts.on ('pointerup', function () {
                    this.setFrame(0);
                });
                buts.on ('pointerout', function () {
                    this.setFrame(0);
                });
                buts.on ( 'pointerdown', function () {

                  
                    _this.music.play ('clickb', { volume : 0.5 });

                    switch ( this.getData('id') ) {

                        case 'addentry':
                            
                            _this.initKeyBoard();

                        break;
                        case 'playlotto':

                            _this.startPlay ();

                        break;
                    
                        default:
                            //..
                        
                    }
                    
                });

                var txts = this.add.text (0, 0, buttonsArr[i].txt, { fontFamily : 'Coda', fontSize : bth * 0.35, color : '#1e1e1e' }).setOrigin(0.5);

                miniContainer.add ([buts, txts]);

                this.buttons.push (miniContainer);

            } 

            this.buttons[1].getAt(0).setFrame(2).removeInteractive();

            //this.buttons[1].setFrame();
           
        },
        clearEntries : function () {

            //..
            for ( var i in this.entryElements ) {
                this.entryElements[i].destroy();
            }
            this.entryElements = [];

            for ( var i in this.points ) {
                this.points[i].circ.destroy();
                this.points[i].txt.destroy();
                
            }
            this.points = [];

        },
        updateTicket : function () {

            this.clearEntries();

            var entries = this.dataCombi.length;

            var entriesTxtConfig = { 
                fontFamily: 'Coda', 
                fontSize: Math.floor( 35 * _gameH/1280), 
                color: '#fefefe' 
            };

            var entriesTxtConfig2 = { 
                fontFamily: 'Coda', 
                fontSize: Math.floor( 35 * _gameH/1280), 
                color: '#3a3a3a' 
            };

            var lets = 'ABCDEF';

            var cirSz =  Math.floor( 70 * _gameW/720), 
                cirSp =  Math.floor( 10 * _gameW/720),
                cirX =  Math.floor( 140 * _gameW/720);

            var compPanel_w = Math.floor( 614 * _gameW/720),
                compPanel_h = Math.floor( 90 * _gameH/1280),
                compPanel_sp = Math.floor( 5 * _gameH/1280),
                //compPanel_x = Math.floor( 54 * _gameW/720);
                compPanel_y = Math.floor( 300 * _gameH/1280);

            var let_x = Math.floor( 94 * _gameW/720), 
                lp_x = Math.floor( 610 * _gameW/720);;


            this.points = [];

            for ( var i = 0; i < entries ; i++ ) {

                var yps = compPanel_y + i * ( compPanel_h + compPanel_sp ) + compPanel_h/2;

                //var rect = this.add.rectangle ( _gameW/2, yps, compPanel_w, compPanel_h, 0xfefefe, 0.2 );
                //this.entryElements.push ( rect );

                var letTxt = this.add.text ( let_x, yps,  lets.charAt(i) + ' :', entriesTxtConfig ).setOrigin (0, 0.5);

                this.entryElements.push ( letTxt );

                if ( this.dataCombi [i].lp ) {

                    var lpTxt = this.add.text ( lp_x, yps, 'LP', entriesTxtConfig ).setOrigin (0, 0.5);
                
                    this.entryElements.push ( lpTxt );

                }
                
                var tmpArr = this.dataCombi[i].combi;

                for ( var j = 0; j < tmpArr.length ; j++ ) {

                    var xps = cirX + j * ( cirSz + cirSp) + cirSz/2;

                    var circ = this.add.circle ( xps, yps, cirSz/2, 0xfefefe, 1 );

                    this.entryElements.push ( circ );

                    var str2 = tmpArr[j] < 10 ? '0' + tmpArr[j] : tmpArr[j];

                    var txt = this.add.text ( xps, yps, str2, entriesTxtConfig2 ).setOrigin (0.5);
                
                    this.points.push ({
                        'circ' : circ,
                        'txt' : txt
                    });

                } 
                
            }

            

        },
        initKeyBoard : function () {

            var _this = this;

            var isLuckyPick = false;

            this.keys = [];

            this.tmpComb = [];

            this.bgRect = this.add.rectangle ( 0, 0, _gameW, _gameH, 0x0a0a0a, 0.7 ).setOrigin(0).setInteractive();
            this.bgRect.on('pointerdown', function () {
                _this.music.play ('clickb');
                _this.removeKeyboard();
            });

            this.entryContainer = this.add.container ( 0, _gameH );

            var keysBg = this.add.image ( 0, 0, 'keys_panel' ).setScale(_gameW/720).setOrigin(0);

            var rectT = this.add.rectangle ( 0, _gameH * 0.323, _gameW, _gameH * 0.7 ).setOrigin (0).setInteractive();

            var txta = this.add.text ( _gameW/2, _gameH *0.357, '- Select 6 Numbers -', {fontFamily:'Coda', fontSize: _gameH * 0.02, color : "#1e1e1e"}).setOrigin(0.5);

            this.entryContainer.add ([keysBg, rectT, txta]);


            //create keys...
            var total = this.gameData.value, cols = 8;

            var keyZ = Math.floor ( 75 * _gameW / 720 ),
                keyS = Math.floor ( 8 * _gameW / 720 ), 
                keyX = ( _gameW - (cols *(keyZ + keyS) - keyS) )/2,
                keyY = _gameH * 0.39;

            var txtConfig = {
                fontFamily : 'Coda',
                color : '#1e1e1e',
                fontSize : Math.floor ( keyZ * 0.45 )
            }

            for ( var i = 0; i < (total + 1) ; i++ ) {

                var ix = Math.floor ( i/cols ), iy = i%cols;

                var xp = keyX + iy * ( keyZ + keyS ) + keyZ/2,
                    yp = keyY + ix * ( keyZ + keyS ) + keyZ/2;

                var keyContainer = this.add.container (xp,yp);

                var circ = this.add.image ( 0, 0, 'circle_keys' ).setScale(_gameW/720).setInteractive().setData( {'active':false, 'cnt': i} );

                circ.on('pointerover', function () {
                    if ( !this.getData('active') )  this.setFrame(1);
                });
                circ.on('pointerout', function () {
                    if ( !this.getData('active') )  this.setFrame(0);
                });
                circ.on('pointerdown', function () {

                    var cnt = this.getData('cnt');

                    var isActive = this.getData('active');

                    if ( !isActive ) {

                        if ( _this.tmpComb.length >= 6 ) {

                            _this.music.play ('error', { volume : 0.2 } );
                            
                        }else {
                            
                            if ( cnt < total ) {

                                if ( !isLuckyPick ) {

                                    _this.tmpComb.push ( (cnt + 1) );
                            
                                    _this.music.play ('clicka', { volume : 0.1 } );

                                    this.setData ('active', true);

                                    this.setFrame (2);

                                }else {
                                    _this.music.play ('error', { volume : 0.2 } );
                                }
                                

                            }else {

                                if ( _this.tmpComb.length > 0 ) {

                                    _this.music.play ('error', { volume : 0.2 } );

                                }else {

                                    this.setData ('active', true);

                                    this.setFrame (2);

                                    isLuckyPick = true;

                                    _this.music.play ('clicka', { volume : 0.1 } );
                                }
                                //check...

                            }
                            
                           
                           
                        }

                    }else {

                        _this.music.play ('pick', { volume : 0.2 } );

                        var indx =  _this.tmpComb.indexOf ( cnt + 1 ); 

                        _this.tmpComb.splice ( indx, 1 );

                        this.setData ('active', false);

                        this.setFrame (0);

                    }

                });
                
                var str = i < total ? i+1 : 'LP';

                var txt = this.add.text ( 0, 0, str, txtConfig ).setOrigin(0.5);

                keyContainer.add ([ circ, txt ]);

                this.entryContainer.add ( keyContainer );

                this.keys.push ( keyContainer );

            }

            this.tweens.add ({
                targets : this.entryContainer,
                y : 0,
                duration : 300,
                ease : 'Power2',
                delay : 100
            });


            
            var butw = Math.floor (168 * _gameW/720),
                buth = Math.floor (65 * _gameH/1280),
                buts = butw * 0.05,
                butx =  (_gameW - ( (3 * ( butw + buts )) - buts ))/2,
                buty = _gameH * 0.95;
            
            var butArr = ['close', 'clear', 'done'];

            for ( var i = 0; i< butArr.length; i++) {

                var xp = butx + (i * ( butw + buts )) + butw/2;

                var btnContainer = this.add.container ( xp, buty );
                    
                var img = this.add.image ( 0, 0, 'control_keys', 0 ).setData( 'id', butArr[i] ).setScale( _gameW/720 ).setInteractive();

                img.on('pointerover', function () {
                    this.setFrame( 1 );
                });
                img.on('pointerout', function () {
                    this.setFrame( 0 );
                });
                img.on('pointerdown', function () {
                    switch ( this.getData('id') ) {

                        case 'close':

                            _this.music.play ('clickb', { volume : 0.5 } );

                            _this.removeKeyboard();
                           
                            break;
                        case 'clear':
                                
                            _this.music.play ('clickb', { volume : 0.5 } );

                            _this.resetKeys();
                            
                            _this.tmpComb = [];

                            isLuckyPick = false;

                            break;
                        case 'done':

                        if (isLuckyPick) {
                            _this.addUp ( true );
                            _this.removeKeyboard();
                            _this.music.play ('clickb', { volume : 0.5 } );
                        }else {
                            if (_this.tmpComb.length >= 6 ) {
                                _this.addUp (false);
                                _this.removeKeyboard();
                                _this.music.play ('clickb', { volume : 0.5 } );
                            }else {

                                _this.music.play ('error', { volume : 0.2 } );
                            }
                        }

                        

                            break;
                        default:
                            //todo..                   
                    }
                });

                var txt2 = this.add.text ( 0, 0, butArr[i], {fontFamily:'Coda', fontSize: buth * 0.4, color : "#1e1e1e"}).setOrigin(0.5);

                btnContainer.add ([img, txt2]);

                this.entryContainer.add ( btnContainer );

            } 
            
        },
        removeKeyboard : function () {

            var _this = this;

            this.tweens.add ({
                targets : this.entryContainer,
                y : _gameH,
                duration : 300,
                ease : 'Power2',
                onComplete : function () {

                    _this.bgRect.destroy();

                    _this.entryContainer.destroy ();
                }
            });

        },
        createDrawnIndicators: function () {


            this.indicatorContainer = this.add.container (0,0);

            //dark bg..
            var rectBg = this.add.rectangle ( 0, 0, _gameW, _gameH, 0x000000, 0.9 ).setOrigin(0).setInteractive();

            this.indicatorContainer.add ( rectBg );

            //add drawn number indicators
            var circD = Math.floor ( 118 * _gameW/720 ),
                circS = circD * 0.05,
                circT = 3 * (circD + circS) - circS;
                circX = ( _gameW - circT )/2 + circD/2,
                circY = _gameH * 0.13;

            var txtConfig = {
                color : '#3a3a3a',
                fontFamily : 'Coda',
                fontSize : circD *0.4,
            }

            for ( var i = 0; i < 6; i++ ) {

                var ix = Math.floor ( i/3 ), iy = i % 3;

                var xp = circX + iy * ( circD + circS ),
                    yp = circY + ix * ( circD + circS );

                var circContainer = this.add.container ( xp, yp ).setName('circe' + i);

                var circe = this.add.image ( 0, 0, 'imgCircle2').setScale ( _gameW/720 );

                var txt = this.add.text ( 0, 0, '', txtConfig ).setOrigin(0.5).setShadow( 0, 3, '#fff', 10, false, true );
         
                circContainer.add ([ circe, txt ]);

                this.indicatorContainer.add ( circContainer );

            }


        },
        createDrawBox : function () {


            var eW = _gameW * 0.6,
                eH = _gameH * 0.4,
                eX = (_gameW - eW)/2,
                eY = (_gameH - eH)/2;

            this.containerData = { 'w' : eW, 'h' : eH, 'x' : eX, 'y' : eY };

            var shape = this.make.graphics();
            shape.fillStyle(0xffffff);
            shape.beginPath();
            shape.fillRect(eX, eY, eW, eH);

            var mask = shape.createGeometryMask();

            this.drawContainer = this.add.container (0,0);

            this.drawContainer.setMask(mask);

            //boxRect
            var boxRect = this.add.rectangle ( eX, eY, eW, eH, 0xf5f5f5, 1).setStrokeStyle ( 1, 0x3a3a3a ).setOrigin (0);

            //suction..
            var suction = this.add.image ( _gameW/2, eY, 'suction'  ).setAlpha (0.9).setScale(_gameW/720).setOrigin ( 0.5, 0 );

            //loader..
            var timerprogress = this.add.rectangle ( eX, eY + (eH * 0.95) , 0, eH *0.05, 0xff3300, 0.5 ).setOrigin ( 0 ).setName('timerprogress');
            
            this.drawContainer.add ([ boxRect, suction, timerprogress ]);


            this.circs = [];

            var value = this.gameData.value;

            for ( var i = 0; i < value; i++ ) {

                var rad = eW * 0.065, dia = rad *2;

                var xp = Math.floor ( Math.random() * (eW - dia) ) + eX + rad,
                    yp = Math.floor ( Math.random() * (eH - dia) ) + eY + rad;

                var circ = new Balls ( this, 'circ' + i, xp, yp, rad, i+1 ); 

                this.circs.push ( circ );

                this.drawContainer.add ( circ );

            }


        },
        startPlay : function () {

           
            this.createDrawnIndicators ();

            this.createDrawBox ();

            this.isStartPlaying = true;

            this.captureCounter = 0;
            
            this.bingosound.play();

            this.captureOneBall ();
            

        },
        captureOneBall : function () {
            
            var drawGapTime = 2;
            
            var _this = this;

            this.timer = setTimeout ( function () {

                _this.toCapture = true;

            }, drawGapTime * 1000 );
            
            var tp = this.drawContainer.getByName('timerprogress');
            
            tp.width = 0;

            this.tweens.add ({
                targets : tp,
                width : _gameW * 0.6,
                duration : drawGapTime * 1000,
                ease : 'Quad.easeIn'
            }); 


        },
        animateUp : function ( numbr ) {

            var _this = this;
            
            this.music.play ('thump', { volume : 0.5 });

            var circ = this.circs [ numbr ];

            circ.captured();
            circ.x = _gameW/2;
            circ.y = _gameH *0.45;

            this.winningCombo.push ( circ.value );

            this.tweens.add ({
                targets : circ,
                y : _gameH * 0.2,
                duration : 1200,
                ease : 'Power2',
            });


            this.captureCounter += 1;

            var circleCaptured = this.indicatorContainer.getByName ( 'circe' + (this.captureCounter - 1) );

            var ys = circleCaptured.y;

            setTimeout ( function () {
                
                _this.music.play ('message', { volume:0.5 });

                circleCaptured.getAt(1).text = (circ.value < 10) ? '0'+ circ.value : circ.value;

            }, 600 );

            this.tweens.add ({
                targets :circleCaptured,
                y : ys - Math.floor ( 20 * _gameH/1280 ),
                duration : 500,
                delay : 600,
                ease : 'Quad.easeOut'
            });
            
            this.tweens.add ({
                targets :circleCaptured,
                y : ys,
                duration : 500,
                delay : 1100,
                easeParams : [ 0.5, 1],
                ease : 'Bounce'
            });
            
            
            



            if ( _this.captureCounter >= 6 ) {

                setTimeout ( function () {
                    _this.isStartPlaying = false;
                    _this.stopPlay ();
                }, 2000 ); 

            } else {

                setTimeout ( function () {
                
                    _this.captureOneBall ();

                }, 1000 );
                
            }


        },
        removeDrawElements : function () {

            this.indicatorContainer.destroy();

            this.drawContainer.destroy ();

        },
        stopPlay : function () {

            this.bingosound.stop ();
            
            this.removeDrawElements ();
  
            for ( var i in this.buttons ) {
                this.buttons[i].setVisible (false);
            }

            this.checkHits();

            this.showWinningCombo ();

            this.showWinner ();


        },
        showWinner : function () {

            var isWinner = this.checkWin();

            var txtConfig = {
                color : '#fff',
                fontFamily : 'Trebuchet MS',
                fontSize : _gameH * 0.015,
                fontStyle : 'bold'
            }

            var xp = _gameW/2, yp = _gameH * 0.882;

            var txtPrompt = isWinner ? 'WOW! Congrats! You\'ve won the jackpot prize.' : 'Sorry, You didn\'t win. Better luck next time.';

            var txt = this.add.text ( xp, yp, txtPrompt, txtConfig ).setOrigin ( 0.5 );

        },
        showWinningCombo : function () {

            this.music.play ('alarm');

            var img = this.add.image ( 0, 0, 'winpanel').setScale( _gameW/720 ).setOrigin(0);


            this.winningCombo .sort(function(a, b){return a - b});

            var cD = _gameW * 0.12,
                cS = cD * 0.1,
                cT = 6 * ( cD + cS ) - cS,
                cX = ( _gameW - cT )/2 + cD/2,
                cY = _gameH * 0.83;

            var txtConfig = {
                color : '#3a3a3a',
                fontFamily : 'Coda',
                fontSize : cD *0.5,
            }

            for ( var i in this.winningCombo ) {

                var circe = this.add.circle ( cX + i * ( cD + cS ), cY, cD/2, 0xf5f5f5, 1 ).setStrokeStyle ( 1, 0x6c6c6c );

                var tmpTxt = ( parseInt (this.winningCombo[i] ) < 10 ) ? '0' + this.winningCombo[i] : this.winningCombo[i] ;

                var txt = this.add.text ( cX + i * ( cD + cS ), cY, tmpTxt, txtConfig ).setOrigin(0.5);

            }

        },
        getHit: function ( x, y, w, h ) {

            for ( var i in this.circs ) {
                var circ = this.circs [i];
                
                if ( circ.x >= x && circ.x < ( x + w ) && circ.y > y && circ.y < ( y + h ) ) {
                    return i;
                }
            } 
            
            return '';
        },
        resetKeys : function () { 
            for ( var i in this.keys ) {
                this.keys [i].getAt(0).setFrame (0).setData('active', false);
            }
        },
        checkHits : function () {

            var counter = 0;

            for ( var i in this.dataCombi ) {

                var hitCounter = 0;

                var tmpArr = this.dataCombi[i].combi;

                for ( var j in tmpArr) {
                    
                    var tmpNumbr = tmpArr [j];

                    for ( var k in this.winningCombo ) {

                        if ( tmpNumbr == this.winningCombo[k] ) {
                            
                            this.points [counter].circ.setFillStyle (0x00ffff, 0.9 );
                            //this.points [counter].txt.setColor ( '#ffffff' );
                            
                            hitCounter += 1;

                            //console.log ( '- hit', counter, tmpNumbr );
                        }
                    }
                    counter ++;
                }
                
                //console.log ( i, hitCounter);
                if ( hitCounter >= 6 ) this.dataCombi [i].isWinner = true;

            }
        },
        checkWin : function () {

            for ( var i in this.dataCombi ) {

                if ( this.dataCombi [i].isWinner ) return true;
            }

            return false;
        },
        getRandomCombi : function () {

            var max = this.gameData.value;

            var tmpArr = [];
            for ( var i = 0; i < max; i++ ) {
                tmpArr.push ( i + 1 );
            }

            var fin = [];

            while ( fin.length < 6 ) {

                var rand = Math.floor ( Math.random() * tmpArr.length );

                fin.push ( tmpArr [ rand] );

                tmpArr.splice ( rand, 1 );
            }

            return fin;

        },
        addUp : function ( lp ) {

            var finArr = [];

            if ( lp ) {

                finArr = this.getRandomCombi ();

            } else {

                finArr = this.tmpComb;
            }

            finArr.sort(function(a, b){return a - b});

            this.dataCombi.push ( { 'combi' : finArr , 'lp' : lp, 'isWinner' : false });


            if ( this.dataCombi.length >= 0 ) {
                this.buttons[1].getAt(0).setInteractive().setFrame(0);
            }

            if ( this.dataCombi.length >= 6 ) {
                this.buttons[0].getAt(0).removeInteractive().setFrame(2);
            }

            this.updateTicket();

        },
        leaveScene : function () {
            
            this.bgmusic.stop();

            this.scene.start ( 'sceneA');
        }


    });



    var Balls =  new Phaser.Class({

        Extends: Phaser.GameObjects.Container,

        initialize:

        function Balls ( scene, id, x, y, rad, value )
        {

            Phaser.GameObjects.Container.call(this, scene)

            this.setPosition(x, y).setSize( rad*2, rad*2 );

            this.id = id;
            this.x = x;
            this.y = y;
            this.rad = rad;
            this.value = value;
            this.isCaptured = false;

            this.txtRotation = Math.PI/180  * ( Math.floor ( Math.random() * 360 ) );

            var iscale = (rad*2)/50;

            this.circ = scene.add.image ( 0, 0, 'imgCircle').setScale ( iscale )
            
            var txtConfig = { 
                fontFamily: 'Oswald', 
                //fontStyle : 'bold',
                fontSize: Math.floor( (rad*2) * 0.4), 
                color: '#0a0a0a' 
            };

            this.sCirc = scene.add.circle ( 0, 0, rad, 0xffff00, 0.5 ).setVisible (false);

            this.txt = scene.add.text ( 0, 0, value, txtConfig ).setRotation (this.txtRotation).setOrigin(0.5);

            //add to container...
            this.add ([ this.circ, this.sCirc, this.txt ]);

            scene.children.add ( this );

        },

        captured: function () {
            
            this.isCaptured = true;
            this.alpha = 0.4;

            this.sCirc.visible = true;
            
            this.txtRotation = 0;
            //this.txt.setRotation (0);

        }
    
        
    });


} 
