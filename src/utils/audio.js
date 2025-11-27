export const speak = (text) => {
    if (!window.speechSynthesis) return;

    // Cancel any current speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9; // Slightly slower for kids

    // improved voice selection
    const voices = window.speechSynthesis.getVoices();

    // Try to find a nice sounding voice (iOS/Mac often has Samantha or Daniel)
    const preferredVoice = voices.find(voice =>
        voice.name.includes('Samantha') ||
        voice.name.includes('Daniel') ||
        voice.name.includes('Google US English')
    );

    if (preferredVoice) {
        utterance.voice = preferredVoice;
    }

    window.speechSynthesis.speak(utterance);
};

export const playSound = (type) => {
    const audio = new Audio();
    if (type === 'correct') {
        // Placeholder for correct sound (e.g., ding or yay)
        // In a real app, we'd load a file. For now, we can use a simple beep or rely on TTS "Yay!"
        speak("Yay! Great job!");
    } else if (type === 'incorrect') {
        // Placeholder for incorrect sound (Roar)
        // We can use TTS to simulate a roar if no file is present, or just say "Try again"
        speak("Roar! Try again.");
    }
};
