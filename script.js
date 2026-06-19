// ============================================================
// 🎨 THEME COLOR
// ============================================================
const colorBtn = document.getElementById("colorBtn");
const colorPanel = document.getElementById("colorPanel");

colorBtn.onclick = () => colorPanel.classList.toggle("show-panel");

function changeColor(color) {
    document.documentElement.style.setProperty('--primary', color);
    localStorage.setItem("themeColor", color);
    colorPanel.classList.remove("show-panel");
}

window.addEventListener("load", () => {
    const saved = localStorage.getItem("themeColor");
    if (saved) document.documentElement.style.setProperty('--primary', saved);
});


// ============================================================
// ✏️ EDITABLE WELCOME NAME
// ============================================================
const welcomeText = document.getElementById("welcomeText");

document.getElementById("editNameBtn").onclick = () => {
    document.getElementById("nameInput").value = localStorage.getItem("welcomeName") || "Aakash";
    openModal("editNameModal");
    setTimeout(() => document.getElementById("nameInput").focus(), 50);
};
document.getElementById("cancelEditName").onclick = () => closeModal("editNameModal");
document.getElementById("saveEditName").onclick = () => {
    const val = document.getElementById("nameInput").value.trim();
    if (val) {
        localStorage.setItem("welcomeName", val);
        welcomeText.textContent = "Welcome back, " + val + "!";
    }
    closeModal("editNameModal");
};
document.getElementById("nameInput").addEventListener("keydown", e => {
    if (e.key === "Enter") document.getElementById("saveEditName").click();
    if (e.key === "Escape") closeModal("editNameModal");
});

function loadWelcomeName() {
    const saved = localStorage.getItem("welcomeName");
    if (saved) welcomeText.textContent = "Welcome back, " + saved + "!";
}
window.addEventListener("load", loadWelcomeName);


// ============================================================
// 🪟 MODAL HELPERS
// ============================================================
function openModal(id) { document.getElementById(id).classList.add("show-modal"); }
function closeModal(id) { document.getElementById(id).classList.remove("show-modal"); }

function openScreen(id) { document.getElementById(id).classList.add("show-screen"); }
function closeScreen(id) { document.getElementById(id).classList.remove("show-screen"); }


// ============================================================
// ⚠️ CONFIRM MODAL
// ============================================================
function appConfirm(message, onOk) {
    document.getElementById("confirmMessage").textContent = message;
    openModal("confirmModal");

    const okBtn = document.getElementById("confirmOk");
    const cancelBtn = document.getElementById("confirmCancel");
    const newOk = okBtn.cloneNode(true);
    const newCancel = cancelBtn.cloneNode(true);
    okBtn.replaceWith(newOk);
    cancelBtn.replaceWith(newCancel);

    newOk.onclick = () => { closeModal("confirmModal"); onOk(); };
    newCancel.onclick = () => closeModal("confirmModal");
}


// ============================================================
// ➕ GENERIC ADD-ITEM MODAL
// ============================================================
function openAddItemModal(title, placeholder, onSave) {
    document.getElementById("addItemTitle").textContent = title;
    document.getElementById("addItemInput").placeholder = placeholder;
    document.getElementById("addItemInput").value = "";
    openModal("addItemModal");
    setTimeout(() => document.getElementById("addItemInput").focus(), 50);

    const saveBtn = document.getElementById("addItemSave");
    const cancelBtn = document.getElementById("addItemCancel");
    const newSave = saveBtn.cloneNode(true);
    const newCancel = cancelBtn.cloneNode(true);
    saveBtn.replaceWith(newSave);
    cancelBtn.replaceWith(newCancel);

    function doSave() {
        const val = document.getElementById("addItemInput").value.trim();
        if (val) { closeModal("addItemModal"); onSave(val); }
    }
    newSave.onclick = doSave;
    newCancel.onclick = () => closeModal("addItemModal");
    document.getElementById("addItemInput").onkeydown = e => {
        if (e.key === "Enter") doSave();
        if (e.key === "Escape") closeModal("addItemModal");
    };
}


// ============================================================
// 💬 CHAT SCREEN
// ============================================================
document.getElementById("chatBtn").onclick = () => openScreen("chatScreen");
document.getElementById("backFromChat").onclick = () => closeScreen("chatScreen");

document.getElementById("chatSendBtn").onclick = sendChatMessage;
document.getElementById("chatInputField").addEventListener("keydown", e => {
    if (e.key === "Enter") sendChatMessage();
});

function sendChatMessage() {
    const input = document.getElementById("chatInputField");
    const msg = input.value.trim();
    if (!msg) return;

    const body = document.getElementById("chatBody");

    const userBubble = document.createElement("div");
    userBubble.className = "chat-bubble user";
    userBubble.textContent = msg;
    body.appendChild(userBubble);
    input.value = "";
    body.scrollTop = body.scrollHeight;

    // TODO: connect to backend AI — placeholder response for now
    setTimeout(() => {
        const botBubble = document.createElement("div");
        botBubble.className = "chat-bubble bot";
        botBubble.textContent = "Great question! I'll suggest recipes once connected to the backend 🍳";
        body.appendChild(botBubble);
        body.scrollTop = body.scrollHeight;
    }, 600);
}


// ============================================================
// ❤️ FAVORITES
// ============================================================
function loadFavorites() { return JSON.parse(localStorage.getItem("favoritesData")) || []; }
function saveFavorites(favs) { localStorage.setItem("favoritesData", JSON.stringify(favs)); }

function renderFavoritesList() {
    const favs = loadFavorites();
    const list = document.getElementById("favoritesList");
    list.innerHTML = "";

    if (favs.length === 0) {
        list.innerHTML = `<p class="empty-msg">No favorites yet. Heart an item to save it here!</p>`;
        return;
    }
    favs.forEach((fav, index) => {
        const item = document.createElement("div");
        item.className = "fav-item";

        const left = document.createElement("div");
        left.className = "fav-item-left";

        const label = document.createElement("span");
        label.className = "fav-item-category";
        label.textContent = fav.category;

        const name = document.createElement("span");
        name.textContent = fav.name;

        left.appendChild(label);
        left.appendChild(name);

        const removeBtn = document.createElement("button");
        removeBtn.className = "fav-item-remove";
        removeBtn.textContent = "✕";
        removeBtn.onclick = () => {
            const f = loadFavorites();
            f.splice(index, 1);
            saveFavorites(f);
            renderFavoritesList();
        };
        item.appendChild(left);
        item.appendChild(removeBtn);
        list.appendChild(item);
    });
}

function addToFavorites(name, category) {
    const favs = loadFavorites();
    if (!favs.find(f => f.name === name && f.category === category)) {
        favs.push({ name, category });
        saveFavorites(favs);
        renderFavoritesList();
    }
}

function removeFromFavorites(name, category) {
    saveFavorites(loadFavorites().filter(f => !(f.name === name && f.category === category)));
    renderFavoritesList();
}

function isFavorited(name, category) {
    return loadFavorites().some(f => f.name === name && f.category === category);
}

document.getElementById("clearFavorites").onclick = () => {
    appConfirm("Clear all favorites?", () => { saveFavorites([]); renderFavoritesList(); });
};
window.addEventListener("load", renderFavoritesList);


// ============================================================
// 🔬 SCANNED ITEMS
// ============================================================
function loadScannedItems() { return JSON.parse(localStorage.getItem("scannedItems")) || []; }
function saveScannedItems(items) { localStorage.setItem("scannedItems", JSON.stringify(items)); }

function renderScannedChips() {
    const items = loadScannedItems();
    const container = document.getElementById("scannedChips");
    container.innerHTML = "";
    if (items.length === 0) {
        container.innerHTML = `<p class="empty-msg">No scanned items yet.</p>`;
        return;
    }
    items.forEach((item, index) => container.appendChild(createScannedChip(item, index)));
}

function createScannedChip(item, index) {
    const span = document.createElement("span");
    const label = document.createElement("span");
    label.textContent = item;
    span.appendChild(label);

    const heartBtn = document.createElement("button");
    heartBtn.className = "chip-heart";
    heartBtn.textContent = isFavorited(item, "Scanned") ? "❤️" : "🤍";
    heartBtn.onclick = () => {
        if (isFavorited(item, "Scanned")) { removeFromFavorites(item, "Scanned"); heartBtn.textContent = "🤍"; }
        else { addToFavorites(item, "Scanned"); heartBtn.textContent = "❤️"; }
    };
    span.appendChild(heartBtn);

    const removeBtn = document.createElement("button");
    removeBtn.className = "chip-remove";
    removeBtn.textContent = "✕";
    removeBtn.onclick = () => {
        const items = loadScannedItems();
        items.splice(index, 1);
        saveScannedItems(items);
        renderScannedChips();
    };
    span.appendChild(removeBtn);
    return span;
}

// Backend calls this when a scan completes
function addScannedItem(itemName) {
    const items = loadScannedItems();
    if (!items.includes(itemName)) { items.push(itemName); saveScannedItems(items); }
    renderScannedChips();
}

document.getElementById("scanBtn").onclick = () => {
    const input = document.createElement("input");
    input.type = "file"; input.accept = "image/*"; input.capture = "environment";
    input.onchange = e => {
        const file = e.target.files[0];
        if (file) {
            console.log("Image captured:", file.name);
            // TODO: send `file` to backend, then call addScannedItem("result")
        }
    };
    input.click();
};

document.getElementById("clearScanned").onclick = () => {
    appConfirm("Clear all scanned items?", () => { saveScannedItems([]); renderScannedChips(); });
};
window.addEventListener("load", renderScannedChips);


// ============================================================
// 🥑 PANTRY
// ============================================================
function loadPantry() {
    const saved = JSON.parse(localStorage.getItem("pantry")) || [];
    const container = document.getElementById("pantryChips");
    const addBtn = document.getElementById("addPantryBtn");
    container.innerHTML = "";
    saved.forEach(item => container.appendChild(createPantryChip(item)));
    container.appendChild(addBtn);
}

function createPantryChip(item) {
    const span = document.createElement("span");
    const label = document.createElement("span");
    label.textContent = item;
    span.appendChild(label);

    const heartBtn = document.createElement("button");
    heartBtn.className = "chip-heart";
    heartBtn.textContent = isFavorited(item, "Pantry") ? "❤️" : "🤍";
    heartBtn.onclick = () => {
        if (isFavorited(item, "Pantry")) { removeFromFavorites(item, "Pantry"); heartBtn.textContent = "🤍"; }
        else { addToFavorites(item, "Pantry"); heartBtn.textContent = "❤️"; }
    };
    span.appendChild(heartBtn);

    const removeBtn = document.createElement("button");
    removeBtn.className = "chip-remove";
    removeBtn.textContent = "✕";
    removeBtn.onclick = () => { span.remove(); savePantry(); refreshRecipeSuggestion(); };
    span.appendChild(removeBtn);
    return span;
}

function savePantry() {
    const items = Array.from(document.querySelectorAll("#pantryChips > span"))
        .map(el => { const s = el.querySelector("span"); return s ? s.textContent.trim() : ""; })
        .filter(t => t.length > 0);
    localStorage.setItem("pantry", JSON.stringify(items));
}

document.getElementById("addPantryBtn").onclick = () => {
    openAddItemModal("Add Pantry Item", "e.g. Avocado 🥑", (item) => {
        const chip = createPantryChip(item);
        const container = document.getElementById("pantryChips");
        container.insertBefore(chip, document.getElementById("addPantryBtn"));
        savePantry();
        refreshRecipeSuggestion();
    });
};

document.getElementById("clearPantry").onclick = () => {
    appConfirm("Clear all pantry items?", () => { localStorage.removeItem("pantry"); loadPantry(); refreshRecipeSuggestion(); });
};
window.addEventListener("load", loadPantry);


// ============================================================
// 🔍 SEARCH — searches everything
// ============================================================
const ALL_CATEGORIES = ["Breakfast", "Lunch", "Dinner", "Snacks", "Under 30 mins", "Under 1 hour", "Under 2 hours"];
const searchToast = document.getElementById("searchToast");
let toastTimer = null;

function showToast(msg) {
    searchToast.textContent = msg;
    searchToast.classList.add("visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => searchToast.classList.remove("visible"), 2500);
}

function pulseChip(el) {
    el.classList.remove("chip-highlight");
    void el.offsetWidth;
    el.classList.add("chip-highlight");
    setTimeout(() => el.classList.remove("chip-highlight"), 1500);
}

function runSearch() {
    const query = document.getElementById("searchInput").value.trim().toLowerCase();
    if (!query) return;

    // Pantry
    for (const el of document.querySelectorAll("#pantryChips > span")) {
        const s = el.querySelector("span");
        if ((s ? s.textContent : el.textContent).toLowerCase().includes(query)) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
            pulseChip(el); showToast("✅ Found in Pantry"); return;
        }
    }
    // Scanned
    for (const el of document.querySelectorAll("#scannedChips > span")) {
        const s = el.querySelector("span");
        if ((s ? s.textContent : el.textContent).toLowerCase().includes(query)) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
            pulseChip(el); showToast("✅ Found in Scanned Items"); return;
        }
    }
    // All categories
    for (const cat of ALL_CATEGORIES) {
        const data = JSON.parse(localStorage.getItem(cat)) || [];
        if (data.some(item => item.toLowerCase().includes(query))) {
            openCategory(cat);
            setTimeout(() => {
                const target = Array.from(document.querySelectorAll("#screenContent .recipe-item"))
                    .find(el => el.querySelector("span") && el.querySelector("span").textContent.toLowerCase().includes(query));
                if (target) { target.scrollIntoView({ behavior: "smooth", block: "center" }); pulseChip(target); }
            }, 80);
            showToast("✅ Found in " + cat); return;
        }
    }
    showToast("❌ \"" + document.getElementById("searchInput").value.trim() + "\" not found");
}

document.getElementById("searchBtn").onclick = runSearch;
document.getElementById("searchInput").addEventListener("keydown", e => { if (e.key === "Enter") runSearch(); });


// ============================================================
// 🍽️ RECIPE SUGGESTION SECTION
// ============================================================
const recipePool = [
    { name: "Avocado Toast", desc: "Quick, healthy and delicious." },
    { name: "Tomato Rice Bowl", desc: "Simple comfort food in 20 mins." },
    { name: "Veggie Stir Fry", desc: "Use up whatever's in the pantry!" },
    { name: "Egg Fried Rice", desc: "Classic and easy weeknight meal." },
    { name: "Onion Soup", desc: "Warm and hearty — great for cold days." },
    { name: "Pasta Arrabbiata", desc: "Spicy tomato pasta, ready in 30 mins." },
    { name: "Chicken & Rice", desc: "A balanced, filling meal." },
    { name: "Stuffed Avocado", desc: "Fresh, light and nutritious." },
];
let lastSuggestedIndex = -1;

function refreshRecipeSuggestion() {
    const pantryItems = Array.from(document.querySelectorAll("#pantryChips > span"));
    const content = document.getElementById("recipeSuggestContent");
    if (pantryItems.length === 0) {
        content.innerHTML = `<p class="recipe-suggest-placeholder">Add items to your pantry to get recipe suggestions!</p>`;
        return;
    }
    let idx;
    do { idx = Math.floor(Math.random() * recipePool.length); } while (idx === lastSuggestedIndex && recipePool.length > 1);
    lastSuggestedIndex = idx;
    const r = recipePool[idx];
    content.innerHTML = `<div><p class="recipe-suggest-name">${r.name}</p><p class="recipe-suggest-desc">${r.desc}</p></div>`;
}

document.getElementById("refreshRecipeBtn").onclick = refreshRecipeSuggestion;
window.addEventListener("load", refreshRecipeSuggestion);


// ============================================================
// 📱 DYNAMIC SCREEN (Breakfast / Lunch / etc.)
// ============================================================
const dynamicScreen = document.getElementById("dynamicScreen");
let currentCategory = "";

function openCategory(category) {
    currentCategory = category;
    document.getElementById("screenTitle").textContent = category;
    openScreen("dynamicScreen");
    loadCategory(category);
}

document.getElementById("backDynamic").onclick = () => closeScreen("dynamicScreen");

document.getElementById("addRecipeBtn").onclick = () => {
    const modal = document.getElementById("addRecipeModal");
    document.getElementById("addRecipeTitle").textContent = "Add to " + currentCategory;
    document.getElementById("addRecipeInput").value = "";
    openModal("addRecipeModal");
    setTimeout(() => document.getElementById("addRecipeInput").focus(), 50);

    const saveBtn = document.getElementById("addRecipeSave");
    const cancelBtn = document.getElementById("addRecipeCancel");
    const newSave = saveBtn.cloneNode(true);
    const newCancel = cancelBtn.cloneNode(true);
    saveBtn.replaceWith(newSave);
    cancelBtn.replaceWith(newCancel);

    function doSave() {
        const val = document.getElementById("addRecipeInput").value.trim();
        if (val) {
            closeModal("addRecipeModal");
            const data = JSON.parse(localStorage.getItem(currentCategory)) || [];
            data.push(val);
            localStorage.setItem(currentCategory, JSON.stringify(data));
            loadCategory(currentCategory);
        }
    }
    newSave.onclick = doSave;
    newCancel.onclick = () => closeModal("addRecipeModal");
    document.getElementById("addRecipeInput").onkeydown = e => {
        if (e.key === "Enter") doSave();
        if (e.key === "Escape") closeModal("addRecipeModal");
    };
};

document.getElementById("clearCategoryBtn").onclick = () => {
    appConfirm(`Clear all in "${currentCategory}"?`, () => {
        localStorage.removeItem(currentCategory); loadCategory(currentCategory);
    });
};

function loadCategory(category) {
    const content = document.getElementById("screenContent");
    content.innerHTML = "";
    const data = JSON.parse(localStorage.getItem(category)) || [];
    if (data.length === 0) {
        content.innerHTML = `<p class="empty-msg" style="margin-top:10px">No recipes added yet.</p>`;
        return;
    }
    data.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "recipe-item";

        const name = document.createElement("span");
        name.textContent = item;
        div.appendChild(name);

        const actions = document.createElement("div");
        actions.className = "recipe-item-actions";

        const heartBtn = document.createElement("button");
        heartBtn.className = "recipe-heart";
        heartBtn.textContent = isFavorited(item, category) ? "❤️" : "🤍";
        heartBtn.onclick = () => {
            if (isFavorited(item, category)) { removeFromFavorites(item, category); heartBtn.textContent = "🤍"; }
            else { addToFavorites(item, category); heartBtn.textContent = "❤️"; }
        };
        actions.appendChild(heartBtn);

        const removeBtn = document.createElement("button");
        removeBtn.className = "recipe-remove";
        removeBtn.textContent = "✕";
        removeBtn.onclick = () => {
            const d = JSON.parse(localStorage.getItem(category)) || [];
            d.splice(index, 1);
            localStorage.setItem(category, JSON.stringify(d));
            loadCategory(category);
        };
        actions.appendChild(removeBtn);
        div.appendChild(actions);
        content.appendChild(div);
    });
}


// ============================================================
// 🍴 MEAL PLANNER
// ============================================================
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

document.getElementById("mealPlanBtn").onclick = () => { openScreen("mealPlanScreen"); renderMealPlan(); };
document.getElementById("backMealPlan").onclick = () => closeScreen("mealPlanScreen");

function getMealPlan() { return JSON.parse(localStorage.getItem("mealPlan")) || {}; }
function saveMealPlan(plan) { localStorage.setItem("mealPlan", JSON.stringify(plan)); }

function renderMealPlan() {
    const plan = getMealPlan();
    const body = document.getElementById("mealPlanBody");
    body.innerHTML = "";

    DAYS.forEach(day => {
        const card = document.createElement("div");
        card.className = "meal-day-card";

        const header = document.createElement("div");
        header.className = "meal-day-header";

        const dayName = document.createElement("span");
        dayName.className = "meal-day-name";
        dayName.textContent = day;

        const addBtn = document.createElement("button");
        addBtn.className = "meal-add-btn";
        addBtn.textContent = "+ Add";
        addBtn.onclick = () => {
            openAddItemModal("Add meal for " + day, "e.g. Avocado Toast", (meal) => {
                const p = getMealPlan();
                if (!p[day]) p[day] = [];
                p[day].push(meal);
                saveMealPlan(p);
                renderMealPlan();
            });
        };

        header.appendChild(dayName);
        header.appendChild(addBtn);
        card.appendChild(header);

        const items = document.createElement("div");
        items.className = "meal-items";

        const meals = plan[day] || [];
        if (meals.length === 0) {
            const empty = document.createElement("p");
            empty.className = "meal-empty";
            empty.textContent = "No meals planned";
            items.appendChild(empty);
        } else {
            meals.forEach((meal, i) => {
                const row = document.createElement("div");
                row.className = "meal-item";

                const label = document.createElement("span");
                label.textContent = meal;

                const removeBtn = document.createElement("button");
                removeBtn.className = "meal-item-remove";
                removeBtn.textContent = "✕";
                removeBtn.onclick = () => {
                    const p = getMealPlan();
                    p[day].splice(i, 1);
                    saveMealPlan(p);
                    renderMealPlan();
                };
                row.appendChild(label);
                row.appendChild(removeBtn);
                items.appendChild(row);
            });
        }
        card.appendChild(items);
        body.appendChild(card);
    });
}


// ============================================================
// 👤 PROFILE
// ============================================================
document.getElementById("profileBtn").onclick = () => { openScreen("profileScreen"); renderProfile(); };
document.getElementById("backProfile").onclick = () => closeScreen("profileScreen");

const DIET_PREFS = ["Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free", "High Protein", "Low Carb"];

function getDietPrefs() { return JSON.parse(localStorage.getItem("dietPrefs")) || []; }
function saveDietPrefs(prefs) { localStorage.setItem("dietPrefs", JSON.stringify(prefs)); }

function renderProfile() {
    const name = localStorage.getItem("welcomeName") || "Aakash";
    const pantryCount = (JSON.parse(localStorage.getItem("pantry")) || []).length;
    const favCount = (JSON.parse(localStorage.getItem("favoritesData")) || []).length;
    const scannedCount = (JSON.parse(localStorage.getItem("scannedItems")) || []).length;
    const prefs = getDietPrefs();

    const body = document.getElementById("profileBody");
    body.innerHTML = "";

    // Avatar
    const avatar = document.createElement("div");
    avatar.className = "profile-avatar";
    avatar.textContent = name.charAt(0).toUpperCase();
    body.appendChild(avatar);

    // Name
    const nameEl = document.createElement("p");
    nameEl.className = "profile-name";
    nameEl.textContent = name;
    body.appendChild(nameEl);

    // Stats
    const stats = document.createElement("div");
    stats.className = "profile-stats";
    [
        { num: pantryCount, label: "Pantry Items" },
        { num: favCount, label: "Favorites" },
        { num: scannedCount, label: "Scanned" },
        { num: ALL_CATEGORIES.reduce((acc, cat) => acc + (JSON.parse(localStorage.getItem(cat)) || []).length, 0), label: "Recipes Saved" },
    ].forEach(({ num, label }) => {
        const card = document.createElement("div");
        card.className = "stat-card";
        card.innerHTML = `<div class="stat-number">${num}</div><div class="stat-label">${label}</div>`;
        stats.appendChild(card);
    });
    body.appendChild(stats);

    // Dietary preferences
    const prefTitle = document.createElement("p");
    prefTitle.className = "profile-section-title";
    prefTitle.textContent = "Dietary Preferences";
    body.appendChild(prefTitle);

    const chipRow = document.createElement("div");
    chipRow.className = "diet-pref-chips";
    DIET_PREFS.forEach(pref => {
        const chip = document.createElement("button");
        chip.className = "diet-pref-chip" + (prefs.includes(pref) ? " active" : "");
        chip.textContent = pref;
        chip.onclick = () => {
            const p = getDietPrefs();
            const idx = p.indexOf(pref);
            if (idx >= 0) p.splice(idx, 1); else p.push(pref);
            saveDietPrefs(p);
            chip.classList.toggle("active");
        };
        chipRow.appendChild(chip);
    });
    body.appendChild(chipRow);
}


// ============================================================
// 🏃 DIET PLAN
// ============================================================
document.getElementById("dietBtn").onclick = () => {
    openScreen("dietScreen");
    // restore previously selected goal if any
    const saved = localStorage.getItem("dietGoal");
    if (saved) highlightDietGoal(saved);
};
document.getElementById("backDiet").onclick = () => closeScreen("dietScreen");

function selectDietGoal(goal) {
    localStorage.setItem("dietGoal", goal);
    highlightDietGoal(goal);
    showDietResult(goal);
}

function highlightDietGoal(goal) {
    ["goalLose", "goalMaintain", "goalGain"].forEach(id => {
        document.getElementById(id).classList.remove("active");
    });
    const map = { lose: "goalLose", maintain: "goalMaintain", gain: "goalGain" };
    if (map[goal]) document.getElementById(map[goal]).classList.add("active");
}

// Placeholder suggestions — backend will replace this with real pantry-based suggestions
const dietSuggestions = {
    lose: [
        { name: "Steamed Veggie Bowl", desc: "Light, fibre-rich and filling." },
        { name: "Tomato Soup", desc: "Low-calorie and warming." },
        { name: "Avocado Salad", desc: "Healthy fats, low sugar." },
    ],
    maintain: [
        { name: "Egg Fried Rice", desc: "Balanced carbs and protein." },
        { name: "Chicken Wrap", desc: "Nutritious and satisfying." },
        { name: "Veggie Stir Fry", desc: "Colourful and well-rounded." },
    ],
    gain: [
        { name: "Peanut Butter Oats", desc: "High-calorie, protein-packed breakfast." },
        { name: "Chicken & Rice Bowl", desc: "Muscle-building classic." },
        { name: "Pasta with Egg", desc: "Dense carbs and protein combo." },
    ],
};

function showDietResult(goal) {
    const result = document.getElementById("dietResult");
    const suggestions = dietSuggestions[goal] || [];
    result.innerHTML = "";

    const title = document.createElement("p");
    title.className = "diet-result-title";
    title.textContent = { lose: "Recipes to help you lose weight", maintain: "Recipes for a balanced diet", gain: "Recipes to help you gain weight" }[goal];
    result.appendChild(title);

    suggestions.forEach(s => {
        const item = document.createElement("div");
        item.className = "diet-result-item";
        item.innerHTML = `<strong>${s.name}</strong> — ${s.desc}`;
        result.appendChild(item);
    });

    result.classList.add("show");
}
