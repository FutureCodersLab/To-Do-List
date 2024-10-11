import { addIcon, editIcon, editSquareIcon, deleteIcon } from "./icons.js";

let tasks = [];
let editIndex = null;

const input = document.getElementById("input");
const addTaskButton = document.getElementById("add-task");
const taskList = document.getElementById("task-list");

document.addEventListener("DOMContentLoaded", () => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (storedTasks) {
        tasks = storedTasks;
        updateTaskList();
        updateStats();
    }
});

const createElementWithAttributes = (tag, attributes) => {
    const element = document.createElement(tag);
    Object.entries(attributes).forEach(([key, value]) => {
        element[key] = value;
    });
    return element;
};

const addTask = () => {
    const text = input.value.trim();
    if (!text) return;

    if (editIndex !== null) {
        tasks[editIndex].text = text;
        editIndex = null;
        Array.from(taskList.children).forEach((task) =>
            task.classList.remove("editing")
        );
    } else {
        tasks.push({ text, completed: false });
    }

    addTaskButton.innerHTML = addIcon;
    input.value = "";
    updateTaskList();
    updateStats();
    saveTasks();
};
const toggleTaskComplete = (index) => {
    tasks[index].completed = !tasks[index].completed;
    updateTaskList();
    updateStats();
    saveTasks();
};
const updateStats = () => {
    const taskSummary = document.getElementById("task-summary");
    const progressBar = document.getElementById("progress");

    const totalCompletedTasks = tasks.filter((task) => task.completed).length;
    const totalTasks = tasks.length;
    const progress = (totalCompletedTasks / totalTasks) * 100;

    progressBar.style.width = `${progress}%`;

    taskSummary.innerText = `${totalCompletedTasks} / ${totalTasks}`;
};

const deleteTask = (index) => {
    tasks.splice(index, 1);
    updateTaskList();
    updateStats();
    saveTasks();
};

const editTask = (index, target) => {
    Array.from(taskList.children).forEach((task) =>
        task.classList.remove("editing")
    );
    const task = target.parentElement.parentElement;
    task.classList.add("editing");
    input.value = tasks[index].text;
    editIndex = index;
    addTaskButton.innerHTML = editIcon;
};

const saveTasks = () => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

const updateTaskList = () => {
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
        const li = createElementWithAttributes("li", {
            className: `task ${task.completed ? "completed" : ""}`,
        });

        const checkboxContainer = createCheckboxContainer(task, index);

        const actions = createActionsContainer(index);

        li.appendChild(checkboxContainer);
        li.appendChild(actions);

        taskList.appendChild(li);
    });
};

const createCheckboxContainer = (task, index) => {
    const checkboxId = `checkbox-${index}`;

    const checkboxContainer = createElementWithAttributes("div", {
        className: "checkbox-container",
    });

    const checkbox = createElementWithAttributes("input", {
        type: "checkbox",
        className: "checkbox",
        id: checkboxId,
        checked: task.completed,
    });
    const label = createElementWithAttributes("label", {
        htmlFor: checkboxId,
        textContent: task.text,
    });

    checkbox.addEventListener("change", () => toggleTaskComplete(index));

    checkboxContainer.appendChild(checkbox);
    checkboxContainer.appendChild(label);

    return checkboxContainer;
};

const createActionsContainer = (index) => {
    const actions = createElementWithAttributes("div", {
        className: "actions",
    });

    const editButton = createElementWithAttributes("button", {
        innerHTML: editSquareIcon,
    });
    editButton.addEventListener("click", (e) => editTask(index, e.target));

    const deleteButton = createElementWithAttributes("button", {
        className: "delete",
        innerHTML: deleteIcon,
    });
    deleteButton.addEventListener("click", () => deleteTask(index));

    actions.appendChild(editButton);
    actions.appendChild(deleteButton);

    return actions;
};

addTaskButton.addEventListener("click", addTask);

const microphone = document.getElementById("microphone");

const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.lang = "en-US";
// recognition.lang = "es-ES";
// recognition.lang = "mn-MN";
recognition.interimResults = false;
recognition.maxAlternatives = 1;

recognition.addEventListener("result", (event) => {
    const speechToText = event.results[0][0].transcript;
    input.value = speechToText;
    // if (speechToText.split(" ").includes("add")) {
    //     input.value = speechToText.replace("add", "").trim();
    //     addTask();
    // }
});

recognition.addEventListener("end", () => {
    recognition.stop();
    input.classList.remove("active");
});

microphone.addEventListener("click", () => {
    recognition.start();
    input.classList.add("active");
});
