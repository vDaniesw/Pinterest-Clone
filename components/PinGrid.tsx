import React from 'react';
import { Pin } from '../types';

const ShareIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

interface PinItemProps {
  pin: Pin;
}

const PinItem: React.FC<PinItemProps> = ({ pin }) => {
  return (
    <a href={`/pin/${pin.id}`} className="mb-4 break-inside-avoid block cursor-pointer">
        <div className="group relative">
            <img src={pin.imageUrl} alt={pin.title} className="w-full rounded-2xl shadow-md" />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 rounded-2xl p-3 flex flex-col justify-between opacity-0 group-hover:opacity-100">
                <div className="flex justify-end">
                    <button className="bg-red-600 text-white font-bold px-4 py-2 rounded-full hover:bg-red-700 transition-colors text-base" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                        Guardar
                    </button>
                </div>
                <div className="flex justify-end">
                    <button 
                      aria-label="Compartir Pin"
                      className="bg-white w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors shadow-md" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                        <ShareIcon />
                    </button>
                </div>
            </div>
        </div>
      <p className="text-sm font-semibold mt-2 px-1 truncate">{pin.title}</p>
    </a>
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

export default PinGrid;
