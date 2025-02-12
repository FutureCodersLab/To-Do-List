import { getTaskStructure } from "./structures.js";
let tasks = [];

const input = document.getElementById("input");
const addTaskButton = document.getElementById("add-task");
const taskList = document.getElementById("task-list");

const addTask = () => {
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
        li.className = `task ${task.isComplete ? "completed" : ""}`;
        li.innerHTML = getTaskStructure(task, index);
        taskList.appendChild(li);
    });
};
addTaskButton.addEventListener("click", addTask);
