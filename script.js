"use strict";

const localData = JSON.parse(window.localStorage.getItem("todo"));

let todoLists = [];

if (localData) todoLists = localData;

const todoListContainer = document.querySelector(".todo--list");
const addTodoButton = document.querySelector(".add-todo-button");

//generates html block depending upon the todoLists
const generateHtmlBlock = (text, status, index) => {
  return `
  <li>
  <div class="todo--item">
    <div class="todo--content" data-item-no="${index}">
      <div class="icon--text  ${status ? "checked" : ""}">
        <div class="checked--icon">
          <img
            src="./imgs/check-icon.svg"
            alt=""
            class="checked-icon-image"
          />
        </div>

        <p class="todo--text">${text}</p>
      </div>
      <img src="./imgs/trash_icon.svg" alt="" class="trash_img" />
    </div>

    <div class="separator"></div>
  </div>
</li>
    
    `;
};

const handleLastSeparator = () => {
  const lastItemContainer = todoListContainer.lastElementChild;
  if (!lastItemContainer) return;
  const lastItemSeparator = lastItemContainer.querySelector(".separator");
  lastItemSeparator.classList.toggle("hidden");
};

//removes todo
const handleDelete = (index) => {
  todoLists.splice(index, 1);
  window.localStorage.clear();
  window.localStorage.setItem("todo", JSON.stringify(todoLists));

  todoListContainer.innerHTML = "";
  render();
};

const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

//creates todo
const createTodo = (todoText) => {
  handleLastSeparator();
  const uniqueId = generateId();
  todoLists.push({ text: todoText, status: false, id: uniqueId });
  window.localStorage.clear();
  window.localStorage.setItem("todo", JSON.stringify(todoLists));

  console.log(todoLists);
  const markup = generateHtmlBlock(todoText, false, uniqueId);
  todoListContainer.insertAdjacentHTML("beforeend", markup);
  handleLastSeparator();
};

const findTodoIndex = (id) => {
  for (const [i, todo] of todoLists.entries()) {
    if (todo.id === id) return i;
  }
};

//Renders todo items based on html generated
const render = () => {
  let html = "";

  todoLists.forEach((todo, index) => {
    html += generateHtmlBlock(todo.text, todo.status, todo.id);
  });

  todoListContainer.insertAdjacentHTML("afterbegin", html);
  handleLastSeparator();
};

render();

const checkedIcon = document.querySelector(".todo--list");

//LISTENERS

//Listening for check todo and delete todo using event delegation
checkedIcon.addEventListener("click", function (e) {
  let todoIcon = e.target;

  const iconText = todoIcon.closest(".icon--text");
  const todoContent = todoIcon.closest(".todo--content");
  const todoId = todoContent.dataset.itemNo;
  const todoNo = findTodoIndex(todoId);

  if (todoIcon.classList.contains("checked-icon-image"))
    todoIcon = e.target.parentElement;
  else if (todoIcon.className === "trash_img") handleDelete(todoNo);

  if (!todoIcon.classList.contains("checked--icon")) return;

  console.log(todoNo);

  if (!todoLists[todoNo].status) {
    //check todo

    todoLists[todoNo].status = true;
    iconText.classList.add("checked");
  } else {
    //uncheck todo

    todoLists[todoNo].status = false;
    iconText.classList.remove("checked");
  }
});

addTodoButton.addEventListener("click", function (e) {
  const createTodoContainer = e.target.parentElement;
  const todoTextContainer = createTodoContainer.querySelector(".add-todo-text");
  const todoText = todoTextContainer.value;

  createTodo(todoText);
  todoTextContainer.value = "";
});
