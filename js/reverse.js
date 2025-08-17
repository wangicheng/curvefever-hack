// ==========================================
// 設定區域
// ==========================================
const CONTROLLER_VARIABLE_NAME = 'REVERSE_KEY_JS_ENABLED';
const enabledMap = {
  'ArrowLeft': { key: 'd', code: 'KeyD', keyCode: 68 },
  'ArrowRight': { key: 'a', code: 'KeyA', keyCode: 65 },
};
const disabledMap = {
  'ArrowLeft': { key: 'a', code: 'KeyA', keyCode: 65 },
  'ArrowRight': { key: 'd', code: 'KeyD', keyCode: 68 },
};

// ==========================================
// 狀態追蹤與核心邏輯
// ==========================================
let internalStateEnabled = false;

// ** 核心狀態追蹤：使用陣列作為堆疊，最後一個元素代表主要方向 **
let pressedKeysStack = []; 
// 儲存事件的 target，因為所有模擬事件都必須在同一個元素上觸發
let eventTarget = null; 

// console.log(`Arrow Key Swapper (Advanced Stack Control) loaded!`);
// console.log(`Control with: window.${CONTROLLER_VARIABLE_NAME} = true / false;`);

function createAndDispatchKeyEvent(type, target, keyInfo) {
  if (!target || !keyInfo) return;
  const event = new KeyboardEvent(type, {
    key: keyInfo.key, code: keyInfo.code, keyCode: keyInfo.keyCode,
    bubbles: true, cancelable: true, composed: true,
  });
  target.dispatchEvent(event);
}

/**
 * 根據堆疊的變化，更新模擬的按鍵輸出
 * @param {string | undefined} oldDominantKey - 變化前的堆疊頂部按鍵
 * @param {string | undefined} newDominantKey - 變化後的堆疊頂部按鍵
 */
function updateSimulatedOutput(oldDominantKey, newDominantKey) {
  const currentMap = internalStateEnabled ? enabledMap : disabledMap;

  // 如果舊的主要方向存在，且與新的不同，則模擬放開它對應的鍵
  if (oldDominantKey && oldDominantKey !== newDominantKey) {
    const oldReplacement = currentMap[oldDominantKey];
    createAndDispatchKeyEvent('keyup', eventTarget, oldReplacement);
  }

  // 如果新的主要方向存在，且與舊的不同，則模擬按下它對應的鍵
  if (newDominantKey && newDominantKey !== oldDominantKey) {
    const newReplacement = currentMap[newDominantKey];
    createAndDispatchKeyEvent('keydown', eventTarget, newReplacement);
  }
}

// 監聽 keydown
window.addEventListener('keydown', (event) => {
  const key = event.key;
  if (key !== 'ArrowLeft' && key !== 'ArrowRight') return;

  // 永遠攔截原始事件
  event.preventDefault();
  event.stopPropagation();
  // eventTarget = event.target; // 記錄事件目標
  eventTarget = document.querySelector('canvas#game-canvas');

  const oldDominantKey = pressedKeysStack[pressedKeysStack.length - 1];

  // 如果鍵已在堆疊中，先移除，再加到頂部，確保它是最新的
  pressedKeysStack = pressedKeysStack.filter(k => k !== key);
  pressedKeysStack.push(key);

  const newDominantKey = pressedKeysStack[pressedKeysStack.length - 1];
  
  updateSimulatedOutput(oldDominantKey, newDominantKey);
}, true);

// 監聽 keyup
window.addEventListener('keyup', (event) => {
  const key = event.key;
  if (key !== 'ArrowLeft' && key !== 'ArrowRight') return;

  event.preventDefault();
  event.stopPropagation();
  // eventTarget = event.target;
  eventTarget = document.querySelector('canvas#game-canvas');

  const oldDominantKey = pressedKeysStack[pressedKeysStack.length - 1];

  // 從堆疊中移除放開的鍵
  pressedKeysStack = pressedKeysStack.filter(k => k !== key);
  
  const newDominantKey = pressedKeysStack[pressedKeysStack.length - 1];

  updateSimulatedOutput(oldDominantKey, newDominantKey);
}, true);

// ==========================================
// 全域變數監聽與【精確無縫切換邏輯】
// ==========================================
Object.defineProperty(window, CONTROLLER_VARIABLE_NAME, {
  get: function() { return internalStateEnabled; },
  
  set: function(newValue) {
    const isEnabled = (newValue === true);
    if (internalStateEnabled === isEnabled) return;
    internalStateEnabled = isEnabled; // 先更新狀態

    const oldMap = !isEnabled ? enabledMap : disabledMap;
    const newMap = isEnabled ? enabledMap : disabledMap;
    
    // console.log(`Arrow Key Swapper mode changed to: ${internalStateEnabled}. Processing held keys...`);

    const dominantKey = pressedKeysStack[pressedKeysStack.length - 1];
    if (!dominantKey) return; // 如果沒有按鍵被按住，則無需轉換

    const oldReplacement = oldMap[dominantKey];
    const newReplacement = newMap[dominantKey];
    
    // 你的需求：若僅 a 按著 -> 換成 d；若僅 d 按著 -> 換成 a。
    // 這個邏輯完美地涵蓋了這種情況，因為我們只關心當前的主要方向。
    // 例如，如果之前的主要輸出是 a，切換後的主要輸出必定是 d，反之亦然。

    // console.log(`Switching dominant key output: Releasing '${oldReplacement.key}', Pressing '${newReplacement.key}'`);

    // 1. 模擬放開【舊模式下】的主要輸出鍵
    setTimeout(() => createAndDispatchKeyEvent('keyup', eventTarget, oldReplacement), 0);
    
    // 2. 模擬按下【新模式下】的主要輸出鍵
    setTimeout(() => createAndDispatchKeyEvent('keydown', eventTarget, newReplacement), 0);

    // 處理 a/d 都按著的情況（即用戶同時按住左右方向鍵）
    // 我們已經處理了主要方向，現在檢查次要方向
    if (pressedKeysStack.length > 1) {
        // 在這個模型中，次要方向的輸出是不活動的 (沒有被 keydown)。
        // 當主要方向鍵被放開時，keyup 事件會自動觸發 updateSimulatedOutput，
        // 正確地啟用次要方向鍵的輸出。
        // 因此，在模式切換時，我們只需要轉換主要方向的輸出即可，邏輯是最簡潔且正確的。
    }
  },
  configurable: true
});

// 初始化
window[CONTROLLER_VARIABLE_NAME] = false;