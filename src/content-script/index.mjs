import Browser from "webextension-polyfill";

async function run(question) {
  const container = document.createElement("div");
  container.className = "box";
  container.innerHTML = '<p class="cell loading">Waiting for ChatGPT response...</p>';

  const siderbarContainer = document.getElementById("Rightbar");
  if (siderbarContainer) {
    siderbarContainer.prepend(container);
  }

  const port = Browser.runtime.connect();
  port.onMessage.addListener(function (msg) {
    if (msg.answer) {
      container.innerHTML = '<div class="cell">ChatGPT:</div><p class="cell"></p>';
      container.querySelector("p").textContent = msg.answer;
    } else if (msg.error === "UNAUTHORIZED") {
      container.innerHTML =
        '<p class="cell">Please login at <a href="https://chat.openai.com" target="_blank">chat.openai.com</a> first</p>';
    } else {
      container.innerHTML = "<p class="cell">Failed to load response from ChatGPT</p>";
    }
  });
  port.postMessage({ question });
}

const searchInput = document.title.substring(0, document.title.length - 7);
if (searchInput) {
  run(searchInput);
}
