function waitForElm(selector) {
  return new Promise(resolve => {
      if (document.querySelector(selector)) {
          return resolve(document.querySelector(selector));
      }

      const observer = new MutationObserver(mutations => {
          if (document.querySelector(selector)) {
              observer.disconnect();
              resolve(document.querySelector(selector));
          }
      });

      observer.observe(document.body, {
          childList: true,
          subtree: true
      });
  });
}

waitForElm('#copyPath').then((button) => {
  if (!button) return;
  button.addEventListener("click", () => {
    const folderPath = button.getAttribute('title');
    chrome.runtime.sendMessage({ action: "openFolder", path: folderPath });
  });
});