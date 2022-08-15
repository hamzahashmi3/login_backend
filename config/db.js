const mongoose = require("mongoose");
require('dotenv').config();

// connect to db
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    // useFindAndModify: false,
    // useUnifiedTopology: true,
    // useCreateIndex: true
  })
  .then(() => console.log("DB connected"))
  .catch((err) => console.log("DB CONNECTION ERROR: ", err));
