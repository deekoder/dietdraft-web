// utils.js - Shared utilities
export const API_URL = 'https://dietdraft.onrender.com';

export function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
    }
    
    window.scrollTo(0, 0);
}

export function showMessage(text, type = 'info') {
    const div = document.createElement('div');
    div.style.cssText = `
        position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
        padding: 15px 25px; border-radius: 8px; z-index: 1000; color: white;
        font-weight: 500; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        background: ${type === 'error' ? '#f44336' : '#4CAF50'};
    `;
    div.textContent = text;
    document.body.appendChild(div);
    
    setTimeout(() => {
        if (div.parentNode) {
            div.parentNode.removeChild(div);
        }
    }, 3000);
}