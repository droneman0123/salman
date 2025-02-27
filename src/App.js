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
    setOrderId(null);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setOrderId(null);
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
    <div className="min-h-screen bg-gray-100 px-4 py-6">
      <div className="w-full max-w-6xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <span className="text-sm text-gray-600">Welcome, {user.email}</span>
          <button
            onClick={handleLogout}
            className="text-sm text-red-500 hover:text-red-700"
          >
            Logout
          </button>
        </div>

        {orderId ? (
          <OrderStatus orderId={orderId} onBack={handleBack} />
        ) : selectedProduct ? (
          <OrderForm 
            onOrderPlaced={setOrderId} 
            selectedProduct={selectedProduct}
          />
        ) : (
          <ProductList 
            products={products} 
            onSelectProduct={setSelectedProduct}
          />
        )}
      </div>
    </div>
  );
}

export default App;