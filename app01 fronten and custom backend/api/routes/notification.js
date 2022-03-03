const admin = require("firebase-admin");
const serviceAccount = require("../config/fcm.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
