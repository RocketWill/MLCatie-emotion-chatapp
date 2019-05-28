import React from 'react';
import { Segment, Comment } from 'semantic-ui-react';
import MessagesHeader from './MessageHeader';
import MessageForm from './MessageFrom';

class Messages extends React.Component {
    render(){
        return(
            <React.Fragment>
                <MessagesHeader />

                <Segment>
                    <Comment.Group className="messages">
                        {/* Messages */}
                    </Comment.Group>
                </Segment>

                <MessageForm />
            </React.Fragment>
        )
    }
}

export default Messages;