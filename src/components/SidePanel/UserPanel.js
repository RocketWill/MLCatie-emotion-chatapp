import React from 'react';
import { Grid, Header, Icon, Dropdown, Image } from 'semantic-ui-react';
import firebase from '../../firebase';
import { auth } from 'firebase';
import { connect } from 'react-redux';
import textLogo from '../../static/images/logo_alt.png';

class UserPanel extends React.Component {
    state = {
        user: this.props.currentUser
    }


    dropDownOptions = () => [
        {   
            key: 'user',
            text: <span>以 <strong>{this.state.user.displayName}</strong> 身份登入</span>,
            disable: true
        },
        {
            key: 'avatar',
            text: <span>更换头像</span>
        },
        {
            key: 'signout',
            text: <span onClick={this.handleSignout}>登出</span>
        }
    ];

    handleSignout = () => {
        firebase
            .auth()
            .signOut()
            .then(() => console.log("signed out"))
    }

    render(){
        const {user} = this.state;
        return (
            <Grid style={{background: '#4c3c4c'}}>
                <Grid.Column>
                    <Grid.Row style={{padding: '1.2em', margin: 0}}>
                        {/* App Header */}
                        <Header inverted floated="left" as="h3">
                            {/* <Icon name="code" /> */}
                            <Image src={textLogo} style={{width: 300}} />
                            {/* <Header.Content>喵喵机器喵</Header.Content> */}
                        </Header>
                        {/* User Dropdown */}
                    <Header style={{padding: '0.25em'}} as="h4" inverted>
                        <Dropdown trigger={
                            <span>
                                <Image src={user.photoURL} spaced="right" avatar />
                                {user.displayName}
                            </span>
                        } options={this.dropDownOptions()} />
                    </Header>
                    </Grid.Row>

                    
                </Grid.Column>
            </Grid>
        )
    }
}

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser
})

const mapDispatchToProps = {
  
}

export default UserPanel;