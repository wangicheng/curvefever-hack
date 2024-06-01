
!function() {
    // let custom_indicators = document.documentElement.getAttribute('data-binance-custom-indicators');
    let game_src = document.documentElement.getAttribute('data-game-src');

    // console.log('custom: ' + custom_indicators.substring(0, 100));
    // console.log('game src: ' + game_src.substring(0, 100));
    
    // game_src = game_src.replace(
    //     'l.FLY_MULTIPLIER=1.5,',
    //     'l.FLY_MULTIPLIER=0.5,'
    // );
    // game_src = game_src.replace(
    //     'this.affectSelf||e.curveRenderer.setVisible(!1)',
    //     'this.affectSelf||e.curveRenderer.setVisible(!0)'
    // );
    game_src = game_src.replace(
        'case m.EffectType.FILTER:',
        'case "移除濾鏡":'
    );
    game_src = game_src.replace(
        'case m.EffectType.HIDE:',
        'case "移除隱形":'
    );
    game_src = game_src.replace(
        'this.container.alpha=e,this.mine.alpha=e',
        'this.container.alpha=1,this.mine.alpha=1'
    );
    game_src = game_src.replace(
        'l.JUMP_OFFSET=10',
        'l.JUMP_OFFSET=0'
    );
    
    eval(game_src);

    // document.documentElement.removeAttribute('data-binance-custom-indicators');
    document.documentElement.removeAttribute('data-game-src');
    // delete custom_indicators;
    delete game_src;

    console.log('[Curvefever Hack] inline script executed');
}();
