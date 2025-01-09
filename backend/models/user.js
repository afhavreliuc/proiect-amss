class User {
    constructor(name, email, role = 'guest') {
        this.name = name; // Numele utilizatorului
        this.email = email; // Email-ul utilizatorului
        this.role = role; // Rolul utilizatorului (guest, admin)
        this.createdAt = new Date().toISOString(); // Data înregistrării
    }
}

module.exports = User;
