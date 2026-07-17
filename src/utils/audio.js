/**
 * Enhanced speak function with voice type options for child-friendly, natural-sounding speech
 * @param {string} text - The text to speak
 * @param {Object} options - Voice configuration options
 * @param {string} options.voiceType - 'female', 'male', or 'neutral' (default: 'neutral')
 * @param {number} options.pitch - Voice pitch 0.0-2.0 (default: 1.0)
 * @param {number} options.rate - Speech rate 0.1-10.0 (default: 0.9)
 * @param {number} options.volume - Volume 0.0-1.0 (default: 1.0)
 */
export const speak = (text, options = {}) => {
    if (!window.speechSynthesis) return;

    const {
        voiceType = 'neutral',
        pitch = 1.0,
        rate = 0.9,
        volume = 1.0
    } = options;

    // Cancel any current speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.pitch = pitch;
    utterance.rate = rate;
    utterance.volume = volume;

    // Get available voices
    const voices = window.speechSynthesis.getVoices();

    const defaultVoice = voices.find(v => v.default && v.lang.startsWith('en'));
    let selectedVoice = defaultVoice || null;

    if (!selectedVoice) {
        if (voiceType === 'female') {
            // Prioritize female voices - child-friendly options
            selectedVoice = voices.find(voice =>
                voice.name.includes('Google UK English Female') ||
                voice.name.includes('Samantha') ||
                voice.name.includes('Victoria') ||
                voice.name.includes('Karen') ||
                voice.name.includes('Moira') ||
                (voice.name.includes('Female') && voice.lang.startsWith('en'))
            );
        } else if (voiceType === 'male') {
            // Prioritize male voices
            selectedVoice = voices.find(voice =>
                voice.name.includes('Daniel') ||
                voice.name.includes('Google US English Male') ||
                voice.name.includes('Microsoft David') ||
                (voice.name.includes('Male') && voice.lang.startsWith('en'))
            );
        } else {
            // Neutral - try to find a nice sounding voice
            selectedVoice = voices.find(voice =>
                voice.name.includes('Samantha') ||
                voice.name.includes('Daniel') ||
                voice.name.includes('Google US English')
            );
        }
    }

    if (selectedVoice) {
        utterance.voice = selectedVoice;
    }

    window.speechSynthesis.speak(utterance);
};

/**
 * Speak with a child-friendly female voice
 * @param {string} text - The text to speak
 * @param {Object} customOptions - Optional overrides for voice settings
 */
export const speakWithFemaleVoice = (text, customOptions = {}) => {
    const defaultOptions = {
        voiceType: 'female',
        pitch: 1.3, // Higher pitch for more feminine, friendly sound
        rate: 0.95, // Slightly slower for clarity
        volume: 1.0
    };

    speak(text, { ...defaultOptions, ...customOptions });
};

/**
 * Speak an encouraging message with natural, human-like delivery
 * Adds slight variations to sound more natural and less robotic
 * @param {string} text - The text to speak
 * @param {string} voiceType - 'female', 'male', or 'neutral'
 */
export const speakEncouraging = (text, voiceType = 'female') => {
    // Add slight random variations to make it sound more natural (simulating "temperature")
    const pitchVariation = Math.random() * 0.2 - 0.1; // -0.1 to +0.1
    const rateVariation = Math.random() * 0.1 - 0.05; // -0.05 to +0.05

    const options = {
        voiceType: voiceType,
        pitch: voiceType === 'female' ? 1.3 + pitchVariation : 1.0 + pitchVariation,
        rate: 0.92 + rateVariation, // Natural conversational pace with variation
        volume: 1.0
    };

    speak(text, options);
};

export const playSound = (type) => {
    const audio = new Audio();
    if (type === 'correct') {
        // Use encouraging female voice for positive feedback
        speakEncouraging("Great job!");
    } else if (type === 'incorrect') {
        // Use encouraging female voice for "try again" - more supportive
        speakEncouraging("Try again, you can do it!");
    }
};
