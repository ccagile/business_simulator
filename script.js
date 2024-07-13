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
    document.getElementById('game-time').textContent = gameTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    document.getElementById('day-of-week').textContent = daysOfWeek[dayOfWeek];
}

function updateBalance() {
    document.getElementById('balance').textContent = `Bilancio: €${balance}`;
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
        taskElement.textContent = task.description;
        const acceptButton = document.createElement('button');
        acceptButton.textContent = 'Accetta';
        acceptButton.onclick = () => acceptTask(index);
        taskElement.appendChild(acceptButton);
        tasksList.appendChild(taskElement);
    });
}

function acceptTask(index) {
    currentTask = availableTasks[index];
    availableTasks.splice(index, 1);
    updateTasksList();
    // Simula l'invio di un'email
    alert(`Hai accettato l'incarico: ${currentTask.description}`);
    document.getElementById('tasks-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
}

function editImage() {
    if (currentTask) {
        setTimeout(() => {
            currentTask.count--;
            document.getElementById('edit-counter').textContent = `Immagini rimanenti: ${currentTask.count}`;
            if (currentTask.count === 0) {
                const reward = currentTask.count * 2;
                balance += reward;
                updateBalance();
                alert(`Incarico completato! Hai guadagnato €${reward}`);
                currentTask = null;
                document.getElementById('image-editor-screen').classList.add('hidden');
                document.getElementById('game-screen').classList.remove('hidden');
            }
        }, 5000);
    }
}

document.getElementById('play-btn').onclick = () => {
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
};

document.getElementById('updates-btn').onclick = () => {
    alert('Aggiornamenti: Versione iniziale 1.0.0');
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
        alert('Hai acquistato un tablet!');
    } else {
        alert('Non puoi acquistare il tablet.');
    }
};

document.getElementById('buy-computer').onclick = () => {
    if (balance >= 2250 && inventory.tablet && !inventory.computer) {
        balance -= 2250;
        inventory.computer = true;
        updateBalance();
        alert('Hai acquistato un computer!');
    } else {
        alert('Non puoi acquistare il computer.');
    }
};

document.getElementById('buy-server').onclick = () => {
    if (balance >= 15000 && inventory.computer && !inventory.server) {
        balance -= 15000;
        inventory.server = true;
        updateBalance();
        alert('Hai acquistato un server!');
    } else {
        alert('Non puoi acquistare il server.');
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
        alert('Devi prima accettare un incarico.');
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