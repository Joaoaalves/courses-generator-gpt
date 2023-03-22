import React from 'react'
import './sidebar.css'
import { AiOutlinePlus } from 'react-icons/ai';
import {BsChatLeft, BsTrash} from 'react-icons/bs'
import {HiOutlinePencilAlt} from 'react-icons/hi'
import { useState } from 'react';
import { Button } from '@mui/material';

import Api from '../lib/api'

const Sidebar = () => {
    const [conversations, setConversations] = useState([])

    const handleDeleteConversation = (e) => {
        const conversationId = parseInt(e.target.parentElement.id)
        const newConversations = conversations.filter(conversation => conversation.id !== conversationId)
        setConversations(newConversations)

    }

    const handleFileUpload = (e) => {
        const formData = new FormData();
        formData.append("curso", e.target.files[0]);


        Api.newCurso(formData).then((response) => {
            console.log(response)
        })
    }


    return (
        <aside className="sidebar">
            <Button
            variant="contained"
            component="label"
            id="sidebar__newChat"
          >
            Novo Curso +
            <input type="file" hidden onChange={handleFileUpload} />
          </Button>

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