const content = document.getElementById("content");
const returnBtn = document.getElementById("returnButton");
let historyStack = [];

// Загрузка HTML-страницы
async function loadPage(page, params = {}) {
  try {
    const res = await fetch(`pages/${page}.html`);
    if (!res.ok) throw new Error(`Не удалось загрузить ${page}.html`);
    const html = await res.text();
    content.innerHTML = html;
  } catch (err) {
    content.innerHTML = `<p>Ошибка загрузки страницы: ${page}</p>`;
    console.error(err);
  }

  if (historyStack.at(-1) !== page && page !== "home") {
    historyStack.push(page);
  }

  toggleBackButton(page);

  // 👇 ждём пока DOM обновится
  await new Promise(requestAnimationFrame);

  initPage(page, params);
}

async function loadHouses() {
  const container = document.querySelector(".listServices");
  if (!container) return;

  container.innerHTML = "<p>Загрузка списка ЖК...</p>";

  try {
    const res = await fetch("http://localhost:3000/api/houses?filial=333");

    if (!res.ok) {
      throw new Error(`Ошибка HTTP: ${res.status}`);
    }

    const data = await res.json();

    if (!Array.isArray(data)) {
      console.error("Некорректный ответ от сервера:", data);
      container.innerHTML = "<p>Ошибка данных сервера.</p>";
      return;
    }

    if (data.length === 0) {
      container.innerHTML = "<p>ЖК не найдены.</p>";
      return;
    }

    container.innerHTML = data
      .map(
        item => `
        <button class="otherServiceItem">
          <img src="assets/img/square.svg" alt="иконка">
          ${item.name}
        </button>
      `
      )
      .join("");

    adjustServiceLayout();
  } catch (err) {
    console.error("Ошибка при загрузке ЖК:", err);
    container.innerHTML = "<p>Ошибка загрузки списка ЖК.</p>";
  }
}


// Переключатель кнопки "Назад"
function toggleBackButton(page) {
  if (page === "home") {
    returnBtn.classList.add("hidden");
  } else {
    returnBtn.classList.remove("hidden");
  }
}

// Кнопка "Назад"
returnBtn.addEventListener("click", () => {
  if (historyStack.length > 1) {
    historyStack.pop();
    const prevPage = historyStack.at(-1);
    loadPage(prevPage);
  } else {
    loadPage("home");
  }
});

// Основная инициализация страниц
function initPage(page, params) {
  console.log("initPage вызван для:", page);
  if (page === "home") {
    const serviceButtons = document.querySelectorAll(".service");
    serviceButtons.forEach(btn => {
      btn.addEventListener("click", async () => {
        const section = btn.textContent.trim();

        await loadPage("otherServices");

        if (section === "Консультация") {
          loadOtherServices(section);
        } else if (section === "Касса") {
          loadHouses(); // 👈 новый вызов
        } else if (section === "Постобслуживание") {
          loadOtherServices(section);
        }
      });
    });
  }
}


// Загрузка первой страницы при старте
loadPage("home");

// --- API-запрос подуслуг ---
async function loadOtherServices(sectionName) {
  const container = document.querySelector(".listServices");
  if (!container) return; // если контейнер ещё не прогрузился

  container.innerHTML = "<p>Загрузка...</p>";

  try {
    const res = await fetch(
      `http://localhost:3000/api/services?section=${encodeURIComponent(sectionName)}&filial=333`
    );

    const data = await res.json();

    if (data.length === 0) {
      container.innerHTML = "<p>Нет услуг для выбранной категории.</p>";
      return;
    }

    container.innerHTML = data
      .map(
        item => `
        <button class="otherServiceItem">
          <img src="assets/img/square.svg" alt="иконка">
          ${item.name}
        </button>
      `
      )
      .join("");

    adjustServiceLayout();
  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>Ошибка загрузки данных.</p>";
  }
}
function adjustServiceLayout() {
  const container = document.querySelector(".listServices");
  if (!container) return; // 🧩 Безопасный выход, если блока нет

  const items = container.querySelectorAll(".otherServiceItem");
  const count = items.length;

  container.style.display = "grid";
  container.style.gap = "20px";

  if (count <= 4) {
    container.style.gridTemplateColumns = "1fr";
    container.style.gridTemplateRows = `repeat(${count}, 1fr)`;
  } else if (count <= 8) {
    container.style.gridTemplateColumns = "repeat(2, 1fr)";
  } else if (count <= 12) {
    container.style.gridTemplateColumns = "repeat(3, 1fr)";
  } else {
    container.style.gridTemplateColumns = "repeat(4, 1fr)";
  }
}
