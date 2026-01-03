import React, { useState } from 'react';
import { Plus, Save, Loader, UploadCloud, CheckCircle } from 'lucide-react';
import { adminService } from '@/services/adminService.ts';
import { ExhibitCategory } from '@/types.ts';
import imageCompression from 'browser-image-compression';

export const AdminExhibitForm: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [msg, setMsg] = useState('');
    const [form, setForm] = useState({
        name: '', description: '', productionYear: '', imageUrl: '', category: 'UNIFORMS' as ExhibitCategory
    });

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsLoading(true);
            try {
                const compressed = await imageCompression(file, { maxSizeMB: 0.3, maxWidthOrHeight: 1280, useWebWorker: true });
                const reader = new FileReader();
                reader.onloadend = () => { setForm(p => ({ ...p, imageUrl: reader.result as string })); setIsLoading(false); };
                reader.readAsDataURL(compressed);
            } catch (e) { setIsLoading(false); }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await adminService.addExhibit(form);
            setMsg('Eksponat dodany!');
            setForm({ name: '', description: '', productionYear: '', imageUrl: '', category: 'UNIFORMS' });
            setTimeout(() => setMsg(''), 3000);
        } catch (e) { alert("Błąd zapisu"); } finally { setIsLoading(false); }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2"><Plus className="text-gray-400" /> Nowy Eksponat</h3>
                {msg && <span className="text-green-600 font-bold text-sm bg-green-50 px-3 py-1 rounded-lg flex gap-1"><CheckCircle size={16}/> {msg}</span>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nazwa</label>
                    <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-museum-red/20" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rok</label>
                    <input required type="text" value={form.productionYear} onChange={e => setForm({...form, productionYear: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-museum-red/20" />
                </div>
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Kategoria</label>
                <select value={form.category} onChange={e => setForm({...form, category: e.target.value as ExhibitCategory})} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-museum-red/20">
                    <option value="UNIFORMS">Umundurowanie</option>
                    <option value="EQUIPMENT">Wyposażenie</option>
                    <option value="WEAPONRY">Uzbrojenie</option>
                    <option value="DOCUMENTS">Dokumenty</option>
                    <option value="PHOTOS">Fotografie</option>
                    <option value="EVERYDAY_OBJECTS">Przedmioty codzienne</option>
                    <option value="OTHER">Inne</option>
                </select>
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Opis</label>
                <textarea required rows={4} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-museum-red/20" />
            </div>

            <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">Zdjęcie</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition relative group">
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    {form.imageUrl ? (
                        <div className="relative h-48 mx-auto rounded-lg overflow-hidden">
                            <img src={form.imageUrl} alt="" className="h-full w-full object-contain" />
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-white font-bold">Zmień</div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center text-gray-500"><UploadCloud size={48} className="mb-2" /><p>Dodaj zdjęcie</p></div>
                    )}
                </div>
            </div>

            <button disabled={isLoading} type="submit" className="w-full py-4 bg-museum-black text-white rounded-xl font-bold hover:bg-gray-800 transition flex items-center justify-center gap-2">
                {isLoading ? <Loader className="animate-spin"/> : <Save size={20} />} Zapisz Eksponat
            </button>
        </form>
    );
};