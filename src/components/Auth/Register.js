import React from 'react';
import {Grid, Form, Segment, Button, Header, Message, Icon, Image} from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import logo from '../../static/images/logo.png';
import firebase from '../../firebase';
import md5 from 'md5';


class Register extends React.Component {
    state = {
        username: '',
        email: '',
        password: '',
        passwordComfirmation: '',
        errors : [],
        loading: false,
        usersRef: firebase.database().ref('users'),
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    isFormValid = () => {
        let errors = [];
        let error;
        if (this.isFormEmpty(this.state)){
            error = {message: '请确认表单填写完整'};
            this.setState({errors: errors.concat(error)});
            return false;
        }
        else if (!this.isPasswordValid(this.state)){
            
            return false;
        }
        else {
            return true;
        }
    }

    isFormEmpty = ({username, email, password, passwordComfirmation}) => {
        return !username.length || !email.length || !password.length || !passwordComfirmation.length;
    }

    isPasswordValid = ({password, passwordComfirmation}) => {
        let errors = [];
        let error;
        if (password.length < 6 || passwordComfirmation.length < 6){
            error = {message: '密码不符合规范（需大于6位）'};
            this.setState({errors: errors.concat(error)});
            return false;
        }
        else if (password !== passwordComfirmation){
            error = {message: '密码不符合规范（两次输入不一致）'};
            this.setState({errors: errors.concat(error)});
            return false;
        }else{
            return true;
        }
    }

    displayErrors = (errors) => errors.map((err, idx) => <p key={idx}>{err.message}</p>);

    handleSubmit = (event) => {
        if (this.isFormValid()){
            this.setState({errors:[], loading: true});
            event.preventDefault();
            firebase
                .auth()
                .createUserAndRetrieveDataWithEmailAndPassword(this.state.email, this.state.password)
                .then(createdUser => {
                    console.log(createdUser);
                    createdUser.user.updateProfile({
                        displayName: this.state.username,
                        photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`,
                    })
                    .then(() => {
                        this.saveUser(createdUser).then(() => {
                            console.log('user saved');
                        })
                        this.setState({loading: false});
                    })
                    .catch( err => {
                        console.log(err);
                        this.setState({errors: this.state.errors.concat(err), loading: false});
                    });
                })
                .catch(err => {
                    console.log(err);
                });
        }
       
    }

    saveUser = createdUser => {
        return this.state.usersRef.child(createdUser.user.uid).set({
            name: createdUser.user.displayName,
            avatar: createdUser.user.photoURL
        })
    }

    handleInputError = (errors, inputname) => {
        return errors.some(error => error.message.toLowerCase().includes(inputname))? 'error':'';
    }

    render(){
        const {username, email, password, passwordComfirmation, errors, loading} = this.state;
        return (
            <Grid textAlign="center" verticalAlign="middle" className='app'>
                <Grid.Column style={{maxWidth: 450}}>
                    <Image className="img-center" style={{maxWidth: 200}} src={logo}></Image>
                    <Header className="header" as="h2" icon color="grey" textAlign="center">
                        成为机器喵会员
                    </Header>
                    <Form onSubmit={this.handleSubmit} size="large">
                        <Segment stacked>
                            <Form.Input fluid name="username" icon="user" iconPosition="left" placeholder="暱称" 
                            onChange={this.handleChange} type="text" value={username} />

                            <Form.Input fluid name="email" icon="mail" iconPosition="left" placeholder="邮箱" 
                            onChange={this.handleChange} type="email" value={email} className={this.handleInputError(errors, 'email')} />

                            <Form.Input fluid name="password" icon="lock" iconPosition="left" placeholder="密码" 
                            onChange={this.handleChange} type="password" value={password} className={this.handleInputError(errors, 'password')}/>

                            <Form.Input fluid name="passwordComfirmation" icon="repeat" iconPosition="left" placeholder="请再输入一次密码" 
                            onChange={this.handleChange} type="password" value={passwordComfirmation} className={this.handleInputError(errors, '')}/>

                            <Button disabled={loading} className={loading?'loading':''} color="blue" fluid size="large" >注册</Button>

                        </Segment>
                        
                    </Form>
                    {errors.length > 0 && (
                        <Message error>
                            <h4>错误提示</h4>
                            {this.displayErrors(errors)}
                        </Message>
                    )}
                    <Message>已经是会员了吗？ <Link to="/login">登入</Link></Message>
                </Grid.Column>
            </Grid>
        )
    }
}

export default Register;