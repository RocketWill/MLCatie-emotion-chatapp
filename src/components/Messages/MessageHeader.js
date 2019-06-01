import React from 'react';
import {Header, Segment, Input, Icon} from 'semantic-ui-react';

class MessagesHeader extends React.Component {
    render(){
        const { channelName, numUniqueUsers } = this.props;
        return(
            <Segment clearing>
                {/* Channel Title */}
                <Header fluid="true" as="h2" floated="left" style={{marginBottom: 0}}>
                <span>
                    {channelName}
                    <Icon name={"star outline"} color="black" style={{width: 20}} />
                </span>

                <Header.Subheader>{numUniqueUsers}</Header.Subheader>
                    
                {/* Channel Search Input */}
                </Header>
                <Header floated="right">
                    <Input 
                        size="mini"
                        icon="search"
                        name="searchTerm"
                        placeholder="搜索聊天记录"
                     />
                </Header>
            </Segment>
        )
    }
}

export default MessagesHeader;