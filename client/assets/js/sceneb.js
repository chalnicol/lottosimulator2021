class SceneB extends Phaser.Scene {

    constructor ()
    {
        super('SceneB');
    }

    create ( data )
    {

        this.game = data.game;

        this.picked = [];
        
        this.fin = [];

        this.drawnNumbers = [];

        this.drawCount = 0;

        this.drawGap = 5000;

        this.startDrawAnim = false;

        //..
        this.add.image ( 540,960, 'bg');

        var ttxt = this.add.text ( 540, 70, 'Your Lotto Ticket', { color:'#636363', fontFamily:'Oswald', fontSize: 50 }).setOrigin(0.5);


        //add back button..
        var bck = this.add.image ( 115, 70, 'back' ).setInteractive();

        bck.on('pointerover', function () {
            this.setTint ( 0xffff00);
        });
        bck.on('pointerout', function () {
            this.clearTint();
        });
        bck.on('pointerdown', function () {
            //..
        });
        bck.on('pointerup', () => {
            this.leaveSim ();
        });

        this.tweens.add ({
            targets: bck,
            x : '-=20',
            duration : 500,
            ease : 'Power2',
            yoyo : 'true',
            repeat : -1
        });


        //..
        this.ticketBg = this.add.container ( 0, 130 );

        //var trct = this.add.rectangle ( 540, 0, 980, 1380, 0xffffcc, 1 ).setStrokeStyle ( 1, 0x3a3a3a ).setOrigin (0.5, 0);

        var trct = this.add.image ( 540, 690, 'ticketBg');

        var ttxt = this.add.text ( 540, 80, '(6/' + data.game + ') Lotto Game', { color:'#333', fontFamily:'Oswald', fontSize: 72 }).setOrigin(0.5);

        var empt = this.add.text ( 540, 625, '-- empty --', { color:'#999', fontFamily:'Oswald', fontSize: 40 }).setOrigin(0.5).setName('emp');

        this.ticketBg.add ([ trct, ttxt, empt ]);

        //..
        this.ticketCont = this.add.container ( 0, 130 );


        //
        this.btnsCont = this.add.container ( 0, 1553 );

        var mainButs = [ 'Add Entry', 'Start Simulation' ];

        for ( var i = 0; i < mainButs.length; i++ ) {

            var btn = new MyButton ( this, 540, 75 + i * 170, 960, 150, 'but'+i, 'mainBtns', '', 0, mainButs[i] ).setName ('btn' + i );

            btn.on ('pointerdown', function () {
                //..
            });
            btn.on ('pointerup', function () {
                
                switch ( this.id ) {
                    case 'but0':
                        if ( this.scene.fin.length < 7 ) this.scene.showAddEntryCont();
                        break;
                    case 'but1':
                        if ( this.scene.fin.length > 0 ) this.scene.startSim();
                        break;
                    default:
                }

            });

            this.btnsCont.add ( btn );
            
        }

        this.createEntryScreen ();

        
    }

    createEntryScreen () 
    {

        this.addEntryCont = this.add.container(0, 1920);

        var startY = 200;

        var rct = this.add.rectangle ( 0, 0, 1080, 1920, 0x0a0a0a, 0.8 ).setOrigin(0).setInteractive();

        var smrct = this.add.rectangle ( 540, startY, 980, 140, 0xffffff, 1);

        var txte = this.add.text ( 540, startY, 'Pick 6 Numbers', { color:'#333', fontFamily:'Oswald', fontSize: 66 }).setOrigin(0.5).setName('myTxt');
   
        this.addEntryCont.add ( [ rct, smrct, txte] );

        var bbw = 160, bbh = 110;

        var sx = 540 - ((6*(bbw+5))-5)/2 + (bbw/2);

        for ( let i = 0; i < this.game; i++ ) {

            var ix = Math.floor ( i/6 ), iy = i % 6;

            var xp = sx + iy * (bbw+5), yp = (startY+180) + ix * (bbh+5);

            var numbersBtn = new MyButton ( this, xp, yp, 160, 110, 'numbers'+i, 'buts2', '', 0, i+1 ).setName ('nbtn'+ i );

            numbersBtn.on('pointerup', function () {

                this.scene.addNumber ( this, i + 1 );

            });

            this.addEntryCont.add ( numbersBtn );

        }

        var cbuts = [  'Cancel', 'Clear', 'Lucky Pick', 'Submit' ];


        var bcw = 480, bch = 130;

        var scx = 540 - ((2*(bcw+20))-20)/2 + (bcw/2);
        
        for ( let i = 0; i < 4; i++ ) {

            var icx = Math.floor ( i/2 ), icy = i % 2;

            var xcp = scx + icy * (bcw+20), ycp = 1625 + icx * (bch+40);

            var cbtn = new MyButton (this, xcp, ycp, bcw, bch, 'butc' + i, 'entryBtns', '', 0, cbuts[i]);

            //if ( i > 1 ) cbtn.setBtnEnabled (false);

            cbtn.on('pointerup', function () {

                this.scene.controlsClick ( this.id );

            });

            this.addEntryCont.add ( cbtn );

        }

    }

    leaveSim () 
    {
        this.scene.start('SceneA');
    }

    addToTicket ( comb, lp = false ) {

        //push to final arr..
        this.fin.push ( comb );

        if ( this.fin.length > 0 ) this.ticketBg.getByName ('emp').visible = false;

        //add..
        const str = 'ABCDEFG';

        var bw = 920, bh = 150;

        var indx = this.fin.length - 1;

        var xp = 550, yp = 240 + indx * ( bh + 20 );

        var cont = this.add.container ( xp, yp );

        var lettr = this.add.text ( -420, 0,  str.charAt(indx) +":", { color:'#333', fontFamily:'Oswald', fontSize: 56 }).setOrigin(0.5);
        
        var lptxt = this.add.text ( 413, 0, lp ? 'LP' : '', { color:'#6e6e6e', fontFamily:'Oswald', fontSize: 50 }).setOrigin(0.5);

        cont.add ( [ lettr, lptxt ]);

        

        var cw = 110;

        for ( var j = 0; j < 6; j++ ) {

            var circCont = this.add.container ( -300 + j*(cw + 10), 0 ).setName ( 'circ' + j );

            var crc = this.add.circle ( 0, 0, cw/2, 0xffffff, 1 ).setStrokeStyle ( 2, 0x3e3e3e );

            var txtstr = comb [j] < 10 ? '0' + comb[j] : comb[j];

            var txt = this.add.text ( 0, 0, txtstr, { color:'#333', fontFamily:'Oswald', fontSize: 56 }).setOrigin(0.5);

            circCont.add ([crc, txt]); 

            cont.add( circCont);
        }

        this.ticketCont.add ( cont );
        

    }

    getLuckyPick ( max ) 
    {

        var tmp = [];
        
        while ( tmp.length < 6 ) {

            var rndomPick = Math.floor (Math.random() * max) + 1;
            
            if ( !tmp.includes( rndomPick ) ) tmp.push ( rndomPick );

        }

        return tmp.sort(function(a, b){return a - b});
    }

    controlsClick ( id ) {
        
        switch (id) {

            case 'butc1':
                this.resetEntryCont ();
                break;
            case 'butc0':

                

                this.showAddEntryCont ( false );

                break;  
            case 'butc2':
                var lp = this.getLuckyPick ( this.game );

                this.addToTicket ( lp, true );

                this.showAddEntryCont ( false );
                
                break;
            case 'butc3':

                if ( this.picked.length >= 6 ) {

                    this.addToTicket ( this.picked );

                    this.showAddEntryCont (false);
                }
                

                break;
            default:
                //..
        }
        
    }

    addNumber ( btn, numbr )
    {
        if (this.picked.length < 6 && !this.picked.includes(numbr)) {
            
            btn.removeInteractive().btnState ('pressed');

            this.picked.push ( numbr );

            var finstr = this.picked.sort(function(a, b){return a - b}).join ('   ');

            this.addEntryCont.getByName ('myTxt').text = finstr;

        }
    }

    resetEntryCont () {
        
        this.addEntryCont.getByName('myTxt').text = 'Picked 6 Numbers';

        for ( var i = 0; i < this.picked.length; i++ ) {
            this.addEntryCont.getByName( 'nbtn' + Number( this.picked[i] - 1) ).setInteractive().btnState ('idle');
        }

        this.picked = [];
    }

    showAddEntryCont( show = true )
    {
        this.tweens.add ({
            targets : this.addEntryCont,
            y : show ? 0 : 1920,
            duration : 300,
            ease : 'Power3'
        });

        if ( show ) this.resetEntryCont ();
        
    }

    startSim()
    {
        this.tweens.add ({
            targets : this.btnsCont,
            y : 1930, 
            duration : 250,
            ease : 'Power3'
        });

        this.time.delayedCall ( 300, () => this.createSimScreen(), [], this );

    }

    createSimScreen () {

        this.simScreenCont = this.add.container (0, 0);

        var rct = this.add.rectangle ( 0, 0, 1080, 1920, 0x0a0a0a, 0.7 ).setOrigin(0);

        var dm = this.add.image (540, 2276, 'drawmachine'); //713x919

        //var md = this.add.circle ( 540, 1126, 150, 0xff3333, 0.5 );
        this.tweens.add ({
            targets : dm,
            y : 1020,
            easeParams : [ 1.1, 0.6 ],
            ease : 'Elastic',
            duration : 600,
            onComplete : () => this.createBalls(),
        });

        this.simScreenCont.add ( [rct, dm] );

        var cd = 150;

        for ( var i = 0; i < 6; i++) {

            var ix = Math.floor ( i/3), iy = i%3;

            var cont = this.add.container ( 375 + (iy * (cd+15) ), 450 - (ix * (cd+30)) ).setName ('crc' + i ).setVisible (false);

            var crc = this.add.circle (0, 0, cd/2, 0xffffff, 1 ).setStrokeStyle ( 2, 0x0a0a0a );

            var txt = this.add.text (0, 0, '00', { color:'#333', fontFamily:'Oswald', fontSize: cd*0.6 }).setOrigin(0.5);

            cont.add ([ crc, txt ]);

            this.simScreenCont.add ( cont );
        }

        

    }

    createBalls () 
    {
    
        this.circDraw = this.add.container (0, 0);

        const cz = 36;

        const cW = 713, cH = 919;

        const left = 540 - (cW/2) + (cz+10), 
                
              right = 540 + (cW/2) - (cz+10),

              top = 1020 - (cH/2) + (cz+5),

              bot = 1020 + (cH/2) - (cz+5);

        for ( var i = 0; i < this.game; i++ ) {

            let rndX = Phaser.Math.Between ( left, right );

            var bballs = new BingoBalls ( this, rndX, 604.5, i, cz*2, cz*2 );

            this.add.tween ({
                targets : bballs,
                y : bot,
                easeParams : [ 0.6, 1.2 ],
                ease : 'Bounce',
                duration : 1000,
                delay : Phaser.Math.Between ( 0, 300 )
            });

            this.circDraw.add ( bballs );

        }

        this.dir = { 'left': left, 'right' : right, 'top' : top, 'bot' : bot };

        this.time.delayedCall ( 1200, () => this.startDrawAnimation(), [], this );

    }

    startDrawAnimation () 
    {
        this.startDrawAnim = true;

        this.drawTimer = this.time.addEvent({
            delay: this.drawGap,                // ms
            callback: () => this.getNumber(),
            callbackScope: this,
            loop: true
        });

    }

    stopDrawAnim ()
    {
        this.drawTimer.remove ();
        
        this.startDrawAnim = false;

        this.circDraw.iterate ( child => {

            this.tweens.add ({
                targets : child,
                y : this.dir.bot,
                ease : 'Bounce',
                duration: 1000,
                delay : Phaser.Math.Between ( 0, 300 )
            });
        });

        this.time.delayedCall ( 2000, () => { 
        
            this.removeSimScreen()
            
            this.showEndScreen ();

        }, [], this )

    }

    removeSimScreen () 
    {
        this.circDraw.destroy ();

        this.simScreenCont.destroy ();

    }

    showDrawnNumbers () {

        this.drawnNumbers.sort(function(a, b){return a - b});

        this.add.text ( 540, 1580, '- Winning Combination -', { fontSize: 56, fontFamily: 'Oswald', color:'#333' }).setOrigin (0.5);

        var cd = 140;

        var sx = 540 - ((6*(cd+15)-15)/2) + (cd/2) 

        for ( var i = 0; i < 6; i++) {

            var cont = this.add.container ( sx + (i * (cd+15) ), 1720 );

            var crc = this.add.circle (0, 0, cd/2, 0xffffff, 1 ).setStrokeStyle ( 2, 0x0a0a0a );

            var str = this.getScreenNumber ( this.drawnNumbers[i] );

            var txt = this.add.text (0, 0, str, { color:'#333', fontFamily:'Oswald', fontSize: cd*0.6 }).setOrigin(0.5);

            cont.add ([ crc, txt ]);

            //this.simScreenCont.add ( cont );
        }

    }

    showEndScreen ()
    {
        this.showDrawnNumbers ();

        var hits = this.getHits ();

        //console.log ( hits );

        var isWinner = hits.includes(6);

        var str = ( isWinner ) ? 'Congratulations! You hit the jackpot.' : 'Sorry. Better luck next time.'

        this.add.text ( 540, 1850, str, { fontSize: 46, fontFamily: 'Oswald', color:'#6e6e6e' }).setOrigin (0.5);

        if ( isWinner ) this.createFireWorks ();
    }

    createFireWorks ()
    {

        //..

    }

    getHits () 
    {

        var arr = [];

        for ( var i in this.fin ){

            var counter = 0;

            for ( var j in this.fin [i] ) {

                var crc = this.ticketCont.getAt(i).getByName ('circ' + j );

                if ( this.drawnNumbers.includes( this.fin[i][j]) ) {

                    crc.first.setFillStyle ( 0x66ff66, 1 );

                    this.tweens.add ({
                        targets: crc.first,
                        alpha : 0.5,
                        duration : 400,
                        ease : 'Power1',
                        yoyo : true,
                        repeat : -1
                    });

                    counter += 1;
                }

            }

            arr.push ( counter );

        }

        return arr;

    }
    
    getNumber () 
    {
        const bsz = 300;
        
        const bsx = 540 - (bsz/2), bsy = 1120 - (bsz/2);

        let arr = [];

        this.circDraw.iterate ( child => {
            if ( !child.isCaptured ) {
                if ( child.x > bsx && child.x <= ( bsx + bsz ) && child.y > bsy && child.y <= ( bsy + bsz ) ){
                    arr.push ( child.id );
                }
            }
        });

        if ( arr.length > 0 ) {

            //faker draw
            //const randomBall = this.fin [0] [this.drawCount] - 1; 
           
            //..
            const randomBall =  arr [ Math.floor ( Math.random() * arr.length ) ] ;

            let ball = this.circDraw.getByName ( 'crc' + randomBall );
            
            ball.setPosition ( 540, 1000 );

            ball.captured ();

            this.add.tween ({
                targets : ball,
                y : '-=421',
                duration : 300,
                ease : 'Linear',
                onComplete : () => {
                    ball.destroy ();
                    this.showNumber ( ball.id + 1 );
                }
            });


        }else {

            console.log ('error... walang nabola!!!');

        }

    }

    getScreenNumber ( numbr ) {

        return (Number ( numbr ) < 10) ? '0' + numbr : numbr;

    }

    showNumber ( numbr ){

        this.drawnNumbers.push ( numbr );

        var crc = this.simScreenCont.getByName ('crc' + this.drawCount);

        crc.last.text = this.getScreenNumber ( numbr );

        crc.visible = true;

        this.tweens.add ({
            targets : crc,
            y : '-=200',
            duration : 500,
            ease : 'Power2'
        });
        this.tweens.add ({
            targets : crc,
            y : '+=200',
            duration : 300,
            // easeParams : [ 0.6, 1.2 ],
            ease : 'Bounce',
            delay : 500
        });
        
        this.drawCount += 1;
        
        if ( this.drawCount >= 6 ) this.stopDrawAnim ();

    }

    update ( time, delta ) {

        //480,550 360x460

        if ( this.startDrawAnim ) {

            this.circDraw.iterate ( child => {

                if ( !child.isCaptured ) {

                    child.x += Math.sin( Phaser.Math.DegToRad ( child.rot ) )*child.vel;
                    child.y -= Math.cos( Phaser.Math.DegToRad ( child.rot ) )*child.vel;

                    if ( child.x <= this.dir.left || child.y <= this.dir.top || child.x >= this.dir.right || child.y >= this.dir.bot ) {

                        if ( child.x < this.dir.left ) child.x =  this.dir.left;
                        if ( child.x > this.dir.right ) child.x = this.dir.right;
                        if ( child.y < this.dir.top ) child.y = this.dir.top;
                        if ( child.y > this.dir.bot ) child.y = this.dir.bot;

                        let rot = Phaser.Math.Between ( 0, 360 );

                        child.setTextRotation ( rot );
                        
                    }


                }
                
            });

            // let timerProgress = this.drawTimer.getProgress ();

            // let progressH = 462 * timerProgress;

            // this.timerprogress.height = ( progressH < 10 ) ? 10 : progressH;

            // this.timerprogress.y = 550 + (462 - progressH);
        }
        
    }


}
