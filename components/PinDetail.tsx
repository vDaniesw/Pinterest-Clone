import React, { useState, useEffect, useRef } from 'react';
import { Pin, Comment } from '../types';
import PinGrid from './PinGrid';
import { supabase } from '../lib/supabaseClient';
import type { User } from '@supabase/supabase-js';

// Icons
const ArrowLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
);

const HeartIcon = ({ filled }: { filled: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-colors ${filled ? 'text-red-500' : 'text-gray-700'}`} fill={filled ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
    </svg>
);

const CommentIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
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

const ExpandIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1v4m0 0h-4m4 0l-5-5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5 5" /></svg>
);

const SearchLoopIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
);

interface Author {
    username: string;
    avatar_url: string;
    followers: number;
}
interface PinDetailProps {
    pinId: string;
    allPins: Pin[];
}

const PinDetail: React.FC<PinDetailProps> = ({ pinId, allPins }) => {
    const [pin, setPin] = useState<Pin | null>(null);
    const [likes, setLikes] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [author, setAuthor] = useState<Author | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const handleBack = () => {
        window.location.assign('/');
    }

     useEffect(() => {
        const fetchPinData = async () => {
            setLoading(true);
            const { data: pinData, error: pinError } = await supabase
                .from('pins')
                .select('*')
                .eq('id', pinId)
                .single();

            if (pinError || !pinData) {
                console.error('Error fetching pin:', pinError);
                setLoading(false);
                return;
            }
             const formattedPin: Pin = {
              id: pinData.id,
              title: pinData.title || '',
              imageUrl: pinData.image_url,
              user_id: pinData.user_id,
              description: pinData.description,
              hashtags: pinData.hashtags,
            };
            setPin(formattedPin);

            const { data: { user } } = await supabase.auth.getUser();
            setCurrentUser(user);

            // Fetch likes count
            const { count: likeCount } = await supabase
                .from('pin_likes')
                .select('*', { count: 'exact', head: true })
                .eq('pin_id', pinId);
            setLikes(likeCount ?? 0);

            // Check if current user has liked this pin
            if (user) {
                const { data: likeData } = await supabase
                    .from('pin_likes')
                    .select('id')
                    .eq('pin_id', pinId)
                    .eq('user_id', user.id)
                    .single();
                setIsLiked(!!likeData);
            }
            
            // Fetch author
            const { data: authorData } = await supabase
                .from('profiles')
                .select('username, avatar_url')
                .eq('id', pinData.user_id)
                .single();
            
            setAuthor({
                username: authorData?.username || 'Usuario Anónimo',
                avatar_url: authorData?.avatar_url || `https://i.pravatar.cc/40?u=${pinData.user_id}`,
                followers: Math.floor(Math.random() * 5000) // Placeholder
            });

            // Fetch comments
             const { data: commentsData } = await supabase
                .from('comments')
                .select(`id, text, profiles(username, avatar_url)`)
                .eq('pin_id', pinId)
                .order('created_at', { ascending: true });

            if (commentsData) {
                 const formattedComments = commentsData.map((c: any) => ({
                    id: c.id,
                    text: c.text,
                    user: {
                        username: c.profiles?.username || 'Anónimo',
                        avatar_url: c.profiles?.avatar_url || `https://i.pravatar.cc/32`
                    }
                }));
                setComments(formattedComments);
            }
            setLoading(false);
        };

        if (pinId) {
            fetchPinData();
        }
    }, [pinId]);

    const handleLike = async () => {
        if (!currentUser) return alert('Debes iniciar sesión para dar me gusta.');

        if (isLiked) {
            const { error } = await supabase.from('pin_likes').delete().match({ pin_id: pinId, user_id: currentUser.id });
            if (!error) { setIsLiked(false); setLikes(p => p - 1); }
        } else {
            const { error } = await supabase.from('pin_likes').insert({ pin_id: pinId, user_id: currentUser.id });
            if (!error) { setIsLiked(true); setLikes(p => p + 1); }
        }
    };

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !currentUser) return;
        
        const { data, error } = await supabase.from('comments').insert({ text: newComment, pin_id: pinId, user_id: currentUser.id }).select('id, text, profiles(username, avatar_url)').single();

        if (error) {
            alert('No se pudo publicar el comentario.');
        } else if (data) {
            const formattedComment = {id: data.id, text: data.text, user: { username: data.profiles?.username || 'Anónimo', avatar_url: data.profiles?.avatar_url || `https://i.pravatar.cc/32` }};
            setComments(prev => [...prev, formattedComment]);
            setNewComment('');
        }
    };

    const relatedPins = allPins.filter(p => p.id !== parseInt(pinId));
    
    if (loading) return <div className="text-center w-full py-20">Cargando pin...</div>;
    if (!pin) return <div className="text-center w-full py-20">Pin no encontrado.</div>;


    return (
        <div className="w-full">
            <button
                onClick={handleBack}
                className="fixed top-6 left-24 z-20 bg-white rounded-full p-2 shadow-md hover:bg-gray-200 transition-colors"
                aria-label="Volver"
            >
                <ArrowLeftIcon />
            </button>
            <div className="bg-white shadow-xl rounded-3xl mx-auto my-8 max-w-7xl flex flex-col md:flex-row">
                {/* Left Column: Image */}
                <div className="w-full md:w-1/2 flex-shrink-0">
                    <div className="relative group">
                        <img src={pin.imageUrl} alt={pin.title} className="w-full h-auto object-contain rounded-t-3xl md:rounded-l-3xl md:rounded-r-none" />
                        <div className="absolute bottom-4 right-4 flex space-x-2">
                             <button className="bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"><ExpandIcon/></button>
                            <button className="bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"><SearchLoopIcon/></button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Details */}
                <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2 text-gray-700">
                             <button onClick={handleLike} className="p-2 rounded-full hover:bg-gray-100 transition-colors flex items-center space-x-1">
                                <HeartIcon filled={isLiked} /> <span className="font-bold text-lg">{likes}</span>
                            </button>
                            <button className="p-2 rounded-full hover:bg-gray-100"><CommentIcon /></button>
                            <button className="p-2 rounded-full hover:bg-gray-100"><ShareIcon /></button>
                            <button className="p-2 rounded-full hover:bg-gray-100"><MoreIcon /></button>
                        </div>
                        <button className="bg-red-600 text-white font-bold px-4 py-3 rounded-full hover:bg-red-700 transition-colors">
                            Guardar
                        </button>
                    </div>
                    
                    <div className="overflow-y-auto flex-grow">
                        <h1 className="text-3xl font-bold mb-2">{pin.title}</h1>
                        {pin.description && <p className="text-gray-600 mb-6">{pin.description}</p>}

                        {author && (
                            <div className="flex items-center mb-6">
                            <img src={author.avatar_url} alt={author.username} className="w-12 h-12 rounded-full mr-4" />
                            <div>
                                <p className="font-semibold text-lg">{author.username}</p>
                                <p className="text-sm text-gray-500">{author.followers} seguidores</p>
                            </div>
                            <button className="ml-auto bg-gray-200 font-semibold px-4 py-2 rounded-full hover:bg-gray-300">
                                Seguir
                            </button>
                            </div>
                        )}
                        
                        <div className="border-t pt-4 mt-4">
                        <h2 className="font-semibold text-lg mb-4">Comentarios</h2>
                        <div className="space-y-4 mb-4 max-h-60 overflow-y-auto pr-2">
                        {comments.map(comment => (
                            <div key={comment.id} className="flex items-start">
                                <img src={comment.user.avatar_url} alt={comment.user.username} className="w-8 h-8 rounded-full mr-3 mt-1" />
                                <div className="flex-1 bg-gray-50 p-2 rounded-lg">
                                    <p><span className="font-semibold">{comment.user.username}</span> {comment.text}</p>
                                </div>
                            </div>
                        ))}
                        {comments.length === 0 && <p className="text-sm text-gray-500">Todavía no hay comentarios. ¡Añade uno!</p>}
                        </div>
                        {currentUser && (
                            <form onSubmit={handleCommentSubmit} className="flex items-center mt-4">
                                <img src={currentUser.user_metadata.avatar_url || `https://i.pravatar.cc/32?u=${currentUser.id}`} alt="Tu avatar" className="w-10 h-10 rounded-full mr-3" />
                                <input 
                                    type="text" 
                                    placeholder="Agregar un comentario" 
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    className="w-full bg-gray-100 rounded-full border-none py-3 px-4 focus:ring-2 focus:ring-red-500" />
                            </form>
                        )}
                        </div>
                    </div>
                </div>
            </div>
            
            {relatedPins.length > 0 && (
                <div className="w-full mt-12">
                    <h2 className="text-2xl font-bold text-center mb-6">Más para explorar</h2>
                    <PinGrid pins={relatedPins} />
                </div>
            )}
        </div>
    );
};

export default PinDetail;
