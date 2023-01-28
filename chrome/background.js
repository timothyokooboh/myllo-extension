chrome.runtime.onInstalled.addListener(async () => {
  chrome.action.setBadgeText({
    text: "Myllo",
  });
});
