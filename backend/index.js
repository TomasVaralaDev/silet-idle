const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
require('dotenv').config();

// 1. Alusta Firebase Admin (Tämä vaatii Service Account Keyn toimiakseen oikeasti)
// Oikeassa tuotannossa lataisit avaimen environment variableista
// admin.initializeApp({
//   credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
// });

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// 2. Middleware joka tarkistaa tokenin (esimerkki)
const verifyToken = async (req, res, next) => {
  const idToken = req.headers.authorization;
  if (!idToken) {
    return res.status(401).send('Unauthorized');
  }

  try {
    // const decodedToken = await admin.auth().verifyIdToken(idToken);
    // req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).send('Invalid Token');
  }
};

// 3. Testireitti
app.get('/', (req, res) => {
  res.send('Timering Backend Running!');
});

// 4. Esimerkki suojatusta reitistä (esim. tallennuksen synkronointi)
app.post('/api/sync', verifyToken, (req, res) => {
  const userData = req.body;
  console.log('Syncing data for user:', userData);
  // Tässä tallentaisit datan oikeaan tietokantaan (MongoDB / Firestore)
  res.json({ status: 'success', message: 'Data synced' });
});

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});