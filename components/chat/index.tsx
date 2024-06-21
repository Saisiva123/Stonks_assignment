import ChatWindow from "@/components/chat/chatWindow";
import ChatMessage, { ChatDetails } from "@/components/chat/chatMessage";
import ChatIcon from "../../public/chat.png"
import Image from 'next/image';
import { useState } from "react";

export type chatScreenType = "ChatIcon" | "ChatWindow" | "ChatMessage"

function Chat() {
    const [activeChatScreen, setActiveChatScreen] = useState<chatScreenType>('ChatIcon');
    const [activeChat, setActiveChat] = useState<ChatDetails>({id: "", username : "sds", fullName: "sdfsjkdn"});

    const userChatSelected = (chatDetails: ChatDetails) => {
        setActiveChat(chatDetails)
    }

    const renderChat = () => {
        switch (activeChatScreen) {
            case 'ChatIcon': return <Image src={ChatIcon} alt="chat Icon" className="chatIcon cursor-pointer" onClick={() => setActiveChatScreen('ChatWindow')} ></Image>;
            case 'ChatWindow': return <ChatWindow changeChatScreen={(screenType: chatScreenType) => setActiveChatScreen(screenType)} userChatSelected = {userChatSelected} />;
            case 'ChatMessage': return <ChatMessage changeChatScreen={(screenType: chatScreenType) => setActiveChatScreen(screenType)} chatDetails = {activeChat} />;
            default: return <></>
        }
    }

    return (
        <>
            { renderChat() }
        </>
    )
}

export default Chat