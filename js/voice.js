// voice.js - Voice functionality only
import { showMessage, API_URL } from './utils.js';
import { displayRecipe } from './recipe.js';

export function initVoice() {
    const voiceButton = document.getElementById('voice-button');
    if (!voiceButton) return;
    
    voiceButton.addEventListener('click', handleVoiceClick);
}

function handleVoiceClick() {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
        showMessage('Speech not supported. Use Chrome/Safari.', 'error');
        return;
    }
    startListening();
}

function startListening() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    const button = document.getElementById('voice-button');
    
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
    
    const originalText = button.innerHTML;
    button.innerHTML = '🎙️ Listening...';
    button.disabled = true;
    
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        resetButton(button, originalText);
        processVoice(transcript);
    };
    
    recognition.onerror = (event) => {
        console.error('Speech error:', event.error);
        resetButton(button, originalText);
        showMessage('Voice error. Try again.', 'error');
    };
    
    recognition.onend = () => {
        resetButton(button, originalText);
    };
    
    try {
        recognition.start();
        showMessage('Listening... Tell me what you want!', 'info');
    } catch (error) {
        resetButton(button, originalText);
        showMessage('Failed to start listening.', 'error');
    }
}

async function processVoice(transcript) {
    showMessage(`Processing: "${transcript}"`, 'info');
    
    try {
        const response = await fetch(`${API_URL}/parse-voice`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ voice_text: transcript })
        });
        
        if (!response.ok) {
            throw new Error('Parse failed');
        }
        
        const data = await response.json();
        
        if (confirm(`Generate recipe for: ${data.parsed_text}?`)) {
            generateFromVoice(data);
        }
    } catch (error) {
        console.error('Voice processing error:', error);
        showMessage('Processing failed. Try again.', 'error');
    }
}

async function generateFromVoice(data) {
    delete data.parsed_text;
    
    try {
        showMessage('Generating recipe...', 'info');
        
        const response = await fetch(`${API_URL}/generate-meal`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error('Generation failed');
        }
        
        const recipe = await response.json();
        displayRecipe(recipe);
    } catch (error) {
        console.error('Recipe generation error:', error);
        showMessage('Recipe generation failed.', 'error');
    }
}

function resetButton(button, originalText) {
    button.innerHTML = originalText;
    button.disabled = false;
}