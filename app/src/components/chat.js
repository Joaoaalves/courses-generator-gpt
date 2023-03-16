import './chat.css'
import { MdSend } from 'react-icons/md'
import { useState } from 'react'
import axios from 'axios'
import { Button } from '@mui/material'
import uniqid from 'uniqid';
import Message from './message'

const instance = axios.create({
    baseURL: 'http://localhost:5000/api/v1/',
    timeout: 5000000,
    });

const Chat = ({messages, setMessages}) => {
    const [currentMessage, setCurrentMessage] = useState('')
    const [loading, setLoading] = useState(false);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            sendMessage()
            e.target.value = ''
        }
    }

    async function sendMessage(){
        const message_id = uniqid()
        let newMessages = [...messages, {id: message_id, role: 'user', content: currentMessage }]
        setMessages([...messages, {id: message_id, role: 'user', content: currentMessage }])

        setCurrentMessage('')

        await instance.post('chat', {
            messages: newMessages,
        }).then(res => {
            const data = res.data;
            
            setMessages([...newMessages, {id: uniqid(), role: 'assistant', content: data.message }])
        })
        
    }

    async function handleFileUpload(e) {
        const formData = new FormData();
        formData.append('video', e.target.files[0]);
    
        setLoading(true);
        await instance.post('transcribe', formData)
          .then(res => {
            setCurrentMessage('Crie uma aula baseada na transcrição enviada e retorne em formato de markdown!')
          
        }
          );

        setLoading(false);
      }
    
    return (
        <section className='chatbox'>
            <div className='chatbox__messages'>
                {messages.map((message, index) => {
                    return <Message key={index} message={message} setMessages={setMessages}/>
                })}
            </div>

            
            <div className='chatbox__inputHolder'>
                <input type='text' className='chatbox__input' placeholder='Type a message' value={currentMessage} onChange={e => setCurrentMessage(e.target.value)} onKeyDown={handleKeyDown} />
                <MdSend className='chatbox__sendIcon' onClick={sendMessage} />
            </div>
            {/* <Button variant="contained" className='aulaBtn' component="label" disabled={loading? 'true' : false}>{loading ? 'Transcrevendo...' : 'Carregar Aula'}<input type="file" hidden onChange={handleFileUpload}/></Button> */}
        </section>
    )
}

export default Chat