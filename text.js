const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb+srv://rachitchaudhary_db_user:UBJtxKHYHzVpVW7E@cluster0.knw4byv.mongodb.net/sample_mflix?retryWrites=true&w=majority", {
  tlsAllowInvalidCertificates: true
});

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