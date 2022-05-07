const MongoClient = require('mongodb').MongoClient;
const CONNECTION_STRING = "mongodb+srv://josuke:josuke1997@cluster0.gjvub.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
export default async function handler (req, res) {
  const client = await MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true });
  const db = await client.db('Lu');
  const body = req.query
  var pResult = await db.collection("participants").insert({
      id:'001',
      result: '11'
  });
  console.log(req.body);
  res.send(pResult);
}

