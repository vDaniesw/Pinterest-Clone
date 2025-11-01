import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
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

interface PinItemProps {
  pin: Pin;
}

const ShareIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);


const PinItem: React.FC<PinItemProps> = ({ pin }) => {
  return (
    <div className="mb-4 break-inside-avoid">
        <div className="group relative cursor-pointer">
            <img src={pin.imageUrl} alt={pin.title} className="w-full rounded-2xl shadow-md" />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 rounded-2xl p-3 flex flex-col justify-between opacity-0 group-hover:opacity-100">
                <div className="flex justify-end">
                    <button className="bg-red-600 text-white font-bold px-4 py-2 rounded-full hover:bg-red-700 transition-colors text-base">
                        Guardar
                    </button>
                </div>
                <div className="flex justify-end">
                    <button 
                      aria-label="Compartir Pin"
                      className="bg-white w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors shadow-md">
                        <ShareIcon />
                    </button>
                </div>
            </div>
        </div>
      <p className="text-sm font-semibold mt-2 px-1 truncate">{pin.title}</p>
    </div>
  );
};


interface PinGridProps {
  pins: Pin[];
}

const PinGrid: React.FC<PinGridProps> = ({ pins }) => {
  if (pins.length === 0) {
    return (
        <div className="text-center py-20">
            <h2 className="text-2xl font-semibold text-gray-700">No hay pins para mostrar</h2>
            <p className="text-gray-500 mt-2">Usa el botón 'Crear' para empezar.</p>
        </div>
    );
  }

  return (
    <div className="w-full mx-auto" style={{ columnGap: '1rem', columns: '200px' }}>
      {pins.map((pin) => (
        <PinItem key={pin.id} pin={pin} />
      ))}
    </div>
  );
};

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [pins, setPins] = useState<Pin[]>([]);
  const [loading, setLoading] = useState(true);
  const path = window.location.pathname;


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
      if (session?.user) {
        setLoading(true);
        const { data, error } = await supabase
          .from('pins')
          .select('id, title, image_url, user_id, description, hashtags')
          .eq('user_id', session.user.id)
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
      }
    };

    if (session && path === '/') {
      fetchPins();
    } else if (path !== '/') {
        setLoading(false);
    }
  }, [session, path]);


  if (loading && !session && path !== '/crear') {
      return <div className="flex items-center justify-center h-screen">Cargando...</div>
  }

  if (!session) {
    return <Auth />;
  }
  
  const isCreatePage = path === '/crear';

  return (
    <div className={`min-h-screen ${isCreatePage ? 'bg-gray-100' : 'bg-white'}`}>
      <Sidebar />
      <main className={`ml-20 ${isCreatePage ? '' : 'p-4 md:p-8'}`}>
        {isCreatePage ? (
            <CreatePinPage session={session} />
        ) : (
            <>
                <SearchBar />
                {loading ? <div className="text-center">Cargando pins...</div> : <PinGrid pins={pins} />}
            </>
        )}
      </main>
    </div>
  );
};

export default App;