const dialogueContent = {
    home: "Welcome to my website! This is a project for my college webdesign class!",
    about: "What's up?"
};

const element = document.querySelector(".typewriter");
const container = document.querySelector("#typewriter-container");
const typeSpeed = 50; // miliseconds per character
let typingTimeout;

function startTyping(sectionKey) {
    // Pick text from array
    const textToType = dialogueContent[sectionKey];

    // Stop current typing
    clearTimeout(typingTimeout)

    // Accessability: update aria label immediately for screen readers
    container.setAttribute("aria-label", textToType);

    // Accessability: Move the screen reader to read the new label
    container.focus();

    // Clear text
    element.textContent = "";

    // Handle reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
    // If user prefers reduced motion, show full text immediately
    element.textContent = textToType;
    element.style.borderRight = 'none'; // Remove cursor
    } else {
        element.style.borderRight = '2px solid black'; // Restore cursor if preferences change
        let i = 0
        function typeWriter() {
            if (i < textToType.length){
                element.textContent += textToType.charAt(i);
                i++;
                setTimeout(typeWriter, typeSpeed)
            }
        }
        typeWriter();   
    }
}