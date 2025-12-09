document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. DOM ELEMENTS ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const chatContainer = document.getElementById('chat-container');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.querySelector('.send-btn');
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const thinkingIndicator = document.getElementById('thinking-indicator');

    // --- 2. DARK MODE TOGGLE ---
    // Check if user previously preferred dark mode
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
        updateThemeIcon(true);
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const isDark = body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateThemeIcon(isDark);
    });

    function updateThemeIcon(isDark) {
        if (isDark) {
            themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i> Light Mode';
        } else {
            themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i> Dark Mode';
        }
    }

    // --- 3. FILE UPLOAD LOGIC (Drag & Drop) ---
    // Trigger hidden file input when clicking the zone
    dropZone.addEventListener('click', () => fileInput.click());

    // Update visuals on file selection
    fileInput.addEventListener('change', (e) => handleFiles(e.target.files));

    // Drag effects
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            dropZone.classList.add('highlight');
            dropZone.style.borderColor = 'var(--accent-color)';
            dropZone.style.backgroundColor = 'rgba(16, 163, 127, 0.1)';
        });
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            dropZone.classList.remove('highlight');
            dropZone.style.borderColor = 'var(--border-color)';
            dropZone.style.backgroundColor = 'var(--bg-color)';
        });
    });

    // Handle Drop
    dropZone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    });

    function handleFiles(files) {
        const file = files[0];
        if (file && file.type === 'application/pdf') {
            // Update UI to show file selected
            const icon = dropZone.querySelector('i');
            const text = dropZone.querySelector('span');
            
            icon.className = 'fa-solid fa-file-check';
            icon.style.color = 'var(--accent-color)';
            text.textContent = `Selected: ${file.name}`;
            
            // TODO: Call your Backend API here -> uploadFile(file);
            console.log(`Ready to upload: ${file.name}`);
        } else {
            alert('Please upload a valid PDF file.');
        }
    }

    // --- 4. CHAT LOGIC ---
    function appendMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender === 'user' ? 'user-message' : 'ai-message');
        
        const avatarIcon = sender === 'user' ? 'fa-user' : 'fa-robot';
        
        messageDiv.innerHTML = `
            <div class="avatar"><i class="fa-solid ${avatarIcon}"></i></div>
            <div class="content">${text}</div>
        `;
        
        // Insert before the thinking indicator so "Thinking" stays at bottom
        chatContainer.insertBefore(messageDiv, thinkingIndicator);
        
        // Auto-scroll to bottom
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    async function handleChat() {
        const text = userInput.value.trim();
        if (!text) return;

        // 1. Show User Message
        appendMessage(text, 'user');
        userInput.value = '';

        // 2. Show Thinking Animation
        thinkingIndicator.style.display = 'flex';
        chatContainer.scrollTop = chatContainer.scrollHeight;

        // 3. Simulate Backend API Call (Replace with real Fetch later)
        try {
            // In Week 6, you will replace this setTimeout with:
            // const response = await fetch('http://localhost:8000/chat', ...);
            
            await new Promise(resolve => setTimeout(resolve, 2000)); // Fake 2s delay
            
            // 4. Hide Thinking & Show AI Response
            thinkingIndicator.style.display = 'none';
            const mockResponse = "I analyzed your PDF. This looks like a project roadmap. The Functional Requirements are listed in Section 2A.";
            appendMessage(mockResponse, 'ai');

        } catch (error) {
            thinkingIndicator.style.display = 'none';
            appendMessage("Error: Could not connect to DocuMind backend.", 'ai');
        }
    }

    // Event Listeners for Chat
    sendBtn.addEventListener('click', handleChat);
    
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleChat();
    });

});