import React from 'react';
import { Pin } from '../types';
import PinGrid from './PinGrid';

// Icons
const ArrowLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
);

const HeartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
    </svg>
);

const ShareIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

const MoreIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 5c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 8c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 8c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z" />
    </svg>
);

const ZoomIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
    </svg>
);

interface PinDetailProps {
    pin: Pin;
    relatedPins: Pin[];
    onClose: () => void;
    onPinClick: (pin: Pin) => void;
}

const PinDetail: React.FC<PinDetailProps> = ({ pin, relatedPins, onClose, onPinClick }) => {
    return (
        <div className="w-full flex flex-col items-center">
            <div className="w-full max-w-6xl">
                <button
                    onClick={onClose}
                    className="fixed top-6 left-24 z-20 bg-white rounded-full p-2 shadow-md hover:bg-gray-200 transition-colors"
                    aria-label="Volver"
                >
                    <ArrowLeftIcon />
                </button>

                <div className="bg-white shadow-xl rounded-3xl mx-auto my-8 p-4 w-full grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Side: Image */}
                    <div className="relative group">
                        <img src={pin.imageUrl} alt={pin.title} className="w-full h-auto object-cover rounded-3xl" />
                        <div className="absolute bottom-4 right-4 flex space-x-2">
                            <button className="bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors">
                                <ZoomIcon/>
                            </button>
                        </div>
                    </div>

                    {/* Right Side: Details and Comments */}
                    <div className="flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                                <button className="p-2 rounded-full hover:bg-gray-100"><HeartIcon /></button>
                                <span className="font-semibold text-gray-700">835</span>
                                <button className="p-2 rounded-full hover:bg-gray-100"><ShareIcon /></button>
                                <button className="p-2 rounded-full hover:bg-gray-100"><MoreIcon /></button>
                            </div>
                            <button className="bg-red-600 text-white font-bold px-4 py-3 rounded-full hover:bg-red-700 transition-colors">
                                Guardar
                            </button>
                        </div>

                        <div className="flex-grow overflow-y-auto pr-2">
                             <h1 className="text-3xl font-bold mb-2">{pin.title}</h1>
                             <p className="text-gray-600 mb-6">{pin.description}</p>

                             <div className="flex items-center mb-6">
                                <img src="https://i.pravatar.cc/40" alt="Ecorino" className="w-10 h-10 rounded-full mr-3" />
                                <div>
                                    <p className="font-semibold">Ecorino</p>
                                    <p className="text-sm text-gray-500">1.2k seguidores</p>
                                </div>
                                <button className="ml-auto bg-gray-200 font-semibold px-4 py-2 rounded-full hover:bg-gray-300">
                                    Seguir
                                </button>
                             </div>
                             
                             <div className="border-t pt-4">
                                <h2 className="font-semibold text-lg mb-2">Comentarios</h2>
                                <div className="flex items-center mb-4">
                                     <img src="https://i.pravatar.cc/32?u=emma" alt="Emma" className="w-8 h-8 rounded-full mr-3" />
                                     <p><span className="font-semibold">Emma</span> Me encanta ❤️</p>
                                </div>
                                <div className="flex items-center">
                                    <img src="https://i.pravatar.cc/32?u=current_user" alt="Tu" className="w-8 h-8 rounded-full mr-3" />
                                    <input type="text" placeholder="Agregar un comentario" className="w-full bg-gray-100 rounded-full border-none py-2 px-4 focus:ring-red-500" />
                                </div>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {relatedPins.length > 0 && (
                <div className="w-full mt-8">
                    <h2 className="text-2xl font-bold text-center mb-6">Más para explorar</h2>
                    <PinGrid pins={relatedPins} onPinClick={onPinClick} />
                </div>
            )}
        </div>
    );
};

export default PinDetail;
