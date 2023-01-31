import { functions } from "./firebase";

const form = document.querySelector("#form");
const titleField = document.querySelector("#title");
const urlField = document.querySelector("#url");
const categoryField = document.querySelector("#category");
const switchBtn = document.querySelector("#switch-btn");
let isVisibilityPublic = true;

switchBtn.addEventListener("click", () => {
  isVisibilityPublic = !isVisibilityPublic;

  if (isVisibilityPublic) {
    switchBtn.setAttribute("data-visibility", "public");
  } else {
    switchBtn.setAttribute("data-visibility", "private");
  }
});

let user = null;

const handleSubmit = async (event) => {
  event.preventDefault();

  if (user) {
    const addResource = functions.httpsCallable("addResource");
    const addToReadingList = functions.httpsCallable("addToReadingList");

    const res = await addResource({
      title: titleField.value,
      url: urlField.value,
      category: categoryField.value,
      visibility: isVisibilityPublic ? "public" : "private",
      description: "",
      tags: [],
      user,
    });

    console.log(res.data);

    const result = addToReadingList({
      resource_id: res.data.doc_ref_id,
      author_id: user.uid,
      uid: user.uid,
    });
    console.log(result.data);
  } else {
    alert("you must be signed in");
  }
};

form.addEventListener("submit", handleSubmit);

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  // since only one tab should be active and in the current window at once
  // the return variable should only have one entry
  const activeTab = tabs[0];
  titleField.value = activeTab?.title?.slice(0, 61) || "";
  urlField.value = activeTab?.url || "";
});

chrome.storage.local.get(["myllo_auth_user"]).then((result) => {
  console.log(result);
  console.log(result?.myllo_auth_user?.uid);
  if (result?.myllo_auth_user?.uid) {
    user = result?.myllo_auth_user;
  }
});
