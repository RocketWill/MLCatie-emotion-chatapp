import React from 'react';
import {Comment, Image} from "semantic-ui-react";
import moment from 'moment';

const isOwnMessage = (message, user) => {
    return message.user.id === user.uid ? 'message__self' : '';
}

const isImage = (message) => {
    return message.hasOwnProperty('image') && !message.hasOwnProperty('content');
}

const timeFromNow = timestamp => moment(timestamp).fromNow();

const Message = ({message, user}) => (
    <Comment>
        <Comment.Avatar src={message.user.avatar} />
        <Comment.Content className={isOwnMessage(message, user)}>
            <Comment.Author as="a" >{message.user.name}</Comment.Author>
            <Comment.Metadata>{timeFromNow(message.timestamp)}</Comment.Metadata>
            {isImage(message) ? 
                <Image src={message.image} className="message__image" /> : 
                <React.Fragment>
                    <Comment.Text>{message.content}</Comment.Text>
                    {message.emotionProb != 0 && message.emotionProb && <Comment.Content>{message.emotionEmoji} <span className="message__emotion">{message.emotionProb}%</span></Comment.Content>}
                </React.Fragment>
                
                
            }
        </Comment.Content>
    </Comment>
);

export default Message;

