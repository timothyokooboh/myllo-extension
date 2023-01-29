import { functions } from "./firebase";

const form = document.querySelector("#form");
const titleField = document.querySelector("#title");
const urlField = document.querySelector("#url");
let user = null;

const handleSubmit = async (event) => {
  event.preventDefault();

  if (user) {
    const addResource = functions.httpsCallable("addResource");
    const addToReadingList = functions.httpsCallable("addToReadingList");

    const res = await addResource({
      title: titleField.value,
      url: urlField.value,
      visibility: "private",
      user,
      description: "",
      category: "",
      tags: [],
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
  titleField.value = activeTab?.title || "";
  urlField.value = activeTab?.url || "";
});

chrome.storage.local.get(["myllo_auth_user"]).then((result) => {
  console.log(result);
  console.log(result?.myllo_auth_user?.uid);
  if (result?.myllo_auth_user?.uid) {
    user = result?.myllo_auth_user;
  }
});
