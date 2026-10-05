import {  useRef  } from "react";
import { UploadCloud } from 'lucide-react';

export default function FileUpload({ onFileSelect, accept, label = 'Upload Document' }) {
  const fileRef = useRef(null);
  return (
    <div
      onClick={() => fileRef.current?.click()}
      style={{
        border: '2px dashed var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '2rem',
        textAlign: 'center',
        cursor: 'pointer',
        background: 'var(--bg-color)',
        transition: 'var(--transition)',
      }}
    >
      <input ref={fileRef} type="file" accept={accept} onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])} style={{ display: 'none' }} />
      <UploadCloud size={36} color="var(--primary)" style={{ margin: '0 auto 0.5rem' }} />
      <p style={{ margin: '0 0 0.25rem', fontWeight: 600, fontSize: '0.875rem' }}>{label}</p>
      <span className="text-muted" style={{ fontSize: '0.75rem' }}>Click or drag file here to attach</span>
    </div>
  );
}
