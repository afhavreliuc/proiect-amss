const { db } = require('../config/firebaseConfig');

// Obține statistici generale
exports.getStatistics = async (req, res) => {
    try {
        // Număr total de utilizatori
        const usersSnapshot = await db.collection('users').get();
        const totalUsers = usersSnapshot.size;

        // Număr total de camere
        const roomsSnapshot = await db.collection('rooms').get();
        const totalRooms = roomsSnapshot.size;

        // Număr total de rezervări
        const reservationsSnapshot = await db.collection('reservations').get();
        const totalReservations = reservationsSnapshot.size;

        // Statistici consolidate
        const stats = {
            totalUsers,
            totalRooms,
            totalReservations,
        };

        res.status(200).json(stats);
    } catch (err) {
        res.status(500).json({ error: 'Eroare la obținerea statisticilor.' });
    }
};
