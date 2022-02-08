const btnAddTask = document.querySelector('.add');//через объект document и селектор add получаем кнопку для добавления задач и сохраняем в переменную
const todoList = document.querySelector('.left-list');//таким же образом получаем блок для визуализации задач
const settingTaskBar = document.querySelector('.right');//и блок для редактирования задач

let tasks;
!localStorage.tasks ? tasks = [] : tasks = JSON.parse(localStorage.getItem('tasks'));//создаем массив, в случае, если хранилище localStorage пустое, то инициализируем массив без элементов
//иначе, иницилизируем массив имеющимися объектами из localStorage с ключом "tasks"
let taskElem = [];


const createTask = (item, index)=>{//функция добавляет верстку на страницу. Каждый новый блок - новая задача
    return `
        <div class="task ${item.completed ? 'checked' : ''}"> 
            <div class="task-text">${item.taskName}</div>
            <div class="buttons">
                <input onclick="completeTask(${index})" class="complete" type="checkbox" ${item.completed ? 'checked' : ''}>
                <button onclick="settingsTask(${index})" class="btn edit">Edit</button>
                <button onclick="deleteTask(${index})" class="btn delete">Del</button>
            </div>
        </div>
    `
}

const sortTask = () =>{//функция для сортировки задач
    const active = tasks.length && tasks.filter(item => item.completed == false);//в переменной active сохраняем невыполненные задачи с помощью метода filter
    const completed = tasks.length && tasks.filter(item => item.completed == true);//таким же образом в переменную completed сохраняем выполненные задачи
    tasks = [...active,...completed];//пересобираем массив с задачами - сначала активные, следом - выполненные
}

const fillHTMLList = ()=> {//функция для заполнения блока left-list
    todoList.innerHTML = "";//очищаем блок
    if(tasks.length>0){
        sortTask();//вызываем функцию сортировки
        tasks.forEach((item, index)=>{//проходим по каждому элементу в массиве с задачами, функции обратного вызова передаем объект и его индекс
            todoList.innerHTML += createTask(item, index);//добавляем элемент на страницу с помощью функции createTask
        });
        taskElem = document.querySelectorAll('.task');//заполняем массив элементами с селектором task
    }
}

fillHTMLList();//вызываем функцию, чтобы при первом входе на страницу сразу загружались имеющиеся задачи

function Task(){//функция - конструктор, создает объект с необходимыми свойствами, заданными по умолчанию
    this.taskName = `YourTask`;
    this.description = '';
    this.completed = false;
}

const updateLocalStorage = ()=>{//функция добавляет элементы из массива tasks в localStorage по ключу tasks
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

const completeTask = (index) =>{//функция - обработчик, добавляет селектор при нажатии на checkbox
    tasks[index].completed = !tasks[index].completed;//если checkbox был активным, изменяем свойство на противоположное значение и наоборот
    if(tasks[index].completed){
        taskElem[index].classList.add('checked');//если свойство true - добавляем селектор
    } else{
        taskElem[index].classList.remove('checked');//если false - удаляем селектор
    }
    updateLocalStorage();//обновляем хранилище
    fillHTMLList();//заполняем страницу
}

const deleteTask = (index) =>{//функция - обработчик, для удаления из списка задач
    taskElem[index].classList.add('del');//по индексу обращаемся к элементу и добавляем селектор del
    setTimeout(() => {//вызываем функцию setTimeout, для проигрывания анимации и в функции обратного вызова выполняем необходимые действия
        tasks.splice(index,1);//удаляем 1 элемент по индексу
        updateLocalStorage();
        fillHTMLList();
    },1000)
}

const settingsTask = (index) => {//функция - обработчик, для вызова блока редактирования
    settingTaskBar.classList.remove('del-settings');//удаляем селектор, при его наличии
    settingTaskBar.classList.add('emer');//добавляем селектор для проигрывания анимации появления
    settingTaskBar.style.display = 'unset';//устанавливаем стиль дисплея, далее добавляем на страницу блок для редактирования задачи
    settingTaskBar.innerHTML = `
        <div class="task-content">
            <label for="name">Task Name:</label>
            <input id="task-name" class="name" type="text" placeholder="${tasks[index].taskName}">
            <label for="name">Description:</label>
            <textarea id="task-description" class="name description" placeholder="${tasks[index].description ? tasks[index].description : 'Task Description'}"></textarea>
            <button onclick="saveTask(${index})" class="btn save">Save</button>
        </div>
    `
}

const saveTask = (index) => {//функция - обработчик, для сохранения информации в массиве tasks
    tasks[index].taskName = document.getElementById('task-name').value ? document.getElementById('task-name').value : tasks[index].taskName;//если поле ввода не заполненно,
    //то оставляем текущее название
    tasks[index].description = document.getElementById('task-description').value ? document.getElementById('task-description').value : tasks[index].description;// аналогично предыдущему
    settingTaskBar.classList.remove('emer');//удаляем селектор
    settingTaskBar.classList.add('del-settings');//добавляем селектор для проигрывания анимации
    setTimeout(()=>{//вызываем функцию setTimeout, для правильного проигрывания анимации
        settingTaskBar.style.display = 'none'; //устанавливаем стиль дисплея
    },900);
    updateLocalStorage();
    fillHTMLList();
}

btnAddTask.addEventListener('click',()=>{//привязываем слушатель событий в кнопке add
    tasks.push(new Task());//добавляем в массив tasks новый объект
    updateLocalStorage();
    fillHTMLList();
})