import { useRef, useState } from 'react';
import { chatScreenType } from '.';
import closeIcon from "../../public/close.png";
import Pin from "../../public/pin.png";
import Image from 'next/image';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import Fuse from 'fuse.js';


export interface ChatDetails {
    username?: string
    avatar?: string
    fullName?: string
    lastMessage?: string
    id: string
}

interface ChatMessageprops {
    changeChatScreen: (screenType: chatScreenType) => void;
    chatDetails: ChatDetails
}

interface User {
    id: number;
    username: string;
}

const commands = [
    { name: '/mute', description: '@user has been muted', },
    { name: '/ban', description: '@user has been banned' },
    { name: '/title', description: 'A title has been set for the current stream' },
    { name: '/description', description: 'A description has been set for the current stream' },
];

const userList: User[] = [{ id: 1, username: "kevin" }, { id: 2, username: 'Marcus' }, { id: 3, username: 'Klara' }]

function ChatMessage({ changeChatScreen, chatDetails }: ChatMessageprops) {

    const [inputValue, setInputValue] = useState('');
    const [showUserList, setShowUserList] = useState(false);
    const [users, setUsers] = useState<User[]>([...userList]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [emojiStartIndex, setEmojiStartIndex] = useState(-1);

    const [showCommandList, setShowCommandList] = useState(false);

    const [filteredUsers, setFilteredUsers] = useState<User[]>([...userList]);
    const inputRef = useRef<HTMLInputElement>(null);
    const [chatMessages, setChatMessages] = useState([
        {
            type: 'bot',
            message: "Hello! I'm you bot, ask me anything."
        },
    ])

    const closeChatWindow = () => {
        changeChatScreen('ChatWindow')
    }

    const fuse = new Fuse(users, {
        keys: ['username'],
        threshold: 0.3,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setInputValue(value);
        const lastWord = value.split(' ').pop();
        if (lastWord?.startsWith('@')) {
            setShowUserList(true);
            setFilteredUsers([...users]);

            const query = lastWord.slice(1).toLowerCase();

            if (query) {
                console.log("called")
                const results = fuse.search(query).slice(0, 3).map(result => result.item);
                setFilteredUsers(results);
            }

        } else {
            setShowUserList(false);
        }

        if (lastWord?.startsWith(':')) {
            setEmojiStartIndex(value.lastIndexOf(':'));
            setShowEmojiPicker(true);
        } else {
            setShowEmojiPicker(false);
        }

        if (lastWord?.startsWith('/')) {
            setShowCommandList(true);
        } else {
            setShowCommandList(false);
        }

    };

    const handleUserClick = (username: string) => {
        const words = inputValue.split(' ');
        words.pop();
        setInputValue([...words, `@${username}`].join(' ') + ' ');
        setShowUserList(false);
        inputRef.current?.focus();
    };

    const handleCommandClick = (command: string) => {
        const words = inputValue.split(' ');
        words.pop();
        setInputValue([...words].join(' '));

        setChatMessages(prevState => [...prevState, { type: "command", message: `${command}` }]);
        setShowCommandList(false);
        inputRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (inputValue.trim()) {
                setChatMessages(prevState => [...prevState, { type: "user", message: inputValue.trim(), tagged: inputValue.trim().includes('@') }]);
                setInputValue('');
            }
        }
    };

    const handleEmojiSelect = (emoji: any) => {
        const beforeEmoji = inputValue.slice(0, emojiStartIndex);
        const afterEmoji = inputValue.slice(emojiStartIndex).replace(/:\w*$/, '');
        setInputValue(beforeEmoji + emoji.native + afterEmoji);

        setShowEmojiPicker(false);
        inputRef.current?.focus();
    };


    const emojiClickOutside = () => {
        setShowEmojiPicker(false);
        const beforeEmoji = inputValue.slice(0, emojiStartIndex);
        const afterEmoji = inputValue.slice(emojiStartIndex).replace(/:\w*$/, '');

        setInputValue(beforeEmoji + afterEmoji);
        inputRef.current?.focus();
    };


    return (
        <div className='messageWindow'>
            <div className='header flex justify-between items-center pr-3'>
                <span className='flex justify-start gap-2 items-center'>
                    <img src={chatDetails.avatar || ''} alt="Profile Pic" width={42} height={42} className='cursor-pointer rounded-full' ></img>
                    <h3>{chatDetails.fullName} </h3>
                </span>

                <Image src={closeIcon} alt="closeIcon" width={13} className='cursor-pointer' onClick={closeChatWindow}></Image>
            </div>

            <div className='messageContainer'> {
                chatMessages.map((item: any, index: number) => {
                    return <>
                        <p className={`${item.type}Message mb-3 relative`} key={index}>{item.message}
                             {item.tagged && <Image src={Pin} alt="Tagged Pin" width={16} />}
                        </p>
                       
                    </>
                })
            }</div>


            {showEmojiPicker && <div className='emojiPicker'>
                <Picker data={data} onSelect={handleEmojiSelect} style={{ bottom: '50px' }} theme={'light'} onEmojiSelect={handleEmojiSelect} previewPosition={"none"} onClickOutside={emojiClickOutside} className="emojiPicker" />
            </div>}

            {showCommandList && (
                <div className="commandList p-2 rounded border border-slate-100">
                    {commands.map(command => (
                        <p key={command.name} onClick={() => handleCommandClick(command.description)} className='mb-2 cursor-pointer border-b-2 border-slate-100'>
                            <strong>{command.name}</strong> {command.description}
                        </p>
                    ))}
                </div>
            )}

            {showUserList && (
                <div className="userList border p-2 rounded  border-slate-100">
                    {filteredUsers?.map(user => (
                        <p key={user.id} onClick={() => handleUserClick(user.username)} className='mb-2 cursor-pointer border-b-2 border-slate-100'>
                            {user.username}
                        </p>
                    ))}
                </div>
            )}

            <input type="text" placeholder='Enter your message...' ref={inputRef} value={inputValue} onChange={handleInputChange} onKeyDown={handleKeyDown}></input>

        </div>
    )
}
export default ChatMessage