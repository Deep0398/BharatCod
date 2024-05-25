import admin from 'firebase-admin'
import serviceAccount from './serviceAccountKey.json'  assert { type: 'json' };

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://bharatcod-e155b.firebaseio.com',
    projectId: 'bharatcod-e155b'
})
export default admin