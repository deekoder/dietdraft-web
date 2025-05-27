// navigation.js - Handle all navigation and back buttons
import { showScreen } from './utils.js';

export function initNavigation() {
    // Back to meal types from templates
    const backToMealTypes = document.getElementById('back-to-meal-types');
    if (backToMealTypes) {
        backToMealTypes.addEventListener('click', (e) => {
            e.preventDefault();
            showScreen('meal-type-screen');
        });
    }
    
    // Back to meal types from base screen
    const backToMealTypesFromBase = document.getElementById('back-to-meal-types-from-base');
    if (backToMealTypesFromBase) {
        backToMealTypesFromBase.addEventListener('click', (e) => {
            e.preventDefault();
            showScreen('meal-type-screen');
        });
    }
    
    // Back to templates from base screen
    const backToTemplates = document.getElementById('back-to-templates');
    if (backToTemplates) {
        backToTemplates.addEventListener('click', (e) => {
            e.preventDefault();
            showScreen('template-screen');
        });
    }
    
    // Back to start from protein screen
    const backToStartFromProtein = document.getElementById('back-to-start-from-protein');
    if (backToStartFromProtein) {
        backToStartFromProtein.addEventListener('click', (e) => {
            e.preventDefault();
            showScreen('meal-type-screen');
        });
    }
    
    // Back to base from protein screen
    const backToBaseFromProtein = document.getElementById('back-to-base-from-protein');
    if (backToBaseFromProtein) {
        backToBaseFromProtein.addEventListener('click', (e) => {
            e.preventDefault();
            showScreen('base-screen');
        });
    }
    
    // Back to start from final recipe
    const backToStart = document.getElementById('back-to-start');
    if (backToStart) {
        backToStart.addEventListener('click', (e) => {
            e.preventDefault();
            resetAndGoHome();
        });
    }
    
    // Start over button
    const startOverBtn = document.getElementById('start-over-btn');
    if (startOverBtn) {
        startOverBtn.addEventListener('click', resetAndGoHome);
    }
    
    // Share button (placeholder)
    const shareBtn = document.getElementById('share-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            alert('Sharing functionality would be implemented here');
        });
    }
    
    // Save button (placeholder)
    const saveBtn = document.getElementById('save-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            alert('Recipe saved successfully!');
        });
    }
}

function resetAndGoHome() {
    // Could reset any global state here if needed
    showScreen('meal-type-screen');
}