class Reservation {
    constructor(userId, roomId, startDate, endDate, status = 'pending') {
        this.userId = userId; // ID-ul utilizatorului care a făcut rezervarea
        this.roomId = roomId; // ID-ul camerei rezervate
        this.startDate = startDate; // Data de început a rezervării
        this.endDate = endDate; // Data de sfârșit a rezervării
        this.status = status; // Status-ul rezervării (pending, confirmed, canceled)
        this.createdAt = new Date().toISOString(); // Data creării rezervării
    }
}

module.exports = Reservation;
