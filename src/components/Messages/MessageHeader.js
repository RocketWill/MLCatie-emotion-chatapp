import React from 'react';
import {Header, Segment, Input, Icon} from 'semantic-ui-react';

class MessagesHeader extends React.Component {



    render(){
        const { channelName, numUniqueUsers, handleSearchChange, searchLoading, isPrivateChannel, handleStar, isChannelStarred } = this.props;
        return(
            <Segment clearing>
                {/* Channel Title */}
                <Header fluid="true" as="h2" floated="left" style={{marginBottom: 0}}>
                <span>
                    {channelName}
                    {!isPrivateChannel && (
                        <Icon 
                            onClick={handleStar} 
                            name={isChannelStarred ? 'star' : 'star outline'} 
                            color={isChannelStarred ? 'yellow' : 'black'} 
                            style={{width: 20}} 
                            className="pointer"
                        />
                    )}
                </span>

                <Header.Subheader>{numUniqueUsers}</Header.Subheader>
                    
                {/* Channel Search Input */}
                </Header>
                <Header floated="right">
                    <Input 
                        loading={searchLoading}
                        size="mini"
                        icon="search"
                        name="searchTerm"
                        placeholder="搜索聊天记录"
                        onChange={handleSearchChange}
                     />
                </Header>
            </Segment>
        )
    }
}

export default MessagesHeader;