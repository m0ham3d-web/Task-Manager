const columns = [
  { key: "backlog", label: "Backlog" },
  { key: "progress", label: "In Progress" },
  { key: "done", label: "Done" },
];

const starterTasks = [
  {
    id: 1,
    title: "Design onboarding flow",
    status: "backlog",
    tag: "Design",
    due: "Today",
  },
  {
    id: 2,
    title: "Prepare sprint summary",
    status: "progress",
    tag: "Ops",
    due: "Tomorrow",
  },
  {
    id: 3,
    title: "Ship landing page updates",
    status: "done",
    tag: "Front-end",
    due: "Done",
  },
];

let tasks = [];
const input = document.getElementById("taskInput");
const board = document.getElementById("board");

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const savedTasks = localStorage.getItem("tasks");
  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
  } else {
    tasks = [...starterTasks];
    saveTasks();
  }
  render();
}

function render() {
  const summary = {
    total: tasks.length,
    backlog: tasks.filter((t) => t.status === "backlog").length,
    progress: tasks.filter((t) => t.status === "progress").length,
    done: tasks.filter((t) => t.status === "done").length,
  };

  document.getElementById("totalCount").textContent = summary.total;
  document.getElementById("backlogCount").textContent = summary.backlog;
  document.getElementById("progressCount").textContent = summary.progress;
  document.getElementById("doneCount").textContent = summary.done;

  board.innerHTML = columns
    .map((column) => {
      const items = tasks.filter((task) => task.status === column.key);
      return `
            <section class="column">
              <h2 style="margin: 0 0 12px; font-size: 18px;">${column.label}</h2>
              ${items
                .map(
                  (task) => `
                <article class="task">
                  <p class="tag">${task.tag}</p>
                  <h3>${task.title}</h3>
                  <p class="muted">Due: ${task.due}</p>
                  <div class="actions">
                    <button type="button" ${column.key === "backlog" ? "disabled" : ""} onclick="moveTask(${task.id}, -1)">Back</button>
                    <button type="button" ${column.key === "done" ? "disabled" : ""} onclick="moveTask(${task.id}, 1)">Next</button>
                    <button type="button" class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
                  </div>
                </article>
              `,
                )
                .join("")}
              ${items.length === 0 ? '<p style="color:#64748b;">No tasks here yet.</p>' : ""}
            </section>
          `;
    })
    .join("");
}

function moveTask(taskId, direction) {
  tasks = tasks.map((task) => {
    if (task.id !== taskId) return task;
    const currentIndex = columns.findIndex(
      (column) => column.key === task.status,
    );
    const nextIndex = Math.min(
      columns.length - 1,
      Math.max(0, currentIndex + direction),
    );
    return { ...task, status: columns[nextIndex].key };
  });
  saveTasks();
  render();
}

function deleteTask(taskId) {
  tasks = tasks.filter((task) => task.id !== taskId);
  saveTasks();
  render();
}

function addTask() {
  const value = input.value.trim();
  if (!value) return;
  tasks = [
    {
      id: Date.now(),
      title: value,
      status: "backlog",
      tag: "New",
      due: "Now",
    },
    ...tasks,
  ];
  input.value = "";
  saveTasks();
  render();
}

document.getElementById("addBtn").addEventListener("click", addTask);
input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") addTask();
});

document.addEventListener("DOMContentLoaded", loadTasks);
