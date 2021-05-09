class SceneA extends Phaser.Scene {

    constructor ()
    {
        super('SceneA');
    }

    create ()
    {

        //..
        this.add.image ( 540,960, 'bg');

        this.add.image ( 540,960, 'title');
        
        //this.add.text ( 540, 300, 'Lotto Simulator (PCSO)', { color:'#333', fontFamily:'Oswald', fontSize:70 }).setOrigin(0.5);

        //..
        var buts = [42, 45, 49, 55, 58];

        var bw = 450, bh = 150, bs = 20;

        for ( let i = 0; i < buts.length; i++ ) {

            var xp = 540, yp = 750 + i * ( bh + bs );

            var myBut = new MyButton ( this, xp, yp, bw, bh, 'but'+i, 'menuBtns', '', 0, '6/'+buts[i] );

            myBut.on('pointerdown', () => {
                this.scene.start ('SceneB', { 'game' : buts[i] });
            });

        }

        this.add.text ( 540, 1880, 'chalnicol productions', { color:'#999', fontFamily:'Oswald', fontSize: 30 }).setOrigin(0.5);

    }

}
