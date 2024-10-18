export const getTaskStructure = (task, index) => {
    return `
        <div class="checkbox-container">
            <input
                type="checkbox"
                class="checkbox"
                id="checkbox-${index}"
                ${task.isComplete ? "checked" : ""}
            />
            <label htmlFor="checkbox-${index}">${task.text}</label>
        </div>
        <div class="actions">
            <button class="edit">
                <span class="material-symbols-rounded task-icon">
                    edit_square
                </span>
            </button>
            <button class="delete">
                <span class="material-symbols-rounded task-icon">
                    delete
                </span>
            </button>
        </div>
    `;
};
`

`;
