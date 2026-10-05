
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { NotificationProvider } from "./context/NotificationContext";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <NotificationProvider>
          <Router>
            <AppRoutes />
          </Router>
        </NotificationProvider>
      </CartProvider>
    </AuthProvider>
  );
}
