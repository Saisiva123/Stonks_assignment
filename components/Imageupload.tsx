import React, { useState } from 'react';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import imageCompression from 'browser-image-compression';
import { useToast } from "@/components/ui/use-toast";


interface ImageUploadProps {
  onUpload: (file: File) => void;
  uploadedImageUrl?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onUpload, uploadedImageUrl }) => {
  const { toast } = useToast()
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);


  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    console.log(`Original Image File Size is   ${file.size / 1024 } KB`);

    if (file) {
      const compressedFile = await compressImage(file);
      toast({
        title: `Compressed Image File Size is  ${compressedFile.size / 1024 } KB`,
        description: `Original Image File Size is ${file.size / 1024 } KB.`
      })
      setUploadedFile(compressedFile);
      onUpload(compressedFile);
    }
  };

  const compressImage = async (file: File): Promise<File> => {
    const options = {
      maxSizeMB: 0.55, 
      maxWidthOrHeight: 300, 
      useWebWorker: true, 
    };
    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error('Error compressing image:', error);
      throw error;
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} className="image-upload border p-4 rounded-md">
      <input {...getInputProps()} />
      {uploadedImageUrl || uploadedFile ? (
        <Image src={uploadedImageUrl || (uploadedFile ? URL.createObjectURL(uploadedFile) : '' )} alt="Uploaded" width={200} height={200} />
      ) : (
        <p>Drag 'n' drop an image here, or click to select an image</p>
      )}
    </div>
  );
};

export default ImageUpload;
