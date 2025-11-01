import React, { useRef } from 'react';
import { supabase } from '../lib/supabaseClient';

const HomeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.0007 2.62842L3.00073 10.4037V21.0002H10.0007V15.0002H14.0007V21.0002H21.0007V10.4037L12.0007 2.62842Z"></path>
    </svg>
);

const CategoryIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8l-2 4 2 4 2-4-2-4z" />
        <circle cx="12" cy="12" r="1" fill="currentColor" strokeWidth="0.5"/>
    </svg>
);

const AddIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-3 -3v6m6 6H6a2 2 0 01-2-2V6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2z" />
    </svg>
);

const BellIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const MessageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);


interface SidebarProps {
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onImageUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreateClick = () => {
    fileInputRef.current?.click();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const navItems = [
    { name: 'Inicio', icon: <HomeIcon />, action: () => {} },
    { name: 'Categorias', icon: <CategoryIcon />, action: () => {} },
    { name: 'Crear o subir', icon: <AddIcon />, action: handleCreateClick },
    { name: 'Notificaciones', icon: <BellIcon />, action: () => {} },
    { name: 'Mensajes', icon: <MessageIcon />, action: () => {} },
  ];

  return (
    <>
      <aside className="fixed top-0 left-0 h-screen w-20 bg-white border-r border-gray-200 flex flex-col z-10">
        <div className="flex items-center justify-center h-20 px-4">
            <svg className="h-8 w-8" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 512.883 512.883" xmlSpace="preserve">
                <path style={{fill: '#CB1F24'}} d="M256.441,0c-141.241,0-256,114.759-256,256c0,105.048,62.676,195.09,153.6,234.814	c-0.883-17.655,0-39.724,4.414-59.145c5.297-21.186,32.662-139.476,32.662-139.476s-7.945-16.772-7.945-40.607	c0-37.959,22.069-66.207,49.434-66.207c22.952,0,34.428,17.655,34.428,38.841c0,22.952-15.007,58.262-22.952,90.924	c-6.179,27.366,13.241,49.434,40.607,49.434c48.552,0,81.214-62.676,81.214-135.945c0-56.497-37.959-97.986-106.814-97.986	c-77.683,0-126.234,58.262-126.234,122.703c0,22.069,6.179,37.959,16.772,50.317c4.414,5.297,5.297,7.945,3.531,14.124	c-0.883,4.414-4.414,15.89-5.297,20.303c-1.766,6.179-7.062,8.828-13.241,6.179c-36.193-15.007-52.083-53.848-52.083-97.986	c0-72.386,60.91-159.779,182.731-159.779c97.986,0,162.428,70.621,162.428,146.538c0,100.634-55.614,175.669-137.71,175.669	c-27.366,0-53.848-15.007-62.676-31.779c0,0-15.007,59.145-17.655,70.621c-5.297,19.421-15.89,39.724-25.6,54.731	c22.952,7.062,47.669,10.593,72.386,10.593c141.241,0,256-114.759,256-256S397.683,0,256.441,0"/>
            </svg>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-2">
          {navItems.map((item, index) => (
            <button
              key={item.name}
              onClick={item.action}
              aria-label={item.name}
              className={`w-full flex items-center justify-center p-3 rounded-2xl transition-colors duration-200 ${
                index === 0 ? 'text-black bg-gray-200' : 'text-gray-500 hover:bg-gray-100 hover:text-black'
              }`}
            >
              {item.icon}
            </button>
          ))}
        </nav>
        <div className="p-4">
            <button 
              aria-label="Configuracion" 
              onClick={handleLogout}
              className="w-full flex items-center justify-center p-3 rounded-2xl text-gray-500 hover:bg-gray-100 hover:text-black transition-colors duration-200">
                <SettingsIcon />
            </button>
        </div>
      </aside>
      <input
        type="file"
        ref={fileInputRef}
        onChange={onImageUpload}
        className="hidden"
        accept="image/*"
        multiple={false}
      />
    </>
  );
};

export default Sidebar;
