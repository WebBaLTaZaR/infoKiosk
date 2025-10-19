const content = document.getElementById("content");
const returnBtn = document.getElementById("returnButton");
const seviceBtn = document.querySelector(".service");
let historyStack = [];

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
  initPage(page, params);
}

function toggleBackButton(page) {
  if (page === "home") {
    returnBtn.classList.add("hidden");
  } else {
    returnBtn.classList.remove("hidden");
  }
}

returnBtn.addEventListener("click", () => {
  if (historyStack.length > 1) {
    historyStack.pop();
    const prevPage = historyStack.at(-1);
    loadPage(prevPage);
  } else {
    loadPage("home");
  }
});

function initPage(page, params) {}
loadPage("home");
