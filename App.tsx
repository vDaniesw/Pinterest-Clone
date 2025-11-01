import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import { Pin } from './types';
import { supabase } from './lib/supabaseClient';
import type { Session } from '@supabase/supabase-js';
import Auth from './components/Auth';
import CreatePinModal, { PinData as CreatePinDataType } from './components/CreatePinModal';

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
        className="w-full bg-gray-100 border border-transparent rounded-full py-3 pl-12 pr-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
      />
    </div>
  );
};

interface PinItemProps {
  pin: Pin;
}

const PinItem: React.FC<PinItemProps> = ({ pin }) => {
  return (
    <div className="mb-4 break-inside-avoid group relative">
      <img src={pin.imageUrl} alt={pin.title} className="w-full rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300" />
       <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 rounded-lg flex flex-col items-center justify-center p-4">
        <p className="text-white text-lg font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">{pin.title}</p>
        {pin.description && <p className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-2 text-center">{pin.description}</p>}
        {pin.hashtags && <p className="text-gray-300 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-2 text-center">{pin.hashtags}</p>}
      </div>
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
            <p className="text-gray-500 mt-2">Usa el botón 'Crear o subir' para empezar.</p>
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
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

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

    if (session) {
      fetchPins();
    }
  }, [session]);


  const handleCreatePin = async (pinData: CreatePinDataType) => {
    if (!session?.user) {
        alert('Debes iniciar sesión para crear un pin.');
        return;
    }
    
    const file = pinData.image;
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${session.user.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('pins-images')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      alert('Error al subir la imagen.');
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('pins-images')
      .getPublicUrl(filePath);

    const newPinData = {
      user_id: session.user.id,
      title: pinData.title,
      description: pinData.description,
      hashtags: pinData.hashtags,
      image_url: publicUrl,
    };

    const { data: insertedPin, error: insertError } = await supabase
      .from('pins')
      .insert(newPinData)
      .select()
      .single();
    
    if (insertError) {
        console.error('Error saving pin:', insertError);
        alert('Error al guardar el pin.');
        // Consider deleting the uploaded image if the DB insert fails
    } else if (insertedPin) {
         const formattedNewPin: Pin = {
            id: insertedPin.id,
            title: insertedPin.title || '',
            imageUrl: insertedPin.image_url,
            user_id: insertedPin.user_id,
            description: insertedPin.description,
            hashtags: insertedPin.hashtags,
         };
        setPins(prevPins => [formattedNewPin, ...prevPins]);
    }
  };

  if (loading && !session) {
      return <div>Cargando...</div>
  }

  if (!session) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Sidebar onShowCreateModal={() => setCreateModalOpen(true)} />
      <main className="ml-20 p-4 md:p-8">
        <SearchBar />
        {loading ? <div>Cargando pins...</div> : <PinGrid pins={pins} />}
      </main>
       {isCreateModalOpen && (
        <CreatePinModal
            isOpen={isCreateModalOpen}
            onClose={() => setCreateModalOpen(false)}
            onSubmit={handleCreatePin}
        />
      )}
    </div>
  );
};

export default App;
