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
    await client.connect();
    console.log("Connected to MongoDB!");

    app.get("/", async (req, res) => {
      try {
        const database = client.db("sample_mflix"); 
        const collection = database.collection("movies");
        
        // Fetch up to 50 movies
        const documents = await collection.find({}).limit(50).toArray();
        
        // Generate an HTML string looping through the documents
        const htmlTemplate = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Movie Collection</title>
            <style>
              body { font-family: Arial, sans-serif; background-color: #f4f4f9; color: #333; padding: 20px; }
              h1 { text-align: center; color: #222; }
              .movie-list { max-width: 800px; margin: 0 auto; }
              .movie-card { background: white; margin-bottom: 20px; padding: 15px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); display: flex; gap: 20px; }
              .movie-poster { max-width: 150px; object-fit: cover; border-radius: 4px; background: #ddd; display: flex; align-items: center; justify-content: center; text-align: center;}
              .movie-details h2 { margin-top: 0; margin-bottom: 10px; color: #0056b3; }
              .movie-details p { margin: 5px 0; line-height: 1.4; }
            </style>
          </head>
          <body>
            <h1>Movie Collection</h1>
            <div class="movie-list">
              ${documents.map(movie => `
                <div class="movie-card">
                  ${movie.poster 
                    ? `<img src="${movie.poster}" alt="${movie.title}" class="movie-poster" />` 
                    : `<div class="movie-poster" style="width: 150px; height: 220px;">No Image</div>`
                  }
                  <div class="movie-details">
                    <h2>${movie.title} (${movie.year || 'N/A'})</h2>
                    <p><strong>Genres:</strong> ${movie.genres ? movie.genres.join(", ") : 'N/A'}</p>
                    <p><strong>Cast:</strong> ${movie.cast ? movie.cast.join(", ") : 'N/A'}</p>
                    <p><strong>Plot:</strong> ${movie.plot || 'No plot available.'}</p>
                    <p><strong>IMDb Rating:</strong> ${movie.imdb && movie.imdb.rating ? movie.imdb.rating : 'N/A'}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </body>
          </html>
        `;

        // Send the HTML to the browser
        res.send(htmlTemplate);
      } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send("<h1>Failed to fetch data</h1>");
      }
    });

    app.listen(port, () => {
      console.log(`Server is running! View your movies at http://localhost:${port}/`);
    });

  } catch (err) {
    console.error("Database connection failed:", err);
  }
}

startServer();