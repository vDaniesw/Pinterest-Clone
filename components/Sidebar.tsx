import React from 'react';
import { supabase } from '../lib/supabaseClient';

const HomeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4.6 22.73A107 107 0 0 0 11 23h2.22c2.43-.04 4.6-.16 6.18-.27A3.9 3.9 0 0 0 23 18.8v-8.46a4 4 0 0 0-1.34-3L14.4.93a3.63 3.63 0 0 0-4.82 0L2.34 7.36A4 4 0 0 0 1 10.35v8.46a3.9 3.9 0 0 0 3.6 3.92M13.08 2.4l7.25 6.44a2 2 0 0 1 .67 1.5v8.46a1.9 1.9 0 0 1-1.74 1.92q-1.39.11-3.26.19V16a4 4 0 0 0-8 0v4.92q-1.87-.08-3.26-.19A1.9 1.9 0 0 1 3 18.81v-8.46a2 2 0 0 1 .67-1.5l7.25-6.44a1.63 1.63 0 0 1 2.16 0M13.12 21h-2.24a1 1 0 0 1-.88-1v-4a2 2 0 1 1 4 0v4a1 1 0 0 1-.88 1"></path>
    </svg>
);

const CategoryIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4M9.42 7.24a3 3 0 0 0-2.18 2.18L5.7 15.57a2.25 2.25 0 0 0 2.73 2.73l6.15-1.54a3 3 0 0 0 2.18-2.18l1.54-6.15a2.25 2.25 0 0 0-2.73-2.73zm6.94.7-1.54 6.15a1 1 0 0 1-.73.73l-6.15 1.54a.25.25 0 0 1-.3-.3L9.18 9.9a1 1 0 0 1 .73-.73l6.15-1.54a.25.25 0 0 1 .3.3M12 24a12 12 0 1 0 0-24 12 12 0 0 0 0 24M2 12a10 10 0 1 1 20 0 10 10 0 0 1-20 0"></path>
    </svg>
);

const AddIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11 11H6v2h5v5h2v-5h5v-2h-5V6h-2zM5 1a4 4 0 0 0-4 4v14a4 4 0 0 0 4 4h14a4 4 0 0 0 4-4V5a4 4 0 0 0-4-4zm16 4v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h14a2 2 0 0 1 2 2"></path>
    </svg>
);

const BellIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 19h8v-2h-.34a3.15 3.15 0 0 1-3.12-2.76l-.8-6.41a7.8 7.8 0 0 0-15.48 0l-.8 6.41A3.15 3.15 0 0 1 .34 17H0v2h8v1h.02a3.4 3.4 0 0 0 3.38 3h1.2a3.4 3.4 0 0 0 3.38-3H16zm1.75-10.92.8 6.4c.12.95.5 1.81 1.04 2.52H4.4c.55-.7.92-1.57 1.04-2.51l.8-6.41a5.8 5.8 0 0 1 11.5 0M13.4 19c.33 0 .6.27.6.6 0 .77-.63 1.4-1.4 1.4h-1.2a1.4 1.4 0 0 1-1.4-1.4c0-.33.27-.6.6-.6z"></path>
  </svg>
);

const MessageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
    <path d="M7 10.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m5 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3m5 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3m-5 10c1.8 0 3.5-.41 5-1.15l3.69.65A2 2 0 0 0 23 20.7l-.65-3.7A11.5 11.5 0 1 0 12 23.5m8.55-7.36-.28.58.76 4.31-4.31-.76-.58.28q-1.89.93-4.14.95a9.5 9.5 0 1 1 8.55-5.36"></path>
  </svg>
);

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10m3 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0m1.13-10.29A2 2 0 0 0 14.7.31a12 12 0 0 0-5.4 0c-.73.17-1.26.74-1.43 1.4l-.58 2.14-2.14-.57a2 2 0 0 0-1.93.54 12 12 0 0 0-2.7 4.67c-.22.72.01 1.46.5 1.95L2.59 12l-1.57 1.56a2 2 0 0 0-.5 1.95 12 12 0 0 0 2.7 4.68c.51.54 1.27.72 1.93.54l2.14-.58.58 2.14c.17.67.7 1.24 1.43 1.4a12 12 0 0 0 5.4 0 2 2 0 0 0 1.43-1.4l.58-2.14 2.13.58c.67.18 1.43 0 1.94-.55a12 12 0 0 0 2.7-4.67 2 2 0 0 0-.5-1.94L21.4 12l1.57-1.56c.49-.5.71-1.23.5-1.95a12 12 0 0 0-2.7-4.67 2 2 0 0 0-1.93-.54l-2.14.57zm-6.34.54a10 10 0 0 1 4.42 0l.56 2.12a2 2 0 0 0 2.45 1.41l2.13-.57a10 10 0 0 1 2.2 3.83L20 10.59a2 2 0 0 0 0 2.83l1.55 1.55a10 10 0 0 1-2.2 3.82l-2.13-.57a2 2 0 0 0-2.44 1.42l-.57 2.12a10 10 0 0 1-4.42 0l-.57-2.12a2 2 0 0 0-2.45-1.42l-2.12.57a10 10 0 0 1-2.2-3.82L4 13.42a2 2 0 0 0 0-2.83L2.45 9.03a10 10 0 0 1 2.2-3.82l2.13.57a2 2 0 0 0 2.44-1.41z"></path>
  </svg>
);


const Sidebar: React.FC<{ path: string }> = ({ path }) => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const navItems = [
    { name: 'Inicio', icon: <HomeIcon />, href: '/', path: '/' },
    { name: 'Categorias', icon: <CategoryIcon />, href: '#', path: '/categorias' },
    { name: 'Crear o subir', icon: <AddIcon />, href: '/crear', path: '/crear' },
    { name: 'Notificaciones', icon: <BellIcon />, href: '#', path: '/notificaciones' },
    { name: 'Mensajes', icon: <MessageIcon />, href: '#', path: '/mensajes' },
  ];

  return (
    <aside className="fixed top-0 left-0 h-screen w-20 bg-white border-r border-gray-200 flex flex-col z-10">
      <div className="flex items-center justify-center h-20 px-4">
          <svg className="h-8 w-8" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 512.883 512.883" xmlSpace="preserve">
              <path style={{fill: '#CB1F24'}} d="M256.441,0c-141.241,0-256,114.759-256,256c0,105.048,62.676,195.09,153.6,234.814	c-0.883-17.655,0-39.724,4.414-59.145c5.297-21.186,32.662-139.476,32.662-139.476s-7.945-16.772-7.945-40.607	c0-37.959,22.069-66.207,49.434-66.207c22.952,0,34.428,17.655,34.428,38.841c0,22.952-15.007,58.262-22.952,90.924	c-6.179,27.366,13.241,49.434,40.607,49.434c48.552,0,81.214-62.676,81.214-135.945c0-56.497-37.959-97.986-106.814-97.986	c-77.683,0-126.234,58.262-126.234,122.703c0,22.069,6.179,37.959,16.772,50.317c4.414,5.297,5.297,7.945,3.531,14.124	c-0.883,4.414-4.414,15.89-5.297,20.303c-1.766,6.179-7.062,8.828-13.241,6.179c-36.193-15.007-52.083-53.848-52.083-97.986	c0-72.386,60.91-159.779,182.731-159.779c97.986,0,162.428,70.621,162.428,146.538c0,100.634-55.614,175.669-137.71,175.669	c-27.366,0-53.848-15.007-62.676-31.779c0,0-15.007,59.145-17.655,70.621c-5.297,19.421-15.89,39.724-25.6,54.731	c22.952,7.062,47.669,10.593,72.386,10.593c141.241,0,256-114.759,256-256S397.683,0,256.441,0"/>
          </svg>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-2">
        {navItems.map((item) => (
          <a
            key={item.name}
            href={item.href}
            onClick={item.href === '#' ? (e) => e.preventDefault() : undefined}
            aria-label={item.name}
            className={`w-full flex items-center justify-center p-3 rounded-2xl transition-colors duration-200 ${
              path === item.path ? 'text-black bg-gray-200' : 'text-black hover:bg-gray-100'
            }`}
          >
            {item.icon}
          </a>
        ))}
      </nav>
      <div className="p-4">
          <button 
            aria-label="Configuracion" 
            onClick={handleLogout}
            className="w-full flex items-center justify-center p-3 rounded-2xl text-black hover:bg-gray-100 transition-colors duration-200">
              <SettingsIcon />
          </button>
      </div>
    </aside>
  );
};

export default Sidebar;
