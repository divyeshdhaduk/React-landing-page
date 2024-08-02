const mongoose = require('mongoose');

const db = process.env.MONGODB_URI;

mongoose.connect(db).then(() => {
    console.log("Database Connected");
})
    .catch((err) => {
        console.log(err);
    });