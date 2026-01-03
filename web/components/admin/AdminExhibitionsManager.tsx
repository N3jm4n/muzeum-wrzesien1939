import React, { useState, useEffect } from 'react';
import { Plus, Save, Image, Search, Check, Loader, Edit, Trash2 } from 'lucide-react';
import { adminService } from '@/services/adminService.ts';
import { Exhibit } from '@/types.ts';
import imageCompression from 'browser-image-compression';

export const AdminExhibitionsManager: React.FC = () => {
    const [existingExhibitions, setExistingExhibitions] = useState<any[]>([]);
    const [availableExhibits, setAvailableExhibits] = useState<Exhibit[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [form, setForm] = useState({
        name: '', description: '', backgroundImageUrl: '', selectedExhibitIds: [] as number[]
    });

    const fetchData = async () => {
        try {
            const [exhibits, exhibitions] = await Promise.all([
                adminService.getAllExhibits(),
                adminService.getAllExhibitions()
            ]);
            setAvailableExhibits(exhibits);
            setExistingExhibitions(exhibitions);
        } catch (e) { console.error(e); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsLoading(true);
            try {
                const compressed = await imageCompression(file, { maxSizeMB: 2.0, maxWidthOrHeight: 1920, useWebWorker: true });
                const reader = new FileReader();
                reader.onloadend = () => { setForm(p => ({ ...p, backgroundImageUrl: reader.result as string })); setIsLoading(false); };
                reader.readAsDataURL(compressed);
            } catch (e) { setIsLoading(false); }
        }
    };

    const toggleExhibit = (id: number) => {
        setForm(p => ({
            ...p,
            selectedExhibitIds: p.selectedExhibitIds.includes(id)
                ? p.selectedExhibitIds.filter(x => x !== id)
                : [...p.selectedExhibitIds, id]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const payload = {
                name: form.name,
                description: form.description,
                backgroundImageUrl: form.backgroundImageUrl,
                exhibitIds: form.selectedExhibitIds
            };

            if (editingId) {
                await adminService.updateExhibition(editingId, payload);
                alert("Zaktualizowano!");
            } else {
                await adminService.addExhibition(payload);
                alert("Utworzono!");
            }
            handleCancel();
            fetchData();
        } catch (e) { alert("Błąd zapisu"); } finally { setIsLoading(false); }
    };

    const handleEdit = (ex: any) => {
        setEditingId(ex.id);
        setForm({
            name: ex.name,
            description: ex.description,
            backgroundImageUrl: ex.backgroundImageUrl || '',
            selectedExhibitIds: ex.exhibits ? ex.exhibits.map((e: any) => e.id) : []
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Usunąć wystawę?")) {
            await adminService.deleteExhibition(id);
            fetchData();
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        setForm({ name: '', description: '', backgroundImageUrl: '', selectedExhibitIds: [] });
    };

    const filteredExhibits = availableExhibits.filter(ex => ex.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="animate-fade-in">
            <form onSubmit={handleSubmit} className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        {editingId ? <Edit className="text-museum-red" /> : <Plus className="text-gray-400" />}
                        {editingId ? "Edytuj Wystawę" : "Kreator Wystawy"}
                    </h3>
                    {editingId && <button type="button" onClick={handleCancel} className="text-red-600 font-bold hover:underline bg-red-50 px-3 py-1 rounded">Anuluj</button>}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* LEWA: DANE */}
                    <div>
                        <div className="mb-6"><label className="block text-sm font-medium text-gray-700 mb-2">Tytuł</label><input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-museum-red/20" /></div>
                        <div className="mb-6"><label className="block text-sm font-medium text-gray-700 mb-2">Opis</label><textarea required rows={4} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-museum-red/20" /></div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Baner</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:bg-gray-50 transition relative group">
                                <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                {form.backgroundImageUrl ? <div className="relative h-40 mx-auto rounded-lg overflow-hidden"><img src={form.backgroundImageUrl} alt="" className="h-full w-full object-cover" /><div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 text-white font-bold">Zmień</div></div> : <div className="flex flex-col items-center text-gray-500 py-6"><Image size={32} className="mb-2" /><p>Dodaj tło</p></div>}
                            </div>
                        </div>
                    </div>

                    {/* PRAWA: EKSPONATY */}
                    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 flex flex-col h-[550px]">
                        <div className="flex justify-between items-center mb-4">
                            <label className="block font-bold text-gray-900">Dołącz eksponaty</label>
                            <span className="text-xs bg-museum-black text-white px-2 py-1 rounded-full font-bold">{form.selectedExhibitIds.length}</span>
                        </div>
                        <div className="relative mb-4"><Search className="absolute left-3 top-2.5 text-gray-400 h-4 w-4" /><input type="text" placeholder="Szukaj..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-museum-red" /></div>
                        <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                            {filteredExhibits.map(item => {
                                const isSelected = form.selectedExhibitIds.includes(item.id);
                                return (
                                    <div key={item.id} onClick={() => toggleExhibit(item.id)} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer select-none ${isSelected ? 'bg-red-50 border-museum-red ring-1 ring-museum-red' : 'bg-white border-gray-200'}`}>
                                        <div className={`h-5 w-5 rounded border flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-museum-red border-museum-red' : 'border-gray-300 bg-white'}`}>{isSelected && <Check size={12} className="text-white" />}</div>
                                        <div className="h-10 w-10 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">{item.imageUrl && <img src={item.imageUrl} alt="" className="h-full w-full object-cover" />}</div>
                                        <div className="flex-1 min-w-0 font-medium text-sm text-gray-900 truncate">{item.name}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="mt-8 border-t border-gray-100 pt-6">
                    <button disabled={isLoading} type="submit" className="w-full py-4 bg-museum-black text-white rounded-xl font-bold hover:bg-gray-800 transition flex items-center justify-center gap-2">
                        {isLoading ? <Loader className="animate-spin"/> : <Save size={20} />} {editingId ? "Zapisz Zmiany" : "Utwórz Wystawę"}
                    </button>
                </div>
            </form>

            <div className="mt-16 pt-10 border-t-2 border-gray-100">
                <h3 className="text-xl font-bold mb-6 text-gray-900">Istniejące Wystawy</h3>
                <div className="grid grid-cols-1 gap-4">
                    {existingExhibitions.map((ex) => (
                        <div key={ex.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200 hover:shadow-md transition">
                            <div className="flex items-center gap-4">
                                <div className="h-16 w-24 bg-gray-300 rounded-lg overflow-hidden flex-shrink-0">{ex.backgroundImageUrl ? <img src={ex.backgroundImageUrl} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400"><Image size={20}/></div>}</div>
                                <div><div className="font-bold text-gray-900">{ex.name}</div><div className="text-sm text-gray-500">Eksponaty: {ex.exhibits?.length || 0}</div></div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(ex)} className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-blue-50 text-gray-600"><Edit size={18} /></button>
                                <button onClick={() => handleDelete(ex.id)} className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-red-50 text-gray-600"><Trash2 size={18} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};