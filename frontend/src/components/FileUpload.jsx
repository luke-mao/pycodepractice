import React from "react";
import { Form } from "react-bootstrap";
import { useModal } from "../store/store";

/**
 * FileUpload Component
 *
 * Renders a file input with optional download link for existing files.
 * Validates the uploaded file name and triggers an error modal if it doesn't match the required name.
 */
export default function FileUpload({ 
  label, 
  accept, 
  stateSetter, 
  requiredName, 
  isShowCurrentDownload = false, 
  downloadUrl 
}) {
  // import the show modal
  const { showModal } = useModal();

  // Handle file upload with validation
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.name !== requiredName) {
        showModal({
          title: "File Name Error",
          body: `Please upload a file named **${requiredName}**.`,
          showCancelButton: false,
          onOk: () => {},
        });

        e.target.value = "";
        return;
      }
      stateSetter(file);
    }
  };

  return (
    <Form.Group className="mb-3">
      <div className="d-flex justify-content-between align-items-center">
        <Form.Label className="m-0">{label}</Form.Label>
        {isShowCurrentDownload && (
          <a 
            href={downloadUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary text-decoration-none"
          >
            Download Current
          </a>
        )}
      </div>
      <Form.Control 
        type="file" 
        accept={accept} 
        onChange={handleFileUpload}
      />
    </Form.Group>
  );
}
