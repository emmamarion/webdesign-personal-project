const textToType = "Welcome to my website! This is a project for my college webdesign class!";
const typeSpeed = 50; // miliseconds per character
const element = document.querySelector(".typewriter");

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
  // If they prefer reduced motion, show full text immediately
  element.textContent = textToType;
  element.style.borderRight = 'none'; // Remove cursor
} else {
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