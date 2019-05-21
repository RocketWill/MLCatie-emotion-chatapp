import React from 'react';
import {Grid, Form, Segment, Button, Header, Message, Icon, Image} from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import logo from '../../static/images/logo.png';
import firebase from '../../firebase';


class Login extends React.Component {
    state = {
        username: '',
        email: '',
        password: '',
        passwordComfirmation: '',
        errors : [],
        loading: false,
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }


    displayErrors = (errors) => errors.map((err, idx) => <p key={idx}>{err.message}</p>);

    handleSubmit = (event) => {
        event.preventDefault();
        if (this.isFormValid(this.state)){
            this.setState({errors:[], loading: true});
            firebase
                .auth()
                .signInWithEmailAndPassword(this.state.email, this.state.password)
                .then(signInUser => {
                    console.log(signInUser);
                })
                .catch(err => {
                    console.log(err);
                    this.setState({
                        errors: this.state.errors.concat(err),
                        loading: false
                    });
                });
        }
    }
    
    isFormValid = ({email, password}) => email && password;

    handleInputError = (errors, inputname) => {
        return errors.some(error => error.message.toLowerCase().includes(inputname))? 'error':'';
    }

    render(){
        const {username, email, password, passwordComfirmation, errors, loading} = this.state;
        return (
            <Grid textAlign="center" verticalAlign="middle" className='app'>
                <Grid.Column style={{maxWidth: 450}}>
                    <Image className="img-center" style={{maxWidth: 200}} src={logo}></Image>
                    <Header as="h2" icon color="grey" textAlign="center">
                        登入机器喵
                    </Header>
                    <Form onSubmit={this.handleSubmit} size="large">
                        <Segment stacked>
                        
                            <Form.Input fluid name="email" icon="mail" iconPosition="left" placeholder="邮箱" 
                            onChange={this.handleChange} type="email" value={email} className={this.handleInputError(errors, 'email')} />

                            <Form.Input fluid name="password" icon="lock" iconPosition="left" placeholder="密码" 
                            onChange={this.handleChange} type="password" value={password} className={this.handleInputError(errors, 'password')}/>

                            <Button disabled={loading} className={loading?'loading':''} color="blue" fluid size="large" >登入</Button>

                        </Segment>
                        
                    </Form>
                    {errors.length > 0 && (
                        <Message error>
                            <h4>错误提示</h4>
                            {this.displayErrors(errors)}
                        </Message>
                    )}
                    <Message>还没有帐户吗？  <Link to="/register">前往注册</Link></Message>
                </Grid.Column>
            </Grid>
        )
    }
}

export default Login;
