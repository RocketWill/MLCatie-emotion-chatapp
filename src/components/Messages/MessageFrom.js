import React from "react";
import {Segment, Button, Input} from "semantic-ui-react";

class MessageForm extends React.Component {
    render(){
        return(
            <Segment className="message__form">
                <Input 
                    fluid
                    name="message"
                    style={{marginBottom: '0.7rem'}}
                    label={<Button icon="add" />}
                    labelPosition="left"
                    placeholder="写点什么吧"
                />
                <Button.Group icon widths="2">
                    <Button 
                        color="orange"
                        content="添加回覆"
                        labelPosition="left"
                        icon="edit"
                    />

                    <Button 
                        color='teal'
                        content="上传附件"
                        labelPosition="right"
                        icon="cloud upload"
                    />
                </Button.Group>
            </Segment>
        )
    }
}

export default MessageForm;