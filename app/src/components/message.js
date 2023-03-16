import React, {useState} from 'react'
import { SiOpenai } from 'react-icons/si'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'
import {Menu, MenuItem, Button} from '@mui/material'
import axios from 'axios'

const instance = axios.create({
    baseURL: 'http://localhost:5000/api/v1/',
    timeout: 5000000,
    });

const Message = ({ message, setMessages }) => {
    const { id, role, content } = message
    const [anchorEl, setAnchorEl] = useState(null);

    const handleDeleteMessage = () => {
        setMessages((messages) => messages.filter((message) => message.id !== id))
    }

    const handleSummarize = () => {
        
        setAnchorEl(null)
        instance.post('summarize', {
            message: {
                content: content,
                role: role,
            },
        }).then(res => {
            const summarized_message = res.data.message;

            // Update message content on same order in messages array and update state
            setMessages((messages) => messages.map((message) => message.id === id ? { ...message, content: summarized_message } : message))
        }
        );
    }

    const handleEditMessage = () => {
        setAnchorEl(null)
    }

    return (
        <div className={`chatbox__message ${role === 'user' ? 'me' : 'bot'}`} >
            <span className='chatbox__message--name'>{role === 'user' ? role.charAt(0) : <SiOpenai />}</span>
            <ReactMarkdown className='chatbox__message--text' rehypePlugins={[rehypeHighlight]} remarkPlugins={[remarkGfm]} children={content}></ReactMarkdown>

            <Button
                id="basic-button"
                aria-controls="basic-menu"
                aria-haspopup="true"
                aria-expanded={anchorEl ? 'true' : undefined}
                onClick={(e) => setAnchorEl(e.currentTarget)}
            >
                ...
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={handleEditMessage}>Editar</MenuItem>
                <MenuItem onClick={handleDeleteMessage}>Excluir</MenuItem>
                <MenuItem onClick={handleSummarize}>Resumir</MenuItem>
            </Menu>
        </div>
    )
}

export default Message