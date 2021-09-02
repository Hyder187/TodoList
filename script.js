"use strict";

const localData = JSON.parse(window.localStorage.getItem("todo"));
console.log("array", localData);

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
      <div class="icon--text  ${status === 1 ? "checked" : ""}">
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

//removes todo
const handleDelete = (listItem) => {
  console.log("delete called");
  const todoNo = +listItem.dataset.itemNo;
  todoLists.splice(todoNo, todoNo);
  window.localStorage.clear();
  window.localStorage.setItem("todo", JSON.stringify(todoLists));

  todoListContainer.innerHTML = "";
  render();
};

//creates todo
const createTodo = (todoText) => {
  todoLists.push({ text: todoText, status: 0 });
  window.localStorage.clear();
  window.localStorage.setItem("todo", JSON.stringify(todoLists));

  const markup = generateHtmlBlock(todoText, 0, todoLists.length - 1);
  todoListContainer.insertAdjacentHTML("beforeend", markup);
};

//Renders todo items based on html generated
const render = () => {
  console.log(todoLists);
  let html = "";

  todoLists.forEach((todo, index) => {
    html += generateHtmlBlock(todo.text, todo.status, index);
  });

  todoListContainer.insertAdjacentHTML("afterbegin", html);
};

render();

const checkedIcon = document.querySelector(".todo--list");

//LISTENERS

//Listening for check todo and delete todo usiing event delegation
checkedIcon.addEventListener("click", function (e) {
  let todoIcon = e.target;
  if (todoIcon.classList.contains("checked-icon-image")) {
    todoIcon = e.target.parentElement;
    console.log(todoIcon);
  } else if (todoIcon.className === "trash_img") {
    // handleDeleteEvents();
    handleDelete(todoIcon.parentElement);
  }
  if (!todoIcon.classList.contains("checked--icon"))
    //guard statement
    return;

  //getting properties to manipulate
  const iconText = todoIcon.closest(".icon--text");
  const todoText = iconText.querySelector(".todo--text");
  const iconTick = iconText.querySelector(".checked-icon-image");
  const todoContent = todoIcon.closest(".todo--content");
  const todoNo = +todoContent.dataset.itemNo;

  //manipulating data on whether todo is checked or not
  if (todoLists[todoNo].status === 0) {
    //check todo
    todoLists[todoNo].status = 1;
    iconTick.classList.remove("hidden");
    todoIcon.style.backgroundColor = "#dd9b98";
    todoIcon.style.border = "none";
    todoText.style.textDecoration = "line-through";
  } else {
    //uncheck todo
    todoLists[todoNo].status = 0;
    iconTick.classList.add("hidden");
    todoIcon.style.backgroundColor = "#FFFFFE";
    todoIcon.style.border = "solid 2px #32414f";
    todoText.style.textDecoration = "none";
  }
});

addTodoButton.addEventListener("click", function (e) {
  const createTodoContainer = e.target.parentElement;
  const todoTextContainer = createTodoContainer.querySelector(".add-todo-text");
  const todoText = todoTextContainer.value;

  createTodo(todoText);

  todoTextContainer.value = "";
});
