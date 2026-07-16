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
        // Updated Database and Collection names
        const database = client.db("conference_app"); 
        const collection = database.collection("attendees");
        
        // Fetch attendees (limiting to 50 to prevent crashing if the list grows)
        const documents = await collection.find({}).limit(50).toArray();
        
        // Generate an HTML string looping through the attendee documents
        const htmlTemplate = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Conference Attendees</title>
            <style>
              body { font-family: Arial, sans-serif; background-color: #f4f4f9; color: #333; padding: 20px; }
              h1 { text-align: center; color: #222; }
              .attendee-list { max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }
              .attendee-card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); display: flex; gap: 25px; align-items: center; }
              .attendee-image { width: 120px; height: 120px; object-fit: cover; border-radius: 50%; background: #eee; border: 1px solid #ddd; flex-shrink: 0; display: flex; align-items: center; justify-content: center; color: #888; }
              .attendee-details h2 { margin: 0 0 5px 0; color: #0056b3; }
              .attendee-details h3 { margin: 0 0 12px 0; font-size: 16px; color: #555; font-weight: normal; }
              .attendee-details p { margin: 6px 0; line-height: 1.4; font-size: 14px; }
              .role-badge { display: inline-block; background: #e0e0e0; padding: 3px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; color: #333; margin-bottom: 5px; }
            </style>
          </head>
          <body>
            <h1>Conference Attendees</h1>
            <div class="attendee-list">
              ${documents.map(attendee => `
                <div class="attendee-card">
                  ${attendee.image 
                    ? `<img src="${attendee.image}" alt="${attendee.name}" class="attendee-image" />` 
                    : `<div class="attendee-image">No Image</div>`
                  }
                  <div class="attendee-details">
                    <h2>${attendee.name || 'Unknown Attendee'}</h2>
                    ${attendee.role ? `<span class="role-badge">${attendee.role}</span>` : ''}
                    <h3>${attendee.designation || 'Unknown Title'} at <strong>${attendee.organisation || 'Unknown Organization'}</strong></h3>
                    
                    <p><strong>Interests:</strong> ${attendee.interest && attendee.interest.length ? attendee.interest.join(", ") : 'None listed'}</p>
                    <p><strong>Goals:</strong> ${attendee.goals && attendee.goals.length ? attendee.goals.join(", ") : 'None listed'}</p>
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
      console.log(`Server is running! View attendees at http://localhost:${port}/`);
    });

  } catch (err) {
    console.error("Database connection failed:", err);
  }
}

startServer();