import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import AddProperty from './pages/AddProperty';
import Home from './pages/Home';
import { PropertyProvider } from './context/PropertyContext';
import { supabase } from './utils/supabaseClient';
import AuthModal from './components/AuthModal';

function App() {
  const [sessionChecked, setSessionChecked] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setLoggedIn(!!session);
      setSessionChecked(true);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(!!session);
      setSessionChecked(true);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  if (!sessionChecked) return null;
  if (!loggedIn) return <AuthModal />;

  return (
    <PropertyProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="add" element={<AddProperty />} />
          </Route>
        </Routes>
      </Router>
    </PropertyProvider>
  );
}

export default App;
