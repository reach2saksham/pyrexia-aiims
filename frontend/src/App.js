import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from './components/AuthContext';
import ScrollToTop from './components/ScrollToTop';
// import './utils/axiosConfig';
import Login from './LoginandSignup/login';
import Signup from './LoginandSignup/signup';
import Home from './components/home';
import Notfound from './LoginandSignup/notfound';
import ProtectedRoute from './components/protectedroute';
import Profile from './components/profile';
import './index.css';
import PaymentSuccess from "./Payment/PaymentSuccess";
import EventPage from './Events/EventPage';
import SubEventDetails from './Events/SubEventDetails';
import Navbar from './components/navbar';
import Legals from './Legals/Legals';
import BasicRegistration from './components/BasicRegistration';
import MembershipCard from './components/MembershipCard';
import Accomodation from './components/Accomodation';
import Welcome from './components/Welcome';
import Cart from './Events/Cart';
import EventRegistration from './Events/EventRegistration';
import AdminRoute from './components/AdminRoute'; // Import the new AdminRoute
import AdminDashboard from './Admin/AdminDashboard'; // Import the dashboard component

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/welcome' element={<ProtectedRoute element={Welcome} />} />
          <Route path='/notfound' element={<Notfound />}></Route>
          <Route path="/events" element={<EventPage />}></Route>
          <Route path="/profile" element={<ProtectedRoute element={Profile} />} />
          <Route path="/registerevent" element={<ProtectedRoute element={EventRegistration} />} />
          <Route path="/cart" element={<ProtectedRoute element={Cart} />} />
          <Route path="/paymentsuccess" element={<PaymentSuccess />} />
          <Route path="/basic-registration" element={<ProtectedRoute element={BasicRegistration} />} />
          <Route path="/membership-card" element={<ProtectedRoute element={MembershipCard} />} />
          <Route path="/accomodation" element={<Accomodation />} />
          <Route path="/legalS/:pageName" element={<Legals />} />
          <Route path="/subevent-details" element={<SubEventDetails />}></Route>
          
          {/* NEW: Add the protected admin route */}
          <Route path="/admin" element={<AdminRoute element={AdminDashboard} />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;