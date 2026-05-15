const board = document.querySelector("#masonryBoard");
const boardSection = document.querySelector("#board");
const template = document.querySelector("#pinTemplate");
const input = document.querySelector("#photoInput");
const dropZone = document.querySelector("#dropZone");
const pinCount = document.querySelector("#pinCount");
const shuffleButton = document.querySelector("#shuffleButton");
const filterRow = document.querySelector("#categoryFilters");
const uploadCategorySelect = document.querySelector("#uploadCategorySelect");
const pinTitleInput = document.querySelector("#pinTitleInput");
const pinSubtitleInput = document.querySelector("#pinSubtitleInput");
const newCategoryInput = document.querySelector("#newCategoryInput");
const addCategoryButton = document.querySelector("#addCategoryButton");
const categoryList = document.querySelector("#categoryList");
const categoryStatus = document.querySelector("#categoryStatus");
const openFeedback = document.querySelector("#openFeedback");
const feedbackOverlay = document.querySelector("#feedbackOverlay");
const feedbackForm = document.querySelector("#feedbackForm");
const closeFeedback = document.querySelector("#closeFeedback");
const feedbackName = document.querySelector("#feedbackName");
const feedbackEmail = document.querySelector("#feedbackEmail");
const feedbackReview = document.querySelector("#feedbackReview");
const feedbackStatus = document.querySelector("#feedbackStatus");
const sendFeedbackButton = document.querySelector("#sendFeedbackButton");
const appToast = document.querySelector("#appToast");
const toastTitle = document.querySelector("#toastTitle");
const toastMessage = document.querySelector("#toastMessage");
const logoutButton = document.querySelector("#logoutButton");
const authOverlay = document.querySelector("#authOverlay");
const loginForm = document.querySelector("#loginForm");
const userNameInput = document.querySelector("#userNameInput");
const passwordInput = document.querySelector("#passwordInput");
const togglePassword = document.querySelector("#togglePassword");
const authMessage = document.querySelector("#authMessage");
const hero = document.querySelector(".hero");
const heroBackground = document.querySelector("#heroBackground");
const heroCardOne = document.querySelector("#heroCardOne");
const heroCardTwo = document.querySelector("#heroCardTwo");
const heroCustomizer = document.querySelector("#heroCustomizer");
const customizerOverlay = document.querySelector("#customizerOverlay");
const openCustomizer = document.querySelector("#openCustomizer");
const closeCustomizer = document.querySelector("#closeCustomizer");
const heroPhotoInput = document.querySelector("#heroPhotoInput");
const backgroundStatus = document.querySelector("#backgroundStatus");
const resetHeroBackground = document.querySelector("#resetHeroBackground");
const hoverBackgroundToggle = document.querySelector("#hoverBackgroundToggle");
const photoTargetInputs = [...document.querySelectorAll("input[name='photoTarget']")];
const authTabs = [...document.querySelectorAll("[data-auth-mode]")];
const authTitle = document.querySelector("#authTitle");
const authIntro = document.querySelector("#authIntro");
const authSubmitButton = document.querySelector("#authSubmitButton");
const heroPins = [...document.querySelectorAll(".hero-pin")];
const revealTargets = [
  ...document.querySelectorAll(".profile-band, .upload-band, .board-section, .stats div"),
];
const defaultHeroBackground = heroBackground.src;
const currentUserStorageKey = "pinfolioCurrentUser";
const authTokenStorageKey = "pinfolioAuthToken";
const feedbackRecipientEmail = "vish.chouhan60@gmail.com";
const defaultCategories = [
  { id: "style", label: "Style" },
  { id: "travel", label: "Travel" },
  { id: "interior", label: "Interior" },
];
const photoTargets = {
  background: {
    image: heroBackground,
    status: backgroundStatus,
    storageKey: "heroBackground",
    defaultSrc: heroBackground.src,
    savedMessage: "Background photo saved",
    emptyMessage: "Choose an image for the background.",
    label: "Background photo",
  },
  cardOne: {
    image: heroCardOne,
    status: backgroundStatus,
    storageKey: "heroCardOne",
    defaultSrc: heroCardOne.src,
    savedMessage: "First floating photo saved",
    emptyMessage: "Choose an image for the first floating photo.",
    label: "First floating photo",
  },
  cardTwo: {
    image: heroCardTwo,
    status: backgroundStatus,
    storageKey: "heroCardTwo",
    defaultSrc: heroCardTwo.src,
    savedMessage: "Second floating photo saved",
    emptyMessage: "Choose an image for the second floating photo.",
    label: "Second floating photo",
  },
};

const samplePins = [
  {
    title: "Editorial street style",
    category: "style",
    src: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=700&q=82",
  },
  {
    title: "Soft interior corner",
    category: "interior",
    src: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=700&q=82",
  },
  {
    title: "Coastal escape",
    category: "travel",
    src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=82",
  },
  {
    title: "Colorful moodboard",
    category: "style",
    src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=82",
  },
  {
    title: "Gallery wall details",
    category: "interior",
    src: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=700&q=82",
  },
  {
    title: "Golden city walk",
    category: "travel",
    src: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=700&q=82",
  },
  {
    title: "Minimal table styling",
    category: "interior",
    src: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=700&q=82",
  },
  {
    title: "Portrait inspiration",
    category: "style",
    src: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=700&q=82",
  },
  {
    title: "Mountain notebook",
    category: "travel",
    src: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=700&q=82",
  },
  {
    title: "Quiet studio light",
    category: "interior",
    src: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=700&q=82",
  },
  {
    title: "Runway texture",
    category: "style",
    src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=700&q=82",
  },
  {
    title: "Open road save",
    category: "travel",
    src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=82",
  },
];

let currentUser = sessionStorage.getItem(currentUserStorageKey) || "";
let authMode = "signin";
let profileData = {};
let pins = getDefaultPins();
let activeFilter = "all";
let categories = [...defaultCategories];
let hoverBackgroundEnabled = false;
let scrollTicking = false;
let toastTimer = 0;
const prefersLeanMotion = window.matchMedia("(max-width: 760px), (pointer: coarse)").matches;

function normalizeUserName(name) {
  return name.trim().replace(/\s+/g, " ").slice(0, 28);
}

function getAccountId(name) {
  return normalizeUserName(name).toLowerCase();
}

function getDefaultPins() {
  return samplePins.map((pin, index) => ({ ...pin, id: `sample-${index + 1}` }));
}

function openFeedbackEmailDraft({ name, email, review }) {
  const subject = encodeURIComponent(`Pinfolio feedback from ${name}`);
  const body = encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\n\nReview:\n${review}`,
  );
  window.location.href = `mailto:${feedbackRecipientEmail}?subject=${subject}&body=${body}`;
}

function showToast(title, message, type = "success") {
  window.clearTimeout(toastTimer);
  toastTitle.textContent = title;
  toastMessage.textContent = message;
  appToast.dataset.type = type;
  appToast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => {
    appToast.classList.remove("is-visible");
  }, 4200);
}

async function apiRequest(path, options = {}) {
  const token = sessionStorage.getItem(authTokenStorageKey);
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(path, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}

async function saveProfilePatch(patch) {
  if (!sessionStorage.getItem(authTokenStorageKey)) return;
  profileData = { ...profileData, ...patch };
  await apiRequest("/api/profile", {
    method: "PUT",
    body: JSON.stringify(patch),
  });
}

async function loadProfileFromServer() {
  const profile = await apiRequest("/api/profile");
  currentUser = profile.username;
  profileData = profile.data || {};
  pins =
    Array.isArray(profileData.pins) && profileData.pins.length
      ? profileData.pins.map((pin, index) => ({ ...pin, id: pin.id || `saved-${index}-${Date.now()}` }))
      : getDefaultPins();
  categories =
    Array.isArray(profileData.categories) && profileData.categories.length
      ? profileData.categories
      : [...defaultCategories];
  hoverBackgroundEnabled = Boolean(profileData.settings?.hoverBackgroundEnabled);
  activeFilter = "all";
  loadSavedHeroBackground();
  syncGalleryEffectsUi();
  syncCategoryUi();
  renderPins();
}

function setAuthOpen(open) {
  authOverlay.classList.toggle("is-open", open);
  authOverlay.setAttribute("aria-hidden", String(!open));
  document.body.classList.toggle("auth-open", open);
  document.body.classList.toggle("app-locked", open);

  if (open) {
    authMessage.classList.remove("error");
    authMessage.textContent = "Privacy and encryption protocol";
    authOverlay.scrollTop = 0;
    const authShell = document.querySelector(".auth-shell");
    if (authShell) authShell.scrollTop = 0;
    window.scrollTo({ top: 0, behavior: "instant" });
    window.setTimeout(() => userNameInput.focus(), 160);
  }
}

function logoutUser() {
  void apiRequest("/api/logout", { method: "POST" }).catch(() => {});
  sessionStorage.removeItem(authTokenStorageKey);
  sessionStorage.removeItem(currentUserStorageKey);
  currentUser = "";
  passwordInput.value = "";
  toggleCustomizer(false);
  setAuthOpen(true);
}

async function loginUser(name, password) {
  const username = normalizeUserName(name);
  if (!username || !password) return;

  try {
    const result = await apiRequest(authMode === "signup" ? "/api/signup" : "/api/signin", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });

    currentUser = result.username;
    sessionStorage.setItem(currentUserStorageKey, currentUser);
    sessionStorage.setItem(authTokenStorageKey, result.token);
    await loadProfileFromServer();
    authMessage.classList.remove("error");
    authMessage.textContent = authMode === "signup" ? "Account created." : "Login successful.";
    passwordInput.value = "";
    setAuthOpen(false);
  } catch (error) {
    authMessage.classList.add("error");
    authMessage.textContent = error.message;
    passwordInput.value = "";
    passwordInput.focus();
  }
}

function setBackgroundStatus(message) {
  backgroundStatus.textContent = message;
}

function saveImageTarget({ image, status, storageKey }, src, message) {
  image.classList.add("is-changing");

  const nextImage = new Image();
  nextImage.onload = async () => {
    image.src = src;
    const assets = { ...(profileData.assets || {}), [storageKey]: src };
    await saveProfilePatch({ assets });
    status.textContent = message;
    window.setTimeout(() => image.classList.remove("is-changing"), 120);
  };
  nextImage.onerror = () => {
    image.classList.remove("is-changing");
    status.textContent = "That image could not load. Try another photo.";
  };
  nextImage.src = src;
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function resizeImage(dataUrl, maxSize = 1600, quality = 0.86) {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
      const scale = Math.min(maxSize / image.width, maxSize / image.height, 1);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(image.width * scale);
      canvas.height = Math.round(image.height * scale);

      const context = canvas.getContext("2d");
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    image.onerror = () => resolve(dataUrl);
    image.src = dataUrl;
  });
}

async function applyImageFile(file, target, emptyMessage) {
  if (!file || !file.type.startsWith("image/")) {
    target.status.textContent = emptyMessage;
    return;
  }

  target.status.textContent = "Setting photo...";
  const dataUrl = await readFileAsDataUrl(file);
  const resizedDataUrl = await resizeImage(dataUrl);

  try {
    saveImageTarget(target, resizedDataUrl, target.savedMessage);
  } catch {
    saveImageTarget(target, dataUrl, target.savedMessage);
  }
}

function getSelectedPhotoTarget() {
  const selectedInput = photoTargetInputs.find((target) => target.checked);
  return photoTargets[selectedInput?.value || "background"];
}

async function applySelectedPhotoFile(file) {
  const target = getSelectedPhotoTarget();
  applyImageFile(file, target, target.emptyMessage);
}

function loadSavedHeroBackground() {
  Object.values(photoTargets).forEach((target) => {
    const savedPhoto = profileData.assets?.[target.storageKey];
    target.image.src = savedPhoto || target.defaultSrc;
  });
}

function toggleCustomizer(open) {
  customizerOverlay.classList.toggle("is-open", open);
  customizerOverlay.setAttribute("aria-hidden", String(!open));
  document.body.classList.toggle("panel-open", open);

  if (open) {
    window.setTimeout(() => heroPhotoInput.focus(), 180);
  } else {
    openCustomizer.focus();
  }
}

function toggleFeedback(open) {
  feedbackOverlay.classList.toggle("is-open", open);
  feedbackOverlay.setAttribute("aria-hidden", String(!open));
  document.body.classList.toggle("feedback-open", open);

  if (open) {
    feedbackStatus.classList.remove("error", "success");
    feedbackStatus.textContent = "Your feedback will be sent to the app owner.";
    window.setTimeout(() => feedbackName.focus(), 160);
  } else {
    openFeedback.focus();
  }
}

function getSubtitle(category) {
  const match = categories.find((item) => item.id === category);
  return match ? `${match.label} board` : "Uploaded pin";
}

function slugifyCategory(label) {
  return (
    label
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "category"
  );
}

function saveCategories() {
  saveProfilePatch({ categories });
}

function savePins() {
  saveProfilePatch({ pins });
}

function renderCategoryFilters() {
  filterRow.innerHTML = "";
  const filters = [{ id: "all", label: "All" }, ...categories];

  filters.forEach((category) => {
    const button = document.createElement("button");
    button.className = "filter-pill";
    button.type = "button";
    button.dataset.filter = category.id;
    button.textContent = category.label;
    button.classList.toggle("active", activeFilter === category.id);
    filterRow.append(button);
  });
}

function renderUploadCategoryOptions() {
  uploadCategorySelect.innerHTML = "";

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.label;
    uploadCategorySelect.append(option);
  });
}

function renderCategoryList() {
  categoryList.innerHTML = "";

  categories.forEach((category) => {
    const item = document.createElement("div");
    item.className = "category-item";

    const label = document.createElement("span");
    label.textContent = category.label;

    const button = document.createElement("button");
    button.className = "delete-category";
    button.type = "button";
    button.dataset.deleteCategory = category.id;
    button.setAttribute("aria-label", `Delete ${category.label}`);
    button.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>`;

    item.append(label, button);
    categoryList.append(item);
  });
}

function syncCategoryUi() {
  if (!categories.length) {
    categories = [...defaultCategories];
  }

  if (activeFilter !== "all" && !categories.some((category) => category.id === activeFilter)) {
    activeFilter = "all";
  }

  renderCategoryFilters();
  renderUploadCategoryOptions();
  renderCategoryList();
}

function addCategory() {
  const label = newCategoryInput.value.trim();
  if (!label) {
    categoryStatus.textContent = "Category name likho.";
    return;
  }

  const baseId = slugifyCategory(label);
  let id = baseId;
  let suffix = 2;

  while (categories.some((category) => category.id === id)) {
    id = `${baseId}-${suffix}`;
    suffix += 1;
  }

  categories.push({ id, label });
  saveCategories();
  syncCategoryUi();
  categoryStatus.textContent = `${label} category added.`;
  newCategoryInput.value = "";
}

function deleteCategory(id) {
  const category = categories.find((item) => item.id === id);
  if (!category || categories.length === 1) {
    categoryStatus.textContent = "At least one category must remain.";
    return;
  }

  categories = categories.filter((item) => item.id !== id);
  pins = pins.map((pin) => (pin.category === id ? { ...pin, category: categories[0].id } : pin));
  saveCategories();
  savePins();
  syncCategoryUi();
  renderPins();
  categoryStatus.textContent = `${category.label} deleted.`;
}

function renderPins() {
  const visiblePins =
    activeFilter === "all" ? pins : pins.filter((pin) => pin.category === activeFilter);

  board.innerHTML = "";
  visiblePins.forEach((pin, index) => {
    const card = template.content.firstElementChild.cloneNode(true);
    const image = card.querySelector("img");
    const title = card.querySelector(".pin-info strong");
    const subtitle = card.querySelector(".pin-info span");
    const saveButton = card.querySelector(".save-button");
    const removeButton = card.querySelector(".remove-pin");

    image.src = pin.src;
    image.alt = pin.title;
    image.loading = index < 2 ? "eager" : "lazy";
    image.decoding = "async";
    if (index < 2) {
      image.fetchPriority = "high";
    }
    title.textContent = pin.title;
    subtitle.textContent = pin.subtitle || getSubtitle(pin.category);
    card.dataset.category = pin.category;
    card.style.animationDelay = prefersLeanMotion ? "0ms" : `${Math.min(index * 55, 520)}ms`;
    attachPinMotion(card);
    card.addEventListener("pointerenter", () => setBoardHoverBackground(pin.src));

    saveButton.addEventListener("click", () => {
      pins = [pin, ...pins.filter((item) => item.id !== pin.id)];
      savePins();
      activeFilter = "all";
      setActiveFilter("all");
      renderPins();
      board.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    removeButton.addEventListener("click", () => {
      pins = pins.filter((item) => item.id !== pin.id);
      savePins();
      renderPins();
    });

    board.append(card);
  });

  pinCount.textContent = String(pins.length);
}

function syncGalleryEffectsUi() {
  hoverBackgroundToggle.checked = hoverBackgroundEnabled;
  if (!hoverBackgroundEnabled) {
    boardSection.classList.remove("has-hover-bg");
  }
}

function saveGalleryEffects() {
  const settings = {
    ...(profileData.settings || {}),
    hoverBackgroundEnabled,
  };
  saveProfilePatch({ settings });
}

function setBoardHoverBackground(src) {
  if (!hoverBackgroundEnabled) return;
  boardSection.style.setProperty("--hover-pin-bg", `url("${src}")`);
  boardSection.classList.add("has-hover-bg");
}

board.addEventListener("pointerleave", () => {
  boardSection.classList.remove("has-hover-bg");
});

function attachPinMotion(card) {
  if (prefersLeanMotion) {
    card.addEventListener("pointerdown", () => {
      card.classList.add("is-touch-lift");
      window.setTimeout(() => card.classList.remove("is-touch-lift"), 260);
    });
    return;
  }

  let motionFrame = 0;
  let nextTiltX = 0;
  let nextTiltY = 0;

  card.addEventListener("pointermove", (event) => {
    const bounds = card.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;

    nextTiltX = y * -4.5;
    nextTiltY = x * 4.5;

    if (motionFrame) return;
    motionFrame = window.requestAnimationFrame(() => {
      card.style.setProperty("--tilt-x", `${nextTiltX}deg`);
      card.style.setProperty("--tilt-y", `${nextTiltY}deg`);
      motionFrame = 0;
    });
  });

  card.addEventListener("pointerleave", () => {
    if (motionFrame) {
      window.cancelAnimationFrame(motionFrame);
      motionFrame = 0;
    }
    card.style.setProperty("--tilt-x", "0deg");
    card.style.setProperty("--tilt-y", "0deg");
  });
}

async function addFiles(files) {
  const imageFiles = [...files].filter((file) => file.type.startsWith("image/"));
  const selectedCategory = uploadCategorySelect.value || categories[0]?.id || "style";
  const customTitle = pinTitleInput.value.trim();
  const customSubtitle = pinSubtitleInput.value.trim();

  const newPins = await Promise.all(
    imageFiles.map(async (file, index) => {
      const dataUrl = await readFileAsDataUrl(file);
      const resizedDataUrl = await resizeImage(dataUrl, 1200, 0.84);

      return {
        id: `pin-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 8)}`,
        title:
          customTitle && imageFiles.length > 1
            ? `${customTitle} ${index + 1}`
            : customTitle ||
              file.name.replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ") ||
              `Uploaded pin ${index + 1}`,
        subtitle: customSubtitle,
        category: selectedCategory,
        src: resizedDataUrl,
      };
    }),
  );

  pins = [...newPins, ...pins];
  savePins();
  activeFilter = "all";
  setActiveFilter("all");
  renderPins();

  document.querySelector("#board").scrollIntoView({ behavior: "smooth", block: "start" });
}

function setActiveFilter(filter) {
  activeFilter = filter;
  [...filterRow.querySelectorAll(".filter-pill")].forEach((button) => {
    button.classList.toggle("active", button.dataset.filter === filter);
  });
}

input.addEventListener("change", (event) => {
  addFiles(event.target.files);
  input.value = "";
});

openCustomizer.addEventListener("click", () => toggleCustomizer(true));
closeCustomizer.addEventListener("click", () => toggleCustomizer(false));
openFeedback.addEventListener("click", () => toggleFeedback(true));
closeFeedback.addEventListener("click", () => toggleFeedback(false));

customizerOverlay.addEventListener("click", (event) => {
  if (event.target === customizerOverlay) {
    toggleCustomizer(false);
  }
});

feedbackOverlay.addEventListener("click", (event) => {
  if (event.target === feedbackOverlay) {
    toggleFeedback(false);
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && customizerOverlay.classList.contains("is-open")) {
    toggleCustomizer(false);
  }

  if (event.key === "Escape" && feedbackOverlay.classList.contains("is-open")) {
    toggleFeedback(false);
  }
});

heroPhotoInput.addEventListener("change", (event) => {
  applySelectedPhotoFile(event.target.files[0]);
  heroPhotoInput.value = "";
});

photoTargetInputs.forEach((input) => {
  input.addEventListener("change", () => {
    const target = getSelectedPhotoTarget();
    backgroundStatus.textContent = `${target.label} selected`;
  });
});

heroCustomizer.addEventListener("submit", (event) => {
  event.preventDefault();
});

resetHeroBackground.addEventListener("click", () => {
  const target = getSelectedPhotoTarget();
  const assets = { ...(profileData.assets || {}) };
  delete assets[target.storageKey];
  saveProfilePatch({ assets });
  target.image.src = target.defaultSrc;
  target.status.textContent = `${target.label} reset`;
});

hoverBackgroundToggle.addEventListener("change", () => {
  hoverBackgroundEnabled = hoverBackgroundToggle.checked;
  if (!hoverBackgroundEnabled) {
    boardSection.classList.remove("has-hover-bg");
  }
  saveGalleryEffects();
});

logoutButton.addEventListener("click", () => {
  userNameInput.value = "";
  logoutUser();
});

authTabs.forEach((button) => {
  button.addEventListener("click", () => {
    authMode = button.dataset.authMode;
    authTabs.forEach((tab) => tab.classList.toggle("active", tab === button));
    authTitle.textContent = authMode === "signup" ? "Start Your Archive." : "Welcome Back.";
    authIntro.textContent =
      authMode === "signup"
        ? "Create your private photo board."
        : "Open your saved photo world.";
    authSubmitButton.textContent = authMode === "signup" ? "Create Pinfolio" : "Unlock Pinfolio";
    authMessage.classList.remove("error");
    authMessage.textContent = "Privacy and encryption protocol";
  });
});

togglePassword.addEventListener("click", () => {
  const isPasswordHidden = passwordInput.type === "password";
  passwordInput.type = isPasswordHidden ? "text" : "password";
  togglePassword.setAttribute("aria-label", isPasswordHidden ? "Hide password" : "Show password");
});

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await loginUser(userNameInput.value, passwordInput.value);
});

feedbackForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = feedbackName.value.trim();
  const email = feedbackEmail.value.trim();
  const review = feedbackReview.value.trim();

  if (!name || !email || review.length < 8) {
    feedbackStatus.classList.add("error");
    feedbackStatus.textContent = "Please add your name, email, and a little more detail.";
    return;
  }

  sendFeedbackButton.disabled = true;
  feedbackStatus.classList.remove("error", "success");
  feedbackStatus.textContent = "Sending feedback...";

  try {
    await apiRequest("/api/feedback", {
      method: "POST",
      body: JSON.stringify({ name, email, review }),
    });
    feedbackStatus.classList.add("success");
    feedbackStatus.textContent = "Feedback sent. Thank you for helping improve Pinfolio.";
    showToast("Feedback email sent", "Your suggestion has been delivered to Vishal.");
    feedbackForm.reset();
    window.setTimeout(() => toggleFeedback(false), 450);
  } catch (error) {
    if (String(error.message || "").includes("RESEND_API_KEY")) {
      openFeedbackEmailDraft({ name, email, review });
      feedbackStatus.classList.add("success");
      feedbackStatus.textContent = "Email draft opened. Press Send in your email app.";
      showToast("Email draft opened", "Press Send in the email app to deliver your feedback.", "info");
      feedbackForm.reset();
      window.setTimeout(() => toggleFeedback(false), 450);
      return;
    }

    feedbackStatus.classList.add("error");
    feedbackStatus.textContent = error.message || "Feedback could not be sent right now.";
    showToast("Feedback not sent", feedbackStatus.textContent, "error");
  } finally {
    sendFeedbackButton.disabled = false;
  }
});

["dragenter", "dragover"].forEach((eventName) => {
  dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropZone.classList.add("dragging");
  });
});

["dragleave", "drop"].forEach((eventName) => {
  dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropZone.classList.remove("dragging");
  });
});

dropZone.addEventListener("drop", (event) => {
  addFiles(event.dataTransfer.files);
});

filterRow.addEventListener("click", (event) => {
  const button = event.target.closest(".filter-pill");
  if (!button) return;

  setActiveFilter(button.dataset.filter);
  renderPins();
});

addCategoryButton.addEventListener("click", addCategory);

newCategoryInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    addCategory();
  }
});

categoryList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-delete-category]");
  if (button) {
    deleteCategory(button.dataset.deleteCategory);
  }
});

shuffleButton.addEventListener("click", () => {
  pins = pins
    .map((pin) => ({ pin, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ pin }) => pin);
  savePins();
  renderPins();
});

function updateHeroParallax() {
  if (!hero || prefersLeanMotion) return;

  const progress = Math.min(Math.max(window.scrollY / hero.offsetHeight, 0), 1);
  heroPins.forEach((pin, index) => {
    const direction = index === 0 ? 1 : -1;
    pin.style.setProperty("--hero-drift-x", `${direction * progress * 26}px`);
    pin.style.setProperty("--hero-drift-y", `${progress * -34}px`);
  });

  scrollTicking = false;
}

if (!prefersLeanMotion) {
  window.addEventListener(
    "scroll",
    () => {
      if (!scrollTicking) {
        window.requestAnimationFrame(updateHeroParallax);
        scrollTicking = true;
      }
    },
    { passive: true },
  );
}

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 },
  );

  revealTargets.forEach((target, index) => {
    target.classList.add("reveal-on-scroll");
    target.style.transitionDelay = prefersLeanMotion ? "0ms" : `${Math.min(index * 70, 280)}ms`;
    revealObserver.observe(target);
  });
} else {
  revealTargets.forEach((target) => target.classList.add("is-visible"));
}

async function initApp() {
  updateHeroParallax();
  loadSavedHeroBackground();
  syncGalleryEffectsUi();
  syncCategoryUi();
  renderPins();

  if (sessionStorage.getItem(authTokenStorageKey)) {
    try {
      await loadProfileFromServer();
      document.body.classList.remove("app-locked");
      setAuthOpen(false);
      return;
    } catch {
      sessionStorage.removeItem(authTokenStorageKey);
      sessionStorage.removeItem(currentUserStorageKey);
      currentUser = "";
    }
  }

  setAuthOpen(true);
}

initApp();
