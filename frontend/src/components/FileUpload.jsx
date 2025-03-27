import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

export default function FileUpload({ onFileUpload }) {
  const [preview, setPreview] = useState(null);
  const [errorMessage, setErrorMessage] = useState(""); // State to hold error messages

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];

    if (file) {
      // Validate file type
      const validMimeTypes = ["image/jpeg", "image/png", "image/gif"]; // Allowed MIME types
      if (!validMimeTypes.includes(file.type)) {
        setErrorMessage("Invalid file type. Please upload an image (JPEG, PNG, GIF).");
        setPreview(null); // Reset preview if invalid file type
        return;
      }

      // Validate file size (optional, e.g., max size 5MB)
      const maxFileSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxFileSize) {
        setErrorMessage("File size exceeds 5MB. Please upload a smaller image.");
        setPreview(null); // Reset preview if file is too large
        return;
      }

      // If the file is valid, show preview and pass it to the parent component
      setErrorMessage(""); // Clear any previous error messages
      setPreview(URL.createObjectURL(file)); // Preview the uploaded image
      onFileUpload(file); // Pass the file to the parent component
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*", // Only allow images
    multiple: false, // Single file upload
  });

  return (
    <div {...getRootProps()} className="border-dashed border-2 p-6 text-center cursor-pointer rounded-lg">
      <input {...getInputProps()} />
      {errorMessage ? (
        <p className="text-red-500">{errorMessage}</p> // Display error message
      ) : preview ? (
        <img src={preview} alt="Preview" className="max-w-full h-auto rounded-md" />
      ) : (
        <p className="text-gray-600">Drag & drop an image here, or click to select</p>
      )}
    </div>
  );
}
