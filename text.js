const express = require("express");
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const client = new MongoClient(process.env.CONNECTIONSTRING, {
  tlsAllowInvalidCertificates: true
});

async function startServer() {
  try {
    // 1. Connect to the database once when the server starts
    await client.connect();
    console.log("Connected to MongoDB!");

    // 2. Create an endpoint that the browser can visit
    app.get("/data", async (req, res) => {
      try {
        // IMPORTANT: Replace 'myDatabase' and 'myCollection' with your actual database and collection names
        const database = client.db("sample_mflix"); 
        const collection = database.collection("movies");
        
        // Fetch all documents from the collection and convert them to an array
        const documents = await collection.find({}).toArray();
        
        // Send the documents to the browser as JSON
        res.json(documents);
      } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Failed to fetch data" });
      }
    });

    // 3. Start listening for incoming browser requests
    app.listen(port, () => {
      console.log(`Server is running! View your data at http://localhost:${port}/data`);
    });

  } catch (err) {
    console.error("Database connection failed:", err);
  }
}

// Start the server
startServer();