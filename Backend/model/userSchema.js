const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String },
    verifiedUser: { type: Boolean, required:true ,default:false },
    googleId: { type: String },
    displayName: { type: String },
    image: { type: String },
    // New fields for tracking registration status
    hasBasicRegistration: { type: Boolean, default: false },
    hasMembershipCard: { type: Boolean, default: false },
    registeredEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'EventRegistration' }]
});


 const User = mongoose.model('User', userSchema);

 module.exports = User;