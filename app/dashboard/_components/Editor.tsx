"use client";

import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

// Carrega o editor apenas no navegador
const ReactQuill = dynamic(() => import("react-quill-new"), { 
  ssr: false,
  loading: () => <div className="h-40 bg-slate-800 animate-pulse rounded-md" />
});

export default function Editor({ value, onChange }: { value: string, onChange: (v: string) => void }) {
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "clean"],
    ],
  };

  return (
    <div className="bg-white text-black rounded-md overflow-hidden">
      <ReactQuill 
        theme="snow" 
        value={value} 
        onChange={onChange} 
        modules={modules}
        style={{ height: '250px', marginBottom: '45px' }}
      />
    </div>
  );
}