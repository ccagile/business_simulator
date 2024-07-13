let balance = 500;
let gameTime = new Date(2023, 0, 1, 0, 0, 0);
let dayOfWeek = 1;
const daysOfWeek = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
let inventory = { tablet: false, computer: false, server: false };
let currentTask = null;
let availableTasks = [];
let level = 1;
let experience = 0;
let emails = [];

const clickSound = document.getElementById('click-sound');
const successSound = document.getElementById('success-sound');

function playSound(sound) {
    sound.currentTime = 0;
    sound.play();
}

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

function updateLevel() {
    document.getElementById('level').textContent = `Livello: ${level}`;
}

function generateTask() {
    if (availableTasks.length < 3) {
        const taskTypes = [
            { description: "Edita 5 immagini tramite Editor Immagini", count: 5, reward: 50, expReward: 25 },
            { description: "Edita 1 Immagine tramite Editor Immagini", count: 1, reward: 10, expReward: 5 },
            { description: "Edita 2 Immagini tramite Editor Immagini", count: 2, reward: 20, expReward: 10 },
            { description: "Analizza dati sul computer", count: 1, reward: 30, expReward: 15 },
            { description: "Gestisci il server", count: 1, reward: 100, expReward: 50 },
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
            <p>Ricompensa: €${task.reward}</p>
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
    playSound(clickSound);
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
                balance += currentTask.reward;
                experience += currentTask.expReward;
                updateBalance();
                checkLevelUp();
                showNotification(`Incarico completato! Hai guadagnato €${currentTask.reward} e ${currentTask.expReward} XP`);
                currentTask = null;
                document.getElementById('image-editor-screen').classList.add('hidden');
                document.getElementById('game-screen').classList.remove('hidden');
                playSound(successSound);
            }
            editButton.disabled = false;
            editButton.innerHTML = '<i class="fas fa-edit"></i> Modifica immagine';
        }, 5000);
    }
}

function checkLevelUp() {
    const expNeeded = level * 100;
    if (experience >= expNeeded) {
        level++;
        experience -= expNeeded;
        updateLevel();
        showNotification(`Congratulazioni! Sei salito al livello ${level}!`);
        playSound(successSound);
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

function generateEmail() {
    const emailTypes = [
        { subject: "Nuova opportunità di lavoro", body: "Abbiamo un'interessante proposta per te. Controlla gli incarichi disponibili!" },
        { subject: "Aggiornamento software", body: "È disponibile un nuovo aggiornamento per il tuo software. Visita il negozio per saperne di più." },
        { subject: "Offerta speciale", body: "Solo per oggi, sconti speciali su tutte le attrezzature nel negozio!" },
    ];
    const randomEmail = emailTypes[Math.floor(Math.random() * emailTypes.length)];
    emails.push(randomEmail);
    updateEmailList();
}

function updateEmailList() {
    const emailList = document.getElementById('email-list');
    emailList.innerHTML = '';
    emails.forEach((email, index) => {
        const emailElement = document.createElement('div');
        emailElement.innerHTML = `
            <h3>${email.subject}</h3>
            <p>${email.body}</p>
            <button class="btn red" onclick="deleteEmail(${index})">
                <i class="fas fa-trash"></i> Elimina
            </button>
        `;
        emailList.appendChild(emailElement);
    });
}

function deleteEmail(index) {
    emails.splice(index, 1);
    updateEmailList();
    playSound(clickSound);
}

function saveGame() {
    const gameState = {
        balance: balance,
        gameTime: gameTime.getTime(),
        dayOfWeek: dayOfWeek,
        inventory: inventory,
        availableTasks: availableTasks,
        level: level,
        experience: experience,
        emails: emails
    };
    localStorage.setItem('businessSimulatorSave', JSON.stringify(gameState));
    showNotification('Gioco salvato con successo!');
}

function loadGame() {
    const savedGame = localStorage.getItem('businessSimulatorSave');
    if (savedGame) {
        const gameState = JSON.parse(savedGame);
        balance = gameState.balance;
        gameTime = new Date(gameState.gameTime);
        dayOfWeek = gameState.dayOfWeek;
        inventory = gameState.inventory;
        availableTasks = gameState.availableTasks;
        level = gameState.level;
        experience = gameState.experience;
        emails = gameState.emails;
        updateBalance();
        updateGameTime();
        updateLevel();
        updateTasksList();
        updateEmailList();
        if (inventory.tablet) {
            document.getElementById('tablet-apps').classList.remove('hidden');
        }
        showNotification('Gioco caricato con successo!');
    } else {
        showNotification('Nessun salvataggio trovato.');
    }
}

document.getElementById('play-btn').onclick = () => {
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    playSound(clickSound);
};

document.getElementById('load-btn').onclick = () => {
    loadGame();
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    playSound(clickSound);
};

document.getElementById('updates-btn').onclick = () => {
    showNotification('Aggiornamenti: Versione 1.1.0 - Aggiunto sistema di livelli e email');
    playSound(clickSound);
};

document.getElementById('shop-btn').onclick = () => {
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('shop-screen').classList.remove('hidden');
    playSound(clickSound);
};

document.getElementById('buy-tablet').onclick = () => {
    if (balance >= 300 && !inventory.tablet) {
        balance -= 300;
        inventory.tablet = true;
        updateBalance();
        document.getElementById('tablet-apps').classList.remove('hidden');
        showNotification('Hai acquistato un tablet!');
        playSound(successSound);
    } else {
        showNotification('Non puoi acquistare il tablet.');
        playSound(clickSound);
    }
};

document.getElementById('buy-computer').onclick = () => {
    if (balance >= 2250 && inventory.tablet && !inventory.computer) {
        balance -= 2250;
        inventory.computer = true;
        updateBalance();
        showNotification('Hai acquistato un computer!');
        playSound(successSound);
    } else {
        showNotification('Non puoi acquistare il computer.');
        playSound(clickSound);
    }
};

document.getElementById('buy-server').onclick = () => {
    if (balance >= 15000 && inventory.computer && !inventory.server) {
        balance -= 15000;
        inventory.server = true;
        updateBalance();
        showNotification('Hai acquistato un server!');
        playSound(successSound);
    } else {
        showNotification('Non puoi acquistare il server.');
        playSound(clickSound);
    }
};

document.getElementById('back-to-game').onclick = () => {
    document.getElementById('shop-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    playSound(clickSound);
};

document.getElementById('tasks-app').onclick = () => {
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('tasks-screen').classList.remove('hidden');
    updateTasksList();
    playSound(clickSound);
};

document.getElementById('email-app').onclick = () => {
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('email-screen').classList.remove('hidden');
    updateEmailList();
    playSound(clickSound);
};

document.getElementById('image-editor-app').onclick = () => {
    if (currentTask) {
        document.getElementById('game-screen').classList.add('hidden');
        document.getElementById('image-editor-screen').classList.remove('hidden');
        document.getElementById('edit-counter').textContent = `Immagini rimanenti: ${currentTask.count}`;
        playSound(clickSound);
    } else {
        showNotification('Devi prima accettare un incarico.');
        playSound(clickSound);
    }
};

document.getElementById('edit-image').onclick = editImage;

document.getElementById('back-from-tasks').onclick = () => {
    document.getElementById('tasks-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    playSound(clickSound);
};

document.getElementById('back-from-editor').onclick = () => {
    document.getElementById('image-editor-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    playSound(clickSound);
};

document.getElementById('back-from-email').onclick = () => {
    document.getElementById('email-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    playSound(clickSound);
};

document.getElementById('save-btn').onclick = saveGame;

setInterval(updateGameTime, 1000);
setInterval(generateTask, 345000);
setInterval(generateEmail, 600000);

// Inizializza il gioco
updateBalance();
updateGameTime();
updateLevel();