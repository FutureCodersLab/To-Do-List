import { addIcon, editIcon } from "./icons.js";
import { getTaskStructure } from "./structures.js";

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
    document.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            addTask();
        }
    });

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

    const taskElement = target.parentElement.parentElement;
    taskElement.classList.toggle("completed");

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
        const li = document.createElement("li");
        li.className = `task ${task.isComplete ? "completed" : ""}`;
        li.innerHTML = getTaskStructure(task, index);

        taskList.appendChild(li);

        const checkbox = li.querySelector(".checkbox");
        checkbox.addEventListener("change", (e) =>
            toggleTaskCompleted(index, e.target)
        );

        const editButton = li.querySelector(".edit");
        editButton.addEventListener("click", (e) => editTask(index, e.target));

        const deleteButton = li.querySelector(".delete");
        deleteButton.addEventListener("click", () => deleteTask(index));
    });
};

const updateStats = () => {
    const taskSummary = document.getElementById("task-summary");
    const progress = document.getElementById("progress");

    const totalCompletedTasks = tasks.filter((task) => task.isComplete).length;
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
