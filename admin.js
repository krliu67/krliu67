const STORAGE_KEY = "personal-website-content";
const editor = document.querySelector("#content-editor");
const status = document.querySelector("#admin-status");
const loadDefaultsButton = document.querySelector("#load-defaults");
const saveLocalButton = document.querySelector("#save-local");
const resetLocalButton = document.querySelector("#reset-local");

const defaultContent = window.defaultSiteContent || {};

const loadEditor = (content) => {
  if (!editor) {
    return;
  }

  editor.value = JSON.stringify(content, null, 2);
};

const setStatus = (message) => {
  if (status) {
    status.textContent = message;
  }
};

const getStoredContent = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultContent;
  } catch {
    return defaultContent;
  }
};

loadEditor(getStoredContent());

loadDefaultsButton?.addEventListener("click", () => {
  loadEditor(defaultContent);
  setStatus("Loaded current default content.");
});

saveLocalButton?.addEventListener("click", () => {
  try {
    const parsed = JSON.parse(editor.value);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    setStatus("Saved to local preview. Refresh index.html to see the updated content.");
  } catch {
    setStatus("JSON is invalid. Please fix the syntax before saving.");
  }
});

resetLocalButton?.addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY);
  loadEditor(defaultContent);
  setStatus("Local preview reset. The website will use default content again.");
});
