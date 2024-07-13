let balance = 500;
let gameTime = new Date(2023, 0, 1, 0, 0, 0);
let dayOfWeek = 1;
const daysOfWeek = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
let inventory = { tablet: false, computer: false, server: false };
let currentTask = null;
let availableTasks = [];

function updateGameTime() {
    gameTime.setMinutes(gameTime.getMinutes() + 1);
    if (gameTime.getHours() === 0 && gameTime.getMinutes() === 0) {
        dayOfWeek = (dayOfWeek % 7) + 1;
    }
    document.getElementById('game-time').innerHTML = `<i class="far fa-clock"></i> ${gameTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    document.getElementById('day-of-week').innerHTML = `<i class="far fa-calendar-alt"></i> ${daysOfWeek[dayOfWeek]}`;
}

function updateBalance() {
    document.getElementById('balance').innerHTML = `<i class="fas fa-wallet"></i> €${balance}`;
}

function generateTask() {
    if (availableTasks.length < 3) {
        const taskTypes = [
            { description: "Edita 5 immagini tramite Editor Immagini", count: 5 },
            { description: "Edita 1 Immagine tramite Editor Immagini", count: 1 },
            { description: "Edita 2 Immagini tramite Editor Immagini", count: 2 },
        ];
        const randomTask = taskTypes[Math.floor(Math.random() * taskTypes.length)];
        availableTasks.push(randomTask);
        updateTasksList();
    }
}

function updateTasksList() {
    const tasksList = document.getElementById('tasks-list');
    tasksList.innerHTML = '';
    availableTasks.forEach((task, index) => {
        const taskElement = document.createElement('div');
        taskElement.innerHTML = `
            <p>${task.description}</p>
            <button class="btn green" onclick="acceptTask(${index})">
                <i class="fas fa-check"></i> Accetta
            </button>
        `;
        tasksList.appendChild(taskElement);
    });
}

function acceptTask(index) {
    currentTask = availableTasks[index];
    availableTasks.splice(index, 1);
    updateTasksList();
    showNotification(`Hai accettato l'incarico: ${currentTask.description}`);
    document.getElementById('tasks-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
}

function editImage() {
    if (currentTask) {
        const editButton = document.getElementById('edit-image');
        editButton.disabled = true;
        editButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Elaborazione...';
        setTimeout(() => {
            currentTask.count--;
            document.getElementById('edit-counter').textContent = `Immagini rimanenti: ${currentTask.count}`;
            if (currentTask.count === 0) {
                const reward = currentTask.count * 2;
                balance += reward;
                updateBalance();
                showNotification(`Incarico completato! Hai guadagnato €${reward}`);
                currentTask = null;
                document.getElementById('image-editor-screen').classList.add('hidden');
                document.getElementById('game-screen').classList.remove('hidden');
            }
            editButton.disabled = false;
            editButton.innerHTML = '<i class="fas fa-edit"></i> Modifica immagine';
        }, 5000);
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 3000);
    }, 100);
}

document.getElementById('play-btn').onclick = () => {
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
};

document.getElementById('updates-btn').onclick = () => {
    showNotification('Aggiornamenti: Versione iniziale 1.0.0');
};

document.getElementById('shop-btn').onclick = () => {
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('shop-screen').classList.remove('hidden');
};

document.getElementById('buy-tablet').onclick = () => {
    if (balance >= 300 && !inventory.tablet) {
        balance -= 300;
        inventory.tablet = true;
        updateBalance();
        document.getElementById('tablet-apps').classList.remove('hidden');
        showNotification('Hai acquistato un tablet!');
    } else {
        showNotification('Non puoi acquistare il tablet.');
    }
};

document.getElementById('buy-computer').onclick = () => {
    if (balance >= 2250 && inventory.tablet && !inventory.computer) {
        balance -= 2250;
        inventory.computer = true;
        updateBalance();
        showNotification('Hai acquistato un computer!');
    } else {
        showNotification('Non puoi acquistare il computer.');
    }
};

document.getElementById('buy-server').onclick = () => {
    if (balance >= 15000 && inventory.computer && !inventory.server) {
        balance -= 15000;
        inventory.server = true;
        updateBalance();
        showNotification('Hai acquistato un server!');
    } else {
        showNotification('Non puoi acquistare il server.');
    }
};

document.getElementById('back-to-game').onclick = () => {
    document.getElementById('shop-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
};

document.getElementById('tasks-app').onclick = () => {
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('tasks-screen').classList.remove('hidden');
    updateTasksList();
};

document.getElementById('image-editor-app').onclick = () => {
    if (currentTask) {
        document.getElementById('game-screen').classList.add('hidden');
        document.getElementById('image-editor-screen').classList.remove('hidden');
        document.getElementById('edit-counter').textContent = `Immagini rimanenti: ${currentTask.count}`;
    } else {
        showNotification('Devi prima accettare un incarico.');
    }
};

document.getElementById('edit-image').onclick = editImage;

document.getElementById('back-from-tasks').onclick = () => {
    document.getElementById('tasks-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
};

document.getElementById('back-from-editor').onclick = () => {
    document.getElementById('image-editor-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
};

setInterval(updateGameTime, 1000);
setInterval(generateTask, 345000);

// Aggiungi questo stile al tuo file CSS
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        bottom: -100px;
        left: 50%;
        transform: translateX(-50%);
        background-color: rgba(52, 152, 219, 0.9);
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        transition: bottom 0.5s ease-in-out;
        z-index: 1000;
    }

    .notification.show {
        bottom: 20px;
    }
`;
document.head.appendChild(style);