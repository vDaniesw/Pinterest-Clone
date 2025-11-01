import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import PinGrid from './components/PinGrid';
import PinDetail from './components/PinDetail';
import { Pin } from './types';
import { supabase } from './lib/supabaseClient';
import type { Session } from '@supabase/supabase-js';
import Auth from './components/Auth';
import CreatePinPage from './components/CreatePinPage';

const SearchBar: React.FC = () => {
  return (
    <div className="relative w-full mb-8">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
        </svg>
      </div>
      <input
        type="text"
        placeholder="Buscar..."
        className="w-full bg-gray-200 border border-transparent rounded-full py-3 pl-12 pr-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
      />
    </div>
  );
};

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [pins, setPins] = useState<Pin[]>([]);
  const [loading, setLoading] = useState(true);
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const getSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchPins = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('pins')
        .select('id, title, image_url, user_id, description, hashtags')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching pins:', error);
      } else if (data) {
        const formattedPins: Pin[] = data.map(pin => ({
            id: pin.id,
            title: pin.title || '',
            imageUrl: pin.image_url,
            user_id: pin.user_id,
            description: pin.description,
            hashtags: pin.hashtags,
        }));
        setPins(formattedPins);
      }
      setLoading(false);
    };

    if (session) {
      fetchPins();
    }
  }, [session]);

  const renderContent = () => {
    if (loading) {
      return <div className="text-center">Cargando...</div>;
    }
    
    if (!session) {
      return <Auth />;
    }

    const pinIdMatch = path.match(/^\/pin\/(\d+)/);
    if (path === '/crear') {
      return <CreatePinPage session={session} />;
    }
    
    if (pinIdMatch) {
      const pinId = pinIdMatch[1];
      return <PinDetail pinId={pinId} allPins={pins} />;
    }

    // Default to home page
    return (
      <>
        <SearchBar />
        <PinGrid pins={pins} />
      </>
    );
  };
  
  const isDetailPage = /^\/pin\/\d+/.test(path);
  const isCreatePage = path === '/crear';

  return (
    <div className={`min-h-screen ${isCreatePage || isDetailPage ? 'bg-gray-100' : 'bg-white'}`}>
      <Sidebar />
      <main className={`ml-20 ${isCreatePage ? '' : 'p-4 md:p-8'}`}>
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
