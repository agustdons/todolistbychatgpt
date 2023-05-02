// Selecting the necessary elements
const form = document.querySelector('#todo-form');
const input = document.querySelector('#todo-input');
const taskList = document.querySelector('#task-list');
const taskDoneList = document.querySelector('#task-done');
const clearTasksBtn = document.querySelector('#clear-tasks-btn');

// Function to create a new task item
function createTaskItem(taskText) {
  const taskItem = document.createElement('li');
  taskItem.draggable = true;
  taskItem.innerHTML = `
    <span class="task-text">${taskText}</span>
    <button class="done-btn">Done</button>
    <button class="in-process-btn">In Process</button>
  `;

  const doneButton = taskItem.querySelector('.done-btn');
  doneButton.addEventListener('click', () => {
    taskItem.remove();
    const doneTask = document.createElement('li');
    doneTask.textContent = taskText;
    taskDoneList.appendChild(doneTask);
  });

  const inProcessButton = taskItem.querySelector('.in-process-btn');
  inProcessButton.addEventListener('click', () => {
    taskItem.classList.toggle('in-process');
  });

  taskItem.addEventListener('dragstart', (event) => {
    event.dataTransfer.setData('text/plain', taskText);
    event.target.style.opacity = '0.4';
  });

  taskItem.addEventListener('dragend', (event) => {
    event.target.style.opacity = '1';
  });

  return taskItem;
}

// Function to handle form submission
function addTask(event) {
  event.preventDefault();
  const taskText = input.value.trim();
  if (taskText !== '') {
    const taskItem = createTaskItem(taskText);
    taskList.appendChild(taskItem);
    input.value = '';
  }
}

// Function to handle task drag and drop
function handleTaskDragAndDrop(event) {
  event.preventDefault();
  const draggedTaskText = event.dataTransfer.getData('text/plain');
  const targetTask = event.target.closest('li');
  if (targetTask) {
    const taskItems = Array.from(taskList.querySelectorAll('li'));
    const draggedTaskIndex = taskItems.findIndex(
      (task) => task.querySelector('.task-text').textContent === draggedTaskText
    );
    const targetTaskIndex = taskItems.findIndex(
      (task) => task === targetTask
    );
    if (draggedTaskIndex !== -1 && targetTaskIndex !== -1 && draggedTaskIndex !== targetTaskIndex) {
      const [removedTask] = taskItems.splice(draggedTaskIndex, 1);
      taskItems.splice(targetTaskIndex, 0, removedTask);
      taskList.innerHTML = '';
      taskItems.forEach((taskItem) => taskList.appendChild(taskItem));
    }
  }
}

// Function to clear all done tasks
function clearTasks() {
  taskDoneList.innerHTML = '';
}

// Event listeners
form.addEventListener('submit', addTask);
taskList.addEventListener('dragover', (event) => event.preventDefault());
taskList.addEventListener('drop', handleTaskDragAndDrop);
clearTasksBtn.addEventListener('click', clearTasks);
