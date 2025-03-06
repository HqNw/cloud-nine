const express = require('express')

app = express();

app.use((req, res, next) => {
  if (req.url.startsWith('/api')) {
    req.url = req.url.substring(4);
  }
  next();
});


app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

