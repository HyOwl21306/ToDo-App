if (localStorage.theme === "dark") {
    document.documentElement.classList.add("dark");
}

function toggleTheme()  {
    const isDark = document.documentElement.classList.contains("dark");
    if (isDark) {
        document.documentElement.classList.remove("dark");
        localStorage.theme = "light";
    } else {
        document.documentElement.classList.add("dark");
        localStorage.theme = "dark";
    }
}

const display = document.querySelector('.create');
const removeBtns = document.querySelectorAll('.removeBtn');
const todoList = document.querySelector('.todo-list');
const items = document.querySelectorAll('.item');

function clearDisplay() {
    display.value = '';
}


display.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const data = display.value.trim();
        if (data) {
            appendTask(data);
            clearDisplay();
        }
    }
});

function appendTask(data) {

    const innerHTML = `
        <div class="item" draggable="true">
            <div class="px-3 py-3 flex items-center lg:px-6 lg:py-5">
                <div class="p-auto">
                    <input type="checkbox" class="
                    checkbox peer checked:bg-sky-300 checked:bg-[url('/images/icon-check.svg')] 
                    checked:bg-center checked:bg-no-repeat
                    ">
                </div>
                <p class="task">${data}</p>
                <button class="removeBtn"><img src="./images/icon-cross.svg"></button>
            </div>
            <hr class="text-Gray-300 dark:text-Purple-600">
        </div>
    `
    todoList.insertAdjacentHTML('beforeend', innerHTML);
    updateState();
    saveToLocalStorage();
}

todoList.addEventListener("click", (e) => {
    const removeBtn = e.target.closest('.removeBtn');
    if (!removeBtn) return;

    const item = removeBtn.closest('.item');
    if (!item) return;

    item.remove();

    updateState();
    saveToLocalStorage();
})


todoList.addEventListener("change", (e) => {
    if (e.target.classList.contains('checkbox')) {
        const tasktext = e.target.parentElement.nextElementSibling;
        tasktext.classList.toggle('line-through', e.target.checked);
        saveToLocalStorage();
    }
    updateState();
})

updateState();

function updateState() {
    let total = 0;
    document.querySelectorAll('.item').forEach((item) => {
        const checkbox = item.children[0].children[0].children[0];
        if (!checkbox.checked) {
            total++;
        }
    })
    clearCompleted();
    document.querySelector('.state>p').innerHTML = `${total} items left`;
}

function clearCompleted() {
    const clearBtn = document.querySelector('.state>button');

    clearBtn.addEventListener("click", () => {
        document.querySelectorAll('.item').forEach((item) => {
            const checkbox = item.children[0].children[0].children[0];
            if (checkbox.checked) {
                item.remove();
                saveToLocalStorage();
            }
        });
    });
}

const allBtn = document.querySelector('.all');
const activeBtn = document.querySelector('.active');
const completedBtn = document.querySelector('.completed');

function removeHidden() {
    document.querySelectorAll('.item').forEach((item) => {
        if (item.classList.contains('hidden')) {
            item.classList.remove('hidden');
        }
    });
}

function filter() {
    allBtn.addEventListener("click", () => {
        allBtn.classList.add('text-sky-300');
        activeBtn.classList.remove('text-sky-300');
        completedBtn.classList.remove('text-sky-300');

        removeHidden();
    })

    activeBtn.addEventListener("click", () => {
        allBtn.classList.remove('text-sky-300');
        activeBtn.classList.add('text-sky-300');
        completedBtn.classList.remove('text-sky-300');

        removeHidden();

        document.querySelectorAll('.item').forEach((item) => {
            const checkbox = item.children[0].children[0].children[0];
            if (checkbox.checked) {
                item.classList.add('hidden');
            }
        });
    })

    completedBtn.addEventListener("click", () => {
        allBtn.classList.remove('text-sky-300');
        activeBtn.classList.remove('text-sky-300');
        completedBtn.classList.add('text-sky-300');

        removeHidden();

        document.querySelectorAll('.item').forEach((item) => {
            const checkbox = item.children[0].children[0].children[0];
            if (!checkbox.checked) {
                item.classList.add('hidden');
            }
        });
    })
}

filter();

let draggedItem = null;

todoList.addEventListener('dragstart', (e) => {
    if (e.target.classList.contains('item')) {
        draggedItem = e.target;
    }
})

todoList.addEventListener('dragover', (e) => {
    e.preventDefault();
    const targetItem = e.target.closest('.item')
    if (targetItem && targetItem!==draggedItem) {
        const rect = targetItem.getBoundingClientRect();
        const nextPosition = (e.clientY < rect.top + rect.height/2) ? 'before' : 'after';

        if (nextPosition === 'before') {
            todoList.insertBefore(draggedItem, targetItem);
        } else {
            todoList.insertBefore(draggedItem, targetItem.nextElementSibling);
        }
        saveToLocalStorage();
    }
});

function saveToLocalStorage() {
    const items = document.querySelectorAll('.item');

    const taskData = Array.from(items).map(task => {
        return {
            text: task.querySelector('.task').textContent,
            completed: task.querySelector('input[type="checkbox').checked
        };
    });

    localStorage.setItem('items', JSON.stringify(taskData));
}

function loadFromLocalStorage() {
    const savedTasks = localStorage.getItem('items');

    if (savedTasks) {
        const taskData = JSON.parse(savedTasks);
        taskData.forEach(task => {
            const taskHTML = `
                <div class="item" draggable="true">
                    <div class="px-3 py-3 flex items-center lg:px-6 lg:py-5">
                        <div class="p-auto">
                            <input type="checkbox" ${task.completed ? 'checked': ''} class="
                            checkbox peer checked:bg-sky-300 checked:bg-[url('/images/icon-check.svg')] 
                            checked:bg-center checked:bg-no-repeat
                            ">
                        </div>
                        <p class="task">${task.text}</p>
                        <button class="removeBtn"><img src="./images/icon-cross.svg"></button>
                    </div>
                    <hr class="text-Gray-300 dark:text-Purple-600">
                </div>            
            `
            todoList.insertAdjacentHTML('beforeend', taskHTML);
        })
    }
}

document.addEventListener('DOMContentLoaded', loadFromLocalStorage);