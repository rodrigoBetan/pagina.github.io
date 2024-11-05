const todos = []; // Array para las tareas pendientes
const completedTodos = []; // Array para las tareas completadas

function addTodo() {
    const textbox = document.getElementById('todo-title');
    const title = textbox.value.trim(); // Eliminar espacios en blanco
    const datePicker = document.getElementById('date-picker');
    const dueDate = datePicker.value;

    // Validación para que el título no esté vacío
    if (!title) {
        alert("Por favor, ingresa un título para la tarea.");
        return;
    }

    // Verifica si la fecha es válida y si está en un día de lunes a sábado
    const dueDateObject = new Date(dueDate);
    const dias = dueDateObject.getUTCDay();

    if (dias < 1 || dias > 6) { // 1 es Lunes y 6 es Sábado
        alert("Por favor, elige una fecha de lunes a sábado.");
        return;
    }

    // Agregar la tarea al array
    todos.push({ title: title, dueDate: dueDate });
    saveTodos(); // Guarda los cambios
    render(); // Renderiza la lista de tareas
}

function deleteTodo(index) {
    todos.splice(index, 1); // Eliminar la tarea del array
    saveTodos(); // Guarda los cambios
    render(); // Renderiza la lista de tareas
}

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos)); // Guardar tareas pendientes
    localStorage.setItem('completedTodos', JSON.stringify(completedTodos)); // Guarda tareas completadas
}

function loadTodos() {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
        todos.push(...JSON.parse(savedTodos)); // Cargar tareas pendientes
    }
    const savedCompletedTodos = localStorage.getItem('completedTodos');
    if (savedCompletedTodos) {
        completedTodos.push(...JSON.parse(savedCompletedTodos)); // Cargar tareas completadas
    }
    render(); // Renderizar la lista de tareas
}

function clearAllTodos() {
    todos.length = 0; // Vaciar el array de tareas
    completedTodos.length = 0; // Vaciar el array de tareas completadas
    saveTodos(); // Guarda los cambios
    render(); // Renderizar la lista vacía
}

function clearCompletedTodos() {
    completedTodos.length = 0; // Vaciar el array de tareas completadas
    saveTodos(); // Guarda los cambios en localStorage
    render(); // Renderiza la lista actualizada
}

function render() {
    // Limpiar las columnas de cada día
    document.getElementById('LUNES').innerHTML = '<div class="titulo">LUNES</div>';
    document.getElementById('MARTES').innerHTML = '<div class="titulo">MARTES</div>';
    document.getElementById('MIERCOLES').innerHTML = '<div class="titulo">MIERCOLES</div>';
    document.getElementById('JUEVES').innerHTML = '<div class="titulo">JUEVES</div>';
    document.getElementById('VIERNES').innerHTML = '<div class="titulo">VIERNES</div>';
    document.getElementById('SABADO').innerHTML = '<div class="titulo">SABADO</div>';

    // Recorre cada tarea y la coloca en el día correspondiente
    todos.forEach((todo, index) => {
        const dueDateObject = new Date(todo.dueDate);
        const dias = dueDateObject.getUTCDay();

        let dayColumn;
        switch (dias) {
            case 1: dayColumn = document.getElementById('LUNES'); break;
            case 2: dayColumn = document.getElementById('MARTES'); break;
            case 3: dayColumn = document.getElementById('MIERCOLES'); break;
            case 4: dayColumn = document.getElementById('JUEVES'); break;
            case 5: dayColumn = document.getElementById('VIERNES'); break;
            case 6: dayColumn = document.getElementById('SABADO'); break;
        }

        if (dayColumn) {
            const taskElement = document.createElement('div');
            taskElement.innerText = `${todo.title} (fecha: ${dueDateObject.toLocaleDateString()})`;

            // Checkbox para marcar como completada
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.onclick = function() {
                if (checkbox.checked) {
                    completedTodos.push(todo); // Agregar a tareas completadas
                    deleteTodo(index); // Eliminar de las tareas actuales
                    saveTodos(); // Guarda los cambios
                    render(); // Renderizar nuevamente
                }
            };
            
            taskElement.prepend(checkbox); // Añadir el checkbox al inicio del elemento de tarea

            // Botón de eliminar
            const deleteButton = document.createElement('button');
            deleteButton.innerText = 'Eliminar';
            deleteButton.onclick = function() {
                deleteTodo(index);
            };
            taskElement.appendChild(deleteButton);

            // Agrega el elemento de tarea a la columna del día
            dayColumn.appendChild(taskElement);
        }
    });

    // Renderizar tareas completadas
    const completedTasksList = document.getElementById('completed-tasks-list');
    completedTasksList.innerHTML = '<div class="titulo">Tareas Completadas</div>';
    completedTodos.forEach(todo => {
        const completedTaskElement = document.createElement('div');
        completedTaskElement.innerText = `${todo.title} (completada el: ${new Date(todo.dueDate).toLocaleDateString()})`;
        completedTasksList.appendChild(completedTaskElement);
    });
}


// Llamar a loadTodos cuando se carga el script
window.onload = loadTodos;
