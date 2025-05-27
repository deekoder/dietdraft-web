// js/templates.js
import { mealChoices, capitalizeFirstLetter, showScreen } from './utils.js';
import { getTemplatesForMealType } from './data.js';
import { displayFinalRecipe } from './recipes.js';
import { loadBaseOptions } from './selections.js';

export function initMealTypeScreen() {
    const mealTypeCards = document.querySelectorAll('.meal-type-card');
    
    mealTypeCards.forEach(card => {
        card.addEventListener('click', function() {
            const mealType = this.getAttribute('data-meal-type');
            mealChoices.mealType = mealType;
            
            document.getElementById('meal-type-breadcrumb').textContent = capitalizeFirstLetter(mealType);
            document.getElementById('template-header').textContent = `Popular ${capitalizeFirstLetter(mealType)} Templates`;
            
            loadTemplates(mealType);
            showScreen('template-screen');
        });
    });
}

function loadTemplates(mealType) {
    const templatesContainer = document.getElementById('templates-container');
    templatesContainer.innerHTML = '';
    
    const templates = getTemplatesForMealType(mealType);
    
    templates.forEach(template => {
        const templateCard = document.createElement('div');
        templateCard.className = 'col-md-4';
        templateCard.innerHTML = `
            <div class="meal-template-card" data-template-id="${template.id}">
                <img src="${template.image}" alt="${template.name}" class="meal-template-img">
                <div class="meal-template-info">
                    <h4>${template.name}</h4>
                    <div class="meal-template-tags">
                        ${template.tags.map(tag => `<span class="meal-tag">${tag}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;
        
        templatesContainer.appendChild(templateCard);
    });
    
    // Add custom option
    const customOption = document.createElement('div');
    customOption.className = 'col-md-4';
    customOption.innerHTML = `
        <div class="meal-template-card" id="custom-meal-option">
            <div class="meal-template-info text-center py-5">
                <div style="font-size: 3rem; margin-bottom: 10px;">+</div>
                <h4>Custom ${capitalizeFirstLetter(mealType)}</h4>
                <p>Build your own from scratch</p>
            </div>
        </div>
    `;
    
    templatesContainer.appendChild(customOption);
    addTemplateEventListeners();
}

function addTemplateEventListeners() {
    const templateCards = document.querySelectorAll('.meal-template-card');
    
    templateCards.forEach(card => {
        card.addEventListener('click', function() {
            if (this.id === 'custom-meal-option') {
                document.getElementById('selected-meal-type').textContent = `Meal type: ${capitalizeFirstLetter(mealChoices.mealType)}`;
                loadBaseOptions(mealChoices.mealType);
                showScreen('base-screen');
            } else {
                const templateId = this.getAttribute('data-template-id');
                simulateTemplateSelection(templateId);
            }
        });
    });
}

function simulateTemplateSelection(templateId) {
    const simulatedRecipe = {
        meal_name: "Mediterranean Bowl",
        ingredients: [
            "1 cup cooked quinoa",
            "1/2 cup chickpeas",
            "1/4 cup diced cucumber",
            "1/4 cup diced tomatoes",
            "2 tbsp feta cheese",
            "1 tbsp olive oil",
            "1 tsp lemon juice",
            "Salt and pepper to taste"
        ],
        instructions: "1. Combine quinoa and chickpeas in a bowl.\n2. Add cucumber, tomatoes, and feta cheese.\n3. Drizzle with olive oil and lemon juice.\n4. Season with salt and pepper.\n5. Toss to combine and serve.",
        estimated_calories: 450,
        dietary_info: "This Mediterranean bowl is high in protein and fiber, making it ideal for maintaining stable blood sugar levels. The combination of quinoa and chickpeas provides a complete protein source, while the vegetables add essential vitamins and minerals."
    };
    
    displayFinalRecipe(simulatedRecipe);
}