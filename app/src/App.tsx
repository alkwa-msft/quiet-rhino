import React, { useEffect, useState } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
  useParams
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

// This screen allows us to set up the user and ask for any information
// This is also where if we wanted to have a join link we would do something here as well
const HomeScreen = (props: { threadId: string, userId: string, setThreadId: (val: string) => void, setUserId: (val: string) => void, setName: (val: string) => void, setToken: (val: string) => void }): JSX.Element => {
  let { threadId } = useParams<{threadId: string}>();
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
            if (threadId) {
              // check if the thread exists
              const threadResponse = await(await fetch(`/api/isThreadValid?threadId=${threadId}`)).json();
              const threadExists = (threadResponse as any).threadExists

              if (!threadExists) {
                console.warn('thread does not exist')
                return;
              }

              // get my token and user id
              const tokenResponse = await(await fetch('/api/token')).json();
              const token = (tokenResponse as any).token
              props.setToken(token);
              const userId = (tokenResponse as any).user.communicationUserId;
              props.setUserId(userId);

              // add user to thread
              const addToThreadResponse = await(await fetch(`/api/AddUserToChatThread?threadId=${threadId}&userId=${userId}`)).json();
              if (addToThreadResponse.participantAdded) {
                history.push("/chat");
              }
            }
            else {
              // get my token and user id
              const tokenResponse = await(await fetch('/api/token')).json();
              const token = (tokenResponse as any).token
              props.setToken(token);
              const userId = (tokenResponse as any).user.communicationUserId;
              props.setUserId(userId);

              // create a new thread
              const threadResponse = await(await fetch(`/api/createThreadAndModerator`)).json();
              const newThreadId = (threadResponse as any).threadId
              props.setThreadId(newThreadId);

              // add myself to this thread
              const addToThreadResponse = await(await fetch(`/api/AddUserToChatThread?threadId=${newThreadId}&userId=${userId}`)).json();
              if (addToThreadResponse.participantAdded) {
                history.push("/chat");
              }
            }
          })();
        }}>Join chat</DefaultButton>
      </header>
    </div>
}

const ChatScreen = (props: { adapter: ChatAdapter | undefined}): JSX.Element => {
  // main chat screen
  const history = useHistory();
  return <div>
    <DefaultButton style={{float:'right'}} onClick={() => { history.push("/feedback")}}>Leave chat</DefaultButton>
    {props.adapter && <div style={{height:'90vh'}}><ChatComposite adapter={props.adapter}/></div>}
  </div>
}

const FeedbackScreen = ():JSX.Element => {
  // opportunity to put in an app insights with UI to collect data
  return <div>Did you have a good experience?</div>
}

export default App;
