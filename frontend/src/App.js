import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from './components/AuthContext'; // Import AuthProvider
import ScrollToTop from './components/ScrollToTop';
import Login from './LoginandSignup/login';
import Signup from './LoginandSignup/signup';
import Home from './components/home';
import Notfound from './LoginandSignup/notfound';
import ForgotPassword from './LoginandSignup/forgotpassword';
import ResetPassword from './LoginandSignup/resetpassword';
import EmailVerification from './LoginandSignup/emailverification';
import ProtectedRoute from './components/protectedroute';
import Profile from './components/profile';
import './index.css';
import RegisterSoon from './Events/RegisterSoon';
import PaymentSuccess from "./Payment/PaymentSuccess";
import Payment from "./Payment/Payment";
import EventPage from './Events/EventPage';
import SubEventDetails from './Events/SubEventDetails';
import Navbar from './components/navbar';
import StarNight from './components/StarNight';
import Legals from './Legals/Legals';
import Schedule from './components/Schedule';
import BasicRegistration from './components/BasicRegistration';
import MembershipCard from './components/MembershipCard';
import Accomodation from './components/Accomodation';
import Welcome from './components/Welcome';

function App() {
  return (
    <AuthProvider> {/* Wrap everything in AuthProvider */}
      <Router>
        <ScrollToTop />
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/welcome' element={<ProtectedRoute element={Welcome} />} />
          {/* Other routes remain the same */}
          <Route path='/notfound' element={<Notfound />}></Route>
          {/* <Route path='/forgotpassword' element={<ForgotPassword />}></Route>
          <Route path='/resetpassword' element={<ResetPassword />}></Route>
          <Route path='/emailverification' element={<EmailVerification />}></Route> */}
          <Route path="/events" element={<EventPage />}></Route>
          <Route path="/profile" element={<ProtectedRoute element={Profile} />} />
          <Route path="/registerevent" element={<ProtectedRoute element={RegisterSoon} />} />
          <Route path="/paymentsuccess" element={<PaymentSuccess />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/basic-registration" element={<ProtectedRoute element={BasicRegistration} />} />
          <Route path="/membership-card" element={<ProtectedRoute element={MembershipCard} />} />
          <Route path="/accomodation" element={<Accomodation />} />
          <Route path="/legalS/:pageName" element={<Legals />} />
          <Route path="/subevent-details" element={<SubEventDetails />}></Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;