const tg = window.Telegram?.WebApp;

if (tg) {
  tg.ready();
  tg.expand();
  document.body.classList.toggle("dark", tg.colorScheme === "dark");
}

const actions = {
  start_onboarding: { type: "flow", key: "onboarding" },
  dreams: { type: "branch", key: "dreams" },
  fears: { type: "branch", key: "fears" },
  tea: { type: "branch", key: "tea" },
  relationship: { type: "branch", key: "relationship" },
  ziso_intro: { type: "branch", key: "ziso_intro" },
};

document.querySelectorAll("[data-action]").forEach((button) => {
  button.addEventListener("click", () => {
    const action = button.dataset.action;
    if (action === "send_reflection") {
      sendReflection();
      return;
    }
    sendToBot(actions[action] || { type: "unknown", key: action });
  });
});

document.getElementById("themeButton").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

function sendReflection() {
  const textarea = document.getElementById("reflection");
  const value = textarea.value.trim();
  if (!value) {
    haptic("error");
    textarea.focus();
    return;
  }
  sendToBot({ type: "reflection", text: value });
  textarea.value = "";
}

function sendToBot(payload) {
  haptic("selection_change");
  if (tg?.sendData) {
    tg.sendData(JSON.stringify(payload));
    return;
  }
  console.log("Mini App payload", payload);
}

function haptic(type) {
  if (type === "error") {
    tg?.HapticFeedback?.notificationOccurred("error");
    return;
  }
  tg?.HapticFeedback?.selectionChanged();
}
