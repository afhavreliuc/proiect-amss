const { db } = require('../config/firebaseConfig');

// Obține toate camerele
exports.getAllRooms = async (req, res) => {
    try {
        const snapshot = await db.collection('rooms').get();
        const rooms = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(rooms);
    } catch (err) {
        res.status(500).json({ error: 'Eroare la obținerea camerelor.' });
    }
};

// Creează o cameră nouă
exports.createRoom = async (req, res) => {
    try {
        const newRoom = req.body;
        const roomRef = await db.collection('rooms').add(newRoom);
        res.status(201).json({ id: roomRef.id, ...newRoom });
    } catch (err) {
        res.status(500).json({ error: 'Eroare la crearea camerei.' });
    }
};
