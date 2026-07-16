const { MongoClient } = require("mongodb");
const dotenv = require("dotenv")
dotenv.config()

const client = new MongoClient(process.env.CONNECTIONSTRING, {
  tlsAllowInvalidCertificates: true
})

async function run() {
  try {
    await client.connect();
    console.log("Connected!");
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

run();