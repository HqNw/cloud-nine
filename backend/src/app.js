const express = require('express');
const mongoose= require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');


app = express();
app.use(express.json());
app.use("/uploads", express.static("uploads"));

mongoose
  .connect(process.env.MONGO_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true })
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("Database connection error:", err));



app.use((req, res, next) => {
  if (req.url.startsWith('/api')) {
    req.url = req.url.substring(4);
  }
  next();
});
 

app.get("/", (req, res) => {
  res.send("running");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

