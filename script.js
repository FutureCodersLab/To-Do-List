import { addIcon, editIcon } from "./icons.js";
import { getTaskStructure } from "./structures.js";

const input = document.querySelector("input");
const form = document.querySelector("form");
const taskListContainer = document.getElementById("task-list");
const taskSummary = document.getElementById("task-summary");
const progress = document.getElementById("progress");
const microphone = document.getElementById("microphone");
const submitTaskButton = document.getElementById("submit-task");

let tasks = [];

document.addEventListener("DOMContentLoaded", () => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks"));

    if (storedTasks) {
        tasks = storedTasks;
        updateTaskList();
        updateStats();
    }

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

    form.addEventListener("submit", submitTask);
});

const submitTask = (e) => {
    e.preventDefault();
    const text = input.value.trim();

    if (!text) return;

    const editingTask = tasks.find((task) => task.editing);

    if (editingTask) {
        editingTask.text = text;
        editingTask.editing = false;
        submitTaskButton.innerHTML = addIcon;
    } else {
        tasks.push({ text, completed: false, editing: false });
    }

    form.reset();
    updateTaskList();
    updateStats();
    saveTasks();
};

const toggleTaskCompleted = (index) => {
    const selectedTask = tasks[index];
    selectedTask.completed = !selectedTask.completed;

    updateTaskList();
    updateStats();
    saveTasks();
};

const editTask = (index) => {
    tasks.forEach((task) => {
        task.editing = false;
    });

    const selectedTask = tasks[index];
    selectedTask.editing = true;

    input.value = selectedTask.text;
    submitTaskButton.innerHTML = editIcon;

    updateTaskList();
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
    taskListContainer.innerHTML = "";

    tasks.forEach((task, index) => {
        const li = document.createElement("li");

        const completedClass = task.completed ? "completed" : "";
        const editingClass = task.editing ? "editing" : "";
        li.className = `task ${completedClass} ${editingClass}`;

        li.innerHTML = getTaskStructure(task, index);

        const checkbox = li.querySelector(".checkbox");
        checkbox.addEventListener("change", () => toggleTaskCompleted(index));

        const editButton = li.querySelector(".edit");
        editButton.addEventListener("click", () => editTask(index));

        const deleteButton = li.querySelector(".delete");
        deleteButton.addEventListener("click", () => deleteTask(index));

        taskListContainer.appendChild(li);
    });
};

const updateStats = () => {
    const completedTasks = tasks.filter((task) => task.completed);
    const totalCompletedTasks = completedTasks.length;
    const totalTasks = tasks.length;

    const completionPercentage = (totalCompletedTasks / totalTasks) * 100 || 0;
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
