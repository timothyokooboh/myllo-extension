import { functions } from "./firebase";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

const main = document.querySelector("main");
const form = document.querySelector("#form");
const titleField = document.querySelector("#title");
const urlField = document.querySelector("#url");
const categoryField = document.querySelector("#category");
const switchBtn = document.querySelector("#switch-btn");
const submitBtn = document.querySelector("#submit-btn");
const visibilityLabel = document.querySelector("#visibility-label");
let isVisibilityPublic = true;
let user = null;

//
const notify = (param) => {
  return new Promise((resolve) => {
    const { message, type } = param;

    const toastPayload = {
      text: message,
      duration: 6000,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        width: "400",
      },
    };

    if (type === "error") {
      toastPayload.style = {
        ...toastPayload.style,
        background: "#000",
        color: "#FFF",
      };
    }

    Toastify(toastPayload).showToast();

    resolve();
  });
};

chrome.storage.local.get(["myllo_auth_user"]).then((result) => {
  if (result?.myllo_auth_user?.uid) {
    user = result?.myllo_auth_user;

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      // since only one tab should be active and in the current window at once
      // the return variable should only have one entry
      const activeTab = tabs[0];
      titleField.value = activeTab?.title?.slice(0, 61) || "";
      urlField.value = activeTab?.url || "";
    });
  } else {
    const template = document.querySelector("#sign-in-template");
    const clone = template.content.cloneNode(true);
    const button = clone.querySelector("#sign-in-btn");

    button.addEventListener("click", () => {
      window.open("https://myllo.co?from=extension-sign-in", "_blank");
    });
    main.replaceChildren(clone);
  }
});

switchBtn.addEventListener("click", () => {
  isVisibilityPublic = !isVisibilityPublic;

  if (isVisibilityPublic) {
    switchBtn.setAttribute("data-visibility", "public");
    visibilityLabel.textContent = "Yes";
  } else {
    switchBtn.setAttribute("data-visibility", "private");
    visibilityLabel.textContent = "No";
  }
});

const handleSubmit = async (event) => {
  event.preventDefault();

  if (user) {
    try {
      submitBtn.textContent = "Saving...";
      submitBtn.classList.add("loading");

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

      await addToReadingList({
        resource_id: res.data.doc_ref_id,
        author_id: user.uid,
        uid: user.uid,
      });

      notify({
        message: "You added to your reading list 👍",
        type: "success",
      }).then(() => {
        setTimeout(() => {
          window.close();
        }, 5000);
      });
    } catch (err) {
      notify({
        message: "Something went wrong. Please try again",
        type: "error",
      });
    } finally {
      submitBtn.textContent = "Save Resource";
      submitBtn.classList.remove("loading");
    }
  } else {
    notify({
      message: "You must be signed in on https://myllo.co",
      type: "error",
    });
  }
};

form.addEventListener("submit", handleSubmit);
