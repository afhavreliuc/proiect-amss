const { db } = require('../config/firebaseConfig');

// Obține toate feedback-urile
exports.getAllFeedback = async (req, res) => {
    try {
        const snapshot = await db.collection('feedback').get();
        const feedbacks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(feedbacks);
    } catch (err) {
        res.status(500).json({ error: 'Eroare la obținerea feedback-ului.' });
    }
};

// Adaugă un feedback nou
exports.addFeedback = async (req, res) => {
    try {
        const newFeedback = {
            userId: req.body.userId,
            comment: req.body.comment,
            rating: req.body.rating,
            createdAt: new Date().toISOString(),
        };
        const feedbackRef = await db.collection('feedback').add(newFeedback);
        res.status(201).json({ id: feedbackRef.id, ...newFeedback });
    } catch (err) {
        res.status(500).json({ error: 'Eroare la adăugarea feedback-ului.' });
    }
};
