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

    db.query("DESCRIBE bookings", (err, results) => {
        if (err) {
            console.error("Query Error:", err);
        } else {
            console.log("Schema:", results);
        }
        db.end();
    });
});
