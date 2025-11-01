import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const Auth: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      alert(error.error_description || error.message);
    } else {
      alert('¡Has iniciado sesión!');
    }
    setLoading(false);
  };

  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      alert(error.error_description || error.message);
    } else {
      alert('¡Revisa tu correo para verificar tu cuenta!');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <svg className="mx-auto h-16 w-auto" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 512.883 512.883" xmlSpace="preserve">
              <path style={{fill: '#CB1F24'}} d="M256.441,0c-141.241,0-256,114.759-256,256c0,105.048,62.676,195.09,153.6,234.814 c-0.883-17.655,0-39.724,4.414-59.145c5.297-21.186,32.662-139.476,32.662-139.476s-7.945-16.772-7.945-40.607 c0-37.959,22.069-66.207,49.434-66.207c22.952,0,34.428,17.655,34.428,38.841c0,22.952-15.007,58.262-22.952,90.924 c-6.179,27.366,13.241,49.434,40.607,49.434c48.552,0,81.214-62.676,81.214-135.945c0-56.497-37.959-97.986-106.814-97.986 c-77.683,0-126.234,58.262-126.234,122.703c0,22.069,6.179,37.959,16.772,50.317c4.414,5.297,5.297,7.945,3.531,14.124 c-0.883,4.414-4.414,15.89-5.297,20.303c-1.766,6.179-7.062,8.828-13.241,6.179c-36.193-15.007-52.083-53.848-52.083-97.986 c0-72.386,60.91-159.779,182.731-159.779c97.986,0,162.428,70.621,162.428,146.538c0,100.634-55.614,175.669-137.71,175.669 c-27.366,0-53.848-15.007-62.676-31.779c0,0-15.007,59.145-17.655,70.621c-5.297,19.421-15.89,39.724-25.6,54.731 c22.952,7.062,47.669,10.593,72.386,10.593c141.241,0,256-114.759,256-256S397.683,0,256.441,0"/>
          </svg>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Inicia sesión o regístrate
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              disabled={loading}
            >
              {loading ? 'Cargando...' : 'Iniciar Sesión'}
            </button>
             <button
              type="button"
              onClick={handleSignUp}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              disabled={loading}
            >
              {loading ? 'Cargando...' : 'Registrarse'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;
