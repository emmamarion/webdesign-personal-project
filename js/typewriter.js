const sectionDialogue = {
    home: "Welcome to my website! My name is Swirly Wirly Toffee, but you can just call me Toffee. Click on the buttons to the right of me to explore the website! You can also poke my words to make them smaller, or so I've been told.",
    writing: "WRITING",
    photography: "Emma likes to leave her photos here for me to look at. Poke on any of them and I can tell you more about them!",
    about: "The owner of this website is Emma Marion. She's a Junior at the University of Michigan School of Information (UMSI) studying user experience (UX) design. She actually built this website for her final project in her web design class! How cool is that?"
};

const photoDialogue = {
    tinyhouse: "Emma isn't really sure what this is, but she thinks it's funny that it looks like a tiny house. Me? I'm already in talks to take out a loan!",
    twochairs: "Ahhh, ruby ellen farm. One of Emma's favorite spots to go for walks in Traverse City. I wonder if anyone ever sits in those chairs...",
    westbay: "Rosie took this one on Traverse City's west bay, and then Emma took it into photoshop for color grading and cropping. She was going for a kinda wes anderson sorta thing? Back when the photo was taken, there was a lot of construction happening over there. Emma tells me it was to build a roundabout, and it's finished now! Maybe she'll show me a picture some day...",
    rainbow: "Fun fact about this one: Emma used the upper right corner of this picture as the album cover art for her first hit lofi single. She brags that it made 4 cents, which sounds like a lot.",
    rosielore: "This is Emma's girlfriend Rosie! they were going to do this whole 'us lore' project together, but it never panned out. This is one of the concept art pieces Emma made for it!",
    snowlore: "Sometimes, when driving around up north you'll find secret beaches tucked away off the highway. Emma likes going to them in the winter and taking photos, brrrr.. ",
    carlore: "This one was taken in Californa somewhere in La Jolla. All of the cars look kinda scary at night...",
}

// GLOBAL VARIABLES
const mouthSpeed = 100;
const element = document.querySelector(".typewriter"); // span element
const container = document.querySelector("#typewriter-container"); // p element
const speechBubble = document.querySelector(".speech-bubble"); // div element
const contentSections = document.querySelectorAll(".content-section") // all content sections
const bubbleWrapper = document.querySelector(".bubble-wrapper");
const galleryImgBtns = document.querySelectorAll("#photo-gallery button");
const catBody = document.querySelector(".cat-body");
const volumeIcon = document.querySelector("#volume-icon");

let mouthInterval;

// BUTTONS
const homeBtn = document.querySelector('#homeBtn') // home button
const writingBtn = document.querySelector('#writingBtn') // writing button
const photographyBtn = document.querySelector('#photographyBtn') // photo button
const aboutBtn = document.querySelector('#aboutBtn') // about button
const muteBtn = document.querySelector('#muteBtn') // mute button
let previousSection = homeBtn;

// EVENT LISTENERS
homeBtn.addEventListener('click', () => startTyping('home'));
writingBtn.addEventListener('click', () => startTyping('writing'))
photographyBtn.addEventListener('click', () => startTyping('photography'));
aboutBtn.addEventListener('click', () => startTyping('about'));
speechBubble.addEventListener('click', () => skipAndCollapseDialogue());
muteBtn.addEventListener('click', () => toggleMute());

galleryImgBtns.forEach(button => {
    button.addEventListener("click", () => {
        // Extract ID from button that matched
        const key = button.id
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
        // Pick text from array and store globally for skip function
        currentFullText = sectionDialogue[sectionKey];
    } else {
        currentFullText = photoDialogue[sectionKey];
    }
    // Update aria label for screen readers
    container.setAttribute("aria-label", currentFullText);
    // Move the screen reader to read the new label
    container.focus();

    resetTypingAnimation();

    // Check every time dialogue starts in case user preferences change
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
        targetSelection.classList.remove('hidden');
        const targetBtnID = "#" + sectionKey + "Btn";
        targetBtn = document.querySelector(targetBtnID);
        targetBtn.classList.add('shown');
        previousSection.classList.remove('shown');
        previousSection = targetBtn;

    }
}

function startMouthAnimation() {
    clearInterval(mouthInterval);
    mouthInterval = setInterval(() => {
        const currentSrc = catBody.getAttribute('src')

        if (currentSrc.includes("Closed")) { 
            catBody.setAttribute('src', 'images/toffee_assets/toffeeMouthOpen.png')
        } else {
            catBody.setAttribute('src', 'images/toffee_assets/toffeeMouthClosed.png')
        }
    }, mouthSpeed); // speed of mouth movement
}

function stopMouthAnimation() {
    clearInterval(mouthInterval);
    catBody.setAttribute('src', 'images/toffee_assets/toffeeMouthClosed.png')
}

function resetTypingAnimation() {
    clearTimeout(typingTimeout);
    element.textContent = "";
    element.style.borderRight = '2px solid black';
}

function runTypewriterEffect() {
    let i = 0;
    startMouthAnimation();
    function loop() {
        if (i < currentFullText.length){
            let char = currentFullText.charAt(i);
            element.textContent += char;
            i++;

            if (char != " " && i % 2 == 0) playBlip();
            typingTimeout = setTimeout(loop, typeSpeed);
        } else {
            stopMouthAnimation();
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
        volumeIcon.setAttribute("src", "images/volumeMuted.png");
    } else {
        btn.setAttribute("aria-pressed", "false")
        volumeIcon.setAttribute("src", "images/volume.png");
    }
}

function skipAndCollapseDialogue() {
    skipDialogue();
    collapse();
}

function skipDialogue() {
    clearTimeout(typingTimeout);
    stopMouthAnimation();
    element.textContent = currentFullText;
    element.style.borderRight = 'none';
}

function collapse() {
    container.classList.toggle('collapsed');
    bubbleWrapper.classList.toggle('collapsed')
}