"use client";

import { User } from "@/app/columns";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ImageUpload from "./Imageupload";

interface ModalProps {
    updateUser: (userDetails: User) => void;
    userDetails: User;
}

const Modal: React.FC<ModalProps> = ({ updateUser, userDetails }) => {
    
    const [details, setDetails] = useState(userDetails);

    const handleImageUpload = async (file: File) => {
        if (file) {
          const imageUrl = URL.createObjectURL(file);
          setDetails(prev => ({...prev, avatar: imageUrl}))
        }
      };

    return (
        <div className="modal">
            <div className="modalContent">
                <Input placeholder="Username"
                    value={details.username}
                    onChange={(e) => setDetails(prev => ({ ...prev, username: e.target.value }))}
                    className="max-w-sm"
                />
                <p className="mb-2"></p>
                <Input placeholder="Fullname"
                    value={details.fullName}
                    onChange={(e) => setDetails(prev => ({ ...prev, fullName: e.target.value }))}
                    className="max-w-sm"
                />
                <p className="mb-2"></p>

                <ImageUpload onUpload={handleImageUpload} uploadedImageUrl={details.avatar} />

                <Button
                    variant="outline"
                    size={'sm'}
                    className="max-w-sm bg-slate-400 btn"
                    onClick={() => updateUser(details)}
                >
                    Update
                </Button>
            </div>



        </div>
    );
};

export default Modal;
