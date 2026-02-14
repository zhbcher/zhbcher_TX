// 页面导航
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');

    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === pageId) {
            item.classList.add('active');
        }
    });
}

function navigateTo(pageId) {
    showPage(pageId);
}

// 退休倒计时计算（示例数据）
function updateCountdown() {
    const birthYear = 1978;
    const retirementAge = 60;
    const retirementYear = birthYear + retirementAge;

    const birthDate = new Date(birthYear, 8, 18);
    const retirementDate = new Date(retirementYear, 8, 18);
    const now = new Date();
    const diff = retirementDate - now;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    const daysCount = document.getElementById('daysCount');
    if (daysCount) {
        daysCount.textContent = Math.max(0, days);
    }
}

// 从档案加载用户数据
function loadFromArchive() {
    // 模拟从档案加载用户数据
    const archiveData = {
        name: 'min1',
        gender: '男',
        birthDate: '1978-09-18',
        retirementAge: 60,
        workYears: 19,
        contributionSalary: 220000,
        avgSalary: 8000,
        contributionRate: 2.0
    };

    // 更新用户信息显示
    if (document.getElementById('userNameValue')) {
        document.getElementById('userNameValue').textContent = archiveData.name;
    }

    // 更新计算表单
    document.getElementById('workYears').value = archiveData.workYears;
    document.getElementById('contributionSalary').value = archiveData.contributionSalary;
    document.getElementById('avgSalary').value = archiveData.avgSalary;
    document.getElementById('contributionRate').value = archiveData.contributionRate;
    document.getElementById('retAgeSelect').value = archiveData.retirementAge;

    alert('已从档案加载用户数据！');
}

// 退休金计算（使用新的计算公式）
function calculatePension() {
    const workYears = parseFloat(document.getElementById('workYears').value) || 0;
    const contributionSalary = parseFloat(document.getElementById('contributionSalary').value) || 0;
    const avgSalary = parseFloat(document.getElementById('avgSalary').value) || 0;
    const contributionRate = parseFloat(document.getElementById('contributionRate').value) || 1.0;
    const retirementAge = parseInt(document.getElementById('retAgeSelect').value) || 60;

    // 计算个人账户养老金
    // 个人账户养老金 = 个人账户储存额 ÷ 计发月数
    const storageAmount = contributionSalary * workYears; // 简化计算
    const calcMonths = getCalcMonths(retirementAge);
    const personalPension = storageAmount / calcMonths;

    // 计算基础养老金
    // 基础养老金 = (退休时当地上年度在岗职工月平均工资 × (1 + 本人平均缴费工资指数) ÷ 2) × 缴费年限 × 1%
    const basePension = (avgSalary * (1 + contributionRate) / 2) * workYears * 0.01;

    // 计算过渡性养老金（如果有）
    // 过渡性养老金 = 退休时当地上年度在岗职工月平均工资 × 本人平均缴费工资指数 × 1997年前缴费年限 × 1.4%
    const transitionYears = Math.max(0, workYears - 15); // 假设15年后为个人账户缴费期间
    const transitionPension = avgSalary * contributionRate * transitionYears * 0.014;

    // 总养老金
    const totalPension = basePension + personalPension + transitionPension;

    // 显示结果
    const resultCard = document.getElementById('resultCard');
    const pensionAmount = document.getElementById('pensionAmount');
    const basePentionEl = document.getElementById('basePension');
    const personalPensionEl = document.getElementById('personalPension');
    const transitionPensionEl = document.getElementById('transitionPension');

    resultCard.style.display = 'block';
    pensionAmount.textContent = totalPension.toFixed(2);
    basePentionEl.textContent = basePension.toFixed(2) + ' 元';
    personalPensionEl.textContent = personalPension.toFixed(2) + ' 元';
    transitionPensionEl.textContent = transitionPension.toFixed(2) + ' 元';

    // 保存计算记录
    saveCalculationRecord(workYears, contributionSalary, avgSalary, contributionRate, retirementAge, totalPension);

    // 发送到后端
    saveToBackend(workYears, contributionSalary, avgSalary, contributionRate, retirementAge, totalPension);
}

// 获取计发月数（根据退休年龄）
function getCalcMonths(retirementAge) {
    const monthsMap = {
        50: 195,
        55: 170,
        60: 139
    };
    return monthsMap[retirementAge] || 139;
}

// 保存计算记录到本地
function saveCalculationRecord(workYears, contributionSalary, avgSalary, contributionRate, retirementAge, totalPension) {
    const records = JSON.parse(localStorage.getItem('calculationRecords') || '[]');
    const record = {
        id: Date.now(),
        workYears,
        contributionSalary,
        avgSalary,
        contributionRate,
        retirementAge,
        totalPension,
        date: new Date().toLocaleString('zh-CN')
    };
    records.push(record);

    if (records.length > 10) {
        records.shift();
    }

    localStorage.setItem('calculationRecords', JSON.stringify(records));
}

// 保存到后端
async function saveToBackend(workYears, contributionSalary, avgSalary, contributionRate, retirementAge, totalPension) {
    try {
        const response = await fetch('/api/calculations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: 1,
                workYears,
                basicSalary: contributionSalary,
                socialRate: contributionRate,
                retirementAge,
                pension: totalPension,
                date: new Date().toISOString()
            })
        });

        if (response.ok) {
            console.log('记录已保存到数据库');
        }
    } catch (error) {
        console.log('后端未连接，数据仅保存在本地');
    }
}

// 编辑用户信息
function editUserInfo() {
    const newName = prompt('请输入姓名：', document.getElementById('userNameValue').textContent);
    if (newName) {
        document.getElementById('userNameValue').textContent = newName;
        document.getElementById('profileName').textContent = newName;

        saveUserInfo();
        saveUserToBackend();
    }
}

// 保存用户信息
function saveUserInfo() {
    const userInfo = {
        name: document.getElementById('userNameValue').textContent,
        gender: document.getElementById('userGender').textContent,
        birthDate: document.getElementById('birthDate').textContent,
        retirementAge: document.getElementById('retirementAge').textContent
    };

    localStorage.setItem('userInfo', JSON.stringify(userInfo));
}

// 保存用户信息到后端
async function saveUserToBackend() {
    try {
        const userInfo = {
            name: document.getElementById('userNameValue').textContent,
            gender: document.getElementById('userGender').textContent,
            birthDate: document.getElementById('birthDate').textContent,
            retirementAge: parseInt(document.getElementById('retirementAge').textContent),
            email: document.getElementById('profileEmail').textContent
        };

        const response = await fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userInfo)
        });

        if (response.ok) {
            console.log('用户信息已保存到数据库');
        }
    } catch (error) {
        console.log('后端未连接，数据仅保存在本地');
    }
}

// 加载用户信息
function loadUserInfo() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

    if (userInfo.name) {
        document.getElementById('userNameValue').textContent = userInfo.name;
        document.getElementById('profileName').textContent = userInfo.name;
    }
    if (userInfo.gender) {
        document.getElementById('userGender').textContent = userInfo.gender;
    }
    if (userInfo.birthDate) {
        document.getElementById('birthDate').textContent = userInfo.birthDate;
    }
    if (userInfo.retirementAge) {
        document.getElementById('retirementAge').textContent = userInfo.retirementAge;
    }
}

// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
    updateCountdown();
    loadUserInfo();
    setInterval(updateCountdown, 60000);
});

async function fetchNews() {
    try {
        const response = await fetch('/api/news');
        const news = await response.json();
        console.log('已获取最新资讯:', news);
    } catch (error) {
        console.log('使用本地默认资讯');
    }
}
