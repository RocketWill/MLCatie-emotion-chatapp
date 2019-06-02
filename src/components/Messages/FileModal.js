import React from 'react';
import mime from 'mime-types';
import {Modal, Input, Button, Icon} from "semantic-ui-react";

class FileModal extends React.Component {
    state={
        file: null,
        authorized: ['image/jpeg', 'image/png']
        
    }

    addFile = event => {
        const file = event.target.files[0];
        // console.log(file);
        if (file){
            this.setState({file: file});
        }
    }

    sendFile = () => {
        const {file} = this.state;
        const {uploadFile, closeModal} = this.props;
        if (file !== null){
            if (this.isAuthorized(file.name)){
                // send file
                const metadata = {contentType: mime.lookup(file.name)};
                uploadFile(file, metadata);
                closeModal();
                this.clearFile();
            }
        }
    }

    isAuthorized = filename => this.state.authorized.includes(mime.lookup(filename));

    clearFile = () => this.setState({file: null});

    render(){
        const {modal, closeModal} = this.props;
        return(
            <Modal basic open={modal} onClose={closeModal}>
                <Modal.Header>选择一张图片</Modal.Header>
                <Modal.Content>
                    <Input
                        fluid
                        label="图片格式： jpg, png"
                        name="file"
                        type="file"
                        onChange={this.addFile}
                    />
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        color="green"
                        inverted
                        onClick={this.sendFile}
                    >
                        <Icon name="checkmark" /> 送出
                    </Button>
                    <Button
                        color="red"
                        inverted
                        onClick={closeModal}
                    >
                        <Icon name="remove" /> 取消
                    </Button>
                </Modal.Actions>
                
            </Modal>
        )
    }
}

export default FileModal;