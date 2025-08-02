import { getTaskStructure } from "./structures.js";

const input = document.getElementById("input");
const submitTaskButton = document.getElementById("submit-task");
const taskList = document.getElementById("task-list");

let tasks = [];

document.addEventListener("DOMContentLoaded", () => {
    submitTaskButton.addEventListener("click", submitTask);
});

const submitTask = () => {
    const text = input.value.trim();

    if (!text) return;

    tasks.push({ text, isComplete: false });

    input.value = "";
    updateTaskList();
};

const updateTaskList = () => {
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
        const li = document.createElement("li");

        const isCompletedClassName = task.isComplete ? "completed" : "";
        li.className = `task ${isCompletedClassName}`;

        li.innerHTML = getTaskStructure(task, index);
        taskList.appendChild(li);
    });
};
