// js/utils.js
export const API_URL = 'https://dietdraft.onrender.com';

export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show the specified screen
    document.getElementById(screenId).classList.add('active');
    
    // Scroll to top
    window.scrollTo(0, 0);
}

// Shared meal choices object
export const mealChoices = {
    mealType: null,
    base: null,
    protein: null,
    vegetables: [],
    dietaryPreferences: [],
    cuisineType: null,
    maxCalories: null
};