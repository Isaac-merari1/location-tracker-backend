const admin = require('firebase-admin');
@TODO // Replace with the path to your service account key
const serviceAccount = require('./path/to/your/serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    @TODO // Replace with your Firebase project URL
    databaseURL: 'https://your-project-id.firebaseio.com',
});

module.exports = admin;
