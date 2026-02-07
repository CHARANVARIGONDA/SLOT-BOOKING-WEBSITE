const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Sri15cha10*",
    database: "SLOT_BOOKING",
});

db.connect(err => {
    if (err) throw err;

    db.query("SELECT * FROM bookings", (err, results) => {
        if (err) console.error(err);
        else console.log("Current Bookings:", results);
        db.end();
    });
});
