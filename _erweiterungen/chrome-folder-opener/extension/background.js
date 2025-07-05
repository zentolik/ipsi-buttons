chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "openFolder") {
    chrome.runtime.sendNativeMessage(
      "com.folder.opener",
      { path: message.path },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error("Native Message Error:", chrome.runtime.lastError.message);
        } else {
          console.log("Native Message Response:", response);
        }
      }
    );
  }
});