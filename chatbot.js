document.getElementById('send-btn').addEventListener('click', sendMessage);
document.getElementById('user-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

document.getElementById('voice-btn').addEventListener('click', startVoiceRecognition);

function sendMessage() {
    const userInput = document.getElementById('user-input');
    const message = userInput.value.trim();

    if (message !== "") {
        appendMessage(message, 'user-message');
        userInput.value = '';

        // Send message to backend
        fetch("http://127.0.0.1:5000/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: message })
        })
        .then(response => response.json())
        .then(data => appendMessage(data.response, 'bot-message'))
        .catch(error => console.error("Error:", error));
    }
}

function appendMessage(message, className) {
    const messageContainer = document.querySelector('.message-container');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', className);
    messageElement.innerHTML = `<p>${message}</p>`;
    messageContainer.appendChild(messageElement);

    // Automatically scroll to the bottom of the chat
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

function startVoiceRecognition() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        document.getElementById('user-input').value = transcript;
        sendMessage();
    };

    recognition.onerror = function(event) {
        console.error('Speech recognition error:', event.error);
    };
}
