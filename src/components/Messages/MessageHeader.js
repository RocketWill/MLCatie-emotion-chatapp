import React from 'react';
import {Header, Segment, Input, Icon} from 'semantic-ui-react';

class MessagesHeader extends React.Component {
    render(){
        return(
            <Segment clearing>
                {/* Channel Title */}
                <Header fluid="true" as="h2" floated="left" style={{marginBottom: 0}}>
                <span>
                    Channel
                    <Icon name={"star outline"} color="black" />
                </span>

                <Header.Subheader>2 位在线</Header.Subheader>
                    
                {/* Channel Search Input */}
                </Header>
                <Header floated="right">
                    <Input 
                        size="mini"
                        icon="search"
                        name="searchTerm"
                        placeHolder="搜索聊天记录"
                     />
                </Header>
            </Segment>
        )
    }
}

export default MessagesHeader;