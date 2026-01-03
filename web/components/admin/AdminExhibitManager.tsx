import React, { useState, useEffect } from 'react';
import { Plus, Save, Loader, UploadCloud, CheckCircle, Search, Edit, Trash2, Image } from 'lucide-react';
import { adminService } from '@/services/adminService.ts';
import { Exhibit, ExhibitCategory } from '@/types.ts';
import imageCompression from 'browser-image-compression';

export const AdminExhibitManager: React.FC = () => {
    const [exhibits, setExhibits] = useState<Exhibit[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [msg, setMsg] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [form, setForm] = useState({
        name: '',
        description: '',
        productionYear: '',
        imageUrl: '',
        category: 'UNIFORMS' as ExhibitCategory
    });

    const fetchExhibits = async () => {
        try {
            const data = await adminService.getAllExhibits();
            setExhibits(data.sort((a, b) => b.id - a.id));
        } catch (e) {
            console.error("Błąd pobierania eksponatów", e);
        }
    };

    useEffect(() => { fetchExhibits(); }, []);

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
            if (editingId) {
                await adminService.updateExhibit(editingId, form);
                setMsg('Eksponat zaktualizowany!');
            } else {
                await adminService.addExhibit(form);
                setMsg('Eksponat dodany!');
            }

            handleCancel();
            fetchExhibits();
            setTimeout(() => setMsg(''), 3000);
        } catch (e) {
            alert("Błąd zapisu. Sprawdź czy wszystkie pola są poprawne.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (ex: Exhibit) => {
        setEditingId(ex.id);
        setForm({
            name: ex.name,
            description: ex.description,
            productionYear: ex.productionYear,
            imageUrl: ex.imageUrl || '',
            category: ex.category
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Czy na pewno chcesz usunąć ten eksponat? Operacji nie można cofnąć.")) {
            try {
                await adminService.deleteExhibit(id);
                fetchExhibits();
            } catch (e) {
                alert("Nie udało się usunąć eksponatu. Sprawdź czy nie jest przypisany do jakiejś Wystawy.");
            }
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        setForm({ name: '', description: '', productionYear: '', imageUrl: '', category: 'UNIFORMS' as ExhibitCategory });
    };

    const filteredExhibits = exhibits.filter(ex =>
        ex.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ex.productionYear.includes(searchTerm)
    );

    return (
        <div className="animate-fade-in">
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto mb-16 border-b border-gray-100 pb-12">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        {editingId ? <Edit className="text-museum-red" /> : <Plus className="text-gray-400" />}
                        {editingId ? "Edytuj Eksponat" : "Nowy Eksponat"}
                    </h3>
                    <div className="flex items-center gap-2">
                        {msg && <span className="text-green-600 font-bold text-sm bg-green-50 px-3 py-1 rounded-lg flex gap-1"><CheckCircle size={16}/> {msg}</span>}
                        {editingId && <button type="button" onClick={handleCancel} className="text-sm text-red-600 font-bold hover:underline bg-red-50 px-3 py-1 rounded-lg">Anuluj</button>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nazwa</label>
                        <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-museum-red/20" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Rok powstania</label>
                        <input required type="text" value={form.productionYear} onChange={e => setForm({...form, productionYear: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-museum-red/20" />
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kategoria</label>
                    <select value={form.category} onChange={e => setForm({...form, category: e.target.value as ExhibitCategory})} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-museum-red/20 cursor-pointer">
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
                            <div className="flex flex-col items-center text-gray-500"><UploadCloud size={48} className="mb-2" /><p>Kliknij, aby dodać zdjęcie</p></div>
                        )}
                    </div>
                </div>

                <button disabled={isLoading} type="submit" className="w-full py-4 bg-museum-black text-white rounded-xl font-bold hover:bg-gray-800 transition flex items-center justify-center gap-2 disabled:opacity-70">
                    {isLoading ? <Loader className="animate-spin"/> : <Save size={20} />} {editingId ? "Zapisz Zmiany" : "Dodaj Eksponat"}
                </button>
            </form>

            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-end mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Baza Eksponatów ({filteredExhibits.length})</h3>
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-2.5 text-gray-400 h-4 w-4" />
                        <input type="text" placeholder="Szukaj..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-museum-red" />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {filteredExhibits.length > 0 ? filteredExhibits.map((ex) => (
                        <div key={ex.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 hover:shadow-md transition">
                            <div className="flex items-center gap-4">
                                <div className="h-16 w-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                                    {ex.imageUrl ? <img src={ex.imageUrl} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-300"><Image size={20}/></div>}
                                </div>
                                <div>
                                    <div className="font-bold text-gray-900">{ex.name}</div>
                                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">{ex.category} • {ex.productionYear}</div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(ex)} className="p-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition text-gray-600" title="Edytuj"><Edit size={18} /></button>
                                <button onClick={() => handleDelete(ex.id)} className="p-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-red-50 hover:text-red-600 transition text-gray-600" title="Usuń"><Trash2 size={18} /></button>
                            </div>
                        </div>
                    )) : (
                        <p className="text-center text-gray-400 py-8">Nie znaleziono eksponatów.</p>
                    )}
                </div>
            </div>
        </div>
    );
};