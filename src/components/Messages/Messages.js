import React from 'react';
import { Segment, Comment } from 'semantic-ui-react';
import MessagesHeader from './MessageHeader';
import MessageForm from './MessageFrom';
import firebase from '../../firebase';
import Message from './Message';
import { connect } from 'react-redux';
import { setUserPosts } from '../../actions/index';
import Typing from './Typing';
import Skeleton from './Skeleton';

class Messages extends React.Component {
    state = {
        privateChannel: this.props.isPrivateChannel,
        privateMessagesRef: firebase.database().ref('privateMessages'),
        messagesRef: firebase.database().ref('messages'),
        usersRef: firebase.database().ref('users'),
        typingRef: firebase.database().ref('typing'),
        messages: [],
        messagesLoading: true,
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        progressBar: false,
        numUniqueUsers: "",
        searchTerm: '',
        searchLoading: false,
        searchResults: [],
        isChannelStarred: false,
        typingUsers: [],
        connectedRef: firebase.database().ref('.info/connected'),
        listeners: []
    }
    componentDidMount(){
        const {channel, user, listeners} = this.state;

        if (channel && user){
            this.removeListeners(listeners);
            this.addListeners(channel.id);
            this.addUserStarsListener(channel.id, user.uid)
        }
    }

    componentDidUpdate(prevProps, prevState){
        if (this.messageEnd){
            this.scrollToBottom({behavior: 'smooth'});
        }
    }

    componentWillUnmount(){
        this.removeListeners(this.state.listeners);
        this.state.connectedRef.off();
    }
    
    removeListeners = listeners => {
        listeners.forEach(listener => {
            listener.ref.child(listener.id).off(listener.event);
        })
    }

    addToListeners = (id, ref, event) => {
        const index = this.state.listeners.findIndex(listener => {
            return listener.id === id && listener.ref === ref && listener.event === event;
        })

        if (index === -1){
            const newListener = {id, ref, event};
            this.setState({
                listeners: this.state.listeners.concat(newListener)
            });
        }
    }

    scrollToBottom = () => {
        this.messageEnd.scrollIntoView();
    }

    addListeners = (channelId) => {
        this.addMessageListenrt(channelId);
        this.addTypingListeners(channelId);
    }

    addTypingListeners = channelId => {
        let typingUsers = [];
        this.state.typingRef
            .child(channelId)
            .on("child_added", snap => {
                if (snap.key !== this.state.user.uid){
                    typingUsers = typingUsers.concat({
                        id: snap.key,
                        name: snap.val()
                    });
                    this.setState({typingUsers});
                }
            })

        this.addToListeners(channelId, this.state.typingRef, "child_added");

        this.state.typingRef.child(channelId).on('child_removed', snap => {
            const index = typingUsers.findIndex(user => user.id === snap.key);
            if (index !== -1){
                typingUsers = typingUsers.filter(user => user.id !== snap.key);
                this.setState({typingUsers});
            }
        })

        this.addToListeners(channelId, this.state.typingRef, "child_removed");

        this.state.connectedRef.on('value', snap => {
            if (snap.val() === true){
                this.state.typingRef
                    .child(channelId)
                    .child(this.state.user.uid)
                    .onDisconnect()
                    .remove(err => {
                        if (err !== null){
                            console.error(err);
                        }
                    })
            }
        })
    }

    addMessageListenrt = (channelId) => {
        let loadMessages = [];
        const ref = this.getMessagesRef();
        ref.child(channelId).on("child_added", snap => {
            loadMessages.push(snap.val());
            // console.log(loadMessages);
            this.setState({
                messages: loadMessages,
                messagesLoading: false
            });
            this.countUniqueUsers(this.state.messages);
            this.countUserPosts(loadMessages);
        })

        this.addToListeners(channelId, ref, "child_added");
    }

    addUserStarsListener = (channelId, userId) =>{
        this.state.usersRef
            .child(userId)
            .child("starred")
            .once('value')
            .then(data => {
                if (data.val() !== null){
                    const channelIds = Object.keys(data.val());
                    const prevStarred = channelIds.includes(channelId);
                    this.setState({isChannelStarred: prevStarred});
                }
            })
    }

    getMessagesRef = () => {
        const {messagesRef, privateMessagesRef, privateChannel} = this.state;
        return privateChannel ? privateMessagesRef : messagesRef;

    }

    handleStar = () => {
        this.setState(prevState => ({
            isChannelStarred: !prevState.isChannelStarred
        }), () => this.starChannel());
    }

    starChannel = () => {
        if (this.state.isChannelStarred){
            // console.log("star");
            this.state.usersRef
                .child(`${this.state.user.uid}/starred`)
                .update({
                    [this.state.channel.id]: {
                        name: this.state.channel.name,
                        details: this.state.channel.details,
                        createdBy: {
                            name: this.state.channel.createdBy.name,
                            avatar: this.state.channel.createdBy.avatar
                        }
                    }
                });
        } else {
            this.state.usersRef
                .child(`${this.state.user.uid}/starred`)
                .child(this.state.channel.id)
                .remove(err => {
                    if (err !== null){
                        console.error(err);
                    }
                });
        }
    }
    
    handleSearchChange = event => {
        this.setState({
            searchTerm: event.target.value,
            searchLoading: true
        }, () => this.handleSearchMessages());
    }

    handleSearchMessages = () => {
        const channelMessages = [...this.state.messages];
        const regex = new RegExp(this.state.searchTerm, 'gi');
        const searchResults = channelMessages.reduce((acc, message) => {
            if(message.content && message.content.match(regex) || message.user.name.match(regex)){
                acc.push(message)
            }
            return acc;
        }, []);
        this.setState({searchResults});
        setTimeout(() => this.setState({searchLoading: false}), 1000);

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

    countUserPosts = messages => {
        let userPosts = messages.reduce((acc, message)=> {
            if (message.user.name in acc){
                acc[message.user.name].count += 1;
            }else {
                acc[message.user.name] = {
                    avatar: message.user.avatar,
                    count: 1
                }
            }
            return acc;
        }, {});
        this.props.setUserPosts(userPosts);
    }

    displayChannelName = channel => {
        return channel ? `${this.state.privateChannel ? "@" : "#"} ${channel.name}` : '';
    }

    displayTypingUsers = users => (
        users.length > 0 && users.map(user => (
            <div style={{display: 'flex', alignItems:'center', marginBottom:'0.2em'}} key={user.id}>
                <span className="user__typing">{user.name} 正在输入</span> <Typing />
            </div> 
        ))
    )

    displayMessagesSkeleton = loading => (
        loading ? (
            <React.Fragment>
                {[...Array(10)].map((_, i) => (
                    <Skeleton key={i} />
                ))}
            </React.Fragment>
        ) : null
    )

    render(){
        const {messagesRef, messages, channel, user, progressBar, numUniqueUsers, searchTerm, searchResults, searchLoading, privateChannel, isChannelStarred, typingUsers, messagesLoading} = this.state;
        return(
            <React.Fragment>
                <MessagesHeader
                    channelName={this.displayChannelName(channel)}
                    numUniqueUsers={numUniqueUsers}
                    handleSearchChange={this.handleSearchChange}
                    searchLoading={searchLoading}
                    isPrivateChannel={privateChannel}
                    handleStar={this.handleStar}
                    isChannelStarred={isChannelStarred}
                />

                <Segment>
                    <Comment.Group className={progressBar ? 'messages__progress' : 'messages' }>
                        {this.displayMessagesSkeleton(messagesLoading)}
                        {/* Messages */}
                        {searchTerm ? this.displayMessages(searchResults) : this.displayMessages(messages)}
                        {this.displayTypingUsers(typingUsers)}
                        <div ref={node => (this.messageEnd = node)}></div>
                    </Comment.Group>
                </Segment>

                <MessageForm 
                    messagesRef = {messagesRef} 
                    currentChannel={channel}
                    currentUser={user}
                    isProgressBarVisible={this.isProgressBarVisible}
                    isPrivateChannel={privateChannel}
                    getMessagesRef={this.getMessagesRef}
                 />
            </React.Fragment>
        )
    } 
}

export default connect(null, {setUserPosts})(Messages);