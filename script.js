document.addEventListener('DOMContentLoaded', () => {
    const chatbotButton = document.getElementById('chatbot-button');
    const chatbox = document.getElementById('chatbox');
    const closeChatbox = document.getElementById('close-chatbox');
    const sendButton = document.getElementById('send-button');
    const userInput = document.getElementById('user-input');
    const messages = document.getElementById('messages');
    const questionOptions = document.getElementById('question-options');
    const questionButtons = document.querySelectorAll('.question-option');

    let responses = {};

    // Fetch responses from JSON file
    fetch('responses.json')
        .then(response => response.json())
        .then(data => {
            responses = data;
        })
        .catch(error => console.error('Error loading JSON:', error));

    chatbotButton.addEventListener('click', () => {
        chatbox.classList.toggle('hidden');
        if (!chatbox.classList.contains('hidden')) {
            questionOptions.classList.remove('hidden');
        }
    });

    closeChatbox.addEventListener('click', () => {
        chatbox.classList.add('hidden');
    });

    sendButton.addEventListener('click', () => {
        const messageText = userInput.value.trim();
        if (messageText) {
            addMessage('User', messageText, 'user-message');
            handleUserMessage(messageText);
            userInput.value = '';
        }
    });

    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendButton.click();
        }
    });

    questionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const question = button.textContent;
            addMessage('User', question, 'user-message');
            handleUserMessage(question);
        });
    });

    function addMessage(sender, text, className) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${className}`;
        messages.appendChild(messageElement);
        messages.scrollTop = messages.scrollHeight; // Scroll to the bottom

        if (sender === 'Chatbot') {
            typeMessage(messageElement, text);
        } else {
            messageElement.textContent = `${sender}: ${text}`;
        }
    }

    function typeMessage(element, text) {
        element.textContent = '';
        let index = 0;
        const typingSpeed = 50; // Adjust typing speed here

        function typeWriter() {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                setTimeout(typeWriter, typingSpeed);
            }
        }

        typeWriter();
    }

    function findResponse(message) {
        // Convert the user message to lowercase for case-insensitive comparison
        const lowerCaseMessage = message.toLowerCase();

        // Loop through responses and find a match based on keywords
        for (let key in responses) {
            if (lowerCaseMessage.includes(key.toLowerCase())) {
                return responses[key];
            }
        }
        return null;
    }

    function handleUserMessage(message) {
        // Find a specific response or default to a fallback message
        const response = findResponse(message) || getRandomFallbackResponse();
        setTimeout(() => {
            addMessage('Chatbot', response, 'bot-message');
        }, 500); // Delay for typing effect
    }

    function getRandomFallbackResponse() {
        const fallbackResponses = [
            'I am not sure how to respond to that.',
            'Can you please ask something else?',
            'Let me check on that for you.',
            'I’m here to help with specific questions. Try one of the options above.'
        ];
        return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    }
});
