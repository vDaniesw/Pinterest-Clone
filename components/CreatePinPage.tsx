import React, { useState, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Session } from '@supabase/supabase-js';

const UploadIcon = () => (
    <svg className="mx-auto h-8 w-8 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

interface CreatePinPageProps {
    session: Session | null;
}

const CreatePinPage: React.FC<CreatePinPageProps> = ({ session }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [hashtags, setHashtags] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUploadAreaClick = () => {
        fileInputRef.current?.click();
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!imageFile || !title) {
            alert('Por favor, sube una imagen y añade un título.');
            return;
        }
        if (!session?.user) {
            alert('Debes iniciar sesión para crear un pin.');
            return;
        }

        setIsSubmitting(true);
        
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${session.user.id}-${Date.now()}.${fileExt}`;
        const filePath = fileName;

        const { error: uploadError } = await supabase.storage
            .from('pins-images')
            .upload(filePath, imageFile);

        if (uploadError) {
            console.error('Error uploading image:', uploadError);
            alert(`Error al subir la imagen: ${uploadError.message}`);
            setIsSubmitting(false);
            return;
        }

        const { data: { publicUrl } } = supabase.storage
            .from('pins-images')
            .getPublicUrl(filePath);

        const newPinData = {
            user_id: session.user.id,
            title: title,
            description: description,
            hashtags: hashtags,
            image_url: publicUrl,
        };

        const { error: insertError } = await supabase
            .from('pins')
            .insert(newPinData);
        
        if (insertError) {
            console.error('Error saving pin:', insertError);
            alert(`Error al guardar el pin: ${insertError.message}`);
        } else {
            alert('¡Pin creado con éxito!');
            window.location.assign('/');
        }
        setIsSubmitting(false);
    };

    return (
        <div className="bg-gray-100 min-h-full flex flex-col">
           <header className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
                <div className="max-w-6xl mx-auto flex justify-end items-center">
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full disabled:bg-gray-300 transition-colors text-sm"
                        disabled={!imageFile || !title || isSubmitting}
                    >
                        {isSubmitting ? 'Guardando...' : 'Guardar'}
                    </button>
                </div>
            </header>

            <main className="flex-grow p-4 sm:p-8">
                <div className="bg-white rounded-2xl shadow-md w-full max-w-4xl mx-auto p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Image Upload Section */}
                        <div className="w-full">
                            <div
                                className="bg-gray-100 rounded-2xl h-full flex items-center justify-center cursor-pointer aspect-[3/4] p-2 border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors"
                                onClick={handleUploadAreaClick}
                            >
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Pin preview" className="object-contain w-full h-full rounded-lg" />
                                ) : (
                                    <div className="text-center p-8">
                                        <UploadIcon />
                                        <p className="mt-4 text-sm font-semibold text-gray-700">Arrastra y suelta o haz clic para subir</p>
                                        <p className="mt-2 text-xs text-gray-500">Recomendación: usa archivos .jpg de alta calidad de menos de 20MB</p>
                                    </div>
                                )}
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                className="hidden"
                                accept="image/*"
                            />
                        </div>

                        {/* Form Fields Section */}
                        <div className="w-full flex flex-col space-y-8">
                             <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Añade un título"
                                className="block w-full border-0 border-b-2 border-gray-200 focus:border-red-500 focus:ring-0 outline-none p-2 text-3xl font-bold placeholder-gray-400"
                                required
                            />
                            
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                placeholder="Cuenta de qué trata tu Pin"
                                className="block w-full border-0 border-b-2 border-gray-200 focus:border-red-500 focus:ring-0 outline-none p-2 placeholder-gray-400"
                            />
                            
                             <input
                                type="text"
                                id="hashtags"
                                value={hashtags}
                                onChange={(e) => setHashtags(e.target.value)}
                                placeholder="Añade hashtags (ej: #diseño #arte)"
                                className="block w-full border-0 border-b-2 border-gray-200 focus:border-red-500 focus:ring-0 outline-none p-2 placeholder-gray-400"
                            />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CreatePinPage;