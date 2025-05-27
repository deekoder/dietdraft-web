// data.js - All the mock data
export function getMealData() {
    return {
        templates: {
            breakfast: [
                { 
                    id: 'b1', 
                    name: 'Avocado Toast', 
                    image: 'https://dummyimage.com/300x200/4CAF50/ffffff&text=Avocado+Toast',
                    tags: ['Quick', 'High-Protein']
                },
                { 
                    id: 'b2', 
                    name: 'Overnight Oats', 
                    image: 'https://dummyimage.com/300x200/FF9800/ffffff&text=Overnight+Oats',
                    tags: ['Meal-Prep', 'Fiber-Rich']
                }
            ],
            lunch: [
                { 
                    id: 'l1', 
                    name: 'Quinoa Bowl', 
                    image: 'https://dummyimage.com/300x200/8BC34A/ffffff&text=Quinoa+Bowl',
                    tags: ['Vegetarian', 'High-Protein']
                },
                { 
                    id: 'l2', 
                    name: 'Chicken Wrap', 
                    image: 'https://dummyimage.com/300x200/2196F3/ffffff&text=Chicken+Wrap',
                    tags: ['Quick', 'Portable']
                }
            ],
            dinner: [
                { 
                    id: 'd1', 
                    name: 'Salmon with Vegetables', 
                    image: 'https://dummyimage.com/300x200/E91E63/ffffff&text=Salmon+Vegetables',
                    tags: ['High-Protein', 'Omega-3']
                },
                { 
                    id: 'd2', 
                    name: 'Vegetarian Stir-Fry', 
                    image: 'https://dummyimage.com/300x200/4CAF50/ffffff&text=Vegetarian+Stir-Fry',
                    tags: ['Quick', 'Vegetarian']
                }
            ],
            snack: [
                { 
                    id: 's1', 
                    name: 'Greek Yogurt Parfait', 
                    image: 'https://dummyimage.com/300x200/9C27B0/ffffff&text=Greek+Yogurt+Parfait',
                    tags: ['High-Protein', 'Low-Sugar']
                }
            ]
        },
        
        bases: {
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
        },
        
        proteins: [
            { id: 'p1', name: 'Chicken', icon: '🍗' },
            { id: 'p2', name: 'Beef', icon: '🥩' },
            { id: 'p3', name: 'Fish', icon: '🐟' },
            { id: 'p4', name: 'Tofu', icon: '🧊' },
            { id: 'p5', name: 'Beans', icon: '🫘' },
            { id: 'p6', name: 'Eggs', icon: '🥚' },
            { id: 'p7', name: 'Lentils', icon: '🫛' },
            { id: 'p8', name: 'Greek Yogurt', icon: '🥛' }
        ],
        
        allBases: [
            { id: 'bb1', name: 'Oatmeal', icon: '🥣' },
            { id: 'bb2', name: 'Toast', icon: '🍞' },
            { id: 'bb3', name: 'Yogurt', icon: '🥛' },
            { id: 'bb4', name: 'Eggs', icon: '🥚' },
            { id: 'lb1', name: 'Rice', icon: '🍚' },
            { id: 'lb2', name: 'Quinoa', icon: '🌾' },
            { id: 'lb3', name: 'Salad', icon: '🥗' },
            { id: 'lb4', name: 'Wrap', icon: '🌯' },
            { id: 'db1', name: 'Rice', icon: '🍚' },
            { id: 'db2', name: 'Pasta', icon: '🍝' },
            { id: 'db3', name: 'Potatoes', icon: '🥔' },
            { id: 'db4', name: 'Quinoa', icon: '🌾' },
            { id: 'sb1', name: 'Yogurt', icon: '🥛' },
            { id: 'sb2', name: 'Nuts', icon: '🥜' },
            { id: 'sb3', name: 'Fruit', icon: '🍎' },
            { id: 'sb4', name: 'Crackers', icon: '🍪' }
        ]
    };
}