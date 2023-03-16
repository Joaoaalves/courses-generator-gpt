import React from 'react'
import './sidebar.css'
import { AiOutlinePlus } from 'react-icons/ai';
import {BsChatLeft, BsTrash} from 'react-icons/bs'
import {HiOutlinePencilAlt} from 'react-icons/hi'
import { useState } from 'react';

const Sidebar = () => {
    const [conversations, setConversations] = useState([])
    const handleNewConversation = () => {
        setConversations([...conversations, { name: 'New Conversation', id: conversations.length + 1, messages:[] }])
    }

    const handleDeleteConversation = (e) => {
        const conversationId = parseInt(e.target.parentElement.id)
        const newConversations = conversations.filter(conversation => conversation.id !== conversationId)
        setConversations(newConversations)

    }


    return (
        <aside className="sidebar">
            <div className="sidebar__newChat" onClick={handleNewConversation}>
                <AiOutlinePlus className='sidebar__newChat-icon' />
                <span>Novo Curso</span>
            </div>

            <div className="sidebar__conversations">
                {conversations.map((conversation, index) => {
                    return (
                        <div key={index} className="sidebar__conversation" id={conversation.id}>
                            <BsChatLeft className='sidebar__conversation--icon'/>
                            <input className="sidebar__conversation--name" value={conversation.name}  disabled></input>
                            <HiOutlinePencilAlt className='sidebar__conversation--edit' />
                            <BsTrash className='sidebar__conversation--delete' onClick={handleDeleteConversation}/>
                        </div>
                    )
                })}
            </div>

        </aside>
    )
}

export default Sidebar