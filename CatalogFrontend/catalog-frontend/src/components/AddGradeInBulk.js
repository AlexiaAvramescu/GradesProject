import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud } from "lucide-react";

function CsvUploadDialog({ open, onClose, onFileSelected }) {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      onFileSelected(acceptedFiles[0]);
    }
  }, [onFileSelected]);

  const { getRootProps, getInputProps, open: openFileDialog } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    multiple: false,
    noClick: true,
  });

  if (!open) return null;

  return (
    <div className="confirm-dialog-overlay">
      <div className="confirm-dialog">
        <button className="action-btn" onClick={onClose}>×</button>
        <h2>Încarcă fișier CSV</h2>

        <div {...getRootProps()} className="dropzone">
          <input {...getInputProps()} />
          <UploadCloud size={48} color="#888" />
          <p>Trage fișierul CSV aici</p>
        </div>

        <p className="or-text">sau</p>

        <button className="action-btn" onClick={openFileDialog}>
          Selectează fișierul
        </button>
      </div>
    </div>
  );
}

export default CsvUploadDialog;
