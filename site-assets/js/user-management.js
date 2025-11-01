// User Management Functions
function openCreateUserModal() {
    document.getElementById('createUserModal').style.display = 'block';
}

function closeCreateUserModal() {
    document.getElementById('createUserModal').style.display = 'none';
    document.getElementById('createUserForm').reset();
}

async function createNewUser(event) {
    event.preventDefault();

    const username = document.getElementById('newUsername').value.trim();
    const email = document.getElementById('newEmail').value.trim();
    const fullName = document.getElementById('newFullName').value.trim();
    const password = document.getElementById('newPassword').value;
    const passwordConfirm = document.getElementById('newPasswordConfirm').value;
    const role = document.getElementById('newUserRole').value;

    // Validate passwords match
    if (password !== passwordConfirm) {
        alert('Passwords do not match!');
        return;
    }

    // Validate password length
    if (password.length < 8) {
        alert('Password must be at least 8 characters long!');
        return;
    }

    try {
        // Call API to create user (you'll need to implement this endpoint)
        const response = await fetch('../api/create-user.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                email: email,
                full_name: fullName,
                password: password,
                role: role
            })
        });

        const data = await response.json();

        if (data.success) {
            showStatus('User created successfully!', 'success');
            closeCreateUserModal();
            loadUsers(); // Reload users list
        } else {
            console.error('API Error:', data);
            showStatus(data.message || 'Failed to create user', 'error');
            alert('Error: ' + (data.message || 'Failed to create user')); // Show detailed error
        }
    } catch (error) {
        console.error('Error creating user:', error);
        showStatus('Error creating user: ' + error.message, 'error');
        alert('Error creating user: ' + error.message);
    }
}

async function loadUsers() {
    const container = document.getElementById('usersListContainer');
    container.innerHTML = '<div id="loadingUsers" style="text-align: center; padding: 40px;"><div style="display: inline-block; animation: spin 1s linear infinite; font-size: 24px;">⏳</div><p>Loading users...</p></div>';

    try {
        // Call API to get users list (you'll need to implement this endpoint)
        const response = await fetch('../api/get-users.php');
        const data = await response.json();

        if (data.success) {
            displayUsers(data.users);
        } else {
            container.innerHTML = '<div style="text-align: center; padding: 40px; color: #dc2626;"><p>Failed to load users</p></div>';
        }
    } catch (error) {
        console.error('Error loading users:', error);
        container.innerHTML = '<div style="text-align: center; padding: 40px; color: #dc2626;"><p>Error loading users</p></div>';
    }
}

function displayUsers(users) {
    const container = document.getElementById('usersListContainer');

    if (!users || users.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 40px; color: #666;"><p>No users found</p></div>';
        return;
    }

    let html = '<table class="results-table" style="width: 100%; border-collapse: collapse;">';
    html += '<thead><tr>';
    html += '<th style="padding: 12px; text-align: left; border-bottom: 2px solid #e2e8f0;">ID</th>';
    html += '<th style="padding: 12px; text-align: left; border-bottom: 2px solid #e2e8f0;">Username</th>';
    html += '<th style="padding: 12px; text-align: left; border-bottom: 2px solid #e2e8f0;">Email</th>';
    html += '<th style="padding: 12px; text-align: left; border-bottom: 2px solid #e2e8f0;">Full Name</th>';
    html += '<th style="padding: 12px; text-align: left; border-bottom: 2px solid #e2e8f0;">Role</th>';
    html += '<th style="padding: 12px; text-align: left; border-bottom: 2px solid #e2e8f0;">Status</th>';
    html += '<th style="padding: 12px; text-align: left; border-bottom: 2px solid #e2e8f0;">Created</th>';
    html += '<th style="padding: 12px; text-align: left; border-bottom: 2px solid #e2e8f0;">Actions</th>';
    html += '</tr></thead><tbody>';

    users.forEach(user => {
        const isActive = user.is_active == 1;
        const statusBadge = isActive
            ? '<span style="background: #10b981; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px;">Active</span>'
            : '<span style="background: #ef4444; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px;">Inactive</span>';

        const roleBadge = user.role === 'admin'
            ? '<span style="background: #3b82f6; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px;">Admin</span>'
            : '<span style="background: #6b7280; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px;">Editor</span>';

        html += '<tr style="border-bottom: 1px solid #e2e8f0;">';
        html += `<td style="padding: 12px;">${user.id}</td>`;
        html += `<td style="padding: 12px;"><strong>${user.username}</strong></td>`;
        html += `<td style="padding: 12px;">${user.email}</td>`;
        html += `<td style="padding: 12px;">${user.full_name || '-'}</td>`;
        html += `<td style="padding: 12px;">${roleBadge}</td>`;
        html += `<td style="padding: 12px;">${statusBadge}</td>`;
        html += `<td style="padding: 12px;">${new Date(user.created_at).toLocaleDateString()}</td>`;
        html += '<td style="padding: 12px;">';
        html += `<button class="btn btn-primary" onclick="toggleUserStatus(${user.id}, ${isActive})" style="padding: 6px 12px; font-size: 12px; margin-right: 5px;">${isActive ? 'Deactivate' : 'Activate'}</button>`;
        html += `<button class="btn btn-danger" onclick="deleteUser(${user.id}, '${user.username}')" style="padding: 6px 12px; font-size: 12px;">Delete</button>`;
        html += '</td>';
        html += '</tr>';
    });

    html += '</tbody></table>';
    container.innerHTML = html;
}

async function toggleUserStatus(userId, currentStatus) {
    const action = currentStatus ? 'deactivate' : 'activate';

    if (!confirm(`Are you sure you want to ${action} this user?`)) {
        return;
    }

    try {
        const response = await fetch('../api/toggle-user-status.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: userId,
                is_active: !currentStatus
            })
        });

        const data = await response.json();

        if (data.success) {
            showStatus(`User ${action}d successfully!`, 'success');
            loadUsers(); // Reload users list
        } else {
            showStatus(data.message || `Failed to ${action} user`, 'error');
        }
    } catch (error) {
        console.error(`Error ${action}ing user:`, error);
        showStatus(`Error ${action}ing user`, 'error');
    }
}

async function deleteUser(userId, username) {
    if (!confirm(`Are you sure you want to delete user "${username}"? This action cannot be undone!`)) {
        return;
    }

    try {
        const response = await fetch('../api/delete-user.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: userId
            })
        });

        const data = await response.json();

        if (data.success) {
            showStatus('User deleted successfully!', 'success');
            loadUsers(); // Reload users list
        } else {
            showStatus(data.message || 'Failed to delete user', 'error');
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        showStatus('Error deleting user', 'error');
    }
}

// Load users when the users tab is shown
document.addEventListener('DOMContentLoaded', function() {
    const usersTab = document.querySelector('[data-tab="users"]');
    if (usersTab) {
        usersTab.addEventListener('click', function() {
            loadUsers();
        });
    }
});

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const createUserModal = document.getElementById('createUserModal');
    if (event.target === createUserModal) {
        closeCreateUserModal();
    }
});
