/**
 * A wrapper for making synchronous XMLHttpRequest calls.
 * Note: Synchronous requests are deprecated and should be avoided in production.
 * Consider using async/await with fetch() instead.
 */
class SyncXHR {
  /**
   * Makes a synchronous HTTP request
   * @param {Object} config - The request configuration
   * @param {string} config.url - The URL to send the request to
   * @param {string} config.method - The HTTP method (GET, POST, etc.)
   * @param {Object} [config.headers] - Request headers
   * @param {any} [config.data] - Request body data
   * @returns {Object} Response object containing status, data, and headers
   * @throws {Error} If the request fails
   */
  static request(config) {
    const xhr = new XMLHttpRequest();

    // Configure the request
    xhr.open(config.method, config.url, false); // false = synchronous

    // Set default headers
    xhr.setRequestHeader('Content-Type', 'application/json');

    // Set custom headers
    if (config.headers) {
      Object.entries(config.headers).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value);
      });
    }

    try {
      // Send the request
      xhr.send(config.data ? JSON.stringify(config.data) : null);

      // Get response headers
      const headers = {};
      xhr.getAllResponseHeaders().split('\r\n').forEach(header => {
        const [key, value] = header.split(': ');
        if (key) headers[key] = value;
      });

      // Parse response based on Content-Type header
      let responseData;
      const contentType = xhr.getResponseHeader('Content-Type');
      if (contentType && contentType.includes('application/json')) {
        try {
          responseData = JSON.parse(xhr.responseText);
        } catch (e) {
          responseData = xhr.responseText;
        }
      } else {
        responseData = xhr.responseText;
      }

      return {
        status: xhr.status,
        statusText: xhr.statusText,
        data: responseData,
        headers: headers
      };
    } catch (error) {
      throw new Error(`Request failed: ${error.message}`);
    }
  }

  /**
   * Convenience method for GET requests
   * @param {string} url - The URL to send the request to
   * @param {Object} [config] - Additional configuration
   */
  static get(url, config = {}) {
    return this.request({ ...config, url, method: 'GET' });
  }

  /**
   * Convenience method for POST requests
   * @param {string} url - The URL to send the request to
   * @param {any} data - The data to send
   * @param {Object} [config] - Additional configuration
   */
  static post(url, data, config = {}) {
    return this.request({ ...config, url, method: 'POST', data });
  }

  /**
   * Convenience method for PUT requests
   * @param {string} url - The URL to send the request to
   * @param {any} data - The data to send
   * @param {Object} [config] - Additional configuration
   */
  static put(url, data, config = {}) {
    return this.request({ ...config, url, method: 'PUT', data });
  }

  /**
   * Convenience method for DELETE requests
   * @param {string} url - The URL to send the request to
   * @param {Object} [config] - Additional configuration
   */
  static delete(url, config = {}) {
    return this.request({ ...config, url, method: 'DELETE' });
  }
}

const GAME_SRC = '/cfpro.9aa2da17860fa00a9436.js';

!function() {
  console.log('[Curvefever Hack]', 'loading...');

  /**@type {string} */
  let gameJs;
  try {
    const response = SyncXHR.get(GAME_SRC);
    gameJs = response.data;
    document.documentElement.setAttribute('data-game-js', gameJs);
  } catch(error) {
    alert('[Curvefever Hack] ' + error);
    return;
  }

  /**@type {string} */
  let injected;
  try {
    const response = SyncXHR.get(chrome.runtime.getURL('js/injected.js'));
    injected = response.data;
  } catch(error) {
    alert('[Curvefever Hack] ' + error);
    return;
  }

  const status = {a: false, b: false};

  const observer = new MutationObserver(function (mutationList, observer) {
    /**@type {HTMLScriptElement} */
    const inlineScriptElement = document.querySelector('head > script:not([src])[type$="text/javascript"]');
    /**@type {HTMLScriptElement} */
    const gameScriptElement = document.querySelector(`head > script[src="${GAME_SRC}"]`);

    if (inlineScriptElement && !status.a) {
      status.a = true;
      inlineScriptElement.insertAdjacentHTML('afterbegin', injected);
      console.log('[Curvefever Hack]', 'script injected');
    }

    if (gameScriptElement) {
      status.b = true;
      gameScriptElement.remove();
      console.log('[Curvefever Hack]', 'game script removed');
    }

    if (status.a && status.b) {
      observer.disconnect();
      console.log('[Curvefever Hack]', 'observer disconnected');
    }
  });
  observer.observe(document.documentElement, { attributes: false, childList: true, subtree: true });
}();