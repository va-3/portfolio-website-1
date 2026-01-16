// ===================================
// Chatbot JavaScript - AI Integration
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    const aiChatCard = document.getElementById('ai-chat-card');
    const chatbotForm = document.getElementById('chatbot-form');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const typingIndicator = document.getElementById('typing-indicator');

    let isExpanded = false;

    // Initialize Dobby logos
    if (document.getElementById('header-dobby-logo')) {
        new DobbyLogo('header-dobby-logo', 50);
    }
    if (document.getElementById('preview-dobby-avatar')) {
        new DobbyLogo('preview-dobby-avatar', 28);
    }

    // Expand chat on input focus
    chatbotInput.addEventListener('focus', function() {
        if (!isExpanded) {
            aiChatCard.classList.add('expanded');
            isExpanded = true;
        }
    });

    // Handle form submission
    chatbotForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const message = chatbotInput.value.trim();
        if (!message) return;

        // Add user message to chat
        addMessage(message, 'user');

        // Clear input
        chatbotInput.value = '';

        // Show typing indicator
        showTypingIndicator();

        // Send message to backend
        try {
            const response = await sendMessageToBot(message);
            hideTypingIndicator();
            addMessage(response, 'bot');
        } catch (error) {
            hideTypingIndicator();
            addMessage('Sorry, I encountered an error. Please try again.', 'bot');
            console.error('Chatbot error:', error);
        }
    });

    // Add message to chat
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot-message ${sender}`;
        messageDiv.textContent = text;
        chatbotMessages.appendChild(messageDiv);

        // Scroll to bottom
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    // Show typing indicator
    function showTypingIndicator() {
        typingIndicator.classList.add('active');
        // Scroll to show typing indicator
        typingIndicator.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }

    // Hide typing indicator
    function hideTypingIndicator() {
        typingIndicator.classList.remove('active');
    }

    // Session ID for conversation continuity
    let sessionId = null;

    // Send message to Netlify function
    async function sendMessageToBot(message) {
        try {
            const response = await fetch('/.netlify/functions/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message,
                    sessionId
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('Chatbot API error:', errorData);
                throw new Error(errorData.error || 'Failed to get response from chatbot');
            }

            const data = await response.json();

            // Store session ID for conversation continuity
            if (data.sessionId) {
                sessionId = data.sessionId;
            }

            // Return the assistant's response
            if (data.response && typeof data.response === 'string') {
                return data.response;
            } else {
                console.error('Invalid response format:', data);
                throw new Error('Invalid response format from server');
            }
        } catch (error) {
            console.error('Chatbot error details:', error);
            throw error;
        }
    }

    console.log('Chatbot initialized successfully!');
});
