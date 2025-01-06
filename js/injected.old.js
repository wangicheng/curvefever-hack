
!function () {
  // let custom_indicators = document.documentElement.getAttribute('data-binance-custom-indicators');
  let game_src = document.documentElement.getAttribute('data-game-src');

  // console.log('custom: ' + custom_indicators.substring(0, 100));
  // console.log('game src: ' + game_src.substring(0, 100));

  // test
  // game_src = game_src.replace(
  //     'l.FLY_MULTIPLIER=1.5,',
  //     'l.FLY_MULTIPLIER=20,'
  // );

  // test 2
  // game_src = game_src.replace(
  //     'isLocked:!0',
  //     'isLocked:false'
  // );
  // game_src = game_src.replace(
  //     'isLocked:n.isLocked',
  //     'isLocked:false'
  // );
  // game_src = game_src.replace(
  //     'n.isLocked&&',
  //     'false&&'
  // );
  // game_src = game_src.replace(
  //     'isLocked:this.props.isLocked,',
  //     'isLocked:false,'
  // );
  // game_src = game_src.replace(
  //     'n.unlockedModule&&',
  //     'true&&'
  // );
  // game_src = game_src.replace(
  //     'const{module:e,',
  //     'this.props.isLocked=false;const{module:e,'
  // );

  // game_src = game_src.replace(
  //     'this.eventID[a.EventType.GAME_WINNERS]=this.curve.game.events.subscribe(a.EventType.GAME_WINNERS,a.EventPriorty.NORMAL,this.onGameWinners.bind(this))',
  //     'this.eventID[a.EventType.GAME_WINNERS]=this.curve.game.events.subscribe(a.EventType.GAME_WINNERS,a.EventPriorty.NORMAL,this.onGameWinners.bind(this));console.log(e);console.log(t);',
  //     // `this.eventID[a.EventType.GAME_WINNERS]=this.curve.game.events.subscribe(a.EventType.GAME_WINNERS,a.EventPriorty.NORMAL,this.onGameWinners.bind(this));
  //     // let n=new h.LaserEffectRenderer(this,t);
  //     // this.renderers[e.playerID] = n;`
  // );

  game_src = game_src.replace(
    /90833:\(e,t,n\)=>\{.*?\},7277/,
    `90833: (e,t,n)=>{
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: !0
            }),
            t.AimLineEffectRenderer = void 0;
            const a = n(10922)
              , r = n(33368)
              , i = n(47518)
              , o = n(8211)
              , s = n(79523);
            class l extends a.EffectRenderer {
                constructor(e, t) {
                    super(e, t),
                    this.createPreview()
                }
                createPreview() {
                    this.preview = new PIXI.Graphics,
                    this.preview.lineStyle(l.PREVIEW_THICKNESS, l.PREVIEW_COLOR, l.PREVIEW_ALPHA),
                    this.preview.moveTo(0, 0);
                    const e = this.effect.distance ? this.effect.distance : r.Constants.FIELD_SIZE_RENDERER.x * r.Constants.FIELD_SIZE_RENDERER.y;
                    this.preview.lineTo(e, 0),
                    this.preview.visible = !1,
                    i.GameStage.Instance.addToScene(o.Layer.PROJECTILES, this.preview)
                }
                onUpdate() {
                    // const e = this.effect.isWindingUp();
                    const e = true;
                    this.preview.visible = e,
                    e && (this.preview.position.set(s.MathI.toFloat(this.effect.curve.shipTipX), s.MathI.toFloat(this.effect.curve.shipTipY)),
                    this.preview.rotation = s.MathI.toFloat(this.effect.curve.angle))
                }
                onDestroy() {
                    i.GameStage.Instance.removeFromScene(this.preview),
                    this.preview.destroy(!0)
                }
            }
            t.AimLineEffectRenderer = l,
            l.PREVIEW_THICKNESS = 1,
            l.PREVIEW_COLOR = 16777215,
            l.PREVIEW_ALPHA = .1
        },7277`
  );
  game_src = game_src.replace(
    ',g=n(86220);',
    ',zz=n(77142);',
  );
  game_src = game_src.replace(
    'void 0!==n&&(this.renderers[t.id]=n)',
    'console.log("m",m);console.log("t",t);console.log("this",this);console.log("player id",zz.ClientGame.PLAYER_ID);void 0!==n&&(this.renderers[t.id]=n)'
  );
  game_src = game_src.replace(
    'case m.EffectType.HIDE:n=new p.HideEffectRenderer(this,t);break;',
    'case m.EffectType.FREEZE:if(t.ownerPlayerID==zz.ClientGame.PLAYER_ID){n=new p.AimLineEffectRenderer(this,t);}break;',
  );
  game_src = game_src.replace(
    't.showTimer&&this.timer.removeEffect(t.id),',
    // 'console.log("onCurveRemoveEffect",t);t.showTimer&&this.timer.removeEffect(t.id),',
    'if(!t.showTimer&&t.type==m.EffectType.FREEZE)return;t.showTimer&&this.timer.removeEffect(t.id),',
  );



  eval(game_src);

  // document.documentElement.removeAttribute('data-binance-custom-indicators');
  document.documentElement.removeAttribute('data-game-src');
  // delete custom_indicators;
  delete game_src;

  console.log('[Curvefever Hack] inline script executed');
}();
