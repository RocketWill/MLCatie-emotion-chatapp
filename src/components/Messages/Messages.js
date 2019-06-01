import React from 'react';
import { Segment, Comment } from 'semantic-ui-react';
import MessagesHeader from './MessageHeader';
import MessageForm from './MessageFrom';
import firebase from '../../firebase';
import Message from './Message';

class Messages extends React.Component {
    state = {
        messagesRef: firebase.database().ref('messages'),
        messages: [],
        messagesLoading: true,
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        progressBar: false,
        numUniqueUsers: ""
    }
    componentDidMount(){
        const {channel, user} = this.state;

        if (channel && user){
            this.addListeners(channel.id);
        }
    }

    addListeners = (channelId) => {
        this.addMessageListenrt(channelId);
    }

    addMessageListenrt = (channelId) => {
        let loadMessages = [];
        this.state.messagesRef.child(channelId).on("child_added", snap => {
            loadMessages.push(snap.val());
            // console.log(loadMessages);
            this.setState({
                messages: loadMessages,
                messagesLoading: false
            });
            this.countUniqueUsers(this.state.messages);
        })
    }

    countUniqueUsers = messages => {
        const uniqueUsers = messages.reduce((acc, message) => {
            if(!acc.includes(message.user.name)){
                acc.push(message.user.name);
            }
            return acc;
        }, []);
        const numUniqueUsers = `${uniqueUsers.length} 位用户`;
        this.setState({numUniqueUsers: numUniqueUsers});
    }

    displayMessages = messages => (
        messages.length > 0 && messages.map(message => (
            <Message
                key={message.timestamp}
                message={message}
                user={this.state.user}
            />
        ))
    )

    isProgressBarVisible = percent => {
        if (percent > 0){
            this.setState({progressBar: true});
        }
    }

    displayChannelName = channel => channel ? `#${channel.name}` : '';

    render(){
        const {messagesRef, messages, channel, user, progressBar, numUniqueUsers} = this.state;
        return(
            <React.Fragment>
                <MessagesHeader
                    channelName={this.displayChannelName(channel)}
                    numUniqueUsers={numUniqueUsers}
                />

                <Segment>
                    <Comment.Group className={progressBar ? 'messages__progress' : 'messages' }>
                        {/* Messages */}
                        {this.displayMessages(messages)}
                    </Comment.Group>
                </Segment>

                <MessageForm 
                    messagesRef = {messagesRef} 
                    currentChannel={channel}
                    currentUser={user}
                    isProgressBarVisible={this.isProgressBarVisible}
                 />
            </React.Fragment>
        )
    } 
}

export default Messages;