const API_KEY = "314a93eb-2261-4be3-a2b8-59a64bbfe49e";
const BASE_URL = "https://js1-todo-api.vercel.app/api/todos";

const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const errorMessage = document.getElementById("error-message");
const modal = document.getElementById("modal");
const closeModalButton = document.getElementById("close-modal");

async function fetchTodos() {
  const response = await fetch(`${BASE_URL}?apikey=${API_KEY}`);
  const todos = await response.json();
  displayTodos(todos);
}

function displayTodos(todos) {
  todoList.innerHTML = "";
  todos.forEach((todo) => {
    const li = document.createElement("li");
    li.className = todo.completed ? "completed" : "";
    li.innerHTML = `
      <span>${todo.title}</span>
      <div>
        <button onclick="toggleComplete('${todo._id}', ${
      todo.completed
    })">Mark ${todo.completed ? "Incomplete" : "Complete"}</button>
        <button onclick="deleteTodo('${todo._id}', ${
      todo.completed
    })">Delete</button>
      </div>
    `;
    todoList.appendChild(li);
  });
}

todoForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = todoInput.value.trim();

  if (!title) {
    errorMessage.classList.remove("hidden");
    return;
  }

  errorMessage.classList.add("hidden");

  const response = await fetch(`${BASE_URL}?apikey=${API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });

  const newTodo = await response.json();
  todoInput.value = "";
  fetchTodos();
});

async function toggleComplete(id, completed) {
  await fetch(`${BASE_URL}/${id}?apikey=${API_KEY}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed: !completed }),
  });
  fetchTodos();
}

window.addEventListener("DOMContentLoaded", () => {
  modal.classList.add("flex");
});

async function deleteTodo(id, completed) {
  if (!completed) {
    modal.classList.remove("hidden");
    return;
  }

  await fetch(`${BASE_URL}/${id}?apikey=${API_KEY}`, {
    method: "DELETE",
  });
  fetchTodos();
}

closeModalButton.addEventListener("click", () => {
  modal.classList.add("hidden");
});

fetchTodos();
