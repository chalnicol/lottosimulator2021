class Preloader extends Phaser.Scene {

    constructor ()
    {
        super('Preloader');
    }
    preload ()
    {
        

        const mCont = this.add.container ( 540, 960 );


        let txtb = this.add.text ( 0, -60, 'Loading : 0%', { color:'#333', fontFamily:'Oswald', fontSize:34 }).setOrigin(0.5);

        //..
        let brct = this.add.rectangle ( 0, 0, 350, 40 ).setStrokeStyle (3, 0x0a0a0a);
        
        //..
        const rW = 340, rH = 30;

        let srct = this.add.rectangle ( -170, 0, 5, rH, 0x6a6a6a, 1 ).setOrigin(0, 0.5);


        mCont.add ([ txtb, brct, srct ]);


        this.load.on ('complete', function (progress) {
            mCont.visible = false;
        });


        this.load.on ('progress', function (progress) {

            txtb.setText ( 'Loading : ' + Math.ceil( progress * 100 ) + '%' );

            if ( (rW * progress) > 5) srct.setSize ( rW * progress, rH );

        });

        //..
        this.load.image('bg', 'client/assets/images/bg.jpg')

        this.load.image('title', 'client/assets/images/title.png')

        this.load.image('drawmachine', 'client/assets/images/drawmachine.png'); //713x919

        this.load.image('top', 'client/assets/images/top.png');

        this.load.image('bottom', 'client/assets/images/bottom.png');
        
        this.load.image('solo', 'client/assets/images/solo.png');

        this.load.image('back', 'client/assets/images/back.png');

        this.load.image('ticketBg', 'client/assets/images/ticketBg.png');

        this.load.spritesheet('entryBtns', 'client/assets/images/entryBtns.png', { frameWidth: 490, frameHeight: 140 });

        this.load.spritesheet('menuBtns', 'client/assets/images/menuBtns.png', { frameWidth: 460, frameHeight: 160 });

        this.load.spritesheet('mainBtns', 'client/assets/images/mainBtns.png', { frameWidth: 970, frameHeight: 160 });

        this.load.spritesheet('controls', 'client/assets/images/controls.png', { frameWidth: 130, frameHeight: 130 });

        this.load.spritesheet('balls', 'client/assets/images/balls.png', { frameWidth: 75, frameHeight: 75 });

        this.load.spritesheet('buts', 'client/assets/images/controls_sm.png', { frameWidth: 100, frameHeight: 100 });

        this.load.spritesheet('buts2', 'client/assets/images/pair_btns.png', { frameWidth: 160, frameHeight: 110 });

        this.load.audioSprite('sfx', 'client/assets/sfx/fx_mixdown.json', [
            'client/assets/sfx/sfx.ogg',
            'client/assets/sfx/sfx.mp3'
        ]);

        this.load.audio ('bgsound', ['client/assets/sfx/starcommander.ogg', 'client/assets/sfx/starcommander.mp3'] );

    }

    create ()
    {

        this.add.text ( 540, 960, 'Click Anywhere To Proceed', { color: '#333', fontFamily:"Oswald", fontSize: 40 }).setOrigin (0.5);

        this.input.once ('pointerup', () => {
            this.scene.start ('SceneA');
        });

    }
    
}
