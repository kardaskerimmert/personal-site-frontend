import { useState, useEffect } from "react";

export type FieldType = 'text' | 'textarea' | 'checkbox';
export interface SchemaField { key: string; label: string; type: FieldType; }

export const SCHEMAS: Record<string, SchemaField[]> = {
  simple: [{ key: 'value', label: 'Değer', type: 'text' }],
  game: [{ key: 'name', label: 'Oyun Adı', type: 'text' }, { key: 'url', label: 'URL', type: 'text' }, { key: 'icon', label: 'İkon (örn: fab fa-steam)', type: 'text' }],
  tech: [{ key: 'name', label: 'Teknoloji', type: 'text' }, { key: 'icon', label: 'İkon', type: 'text' }, { key: 'primary', label: 'Ana Teknoloji mi?', type: 'checkbox' }],
  project: [{ key: 'title', label: 'Başlık', type: 'text' }, { key: 'description', label: 'Açıklama', type: 'textarea' }, { key: 'url', label: 'URL', type: 'text' }],
  social: [{ key: 'platform', label: 'Platform', type: 'text' }, { key: 'url', label: 'URL', type: 'text' }, { key: 'icon', label: 'İkon', type: 'text' }],
  topLink: [{ key: 'label', label: 'Yazı', type: 'text' }, { key: 'url', label: 'URL', type: 'text' }]
};

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData: any;
  schemaType: string;
  title: string;
}

export default function EditModal({ isOpen, onClose, onSave, initialData, schemaType, title }: EditModalProps) {
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (isOpen) setFormData(schemaType === 'simple' ? { value: initialData } : { ...initialData });
  }, [initialData, isOpen, schemaType]);

  if (!isOpen) return null;
  const fields = SCHEMAS[schemaType] || SCHEMAS.simple;
  const handleChange = (key: string, val: any) => setFormData((prev: any) => ({ ...prev, [key]: val }));

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#1e1e2d] w-full max-w-md rounded-xl shadow-2xl border border-gray-700 overflow-hidden animate-fade-in-up">
        <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center bg-[#151521]">
          <h3 className="text-white font-semibold text-lg">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition"><i className="fas fa-times"></i></button>
        </div>
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {fields.map((field) => (
            <div key={field.key}>
              <label className="block text-gray-400 text-sm font-medium mb-1.5">{field.label}</label>
              {field.type === 'textarea' ? (
                <textarea className="w-full bg-[#0d0d12] text-white border border-gray-600 rounded-lg p-3 outline-none focus:border-blue-500 min-h-[100px]" value={formData[field.key] || ''} onChange={(e) => handleChange(field.key, e.target.value)} />
              ) : field.type === 'checkbox' ? (
                <div className="flex items-center gap-3 p-3 bg-[#0d0d12] border border-gray-600 rounded-lg">
                  <input type="checkbox" className="w-5 h-5 accent-blue-600 cursor-pointer" checked={!!formData[field.key]} onChange={(e) => handleChange(field.key, e.target.checked)} />
                  <span className="text-white text-sm">Evet</span>
                </div>
              ) : (
                <input type="text" className="w-full bg-[#0d0d12] text-white border border-gray-600 rounded-lg p-3 outline-none focus:border-blue-500" value={formData[field.key] || ''} onChange={(e) => handleChange(field.key, e.target.value)} />
              )}
            </div>
          ))}
        </div>
        <div className="px-6 py-4 bg-[#151521] flex justify-end gap-3 border-t border-gray-700">
          <button onClick={onClose} className="px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition text-sm">İptal</button>
          <button onClick={() => onSave(schemaType === 'simple' ? formData.value : formData)} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition text-sm font-medium">Kaydet</button>
        </div>
      </div>
    </div>
  );
}