const $ = (id) => document.getElementById(id);

const loginView = $("loginView");
const registerView = $("registerView");
const authBox = $("authBox");
const blogBox = $("blogBox");

$("showRegister").onclick = () => {
  loginView.hidden = true;
  registerView.hidden = false;
};

$("showLogin").onclick = () => {
  registerView.hidden = true;
  loginView.hidden = false;
};

$("registerBtn").onclick = async () => {
  const email = $("registerEmail").value;
  const password = $("registerPassword").value;
  const res = await fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) {
    $("registerError").textContent = data.error;
    return;
  }
  registerView.hidden = true;
  loginView.hidden = false;
  $("loginEmail").value = email;
};

$("loginBtn").onclick = async () => {
  const email = $("loginEmail").value;
  const password = $("loginPassword").value;
  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) {
    $("loginError").textContent = data.error;
    return;
  }
  await showBlog();
};

$("logoutBtn").onclick = async () => {
  await fetch("/api/logout", { method: "POST" });
  blogBox.hidden = true;
  authBox.hidden = false;
};

$("publishBtn").onclick = async () => {
  const title = $("articleTitle").value;
  const content = $("articleContent").value;
  const res = await fetch("/api/articles", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content }),
  });
  if (res.ok) {
    $("articleTitle").value = "";
    $("articleContent").value = "";
    await loadArticles();
  }
};

async function loadArticles() {
  const res = await fetch("/api/articles");
  const articles = await res.json();
  $("articlesList").innerHTML = articles
    .map(
      (a) => `
      <div class="article">
        <h4>${escapeHtml(a.title)}</h4>
        <p>${escapeHtml(a.content)}</p>
        <span class="date">${new Date(a.created_at).toLocaleString()}</span>
      </div>`
    )
    .join("");
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

async function showBlog() {
  const res = await fetch("/api/me");
  if (!res.ok) return;
  const data = await res.json();
  authBox.hidden = true;
  blogBox.hidden = false;
  $("welcomeMsg").textContent = `Bienvenue, ${data.email}`;
  await loadArticles();
}

// Rester connecté après un rafraîchissement de page (JWT dans le cookie)
showBlog();
