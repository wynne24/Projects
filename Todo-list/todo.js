const todoList = JSON.parse(localStorage.getItem("list")) || [];

function save() {
  localStorage.setItem("list", JSON.stringify(todoList));
}

function inputError(input) {
  input.focus();
  setTimeout(() => {
    input.classList.remove("input-error");
  }, 1500);
}

function addTodo() {
  let todoListHTML = "";

  todoList.forEach((todo) => {
    const { name, dueDate } = todo;

    const html = `
        <div>${name}</div>
        <div>${dueDate}</div>
        <button class="delete-btn js-delete-btn">
          Delete
        </button>
      `;
    todoListHTML += html;
  });

  document.querySelector(".todo-list").innerHTML = todoListHTML;

  document.querySelectorAll(".js-delete-btn").forEach((deleteBtn, i) => {
    deleteBtn.addEventListener("click", () => {
      todoList.splice(i, 1);
      addTodo();
      save();
    });
  });
}

document.querySelector(".js-add-btn").addEventListener("click", () => {
  const inputElement = document.querySelector(".js-name-input");
  const name = inputElement.value;
  const inputDate = document.querySelector(".js-date-input");
  const dueDate = inputDate.value;

  if (name === "") {
    inputElement.classList.add("input-error");
    inputError(inputElement);
  } else if (dueDate === "") {
    inputDate.classList.add("input-error");
    inputError(inputDate);
  } else {
    todoList.push({
      name,
      dueDate,
    });

    inputElement.value = "";
    inputDate.value = "";

    addTodo();
    save();
  }
});

addTodo();
