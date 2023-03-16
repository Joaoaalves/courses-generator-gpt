import './App.css';
import 'normalize.css'
import {Sidebar, Chat} from './components'
import {useState} from 'react'

function App() {
  const [messages, setMessages] = useState([])

  return (
    <div className="App">
      <Sidebar />
      <Chat messages={messages} setMessages={setMessages}/>
    </div>
  );
}

export default App;
