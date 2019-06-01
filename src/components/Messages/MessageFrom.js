import React from "react";
import uuidv4 from 'uuid/v4';
import {Segment, Button, Input, Header, Progress} from "semantic-ui-react";
import firebase from '../../firebase';
import FileModal from "./FileModal";
import axios from "axios";
import ProgressBar from './ProgressBar';

class MessageForm extends React.Component {
    constructor(props){
        super(props);
        this.compositionStatus = true;
        this.state = {
            storageRef: firebase.storage().ref(),
            uploadState: '',
            uploadTask: null,
            message: "",
            percentUploaded: 0,
            channel: this.props.currentChannel,
            user: this.props.currentUser,
            loading: false,
            errors: [],
            modal: false,
            apiFetch: false,
            emotion: "",
            emotionProbability: 0,
            percent: 60,
            compositionStatus: true
        }

    }
   


    openModal = () => this.setState({modal: true});

    closeModal = () => this.setState({modal: false});

    handleChange = event => {
        // if (this.state.compositionStatus){
        //     this.setState({[event.target.name]: event.target.value});
        // }
        this.setState({[event.target.name]: event.target.value});
        //     console.log("yes");
        //     //this.setState({[event.target.name]: event.target.value});
            
        //     console.log(this.state.message);
        //     // let msg = this.state.message;
        //     // this.sendApi(msg);
        // }
        // this.setState({message: event.target.value});
        // console.log(this.state.message);
        

        // this.setState({message: event.target.value});
        let msg = this.state.message;
        this.sendApi(msg);
        
        
    }

    sendApi = (msg) => {
        if (msg ==""){
            return;
        }
        if (msg != "" && this.state.apiFetch === false){
            this.setState({apiFetch: true});
            msg = this.deleteSpace(msg);
            axios.get(`http://127.0.0.1:5000/api/${msg}`)
                .then(res => {
                    //console.log(res.data.prob);
                    console.log(this.showEmotionEmoji(res.data.prob));
                    
                    this.setState({
                        emotion: this.showEmotionEmoji(res.data.prob),
                        emotionProbability: Math.round((res.data.prob)*100)
                     });
                    this.setState({apiFetch: false});
                })
                .catch(err =>{
                    console.log(err);
                    this.setState({apiFetch: false});
                })
        }else if (msg == ""){
            this.setState({emotionProbability: 0, emotion: ""});
        }
    }

    deleteSpace = (sentence) => sentence.replace(/\s+/g, '');

    showEmotionEmoji = (probability) => {
        if (probability >= 0.8){
            return "😍";
        }else if (probability >= 0.6){
            return "😊";
        }else if (probability >= 0.4){
            return "😐";
        }else if (probability >= 0.2){
            return "🙁";
        }else {
            return "😤";
        }
    }

    createMessage = (fileUrl = null) => {
        
        const message = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: this.state.user.uid,
                name: this.state.user.displayName,
                avatar: this.state.user.photoURL
            },
            //content: this.state.message
        };

        if (fileUrl !== null){
            message['image'] = fileUrl;
        } else {
            message['content'] = this.state.message;
            message['emotionProb'] = this.state.emotionProbability;
            message['emotionEmoji'] = this.state.emotion;
        }
        
        
        return message
    };

    

    sendMessage = () => {
        const {messagesRef} = this.props;
        const {message, channel} = this.state;

        if (message){
            this.setState({loading: false});
            messagesRef
                .child(channel.id)
                .push()
                .set(this.createMessage())
                .then(() => {
                    this.setState({loading: false, message: "", errors:[]});
                    console.log("msg sent");
                })
                .catch(err => {
                    console.error(err);
                    this.setState({
                        loading: false,
                        errors: this.state.errors.concat(err)
                    });
                })
        }else{
            this.setState({
                errors: this.state.errors.concat({message: '请输入信息'})
            });
        }
    }

    uploadFile = (file, metadata) => {
        // console.log(file, metadata);
        const pathToUplaod = this.state.channel.id;
        const ref = this.props.messagesRef;
        const filePath = `chat/public/${uuidv4()}.jpg`;

        this.setState({
            uploadState: 'uploading',
            uploadTask: this.state.storageRef.child(filePath).put(file, metadata)
        },
            ()=> {
                this.state.uploadTask.on('state_changed', snap => {
                    const percentUploaded = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
                    this.props.isProgressBarVisible(percentUploaded);
                    this.setState({percentUploaded});
                },
                    err => {
                        console.error(err);
                        this.setState({
                            errors: this.state.errors.concat(err),
                            uploadState: 'error',
                            uploadTask: null
                        });
                    },
                    () => {
                        this.state.uploadTask.snapshot.ref.getDownloadURL().then(downloadUrl => {
                            this.sendFileMessage(downloadUrl, ref, pathToUplaod);
                        })
                            .catch(err => {
                                console.error(err);
                                this.setState({
                                    errors: this.state.errors.concat(err),
                                    uploadState: 'error',
                                    uploadTask: null
                                });
                            })
                    }
                )
            }
        )
    };

    sendFileMessage = (fileUrl, ref, pathToUplaod) => {
        ref.child(pathToUplaod)
            .push()
            .set(this.createMessage(fileUrl))
            .then(()=>{
                this.setState({uploadState: 'done'})
            })
            .catch(err => {
                console.error(err);
                this.setState({
                    errors: this.state.errors.concat(err),
                });
            })
    }

    handlingComposition = () => {
        this.setState({compositionStatus: false});
        let msg = this.state.message;
        this.sendApi(msg);
    }
    handleComposition = (e) => {
        this.setState({compositionStatus: true});
        this.setState({message: e.target.value});
        let msg = this.state.message;
        this.sendApi(msg);
        
    }

    


    render(){
        const {errors, message, loading, modal, uploadState, percentUploaded} = this.state;
 
        return(
            <Segment className="message__form">
                <Input 
                    fluid
                    name="message"
                    value={message}
                    style={{marginBottom: '0.7rem'}}
                    label={<Button icon="add" />}
                    labelPosition="left"
                    placeholder="写点什么吧"
                    className={
                        errors.some(error => error.message.includes('信息')) ? 'error' : ''
                    }
                    // onCompositionStart={this.handlingComposition}
                    // onCompositionUpdate={this.handlingComposition}
                    // onCompositionEnd={this.handleComposition}
                    onChange={this.handleChange}
                    
                />

                {this.state.emotion && this.state.emotionProbability && <Header>{this.state.emotion} {this.state.emotionProbability}</Header> }
                
                {this.state.emotionProbability !== 0 && <Progress percent={this.state.emotionProbability} indicating progress='value' value={this.state.emotionProbability} inverted size='small'>{this.state.emotion}</Progress> }


                <Button.Group icon widths="2">
                    <Button 
                        onClick={this.sendMessage}
                        color="orange"
                        content="添加回覆"
                        labelPosition="left"
                        icon="edit"
                        disabled={loading}
                    />

                    <Button 
                        color='teal'
                        content="上传附件"
                        labelPosition="right"
                        icon="cloud upload"
                        onClick={this.openModal}
                        disabled={uploadState ==='uploading'}
                    />
                </Button.Group>
                <FileModal 
                        modal={modal}
                        closeModal={this.closeModal}
                        uploadFile = {this.uploadFile}
                    />
                {uploadState === 'uploading' && <ProgressBar 
                    uploadState={uploadState}
                    percentUploaded={percentUploaded}
                />}
            </Segment>
        )
    }
}

export default MessageForm;