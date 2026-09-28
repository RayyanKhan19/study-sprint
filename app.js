import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const { SUPABASE_URL, SUPABASE_KEY } = window.APP_CONFIG || {};

const configured =
  SUPABASE_URL &&
  SUPABASE_KEY &&
  !SUPABASE_URL.includes("YOUR_") &&
  !SUPABASE_KEY.includes("YOUR_");

let supabase = null;
try { if (configured) supabase = createClient(SUPABASE_URL, SUPABASE_KEY); }
catch (error) { console.error("Invalid Supabase configuration", error); }
let currentUser = null;
let loadVersion = 0;

const form = document.getElementById("taskForm");
const taskId = document.getElementById("taskId");
const title = document.getElementById("title");
const course = document.getElementById("course");
const dueDate = document.getElementById("dueDate");
const priority = document.getElementById("priority");
const notes = document.getElementById("notes");
const saveBtn = document.getElementById("saveBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const formTitle = document.getElementById("formTitle");
const taskList = document.getElementById("taskList");
const loading = document.getElementById("loading");
const emptyState = document.getElementById("emptyState");
const message = document.getElementById("message");
const totalCount = document.getElementById("totalCount");
const openCount = document.getElementById("openCount");
const doneCount = document.getElementById("doneCount");
const filterButtons = [...document.querySelectorAll(".filter-btn")];

let tasks = [];
let activeFilter = "all";

function setMessage(text, type = "info") {
  message.textContent = text;
  message.style.color = type === "error" ? "#b42318" : type === "success" ? "#177245" : "#667085";
}

function resetForm() {
  form.reset();
  taskId.value = "";
  priority.value = "Medium";
  formTitle.textContent = "Create a task";
  saveBtn.textContent = "Add task";
  cancelEditBtn.classList.add("hidden");
}

function formatDate(date) {
  if (!date) return "No due date";
  const parsed = new Date(`${date}T00:00:00`);
  return parsed.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function render() {
  totalCount.textContent = tasks.length;
  doneCount.textContent = tasks.filter(t => t.completed).length;
  openCount.textContent = tasks.filter(t => !t.completed).length;

  const filtered = tasks.filter(task => {
    if (activeFilter === "open") return !task.completed;
    if (activeFilter === "done") return task.completed;
    return true;
  });

  taskList.innerHTML = "";
  emptyState.classList.toggle("hidden", filtered.length !== 0);

  for (const task of filtered) {
    const card = document.createElement("article");
    card.className = `task-card ${task.completed ? "done" : ""}`;

    const priorityClass = (task.priority || "Medium").toLowerCase();

    card.innerHTML = `
      <input class="complete-box" type="checkbox" ${task.completed ? "checked" : ""} aria-label="Toggle ${escapeHtml(task.title)} complete" />
      <div>
        <h3 class="task-title">${escapeHtml(task.title)}</h3>
        <div class="task-meta">
          <span class="pill">${escapeHtml(task.course || "General")}</span>
          <span class="pill">${formatDate(task.due_date)}</span>
          <span class="pill ${priorityClass}">${escapeHtml(task.priority || "Medium")} priority</span>
        </div>
        ${task.notes ? `<p class="task-notes">${escapeHtml(task.notes)}</p>` : ""}
      </div>
      <div class="task-actions">
        <button class="btn ghost small edit-btn" type="button">Edit</button>
        <button class="btn danger small delete-btn" type="button">Delete</button>
      </div>
    `;

    card.querySelector(".complete-box").addEventListener("change", async (event) => {
      await updateCompleted(task.id, event.target.checked);
    });

    card.querySelector(".edit-btn").addEventListener("click", () => beginEdit(task));
    card.querySelector(".delete-btn").addEventListener("click", () => deleteTask(task.id));

    taskList.appendChild(card);
  }
}

async function loadTasks() {
  if (!supabase || !currentUser) return;
  const version = ++loadVersion;
  loading.classList.remove("hidden");
  emptyState.classList.add("hidden");

  if (!supabase) {
    loading.textContent = "Connect Supabase in config.js to load tasks.";
    setMessage("Setup needed: add your Supabase URL and publishable/anon key in config.js.", "error");
    return;
  }

  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false });

  if (version !== loadVersion) return;
  loading.classList.add("hidden");

  if (error) {
    console.error(error);
    setMessage(`Database error: ${error.message}`, "error");
    return;
  }

  tasks = data || [];
  render();
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!supabase || !currentUser) {
    setMessage("Connect Supabase and log in first.", "error");
    return;
  }

  const payload = {
    title: title.value.trim(),
    course: course.value.trim() || null,
    due_date: dueDate.value || null,
    priority: priority.value,
    notes: notes.value.trim() || null
  };

  if (!payload.title) return;

  saveBtn.disabled = true;
  saveBtn.textContent = taskId.value ? "Saving..." : "Adding...";

  let result;
  if (taskId.value) {
    result = await supabase.from("tasks").update(payload).eq("id", taskId.value);
  } else {
    result = await supabase.from("tasks").insert({ ...payload, user_id: currentUser.id });
  }

  saveBtn.disabled = false;

  if (result.error) {
    console.error(result.error);
    setMessage(`Could not save task: ${result.error.message}`, "error");
    saveBtn.textContent = taskId.value ? "Save changes" : "Add task";
    return;
  }

  setMessage(taskId.value ? "Task updated." : "Task added.", "success");
  resetForm();
  await loadTasks();
});

function beginEdit(task) {
  taskId.value = task.id;
  title.value = task.title || "";
  course.value = task.course || "";
  dueDate.value = task.due_date || "";
  priority.value = task.priority || "Medium";
  notes.value = task.notes || "";
  formTitle.textContent = "Edit task";
  saveBtn.textContent = "Save changes";
  cancelEditBtn.classList.remove("hidden");
  window.scrollTo({ top: 260, behavior: "smooth" });
}

cancelEditBtn.addEventListener("click", resetForm);

async function updateCompleted(id, completed) {
  if (!currentUser) return;
  const { error } = await supabase.from("tasks").update({ completed }).eq("id", id);
  if (error) {
    render();
    setMessage(`Could not update task: ${error.message}`, "error");
    return;
  }
  setMessage(completed ? "Task completed." : "Task reopened.", "success");
  await loadTasks();
}

async function deleteTask(id) {
  if (!currentUser) return;
  if (!confirm("Delete this task?")) return;

  const { error } = await supabase.from("tasks").delete().eq("id", id);
  if (error) {
    setMessage(`Could not delete task: ${error.message}`, "error");
    return;
  }

  if (taskId.value === String(id)) resetForm();
  setMessage("Task deleted.", "success");
  await loadTasks();
}

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach(btn => btn.classList.toggle("active", btn === button));
    render();
  });
});


const authForm = document.getElementById("authForm");
const authMessage = document.getElementById("authMessage");
const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");

function showSession(session) {
  const nextUser = session?.user || null;
  const changed = currentUser?.id !== nextUser?.id;
  currentUser = nextUser;
  document.getElementById("authPanel").classList.toggle("hidden", !!currentUser);
  document.getElementById("accountPanel").classList.toggle("hidden", !currentUser);
  document.getElementById("workspace").classList.toggle("hidden", !currentUser);
  document.getElementById("accountEmail").textContent = currentUser?.email || "";
  if (changed || !currentUser) {
    ++loadVersion;
    tasks = [];
    render();
    resetForm();
    setMessage("");
  }
  if (currentUser && changed) setTimeout(() => loadTasks(), 0);
}

async function authenticate(register) {
  if (!supabase) {
    authMessage.textContent = "Setup needed: enter your Supabase URL and publishable key in config.js.";
    return;
  }
  if (!authForm.reportValidity()) return;
  loginBtn.disabled = registerBtn.disabled = true;
  authMessage.textContent = "Please wait...";
  try {
    const credentials = {
      email: document.getElementById("email").value.trim(),
      password: document.getElementById("password").value
    };
    const { data, error } = register
      ? await supabase.auth.signUp({ ...credentials, options: { emailRedirectTo: window.location.origin } })
      : await supabase.auth.signInWithPassword(credentials);
    if (error) throw error;
    authMessage.textContent = register && !data.session
      ? "Check your email to confirm your account, then return here and log in."
      : "Success!";
    document.getElementById("password").value = "";
    if (data.session) showSession(data.session);
  } catch (error) {
    authMessage.textContent = error.message || "Unable to connect. Try again.";
  } finally {
    loginBtn.disabled = registerBtn.disabled = false;
  }
}
authForm.addEventListener("submit", event => { event.preventDefault(); authenticate(false); });
registerBtn.addEventListener("click", () => authenticate(true));
document.getElementById("logoutBtn").addEventListener("click", async () => {
  const { error } = await supabase.auth.signOut();
  if (error) setMessage(error.message, "error");
  else { showSession(null); authMessage.textContent = "Logged out."; }
});
if (supabase) {
  supabase.auth.onAuthStateChange((_event, session) => showSession(session));
  supabase.auth.getSession().then(({ data, error }) => {
    if (error) authMessage.textContent = error.message;
    else showSession(data.session);
  });
} else {
  authMessage.textContent = "Setup needed: enter your Supabase URL and publishable key in config.js.";
}
