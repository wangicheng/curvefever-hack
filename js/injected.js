!function () {
  let gameJs = document.documentElement.getAttribute('data-game-js');
  document.documentElement.removeAttribute('data-game-js');

  // console.log('[Curvefever Hack]', 'game src: ' + gameJs.substring(0, 100));

  // test
  // 跳超高
  // gameJs = gameJs.replace(
  //   '.FLY_MULTIPLIER=1.5,',
  //   '.FLY_MULTIPLIER=20,'
  // );

  // 移除濾鏡 (低解析度, 失明效果, 迷幻效果)
  gameJs = gameJs.replace(
    'case EffectType.FILTER:',
    'case "移除濾鏡":'
  );

  // 移除隱形
  gameJs = gameJs.replace(
    'case EffectType.HIDE:',
    'case "移除隱形":'
  );

  // 隱形地雷的不透明度
  gameJs = gameJs.replace(
    'this.container.alpha=v$4,this.mine.alpha=v$4',
    'this.container.alpha=1,this.mine.alpha=1'
  );

  // 跳躍偏移
  gameJs = gameJs.replace(
    'this.JUMP_OFFSET=10',
    'this.JUMP_OFFSET=0'
  );

  // 傳送訊息前先轉換 HTML Entity
  gameJs = gameJs.replace(
    'onValueSubmit:this.submitMessage',
    `onValueSubmit:(e) => {this.submitMessage(((t)=>{let e="";for(let $ of t){let o=$.codePointAt(0);"<"===$?e+="&lt;":">"===$?e+="&gt;":"&"===$?e+="&amp;":o>=160||"\xa0"===$?e+="&#"+o+";":e+=$}return e})(e));}`
  );
  
  // 反轉偵測
  gameJs = gameJs.replace(
    'subToEvent(){this.eventID===-1&&(this.eventID=this.curve.game.events.subscribeTo(this.curve,EventType.CURVE_SET_INPUT_DIRECTION,EventPriorty.NORMAL,this.hookListener.bind(this)))}unsubFromEvent(){this.eventID!==-1&&(this.curve.game.events.unsubscribeFrom(this.curve,EventType.CURVE_SET_INPUT_DIRECTION,this.eventID),this.eventID=-1)}',
    `
      subToEvent() {
        if (this.curve?.game.room.playerToUserMap.get(this.curve.playerID) === window.USER_ID && window.REVERSE_KEY_JS_ENABLED === false) {
          // console.log('subToEvent', window.REVERSE_KEY_JS_ENABLED);
          window.REVERSE_KEY_JS_ENABLED = true;
        }
        -1 === this.eventID && (this.eventID = this.curve.game.events.subscribeTo(this.curve, r.EventType.CURVE_SET_INPUT_DIRECTION, r.EventPriorty.NORMAL, this.reverseKeysListener.bind(this)))
      }
      unsubFromEvent() {
        if (this.curve?.game.room.playerToUserMap.get(this.curve.playerID) === window.USER_ID && window.REVERSE_KEY_JS_ENABLED === true) {
          // console.log('unsubFromEvent', window.REVERSE_KEY_JS_ENABLED);
          window.REVERSE_KEY_JS_ENABLED = false;
        }
        -1 !== this.eventID && (this.curve.game.events.unsubscribeFrom(this.curve, r.EventType.CURVE_SET_INPUT_DIRECTION, this.eventID), this.eventID = -1)
      }
    `,
  );

  // 取得 user ID
  gameJs = gameJs.replaceAll(
    'static postAuthentication(ticket,newUser){',
    'static postAuthentication(ticket,newUser){window.USER_ID = ticket.substr(0, ticket.indexOf("."));'
  );

  // gameJs = gameJs.replaceAll(
  //   'this.game.ticker.tick-ClientSettings.getInputLagTicks()',
  //   'this.game.ticker.tick-ClientSettings.getInputLagTicks()-30'
  // );

  // 移除 ES Module 語法
  // 1. 移除 export { ... } 區塊
  gameJs = gameJs.replace(/export\s*\{[\s\S]*?\}\s*;?/g, '');
  // 2. 移除 export default 關鍵字 (保留後面的表達式)
  gameJs = gameJs.replace(/export\s+default\s+/g, '');
  // 3. 移除變數宣告前的 export (例如 export const ...)
  gameJs = gameJs.replace(/(?<=^|;)\s*export\s+(?!default\s)/g, '');

  eval(gameJs);

  console.log('[Curvefever Hack]', 'The modified script has executed');
}();