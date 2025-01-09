const { db } = require('../config/firebaseConfig');

// Obține toate rezervările
exports.getAllReservations = async (req, res) => {
    try {
        const snapshot = await db.collection('reservations').get();
        const reservations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(reservations);
    } catch (err) {
        res.status(500).json({ error: 'Eroare la obținerea rezervărilor.' });
    }
};

// Creează o rezervare nouă
exports.createReservation = async (req, res) => {
    try {
        const newReservation = req.body;
        const reservationRef = await db.collection('reservations').add(newReservation);
        res.status(201).json({ id: reservationRef.id, ...newReservation });
    } catch (err) {
        res.status(500).json({ error: 'Eroare la crearea rezervării.' });
    }
};
