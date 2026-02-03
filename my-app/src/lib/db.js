const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// 1. Connect to the database file securely
const dbPath = path.join(process.cwd(), 'mindscroll.db');

const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    }
});

// 2. Make a helper function to get users (wrapped in a Promise)
export const getAllUsers = () => {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM users", [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

// 3. Helper function to create a new user securely
export const createUser = (email, username, password) => {
    return new Promise((resolve, reject) => {
        const query = `INSERT INTO users (email, username, password) VALUES (?, ?, ?)`;

        // The 'run' method is used for INSERT/UPDATE/DELETE in sqlite3
        db.run(query, [email, username, password], function(err) {
            if (err) {
                reject(err);
            } else {
                // "this.lastID" returns the ID of the user we just created
                resolve(this.lastID);
            }
        });
    });
};

// 4. Helper to find a user by email (for logging in)
export const getUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        // We select ALL fields, including the password, because we need to check it
        const query = `SELECT * FROM users WHERE email = ?`;

        db.get(query, [email], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row); // Returns undefined if user not found
            }
        });
    });
};
// 5. Create a new post linked to a user
export const createPost = (title, content, authorId) => {
    return new Promise((resolve, reject) => {
        const query = `INSERT INTO posts (title, content, authorId, created_at) VALUES (?, ?, ?, datetime('now'))`;

        db.run(query, [title, content, authorId], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
};

// 6. Get all posts with their author's name (JOIN query)
export const getAllPosts = () => {
    return new Promise((resolve, reject) => {
        // We join 'posts' and 'users' so we can show "Written by TestUser"
        const query = `
      SELECT posts.*, users.username as authorName 
      FROM posts 
      JOIN users ON posts.authorId = users.id 
      ORDER BY created_at DESC
    `;

        db.all(query, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};