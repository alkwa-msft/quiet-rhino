import React, { useEffect, useState } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory
} from "react-router-dom";
import { DefaultButton, TextField } from '@fluentui/react';
import { createAzureCommunicationChatAdapter, ChatComposite, ChatAdapter } from '@azure/communication-react'

function App() {
  const [name, setName] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [threadId, setThreadId] = useState<string>('');
  const [adapter, setAdapter] = useState<ChatAdapter | undefined>(undefined);
  
  useEffect(() => {
    (async() => {
      if (token && name && threadId) {
      const chatAdapter = await createAzureCommunicationChatAdapter(token, 'https://acs-ui-dev.communication.azure.com', threadId, name);
      setAdapter(chatAdapter);
    }
    })();
  },[token, name, threadId])

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <HomeScreen setName={setName} setThreadId={setThreadId} setToken={setToken} setUserId={setUserId} threadId={threadId} userId={userId} />
        </Route>
        <Route path="/chat">
          <ChatScreen adapter={adapter}/>
        </Route>
        <Route path="/feedback">
          <FeedbackScreen />
        </Route>
      </Switch>
    </Router>
  );
}

const HomeScreen = (props: { threadId: string, userId: string, setThreadId: (val: string) => void, setUserId: (val: string) => void, setName: (val: string) => void, setToken: (val: string) => void }): JSX.Element => {
  const history = useHistory();
  return <div className="App">
      <header className="App-header">
        Welcome to my simple chat app
        <TextField label="Standard" onChange={(evt, newValue) => {
          if (newValue) {
            props.setName(newValue)
          }
        }} />
        <DefaultButton onClick={(evt) => {
          (async() => {
            const tokenResponse = await(await fetch('/api/token')).json();
            const token = (tokenResponse as any).token
            props.setToken(token);
            const userId = (tokenResponse as any).user.communicationUserId;
            props.setUserId(userId);
            const threadResponse = await(await fetch(`/api/createThreadAndModerator`)).json();
            const threadId = (threadResponse as any).threadId
            props.setThreadId(threadId);
            const addToThreadResponse = await(await fetch(`/api/AddUserToChatThread?threadId=${threadId}&userId=${userId}`)).json();
            if (addToThreadResponse.participantAdded) {
              history.push("/chat");
            }
           
          })();
         
        }}>Join chat</DefaultButton>
      </header>
    </div>
}

const ChatScreen = (props: { adapter: ChatAdapter | undefined}): JSX.Element => {
  const history = useHistory();
  return <div>
    {props.adapter && <ChatComposite adapter={props.adapter}/>}
    <DefaultButton onClick={() => { history.push("/feedback")}}>Leave chat</DefaultButton></div>
}

const FeedbackScreen = ():JSX.Element => {
  return <div>Did you have a good experience?</div>
}

export default App;
