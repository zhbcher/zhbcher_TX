const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

const db = new sqlite3.Database('./retirement.db', (err) => {
    if (err) {
        console.error('数据库连接失败:', err.message);
    } else {
        console.log('已连接到 SQLite 数据库');
        initDatabase();
    }
});

// 根路径重定向到首页
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

function initDatabase() {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        gender TEXT,
        birth_date TEXT,
        retirement_age INTEGER,
        email TEXT,
        phone TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('创建 users 表失败:', err.message);
            return;
        }

        db.run(`CREATE TABLE IF NOT EXISTS news (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT,
            summary TEXT,
            publish_date TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) {
                console.error('创建 news 表失败:', err.message);
                return;
            }

            db.run(`CREATE TABLE IF NOT EXISTS calculations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                work_years INTEGER,
                basic_salary REAL,
                social_rate REAL,
                retirement_age INTEGER,
                pension REAL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )`, (err) => {
                if (err) {
                    console.error('创建 calculations 表失败:', err.message);
                    return;
                }

                db.run(`CREATE TABLE IF NOT EXISTS settings (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    key TEXT UNIQUE,
                    value TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )`, (err) => {
                    if (err) {
                        console.error('创建 settings 表失败:', err.message);
                        return;
                    }

                    // 所有表创建完成后，插入默认数据
                    const defaultNews = [
                        {
                            title: '最新退休政策解读',
                            content: '2024年退休政策有重大调整，请注意查看最新政策文件...',
                            summary: '2024年退休政策有重大调整，请注意查看...',
                            publish_date: '2024-01-15'
                        },
                        {
                            title: '退休金计算新公式',
                            content: '新的退休金计算公式已经实施，更加公平合理...',
                            summary: '新的退休金计算公式已经实施...',
                            publish_date: '2024-01-10'
                        },
                        {
                            title: '退休生活指南',
                            content: '退休后如何规划生活，享受美好晚年时光...',
                            summary: '退休后如何规划生活，享受美好晚年...',
                            publish_date: '2024-01-05'
                        }
                    ];

                    const stmt = db.prepare('INSERT OR IGNORE INTO news (title, content, summary, publish_date) VALUES (?, ?, ?, ?)');
                    defaultNews.forEach(news => {
                        stmt.run([news.title, news.content, news.summary, news.publish_date]);
                    });
                    stmt.finalize();

                    console.log('数据库表初始化完成');
                });
            });
        });
    });
}

app.get('/api/users', (req, res) => {
    db.all('SELECT * FROM users ORDER BY created_at DESC', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post('/api/users', (req, res) => {
    const { name, gender, birthDate, retirementAge, email, phone } = req.body;
    db.run(
        'INSERT INTO users (name, gender, birth_date, retirement_age, email, phone) VALUES (?, ?, ?, ?, ?, ?)',
        [name, gender, birthDate, retirementAge, email, phone],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ id: this.lastID, message: '用户信息已保存' });
        }
    );
});

app.put('/api/users/:id', (req, res) => {
    const { name, gender, birthDate, retirementAge, email, phone } = req.body;
    db.run(
        'UPDATE users SET name = ?, gender = ?, birth_date = ?, retirement_age = ?, email = ?, phone = ? WHERE id = ?',
        [name, gender, birthDate, retirementAge, email, phone, req.params.id],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ message: '用户信息已更新' });
        }
    );
});

app.delete('/api/users/:id', (req, res) => {
    db.run('DELETE FROM users WHERE id = ?', [req.params.id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: '用户已删除' });
    });
});

app.get('/api/news', (req, res) => {
    db.all('SELECT * FROM news ORDER BY publish_date DESC', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post('/api/news', (req, res) => {
    const { title, content, summary, publishDate } = req.body;
    db.run(
        'INSERT INTO news (title, content, summary, publish_date) VALUES (?, ?, ?, ?)',
        [title, content, summary, publishDate],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ id: this.lastID, message: '资讯已发布' });
        }
    );
});

app.put('/api/news/:id', (req, res) => {
    const { title, content, summary, publishDate } = req.body;
    db.run(
        'UPDATE news SET title = ?, content = ?, summary = ?, publish_date = ? WHERE id = ?',
        [title, content, summary, publishDate, req.params.id],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ message: '资讯已更新' });
        }
    );
});

app.delete('/api/news/:id', (req, res) => {
    db.run('DELETE FROM news WHERE id = ?', [req.params.id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: '资讯已删除' });
    });
});

app.get('/api/calculations', (req, res) => {
    db.all('SELECT * FROM calculations ORDER BY created_at DESC', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post('/api/calculations', (req, res) => {
    const { userId, workYears, basicSalary, socialRate, retirementAge, pension } = req.body;
    db.run(
        'INSERT INTO calculations (user_id, work_years, basic_salary, social_rate, retirement_age, pension) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, workYears, basicSalary, socialRate, retirementAge, pension],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ id: this.lastID, message: '计算记录已保存' });
        }
    );
});

app.get('/api/stats', (req, res) => {
    db.get(
        'SELECT COUNT(*) as total_users, AVG(pension) as avg_pension FROM calculations',
        [],
        (err, row) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }

            db.get('SELECT COUNT(*) as total_users FROM users', [], (err, userRow) => {
                db.get('SELECT COUNT(*) as total_news FROM news', [], (err, newsRow) => {
                    res.json({
                        totalUsers: userRow.total_users,
                        totalNews: newsRow.total_news,
                        avgPension: row.avg_pension
                    });
                });
            });
        }
    );
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: '服务运行正常' });
});

app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
    console.log(`前端页面: http://localhost:${PORT}/index.html`);
    console.log(`后台管理: http://localhost:${PORT}/admin.html`);
});

process.on('SIGTERM', () => {
    console.log('收到 SIGTERM 信号，正在关闭服务器...');
    db.close((err) => {
        if (err) {
            console.error('关闭数据库时出错:', err.message);
        }
        console.log('数据库连接已关闭');
        process.exit(0);
    });
});
