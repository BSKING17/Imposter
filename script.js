// --- Wortliste ---
const words = [
  "Abenteuer","Blätterwald","Fahrradkette","Gewitter","Zaunpfahl","Laterne","Taschenlampe","Regenbogen",
  "Schneeflocke","Honigglas","Rucksack","Bibliothek","Zirkuszelt","Kartoffelsalat","Wasserhahn","Spielplatz",
  "Rakete","Zeitung","Schlüsselbund","Briefkasten","Feuerzeug","Zahnarzt","Glühbirne","Parkbank","Kirchturm",
  "Gartenschlauch","Computermaus","Goldfisch","Zahnpasta","Schneemann","Teetasse","Bleistift","Einkaufskorb",
  "Bilderrahmen","Taschenmesser","Luftballon","Blumentopf","Schneeschaufel","Fernglas","Windmühle","Kochtopf",
  "Schulranzen","Eimer","Regenschirm","Heißluftballon","Reisekoffer","Malkasten","Schmetterling","Kerzenhalter",
  "Sandburg","Vogelhaus","Magnet","Gießkanne","Fernbedienung","Stirnlampe","Schlafsack","Kompass","Angelrute",
  "Taschenrechner","Uhrzeiger","Blasinstrument","Zahnbürste","Kleiderschrank","Stuhlbein","Wasserflasche",
  "Kühlschrank","Bettdecke","Seifenblase","Notizbuch","Spiegelbild","Fensterbrett","Schaufelrad","Eislöffel",
  "Gartenstuhl","Schneeglöckchen","Schraubenzieher","Vogelfutter","Regenschauer","Schreibtisch","Klebeband",
  "Wanduhr","Glastür","Straßenlampe","Mikroskop","Kopfhörer","Pullover","Kaminfeuer","Regenjacke","Bonbonglas",
  "Wasserwaage","Stromkabel","Fahrradhelm","Waschmaschine","Bäckerei","Baustelle","Tierarzt","Mülltonne","Wecker",
  "Strohhalm","Wolkenkratzer"
];

let numPlayers, numImposters, players = [], imposters = [], commonWord = "", lastWord = "";
let current = 0;
let timerInterval, timeLeft = 180, paused = false;

const setupDiv = document.getElementById("setup");
const nameSetupDiv = document.getElementById("nameSetup");
const revealDiv = document.getElementById("reveal");
const gameArea = document.getElementById("gameArea");
const wordDisplay = document.getElementById("wordDisplay");
const nextBtn = document.getElementById("nextPlayer");

// --- Funktionen ---
document.getElementById("nextSetup").addEventListener("click", () => {
  numPlayers = parseInt(document.getElementById("numPlayers").value);
  numImposters = parseInt(document.getElementById("numImposters").value);
  if (numImposters >= numPlayers) return alert("Es muss weniger Imposter als Spieler geben!");
  setupDiv.classList.add("hidden");
  nameSetupDiv.classList.remove("hidden");

  const nameInputs = document.getElementById("nameInputs");
  nameInputs.innerHTML = "";
  for (let i = 0; i < numPlayers; i++) {
    const input = document.createElement("input");
    input.placeholder = `Name Spieler ${i + 1}`;
    nameInputs.appendChild(input);
  }
});

document.getElementById("startGame").addEventListener("click", () => {
  players = Array.from(document.querySelectorAll("#nameInputs input")).map(i => i.value || `Spieler${i}`);
  imposters = [];
  while (imposters.length < numImposters) {
    const rand = Math.floor(Math.random() * numPlayers);
    if (!imposters.includes(rand)) imposters.push(rand);
  }

  // Neues zufälliges Wort auswählen (nicht dasselbe wie beim letzten Mal)
  let newWord;
  do {
    newWord = words[Math.floor(Math.random() * words.length)];
  } while (newWord === lastWord);
  commonWord = newWord;
  lastWord = newWord;

  nameSetupDiv.classList.add("hidden");
  revealDiv.classList.remove("hidden");
  showNextPlayer();
});

function showNextPlayer() {
  if (current >= numPlayers) {
    revealDiv.classList.add("hidden");
    startCountdown();
    return;
  }

  document.getElementById("currentPlayer").innerText = `${players[current]} ist dran`;
  wordDisplay.innerText = "⬇️ Drücke 'Wort anzeigen' um dein Wort zu sehen";
  wordDisplay.style.fontWeight = "normal";

  // Buttons vorbereiten
  nextBtn.classList.add("hidden");
  let showBtn = document.createElement("button");
  showBtn.id = "showWord";
  showBtn.innerText = "Wort anzeigen";
  revealDiv.appendChild(showBtn);

  showBtn.addEventListener("click", () => {
    wordDisplay.innerText = imposters.includes(current)
      ? "Du bist der IMPOSTER 🕵️‍♂️"
      : `Dein Wort ist: ${commonWord}`;
    wordDisplay.style.fontWeight = "bold";
    showBtn.remove();
    nextBtn.classList.remove("hidden");
    nextBtn.innerText = current === numPlayers - 1 ? "Spiel starten" : "Weitergeben";
  });
}

nextBtn.addEventListener("click", () => {
  current++;
  showNextPlayer();
});

function startCountdown() {
  gameArea.classList.remove("hidden");
  const timer = document.getElementById("timer");
  timeLeft = 180;
  paused = false;
  clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    if (!paused) {
      timeLeft--;
      const min = String(Math.floor(timeLeft / 60)).padStart(2, "0");
      const sec = String(timeLeft % 60).padStart(2, "0");
      timer.innerText = `${min}:${sec}`;
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        alert("Zeit vorbei! Diskutiert und stimmt ab! 🎯");
      }
    }
  }, 1000);
}

document.getElementById("pauseBtn").addEventListener("click", () => {
  paused = !paused;
  document.getElementById("pauseBtn").innerText = paused ? "▶️ Weiter" : "⏸️ Pause";
});

document.getElementById("revealImposters").addEventListener("click", () => {
  const names = imposters.map(i => players[i]).join(", ");
  alert(`Die Imposter waren: ${names}`);
});

document.getElementById("restartBtn").addEventListener("click", () => {
  clearInterval(timerInterval);
  current = 0;
  revealDiv.classList.add("hidden");
  gameArea.classList.add("hidden");
  nameSetupDiv.classList.remove("hidden");
});