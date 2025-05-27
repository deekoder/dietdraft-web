// app.js - Just coordinates everything
import { initVoice } from './voice.js';
import { initWizard } from './wizard.js';
import { initNavigation } from './navigation.js';

document.addEventListener('DOMContentLoaded', function() {
    console.log('DietDraft starting...');
    
    // Initialize all modules
    initVoice();
    initWizard();
    initNavigation();
    
    console.log('DietDraft ready!');
});