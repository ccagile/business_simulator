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
    document.getElementById('game-time').textContent = gameTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    document.getElementById('day-of-week').textContent = daysOfWeek[dayOfWeek - 1];
}

function updateBalance() {
    document.getElementById('balance').textContent = `€${balance}`;
}

function updateLevel() {
    document.getElementById('level').textContent = `Livello: ${level}`;
}

function generateTask() {
    if (availableTasks.length < 3) {
        const taskTypes = [
            { description: "Edita 5 immagini", count: 5, reward: 50, expReward: 25 },
            { description: "Analizza dati", count: 1, reward: 30, expReward: 15 },
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
            <button onclick="acceptTask(${index})">Accetta</button>
        `;
        tasksList.appendChild(taskElement);
    });
}

function acceptTask(index) {
    currentTask = availableTasks[index];
    availableTasks.splice(index, 1);
    updateTasksList();
    alert(`Hai accettato l'incarico: ${currentTask.description}`);
    playSound(clickSound);
}

function editImage() {
    if (currentTask && currentTask.description.includes("Edita")) {
        currentTask.count--;
        if (currentTask.count === 0) {
            balance += currentTask.reward;
            experience += currentTask.expReward;
            updateBalance();
            checkLevelUp();
            alert(`Incarico completato! Hai guadagnato €${currentTask.reward} e ${currentTask.expReward} XP`);
            currentTask = null;
            playSound(successSound);
        } else {
            alert(`Immagine modificata. Ancora ${currentTask.count} da completare.`);
        }
    }
}

function checkLevelUp() {
    const expNeeded = level * 100;
    if (experience >= expNeeded) {
        level++;
        experience -= expNeeded;
        updateLevel();
        alert(`Congratulazioni! Sei salito al livello ${level}!`);
        playSound(successSound);
    }
}

function generateEmail() {
    const emailTypes = [
        { subject: "Nuova opportunità", body: "Abbiamo un nuovo incarico per te!" },
        { subject: "Aggiornamento", body: "Nuovi strumenti disponibili nel negozio." },
        { subject: "Offerta speciale", body: "Sconti su tutti gli articoli nel negozio!" },
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
            <button onclick="deleteEmail(${index})">Elimina</button>
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
    alert('Gioco salvato con successo!');
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
        alert('Gioco caricato con successo!');
    } else {
        alert('Nessun salvataggio trovato.');
    }
}

document.getElementById('play-btn').onclick = () => {
    playSound(clickSound);
};

document.getElementById('load-btn').onclick = () => {
    loadGame();
    playSound(clickSound);
};

document.getElementById('updates-btn').onclick = () => {
    alert('Aggiornamenti: Versione 1.0 - Lancio iniziale');
    playSound(clickSound);
};

document.getElementById('shop-btn').onclick = () => {
    playSound(clickSound);
};

document.getElementById('buy-tablet').onclick = () => {
    if (balance >= 300 && !inventory.tablet) {
        balance -= 300;
        inventory.tablet = true;
        updateBalance();
        alert('Hai acquistato un tablet!');
        playSound(successSound);
    } else {
        alert('Non puoi acquistare il tablet.');
        playSound(clickSound);
    }
};

document.getElementById('buy-computer').onclick = () => {
    if (balance >= 2250 && inventory.tablet && !inventory.computer) {
        balance -= 2250;
        inventory.computer = true;
        updateBalance();
        alert('Hai acquistato un computer!');
        playSound(successSound);
    } else {
        alert('Non puoi acquistare il computer.');
        playSound(clickSound);
    }
};

document.getElementById('buy-server').onclick = () => {
    if (balance >= 15000 && inventory.computer && !inventory.server) {
        balance -= 15000;
        inventory.server = true;
        updateBalance();
        alert('Hai acquistato un server!');
        playSound(successSound);
    } else {
        alert('Non puoi acquistare il server.');
        playSound(clickSound);
    }
};

document.getElementById('tasks-app').onclick = () => {
    updateTasksList();
    playSound(clickSound);
};

document.getElementById('email-app').onclick = () => {
    updateEmailList();
    playSound(clickSound);
};

document.getElementById('image-editor-app').onclick = () => {
    if (currentTask) {
        playSound(clickSound);
    } else {
        alert('Devi prima accettare un incarico.');
        playSound(clickSound);
    }
};

document.getElementById('edit-image').onclick = editImage;

document.getElementById('save-btn').onclick = saveGame;

setInterval(updateGameTime, 1000);
setInterval(generateTask, 345000);
setInterval(generateEmail, 600000);

// Inizializza il gioco
updateBalance();
updateGameTime();
updateLevel();