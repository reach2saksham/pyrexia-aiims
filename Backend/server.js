require("dotenv").config();
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const crypto = require('crypto');
const express = require("express");
const Razorpay = require("razorpay");
const mongoose = require('mongoose');

// =================================================================
// DATABASE & MODELS
// =================================================================
require("./db/conn");
const User = require("./model/userSchema");
const EventRegistration = require("./model/registrationSchema");
const Order = require("./model/orderSchema");
const sendEmail = require("./utils/sendEmail");
const OAuth2Strategy = require("passport-google-oauth2").Strategy;

// =================================================================
// INITIAL SETUP & CONFIG
// =================================================================
const FRONTEND_URL = process.env.FRONTEND_URL;
const BACKEND_URL = process.env.BACKEND_URL;
const BASE_URL = process.env.BASE_URL;
const PORT = process.env.PORT || 6005;

const app = express();

app.use(cors({
  origin: FRONTEND_URL,
  methods: "GET,POST,PUT,DELETE",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

app.use(passport.initialize());
app.use(passport.session());

const resetTokens = {};
const verifyTokens = {};

// =================================================================
// MIDDLEWARE
// =================================================================
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "Unauthorized. Please log in." });
};

// CRITICAL FIX 1: The isAdmin middleware now does its own check without relying on a modified user object.
const isAdmin = (req, res, next) => {
    const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(email => email.trim());
    if (req.isAuthenticated() && adminEmails.includes(req.user.email)) {
        return next();
    }
    res.status(403).json({ error: "Forbidden: You do not have admin privileges." });
};

// =================================================================
// PASSPORT STRATEGIES (Authentication Logic)
// =================================================================
passport.use(new OAuth2Strategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: `${BACKEND_URL}/auth/google/callback`,
    scope: ["profile", "email"]
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ email: profile.email });
        if (user) {
            if (!user.verifiedUser) { user.verifiedUser = true; await user.save(); }
            return done(null, user);
        }
        const newUser = new User({
            googleId: profile.id,
            displayName: profile.displayName,
            name: profile.displayName,
            email: profile.email,
            image: profile.photos[0].value,
            verifiedUser: true,
        });
        await newUser.save();
        return done(null, newUser);
    } catch (error) {
        return done(error, null);
    }
}));

passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
        const user = await User.findOne({ email });
        if (!user) { return done(null, false, { message: 'User not found' }); }
        if (!user.verifiedUser) { return done(null, false, { message: 'Please verify your email to login.' }); }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) { return done(null, false, { message: 'Invalid credentials' }); }
        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

// CRITICAL FIX 2: Reverted deserializeUser to its original, correct state.
// This ensures that `req.user` is a full Mongoose document in all protected routes.
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user); // This passes the full Mongoose object as intended.
  } catch (error) {
    done(error, null);
  }
});

// =================================================================
// AUTHENTICATION & USER ROUTES
// =================================================================
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
app.get("/auth/google/callback", passport.authenticate("google", {
    successRedirect: `${FRONTEND_URL}/welcome`,
    failureRedirect: `${FRONTEND_URL}/notfound`
}));

app.post('/register', async (req, res) => {
    // ... (This section is unchanged)
});
app.post('/emailverification', async (req, res) => {
    // ... (This section is unchanged)
});
app.post('/login', passport.authenticate('local'), (req, res) => {
    // ... (This section is unchanged)
});

// CRITICAL FIX 3: The /login/success route is now responsible for adding the isAdmin flag for the frontend.
// This keeps the backend's session object clean while giving the frontend what it needs.
app.get('/login/success', (req, res) => {
    if (req.isAuthenticated()) {
        const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(email => email.trim());
        const userObj = req.user.toObject(); // Convert to plain object for modification
        userObj.isAdmin = adminEmails.includes(userObj.email); // Add the flag
        res.status(200).json({ success: true, user: userObj }); // Send the modified object
    } else {
        res.status(401).json({ success: false });
    }
});

app.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.session.destroy((err) => {
            if (err) return next(err);
            res.clearCookie('connect.sid', { path: '/' });
            res.status(200).json({ success: true, message: "User Logged out successfully." });
        });
    });
});

app.get('/user', isAuthenticated, (req, res) => {
    res.status(200).json({ user: req.user });
});

app.get('/api/user/status', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.user.id) // Correctly uses req.user.id from Mongoose object
            .select('hasBasicRegistration hasMembershipCard registeredEvents')
            .populate('registeredEvents', 'eventName');
        if (!user) return res.status(404).json({ error: "User not found" });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: "Server error while fetching user status." });
    }
});

// ... (RAZORPAY AND EVENT ROUTES ARE UNCHANGED AND WILL NOW WORK CORRECTLY) ...
const razorpayInstance = new Razorpay({ key_id: process.env.RAZORPAY_API_KEY, key_secret: process.env.RAZORPAY_API_SECRET });
app.get('/api/getkey', (req, res) => res.status(200).json({ key: process.env.RAZORPAY_API_KEY }));
app.post('/api/checkout', isAuthenticated, async (req, res) => {
    const { amount, paymentFor, relatedId } = req.body;
    const options = { amount: Number(amount * 100), currency: "INR" };
    try {
        const razorpayOrder = await razorpayInstance.orders.create(options);
        await Order.create({
            userId: req.user._id, // This now works correctly
            paymentFor,
            amount,
            razorpay_order_id: razorpayOrder.id,
            relatedRegistrationId: relatedId,
        });
        res.status(200).json({ success: true, order: razorpayOrder });
    } catch (error) {
        console.error("Checkout Error:", error);
        res.status(500).json({ success: false, message: "Could not create Razorpay order." });
    }
});
app.post('/api/paymentverification', async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_API_SECRET).update(body.toString()).digest("hex");
    if (expectedSignature === razorpay_signature) {
        const order = await Order.findOne({ razorpay_order_id });
        if (!order) return res.status(400).redirect(`${FRONTEND_URL}/paymentfailure`);
        order.razorpay_payment_id = razorpay_payment_id;
        order.razorpay_signature = razorpay_signature;
        order.status = 'paid';
        await order.save();
        if (order.paymentFor === 'BasicRegistration') {
            await User.updateOne({ _id: order.userId }, { hasBasicRegistration: true });
        } else if (order.paymentFor === 'MembershipCard') {
            await User.updateOne({ _id: order.userId }, { hasMembershipCard: true });
        } else if (order.paymentFor === 'Event' && order.relatedRegistrationId) {
            await EventRegistration.updateOne({ _id: order.relatedRegistrationId }, { Paid: true });
            await User.updateOne({ _id: order.userId }, { $addToSet: { registeredEvents: order.relatedRegistrationId } });
        }
        res.redirect(`${FRONTEND_URL}/paymentsuccess?reference=${razorpay_payment_id}`);
    } else {
        await Order.updateOne({ razorpay_order_id }, { status: 'failed' });
        res.redirect(`${FRONTEND_URL}/paymentfailure`);
    }
});
app.post('/registerevent', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.user._id); // This now works correctly
        if (!user.hasBasicRegistration) {
            return res.status(403).json({ error: "Basic Registration is required to register for events." });
        }
        const { eventName, teamLeaderName, teamLeaderMobileNo, teamLeaderEmail, teamLeaderCollege, teamSize, teamLeaderGender, fees } = req.body;
        if (!eventName || !teamLeaderName || !teamLeaderEmail || !teamSize || !fees) {
            return res.status(400).json({ error: "Missing required event registration fields." });
        }
        const existingRegistration = await EventRegistration.findOne({ eventName: eventName, teamLeaderEmail: teamLeaderEmail, Paid: false });
        if (existingRegistration) {
            return res.status(400).json({ error: "You have already added this event to your cart." });
        }
        const newRegistration = new EventRegistration({ eventName, teamLeaderName, teamLeaderMobileNo, teamLeaderEmail, teamLeaderCollege, teamSize, teamLeaderGender, fees, Paid: false });
        await newRegistration.save();
        res.status(201).json({ success: true, message: "Event added to cart successfully.", registration: newRegistration });
    } catch (error) {
        console.error("Event Registration Error:", error);
        res.status(500).json({ error: "Server error during event registration." });
    }
});
app.get('/cart', isAuthenticated, async (req, res) => {
    const userEmail = req.query.email;
    if (req.user.email !== userEmail) {
        return res.status(403).json({ error: "Forbidden" });
    }
    const cartItems = await EventRegistration.find({ teamLeaderEmail: userEmail, Paid: false });
    res.status(200).json(cartItems);
});

// =================================================================
// NEW ROUTE TO HANDLE ITEM REMOVAL
// =================================================================
app.post('/cart/remove', isAuthenticated, async (req, res) => {
    try {
        const { registrationId } = req.body;
        const userEmail = req.user.email;

        // Ensure the request includes the ID of the item to remove
        if (!registrationId) {
            return res.status(400).json({ error: "Registration ID is required." });
        }

        // Find the registration document to ensure it belongs to the logged-in user before deleting
        const registrationToDelete = await EventRegistration.findOne({ _id: registrationId, teamLeaderEmail: userEmail });

        if (!registrationToDelete) {
            // This prevents one user from deleting another user's cart items
            return res.status(404).json({ error: "Item not found in your cart or you do not have permission to remove it." });
        }

        // If the item is found and belongs to the user, delete it
        await EventRegistration.deleteOne({ _id: registrationId });

        res.status(200).json({ success: true, message: "Item removed from cart." });

    } catch (error) {
        console.error("Cart Item Removal Error:", error);
        res.status(500).json({ error: "Server error while removing item from cart." });
    }
});


// ... (ADMIN ROUTES ARE UNCHANGED AND WILL WORK CORRECTLY) ...
const adminRouter = express.Router();
adminRouter.get('/basic-registrations', async (req, res) => { /* ... */ });
adminRouter.get('/membership-cards', async (req, res) => { /* ... */ });
adminRouter.get('/event-registrations', async (req, res) => { /* ... */ });
app.use('/api/admin', isAdmin, adminRouter);


// =================================================================
// SERVER START
// =================================================================
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});