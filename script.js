import { createElementWithAttributes } from "./helpers.js";
import { addIcon, deleteIcon, editIcon, editSquareIcon } from "./icons.js";

let tasks = [];
let editIndex = null;

const input = document.getElementById("input");
const addTaskButton = document.getElementById("add-task");
const taskList = document.getElementById("task-list");
const microphone = document.getElementById("microphone");

document.addEventListener("DOMContentLoaded", () => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks"));

    if (storedTasks) {
        tasks = storedTasks;
        updateTaskList();
        updateStats();
    }

    addTaskButton.addEventListener("click", addTask);

    const recognition = setUpSpeechRecognition();

    microphone.addEventListener("click", () => {
        recognition.start();
        input.classList.add("active");
    });

    recognition.addEventListener("end", () => {
        recognition.stop();
        input.classList.remove("active");
    });

    recognition.addEventListener("result", (e) => {
        const speechToText = e.results[0][0].transcript;
        input.value = speechToText;
    });
});

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
        tasks.push({ text, isComplete: false });
    }

    addTaskButton.innerHTML = addIcon;
    input.value = "";

    updateTaskList();
    updateStats();
    saveTasks();
};

const toggleTaskCompleted = (index, target) => {
    tasks[index].isComplete = !tasks[index].isComplete;

    const task = target.parentElement.parentElement;
    task.classList.toggle("completed");

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

const deleteTask = (index) => {
    tasks.splice(index, 1);
    updateTaskList();
    updateStats();
    saveTasks();
};

const saveTasks = () => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

const updateTaskList = () => {
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
        const li = createElementWithAttributes("li", {
            className: `task ${task.isComplete ? "completed" : ""}`,
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
        checked: task.isComplete,
    });

    checkbox.addEventListener("change", (e) =>
        toggleTaskCompleted(index, e.target)
    );

    const label = createElementWithAttributes("label", {
        htmlFor: checkboxId,
        textContent: task.text,
    });

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

const updateStats = () => {
    const taskSummary = document.getElementById("task-summary");
    const progress = document.getElementById("progress");

    const totalCompletedTasks = tasks.filter((task) => task.isComplete).length;
    const totalTasks = tasks.length;
    const completionPercentage = (totalCompletedTasks / totalTasks) * 100;

    progress.style.width = `${completionPercentage}%`;

    taskSummary.textContent = `${totalCompletedTasks} / ${totalTasks}`;
};

const setUpSpeechRecognition = () => {
    const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    // recognition.lang = "es-ES";
    // recognition.lang = "mn-MN";
    // recognition.lang = "ru-RU";
    // recognition.lang = "ky-KG";
    // recognition.lang = "zh-TW";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    return recognition;
};
