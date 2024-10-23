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
    this.toolbar.classList.add('dont-render');
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
    
    this.toolbar.classList.remove('dont-render');
  }

  #handleSearchClick(e) {
    const input_value = this.searchItem.value;
    this.todoItems.forEach(tdi => {
      tdi.reference.classList.remove("dont-render");
    });
    if (input_value !== "") {
      this.todoItems.forEach(tdi => {
        if (!tdi.name.includes(input_value)) {
          tdi.reference.classList.add("dont-render");
        }
      });
    }
  }

  #handleSortSelect(e) {
    let sorter;
    switch (this.sortPrority.value) {
      case "no":
        sorter = new SorterByDate(this.todoItems, this.list);
        break;

      case "important":
        sorter = new SorterByImportant(this.todoItems, this.list);
        break;

      case "done":
        sorter = new SorterByDone(this.todoItems, this.list);
        break;

      default:
        sorter = new SorterByDate(this.todoItems, this.list);
        break;
    }
    sorter.sort();
  }

  #handleFilterClick () {
    this.todoItems.forEach(tdi => {
      tdi.reference.classList.remove("dont-render");
      if (this.filterImportant.checked === true && tdi.important !== this.filterImportant.checked) {
        tdi.reference.classList.add("dont-render");
      }
      if (this.filterDone.checked === true && tdi.done !== this.filterDone.checked) {
        tdi.reference.classList.add("dont-render");
      }
    });
  }

  // End handlers

  #createListItem(value) {
    const newItem = new ToDoItem(value, this);
    this.todoItems.push(newItem);
    this.list.appendChild(newItem.reference);
  }

  deleteItem(t) {
    t.reference.remove();
    this.todoItems.splice(this.todoItems.indexOf(t), 1);
    if (this.todoItems.length <= 0) {
      this.toolbar.classList.add('dont-render');
    }
  }

}

class ToDoItem {
  constructor(name, app_instance) {
    this.name = name;
    this.date = new Date();
    
    this.app = app_instance;

    this.important = false;
    this.done = false;

    const listItem = document.createElement("li");
    listItem.classList.add("list__item");

    const textSpan = document.createElement("span");
    textSpan.classList.add("list__text");
    textSpan.textContent = name;

    this.importantButton = this.#createButton(
      "list__button_important",
      "Важно"
    );
    this.importantButton.addEventListener("click", this.#switchImportant.bind(this));

    this.completeButton = this.#createButton(
      "list__button_complete",
      "Выполнить"
    );
    this.completeButton.addEventListener("click", this.#switchDone.bind(this));

    this.deleteButton = this.#createButton("list__button_delete", "Удалить");
    this.deleteButton.addEventListener("click", this.#removeButton.bind(this));

    listItem.append(textSpan, this.importantButton, this.completeButton, this.deleteButton);
    this.reference = listItem;
  }

  #switchImportant() {
    this.important = !this.important;
    this.reference.classList.toggle("list__item_important");
        this.importantButton.innerText = this.important === true ? "Не важно" : "Важно";
  }

  #createButton(buttonClass, buttonText) {
    const button = document.createElement("button");
    button.classList.add("list__button", buttonClass);
    button.textContent = buttonText;
    return button;
  }

  #switchDone() {
    this.done = !this.done;
    this.reference.classList.toggle("list__item_completed");
        this.completeButton.innerText =
          this.done === true ? "Не выполнено" : "Выполнить";
  }

  #removeButton() {
    this.app.deleteItem(this);
  }
}

// Sort Logic

class Sorter {
  constructor(obj, dom) {
    this.obj = obj;
    this.dom = dom;
  }

  sort() {
    let listItems = Array.from(this.dom.children);
    listItems.sort((a,b) => {
      const indexA = this.obj.findIndex(item => item.reference === a);
      const indexB = this.obj.findIndex(item => item.reference === b);
  
      return indexA - indexB;
    });
    listItems.forEach(item => this.dom.appendChild(item));
  }
}

class SorterByDate extends Sorter {
  sort() {
    this.obj.sort((c1,c2) => c1.date.getTime() - c2.date.getTime())
    super.sort()
  }
}

class SorterByImportant extends Sorter {
  sort() {
    this.obj.sort((c1,c2) => {
      if (c1.important && !c2.important) {
        return -1;
      } else if (!c1.important && c2.important) {
        return 1;
      } else {
        return 0;
      }
    });
    super.sort()
  }
}

class SorterByDone extends Sorter {
  sort() {
    this.obj.sort((c1,c2) => {
      if (c1.done && !c2.done) {
        return -1;
      } else if (!c1.done && c2.done) {
        return 1;
      } else {
        return 0;
      }
    });
    super.sort()
  }
}

// Main Flow

let app = new ToDoApp(document.querySelector(".todo"));