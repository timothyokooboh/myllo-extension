chrome.runtime.onInstalled.addListener(async () => {
    chrome.action.setBadgeText({
      text: "Myllo",
    });

    // get user_id
    chrome.storage.local.get(["myllo_user_id"])
    .then(result => {
      console.log(result)
    })
});

