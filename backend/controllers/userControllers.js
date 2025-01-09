const { db } = require('../config/firebaseConfig');

// Obține toți utilizatorii
exports.getAllUsers = async (req, res) => {
    try {
        const snapshot = await db.collection('users').get();
        const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: 'Eroare la obținerea utilizatorilor.' });
    }
};

// Creează un utilizator nou
exports.createUser = async (req, res) => {
    try {
        const newUser = req.body;
        const userRef = await db.collection('users').add(newUser);
        res.status(201).json({ id: userRef.id, ...newUser });
    } catch (err) {
        res.status(500).json({ error: 'Eroare la crearea utilizatorului.' });
    }
};
