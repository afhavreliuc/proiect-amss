class Room {
    constructor(roomNumber, type, price, capacity, available = true) {
        this.roomNumber = roomNumber; // Numărul camerei
        this.type = type; // Tipul camerei (single, double, suite)
        this.price = price; // Prețul pe noapte
        this.capacity = capacity; // Capacitatea camerei
        this.available = available; // Disponibilitatea camerei
        this.createdAt = new Date().toISOString(); // Data creării
    }
}

module.exports = Room;
