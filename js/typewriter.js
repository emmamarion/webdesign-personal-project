const dialogueContent = {
    home: "Welcome to my website! My name is Swirly Wirly Toffee, but you can just call me Toffee. Click on any of the buttons on my tail to explore the website!",
    about: "The owner of this website is Emma Marion. She's a Junior at the University of Michigan School of Information (UMSI) studying user expierence (UX) design. She actually built this website for her final project in her web design class! How cool is that?"
};

const element = document.querySelector(".typewriter");
const container = document.querySelector("#typewriter-container");
const speechBubble = document.querySelector(".speech-bubble")
let currentFullText = "";

const typeSpeed = 50; // miliseconds per character
let typingTimeout;

// --- AUDIO POOLING SETUP ---
const audioPool = [];
let lastSoundTime = 0; // Tracks when the last sound was played
const poolSize = 6; // Create 6 copies to reuse. Enough to allow overlap.
const talkSoundSrc = "audio/talkingSound.wav";

// Initialize the pool once when the page loads
for (let i = 0; i < poolSize; i++) {
    const audio = new Audio(talkSoundSrc);
    audio.volume = 0.5;
    
    // PRE-CALCULATE: Assign a permanent random speed to this specific audio copy
    audio.playbackRate = 0.8 + Math.random() * 0.4; 
    audioPool.push(audio);
}

function startTyping(sectionKey) {
    if (!dialogueContent[sectionKey]) return;

    // Pick text from array and store globaly for skip function
    currentFullText = dialogueContent[sectionKey];

    // Stop current typing
    clearTimeout(typingTimeout)

    // Accessability: update aria label immediately for screen readers
    container.setAttribute("aria-label", currentFullText);

    // Accessability: Move the screen reader to read the new label
    container.focus();

    // Clear text
    element.textContent = "";

    // Handle reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
    // If user prefers reduced motion, show full text immediately
    element.textContent = currentFullText;
    element.style.borderRight = 'none'; // Remove cursor
    } else {
        element.style.borderRight = '2px solid black'; // Restore cursor in case preferences change
        let i = 0
        function typeWriter() {
            if (i < currentFullText.length){
                let char = currentFullText.charAt(i);
                element.textContent += char
                i++;

                if (char != " " && i % 2 == 0) {
                    playBlip();
                }
                typingTimeout = setTimeout(typeWriter, typeSpeed)
            }
        }
        typeWriter();   
    }
}

let poolIndex = 0;
let isMuted = false;

function playBlip() {
    if (isMuted) return;

    const audio = audioPool[poolIndex];
    
    const now = Date.now();
    // Only play if 100ms have passed since the last beep
    if (now - lastSoundTime < 100) {
        return; 
    }

    audio.currentTime = 0;
    audio.play();
    poolIndex = (poolIndex + 1) % poolSize;
}

function toggleMute() {
    isMuted = !isMuted;
    const btn = document.querySelector("#muteBtn");

    if (isMuted) {
        btn.setAttribute("aria-pressed", "true");
    } else {
        btn.setAttribute("aria-pressed", "false")
    }
}

function skipDialogue() {
    clearTimeout(typingTimeout);
    element.textContent = currentFullText;
    element.style.borderRight = 'none';
}