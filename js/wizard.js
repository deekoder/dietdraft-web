// wizard.js - Step-by-step meal building
import { showScreen, showMessage } from './utils.js';
import { getMealData } from './data.js';
import { displayRecipe } from './recipe.js';

const selections = { mealType: null, base: null, protein: null };

export function initWizard() {
    // Meal type selection
    document.querySelectorAll('.meal-type-card').forEach(card => {
        card.addEventListener('click', () => {
            const mealType = card.dataset.mealType;
            selectMealType(mealType);
        });
    });
    
    // Base selection next button
    const nextFromBase = document.getElementById('next-from-base');
    if (nextFromBase) {
        nextFromBase.addEventListener('click', () => {
            if (!selections.base) {
                showMessage('Please select a base', 'error');
                return;
            }
            loadProteinStep();
        });
    }
    
    // Base selection back button
    const backFromBase = document.getElementById('back-from-base');
    if (backFromBase) {
        backFromBase.addEventListener('click', () => {
            showScreen('template-screen');
        });
    }
    
    // Protein selection next button
    const nextFromProtein = document.getElementById('next-from-protein');
    if (nextFromProtein) {
        nextFromProtein.addEventListener('click', () => {
            if (!selections.protein) {
                showMessage('Please select a protein', 'error');
                return;
            }
            generateCustomRecipe();
        });
    }
    
    // Protein selection back button
    const backFromProtein = document.getElementById('back-from-protein');
    if (backFromProtein) {
        backFromProtein.addEventListener('click', () => {
            showScreen('base-screen');
        });
    }
}

function selectMealType(mealType) {
    selections.mealType = mealType;
    
    // Update breadcrumb
    const breadcrumb = document.getElementById('meal-type-breadcrumb');
    if (breadcrumb) {
        breadcrumb.textContent = capitalize(mealType);
    }
    
    // Update header
    const header = document.getElementById('template-header');
    if (header) {
        header.textContent = `Popular ${capitalize(mealType)} Templates`;
    }
    
    loadTemplatesStep(mealType);
}

function loadTemplatesStep(mealType) {
    const container = document.getElementById('templates-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Add templates
    const templates = getMealData().templates[mealType] || [];
    templates.forEach(template => {
        const templateHTML = `
            <div class="col-md-4">
                <div class="meal-template-card" data-template-id="${template.id}">
                    <img src="${template.image}" alt="${template.name}" class="meal-template-img">
                    <div class="meal-template-info">
                        <h4>${template.name}</h4>
                        <div class="meal-template-tags">
                            ${template.tags ? template.tags.map(tag => `<span class="meal-tag">${tag}</span>`).join('') : ''}
                        </div>
                    </div>
                </div>
            </div>`;
        container.innerHTML += templateHTML;
    });
    
    // Add custom option
    const customHTML = `
        <div class="col-md-4">
            <div class="meal-template-card" id="custom-meal-option">
                <div class="meal-template-info text-center py-5">
                    <div style="font-size: 3rem; margin-bottom: 10px;">+</div>
                    <h4>Custom ${capitalize(mealType)}</h4>
                    <p>Build your own from scratch</p>
                </div>
            </div>
        </div>`;
    container.innerHTML += customHTML;
    
    // Add click handlers
    addTemplateHandlers();
    
    showScreen('template-screen');
}

function addTemplateHandlers() {
    // Template cards
    document.querySelectorAll('.meal-template-card').forEach(card => {
        card.addEventListener('click', () => {
            if (card.id === 'custom-meal-option') {
                startCustomFlow();
            } else {
                const templateId = card.dataset.templateId;
                useTemplate(templateId);
            }
        });
    });
}

function startCustomFlow() {
    // Update selected items display
    const selectedMealType = document.getElementById('selected-meal-type');
    if (selectedMealType) {
        selectedMealType.textContent = `Meal type: ${capitalize(selections.mealType)}`;
    }
    
    loadBaseStep();
}

function loadBaseStep() {
    const container = document.getElementById('base-options-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    const bases = getMealData().bases[selections.mealType] || [];
    bases.forEach(base => {
        const baseHTML = `
            <div class="col-6 col-md-4 col-lg-3">
                <div class="custom-option-card" data-base-id="${base.id}">
                    <div class="custom-option-icon">${base.icon}</div>
                    <h5>${base.name}</h5>
                </div>
            </div>`;
        container.innerHTML += baseHTML;
    });
    
    // Add click handlers for base selection
    document.querySelectorAll('#base-options-container .custom-option-card').forEach(card => {
        card.addEventListener('click', () => {
            // Remove selection from others
            document.querySelectorAll('#base-options-container .custom-option-card')
                .forEach(c => c.classList.remove('selected'));
            
            // Add selection to clicked card
            card.classList.add('selected');
            
            // Store selection
            selections.base = card.dataset.baseId;
            updateSelectedItemsList();
        });
    });
    
    showScreen('base-screen');
}

function loadProteinStep() {
    const container = document.getElementById('protein-options-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    const proteins = getMealData().proteins;
    proteins.forEach(protein => {
        const proteinHTML = `
            <div class="col-6 col-md-4 col-lg-3">
                <div class="custom-option-card" data-protein-id="${protein.id}">
                    <div class="custom-option-icon">${protein.icon}</div>
                    <h5>${protein.name}</h5>
                </div>
            </div>`;
        container.innerHTML += proteinHTML;
    });
    
    // Add click handlers for protein selection
    document.querySelectorAll('#protein-options-container .custom-option-card').forEach(card => {
        card.addEventListener('click', () => {
            // Remove selection from others
            document.querySelectorAll('#protein-options-container .custom-option-card')
                .forEach(c => c.classList.remove('selected'));
            
            // Add selection to clicked card
            card.classList.add('selected');
            
            // Store selection
            selections.protein = card.dataset.proteinId;
            updateProteinSelectedItems();
        });
    });
    
    // Update selected items for protein screen
    updateSelectedItemsForProtein();
    
    showScreen('protein-screen');
}

function useTemplate(templateId) {
    // Get the actual template data
    const allTemplates = getMealData().templates;
    let selectedTemplate = null;
    
    // Find the template across all meal types
    for (const mealType in allTemplates) {
        selectedTemplate = allTemplates[mealType].find(t => t.id === templateId);
        if (selectedTemplate) break;
    }
    
    // Generate different recipes based on template
    const recipes = {
        'b1': { // Avocado Toast
            meal_name: "Perfect Avocado Toast",
            ingredients: ["2 slices whole grain bread", "1 ripe avocado", "1 tsp lemon juice", "Salt and pepper", "Red pepper flakes"],
            instructions: "1. Toast bread until golden\n2. Mash avocado with lemon juice\n3. Spread on toast\n4. Season and serve",
            estimated_calories: 280,
            dietary_info: "High in healthy fats and fiber, perfect for sustained energy."
        },
        'b2': { // Overnight Oats
            meal_name: "Protein-Packed Overnight Oats",
            ingredients: ["1/2 cup rolled oats", "1/2 cup milk", "1 tbsp chia seeds", "1 tbsp honey", "1/4 cup berries"],
            instructions: "1. Mix oats, milk, and chia seeds\n2. Add honey and berries\n3. Refrigerate overnight\n4. Enjoy cold",
            estimated_calories: 320,
            dietary_info: "High fiber and protein for steady blood sugar levels."
        },
        'l1': { // Quinoa Bowl
            meal_name: "Power Quinoa Bowl",
            ingredients: ["1 cup cooked quinoa", "1/2 cup black beans", "1/4 avocado", "Cherry tomatoes", "Lime dressing"],
            instructions: "1. Cook quinoa according to package\n2. Add beans and vegetables\n3. Top with avocado\n4. Drizzle with lime dressing",
            estimated_calories: 420,
            dietary_info: "Complete protein with complex carbs and healthy fats."
        },
        'l2': { // Chicken Wrap
            meal_name: "Grilled Chicken Wrap",
            ingredients: ["1 whole wheat tortilla", "4 oz grilled chicken", "Mixed greens", "1 tbsp hummus", "Cucumber slices"],
            instructions: "1. Warm tortilla slightly\n2. Spread hummus\n3. Add chicken and vegetables\n4. Roll tightly and slice",
            estimated_calories: 380,
            dietary_info: "Lean protein with complex carbs and vegetables."
        },
        'd1': { // Salmon
            meal_name: "Herb-Crusted Salmon",
            ingredients: ["6 oz salmon fillet", "Mixed herbs", "2 cups roasted vegetables", "1 tbsp olive oil", "Lemon"],
            instructions: "1. Season salmon with herbs\n2. Roast vegetables with olive oil\n3. Pan-sear salmon 4 minutes per side\n4. Serve with lemon",
            estimated_calories: 480,
            dietary_info: "Rich in omega-3 fatty acids and lean protein."
        },
        'd2': { // Stir-fry
            meal_name: "Colorful Vegetable Stir-Fry",
            ingredients: ["2 cups mixed vegetables", "1 tbsp sesame oil", "2 tbsp soy sauce", "1 tsp ginger", "1 cup brown rice"],
            instructions: "1. Heat oil in wok\n2. Add ginger and vegetables\n3. Stir-fry 5-7 minutes\n4. Add soy sauce and serve over rice",
            estimated_calories: 350,
            dietary_info: "Plant-based with complex carbohydrates and antioxidants."
        },
        's1': { // Yogurt Parfait
            meal_name: "Berry Greek Yogurt Parfait",
            ingredients: ["1 cup Greek yogurt", "1/4 cup mixed berries", "2 tbsp granola", "1 tsp honey", "Mint leaves"],
            instructions: "1. Layer yogurt in glass\n2. Add berries and granola\n3. Drizzle with honey\n4. Garnish with mint",
            estimated_calories: 220,
            dietary_info: "High protein snack with probiotics and antioxidants."
        }
    };
    
    // Use the specific recipe or fallback to Mediterranean Bowl
    const recipe = recipes[templateId] || {
        meal_name: "Mediterranean Bowl",
        ingredients: ["1 cup cooked quinoa", "1/2 cup chickpeas", "Vegetables", "Feta cheese", "Olive oil"],
        instructions: "1. Combine ingredients\n2. Drizzle with olive oil\n3. Serve fresh",
        estimated_calories: 450,
        dietary_info: "Balanced Mediterranean-style meal."
    };
    
    displayRecipe(recipe);
}

function generateCustomRecipe() {
    const baseData = getMealData().allBases.find(b => b.id === selections.base);
    const proteinData = getMealData().proteins.find(p => p.id === selections.protein);
    
    if (!baseData || !proteinData) {
        showMessage('Error finding selected options', 'error');
        return;
    }
    
    const recipe = {
        meal_name: `${proteinData.name} ${capitalize(selections.mealType)} with ${baseData.name}`,
        ingredients: [
            `1 cup ${baseData.name.toLowerCase()}`,
            `4 oz ${proteinData.name.toLowerCase()}`,
            "1/2 cup mixed vegetables",
            "2 tbsp olive oil",
            "1 clove garlic, minced",
            "Salt and pepper to taste",
            "Fresh herbs for garnish"
        ],
        instructions: `1. Prepare the ${baseData.name.toLowerCase()} according to package instructions.\n2. Season the ${proteinData.name.toLowerCase()} with salt and pepper.\n3. Heat olive oil in a pan over medium heat.\n4. Add garlic and cook until fragrant.\n5. Add ${proteinData.name.toLowerCase()} and cook until done.\n6. Add mixed vegetables and cook until tender.\n7. Combine and serve with fresh herbs.`,
        estimated_calories: 400,
        dietary_info: `This ${selections.mealType} provides balanced nutrition with complex carbohydrates and protein.`
    };
    
    displayRecipe(recipe);
}

function updateSelectedItemsList() {
    const list = document.getElementById('selected-items-list');
    if (!list) return;
    
    const mealTypeItem = document.getElementById('selected-meal-type');
    list.innerHTML = '';
    if (mealTypeItem) {
        list.appendChild(mealTypeItem);
    }
    
    if (selections.base) {
        const baseData = getMealData().allBases.find(b => b.id === selections.base);
        if (baseData) {
            const li = document.createElement('li');
            li.textContent = `Base: ${baseData.name}`;
            list.appendChild(li);
        }
    }
}

function updateSelectedItemsForProtein() {
    const list = document.getElementById('selected-items-list-protein');
    if (!list) return;
    
    list.innerHTML = '';
    
    // Add meal type
    const mealTypeLi = document.createElement('li');
    mealTypeLi.textContent = `Meal type: ${capitalize(selections.mealType)}`;
    list.appendChild(mealTypeLi);
    
    // Add base
    if (selections.base) {
        const baseData = getMealData().allBases.find(b => b.id === selections.base);
        if (baseData) {
            const baseLi = document.createElement('li');
            baseLi.textContent = `Base: ${baseData.name}`;
            list.appendChild(baseLi);
        }
    }
}

function updateProteinSelectedItems() {
    const list = document.getElementById('selected-items-list-protein');
    if (!list) return;
    
    // Remove existing protein item
    const existingProtein = Array.from(list.children).find(item => 
        item.textContent.startsWith('Protein:'));
    if (existingProtein) {
        list.removeChild(existingProtein);
    }
    
    // Add new protein item
    if (selections.protein) {
        const proteinData = getMealData().proteins.find(p => p.id === selections.protein);
        if (proteinData) {
            const proteinLi = document.createElement('li');
            proteinLi.textContent = `Protein: ${proteinData.name}`;
            list.appendChild(proteinLi);
        }
    }
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}