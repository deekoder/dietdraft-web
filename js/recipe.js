// recipe.js - Recipe display functionality
import { showScreen } from './utils.js';

export function displayRecipe(recipe) {
    // Set recipe title
    const titleElement = document.getElementById('final-recipe-title');
    if (titleElement) {
        titleElement.textContent = recipe.meal_name;
    }
    
    // Set recipe image
    const imageElement = document.getElementById('final-recipe-image');
    if (imageElement) {
        imageElement.src = `https://dummyimage.com/800x400/4CAF50/ffffff&text=${encodeURIComponent(recipe.meal_name)}`;
    }
    
    // Set ingredients
    const ingredientsList = document.getElementById('final-ingredients-list');
    if (ingredientsList) {
        ingredientsList.innerHTML = '';
        recipe.ingredients.forEach(ingredient => {
            const li = document.createElement('li');
            li.textContent = ingredient;
            ingredientsList.appendChild(li);
        });
    }
    
    // Set instructions
    const instructionsElement = document.getElementById('final-instructions');
    if (instructionsElement) {
        const instructions = recipe.instructions.split('\n').filter(step => step.trim());
        
        if (instructions.length > 1) {
            const ol = document.createElement('ol');
            instructions.forEach(step => {
                const li = document.createElement('li');
                li.textContent = step.replace(/^\d+\.\s*/, '');
                ol.appendChild(li);
            });
            instructionsElement.innerHTML = '';
            instructionsElement.appendChild(ol);
        } else {
            instructionsElement.textContent = recipe.instructions;
        }
    }
    
    // Set nutritional information
    const nutritionElement = document.getElementById('final-nutrition');
    if (nutritionElement) {
        let nutritionHTML = '';
        if (recipe.estimated_calories) {
            nutritionHTML += `<strong>Calories:</strong> ${recipe.estimated_calories} per serving<br>`;
        }
        if (recipe.dietary_info) {
            nutritionHTML += `<strong>Dietary Information:</strong> ${recipe.dietary_info}`;
        }
        nutritionElement.innerHTML = nutritionHTML;
    }
    
    // Set reasoning
    const reasoningElement = document.getElementById('meal-reasoning-container');
    if (reasoningElement) {
        reasoningElement.innerHTML = `
            <h5>🧠 Nutritional Insights</h5>
            <div class="reasoning-section">
                <h6>💪 Why This Works</h6>
                <p>${recipe.dietary_info || 'This meal provides balanced nutrition for your dietary needs.'}</p>
            </div>
        `;
    }
    
    // Show the recipe screen
    showScreen('final-recipe-screen');
}