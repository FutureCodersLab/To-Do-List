import { getTaskStructure } from "./structures.js";

const input = document.getElementById("input");
const form = document.querySelector("form");
const taskList = document.getElementById("task-list");

let tasks = [];

document.addEventListener("DOMContentLoaded", () => {
    form.addEventListener("submit", submitTask);
});

const submitTask = (e) => {
    e.preventDefault();
    const text = input.value.trim();

    if (!text) return;

    tasks.push({ text, isComplete: false });

    form.reset();
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
