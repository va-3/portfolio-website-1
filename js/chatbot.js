// ===================================
// Chatbot JavaScript - AI Integration
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    const aiChatCard = document.getElementById('ai-chat-card');
    const chatbotForm = document.getElementById('chatbot-form');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const typingIndicator = document.getElementById('typing-indicator');
    const typingDots = document.getElementById('typing-dots');
    const collapseBtn = document.getElementById('collapse-chat-btn');
    const dobbyBranding = document.querySelector('.dobby-branding');

    let isExpanded = false;
    const STORAGE_KEY = 'dobby-chat-history';

    // Initialize Dobby logo in header
    if (document.getElementById('header-dobby-logo')) {
        new DobbyLogo('header-dobby-logo', 50);
    }

    // Load chat history from sessionStorage
    function loadChatHistory() {
        try {
            const savedHistory = sessionStorage.getItem(STORAGE_KEY);
            if (savedHistory) {
                const messages = JSON.parse(savedHistory);
                messages.forEach(msg => {
                    addMessageWithoutSaving(msg.text, msg.sender);
                });
                return true; // History was loaded
            }
        } catch (error) {
            console.error('Error loading chat history:', error);
        }
        return false; // No history
    }

    // Save chat history to sessionStorage
    function saveChatHistory() {
        try {
            const messages = [];
            chatbotMessages.querySelectorAll('.chatbot-message').forEach(msg => {
                messages.push({
                    text: msg.textContent,
                    sender: msg.classList.contains('bot') ? 'bot' : 'user'
                });
            });
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
        } catch (error) {
            console.error('Error saving chat history:', error);
        }
    }

    // Attach expansion event listeners
    function attachExpansionListeners() {
        // Make input readonly on mobile to prevent zoom on initial tap
        if (window.innerWidth <= 768) {
            chatbotInput.setAttribute('readonly', 'readonly');
            chatbotInput.addEventListener('touchstart', expandChat, { passive: false });
        }
        chatbotInput.addEventListener('focus', expandChat);
        chatbotInput.addEventListener('click', expandChat);
    }

    // Expand chat on input focus or click
    function expandChat(e) {
        if (!isExpanded) {
            console.log('Expanding chat card...');

            // Prevent default to stop mobile zoom/scroll to input
            if (e && window.innerWidth <= 768) {
                e.preventDefault();
                e.stopPropagation();
                // Blur the input immediately to prevent keyboard
                if (chatbotInput === document.activeElement) {
                    chatbotInput.blur();
                }
            }

            // Save current scroll position
            const scrollY = window.scrollY;

            // Lock body scroll on mobile (prevents background scrolling)
            if (window.innerWidth <= 768) {
                document.body.style.position = 'fixed';
                document.body.style.top = `-${scrollY}px`;
                document.body.style.left = '0';
                document.body.style.right = '0';
                document.body.style.overflow = 'hidden';
                document.body.style.width = '100%';
                // Store scroll position for restoration
                aiChatCard.dataset.scrollY = scrollY;
            } else {
                // Desktop: just prevent scroll jump
                window.scrollTo(0, scrollY);
            }

            aiChatCard.classList.add('expanded');
            isExpanded = true;
            console.log('Chat card classes:', aiChatCard.className);

            // Load existing history from sessionStorage or show welcome message
            const hasHistory = loadChatHistory();
            if (!hasHistory) {
                addMessage("How can I assist you with questions about Vishnu's skills, experience, and projects?", 'bot');
            }

            // Reset scroll position to top when opening modal
            chatbotMessages.scrollTop = 0;

            // On mobile, enable input after expansion
            if (window.innerWidth <= 768) {
                setTimeout(() => {
                    // Remove readonly to enable typing
                    chatbotInput.removeAttribute('readonly');
                    console.log('Input enabled for typing');
                }, 300);
            }
        }
    }

    // Initialize expansion listeners on page load
    attachExpansionListeners();

    // Scroll to top when clicking Dobby branding/logo
    if (dobbyBranding && chatbotMessages) {
        // Add cursor pointer to show it's clickable
        dobbyBranding.style.cursor = 'pointer';

        dobbyBranding.addEventListener('click', function() {
            chatbotMessages.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Collapse chat function
    function collapseChat() {
        aiChatCard.classList.remove('expanded');
        isExpanded = false;

        // Restore body scroll on mobile
        if (window.innerWidth <= 768) {
            const scrollY = aiChatCard.dataset.scrollY || 0;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.left = '';
            document.body.style.right = '';
            document.body.style.overflow = '';
            document.body.style.width = '';
            window.scrollTo(0, parseInt(scrollY));

            // Reset readonly state for next open
            chatbotInput.setAttribute('readonly', 'readonly');
        }

        // Clear DOM but keep sessionStorage (will restore on expand)
        chatbotMessages.innerHTML = '';
        console.log('Chat collapsed, messages saved to storage');
    }

    // Add collapse button listener
    if (collapseBtn) {
        collapseBtn.addEventListener('click', collapseChat);
    }

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

    // Add message to chat WITHOUT saving (used when loading history)
    function addMessageWithoutSaving(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot-message ${sender}`;
        messageDiv.textContent = text;
        chatbotMessages.appendChild(messageDiv);

        // Smooth scroll to bottom to show new message
        chatbotMessages.scrollTo({
            top: chatbotMessages.scrollHeight,
            behavior: 'smooth'
        });
    }

    // Add message to chat AND save to sessionStorage
    function addMessage(text, sender) {
        addMessageWithoutSaving(text, sender);
        saveChatHistory();
    }

    // Show typing indicator with animated dots inside input field
    function showTypingIndicator() {
        const typingDots = document.getElementById('typing-dots');
        if (typingDots) {
            typingDots.style.display = 'flex'; // Show the dots
        }
        chatbotInput.value = ''; // Clear any text
        chatbotInput.placeholder = ''; // Hide placeholder text while AI is thinking
        chatbotInput.disabled = true; // Prevent typing while AI responds
    }

    // Hide typing indicator and restore input
    function hideTypingIndicator() {
        const typingDots = document.getElementById('typing-dots');
        if (typingDots) {
            typingDots.style.display = 'none'; // Hide the dots
        }
        chatbotInput.placeholder = 'How can I help you today?'; // Restore placeholder text
        chatbotInput.disabled = false; // Re-enable input
        chatbotInput.focus(); // Return focus to input
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
