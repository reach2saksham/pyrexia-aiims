const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    paymentFor: { 
        type: String, 
        enum: ['BasicRegistration', 'MembershipCard', 'Event'], 
        required: true 
    },
    amount: { type: Number, required: true },
    razorpay_order_id: { type: String, required: true },
    razorpay_payment_id: { type: String },
    razorpay_signature: { type: String },
    status: { type: String, enum: ['created', 'paid', 'failed'], default: 'created' },
    relatedRegistrationId: { type: mongoose.Schema.Types.ObjectId } // For linking to a specific event registration
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;