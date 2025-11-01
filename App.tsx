import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import { Pin } from './types';

const initialPins: Pin[] = [];

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
       <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 rounded-lg flex items-center justify-center">
        <p className="text-white text-lg font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4 text-center">{pin.title}</p>
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
  const [pins, setPins] = useState<Pin[]>(initialPins);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const newPin: Pin = {
        id: new Date().toISOString(),
        imageUrl: URL.createObjectURL(file),
        title: file.name,
      };
      setPins(prevPins => [newPin, ...prevPins]);
      // Reset file input value to allow uploading the same file again
      event.target.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Sidebar onImageUpload={handleImageUpload} />
      <main className="ml-20 lg:ml-64 p-4 md:p-8 transition-all duration-300">
        <SearchBar />
        <PinGrid pins={pins} />
      </main>
    </div>
  );
};

export default App;