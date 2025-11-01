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

// Share Popover Icons
const LinkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>;
const WhatsAppIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-8 w-8 text-green-500" fill="currentColor"><path d="M16.6 14.2c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.6.7-.8.9-.1.1-.3.2-.5.1-.2-.1-.9-.3-1.8-1.1-.7-.6-1.1-1.4-1.3-1.6-.1-.2 0-.4.1-.5.1-.1.2-.2.4-.4.1-.1.2-.2.2-.4.1-.1.1-.3 0-.4-.1-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.5-.4h-.4c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9 0 1.1.8 2.2 1 2.4.1.1 1.5.7 3.6 1.6.5.2.9.4 1.2.5.5.2.9.1 1.2-.1.4-.2.6-.7.8-.9.1-.1.1-.3 0-.4-0.1-0.1-0.2-0.2-0.4-0.3zM12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18.2c-4.5 0-8.2-3.7-8.2-8.2S7.5 3.8 12 3.8s8.2 3.7 8.2 8.2-3.7 8.2-8.2 8.2z"/></svg>;
const MessengerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-8 w-8 text-blue-600" fill="currentColor"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm3.2 9.7l-1.8 3.1c-.2.3-.5.5-.9.5s-.7-.2-.9-.5L10 12.1l-2.2 1.3c-.3.2-.7.1-1-.1-.3-.2-.4-.6-.2-1l1.8-3.1c.2-.3.5-.5.9-.5s.7.2.9.5l1.6 2.7 2.2-1.3c.3-.2.7-.1 1 .1.3.2.4.6.2 1z"/></svg>;
const FacebookIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-8 w-8 text-blue-700" fill="currentColor"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm2.7 9.8h-1.4v6.1h-2.5V11.8H9.3v-2.1h1.5V8.2c0-1.2.6-2.2 2.2-2.2h1.6v2.1h-1c-.4 0-.5.2-.5.5v1.1h1.5l-.2 2.1z"/></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.3 13.9l-4.6-5.4 3.8-4.4h-3.2L9.6 9.8 7 4.1H5.6l4.7 5.5-3.9 4.3h3.2l2.7-3.2 2.9 3.2h1.4z"/></svg>;
const SearchIcon = () => <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>;

interface Author {
    username: string;
    avatar_url: string;
    followers: number;
}
interface PinDetailProps {
    pin: Pin;
    relatedPins: Pin[];
    onClose: () => void;
    onPinClick: (pin: Pin) => void;
}

const PinDetail: React.FC<PinDetailProps> = ({ pin, relatedPins, onClose, onPinClick }) => {
    const [likes, setLikes] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [author, setAuthor] = useState<Author | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [showSharePopover, setShowSharePopover] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const shareButtonRef = useRef<HTMLDivElement>(null);

     useEffect(() => {
        const fetchPinData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setCurrentUser(user);

            // Fetch likes count
            const { count: likeCount, error: countError } = await supabase
                .from('pin_likes')
                .select('*', { count: 'exact', head: true })
                .eq('pin_id', pin.id);
            if (!countError) setLikes(likeCount ?? 0);

            // Check if current user has liked this pin
            if (user) {
                const { data: likeData, error: userLikeError } = await supabase
                    .from('pin_likes')
                    .select('id')
                    .eq('pin_id', pin.id)
                    .eq('user_id', user.id)
                    .single();
                setIsLiked(!!likeData);
            } else {
                setIsLiked(false);
            }
            
            // Fetch author
            const { data: authorData } = await supabase
                .from('profiles')
                .select('username, avatar_url')
                .eq('id', pin.user_id)
                .single();
            
            setAuthor({
                username: authorData?.username || 'Usuario Anónimo',
                avatar_url: authorData?.avatar_url || `https://i.pravatar.cc/40?u=${pin.user_id}`,
                followers: Math.floor(Math.random() * 5000) // Placeholder
            });

            // Fetch comments
             const { data: commentsData } = await supabase
                .from('comments')
                .select(`id, text, profiles(username, avatar_url)`)
                .eq('pin_id', pin.id)
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
        };

        if (pin) {
            fetchPinData();
        }
    }, [pin]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (showSharePopover && shareButtonRef.current && !shareButtonRef.current.contains(event.target as Node)) {
                setShowSharePopover(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showSharePopover]);

    const handleLike = async () => {
        if (!currentUser) {
            alert('Debes iniciar sesión para dar me gusta.');
            return;
        }

        if (isLiked) {
            const { error } = await supabase
                .from('pin_likes')
                .delete()
                .match({ pin_id: pin.id, user_id: currentUser.id });
            
            if (!error) {
                setIsLiked(false);
                setLikes(prev => prev - 1);
            }
        } else {
            const { error } = await supabase
                .from('pin_likes')
                .insert({ pin_id: pin.id, user_id: currentUser.id });
            
            if (!error) {
                setIsLiked(true);
                setLikes(prev => prev + 1);
            }
        }
    };

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !currentUser) return;
        
        const { data, error } = await supabase
            .from('comments')
            .insert({ text: newComment, pin_id: pin.id, user_id: currentUser.id })
            .select('id, text, profiles(username, avatar_url)')
            .single();

        if (error) {
            console.error('Error posting comment:', error);
            alert('No se pudo publicar el comentario.');
        } else if (data) {
            const formattedComment = {
                id: data.id,
                text: data.text,
                user: {
                    username: data.profiles?.username || 'Anónimo',
                    avatar_url: data.profiles?.avatar_url || `https://i.pravatar.cc/32`
                }
            };
            setComments(prev => [...prev, formattedComment]);
            setNewComment('');
        }
    };
    
    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
            alert('Enlace copiado al portapapeles');
            setShowSharePopover(false);
        });
    };

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

                <div className="bg-white shadow-xl rounded-3xl mx-auto my-8 max-w-4xl flex flex-col">
                    {/* Image Section */}
                    <div className="relative group">
                        <img src={pin.imageUrl} alt={pin.title} className="w-full h-auto object-contain rounded-t-3xl" />
                         <div className="absolute bottom-4 right-4 flex space-x-2">
                            <button className="bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors">
                                <ZoomIcon/>
                            </button>
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="p-6 sm:p-8 flex-grow">
                        <div className="flex items-center justify-between mb-4">
                            <div ref={shareButtonRef} className="relative flex items-center space-x-2 text-gray-700">
                                <button onClick={handleLike} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                                    <HeartIcon filled={isLiked} />
                                </button>
                                <span className="font-bold text-lg">{likes}</span>
                                <button onClick={() => setShowSharePopover(p => !p)} className="p-2 rounded-full hover:bg-gray-100"><ShareIcon /></button>
                                <button className="p-2 rounded-full hover:bg-gray-100"><MoreIcon /></button>
                                {showSharePopover && (
                                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-lg p-4 w-72 z-20 border">
                                        <p className="font-semibold text-center mb-3">Compartir</p>
                                        <div className="flex justify-around mb-4">
                                            <button onClick={handleCopyLink} className="flex flex-col items-center text-xs space-y-1"><span className="p-3 bg-gray-200 rounded-full"><LinkIcon /></span><span>Copiar enlace</span></button>
                                            <a href="#" className="flex flex-col items-center text-xs space-y-1"><WhatsAppIcon /><span>WhatsApp</span></a>
                                            <a href="#" className="flex flex-col items-center text-xs space-y-1"><MessengerIcon /><span>Messenger</span></a>
                                        </div>
                                         <div className="flex justify-around mb-4">
                                            <a href="#" className="flex flex-col items-center text-xs space-y-1"><FacebookIcon /><span>Facebook</span></a>
                                            <a href="#" className="flex flex-col items-center text-xs space-y-1"><XIcon /><span>X</span></a>
                                        </div>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><SearchIcon /></div>
                                            <input type="text" placeholder="Buscar por nombre o correo" className="w-full bg-gray-100 rounded-full border-none py-2 pl-10 pr-4" />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <button className="bg-red-600 text-white font-bold px-4 py-3 rounded-full hover:bg-red-700 transition-colors">
                                Guardar
                            </button>
                        </div>
                        
                        <h1 className="text-3xl font-bold mb-2">{pin.title}</h1>
                        {pin.description && <p className="text-gray-600 mb-6">{pin.description}</p>}

                        {author && (
                            <div className="flex items-center mb-6">
                            <img src={author.avatar_url} alt={author.username} className="w-10 h-10 rounded-full mr-3" />
                            <div>
                                <p className="font-semibold">{author.username}</p>
                                <p className="text-sm text-gray-500">{author.followers} seguidores</p>
                            </div>
                            <button className="ml-auto bg-gray-200 font-semibold px-4 py-2 rounded-full hover:bg-gray-300">
                                Seguir
                            </button>
                            </div>
                        )}
                        
                        <div className="border-t pt-4 mt-4">
                        <h2 className="font-semibold text-lg mb-4">Comentarios</h2>
                        <div className="space-y-4 mb-4 max-h-60 overflow-y-auto">
                        {comments.map(comment => (
                            <div key={comment.id} className="flex items-start">
                                <img src={comment.user.avatar_url} alt={comment.user.username} className="w-8 h-8 rounded-full mr-3 mt-1" />
                                <div className="flex-1">
                                    <p><span className="font-semibold">{comment.user.username}</span> {comment.text}</p>
                                </div>
                            </div>
                        ))}
                        {comments.length === 0 && <p className="text-sm text-gray-500">Todavía no hay comentarios. ¡Añade uno!</p>}
                        </div>
                        {currentUser && (
                            <form onSubmit={handleCommentSubmit} className="flex items-center mt-4">
                                <img src={currentUser.user_metadata.avatar_url || `https://i.pravatar.cc/32?u=${currentUser.id}`} alt="Tu avatar" className="w-8 h-8 rounded-full mr-3" />
                                <input 
                                    type="text" 
                                    placeholder="Agregar un comentario" 
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    className="w-full bg-gray-100 rounded-full border-none py-2 px-4 focus:ring-2 focus:ring-red-500" />
                                <button type="submit" disabled={!newComment.trim()} className="ml-2 text-sm bg-red-600 text-white font-semibold py-2 px-4 rounded-full disabled:bg-gray-300 transition-colors">
                                    Publicar
                                </button>
                            </form>
                        )}
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
