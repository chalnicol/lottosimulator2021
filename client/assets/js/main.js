
window.onload = function () {

    var config = {
        type: Phaser.AUTO,
        scale: {
            mode: Phaser.Scale.FIT,
            parent: 'game_div',
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width: 1080,
            height: 1920
        },
        backgroundColor: '#ffffff',
        scene: [ Preloader, SceneA, SceneB ]
    };

    new Phaser.Game(config);

} 
