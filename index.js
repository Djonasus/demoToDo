"use strict";

class ToDoApp {
  constructor(element) {
    this.todo = element;

    this.todoItems = [];
    
    this.#init();
  }

  #init() {
    this.#findElements();
    this.#addListeners();
    this.toolbar.style.display = 'none';
  }

  #findElements() {
    this.form = this.todo.querySelector(".todo__form");
    this.input = this.form.querySelector(".form__input");
    this.addButton = this.form.querySelector(".form__button");

    this.list = this.todo.querySelector(".todo__list");

    // Toolbar actions
    this.toolbar = this.todo.querySelector(".todo__toolbar");
    this.searchItem = document.getElementById('toolbar-search');
    this.searchButton = document.getElementById('toolbar-search-button');

    this.sortPrority = document.getElementById('toolbar-sort');
    
    this.filterImportant = document.getElementById('filter-important');
    this.filterDone = document.getElementById('filter-done');
  }

  #addListeners() {
    this.form.addEventListener("submit", this.#handleFormSubmit.bind(this));

    this.searchButton.addEventListener("click", this.#handleSearchClick.bind(this));
    this.sortPrority.addEventListener("change", this.#handleSortSelect.bind(this));

    this.filterImportant.addEventListener("click", this.#handleFilterClick.bind(this));
    this.filterDone.addEventListener("click", this.#handleFilterClick.bind(this));
  }

  // Handlers
  #handleFormSubmit(e) {
    e.preventDefault();
    const value = this.input.value;
    this.input.value = "";
    if (value.trim().length === 0) return;

    this.#createListItem(value);
    
    this.toolbar.style.display = 'flex';
  }

  #handleSearchClick(e) {
    const input_value = this.searchItem.value;
    this.todoItems.forEach(tdi => {
      tdi.reference.style.display = "grid";
    });
    if (input_value !== "") {
      this.todoItems.forEach(tdi => {
        if (!tdi.name.includes(input_value)) {
          tdi.reference.style.display = "none";
        }
      });
    }
  }

  #handleSortSelect(e) {
    switch (this.sortPrority.value) {
      case "no":
        this.todoItems.sort((c1,c2) => c1.date.getTime() - c2.date.getTime());
        break;

      case "important":
        this.todoItems.sort((c1,c2) => {
          if (c1.important && !c2.important) {
            return -1;
          } else if (!c1.important && c2.important) {
            return 1;
          } else {
            return 0;
          }
        });
        break;

        case "done":
          this.todoItems.sort((c1,c2) => {
            if (c1.done && !c2.done) {
              return -1;
            } else if (!c1.done && c2.done) {
              return 1;
            } else {
              return 0;
            }
          });
          break;
    }
    let listItems = Array.from(this.list.children);
    listItems.sort((a,b) => {
      const indexA = this.todoItems.findIndex(item => item.reference === a);
      const indexB = this.todoItems.findIndex(item => item.reference === b);
  
      return indexA - indexB;
    });
    listItems.forEach(item => this.list.appendChild(item));
  }

  #handleFilterClick () {
    this.todoItems.forEach(tdi => {
      tdi.reference.style.display = 'grid';
      if (this.filterImportant.checked == true && tdi.important != this.filterImportant.checked) {
        tdi.reference.style.display = 'none';
      }
      if (this.filterDone.checked == true && tdi.done != this.filterDone.checked) {
        tdi.reference.style.display = 'none';
      }
    });
  }

  // End handlers

  #createListItem(value) {
    const newItem = new ToDoItem(value);
    this.todoItems.push(newItem);
    this.list.appendChild(newItem.reference);
  }

  deleteItem(t) {
    t.reference.remove();
    this.todoItems.splice(this.todoItems.indexOf(t), 1);
    if (this.todoItems.length <= 0) {
      this.toolbar.style.display = 'none';
    }
  }

}

class ToDoItem {
  constructor(name) {
    this.name = name;
    this.date = new Date();
    const listItem = document.createElement("li");
    listItem.classList.add("list__item");

    const textSpan = document.createElement("span");
    textSpan.classList.add("list__text");
    textSpan.textContent = name;

    this.importantButton = this.#createButton(
      "list__button_important",
      "Важно"
    );
    this.importantButton.addEventListener("click", this.#SwitchImportant.bind(this));

    this.completeButton = this.#createButton(
      "list__button_complete",
      "Выполнить"
    );
    this.completeButton.addEventListener("click", this.#SwitchDone.bind(this));

    this.deleteButton = this.#createButton("list__button_delete", "Удалить");
    this.deleteButton.addEventListener("click", this.#RemoveButton.bind(this));

    listItem.append(textSpan, this.importantButton, this.completeButton, this.deleteButton);
    this.reference = listItem;
  }

  #SwitchImportant() {
    this.important = !this.important;
    this.reference.classList.toggle("list__item_important");
        this.importantButton.innerText = this.important == true ? "Не важно" : "Важно";
  }

  #createButton(buttonClass, buttonText) {
    const button = document.createElement("button");
    button.classList.add("list__button", buttonClass);
    button.textContent = buttonText;
    return button;
  }

  #SwitchDone() {
    this.done = !this.done;
    this.reference.classList.toggle("list__item_completed");
        this.completeButton.innerText =
          this.done == true ? "Не выполнено" : "Выполнить";
  }

  #RemoveButton() {
    app.deleteItem(this);
  }
}

var app = new ToDoApp(document.querySelector(".todo"));
