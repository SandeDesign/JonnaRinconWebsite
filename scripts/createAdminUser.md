# Admin User Aanmaken

## Optie 1: Via Firebase Console (Aanbevolen)

1. Ga naar [Firebase Console](https://console.firebase.google.com/)
2. Selecteer project: `jonnarincon-d5650`
3. Ga naar **Authentication** > **Users**
4. Klik op **Add User**
5. Vul in:
   - Email: `jonna@jonnarincon.com`
   - Password: [kies een sterk wachtwoord]
6. Kopieer de **UID** van de nieuwe user
7. Ga naar **Firestore Database**
8. Klik op **Start collection**
9. Collection ID: `users`
10. Document ID: [plak de UID hier]
11. Vul de fields in:

```
uid: [de UID]
email: jonna@jonnarincon.com
displayName: Jonna Rincon
role: admin
createdAt: [klik op "timestamp" type]
updatedAt: [klik op "timestamp" type]
```

12. Klik op **Save**

## Optie 2: Via Cloud Function

Maak een Cloud Function aan om programmatisch een admin user te maken:

```javascript
const admin = require('firebase-admin');
admin.initializeApp();

exports.createAdminUser = functions.https.onCall(async (data, context) => {
  const { email, password, displayName } = data;

  try {
    // Create auth user
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName,
    });

    // Set custom claims
    await admin.auth().setCustomUserClaims(userRecord.uid, {
      role: 'admin',
    });

    // Create Firestore document
    await admin.firestore().collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email,
      displayName,
      role: 'admin',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { success: true, uid: userRecord.uid };
  } catch (error) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});
```

## Optie 3: Via Admin SDK Script

Maak een Node.js script:

```javascript
// createAdmin.js
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function createAdminUser() {
  const email = 'jonna@jonnarincon.com';
  const password = 'JonnaAdmin2024!'; // Verander dit!
  const displayName = 'Jonna Rincon';

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName,
    });

    await admin.auth().setCustomUserClaims(userRecord.uid, {
      role: 'admin',
    });

    await admin.firestore().collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email,
      displayName,
      role: 'admin',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log('✅ Admin user created successfully!');
    console.log('UID:', userRecord.uid);
    console.log('Email:', email);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  }

  process.exit();
}

createAdminUser();
```

Run met: `node createAdmin.js`

## Inloggen

Na het aanmaken van de admin user:

1. Start de dev server: `npm run dev`
2. Ga naar: `http://localhost:5173/admin/login`
3. Log in met de email en wachtwoord
4. Je wordt doorgestuurd naar het admin dashboard

## Troubleshooting

### "User has no admin role"

Controleer in Firestore Database dat:
- De `users` collectie bestaat
- Er een document is met de UID van de user
- Het veld `role` exact de waarde `"admin"` heeft (met quotes, lowercase)

### "Authentication failed"

- Check of de email en wachtwoord correct zijn
- Verifieer dat de user bestaat in Firebase Authentication
- Check de browser console voor error messages

### "Access denied"

- Zorg dat de user role op 'admin' staat
- Refresh de pagina
- Log uit en weer in
