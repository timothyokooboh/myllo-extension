window.addEventListener("message", (event) => {
  if (event.data.type === "myllo_auth_user" && chrome.runtime?.id) {
    console.log(event.data);
    chrome.storage.local.set({
      myllo_auth_user: event.data.user,
    });
  }
});
