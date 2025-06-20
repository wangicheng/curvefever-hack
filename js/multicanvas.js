(function () {
  'use strict';

  let canvas = null;
  let ctx = null;
  let animationFrameId = null;
  let canvasScale = 3;
  let mapSize = 5;
  let controlPanel = null;

  // 地圖尺寸設定
  const MAP_SIZES = [
    { width: 510, height: 510 },
    { width: 580, height: 580 },
    { width: 870, height: 870 },
    { width: 975, height: 975 },
    { width: 1080, height: 1080 },
    { width: 1610, height: 1080 }
  ];

  function createControlPanel() {
    controlPanel = document.createElement('div');
    controlPanel.className = 'hack-control-panel';

    // Scale 控制
    const scaleContainer = document.createElement('div');
    const scaleLabel = document.createElement('label');
    scaleLabel.textContent = 'Scale: ';
    const scaleValue = document.createElement('span');
    scaleValue.textContent = canvasScale.toFixed(1);
    const scaleSlider = document.createElement('input');
    scaleSlider.type = 'range';
    scaleSlider.min = '1';
    scaleSlider.max = '3';
    scaleSlider.step = '0.1';
    scaleSlider.value = canvasScale.toString();

    scaleSlider.addEventListener('input', (e) => {
      canvasScale = parseFloat(e.target.value);
      scaleValue.textContent = canvasScale.toFixed(1);
    });

    // Map Size 控制
    const mapContainer = document.createElement('div');
    const mapLabel = document.createElement('label');
    mapLabel.textContent = 'Map Size: ';
    const mapValue = document.createElement('span');
    const updateMapValue = () => {
      const size = MAP_SIZES[mapSize];
      mapValue.textContent = `${size.width}x${size.height}`;
    };
    updateMapValue();

    const mapSlider = document.createElement('input');
    mapSlider.type = 'range';
    mapSlider.min = '0';
    mapSlider.max = (MAP_SIZES.length - 1).toString();
    mapSlider.step = '1';
    mapSlider.value = mapSize.toString();

    mapSlider.addEventListener('input', (e) => {
      mapSize = parseInt(e.target.value);
      updateMapValue();
    });

    // 組裝 Scale 控制項
    scaleContainer.appendChild(scaleLabel);
    scaleContainer.appendChild(scaleSlider);
    scaleContainer.appendChild(scaleValue);

    // 組裝 Map Size 控制項
    mapContainer.appendChild(mapLabel);
    mapContainer.appendChild(mapSlider);
    mapContainer.appendChild(mapValue);

    // 添加到控制面板
    controlPanel.appendChild(scaleContainer);
    controlPanel.appendChild(mapContainer);
    document.body.appendChild(controlPanel);
  }

  function cleanup() {
    if (canvas) {
      canvas.remove();
      canvas = null;
    }
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    ctx = null;
    if (controlPanel) {
      controlPanel.remove();
      controlPanel = null;
    }
  }

  function initialize() {
    const sourceCanvas = document.getElementById('game-canvas');
    if (!sourceCanvas) return;

    createControlPanel();

    // 創建畫布元素        
    canvas = document.createElement('canvas');
    canvas.className = 'hack-canvas';
    sourceCanvas.parentElement.appendChild(canvas);
    ctx = canvas.getContext('2d');

    // 更新函數
    function updateCanvases() {
      const sourceCanvas = document.getElementById('game-canvas');

      if (!sourceCanvas) {
        cleanup();
        return;
      }

      const gameOverlay = document.querySelector('.game-overlay')
      const canvasRect = sourceCanvas.getBoundingClientRect();
      const gameOverlayRect = gameOverlay.getBoundingClientRect();

      // 計算各種座標
      const currentMap = MAP_SIZES[mapSize];
      const trimmedWidth = currentMap.width / 1610;
      const trimmedHeight = currentMap.height / 1080;
      const sourceX = (gameOverlayRect.left + gameOverlayRect.width * (1 - trimmedWidth) / 2 - canvasRect.left) / canvasRect.width * sourceCanvas.width;
      const sourceY = (gameOverlayRect.top + gameOverlayRect.height * (1 - trimmedHeight) / 2 - canvasRect.top) / canvasRect.height * sourceCanvas.height;
      const sourceWidth = gameOverlayRect.width * trimmedWidth / canvasRect.width * sourceCanvas.width;
      const sourceHeight = gameOverlayRect.height * trimmedHeight / canvasRect.height * sourceCanvas.height;

      canvas.style.width = gameOverlayRect.width + 'px';
      canvas.style.height = gameOverlayRect.height + 'px';
      canvas.style.left = gameOverlayRect.left + 'px';
      canvas.style.top = gameOverlayRect.top + 'px';

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const targetWidth = canvas.width * trimmedWidth / 3 * canvasScale;
      const targetHeight = canvas.height * trimmedHeight / 3 * canvasScale;

      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          ctx.drawImage(
            sourceCanvas,
            sourceX,                 // 源x
            sourceY,                 // 源y
            sourceWidth,             // 源寬
            sourceHeight,            // 源高
            canvas.width * 0.5 + targetWidth * (i - 1.5),  // 目標x
            canvas.height * 0.5 + targetHeight * (j - 1.5), // 目標y
            targetWidth,        // 目標寬
            targetHeight        // 目標高
          );
        }
      }

      animationFrameId = requestAnimationFrame(updateCanvases);
    }

    // 開始更新
    updateCanvases();
  }

  // 監聽 DOM 變化
  const observer = new MutationObserver((mutations, observer) => {
    const sourceCanvas = document.getElementById('game-canvas');

    if (sourceCanvas && !canvas) {
      console.log('Canvas found, initializing...');
      initialize();
    } else if (!sourceCanvas && canvas) {
      console.log('Canvas not found, cleaning up...');
      cleanup();
    }
  });

  observer.observe(document.documentElement, {
    attributes: false,
    childList: true,
    subtree: true
  });

  // 初次檢查
  if (document.getElementById('game-canvas')) {
    initialize();
  }
})();