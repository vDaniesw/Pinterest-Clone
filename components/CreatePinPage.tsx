import React, { useState, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Session } from '@supabase/supabase-js';

const UploadIcon = () => (
    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
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
            // FIX: Corrected typo in FileReader method name.
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
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${session.user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('pins-images')
            .upload(filePath, imageFile);

        if (uploadError) {
            console.error('Error uploading image:', uploadError);
            alert('Error al subir la imagen.');
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
            alert('Error al guardar el pin.');
        } else {
            alert('¡Pin creado con éxito!');
            window.location.assign('/');
        }
        setIsSubmitting(false);
    };

    return (
        <div className="bg-white rounded-3xl w-full max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="p-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Image Upload Section */}
                    <div className="w-full md:w-1/2">
                        <div
                            className="bg-gray-100 rounded-2xl h-full flex items-center justify-center cursor-pointer aspect-w-1 aspect-h-1"
                            style={{minHeight: '400px'}}
                            onClick={handleUploadAreaClick}
                        >
                            {imagePreview ? (
                                <img src={imagePreview} alt="Pin preview" className="object-cover w-full h-full rounded-2xl" />
                            ) : (
                                <div className="text-center p-8">
                                    <UploadIcon />
                                    <p className="mt-2 text-sm text-gray-600">Haz clic para subir una imagen</p>
                                    <p className="text-xs text-gray-500">Recomendación: usa archivos .jpg de alta calidad de menos de 20MB</p>
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
                    <div className="w-full md:w-1/2 flex flex-col justify-between">
                        <div>
                            <h2 className="text-3xl font-bold mb-6 text-gray-800">Crea tu Pin</h2>
                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Nombre del pin</label>
                                    <input
                                        type="text"
                                        id="title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Añade un título"
                                        className="mt-1 block w-full border-b-2 border-gray-300 focus:border-red-500 focus:ring-0 outline-none pb-2 text-xl font-bold"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
                                    <textarea
                                        id="description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows={4}
                                        placeholder="Cuenta de qué trata tu Pin"
                                        className="mt-1 block w-full border-b-2 border-gray-300 focus:border-red-500 focus:ring-0 outline-none"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="hashtags" className="block text-sm font-medium text-gray-700">Hashtags</label>
                                    <input
                                        type="text"
                                        id="hashtags"
                                        value={hashtags}
                                        onChange={(e) => setHashtags(e.target.value)}
                                        placeholder="Ej: #diseño #fotografia #inspiracion"
                                        className="mt-1 block w-full border-b-2 border-gray-300 focus:border-red-500 focus:ring-0 outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end mt-8">
                            <button
                                type="submit"
                                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full disabled:bg-gray-400 transition-colors"
                                disabled={!imageFile || !title || isSubmitting}
                            >
                                {isSubmitting ? 'Guardando...' : 'Guardar'}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreatePinPage;