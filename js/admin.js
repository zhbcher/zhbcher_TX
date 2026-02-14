// API基础URL
const API_BASE = '/api';

// 页面切换
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        const pageId = this.getAttribute('data-page');

        // 更新导航状态
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        this.classList.add('active');

        // 显示页面
        document.querySelectorAll('.content-page').forEach(page => page.classList.remove('active'));
        document.getElementById(pageId).classList.add('active');

        // 更新标题
        const titles = {
            'dashboard': '数据看板',
            'users': '用户管理',
            'news': '资讯管理',
            'calculations': '计算记录'
        };
        document.getElementById('pageTitle').textContent = titles[pageId];

        // 加载对应数据
        loadPageData(pageId);
    });
});

// 加载页面数据
async function loadPageData(pageId) {
    switch (pageId) {
        case 'dashboard':
            await loadDashboardStats();
            break;
        case 'users':
            await loadUsers();
            break;
        case 'news':
            await loadNews();
            break;
        case 'calculations':
            await loadCalculations();
            break;
    }
}

// 加载看板统计
async function loadDashboardStats() {
    try {
        const response = await fetch(`${API_BASE}/stats`);
        const stats = await response.json();

        document.getElementById('totalUsers').textContent = stats.totalUsers || 0;
        document.getElementById('totalNews').textContent = stats.totalNews || 0;
        document.getElementById('avgPension').textContent = stats.avgPension ? Math.round(stats.avgPension) : 0;

        // 添加最近活动
        const activityBody = document.getElementById('recentActivity');
        const activities = [
            { type: '用户注册', desc: '新用户注册', time: '刚刚' },
            { type: '资讯发布', desc: '新资讯已发布', time: '5分钟前' },
            { type: '退休金计算', desc: '用户进行退休金计算', time: '10分钟前' }
        ];

        activityBody.innerHTML = activities.map(activity => `
            <tr>
                <td><span class="badge badge-primary">${activity.type}</span></td>
                <td>${activity.desc}</td>
                <td>${activity.time}</td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('加载统计数据失败:', error);
    }
}

// 加载用户列表
async function loadUsers() {
    try {
        const response = await fetch(`${API_BASE}/users`);
        const users = await response.json();

        const tbody = document.getElementById('usersTable');
        tbody.innerHTML = users.map(user => `
            <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.gender}</td>
                <td>${user.birth_date}</td>
                <td>${user.retirement_age}岁</td>
                <td>${user.email || '-'}</td>
                <td>
                    <button class="action-btn" onclick="editUser(${user.id})">✏️</button>
                    <button class="action-btn delete-btn" onclick="deleteUser(${user.id})">🗑️</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('加载用户列表失败:', error);
    }
}

// 加载资讯列表
async function loadNews() {
    try {
        const response = await fetch(`${API_BASE}/news`);
        const news = await response.json();

        const tbody = document.getElementById('newsTable');
        tbody.innerHTML = news.map(item => `
            <tr>
                <td>${item.id}</td>
                <td>${item.title}</td>
                <td>${item.summary || '-'}</td>
                <td>${item.publish_date}</td>
                <td>
                    <button class="action-btn" onclick="editNews(${item.id})">✏️</button>
                    <button class="action-btn delete-btn" onclick="deleteNews(${item.id})">🗑️</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('加载资讯列表失败:', error);
    }
}

// 加载计算记录
async function loadCalculations() {
    try {
        const response = await fetch(`${API_BASE}/calculations`);
        const calculations = await response.json();

        const tbody = document.getElementById('calculationsTable');
        tbody.innerHTML = calculations.map(calc => `
            <tr>
                <td>${calc.id}</td>
                <td>${calc.work_years}</td>
                <td>${calc.basic_salary}</td>
                <td>${calc.social_rate}%</td>
                <td>${calc.retirement_age}岁</td>
                <td>${calc.pension}元</td>
                <td>${new Date(calc.created_at).toLocaleString('zh-CN')}</td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('加载计算记录失败:', error);
    }
}

// 打开用户模态框
function openUserModal(userId = null) {
    const modal = document.getElementById('userModal');
    modal.style.display = 'flex';

    if (userId) {
        // 编辑用户，填充数据
        document.getElementById('userForm').dataset.userId = userId;
    } else {
        // 新增用户，清空表单
        document.getElementById('userForm').reset();
        document.getElementById('userForm').dataset.userId = '';
    }
}

// 保存用户
async function saveUser(event) {
    event.preventDefault();

    const userId = document.getElementById('userForm').dataset.userId;
    const userData = {
        name: document.getElementById('userNameInput').value,
        gender: document.getElementById('userGenderInput').value,
        birthDate: document.getElementById('birthDateInput').value,
        retirementAge: parseInt(document.getElementById('retirementAgeInput').value),
        email: document.getElementById('userEmailInput').value,
        phone: document.getElementById('userPhoneInput').value
    };

    try {
        if (userId) {
            // 更新用户
            await fetch(`${API_BASE}/users/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
        } else {
            // 新增用户
            await fetch(`${API_BASE}/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
        }

        closeModal('userModal');
        await loadUsers();
        alert(userId ? '用户更新成功！' : '用户添加成功！');
    } catch (error) {
        console.error('保存用户失败:', error);
        alert('保存用户失败！');
    }
}

// 删除用户
async function deleteUser(userId) {
    if (!confirm('确定要删除这个用户吗？')) return;

    try {
        await fetch(`${API_BASE}/users/${userId}`, {
            method: 'DELETE'
        });
        await loadUsers();
        alert('用户删除成功！');
    } catch (error) {
        console.error('删除用户失败:', error);
        alert('删除用户失败！');
    }
}

// 打开资讯模态框
function openNewsModal(newsId = null) {
    const modal = document.getElementById('newsModal');
    modal.style.display = 'flex';

    if (newsId) {
        document.getElementById('newsForm').dataset.newsId = newsId;
    } else {
        document.getElementById('newsForm').reset();
        document.getElementById('newsForm').dataset.newsId = '';
    }
}

// 保存资讯
async function saveNews(event) {
    event.preventDefault();

    const newsId = document.getElementById('newsForm').dataset.newsId;
    const newsData = {
        title: document.getElementById('newsTitleInput').value,
        summary: document.getElementById('newsSummaryInput').value,
        content: document.getElementById('newsContentInput').value,
        publishDate: document.getElementById('newsDateInput').value
    };

    try {
        if (newsId) {
            await fetch(`${API_BASE}/news/${newsId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newsData)
            });
        } else {
            await fetch(`${API_BASE}/news`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newsData)
            });
        }

        closeModal('newsModal');
        await loadNews();
        alert(newsId ? '资讯更新成功！' : '资讯发布成功！');
    } catch (error) {
        console.error('保存资讯失败:', error);
        alert('保存资讯失败！');
    }
}

// 删除资讯
async function deleteNews(newsId) {
    if (!confirm('确定要删除这条资讯吗？')) return;

    try {
        await fetch(`${API_BASE}/news/${newsId}`, {
            method: 'DELETE'
        });
        await loadNews();
        alert('资讯删除成功！');
    } catch (error) {
        console.error('删除资讯失败:', error);
        alert('删除资讯失败！');
    }
}

// 关闭模态框
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// 刷新数据
async function refreshData() {
    const activePage = document.querySelector('.content-page.active').id;
    await loadPageData(activePage);
    alert('数据已刷新！');
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 加载默认页面数据
    loadDashboardStats();
});
