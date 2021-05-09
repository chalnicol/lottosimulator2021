class BingoBalls extends Phaser.GameObjects.Container {

    constructor(scene, x, y, id, w, h, vel = 20 ) {

        super(scene, x, y, [] );
        
        // ...
        this.id = id;

        this.w = w;
        
        this.h = h;
        
        this.vel = vel;

        this.rot =  Phaser.Math.Between( 0, 360);

        this.isCaptured = false;

        this.setName ('crc' + id ).setSize ( w, h );
            
        //let crc = scene.add.circle ( 0, 0, w, 0xffffff, 1 ).setStrokeStyle ( 2, 0x0a0a0a );

        let crc = scene.add.image ( 0, 0, 'balls' );

        let txt = scene.add.text ( 0, 0 , id+1, { color:'#333', fontFamily: 'Oswald', fontSize: 35 }).setOrigin (0.5);

        this.add ([ crc, txt ]);

        scene.add.existing(this);

        this.setTextRotation ( this.rot);

    }

    setTextRotation ( rot ) 
    {
        this.last.setRotation ( Math.PI/180 * rot );

        this.rot = rot;
    }

    captured () 
    {
        this.setAlpha ( 0.8 );

        this.first.setFrame ( 1 );
        
        this.isCaptured = true;

    }
    

}
