import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud } from "lucide-react";

function AddGradeInBulk({ open, onClose, onFileSelected }) {


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
        <button className="action-btn" onClick={onClose}>Close</button>
        <h2>Upload CSV file</h2>

        <div {...getRootProps()} className="dropzone">
          <input {...getInputProps()} />
          <UploadCloud size={48} color="#888" />
          <p>Drag your CSV file here</p>
        </div>

        <p className="or-text"> - or -</p>

        <button className="action-btn" onClick={openFileDialog}>
          Select File
        </button>
      </div>
    </div>
  );
}

export default AddGradeInBulk;
