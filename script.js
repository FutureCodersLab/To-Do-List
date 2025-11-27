import { getTaskStructure } from "./structures.js";

const input = document.querySelector("input");
const form = document.querySelector("form");
const taskListContainer = document.getElementById("task-list");

let tasks = [];
// {text: "do homework", completed: false}

document.addEventListener("DOMContentLoaded", () => {
    form.addEventListener("submit", submitTask);
});

const submitTask = (e) => {
    e.preventDefault();
    const text = input.value.trim();

    if (!text) return;

    tasks.push({ text, completed: false });

    form.reset();
    updateTaskList();
};

const updateTaskList = () => {
    taskListContainer.innerHTML = "";

    tasks.forEach((task, index) => {
        const li = document.createElement("li");

        const completedClass = task.completed ? "completed" : "";
        li.className = `task ${completedClass}`;

        li.innerHTML = getTaskStructure(task, index);
        taskListContainer.appendChild(li);
    });
};
