import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import PinGrid from './components/PinGrid';
import PinDetail from './components/PinDetail';
import { Pin, Comment } from './types';
import { supabase } from './lib/supabaseClient';
import type { Session, User } from '@supabase/supabase-js';
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

interface Author {
    username: string;
    avatar_url: string;
}

interface PinDetailData {
    pin: Pin;
    author: Author;
    comments: Comment[];
    likes: number;
    isLiked: boolean;
}

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [pins, setPins] = useState<Pin[]>([]);
  const [loading, setLoading] = useState(true);
  const [path, setPath] = useState(window.location.pathname);
  
  // Cache for pin details
  const [pinCache, setPinCache] = useState<Map<string, PinDetailData>>(new Map());
  const [activePinData, setActivePinData] = useState<PinDetailData | null>(null);
  const [detailLoading, setDetailLoading] = useState(true);

  useEffect(() => {
    // This effect handles all client-side routing logic
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');

      if (
        !anchor ||
        anchor.target === '_blank' ||
        anchor.hasAttribute('download') ||
        anchor.getAttribute('rel') === 'external' ||
        e.metaKey || e.ctrlKey || e.shiftKey || e.altKey
      ) {
        return;
      }
      
      const href = anchor.getAttribute('href');
      if (href && (href.startsWith('/') || href.startsWith(window.location.origin))) {
        e.preventDefault();
        const url = new URL(href, window.location.origin);
        if (url.pathname !== window.location.pathname) {
            window.history.pushState({}, '', href);
            setPath(url.pathname);
        }
      }
    };

    const handlePopState = () => {
      setPath(window.location.pathname);
    };

    const handleNavigateEvent = (e: Event) => {
      const { detail: newPath } = (e as CustomEvent<string>);
      if (newPath) {
        window.history.pushState({}, '', newPath);
        setPath(newPath);
      }
    };

    document.addEventListener('click', handleLinkClick);
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('navigate', handleNavigateEvent);

    return () => {
      document.removeEventListener('click', handleLinkClick);
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('navigate', handleNavigateEvent);
    };
  }, []);

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
      setLoading(true);
      const { data, error } = await supabase
        .from('pins')
        .select('id, title, image_url, user_id, description, hashtags')
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
    };

    if (session) {
      fetchPins();
    }
  }, [session]);

  const getPinDetails = useCallback(async (pinId: string, user: User | null) => {
      if (pinCache.has(pinId)) {
          setActivePinData(pinCache.get(pinId)!);
          setDetailLoading(false);
          return;
      }

      setDetailLoading(true);

      const { data: pinData, error: pinError } = await supabase.from('pins').select('*').eq('id', pinId).single();
      if (pinError || !pinData) {
          console.error('Error fetching pin:', pinError);
          setDetailLoading(false);
          return;
      }
      
      const { count: likeCount } = await supabase.from('pin_likes').select('*', { count: 'exact', head: true }).eq('pin_id', pinId);
      let isLiked = false;
      if (user) {
          const { data: likeData } = await supabase.from('pin_likes').select('id').eq('pin_id', pinId).eq('user_id', user.id).single();
          isLiked = !!likeData;
      }
      
      const { data: authorData } = await supabase.from('profiles').select('username, avatar_url').eq('id', pinData.user_id).single();
      const { data: commentsData } = await supabase.from('comments').select(`id, text, profiles(username, avatar_url)`).eq('pin_id', pinId).order('created_at', { ascending: true });

      const detailData: PinDetailData = {
          pin: { id: pinData.id, title: pinData.title || '', imageUrl: pinData.image_url, user_id: pinData.user_id, description: pinData.description, hashtags: pinData.hashtags },
          author: { username: authorData?.username || 'Usuario Anónimo', avatar_url: authorData?.avatar_url || `https://i.pravatar.cc/40?u=${pinData.user_id}` },
          comments: commentsData?.map((c: any) => ({ id: c.id, text: c.text, user: { username: c.profiles?.username || 'Anónimo', avatar_url: c.profiles?.avatar_url || `https://i.pravatar.cc/32` } })) || [],
          likes: likeCount ?? 0,
          isLiked: isLiked,
      };
      
      setPinCache(prevCache => new Map(prevCache).set(pinId, detailData));
      setActivePinData(detailData);
      setDetailLoading(false);
  }, [pinCache]);


  const handleLike = async (pinId: string) => {
    if (!session?.user) return;
    const currentPinData = pinCache.get(pinId);
    if (!currentPinData) return;

    let newLikedState = !currentPinData.isLiked;
    let newLikesCount = newLikedState ? currentPinData.likes + 1 : currentPinData.likes - 1;

    // Optimistic UI update
    const updatedData = { ...currentPinData, isLiked: newLikedState, likes: newLikesCount };
    setPinCache(prev => new Map(prev).set(pinId, updatedData));
    setActivePinData(updatedData);

    if (newLikedState) {
        await supabase.from('pin_likes').insert({ pin_id: pinId, user_id: session.user.id });
    } else {
        await supabase.from('pin_likes').delete().match({ pin_id: pinId, user_id: session.user.id });
    }
  };

  const handleCommentSubmit = async (pinId: string, text: string) => {
      if (!text.trim() || !session?.user) return null;
      
      const { data, error } = await supabase.from('comments').insert({ text: text, pin_id: pinId, user_id: session.user.id }).select('id, text, profiles(username, avatar_url)').single();
      if (error) {
          return null;
      }
      
      const newComment: Comment = {id: data.id, text: data.text, user: { username: data.profiles?.username || 'Anónimo', avatar_url: data.profiles?.avatar_url || `https://i.pravatar.cc/32` }};
      
      const currentPinData = pinCache.get(pinId);
      if (currentPinData) {
          const updatedData = { ...currentPinData, comments: [...currentPinData.comments, newComment] };
          setPinCache(prev => new Map(prev).set(pinId, updatedData));
          setActivePinData(updatedData);
      }
      return newComment;
  };


  const renderContent = () => {
    if (loading) {
      return <div className="text-center">Cargando...</div>;
    }
    
    if (!session) {
      return <Auth />;
    }

    const pinIdMatch = path.match(/^\/pin\/(\d+)/);
    
    if (path === '/crear') {
      return <CreatePinPage session={session} />;
    }
    
    if (pinIdMatch) {
      const pinId = pinIdMatch[1];
      return <PinDetail pinId={pinId} allPins={pins} getPinDetails={getPinDetails} activePinData={activePinData} detailLoading={detailLoading} currentUser={session.user} onLike={handleLike} onCommentSubmit={handleCommentSubmit} />;
    }

    // Default to home page
    return (
      <>
        <SearchBar />
        <PinGrid pins={pins} />
      </>
    );
  };
  
  const isCreatePage = path === '/crear';

  return (
    <div className={`min-h-screen ${isCreatePage ? 'bg-gray-100' : 'bg-white'}`}>
      <Sidebar path={path} />
      <main className={`ml-20 ${isCreatePage ? '' : 'p-4 md:p-8'}`}>
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
