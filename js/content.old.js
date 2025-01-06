

(function () {
  function syncFetch(url, options = {}) {
    const xhr = new XMLHttpRequest();

    const method = options.method || 'GET';
    xhr.open(method, url, false);

    if (options.headers) {
      for (const [key, value] of Object.entries(options.headers)) {
        xhr.setRequestHeader(key, value);
      }
    }

    xhr.send(options.body || null);

    return {
      ok: xhr.status >= 200 && xhr.status < 300,
      status: xhr.status,
      statusText: xhr.statusText,
      headers: {
        get: (headerName) => xhr.getResponseHeader(headerName),
      },
      json: () => JSON.parse(xhr.responseText),
      text: () => xhr.responseText
    };
  }

  const request = new XMLHttpRequest();
  // request.open('GET', chrome.runtime.getURL('binance-custom-indicators.js'), false);
  // request.send(null);
  // if (request.status === 200) {
  //     document.documentElement.setAttribute('data-binance-custom-indicators', request.responseText);
  //     console.log('[GET] custom indicators');
  // }
  //                        cfpro.e617d78fec5e8534ae51.js
  // https://curvefever.pro/cfpro.e617d78fec5e8534ae51.js
  // https://curvefever.pro/cfpro.f8870f4005c34ca86cd7.js
  const src = '/cfpro.e617d78fec5e8534ae51.js';
  request.open('GET', src, false);
  request.send(null);
  if (request.status === 200) {
    document.documentElement.setAttribute('data-game-src', request.responseText);
    console.log('[Curvefever Hack] Get ' + src);
  } else {
    console.warn('[Curvefever Hack] request failed');
  }

  let injected;
  request.open('GET', chrome.runtime.getURL('js/injected.js'), false);
  request.send(null);
  if (request.status === 200) {
    injected = request.responseText;
    console.log('[Curvefever Hack] Get injected.js');
  } else {
    console.warn('[Curvefever Hack] request failed');
  }

  let bad_element_removed = false;
  const config = { attributes: false, childList: true, subtree: true };
  const observer = new MutationObserver(function (mutationList, observer) {
    // document.querySelectorAll('script:not(:empty)')[0];
    let nice_element = document.querySelector('head > script:not([src])[type$="text/javascript"]');
    let bad_element = document.querySelector(`head > script[src="${src}"]`);

    // 修改網頁上的script元素執行自訂inline script
    if (nice_element && !nice_element.modified) {
      nice_element.modified = true;
      nice_element.innerHTML = nice_element.innerHTML + injected;

      // // async
      // scriptTag.innerHTML += `fetch('${src}').then(async r => eval(await r.text()));`;

      console.log('[Curvefever Hack] nice element modified');
    }

    // 阻止原本的指標載入
    if (bad_element) {
      bad_element_removed = true;
      bad_element.remove();
      console.log('[Curvefever Hack] bad element removed');
    }

    if (nice_element && bad_element_removed) {
      observer.disconnect();
      console.log('[Curvefever Hack] observer disconnected');
    }
  });
  observer.observe(document.documentElement, config);
})();