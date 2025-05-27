// js/selections.js
import { mealChoices, showScreen, capitalizeFirstLetter } from './utils.js';
import { getBaseOptionsForMealType, getProteinOptions, getBaseOptionById, getProteinOptionById } from './data.js';
import { generateRecipeFromCustomSelections } from './recipes.js';

export function loadBaseOptions(mealType) {
    const baseOptionsContainer = document.getElementById('base-options-container');
    baseOptionsContainer.innerHTML = '';
    
    const baseOptions = getBaseOptionsForMealType(mealType);
    
    baseOptions.forEach(option => {
        const optionCard = document.createElement('div');
        optionCard.className = 'col-6 col-md-4 col-lg-3';
        optionCard.innerHTML = `
            <div class="custom-option-card" data-base-id="${option.id}">
                <div class="custom-option-icon">${option.icon}</div>
                <h5>${option.name}</h5>
            </div>
        `;
        
        baseOptionsContainer.appendChild(optionCard);
    });
    
    addBaseOptionEventListeners();
}

function addBaseOptionEventListeners() {
    const baseOptionCards = document.querySelectorAll('#base-options-container .custom-option-card');
    
    baseOptionCards.forEach(card => {
        card.addEventListener('click', function() {
            baseOptionCards.forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            
            const baseId = this.getAttribute('data-base-id');
            mealChoices.base = baseId;
            
            updateSelectedItemsList();
        });
    });
    
    document.getElementById('next-from-base').addEventListener('click', function() {
        if (!mealChoices.base) {
            alert('Please select a base for your meal');
            return;
        }
        
        loadProteinOptions();
        updateSelectedItemsListForProtein();
        showScreen('protein-screen');
    });
    
    document.getElementById('back-from-base').addEventListener('click', function() {
        showScreen('template-screen');
    });
}

function loadProteinOptions() {
    const proteinOptionsContainer = document.getElementById('protein-options-container');
    proteinOptionsContainer.innerHTML = '';
    
    const proteinOptions = getProteinOptions();
    
    proteinOptions.forEach(option => {
        const optionCard = document.createElement('div');
        optionCard.className = 'col-6 col-md-4 col-lg-3';
        optionCard.innerHTML = `
            <div class="custom-option-card" data-protein-id="${option.id}">
                <div class="custom-option-icon">${option.icon}</div>
                <h5>${option.name}</h5>
            </div>
        `;
        
        proteinOptionsContainer.appendChild(optionCard);
    });
    
    addProteinOptionEventListeners();
}

function addProteinOptionEventListeners() {
    const proteinOptionCards = document.querySelectorAll('#protein-options-container .custom-option-card');
    
    proteinOptionCards.forEach(card => {
        card.addEventListener('click', function() {
            proteinOptionCards.forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            
            const proteinId = this.getAttribute('data-protein-id');
            mealChoices.protein = proteinId;
            
            updateProteinSelectedItemsList();
        });
    });
    
    document.getElementById('next-from-protein').addEventListener('click', function() {
        if (!mealChoices.protein) {
            alert('Please select a protein for your meal');
            return;
        }
        
        generateRecipeFromCustomSelections();
    });
    
    document.getElementById('back-from-protein').addEventListener('click', function() {
        showScreen('base-screen');
    });
}

function updateSelectedItemsList() {
    const selectedItemsList = document.getElementById('selected-items-list');
    const mealTypeItem = document.getElementById('selected-meal-type');
    selectedItemsList.innerHTML = '';
    selectedItemsList.appendChild(mealTypeItem);
    
    if (mealChoices.base) {
        const baseOption = getBaseOptionById(mealChoices.base);
        const baseItem = document.createElement('li');
        baseItem.textContent = `Base: ${baseOption.name}`;
        selectedItemsList.appendChild(baseItem);
    }
}

function updateSelectedItemsListForProtein() {
    const selectedItemsList = document.getElementById('selected-items-list-protein');
    selectedItemsList.innerHTML = '';
    
    const mealTypeItem = document.createElement('li');
    mealTypeItem.textContent = `Meal type: ${capitalizeFirstLetter(mealChoices.mealType)}`;
    selectedItemsList.appendChild(mealTypeItem);
    
    if (mealChoices.base) {
        const baseOption = getBaseOptionById(mealChoices.base);
        const baseItem = document.createElement('li');
        baseItem.textContent = `Base: ${baseOption.name}`;
        selectedItemsList.appendChild(baseItem);
    }
}

function updateProteinSelectedItemsList() {
    const selectedItemsList = document.getElementById('selected-items-list-protein');
    
    const existingProteinItem = Array.from(selectedItemsList.children).find(item => item.textContent.startsWith('Protein:'));
    if (existingProteinItem) {
        selectedItemsList.removeChild(existingProteinItem);
    }
    
    if (mealChoices.protein) {
        const proteinOption = getProteinOptionById(mealChoices.protein);
        const proteinItem = document.createElement('li');
        proteinItem.textContent = `Protein: ${proteinOption.name}`;
        selectedItemsList.appendChild(proteinItem);
    }
}