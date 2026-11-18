
const timerDisplay = document.getElementById("timer");
const titleSession = document.getElementById("title_session");
const startButton = document.getElementById("btn_start");
const resetButton = document.getElementById("btn_reset");
const statusText = document.getElementById("status");

const FOCUS_TIME = 25 * 60;
const SHORT_BREAK = 5 * 60;
const LONG_BREAK = 15 * 60;

let currentSession = 1;
let currentMode = "focus";

let remainingTime = FOCUS_TIME;
let endTime = null;
let timerInterval = null;
let isRunning = false;

const sessions = document.querySelectorAll(".session-card");

// Sistema de alarme sonoro
let audioContext = null;
startButton.addEventListener("click", enableAudio);

// Ativa o áudio após a primeira interação do usuário
function enableAudio() {
    if (!audioContext) {
        const AudioContextClass =
            window.AudioContext || window.webkitAudioContext;

        if (AudioContextClass) {
            audioContext = new AudioContextClass();
        }
    }

    if (audioContext && audioContext.state === "suspended") {
        audioContext.resume();
    }
}

// Emite três bipes
function playAlarm() {
    if (!audioContext || audioContext.state !== "running") {
        return;
    }

    const frequencies = [880, 1046, 880];

    frequencies.forEach((frequency, index) => {
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();

        const startTime = audioContext.currentTime + index * 0.45;

        oscillator.type = "sine";
        oscillator.frequency.value = frequency;

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.5, startTime + 0.03);
        gain.gain.setValueAtTime(0.5, startTime + 0.2);
        gain.gain.linearRampToValueAtTime(0, startTime + 0.3);

        oscillator.connect(gain);
        gain.connect(audioContext.destination);

        oscillator.start(startTime);
        oscillator.stop(startTime + 0.3);
    });
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function updateDisplay() {
    timerDisplay.textContent = formatTime(remainingTime);

    document.title = `${formatTime(remainingTime)} - Pomodoro Focus`;

    if (currentMode === "focus") {
        titleSession.textContent = "Tempo de Concentração";
    } else {
        titleSession.textContent = "Tempo de Pausa";
    }

    startButton.textContent = isRunning ? "Pausar" : "Iniciar";
}

function updateSessions() {
    sessions.forEach((session, index) => {
        const number = index + 1;

        session.classList.toggle(
            "active",
            number === currentSession
        );

        session.classList.toggle(
            "completed",
            number < currentSession
        );
    });
}

function getDuration() {
    if (currentMode === "focus") {
        return FOCUS_TIME;
    }

    if (currentSession === 4) {
        return LONG_BREAK;
    }

    return SHORT_BREAK;
}

function stopInterval() {
    clearInterval(timerInterval);
    timerInterval = null;
}

function pauseTimer() {
    if (!isRunning) return;

    remainingTime = Math.max(
        0,
        Math.ceil((endTime - Date.now()) / 1000)
    );

    isRunning = false;
    endTime = null;

    stopInterval();
    updateDisplay();
}

function resetTimer() {
    pauseTimer();

    currentMode = "focus";
    remainingTime = FOCUS_TIME;

    statusText.textContent = "Temporizador reiniciado.";

    updateDisplay();
    updateSessions();
}

function startTimer() {
    if (isRunning) {
        pauseTimer();
        statusText.textContent = "Temporizador pausado.";
        return;
    }

    isRunning = true;

    endTime = Date.now() + remainingTime * 1000;

    startButton.textContent = "Pausar";

    statusText.textContent = currentMode === "focus"
        ? "Concentre-se na sua tarefa!"
        : "Aproveite sua pausa!";

    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    remainingTime = Math.max(
        0,
        Math.ceil((endTime - Date.now()) / 1000)
    );

    updateDisplay();

    if (remainingTime <= 0) {
        completeSession();
    }
}

function notifyUser(message) {
    if (
        "Notification" in window &&
        Notification.permission === "granted"
    ) {
        navigator.serviceWorker.ready
            .then(registration => {
                registration.showNotification("Pomodoro Focus", {
                    body: message,
                    icon: "assets/icons/icon-192.png",
                    tag: "pomodoro-notification"
                });
            })
            .catch(() => {
                new Notification("Pomodoro Focus", {
                    body: message
                });
            });
    }
}

function completeSession() {
    playAlarm();
    stopInterval();

    isRunning = false;
    endTime = null;

    if (currentMode === "focus") {
        notifyUser("Sessão de foco concluída! Hora de descansar.");

        if (currentSession === 4) {
            currentMode = "break";
            remainingTime = LONG_BREAK;
        } else {
            currentMode = "break";
            remainingTime = SHORT_BREAK;
        }

        statusText.textContent = "Foco concluído! Faça uma pausa.";
    } else {
        notifyUser("Pausa concluída! Hora de voltar ao foco.");

        if (currentSession === 4) {
            currentSession = 1;
        } else {
            currentSession++;
        }

        currentMode = "focus";
        remainingTime = FOCUS_TIME;

        statusText.textContent = "Pausa concluída! Vamos focar novamente.";
    }

    updateDisplay();
    updateSessions();
}

// Solicita permissão para notificações após interação.
startButton.addEventListener("click", async () => {
    if (
        "Notification" in window &&
        Notification.permission === "default"
    ) {
        try {
            await Notification.requestPermission();
        } catch (error) {
            console.warn("Não foi possível solicitar notificações.", error);
        }
    }

    startTimer();
});

resetButton.addEventListener("click", resetTimer);

// Atualiza o relógio ao retornar à página.
document.addEventListener("visibilitychange", () => {
    if (isRunning) {
        updateTimer();
    }
});

// Registra o Service Worker.
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./service-worker.js")
            .then(() => console.log("Service Worker registrado!"))
            .catch(error => console.error("Erro no Service Worker:", error));
    });
}

updateDisplay();
updateSessions();





let deferredInstallPrompt = null;

const installButton = document.getElementById("btn_install");

window.addEventListener("beforeinstallprompt", event => {
    event.preventDefault();

    deferredInstallPrompt = event;

    installButton.classList.remove("d-none");
});

installButton.addEventListener("click", async () => {
    if (!deferredInstallPrompt) return;

    deferredInstallPrompt.prompt();

    const result = await deferredInstallPrompt.userChoice;

    if (result.outcome === "accepted") {
        installButton.classList.add("d-none");
    }

    deferredInstallPrompt = null;
});

window.addEventListener("appinstalled", () => {
    installButton.classList.add("d-none");
});
