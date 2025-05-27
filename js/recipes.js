// js/recipes.js
import { API_URL, mealChoices, showScreen } from './utils.js';
import { getBaseOptionById, getProteinOptionById } from './data.js';

export function generateRecipeFromCustomSelections() {
    const baseOption = getBaseOptionById(mealChoices.base);
    const proteinOption = getProteinOptionById(mealChoices.protein);
    
    const recipeName = `${proteinOption.name} ${mealChoices.mealType} with ${baseOption.name}`;
    
    const simulatedRecipe = {
        meal_name: recipeName,
        ingredients: [
            `1 cup ${baseOption.name.toLowerCase()}`,
            `4 oz ${proteinOption.name.toLowerCase()}`,
            "1/2 cup mixed vegetables",
            "2 tbsp olive oil",
            "1 clove garlic, minced",
            "Salt and pepper to taste",
            "Fresh herbs for garnish"
        ],
        instructions: `1. Prepare the ${baseOption.name.toLowerCase()} according to package instructions.\n2. Season the ${proteinOption.name.toLowerCase()} with salt and pepper.\n3. Heat olive oil in a pan over medium heat.\n4. Add garlic and cook until fragrant, about 30 seconds.\n5. Add ${proteinOption.name.toLowerCase()} and cook until done.\n6. Add mixed vegetables and cook until tender.\n7. Combine with ${baseOption.name.toLowerCase()} and serve, garnished with fresh herbs.`,
        estimated_calories: 450,
        dietary_info: `This ${mealChoices.mealType} provides a balanced combination of complex carbohydrates from the ${baseOption.name.toLowerCase()} and protein from the ${proteinOption.name.toLowerCase()}. The meal is rich in essential nutrients and offers a good balance of macronutrients to help maintain stable blood sugar levels.`
    };
    
    displayFinalRecipe(simulatedRecipe);
}

export function displayFinalRecipe(recipe) {
    document.getElementById('final-recipe-title').textContent = recipe.meal_name;
    
    document.getElementById('final-recipe-image').src = 
        `https://dummyimage.com/800x400/4CAF50/ffffff&text=${encodeURIComponent(recipe.meal_name)}`;
    
    // Set ingredients
    const ingredientsList = document.getElementById('final-ingredients-list');
    ingredientsList.innerHTML = '';
    recipe.ingredients.forEach(ingredient => {
        const li = document.createElement('li');
        li.textContent = ingredient;
        ingredientsList.appendChild(li);
    });
    
    // Set instructions with better formatting
    const instructionsContainer = document.getElementById('final-instructions');
    const instructions = recipe.instructions.split('\n').filter(step => step.trim());

    if (instructions.length > 1) {
        const ol = document.createElement('ol');
        instructions.forEach(step => {
            const li = document.createElement('li');
            li.textContent = step.replace(/^\d+\.\s*/, '');
            ol.appendChild(li);
        });
        instructionsContainer.innerHTML = '';
        instructionsContainer.appendChild(ol);
    } else {
        instructionsContainer.textContent = recipe.instructions;
    }
    
    // Set nutritional information
    let nutritionText = '';
    if (recipe.estimated_calories) {
        nutritionText += `<strong>Calories:</strong> ${recipe.estimated_calories} per serving<br>`;
    }
    if (recipe.dietary_info) {
        nutritionText += `<strong>Dietary Information:</strong> ${recipe.dietary_info}`;
    }
    document.getElementById('final-nutrition').innerHTML = nutritionText;
    
    // Get meal reasoning
    getMealReasoning(recipe);
    
    showScreen('final-recipe-screen');
}

async function getMealReasoning(recipe) {
    try {
        const response = await fetch(`${API_URL}/meal-reasoning`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                meal_name: recipe.meal_name,
                ingredients: recipe.ingredients,
                instructions: recipe.instructions,
                dietary_preferences: []
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to get meal reasoning');
        }
        
        const reasoningData = await response.json();
        displayMealReasoning(reasoningData.reasoning);
        
    } catch (error) {
        console.error('Error getting meal reasoning:', error);
        displayMealReasoning({
            key_ingredient_choices: "This meal combines nutritious ingredients for balanced nutrition.",
            nutritional_benefits: "Provides essential macronutrients and micronutrients.",
            dietary_alignment: "Supports general health and wellness goals."
        });
    }
}

function displayMealReasoning(reasoning) {
    const reasoningContainer = document.getElementById('meal-reasoning-container');
    
    if (!reasoningContainer) {
        console.warn('Meal reasoning container not found in HTML');
        return;
    }
    
    reasoningContainer.innerHTML = `
        <h5>🧠 Nutritional Insights</h5>
        
        <div class="reasoning-section">
            <h6>🥗 Key Ingredients</h6>
            <p>${reasoning.key_ingredient_choices}</p>
        </div>
        
        <div class="reasoning-section">
            <h6>💪 Health Benefits</h6>
            <p>${reasoning.nutritional_benefits}</p>
        </div>
        
        <div class="reasoning-section">
            <h6>🎯 Dietary Alignment</h6>
            <p>${reasoning.dietary_alignment}</p>
        </div>
    `;
}