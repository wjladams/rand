// Application state
let scenarios = [];
let currentScenario = null;

// DOM elements
const createForm = document.getElementById('createForm');
const editForm = document.getElementById('editForm');
const scenariosList = document.getElementById('scenariosList');
const createScenarioBtn = document.getElementById('createScenarioBtn');
const cancelCreateBtn = document.getElementById('cancelCreate');
const cancelEditBtn = document.getElementById('cancelEdit');
const selectionModal = document.getElementById('selectionModal');
const createModal = document.getElementById('createModal');
const editModal = document.getElementById('editModal');
const modalTitle = document.getElementById('modalTitle');
const selectionResult = document.getElementById('selectionResult');
const selectRandomBtn = document.getElementById('selectRandom');
const deleteScenarioBtn = document.getElementById('deleteScenario');
const closeBtns = document.querySelectorAll('.close');

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    loadScenarios();
    renderScenarios();
    setupEventListeners();
});

// Event listeners setup
function setupEventListeners() {
    createForm.addEventListener('submit', handleCreateScenario);
    editForm.addEventListener('submit', handleEditScenario);
    createScenarioBtn.addEventListener('click', openCreateModal);
    cancelCreateBtn.addEventListener('click', closeCreateModal);
    cancelEditBtn.addEventListener('click', closeEditModal);
    selectRandomBtn.addEventListener('click', makeRandomSelection);
    deleteScenarioBtn.addEventListener('click', deleteCurrentScenario);
    
    // Close modals when clicking close buttons
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (selectionModal.style.display === 'block') {
                closeSelectionModal();
            } else if (createModal.style.display === 'block') {
                closeCreateModal();
            } else if (editModal.style.display === 'block') {
                closeEditModal();
            }
        });
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === selectionModal) {
            closeSelectionModal();
        } else if (event.target === createModal) {
            closeCreateModal();
        } else if (event.target === editModal) {
            closeEditModal();
        }
    });
    
    // Close modals with Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            if (selectionModal.style.display === 'block') {
                closeSelectionModal();
            } else if (createModal.style.display === 'block') {
                closeCreateModal();
            } else if (editModal.style.display === 'block') {
                closeEditModal();
            }
        }
    });
}

// Local storage functions
function saveScenarios() {
    localStorage.setItem('chooseRandomScenarios', JSON.stringify(scenarios));
}

function loadScenarios() {
    const saved = localStorage.getItem('chooseRandomScenarios');
    scenarios = saved ? JSON.parse(saved) : [];
}

// Open create modal
function openCreateModal() {
    createModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    document.getElementById('scenarioTitle').focus();
}

// Close create modal
function closeCreateModal() {
    createModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    createForm.reset();
}

// Open edit modal
function openEditModal(scenarioId) {
    const scenario = scenarios.find(s => s.id === scenarioId);
    if (!scenario) return;
    
    // Set current scenario for editing
    currentScenario = scenario;
    
    // Pre-fill the form with current scenario data
    document.getElementById('editScenarioTitle').value = scenario.title;
    document.getElementById('editChoices').value = scenario.choices.join('\n');
    
    editModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    document.getElementById('editScenarioTitle').focus();
}

// Close edit modal
function closeEditModal() {
    editModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    editForm.reset();
}

// Create new scenario
function handleCreateScenario(event) {
    event.preventDefault();
    
    const title = document.getElementById('scenarioTitle').value.trim();
    const choicesText = document.getElementById('choices').value.trim();
    
    if (!title || !choicesText) {
        alert('Please fill in both title and choices.');
        return;
    }
    
    const choices = choicesText
        .split('\n')
        .map(choice => choice.trim())
        .filter(choice => choice.length > 0);
    
    if (choices.length < 2) {
        alert('Please provide at least 2 choices.');
        return;
    }
    
    const newScenario = {
        id: Date.now().toString(),
        title: title,
        choices: choices,
        createdAt: new Date().toISOString()
    };
    
    scenarios.push(newScenario);
    saveScenarios();
    renderScenarios();
    
    // Close modal and reset form
    closeCreateModal();
    
    // Show success message
    showNotification('Scenario created successfully!', 'success');
}

// Edit existing scenario
function handleEditScenario(event) {
    event.preventDefault();
    
    if (!currentScenario) return;
    
    const title = document.getElementById('editScenarioTitle').value.trim();
    const choicesText = document.getElementById('editChoices').value.trim();
    
    if (!title || !choicesText) {
        alert('Please fill in both title and choices.');
        return;
    }
    
    const choices = choicesText
        .split('\n')
        .map(choice => choice.trim())
        .filter(choice => choice.length > 0);
    
    if (choices.length < 2) {
        alert('Please provide at least 2 choices.');
        return;
    }
    
    // Update the current scenario
    currentScenario.title = title;
    currentScenario.choices = choices;
    
    saveScenarios();
    renderScenarios();
    
    // Close modal and reset form
    closeEditModal();
    
    // Update the selection modal title if it's open
    if (selectionModal.style.display === 'block') {
        modalTitle.textContent = currentScenario.title;
    }
    
    // Show success message
    showNotification('Scenario updated successfully!', 'success');
}

// Render scenarios list
function renderScenarios() {
    if (scenarios.length === 0) {
        scenariosList.innerHTML = `
            <div class="empty-state">
                <h3>No scenarios yet</h3>
                <p>Create your first random choice scenario to get started!</p>
            </div>
        `;
        return;
    }
    
    scenariosList.innerHTML = scenarios
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .map(scenario => `
            <div class="scenario-card" data-id="${scenario.id}">
                <h3>${escapeHtml(scenario.title)}</h3>
                <p>${scenario.choices.length} choices available</p>
                <div class="card-actions">
                    <button class="edit-btn" data-id="${scenario.id}" title="Edit scenario">✏️</button>
                    <span class="choice-count">${scenario.choices.length}</span>
                </div>
            </div>
        `)
        .join('');
    
    // Add click listeners to scenario cards
    document.querySelectorAll('.scenario-card').forEach(card => {
        card.addEventListener('click', (event) => {
            // Don't open scenario if clicking on edit button
            if (!event.target.classList.contains('edit-btn')) {
                openScenario(card.dataset.id);
            }
        });
    });
    
    // Add click listeners to edit buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent opening the scenario
            openEditModal(btn.dataset.id);
        });
    });
}

// Open scenario for random selection
function openScenario(scenarioId) {
    currentScenario = scenarios.find(s => s.id === scenarioId);
    if (!currentScenario) return;
    
    modalTitle.textContent = currentScenario.title;
    selectionResult.innerHTML = '<span class="placeholder">Click the button to make a random choice!</span>';
    selectionResult.className = 'selection-result';
    
    selectionModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Make random selection
function makeRandomSelection() {
    if (!currentScenario || currentScenario.choices.length === 0) return;
    
    // Disable button during animation
    selectRandomBtn.disabled = true;
    selectRandomBtn.textContent = '🎲 Choosing...';
    
    // Animate through choices
    let counter = 0;
    const maxIterations = 20;
    const interval = setInterval(() => {
        const randomChoice = currentScenario.choices[Math.floor(Math.random() * currentScenario.choices.length)];
        selectionResult.innerHTML = randomChoice;
        selectionResult.className = 'selection-result';
        
        counter++;
        if (counter >= maxIterations) {
            clearInterval(interval);
            
            // Final selection
            const finalChoice = currentScenario.choices[Math.floor(Math.random() * currentScenario.choices.length)];
            selectionResult.innerHTML = finalChoice;
            selectionResult.className = 'selection-result winner';
            
            // Re-enable button
            selectRandomBtn.disabled = false;
            selectRandomBtn.textContent = '🎲 Choose Random!';
            
            // Show success message
            showNotification(`Selected: ${finalChoice}`, 'success');
        }
    }, 100);
}

// Delete current scenario
function deleteCurrentScenario() {
    if (!currentScenario) return;
    
    if (confirm(`Are you sure you want to delete "${currentScenario.title}"?`)) {
        scenarios = scenarios.filter(s => s.id !== currentScenario.id);
        saveScenarios();
        renderScenarios();
        closeSelectionModal();
        showNotification('Scenario deleted successfully!', 'success');
    }
}

// Close selection modal
function closeSelectionModal() {
    selectionModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    currentScenario = null;
}

// Utility functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '12px 20px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '10000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        maxWidth: '300px',
        wordWrap: 'break-word'
    });
    
    // Set background color based on type
    if (type === 'success') {
        notification.style.background = '#48bb78';
    } else if (type === 'error') {
        notification.style.background = '#e53e3e';
    } else {
        notification.style.background = '#667eea';
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add some sample data for demonstration (optional)
function addSampleData() {
    if (scenarios.length === 0) {
        const sampleScenarios = [
            {
                id: 'sample1',
                title: 'What to eat for dinner',
                choices: ['Pizza', 'Burger', 'Salad', 'Sushi', 'Pasta', 'Tacos'],
                createdAt: new Date().toISOString()
            },
            {
                id: 'sample2',
                title: 'Weekend activity',
                choices: ['Watch a movie', 'Go hiking', 'Visit a museum', 'Play board games', 'Cook something new', 'Read a book'],
                createdAt: new Date().toISOString()
            }
        ];
        
        scenarios = sampleScenarios;
        saveScenarios();
        renderScenarios();
    }
}

// Uncomment the line below to add sample data for demonstration
// addSampleData();
