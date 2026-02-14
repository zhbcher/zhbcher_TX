// 页面导航
function showPage(pageId) {
    // 隐藏所有页面
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // 显示目标页面
    document.getElementById(pageId).classList.add('active');

    // 更新导航栏状态
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === pageId) {
            item.classList.add('active');
        }
    });

    // 如果是首页，更新倒计时
    if (pageId === 'page-home') {
        updateCountdown();
    }
}

// 退休倒计时
function updateCountdown() {
    const retirementAge = parseInt(document.getElementById('retirementAge').value) || 60;
    const currentYear = new Date().getFullYear();
    const retirementYear = currentYear + (retirementAge - 30); // 假设当前年龄30岁

    // 计算剩余天数
    const retirementDate = new Date(retirementYear, 11, 31); // 假设退休日期为12月31日
    const now = new Date();
    const diff = retirementDate - now;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = days;
    document.getElementById('hours').textContent = hours;
    document.getElementById('minutes').textContent = minutes;
    document.getElementById('seconds').textContent = seconds;
}

// 退休金计算
function calculatePension() {
    const workYears = parseFloat(document.getElementById('workYears').value) || 0;
    const basicSalary = parseFloat(document.getElementById('basicSalary').value) || 0;
    const socialSecurityRate = parseFloat(document.getElementById('socialSecurityRate').value) || 0;
    const retirementAge = parseInt(document.getElementById('retirementAge').value);

    // 退休金计算公式
    const pension = basicSalary * (1 + workYears * 0.01) * (socialSecurityRate / 100);

    // 显示结果
    document.getElementById('pensionResult').textContent = pension.toFixed(2) + ' 元';
    document.getElementById('calculation-result').style.display = 'block';

    // 保存计算记录
    saveCalculationRecord(workYears, basicSalary, socialSecurityRate, retirementAge, pension);
}

// 保存计算记录
function saveCalculationRecord(workYears, basicSalary, socialSecurityRate, retirementAge, pension) {
    const records = JSON.parse(localStorage.getItem('calculationRecords') || '[]');
    const record = {
        id: Date.now(),
        workYears,
        basicSalary,
        socialSecurityRate,
        retirementAge,
        pension,
        date: new Date().toLocaleString('zh-CN')
    };
    records.push(record);
    localStorage.setItem('calculationRecords', JSON.stringify(records));
}

// 用户信息管理
function saveUserInfo() {
    const userInfo = {
        name: document.getElementById('userName').value,
        phone: document.getElementById('userPhone').value,
        email: document.getElementById('userEmail').value,
        registerMethod: localStorage.getItem('registerMethod') || '未注册',
        saveDate: new Date().toLocaleString('zh-CN')
    };

    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    alert('用户信息保存成功！');
}

// 注册功能
document.addEventListener('DOMContentLoaded', function() {
    // 监听注册方式变化
    document.querySelectorAll('input[name="registerMethod"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const phoneLabel = document.getElementById('phoneLabel');
            const emailLabel = document.getElementById('emailLabel');
            const codeGroup = document.getElementById('codeGroup');

            if (this.value === 'phone') {
                phoneLabel.textContent = '手机号';
                emailLabel.textContent = '邮箱';
                codeGroup.style.display = 'block';
            } else {
                phoneLabel.textContent = '邮箱';
                emailLabel.textContent = '手机号';
                codeGroup.style.display = 'none';
            }
        });
    });

    // 初始化倒计时
    updateCountdown();

    // 加载保存的用户信息
    loadUserInfo();

    // 加载计算记录
    loadCalculationRecords();
});

// 加载用户信息
function loadUserInfo() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    if (userInfo.name) {
        document.getElementById('userName').value = userInfo.name;
    }
    if (userInfo.phone) {
        document.getElementById('userPhone').value = userInfo.phone;
    }
    if (userInfo.email) {
        document.getElementById('userEmail').value = userInfo.email;
    }
    if (userInfo.registerMethod) {
        document.getElementById('registerMethod').textContent = userInfo.registerMethod;
    }
}

// 加载计算记录
function loadCalculationRecords() {
    const records = JSON.parse(localStorage.getItem('calculationRecords') || '[]');
    document.getElementById('savedRecords').textContent = records.length;
}

// 注册
function register() {
    const registerMethod = document.querySelector('input[name="registerMethod"]:checked').value;
    const phone = document.getElementById('registerPhone').value;
    const email = document.getElementById('registerEmail').value;

    if (!phone && !email) {
        alert('请输入手机号或邮箱');
        return;
    }

    if (registerMethod === 'phone' && phone.length !== 11) {
        alert('请输入正确的手机号');
        return;
    }

    if (registerMethod === 'email' && !email.includes('@')) {
        alert('请输入正确的邮箱');
        return;
    }

    // 保存注册信息
    localStorage.setItem('registerMethod', registerMethod);
    alert('注册成功！');
    showPage('page-profile');
}

// 定时更新倒计时
setInterval(updateCountdown, 1000);
