import React, { useState } from 'react'
import closeIcon from "../../public/close.png"
import Image from 'next/image';
import { chatScreenType } from ".";
import { ChatDetails } from './chatMessage';

interface ChatWindowprops {
  changeChatScreen: (screenType: chatScreenType) => void,
  userChatSelected: (chatDetails: ChatDetails) => void
}

function ChatWindow({ changeChatScreen, userChatSelected }: ChatWindowprops) {

  const [chatData, setChatData] = useState([
    {
      "username": "Ruben97",
      "avatar": "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/283.jpg",
      "fullName": "Cindy Rau",
      "lastMessage": "Hello! How are you doing?",
      "id": "4"
    },
    {
      "username": "Domenica18",
      "avatar": "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/47.jpg",
      "fullName": "Dr. Edmond Kohler",
      "lastMessage": "I'm Sai",
      "id": "7"
    },
    {
      "username": "Felix.Kulas",
      "avatar": "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/0.jpg",
      "fullName": "Grace Wuckert I",
      "lastMessage": "Hope you are doing good",
      "id": "9"
    },
  ]);

  const closeChatWindow = () => {
    changeChatScreen('ChatIcon')
  }

  const getUserchatDetails = (id: string) => {
    const chatDetails = chatData.find(item => item.id === id) || {id: ""};
    userChatSelected(chatDetails);
    changeChatScreen('ChatMessage')
  }

  return (
    <div className='chatWindow'>
      <div className='header flex justify-between items-center pr-3'>
        <h3>Welcome User! </h3>
        <Image src={closeIcon} alt="closeIcon" width={13} className='cursor-pointer' onClick={closeChatWindow}></Image>
      </div>
      {
        chatData?.map((chatDetails: any, index: number) => {
          return <>
            <div className='flex justify-start gap-2 items-center py-3 cursor-pointer px-3 hover:bg-slate-100' key={index} onClick={() => getUserchatDetails(chatDetails.id)}>
              <img src={chatDetails.avatar} width={42} height={42} className='rounded-full' />
              <span>
                <p className='font-medium'>{chatDetails.fullName}</p>
                <p className='font-light text-sm'>{chatDetails.lastMessage}</p>
              </span>
            </div>
            <hr></hr>
          </>
        })
      }
    </div>
  )
}

export default ChatWindow