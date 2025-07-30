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
    'case f.EffectType.FILTER:',
    'case "移除濾鏡":'
  );

  // 移除隱形
  gameJs = gameJs.replace(
    'case f.EffectType.HIDE:',
    'case "移除隱形":'
  );

  // 隱形地雷的不透明度
  gameJs = gameJs.replace(
    'this.container.alpha=e,this.mine.alpha=e',
    'this.container.alpha=1,this.mine.alpha=1'
  );

  // 跳躍偏移
  gameJs = gameJs.replace(
    'l.JUMP_OFFSET=10',
    'l.JUMP_OFFSET=0'
  );

  // 傳送訊息前先轉換 HTML Entity
  gameJs = gameJs.replace(
    'onValueSubmit:this.submitMessage',
    `onValueSubmit:(e) => {this.submitMessage(((t)=>{let e="";for(let $ of t){let o=$.codePointAt(0);"<"===$?e+="&lt;":">"===$?e+="&gt;":"&"===$?e+="&amp;":o>=160||"\xa0"===$?e+="&#"+o+";":e+=$}return e})(e));}`
  );
  


  eval(gameJs);

  console.log('[Curvefever Hack]', 'The modified script has executed');
}();