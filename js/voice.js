// js/voice.js
import { API_URL } from './utils.js';
import { displayFinalRecipe } from './recipes.js';

export function initVoiceButton() {
    const voiceButton = document.getElementById('voice-button');
    
    if (voiceButton) {
        voiceButton.addEventListener('click', function() {
            if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
                alert('Your browser does not support speech recognition. Please try Chrome, Edge, or Safari.');
                return;
            }
            
            startVoiceRecognition();
        });
    }
}

function startVoiceRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        processVoiceInput(transcript);
    };
    
    recognition.onerror = function(event) {
        console.error('Speech recognition error:', event.error);
        alert('Error recognizing speech. Please try again.');
    };
    
    recognition.start();
    alert('Listening... Say your meal request.');
}

async function processVoiceInput(voiceText) {
    try {
        const response = await fetch(`${API_URL}/parse-voice`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                voice_text: voiceText
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to parse voice input');
        }
        
        const parsedData = await response.json();
        
        if (confirm(`I understood: ${parsedData.parsed_text}\n\nGenerate recipe?`)) {
            generateRecipeFromVoice(parsedData);
        }
        
    } catch (error) {
        console.error('Error processing voice input:', error);
        alert('Error processing your request. Please try again.');
    }
}

async function generateRecipeFromVoice(parsedData) {
    try {
        delete parsedData.parsed_text;
        
        const response = await fetch(`${API_URL}/generate-meal`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(parsedData)
        });
        
        if (!response.ok) {
            throw new Error('Failed to generate recipe');
        }
        
        const recipe = await response.json();
        displayFinalRecipe(recipe);
        
    } catch (error) {
        console.error('Error generating recipe:', error);
        alert('Error generating recipe. Please try again.');
    }
}