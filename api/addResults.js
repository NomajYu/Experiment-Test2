const MongoClient = require('mongodb').MongoClient;
const CONNECTION_STRING = "mongodb+srv://josuke:josuke1997@cluster0.gjvub.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
export default async function handler (req, res) {
  const client = await MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true });
  const db = await client.db('Lu');
  var pResult = await db.collection("participants").insertOne({
      id: req.body.pId,
      name: req.body.pName,
      manResp: req.body.manResp,
      result: req.body.pData
  });
  res.send(pResult);
}

