import React, { useState, useEffect } from 'react';
import { supabase } from './services/supabase';
import OrderForm from './components/OrderForm';
import OrderStatus from './components/OrderStatus';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import ProductList from './components/ProductList';
import { products } from './data/products';

function App() {
  const [orderId, setOrderId] = useState(null);
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleBack = () => {
    if (orderId) {
      setOrderId(null);
    } else if (selectedProduct) {
      setSelectedProduct(null);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setOrderId(null);
    setSelectedProduct(null);
  };

  if (!user) {
    return showRegister ? (
      <RegisterForm
        onRegister={setUser}
        switchToLogin={() => setShowRegister(false)}
      />
    ) : (
      <LoginForm
        onLogin={setUser}
        switchToRegister={() => setShowRegister(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-800">Drone Delivery</h1>
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-800"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {orderId ? (
          <OrderStatus orderId={orderId} onBack={handleBack} />
        ) : selectedProduct ? (
          <OrderForm
            selectedProduct={selectedProduct}
            onOrderPlaced={setOrderId}
            onBack={handleBack}
          />
        ) : (
          <ProductList
            products={products}
            onProductSelect={setSelectedProduct}
          />
        )}
      </main>
    </div>
  );
}

export default App;