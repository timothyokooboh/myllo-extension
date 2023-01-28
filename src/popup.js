const form = document.querySelector("#form");
const titleField = document.querySelector("#title");
const urlField = document.querySelector("#url");

const handleSubmit = (event) => {
  event.preventDefault();
  alert("submitting form...");
};

form.addEventListener("submit", handleSubmit);

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  // since only one tab should be active and in the current window at once
  // the return variable should only have one entry
  const activeTab = tabs[0];
  titleField.value = activeTab.title;
  urlField.value = activeTab.url;
});

chrome.storage.local.get(["myllo_auth_user"]).then((result) => {
  console.log(result);
});
