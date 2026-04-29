// State Management
let users = JSON.parse(localStorage.getItem('users')) || [];
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentEditingUser = null;
let currentEditingTask = null;

// Initialize App
window.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    loadUsers();
    loadTasks();
    populateUserSelect();
});

// Event Listeners
function setupEventListeners() {
    // Tab navigation
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // Modal close on background click
    document.getElementById('userModal').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) closeUserModal();
    });
    document.getElementById('taskModal').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) closeTaskModal();
    });
}

// Tab Navigation
function switchTab(tabName) {
    // Update active tab button
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update active tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabName).classList.add('active');
}

// ========== USERS MANAGEMENT ==========

function loadUsers() {
    const usersList = document.getElementById('users-list');
    
    if (users.length === 0) {
        usersList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-user-plus"></i>
                <p>No users yet. Click "Add User" to get started!</p>
            </div>
        `;
        return;
    }

    usersList.innerHTML = users.map(user => `
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">${escapeHtml(user.name)}</h3>
            </div>
            <div class="card-body">
                <div class="card-info">
                    <div class="info-row">
                        <i class="fas fa-envelope"></i>
                        <span class="info-label">Email:</span>
                        <span>${escapeHtml(user.email)}</span>
                    </div>
                    ${user.phone ? `
                        <div class="info-row">
                            <i class="fas fa-phone"></i>
                            <span class="info-label">Phone:</span>
                            <span>${escapeHtml(user.phone)}</span>
                        </div>
                    ` : ''}
                    <div class="info-row">
                        <i class="fas fa-calendar"></i>
                        <span class="info-label">Added:</span>
                        <span>${new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
            <div class="card-footer">
                <button class="btn btn-success" onclick="editUser(${user.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-danger" onclick="deleteUser(${user.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
}

function openUserModal() {
    currentEditingUser = null;
    document.getElementById('userForm').reset();
    document.getElementById('userModalTitle').textContent = 'Add User';
    document.getElementById('userModal').classList.add('active');
}

function closeUserModal() {
    document.getElementById('userModal').classList.remove('active');
    document.getElementById('userForm').reset();
    currentEditingUser = null;
}

function editUser(userId) {
    currentEditingUser = users.find(u => u.id === userId);
    if (!currentEditingUser) return;

    document.getElementById('userName').value = currentEditingUser.name;
    document.getElementById('userEmail').value = currentEditingUser.email;
    document.getElementById('userPhone').value = currentEditingUser.phone || '';
    document.getElementById('userModalTitle').textContent = 'Edit User';
    document.getElementById('userModal').classList.add('active');
}

function handleUserSubmit(event) {
    event.preventDefault();

    const userData = {
        name: document.getElementById('userName').value.trim(),
        email: document.getElementById('userEmail').value.trim().toLowerCase(),
        phone: document.getElementById('userPhone').value.trim()
    };

    // Validation
    if (!userData.name || !userData.email) {
        showToast('Please fill in required fields', 'error');
        return;
    }

    if (currentEditingUser) {
        // Update existing user
        const index = users.findIndex(u => u.id === currentEditingUser.id);
        users[index] = {
            ...currentEditingUser,
            ...userData,
            updatedAt: new Date().toISOString()
        };
        showToast('User updated successfully', 'success');
    } else {
        // Add new user
        const newUser = {
            id: Date.now(),
            ...userData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        users.push(newUser);
        showToast('User added successfully', 'success');
    }

    saveUsers();
    loadUsers();
    populateUserSelect();
    closeUserModal();
}

function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user? Associated tasks will also be removed.')) {
        users = users.filter(u => u.id !== userId);
        tasks = tasks.filter(t => t.userId !== userId);
        saveUsers();
        saveTasks();
        loadUsers();
        loadTasks();
        populateUserSelect();
        showToast('User deleted successfully', 'success');
    }
}

function saveUsers() {
    localStorage.setItem('users', JSON.stringify(users));
}

// ========== TASKS MANAGEMENT ==========

function loadTasks() {
    const tasksList = document.getElementById('tasks-list');
    
    if (tasks.length === 0) {
        tasksList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-tasks"></i>
                <p>No tasks yet. Click "Add Task" to get started!</p>
            </div>
        `;
        return;
    }

    tasksList.innerHTML = tasks.map(task => {
        const assignedUser = task.userId ? users.find(u => u.id === task.userId) : null;
        return `
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">${escapeHtml(task.title)}</h3>
                    <span class="card-status status-${task.status}">${task.status}</span>
                </div>
                <div class="card-body">
                    <div class="card-info">
                        ${task.description ? `
                            <div class="info-row">
                                <i class="fas fa-file-alt"></i>
                                <span>${escapeHtml(task.description)}</span>
                            </div>
                        ` : ''}
                        ${assignedUser ? `
                            <div class="info-row">
                                <i class="fas fa-user"></i>
                                <span class="info-label">Assigned to:</span>
                                <span>${escapeHtml(assignedUser.name)}</span>
                            </div>
                        ` : ''}
                        <div class="info-row">
                            <i class="fas fa-calendar"></i>
                            <span class="info-label">Created:</span>
                            <span>${new Date(task.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
                <div class="card-footer">
                    <button class="btn btn-success" onclick="editTask(${task.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger" onclick="deleteTask(${task.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function openTaskModal() {
    currentEditingTask = null;
    document.getElementById('taskForm').reset();
    document.getElementById('taskModalTitle').textContent = 'Add Task';
    document.getElementById('taskModal').classList.add('active');
}

function closeTaskModal() {
    document.getElementById('taskModal').classList.remove('active');
    document.getElementById('taskForm').reset();
    currentEditingTask = null;
}

function editTask(taskId) {
    currentEditingTask = tasks.find(t => t.id === taskId);
    if (!currentEditingTask) return;

    document.getElementById('taskTitle').value = currentEditingTask.title;
    document.getElementById('taskDescription').value = currentEditingTask.description || '';
    document.getElementById('taskStatus').value = currentEditingTask.status;
    document.getElementById('taskUser').value = currentEditingTask.userId || '';
    document.getElementById('taskModalTitle').textContent = 'Edit Task';
    document.getElementById('taskModal').classList.add('active');
}

function handleTaskSubmit(event) {
    event.preventDefault();

    const taskData = {
        title: document.getElementById('taskTitle').value.trim(),
        description: document.getElementById('taskDescription').value.trim(),
        status: document.getElementById('taskStatus').value,
        userId: parseInt(document.getElementById('taskUser').value) || null
    };

    // Validation
    if (!taskData.title) {
        showToast('Please enter a task title', 'error');
        return;
    }

    if (currentEditingTask) {
        // Update existing task
        const index = tasks.findIndex(t => t.id === currentEditingTask.id);
        tasks[index] = {
            ...currentEditingTask,
            ...taskData,
            updatedAt: new Date().toISOString()
        };
        showToast('Task updated successfully', 'success');
    } else {
        // Add new task
        const newTask = {
            id: Date.now(),
            ...taskData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        tasks.push(newTask);
        showToast('Task added successfully', 'success');
    }

    saveTasks();
    loadTasks();
    closeTaskModal();
}

function deleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks = tasks.filter(t => t.id !== taskId);
        saveTasks();
        loadTasks();
        showToast('Task deleted successfully', 'success');
    }
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// ========== UTILITIES ==========

function populateUserSelect() {
    const select = document.getElementById('taskUser');
    const currentValue = select.value;
    
    select.innerHTML = '<option value="">None</option>' + users.map(user => 
        `<option value="${user.id}">${escapeHtml(user.name)}</option>`
    ).join('');
    
    select.value = currentValue;
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast active ${type}`;
    
    setTimeout(() => {
        toast.classList.remove('active');
    }, 3000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}