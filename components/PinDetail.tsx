import React, { useState, useEffect } from 'react';
import { Pin, Comment } from '../types';
import PinGrid from './PinGrid';
import type { User } from '@supabase/supabase-js';

// Icons
const ArrowLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
);

const HeartIcon = ({ filled }: { filled: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-colors ${filled ? 'text-red-500' : 'text-gray-700'}`} fill={filled ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={filled? 1 : 2}>
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

const ChevronDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
);

const EmojiIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4.082 4.082 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const StickerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 10-4.773-4.773 3.375 3.375 0 004.774 4.774zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519A5.25 5.25 0 005.25 12.439" />
    </svg>
);

const ImageIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm16.5-1.5H3.75" />
    </svg>
);

const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
    </svg>
);


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

interface PinDetailProps {
    pinId: string;
    allPins: Pin[];
    getPinDetails: (pinId: string, user: User | null) => void;
    activePinData: PinDetailData | null;
    detailLoading: boolean;
    currentUser: User | null;
    onLike: (pinId: string) => void;
    onCommentSubmit: (pinId: string, text: string) => Promise<Comment | null>;
}

const PinDetail: React.FC<PinDetailProps> = ({ pinId, allPins, getPinDetails, activePinData, detailLoading, currentUser, onLike, onCommentSubmit }) => {
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        getPinDetails(pinId, currentUser);
    }, [pinId, currentUser, getPinDetails]);

    const handleBack = () => {
        window.location.assign('/');
    }

    const handleCommentSubmitForm = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        const submittedComment = await onCommentSubmit(pinId, newComment);
        if (submittedComment) {
            setNewComment('');
        }
    };

    const relatedPins = allPins.filter(p => p.id !== parseInt(pinId));
    
    if (detailLoading) return <div className="text-center w-full py-20">Cargando pin...</div>;
    if (!activePinData) return <div className="text-center w-full py-20">Pin no encontrado.</div>;
    
    const { pin, author, likes, isLiked, comments } = activePinData;

    return (
        <div className="w-full">
            <button
                onClick={handleBack}
                className="fixed top-6 left-24 z-20 bg-white rounded-full p-2 shadow-md hover:bg-gray-200 transition-colors"
                aria-label="Volver"
            >
                <ArrowLeftIcon />
            </button>
            <div className="my-8 mx-auto max-w-[90rem] flex space-x-8">
                {/* Left Column: Pin Details */}
                <div className="w-full md:w-1/2 flex justify-end">
                    <div className="bg-white rounded-3xl max-w-xl w-full border border-gray-200">
                        <div className="p-4 sm:p-6 sticky top-4 bg-white rounded-t-3xl z-10">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2 text-gray-700">
                                    <button onClick={() => onLike(pinId)} className="p-2 rounded-full hover:bg-gray-100 transition-colors flex items-center space-x-1">
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
                        </div>

                        <div className="px-4 sm:px-6 pb-6">
                            <div className="relative group mb-4">
                                <img src={pin.imageUrl} alt={pin.title} className="w-full h-auto object-contain rounded-3xl" />
                                <div className="absolute bottom-4 right-4 flex space-x-2">
                                    <button className="bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"><ExpandIcon/></button>
                                    <button className="bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"><SearchLoopIcon/></button>
                                </div>
                            </div>
                            
                            <h1 className="text-2xl font-bold mb-4">{pin.title}</h1>
                            
                            {author && (
                                <div className="flex items-center mb-6">
                                    <img src={author.avatar_url} alt={author.username} className="w-12 h-12 rounded-full mr-4" />
                                    <div>
                                        <p className="font-semibold text-base">{author.username}</p>
                                    </div>
                                </div>
                            )}
                            
                            {/* Comments Section */}
                            <div className="pt-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="font-semibold text-lg">{comments.length === 0 ? '0 comentarios' : `${comments.length} comentarios`}</h2>
                                    <button><ChevronDownIcon /></button>
                                </div>
                                
                                <div className="space-y-4 mb-4">
                                {comments.map(comment => (
                                    <div key={comment.id} className="flex items-start">
                                        <img src={comment.user.avatar_url} alt={comment.user.username} className="w-8 h-8 rounded-full mr-3" />
                                        <div>
                                            <p><span className="font-semibold">{comment.user.username}</span> {comment.text}</p>
                                        </div>
                                    </div>
                                ))}
                                </div>

                                {currentUser && (
                                    <form onSubmit={handleCommentSubmitForm} className="flex items-center mt-4 space-x-3">
                                        <img src={currentUser.user_metadata.avatar_url || `https://i.pravatar.cc/32?u=${currentUser.id}`} alt="Tu avatar" className="w-10 h-10 rounded-full flex-shrink-0" />
                                        <div className="relative w-full">
                                            <input 
                                                type="text" 
                                                placeholder="Agregar un comentario" 
                                                value={newComment}
                                                onChange={(e) => setNewComment(e.target.value)}
                                                className="w-full bg-gray-100 rounded-full border-transparent focus:ring-2 focus:ring-gray-400 focus:border-transparent py-2.5 px-4 pr-40 transition"
                                            />
                                            <div className="absolute inset-y-0 right-0 pr-2 flex items-center space-x-0.5">
                                                <button type="button" className="p-2 hover:bg-gray-200 rounded-full"><EmojiIcon /></button>
                                                <button type="button" className="p-2 hover:bg-gray-200 rounded-full"><StickerIcon /></button>
                                                <button type="button" className="p-2 hover:bg-gray-200 rounded-full"><ImageIcon /></button>
                                                {newComment.trim().length > 0 && (
                                                    <button
                                                        type="submit"
                                                        className="bg-red-600 w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-700 transition-colors"
                                                        aria-label="Enviar comentario"
                                                    >
                                                        <SendIcon />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Related Pins */}
                <div className="w-full md:w-1/2">
                    {relatedPins.length > 0 && (
                        <div>
                            <h2 className="text-2xl font-bold text-left mb-6">Más para explorar</h2>
                            <PinGrid pins={relatedPins} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PinDetail;
