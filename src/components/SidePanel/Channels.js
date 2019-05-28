import React from 'react';
import {Menu, Icon, Modal, Form, Input, Button} from "semantic-ui-react";
import firebase from '../../firebase';
import { connect } from 'react-redux';
import { setCurrentChannel } from '../../actions';

class Channels extends React.Component {
    state = {
        activeChannel: '',
        user: this.props.currentUser,
        channels: [],
        channelName: '',
        channelDetails: '',
        channelsRef: firebase.database().ref('channels'),
        modal: false,
        firstLoad: true
    }

    componentDidMount(){
        this.addListeners();
    }

    componentWillUnmount(){
        this.removeListeners();
    }

    addListeners = () => {
        let loadedChannels = [];
        this.state.channelsRef.on('child_added', snap => {
            loadedChannels.push(snap.val());
            // console.log(loadChannels);
            this.setState({channels: loadedChannels}, () => this.setFirstChannel());
        })
    }

    removeListeners = () => {
        this.state.channelsRef.off();
    }

    setFirstChannel = () => {
        const firstChannel = this.state.channels[0];
        if (this.state.firstLoad && this.state.channels.length > 0){
            this.props.setCurrentChannel(firstChannel);
            this.setState({activeChannel: firstChannel.id});
        }

        this.setState({firstLoad: false});
    }



    addChannel = () => {
        const {channelsRef, channelName, channelDetails, user} = this.state;

        const key = channelsRef.push().key;

        const newChannel = {
            id: key,
            name: channelName,
            details: channelDetails,
            createdBy: {
                name: user.displayName,
                avatar: user.photoURL
            }
        };

        channelsRef
            .child(key)
            .update(newChannel)
            .then(()=> {
                this.setState({channelName: "", channelDetails: ""});
                this.closeModal();
                console.log("channel added");
            })
            .catch(err => {
                console.log(err);
            })
    }

    handleSubmit = event => {
        event.preventDefault();
        if (this.isFormValid(this.state)){
            this.addChannel();
        }
    }

    isFormValid = ({channelName, channelDetails}) => channelName && channelDetails;

    handleChange = event => {
        this.setState({[event.target.name]: event.target.value})
    };

    openModal = () => this.setState({modal: true});

    closeModal = () => this.setState({modal: false});

    changeChannel = channel => {
        this.setActiveChannel(channel);
        this.props.setCurrentChannel(channel);
    };

    setActiveChannel = (channel) => {
        this.setState({activeChannel: channel.id});
    }

    displayChannels = (channels) => (
        channels.length > 0 && channels.map(channel => (
            <Menu.Item
                key={channel.id}
                onClick={()=> this.changeChannel(channel)}
                name={channel.name}
                style={{opacity: 0.7}}
                active={channel.id === this.state.activeChannel}
            >
                # {channel.name}
            </Menu.Item>
        ))
    )

    render(){
        const {channels, modal} = this.state;

        return(
            <React.Fragment>
                <Menu.Menu style={{paddingBottom: '2rem'}}>
                <Menu.Item>
                    <span>
                        <Icon name="exchange" /> 聊天室
                    </span>{' '}
                    ({channels.length})<Icon name="add" onClick={this.openModal} className="pointer" />
                </Menu.Item>
                {/* Channels */}
                {this.displayChannels(channels)}
            </Menu.Menu>
            
            {/* add channel modal */}
             <Modal basic open={modal} onClose={this.closeModal}>
                <Modal.Header>新增聊天室</Modal.Header>
                <Modal.Content>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Field>
                            <Input fluid label="聊天室名称" name="channelName" onChange={this.handleChange}/>
                        </Form.Field>

                        <Form.Field>
                            <Input fluid label="写点介绍吧" name="channelDetails" onChange={this.handleChange}/>
                        </Form.Field>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button color="green" inverted onClick={this.handleSubmit}>
                        <Icon name="checkmark" /> 新增
                    </Button>

                    <Button color="red" inverted onClick={this.closeModal}>
                        <Icon name="remove" /> 取消
                    </Button>
                </Modal.Actions>
             </Modal>
            </React.Fragment>
            
        )
    }
}

export default connect(null, {setCurrentChannel})(Channels);