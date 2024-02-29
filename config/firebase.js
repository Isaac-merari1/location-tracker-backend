const admin = require('firebase-admin');
@TODO // Replace with the path to your service account key
const serviceAccount = require('./path/to/your/serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://location-tracking-notification.firebaseio.com',
});

module.exports = admin;
