window.addEventListener("message", (event) => {
    if (event.data.type === "auth_status") {
        chrome.storage.local.set({
            'myllo_user_id': event.data.text
        })
    }
})