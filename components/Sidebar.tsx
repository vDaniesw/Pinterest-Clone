
import React, { useRef } from 'react';

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const CategoryIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
);

const AddIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);

const BellIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const MessageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
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

  const navItems = [
    { name: 'Inicio', icon: <HomeIcon />, action: () => {} },
    { name: 'Categorias', icon: <CategoryIcon />, action: () => {} },
    { name: 'Crear o subir', icon: <AddIcon />, action: handleCreateClick },
    { name: 'Notificaciones', icon: <BellIcon />, action: () => {} },
    { name: 'Mensajes', icon: <MessageIcon />, action: () => {} },
  ];

  return (
    <>
      <aside className="fixed top-0 left-0 h-screen w-20 lg:w-64 bg-white border-r border-gray-200 flex flex-col transition-all duration-300 z-10">
        <div className="flex items-center justify-center lg:justify-start h-20 px-6">
           <svg className="h-8 w-8 text-red-500" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12.017 2C6.486 2 2 6.486 2 12s4.486 10 10.017 10S22 17.514 22 12 17.548 2 12.017 2zM12 20c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/><path d="M12.5 6.092C11.625 6.092 11.083 7.237 11.083 8.5c0 1.958 1.583 3.5 1.583 3.5s.834.917.834 2.25v.5H10.25v-2.5s-2-1.083-2-3.75c0-2.342 1.342-4.158 3.5-4.158 2.158 0 3.166 1.5 3.166 2.917 0 .75-.333 1.333-.833 1.333-.417 0-.584-.5-.584-.917s.083-.917.083-.917c0-1.167-1.25-1.167-1.417-1.167z"/></svg>
           <span className="hidden lg:inline ml-2 text-xl font-bold">Pinboard</span>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={item.action}
              className="w-full flex items-center justify-center lg:justify-start space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-black transition-colors duration-200"
            >
              {item.icon}
              <span className="hidden lg:inline font-medium">{item.name}</span>
            </button>
          ))}
        </nav>
        <div className="p-4">
            <button className="w-full flex items-center justify-center lg:justify-start space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-black transition-colors duration-200">
                <SettingsIcon />
                <span className="hidden lg:inline font-medium">Configuracion</span>
            </button>
        </div>
      </aside>
      <input
        type="file"
        ref={fileInputRef}
        onChange={onImageUpload}
        className="hidden"
        accept="image/*"
      />
    </>
  );
};

export default Sidebar;
