// let tasksData = {};

// const todo = document.querySelector("#todo");
// const progress = document.querySelector("#progress");
// const done = document.querySelector("#done");

// const tasks = document.querySelectorAll(".task");
// let dragElement = null;

// if (localStorage.getItem("tasks")) {
//   const data = JSON.parse(localStorage.getItem("tasks"));

//   for (const col in data) {
//     const column = document.querySelector(`#${col}`);
//     data[col].forEach((task) => {
//       const div = document.createElement("div");
//       div.classList.add("task");
//       div.setAttribute("draggable", "true");

//       div.innerHTML = `
//             <h2>${task.title}</h2>
//             <p>${task.desc}</p>
//             <button>Delete</button>
//             `;
//       column.appendChild(div);
//     });
//     const tasks = column.querySelectorAll(".tasks");
//     const count = column.querySelector(".right");
//     count.innerText = tasks.length;
//   }
// }

// tasks.forEach((task) => {
//   task.addEventListener("drag", (e) => {
//     // console.log("dragging", e);
//     dragElement = task;
//   });
// });

// function addDragEventOnColumn(column) {
//   column.addEventListener("dragenter", (e) => {
//     e.preventDefault();
//     column.classList.add("hover-over");
//   });

//   column.addEventListener("dragleave", (e) => {
//     e.preventDefault();
//     column.classList.remove("hover-over");
//   });
//   column.addEventListener("dragover", (e) => {
//     e.preventDefault();
//   });
//   column.addEventListener("drop", (e) => {
//     e.preventDefault();
//     column.appendChild(dragElement);
//     column.classList.remove("hover-over");

//     [todo, progress, done].forEach((col) => {
//       const tasks = col.querySelectorAll(".task");
//       const count = col.querySelector(".right");
//       tasksData[col.id] = Array.from(tasks).map((t) => {
//         return {
//           title: t.querySelector("h2").innerText,
//           desc: t.querySelector("p").innerText,
//         };
//       });
//       localStorage.setItem("tasks", JSON.stringify(tasksData));
//       count.innerText = tasks.length;
//     });
//   });

//   [todo, progress, done].forEach((col) => {
//     const tasks = col.querySelectorAll(".task");
//     const count = col.querySelector(".right");
//     count.innerText = tasks.length;
//   });
// }

// addDragEventOnColumn(todo);
// addDragEventOnColumn(progress);
// addDragEventOnColumn(done);

// const toggleModalButton = document.querySelector("#toggle-modal");
// const modalBg = document.querySelector(".modal .bg");
// const modal = document.querySelector(".modal");
// const addTaskButton = document.querySelector("#add-new-task");

// toggleModalButton.addEventListener("click", (e) => {
//   e.preventDefault();

//   modal.classList.add("active");
// });
// modalBg.addEventListener("click", () => {
//   modal.classList.remove("active");
// });

// addTaskButton.addEventListener("click", (e) => {
//   const taskTitle = document.querySelector("#task").value;
//   const taskDescription = document.querySelector("#description").value;

//   const div = document.createElement("div");
//   div.classList.add("task");
//   div.setAttribute("draggable", "true");

//   div.innerHTML = `

//     <h2>${taskTitle}</h2>
//     <p>${taskDescription}</p>
//     <button>Delete</button>
//     `;

//   todo.appendChild(div);

//   [todo, progress, done].forEach((col) => {
//     const tasks = col.querySelectorAll(".task");
//     const count = col.querySelector(".right");
//     tasksData[col.id] = Array.from(tasks).map((t) => {
//       return {
//         title: t.querySelector("h2").innerText,
//         desc: t.querySelector("p").innerText,
//       };
//     });
//     localStorage.setItem("tasks", JSON.stringify(tasksData));
//     count.innerText = tasks.length;
//   });

//   div.addEventListener("drag", (e) => {
//     dragElement = div;
//   });
//   modal.classList.remove("active");
// });

let tasksData = {};

const todo = document.querySelector("#todo");
const progress = document.querySelector("#progress");
const done = document.querySelector("#done");

let dragElement = null;

/* ------------------ UTILS ------------------ */

function updateCountsAndStorage() {
  [todo, progress, done].forEach((col) => {
    const tasks = col.querySelectorAll(".task");
    const count = col.querySelector(".right");

    tasksData[col.id] = Array.from(tasks).map((task) => ({
      title: task.querySelector("h2").innerText,
      desc: task.querySelector("p").innerText,
    }));

    count.innerText = tasks.length;
  });

  localStorage.setItem("tasks", JSON.stringify(tasksData));
}

function addTaskEvents(task) {
  // Drag
  task.addEventListener("dragstart", () => {
    dragElement = task;
  });

  // Delete
  task.querySelector("button").addEventListener("click", () => {
    task.remove();
    updateCountsAndStorage();
  });
}

function createTask(title, desc) {
  const div = document.createElement("div");
  div.classList.add("task");
  div.setAttribute("draggable", "true");

  div.innerHTML = `
    <h2>${title}</h2>
    <p>${desc}</p>
    <button class="delete">Delete</button>
  `;

  addTaskEvents(div);
  return div;
}

/* ------------------ LOAD FROM STORAGE ------------------ */

if (localStorage.getItem("tasks")) {
  tasksData = JSON.parse(localStorage.getItem("tasks"));

  for (const col in tasksData) {
    const column = document.querySelector(`#${col}`);
    tasksData[col].forEach((task) => {
      const taskEl = createTask(task.title, task.desc);
      column.appendChild(taskEl);
    });
  }

  updateCountsAndStorage();
}

/* ------------------ DRAG & DROP ------------------ */

function addDragEventOnColumn(column) {
  column.addEventListener("dragover", (e) => {
    e.preventDefault();
    column.classList.add("hover-over");
  });

  column.addEventListener("dragleave", () => {
    column.classList.remove("hover-over");
  });

  column.addEventListener("drop", (e) => {
    e.preventDefault();
    if (dragElement) {
      column.appendChild(dragElement);
      dragElement = null;
      updateCountsAndStorage();
    }
    column.classList.remove("hover-over");
  });
}

addDragEventOnColumn(todo);
addDragEventOnColumn(progress);
addDragEventOnColumn(done);

/* ------------------ MODAL ------------------ */

const toggleModalButton = document.querySelector("#toggle-modal");
const modalBg = document.querySelector(".modal .bg");
const modal = document.querySelector(".modal");
const addTaskButton = document.querySelector("#add-new-task");

toggleModalButton.addEventListener("click", (e) => {
  e.preventDefault();
  modal.classList.add("active");
});

modalBg.addEventListener("click", () => {
  modal.classList.remove("active");
});

/* ------------------ ADD NEW TASK ------------------ */

addTaskButton.addEventListener("click", (e) => {
  e.preventDefault();

  const taskTitle = document.querySelector("#task").value.trim();
  const taskDescription = document.querySelector("#description").value.trim();

  if (!taskTitle) return alert("Task title required");

  const task = createTask(taskTitle, taskDescription);
  todo.appendChild(task);

  updateCountsAndStorage();
  modal.classList.remove("active");

  document.querySelector("#task").value = "";
  document.querySelector("#description").value = "";
});
