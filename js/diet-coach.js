// js/diet-coach.js - Fixed conversation memory
import { showMessage, API_URL } from './utils.js';

// Diet coach state with persistent user management
let currentConversationId = null;
let currentUserId = null;
let conversationHistory = [];
let isListening = false;

// Initialize persistent user ID
function initializeUser() {
    // Get or create persistent user ID
    currentUserId = localStorage.getItem('dietdraft_user_id');
    if (!currentUserId) {
        currentUserId = generateUUID();
        localStorage.setItem('dietdraft_user_id', currentUserId);
        console.log('🆔 Created new user ID:', currentUserId);
    } else {
        console.log('🆔 Loaded existing user ID:', currentUserId);
    }
}

function generateUUID() {
    return 'user-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

export function initDietCoach() {
    // Initialize user first
    initializeUser();
    
    const startCoachButton = document.getElementById('start-diet-coach');
    const voiceCoachButton = document.getElementById('voice-coach-button');
    const textCoachButton = document.getElementById('text-coach-button');
    const coachTextInput = document.getElementById('coach-text-input');
    const endCoachButton = document.getElementById('end-coach-session');
    const newConversationButton = document.getElementById('new-conversation-button');
    
    if (startCoachButton) {
        startCoachButton.addEventListener('click', startDietCoachSession);
    }
    
    if (voiceCoachButton) {
        voiceCoachButton.addEventListener('click', handleVoiceCoachClick);
    }
    
    if (textCoachButton) {
        textCoachButton.addEventListener('click', handleTextCoachClick);
    }
    
    if (coachTextInput) {
        coachTextInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleTextCoachClick();
            }
        });
    }
    
    if (endCoachButton) {
        endCoachButton.addEventListener('click', endDietCoachSession);
    }
    
    if (newConversationButton) {
        newConversationButton.addEventListener('click', startNewConversation);
    }
}

function startDietCoachSession() {
    // Show the diet coach interface
    document.getElementById('diet-coach-screen').classList.add('active');
    document.getElementById('meal-type-screen').classList.remove('active');
    
    // Check if we're continuing an existing conversation
    const isExistingConversation = currentConversationId !== null;
    
    console.log('🚀 Starting diet coach session');
    console.log('👤 User ID:', currentUserId);
    console.log('💬 Existing conversation:', isExistingConversation ? currentConversationId : 'None');
    
    // Clear chat history display (but maintain conversation state)
    const chatHistory = document.getElementById('coach-chat-history');
    if (chatHistory) {
        chatHistory.innerHTML = '';
    }
    
    // Add appropriate welcome message
    if (isExistingConversation) {
        addCoachMessage("Welcome back! I remember our conversation. What would you like to work on next?");
        // Show conversation context indicator
        showMessage('Continuing previous conversation', 'info');
    } else {
        addCoachMessage("Hello! I'm your personal diet coach. I can help you create meals, find ingredient substitutions, and provide nutritional guidance. What would you like to work on today?");
    }
    
    // Focus on text input
    const textInput = document.getElementById('coach-text-input');
    if (textInput) {
        textInput.focus();
    }
    
    // Show session info in UI
    updateSessionInfo();
}

function updateSessionInfo() {
    // Add session info to the UI for debugging
    const sessionInfo = document.createElement('div');
    sessionInfo.id = 'session-info';
    sessionInfo.style.cssText = `
        position: fixed; bottom: 10px; left: 10px; 
        background: rgba(0,0,0,0.7); color: white; 
        padding: 5px 10px; border-radius: 5px; 
        font-size: 11px; z-index: 1000;
    `;
    sessionInfo.innerHTML = `
        User: ${currentUserId ? currentUserId.substr(0, 12) + '...' : 'None'}<br>
        Conversation: ${currentConversationId ? currentConversationId.substr(0, 8) + '...' : 'New'}
    `;
    
    // Remove existing session info
    const existing = document.getElementById('session-info');
    if (existing) existing.remove();
    
    document.body.appendChild(sessionInfo);
    
    // Remove after 5 seconds
    setTimeout(() => {
        if (sessionInfo.parentNode) {
            sessionInfo.remove();
        }
    }, 5000);
}

function handleVoiceCoachClick() {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
        showMessage('Speech not supported. Use Chrome/Safari.', 'error');
        return;
    }
    
    if (isListening) {
        showMessage('Already listening...', 'info');
        return;
    }
    
    startListening();
}

function startListening() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    const button = document.getElementById('voice-coach-button');
    
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
    
    const originalText = button.innerHTML;
    button.innerHTML = '🎙️ Listening...';
    button.disabled = true;
    isListening = true;
    
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        resetVoiceButton(button, originalText);
        
        // Add user message to chat
        addUserMessage(transcript);
        
        // Process with diet coach
        processDietCoachMessage(transcript);
    };
    
    recognition.onerror = (event) => {
        console.error('Speech error:', event.error);
        resetVoiceButton(button, originalText);
        showMessage('Voice error. Try again.', 'error');
    };
    
    recognition.onend = () => {
        resetVoiceButton(button, originalText);
    };
    
    try {
        recognition.start();
        showMessage('Listening... Tell me what you need!', 'info');
    } catch (error) {
        resetVoiceButton(button, originalText);
        showMessage('Failed to start listening.', 'error');
    }
}

function handleTextCoachClick() {
    const textInput = document.getElementById('coach-text-input');
    const message = textInput.value.trim();
    
    if (!message) {
        showMessage('Please enter a message', 'error');
        return;
    }
    
    // Add user message to chat
    addUserMessage(message);
    
    // Clear input
    textInput.value = '';
    
    // Process with diet coach
    processDietCoachMessage(message);
}

async function processDietCoachMessage(message) {
    // Show typing indicator
    showTypingIndicator();
    
    try {
        const request = {
            message: message,
            user_id: currentUserId // Always include user ID
        };
        
        // CRITICAL: Include conversation_id if we have one for context
        if (currentConversationId) {
            request.conversation_id = currentConversationId;
            console.log('💬 Continuing conversation:', currentConversationId);
        } else {
            console.log('💬 Starting new conversation for user:', currentUserId);
        }
        
        console.log('📤 Sending request:', request);
        
        const response = await fetch(`${API_URL}/diet-coach`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request)
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API error ${response.status}: ${errorText}`);
        }
        
        const data = await response.json();
        console.log('📥 Received response:', data);
        
        // CRITICAL: Always update conversation and user IDs
        if (data.conversation_id) {
            const wasNewConversation = !currentConversationId;
            currentConversationId = data.conversation_id;
            
            if (wasNewConversation) {
                console.log('🆕 Started new conversation:', currentConversationId);
            } else {
                console.log('✅ Continued conversation:', currentConversationId);
            }
        }
        
        // Update user ID if provided (for anonymous user management)
        if (data.user_id && data.user_id !== currentUserId) {
            currentUserId = data.user_id;
            localStorage.setItem('dietdraft_user_id', currentUserId);
            console.log('🔄 Updated user ID:', currentUserId);
        }
        
        // Remove typing indicator
        removeTypingIndicator();
        
        // Add coach response to chat
        addCoachMessage(data.response);
        
        // Handle any structured data
        if (data.data && Object.keys(data.data).length > 0) {
            console.log('📊 Processing structured data:', Object.keys(data.data));
            handleStructuredData(data.data, data.tools_used || []);
        }
        
        // Show conversation status
        const toolsUsed = data.tools_used || [];
        if (toolsUsed.length > 0) {
            console.log('🔧 Tools used:', toolsUsed);
            showMessage(`Used tools: ${toolsUsed.join(', ')}`, 'info');
        }
        
    } catch (error) {
        removeTypingIndicator();
        console.error('❌ Diet coach error:', error);
        addCoachMessage("I'm having trouble right now. Could you try rephrasing your question?");
        showMessage('Connection error - check console for details', 'error');
    }
}

function addUserMessage(message) {
    const chatHistory = document.getElementById('coach-chat-history');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message user-message';
    messageDiv.innerHTML = `
        <div class="message-content">
            <strong>You:</strong> ${message}
        </div>
        <div class="message-time">${new Date().toLocaleTimeString()}</div>
    `;
    chatHistory.appendChild(messageDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

function addCoachMessage(message) {
    const chatHistory = document.getElementById('coach-chat-history');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message coach-message';
    messageDiv.innerHTML = `
        <div class="message-content">
            <strong>🍎 Diet Coach:</strong> ${message}
        </div>
        <div class="message-time">${new Date().toLocaleTimeString()}</div>
    `;
    chatHistory.appendChild(messageDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

function showTypingIndicator() {
    const chatHistory = document.getElementById('coach-chat-history');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message coach-message typing-indicator';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = `
        <div class="message-content">
            <strong>🍎 Diet Coach:</strong> <span class="typing-dots">Thinking<span>.</span><span>.</span><span>.</span></span>
        </div>
    `;
    chatHistory.appendChild(typingDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function handleStructuredData(data, toolsUsed) {
    // Handle meal generation
    if (data.meal) {
        displayGeneratedMeal(data.meal);
    }
    
    // Handle substitutions
    if (data.substitutions) {
        displaySubstitutions(data.substitutions);
    }
    
    // Handle reasoning
    if (data.reasoning) {
        displayReasoning(data.reasoning);
    }
    
    // Log tools used
    if (toolsUsed && toolsUsed.length > 0) {
        console.log('Tools used:', toolsUsed);
    }
}

function displayGeneratedMeal(meal) {
    const chatHistory = document.getElementById('coach-chat-history');
    const mealDiv = document.createElement('div');
    mealDiv.className = 'chat-message coach-data';
    
    let ingredientsHtml = '';
    if (meal.ingredients) {
        ingredientsHtml = meal.ingredients.map(ing => `<li>${ing}</li>`).join('');
    }
    
    mealDiv.innerHTML = `
        <div class="meal-card">
            <h4>🍽️ ${meal.meal_name || 'Generated Meal'}</h4>
            
            ${meal.ingredients ? `
                <div class="meal-section">
                    <h5>Ingredients:</h5>
                    <ul>${ingredientsHtml}</ul>
                </div>
            ` : ''}
            
            ${meal.instructions ? `
                <div class="meal-section">
                    <h5>Instructions:</h5>
                    <p>${meal.instructions}</p>
                </div>
            ` : ''}
            
            ${meal.estimated_calories ? `
                <div class="meal-section">
                    <h5>Nutrition:</h5>
                    <p><strong>Estimated Calories:</strong> ${meal.estimated_calories}</p>
                    ${meal.dietary_info ? `<p>${meal.dietary_info}</p>` : ''}
                </div>
            ` : ''}
            
            <button onclick="this.closest('.meal-card').classList.toggle('expanded')" class="expand-btn">
                Show/Hide Details
            </button>
        </div>
    `;
    
    chatHistory.appendChild(mealDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

function displaySubstitutions(substitutions) {
    const chatHistory = document.getElementById('coach-chat-history');
    const subDiv = document.createElement('div');
    subDiv.className = 'chat-message coach-data';
    
    let subsHtml = '';
    substitutions.forEach(sub => {
        subsHtml += `
            <div class="substitution-group">
                <h5>Replace: ${sub.original_ingredient}</h5>
                <p><em>Reason: ${sub.reason}</em></p>
                <ul>
        `;
        
        sub.substitutions.forEach(option => {
            subsHtml += `<li><strong>${option.ingredient}:</strong> ${option.notes}</li>`;
        });
        
        subsHtml += `</ul></div>`;
    });
    
    subDiv.innerHTML = `
        <div class="substitutions-card">
            <h4>🔄 Ingredient Substitutions</h4>
            ${subsHtml}
        </div>
    `;
    
    chatHistory.appendChild(subDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

function displayReasoning(reasoning) {
    if (!reasoning.reasoning) return;
    
    const chatHistory = document.getElementById('coach-chat-history');
    const reasoningDiv = document.createElement('div');
    reasoningDiv.className = 'chat-message coach-data';
    
    const r = reasoning.reasoning;
    reasoningDiv.innerHTML = `
        <div class="reasoning-card">
            <h4>🧠 Nutritional Insights</h4>
            
            ${r.key_ingredient_choices ? `
                <div class="reasoning-section">
                    <h5>🥘 Ingredient Choices:</h5>
                    <p>${r.key_ingredient_choices}</p>
                </div>
            ` : ''}
            
            ${r.nutritional_benefits ? `
                <div class="reasoning-section">
                    <h5>💪 Nutritional Benefits:</h5>
                    <p>${r.nutritional_benefits}</p>
                </div>
            ` : ''}
            
            ${r.dietary_alignment ? `
                <div class="reasoning-section">
                    <h5>🎯 Dietary Alignment:</h5>
                    <p>${r.dietary_alignment}</p>
                </div>
            ` : ''}
        </div>
    `;
    
    chatHistory.appendChild(reasoningDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

function resetVoiceButton(button, originalText) {
    button.innerHTML = originalText;
    button.disabled = false;
    isListening = false;
}

// Add a function to explicitly start a new conversation
function startNewConversation() {
    console.log('🔄 Starting fresh conversation');
    console.log('📜 Previous conversation ID:', currentConversationId);
    
    // Reset conversation state
    currentConversationId = null;
    conversationHistory = [];
    
    // Clear chat history
    const chatHistory = document.getElementById('coach-chat-history');
    if (chatHistory) {
        chatHistory.innerHTML = '';
    }
    
    console.log('✨ Started fresh conversation');
    addCoachMessage("Starting a fresh conversation! What would you like to work on?");
    showMessage('Started new conversation', 'info');
    
    // Update session info
    updateSessionInfo();
}

function endDietCoachSession() {
    // Hide diet coach screen
    document.getElementById('diet-coach-screen').classList.remove('active');
    document.getElementById('meal-type-screen').classList.add('active');
    
    console.log('🔚 Ending diet coach session');
    console.log('💾 Conversation will be preserved for next session');
    
    // DON'T reset conversation - preserve it for next session
    // Only reset when user explicitly starts new conversation
    
    // Remove session info
    const sessionInfo = document.getElementById('session-info');
    if (sessionInfo) sessionInfo.remove();
    
    showMessage('Diet coach session ended. Conversation saved for next time!', 'info');
}

// Export function to get current conversation state (for debugging)
export function getConversationState() {
    return {
        userId: currentUserId,
        conversationId: currentConversationId,
        historyLength: conversationHistory.length
    };
}