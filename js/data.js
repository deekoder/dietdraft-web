// js/data.js

export function getTemplatesForMealType(mealType) {
    const templates = {
        breakfast: [
            {
                id: 'b1',
                name: 'Avocado Toast',
                image: 'https://dummyimage.com/300x200/4CAF50/ffffff&text=Avocado+Toast',
                tags: ['Quick', 'High-Protein']
            },
            // ... rest of your breakfast templates
        ],
        // ... rest of your meal types
    };
    
    return templates[mealType] || [];
}

export function getBaseOptionsForMealType(mealType) {
    const baseOptions = {
        breakfast: [
            { id: 'bb1', name: 'Oatmeal', icon: '🥣' },
            // ... rest
        ],
        // ... rest
    };
    
    return baseOptions[mealType] || [];
}

export function getProteinOptions() {
    return [
        { id: 'p1', name: 'Chicken', icon: '🍗' },
        // ... rest of your protein options
    ];
}

export function getBaseOptionById(baseId) {
    const allOptions = [
        ...getBaseOptionsForMealType('breakfast'),
        ...getBaseOptionsForMealType('lunch'),
        ...getBaseOptionsForMealType('dinner'),
        ...getBaseOptionsForMealType('snack')
    ];
    
    return allOptions.find(option => option.id === baseId) || { name: 'Unknown Base', icon: '❓' };
}

export function getProteinOptionById(proteinId) {
    const allOptions = getProteinOptions();
    return allOptions.find(option => option.id === proteinId) || { name: 'Unknown Protein', icon: '❓' };
}