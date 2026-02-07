const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Sri15cha10*",
    database: "SLOT_BOOKING",
});

db.connect(err => {
    if (err) {
        console.error("DB Connection Error:", err);
        process.exit(1);
    }
    console.log("MySQL Connected");

    const queries = [
        "ALTER TABLE bookings ADD COLUMN name VARCHAR(255)",
        "ALTER TABLE bookings ADD COLUMN email VARCHAR(255)",
        "ALTER TABLE bookings ADD COLUMN phone VARCHAR(20)",
        "ALTER TABLE bookings ADD COLUMN gender VARCHAR(10)"
    ];

    let completed = 0;
    queries.forEach(query => {
        db.query(query, (err) => {
            if (err) {
                // Ignore duplicate column errors if re-run
                if (err.code !== 'ER_DUP_FIELDNAME') {
                    console.error("Query Error:", err);
                } else {
                    console.log("Column already exists, skipping.");
                }
            } else {
                console.log("Column added successfully.");
            }
            completed++;
            if (completed === queries.length) {
                db.end();
                console.log("Schema update complete.");
            }
        });
    });
});
