// app.js - Just coordinates everything
import { initVoice } from './voice.js';
import { initWizard } from './wizard.js';
import { initNavigation } from './navigation.js';
import { initDietCoach } from './diet-coach.js';  

document.addEventListener('DOMContentLoaded', function() {
    console.log('DietDraft starting...');
    
    // Initialize all modules
    initVoice();
    initWizard();
    initNavigation();
    initNavigation();   // Navigation between screens
    initDietCoach();    // New conversational diet coach
    
    console.log('DietDraft ready!');
});