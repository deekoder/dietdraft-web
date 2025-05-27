// js/main.js
import { mealChoices, showScreen } from './utils.js';
import { initMealTypeScreen } from './templates.js';
import { initVoiceButton } from './voice.js';

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initMealTypeScreen();
    initVoiceButton();
    initBackButtons();
});

function initBackButtons() {
    // Back to meal types from templates
    document.getElementById('back-to-meal-types').addEventListener('click', function(e) {
        e.preventDefault();
        showScreen('meal-type-screen');
    });
    
    // Back to meal types from base
    document.getElementById('back-to-meal-types-from-base').addEventListener('click', function(e) {
        e.preventDefault();
        showScreen('meal-type-screen');
    });
    
    // Back to templates from base
    document.getElementById('back-to-templates').addEventListener('click', function(e) {
        e.preventDefault();
        showScreen('template-screen');
    });
    
    // Back to start from protein
    document.getElementById('back-to-start-from-protein').addEventListener('click', function(e) {
        e.preventDefault();
        showScreen('meal-type-screen');
    });
    
    // Back to base from protein
    document.getElementById('back-to-base-from-protein').addEventListener('click', function(e) {
        e.preventDefault();
        showScreen('base-screen');
    });
    
    // Back to start from final recipe
    document.getElementById('back-to-start').addEventListener('click', function(e) {
        e.preventDefault();
        showScreen('meal-type-screen');
    });
    
    // Start over button
    document.getElementById('start-over-btn').addEventListener('click', function() {
        // Reset selections
        mealChoices.mealType = null;
        mealChoices.base = null;
        mealChoices.protein = null;
        mealChoices.vegetables = [];
        mealChoices.dietaryPreferences = [];
        mealChoices.cuisineType = null;
        mealChoices.maxCalories = null;
        
        showScreen('meal-type-screen');
    });
    
    // Share button
    document.getElementById('share-btn').addEventListener('click', function() {
        alert('Sharing functionality would be implemented here');
    });
    
    // Save button
    document.getElementById('save-btn').addEventListener('click', function() {
        alert('Recipe saved successfully!');
    });
}