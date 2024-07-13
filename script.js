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

function updateBalance() {
    document.getElementById('balance-amount').textContent = balance;
}

function updateTime() {
    gameTime.setMinutes(gameTime.getMinutes() + 15);
    document.getElementById('game-time').textContent = gameTime.toLocaleString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    dayOfWeek = gameTime.getDay();
    document.getElementById('day-of-week').textContent = daysOfWeek[dayOfWeek];
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.remove('hidden');
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 3000);
}

function playSound(sound) {
    sound.currentTime = 0;
    sound.play();
}

function updateTabletApps() {
    const tabletApps = document.getElementById('tablet-apps');
    if (inventory.tablet) {
        tabletApps.classList.remove('hidden');
    } else {
        tabletApps.classList.add('hidden');
    }
}

document.getElementById('work').onclick = () => {
    balance += 50;
    updateBalance();
    updateTime();
    showNotification('Hai guadagnato €50!');
    playSound(successSound);
};

document.getElementById('buy-tablet').onclick = () => {
    if (balance >= 300 && !inventory.tablet) {
        balance -= 300;
        inventory.tablet = true;
        updateBalance();
        updateTabletApps();
        showNotification('Hai acquistato un tablet!');
        playSound(successSound);
    } else {
        showNotification('Non puoi acquistare il tablet.');
        playSound(clickSound);
    }
};

document.getElementById('buy-computer').onclick = () => {
    if (balance >= 1000 && !inventory.computer) {
        balance -= 1000;
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
    if (balance >= 5000 && !inventory.server) {
        balance -= 5000;
        inventory.server = true;
        updateBalance();
        showNotification('Hai acquistato un server!');
        playSound(successSound);
    } else {
        showNotification('Non puoi acquistare il server.');
        playSound(clickSound);
    }
};

function saveGame() {
    const gameState = {
        balance: balance,
        gameTime: gameTime.toISOString(),
        dayOfWeek: dayOfWeek,
        inventory: inventory,
        availableTasks: availableTasks,
        level: level,
        experience: experience,
        emails: emails
    };
    localStorage.setItem('businessSimulatorSave', JSON.stringify(gameState));
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
        updateTime();
        updateTabletApps();
    }
}

loadGame();
setInterval(saveGame, 60000); // Salva il gioco ogni minuto

// Aggiungi qui altre funzionalità del gioco