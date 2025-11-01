import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const Auth: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        alert(error.error_description || error.message);
      } else {
        alert('¡Revisa tu correo para verificar tu cuenta!');
        setIsSignUp(false); // Switch to login view after successful signup
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        alert(error.error_description || error.message);
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="flex justify-center mb-6">
          <svg className="h-10 w-10 text-red-600" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 512.883 512.883" xmlSpace="preserve">
            <path style={{fill: '#CB1F24'}} d="M256.441,0c-141.241,0-256,114.759-256,256c0,105.048,62.676,195.09,153.6,234.814 c-0.883-17.655,0-39.724,4.414-59.145c5.297-21.186,32.662-139.476,32.662-139.476s-7.945-16.772-7.945-40.607 c0-37.959,22.069-66.207,49.434-66.207c22.952,0,34.428,17.655,34.428,38.841c0,22.952-15.007,58.262-22.952,90.924 c-6.179,27.366,13.241,49.434,40.607,49.434c48.552,0,81.214-62.676,81.214-135.945c0-56.497-37.959-97.986-106.814-97.986 c-77.683,0-126.234,58.262-126.234,122.703c0,22.069,6.179,37.959,16.772,50.317c4.414,5.297,5.297,7.945,3.531,14.124 c-0.883,4.414-4.414,15.89-5.297,20.303c-1.766,6.179-7.062,8.828-13.241,6.179c-36.193-15.007-52.083-53.848-52.083-97.986 c0-72.386,60.91-159.779,182.731-159.779c97.986,0,162.428,70.621,162.428,146.538c0,100.634-55.614,175.669-137.71,175.669 c-27.366,0-53.848-15.007-62.676-31.779c0,0-15.007,59.145-17.655,70.621c-5.297,19.421-15.89,39.724-25.6,54.731 c22.952,7.062,47.669,10.593,72.386,10.593c141.241,0,256-114.759,256-256S397.683,0,256.441,0"/>
          </svg>
        </div>
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Bienvenido a Pinboard
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Encuentra nuevas ideas para probar
          </p>
        </div>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email-address" className="sr-only">Correo electrónico</label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none rounded-2xl relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="appearance-none rounded-2xl relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-full text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            disabled={loading}
          >
            {loading ? 'Cargando...' : (isSignUp ? 'Registrarse' : 'Iniciar Sesión')}
          </button>
        </form>
        <div className="mt-6 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="font-medium text-sm text-gray-600 hover:text-red-500"
          >
            {isSignUp ? '¿Ya tienes una cuenta? Inicia sesión' : '¿Aún no estás en Pinboard? Regístrate'}
          </button>
        </div>
        <p className="mt-8 text-center text-xs text-gray-500">
          Al continuar, aceptas las <a href="#" className="font-bold">Condiciones de servicio</a> de Pinboard y reconoces que has leído nuestra <a href="#" className="font-bold">Política de privacidad</a>.
        </p>
      </div>
    </div>
  );
};

export default Auth;