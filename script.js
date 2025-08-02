import { addIcon, editIcon } from "./icons.js";
import { getTaskStructure } from "./structures.js";

const input = document.getElementById("input");
const submitTaskButton = document.getElementById("submit-task");
const taskList = document.getElementById("task-list");
const taskSummary = document.getElementById("task-summary");
const progress = document.getElementById("progress");
const microphone = document.getElementById("microphone");

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

    submitTaskButton.addEventListener("click", submitTask);
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        submitTask();
    }
});

const submitTask = () => {
    const text = input.value.trim();

    if (!text) return;

    const editingTask = tasks.find((task) => task.isEditing);

    if (editingTask) {
        editingTask.text = text;
        editingTask.isEditing = false;
        submitTaskButton.innerHTML = addIcon;
    } else {
        tasks.push({ text, isComplete: false, isEditing: false });
    }

    input.value = "";
    updateTaskList();
    updateStats();
    saveTasks();
};

const toggleTaskCompleted = (index) => {
    const selectedTask = tasks[index];
    selectedTask.isComplete = !selectedTask.isComplete;

    updateTaskList();
    updateStats();
    saveTasks();
};

const editTask = (index) => {
    tasks.forEach((task) => {
        task.isEditing = false;
    });

    const selectedTask = tasks[index];
    selectedTask.isEditing = true;

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
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
        const li = document.createElement("li");

        const isCompletedClassName = task.isComplete ? "completed" : "";
        const isEditingClassName = task.isEditing ? "editing" : "";
        li.className = `task ${isCompletedClassName} ${isEditingClassName}`;

        li.innerHTML = getTaskStructure(task, index);

        const checkbox = li.querySelector(".checkbox");
        checkbox.addEventListener("change", () => toggleTaskCompleted(index));

        const editButton = li.querySelector(".edit");
        editButton.addEventListener("click", () => editTask(index));

        const deleteButton = li.querySelector(".delete");
        deleteButton.addEventListener("click", () => deleteTask(index));

        taskList.appendChild(li);
    });
};

const updateStats = () => {
    const completedTasks = tasks.filter((task) => task.isComplete);
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
