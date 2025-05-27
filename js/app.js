document.addEventListener('DOMContentLoaded', function() {
    // Variables to store selections
    const mealChoices = {
        mealType: null,
        base: null,
        protein: null,
        vegetables: [],
        dietaryPreferences: [],
        cuisineType: null,
        maxCalories: null
    };
    
    // API endpoint (change to your actual API URL)
    const API_URL = 'https://dietdraft.onrender.com';
    
    // Initialize screens
    initMealTypeScreen();
    initVoiceButton();
    initBackButtons();
    
    // Voice Button
    function initVoiceButton() {
        const voiceButton = document.getElementById('voice-button');
        
        if (voiceButton) {
            voiceButton.addEventListener('click', function() {
                // Check if browser supports speech recognition
                if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
                    alert('Your browser does not support speech recognition. Please try Chrome, Edge, or Safari.');
                    return;
                }
                
                startVoiceRecognition();
            });
        }
    }
    
    // Start voice recognition
    function startVoiceRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            
            // Process the voice input
            processVoiceInput(transcript);
        };
        
        recognition.onerror = function(event) {
            console.error('Speech recognition error:', event.error);
            alert('Error recognizing speech. Please try again.');
        };
        
        recognition.start();
        alert('Listening... Say your meal request.');
    }
    
    // Process voice input
    async function processVoiceInput(voiceText) {
        try {
            // Call your API to parse the voice input
            const response = await fetch(`${API_URL}/parse-voice`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    voice_text: voiceText
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to parse voice input');
            }
            
            const parsedData = await response.json();
            
            // Use the parsed data to generate a recipe
            if (confirm(`I understood: ${parsedData.parsed_text}\n\nGenerate recipe?`)) {
                generateRecipeFromVoice(parsedData);
            }
            
        } catch (error) {
            console.error('Error processing voice input:', error);
            alert('Error processing your request. Please try again.');
        }
    }
    
    // Generate recipe from voice input
    async function generateRecipeFromVoice(parsedData) {
        try {
            // Remove parsed_text as it's not needed for recipe generation
            delete parsedData.parsed_text;
            
            // Call your generate-meal API
            const response = await fetch(`${API_URL}/generate-meal`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(parsedData)
            });
            
            if (!response.ok) {
                throw new Error('Failed to generate recipe');
            }
            
            const recipe = await response.json();
            
            // Display the recipe
            displayFinalRecipe(recipe);
            
        } catch (error) {
            console.error('Error generating recipe:', error);
            alert('Error generating recipe. Please try again.');
        }
    }
    
    // Initialize meal type screen
    function initMealTypeScreen() {
        const mealTypeCards = document.querySelectorAll('.meal-type-card');
        
        mealTypeCards.forEach(card => {
            card.addEventListener('click', function() {
                const mealType = this.getAttribute('data-meal-type');
                mealChoices.mealType = mealType;
                
                // Update breadcrumb
                document.getElementById('meal-type-breadcrumb').textContent = capitalizeFirstLetter(mealType);
                
                // Update template header
                document.getElementById('template-header').textContent = `Popular ${capitalizeFirstLetter(mealType)} Templates`;
                
                // Generate and load templates
                loadTemplates(mealType);
                
                // Show template screen
                showScreen('template-screen');
            });
        });
    }
    
    // Load templates based on meal type
    function loadTemplates(mealType) {
        const templatesContainer = document.getElementById('templates-container');
        templatesContainer.innerHTML = ''; // Clear existing templates
        
        // In a real app, you would fetch these from your API
        const templates = getTemplatesForMealType(mealType);
        
        // Add templates to the container
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
        
        // Add event listeners
        addTemplateEventListeners();
    }
    
    // Add event listeners to template cards
    function addTemplateEventListeners() {
        // Template selection
        const templateCards = document.querySelectorAll('.meal-template-card');
        
        templateCards.forEach(card => {
            card.addEventListener('click', function() {
                if (this.id === 'custom-meal-option') {
                    // For custom option, go to base selection
                    document.getElementById('selected-meal-type').textContent = `Meal type: ${capitalizeFirstLetter(mealChoices.mealType)}`;
                    loadBaseOptions(mealChoices.mealType);
                    showScreen('base-screen');
                } else {
                    // For template selection, load the template
                    const templateId = this.getAttribute('data-template-id');
                    // In a real app, you would fetch the template details from your API
                    // For now, we'll just simulate going to the final recipe
                    simulateTemplateSelection(templateId);
                }
            });
        });
    }
    
    // Simulate template selection (in real app, would fetch from API)
    function simulateTemplateSelection(templateId) {
        // In a real app, you would fetch the template details and then generate the recipe
        // For now, we'll just simulate a recipe
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
    
    // Load base options based on meal type
    function loadBaseOptions(mealType) {
        const baseOptionsContainer = document.getElementById('base-options-container');
        baseOptionsContainer.innerHTML = ''; // Clear existing options
        
        // In a real app, you would fetch these from your API
        const baseOptions = getBaseOptionsForMealType(mealType);
        
        // Add base options to the container
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
        
        // Add event listeners
        addBaseOptionEventListeners();
    }
    
    // Add event listeners to base option cards
    function addBaseOptionEventListeners() {
        const baseOptionCards = document.querySelectorAll('#base-options-container .custom-option-card');
        
        baseOptionCards.forEach(card => {
            card.addEventListener('click', function() {
                // Remove selected class from all cards
                baseOptionCards.forEach(c => c.classList.remove('selected'));
                
                // Add selected class to clicked card
                this.classList.add('selected');
                
                // Store the selection
                const baseId = this.getAttribute('data-base-id');
                mealChoices.base = baseId;
                
                // Update the selected items list
                updateSelectedItemsList();
            });
        });
        
        // Next button
        document.getElementById('next-from-base').addEventListener('click', function() {
            if (!mealChoices.base) {
                alert('Please select a base for your meal');
                return;
            }
            
            // Load protein options
            loadProteinOptions();
            
            // Update the selected items list for protein screen
            updateSelectedItemsListForProtein();
            
            // Show protein screen
            showScreen('protein-screen');
        });
        
        // Back button
        document.getElementById('back-from-base').addEventListener('click', function() {
            showScreen('template-screen');
        });
    }
    
    // Update selected items list
    function updateSelectedItemsList() {
        const selectedItemsList = document.getElementById('selected-items-list');
        
        // Clear existing items except for meal type
        const mealTypeItem = document.getElementById('selected-meal-type');
        selectedItemsList.innerHTML = '';
        selectedItemsList.appendChild(mealTypeItem);
        
        // Add base if selected
        if (mealChoices.base) {
            const baseOption = getBaseOptionById(mealChoices.base);
            const baseItem = document.createElement('li');
            baseItem.textContent = `Base: ${baseOption.name}`;
            selectedItemsList.appendChild(baseItem);
        }
    }
    
    // Update selected items list for protein screen
    function updateSelectedItemsListForProtein() {
        const selectedItemsList = document.getElementById('selected-items-list-protein');
        selectedItemsList.innerHTML = '';
        
        // Add meal type
        const mealTypeItem = document.createElement('li');
        mealTypeItem.textContent = `Meal type: ${capitalizeFirstLetter(mealChoices.mealType)}`;
        selectedItemsList.appendChild(mealTypeItem);
        
        // Add base
        if (mealChoices.base) {
            const baseOption = getBaseOptionById(mealChoices.base);
            const baseItem = document.createElement('li');
            baseItem.textContent = `Base: ${baseOption.name}`;
            selectedItemsList.appendChild(baseItem);
        }
    }
    
    // Load protein options
    function loadProteinOptions() {
        const proteinOptionsContainer = document.getElementById('protein-options-container');
        proteinOptionsContainer.innerHTML = ''; // Clear existing options
        
        // In a real app, you would fetch these from your API
        const proteinOptions = getProteinOptions();
        
        // Add protein options to the container
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
        
        // Add event listeners
        addProteinOptionEventListeners();
    }
    
    // Add event listeners to protein option cards
    function addProteinOptionEventListeners() {
        const proteinOptionCards = document.querySelectorAll('#protein-options-container .custom-option-card');
        
        proteinOptionCards.forEach(card => {
            card.addEventListener('click', function() {
                // Remove selected class from all cards
                proteinOptionCards.forEach(c => c.classList.remove('selected'));
                
                // Add selected class to clicked card
                this.classList.add('selected');
                
                // Store the selection
                const proteinId = this.getAttribute('data-protein-id');
                mealChoices.protein = proteinId;
                
                // Update the selected items list
                updateProteinSelectedItemsList();
            });
        });
        
        // Next button
        document.getElementById('next-from-protein').addEventListener('click', function() {
            if (!mealChoices.protein) {
                alert('Please select a protein for your meal');
                return;
            }
            
            // In a real app, you would continue to the next step (vegetables, etc.)
            // For now, we'll just generate a recipe based on the selections so far
            generateRecipeFromCustomSelections();
        });
        
        // Back button
        document.getElementById('back-from-protein').addEventListener('click', function() {
            showScreen('base-screen');
        });
    }
    
    // Update protein selected items list
    function updateProteinSelectedItemsList() {
        const selectedItemsList = document.getElementById('selected-items-list-protein');
        
        // Remove protein item if it exists
        const existingProteinItem = Array.from(selectedItemsList.children).find(item => item.textContent.startsWith('Protein:'));
        if (existingProteinItem) {
            selectedItemsList.removeChild(existingProteinItem);
        }
        
        // Add protein if selected
        if (mealChoices.protein) {
            const proteinOption = getProteinOptionById(mealChoices.protein);
            const proteinItem = document.createElement('li');
            proteinItem.textContent = `Protein: ${proteinOption.name}`;
            selectedItemsList.appendChild(proteinItem);
        }
    }
    
    // Generate recipe from custom selections
    function generateRecipeFromCustomSelections() {
        // In a real app, you would call your API with the selections
        // For now, we'll just simulate a generated recipe
        
        // Get the selected options
        const baseOption = getBaseOptionById(mealChoices.base);
        const proteinOption = getProteinOptionById(mealChoices.protein);
        
        // Create a recipe name based on selections
        const recipeName = `${proteinOption.name} ${mealChoices.mealType} with ${baseOption.name}`;
        
        // Simulate a generated recipe
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
    
    // Display final recipe
    function displayFinalRecipe(recipe) {
        // Set recipe title
        document.getElementById('final-recipe-title').textContent = recipe.meal_name;
        
        // Set recipe image (in a real app, you would have actual images)
        // For now, we'll use a placeholder image
        //document.getElementById('final-recipe-image').src = `https://via.placeholder.com/800x400?text=${encodeURIComponent(recipe.meal_name)}`;

        // Set recipe image with real food image if available
        getMealImage(recipe.meal_name).then(imageUrl => {
            document.getElementById('final-recipe-image').src = imageUrl;
        });
        
        // Set ingredients
        const ingredientsList = document.getElementById('final-ingredients-list');
        ingredientsList.innerHTML = '';
        recipe.ingredients.forEach(ingredient => {
            const li = document.createElement('li');
            li.textContent = ingredient;
            ingredientsList.appendChild(li);
        });
        
        // Set instructions
        document.getElementById('final-instructions').textContent = recipe.instructions;
        
        // Set nutritional information
        let nutritionText = '';
        if (recipe.estimated_calories) {
            nutritionText += `<strong>Calories:</strong> ${recipe.estimated_calories} per serving<br>`;
        }
        if (recipe.dietary_info) {
            nutritionText += `<strong>Dietary Information:</strong> ${recipe.dietary_info}`;
        }
        document.getElementById('final-nutrition').innerHTML = nutritionText;
        
        // Show the final recipe screen
        showScreen('final-recipe-screen');
    }
    
    // Initialize back buttons
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
            
            // Go back to the first screen
            showScreen('meal-type-screen');
        });
        
        // Share button (in a real app, you would implement sharing functionality)
        document.getElementById('share-btn').addEventListener('click', function() {
            alert('Sharing functionality would be implemented here');
        });
        
        // Save button (in a real app, you would implement saving functionality)
        document.getElementById('save-btn').addEventListener('click', function() {
            alert('Recipe saved successfully!');
        });
    }
    
    // Helper function to show a screen and hide others
    function showScreen(screenId) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Show the specified screen
        document.getElementById(screenId).classList.add('active');
        
        // Scroll to top
        window.scrollTo(0, 0);
    }
    
    // Helper function to capitalize first letter
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    // Mock data functions (in a real app, these would be API calls)
    
    // Get templates for meal type
    function getTemplatesForMealType(mealType) {
        // In a real app, this would be an API call
        const templates = {
            breakfast: [
                {
                    id: 'b1',
                    name: 'Avocado Toast',
                    image: 'https://via.placeholder.com/300x200?text=Avocado+Toast',
                    tags: ['Quick', 'High-Protein']
                },
                {
                    id: 'b2',
                    name: 'Overnight Oats',
                    image: 'https://via.placeholder.com/300x200?text=Overnight+Oats',
                    tags: ['Meal-Prep', 'Fiber-Rich']
                },
                {
                    id: 'b3',
                    name: 'Veggie Omelette',
                    image: 'https://via.placeholder.com/300x200?text=Veggie+Omelette',
                    tags: ['Low-Carb', 'High-Protein']
                }
            ],
            lunch: [
                {
                    id: 'l1',
                    name: 'Quinoa Bowl',
                    image: 'https://via.placeholder.com/300x200?text=Quinoa+Bowl',
                    tags: ['Vegetarian', 'High-Protein']
                },
                {
                    id: 'l2',
                    name: 'Chicken Wrap',
                    image: 'https://via.placeholder.com/300x200?text=Chicken+Wrap',
                    tags: ['Quick', 'Portable']
                },
                {
                    id: 'l3',
                    name: 'Mediterranean Salad',
                    image: 'https://via.placeholder.com/300x200?text=Mediterranean+Salad',
                    tags: ['Low-Carb', 'Vegetarian']
                }
            ],
            dinner: [
                {
                    id: 'd1',
                    name: 'Salmon with Vegetables',
                    image: 'https://via.placeholder.com/300x200?text=Salmon+with+Vegetables',
                    tags: ['High-Protein', 'Omega-3']
                },
                {
                    id: 'd2',
                    name: 'Vegetarian Stir-Fry',
                    image: 'https://via.placeholder.com/300x200?text=Vegetarian+Stir-Fry',
                    tags: ['Quick', 'Vegetarian']
                },
                {
                    id: 'd3',
                    name: 'Chicken and Rice Bowl',
                    image: 'https://via.placeholder.com/300x200?text=Chicken+and+Rice+Bowl',
                    tags: ['Meal-Prep', 'High-Protein']
                }
            ],
            snack: [
                {
                    id: 's1',
                    name: 'Greek Yogurt Parfait',
                    image: 'https://via.placeholder.com/300x200?text=Greek+Yogurt+Parfait',
                    tags: ['High-Protein', 'Low-Sugar']
                },
                {
                    id: 's2',
                    name: 'Fruit and Nut Mix',
                    image: 'https://via.placeholder.com/300x200?text=Fruit+and+Nut+Mix',
                    tags: ['Energy-Boosting', 'No-Cook']
                },
                {
                    id: 's3',
                    name: 'Hummus and Veggies',
                    image: 'https://via.placeholder.com/300x200?text=Hummus+and+Veggies',
                    tags: ['Fiber-Rich', 'Plant-Based']
                }
            ]
        };
        
        return templates[mealType] || [];
    }
    

    // Helper function to get meal image with fallback
    async function getMealImage(mealName, mealType = null) {
        // Try to get a real food image first
        try {
            const searchTerm = mealName.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ',');
            const unsplashUrl = `https://source.unsplash.com/400x300/?${searchTerm},food`;
            
            // Test if the image loads successfully
            const imageExists = await testImageUrl(unsplashUrl);
            if (imageExists) {
                return unsplashUrl;
            }
        } catch (error) {
            console.log('Failed to fetch real image, using placeholder');
        }
        
        // Fallback to placeholder
        return `https://via.placeholder.com/400x300/4a90e2/ffffff?text=${encodeURIComponent(mealName)}`;
    }

    // Helper function to test if an image URL is valid
    function testImageUrl(url) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
            
            // Timeout after 3 seconds
            setTimeout(() => resolve(false), 3000);
        });
    }

    // Get base options for meal type
    function getBaseOptionsForMealType(mealType) {
        // In a real app, this would be an API call
        const baseOptions = {
            breakfast: [
                { id: 'bb1', name: 'Oatmeal', icon: '🥣' },
                { id: 'bb2', name: 'Toast', icon: '🍞' },
                { id: 'bb3', name: 'Yogurt', icon: '🥛' },
                { id: 'bb4', name: 'Eggs', icon: '🥚' }
            ],
            lunch: [
                { id: 'lb1', name: 'Rice', icon: '🍚' },
                { id: 'lb2', name: 'Quinoa', icon: '🌾' },
                { id: 'lb3', name: 'Salad', icon: '🥗' },
                { id: 'lb4', name: 'Wrap', icon: '🌯' }
            ],
            dinner: [
                { id: 'db1', name: 'Rice', icon: '🍚' },
                { id: 'db2', name: 'Pasta', icon: '🍝' },
                { id: 'db3', name: 'Potatoes', icon: '🥔' },
                { id: 'db4', name: 'Quinoa', icon: '🌾' }
            ],
            snack: [
                { id: 'sb1', name: 'Yogurt', icon: '🥛' },
                { id: 'sb2', name: 'Nuts', icon: '🥜' },
                { id: 'sb3', name: 'Fruit', icon: '🍎' },
                { id: 'sb4', name: 'Crackers', icon: '🍪' }
            ]
        };
        
        return baseOptions[mealType] || [];
    }
    
    // Get base option by ID
    function getBaseOptionById(baseId) {
        // In a real app, this would be a lookup in data from an API
        // For now, we'll just compile all the options and search
        const allOptions = [
            ...getBaseOptionsForMealType('breakfast'),
            ...getBaseOptionsForMealType('lunch'),
            ...getBaseOptionsForMealType('dinner'),
            ...getBaseOptionsForMealType('snack')
        ];
        
        return allOptions.find(option => option.id === baseId) || { name: 'Unknown Base', icon: '❓' };
    }
    
    // Get protein options
    function getProteinOptions() {
        // In a real app, this would be an API call that might be filtered by meal type or dietary preferences
        return [
            { id: 'p1', name: 'Chicken', icon: '🍗' },
            { id: 'p2', name: 'Beef', icon: '🥩' },
            { id: 'p3', name: 'Fish', icon: '🐟' },
            { id: 'p4', name: 'Tofu', icon: '🧊' },
            { id: 'p5', name: 'Beans', icon: '🫘' },
            { id: 'p6', name: 'Eggs', icon: '🥚' },
            { id: 'p7', name: 'Lentils', icon: '🫛' },
            { id: 'p8', name: 'Greek Yogurt', icon: '🥛' }
        ];
    }
    
    // Get protein option by ID
    function getProteinOptionById(proteinId) {
        // In a real app, this would be a lookup in data from an API
        const allOptions = getProteinOptions();
        
        return allOptions.find(option => option.id === proteinId) || { name: 'Unknown Protein', icon: '❓' };
    }
});