const sectionDialogue = {
    home: "Welcome to my website! My name is Swirly Wirly Toffee, but you can just call me Toffee. Click on any of the buttons on my tail to explore the website! If I'm taking too long to talk, try clicking on the speech bubble.",
    writing: "WRITING",
    photography: "Emma likes to leave her photos here for me to look at. Poke on any of them and I can tell you more about them!",
    about: "The owner of this website is Emma Marion. She's a Junior at the University of Michigan School of Information (UMSI) studying user experience (UX) design. She actually built this website for her final project in her web design class! How cool is that?"
};

const photoDialogue = {
    tinyhouse: "Emma isn't really sure what this is, but she thinks it's funny that it looks like a tiny house. Me? I'm already in talks to take out a loan!",
    twochairs: "Ahhh, ruby ellen farm. One of Emma's favorite spots to go for walks in Traverse City. I wonder if anyone ever sits in those chairs...",
    westbay: "This one was taken on Traverse City's west bay. Back when the photo was taken, there was a lot of construction happening over there. Emma tells me it was to build a roundabout, and it's finished now! Maybe she'll show me a picture some day...",
    rainbow: "Fun fact about this one: Emma used the upper right corner of this picture as the album cover art for her first hit lofi single. She says that it made 4 cents. That sounds like a lot to me!" 
}

// GLOBAL VARIABLES
const element = document.querySelector(".typewriter"); // span element
const container = document.querySelector("#typewriter-container"); // p element
const speechBubble = document.querySelector(".speech-bubble"); // div element
const contentSections = document.querySelectorAll(".content-section") // all content sections
const bubbleWrapper = document.querySelector(".bubble-wrapper");
const galleryImages = document.querySelectorAll("#photo-gallery img");

// BUTTONS
const homeBtn = document.querySelector('#homeBtn') // home button
const writingBtn = document.querySelector('#writingBtn') // writing button
const photoBtn = document.querySelector('#photoBtn') // photo button
const aboutBtn = document.querySelector('#aboutBtn') // about button
const muteBtn = document.querySelector('#muteBtn') // mute button

// EVENT LISTENERS
homeBtn.addEventListener('click', () => startTyping('home'));
writingBtn.addEventListener('click', () => startTyping('writing'))
photoBtn.addEventListener('click', () => startTyping('photography'));
aboutBtn.addEventListener('click', () => startTyping('about'));
speechBubble.addEventListener('click', () => skipAndCollapseDialogue());
muteBtn.addEventListener('click', () => toggleMute());

galleryImages.forEach(image => {
    image.addEventListener("click", () => {
        // Extract filename from image
        const key = image.getAttribute('src').split('/').pop().split('.')[0];
        startTyping(key); 
    })
})



let currentFullText = "";
const typeSpeed = 50; // miliseconds per character
let typingTimeout;

// AUDIO POOLING SETUP
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

startTyping('home')

function startTyping(sectionKey) {
    if (sectionDialogue[sectionKey]) {
        updateSectionVisibility(sectionKey);
        updateAccessibilityAttributes(currentFullText);

        // Pick text from array and store globally for skip function
        currentFullText = sectionDialogue[sectionKey];
    } else {
        currentFullText = photoDialogue[sectionKey];
    }

    if (container.classList.contains("collapsed")) {
        
    }

    resetTypingAnimation();

    // Handle reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
    // If user prefers reduced motion, show full text immediately
    element.textContent = currentFullText;
    element.style.borderRight = 'none'; // Remove cursor
    } else {
        runTypewriterEffect();
    }
}

function updateSectionVisibility(sectionKey) {
    // Hide all sections
    const targetId = "#" + sectionKey + "-content";
    contentSections.forEach(section => {
        section.classList.add('hidden');
    });

    // Show target section
    const targetSelection = document.querySelector(targetId);
    if (targetSelection) {
        targetSelection.classList.remove('hidden')
    }
}

function updateAccessibilityAttributes(currentFullText) {
    // Update aria label for screen readers
    container.setAttribute("aria-label", currentFullText);

    // Move the screen reader to read the new label
    container.focus();
}

function resetTypingAnimation() {
    clearTimeout(typingTimeout);
    element.textContent = "";
    element.style.borderRight = '2px solid black';
}

function runTypewriterEffect() {
    let i = 0;
    function loop() {
        if (i < currentFullText.length){
            let char = currentFullText.charAt(i);
            element.textContent += char;
            i++;

            if (char != " " && i % 2 == 0) playBlip();
            typingTimeout = setTimeout(loop, typeSpeed);
        }
    }
    loop();
}
let poolIndex = 0;
let isMuted = true;

function playBlip() {
    if (isMuted) return;

    const audio = audioPool[poolIndex];
    
    if (window.innerWidth < 768) return;

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

function skipAndCollapseDialogue() {
    skipDialogue();
    collapse();
}

function skipDialogue() {
    clearTimeout(typingTimeout);
    element.textContent = currentFullText;
    element.style.borderRight = 'none';
}

function collapse() {
    container.classList.toggle('collapsed');
    bubbleWrapper.classList.toggle('collapsed')
}