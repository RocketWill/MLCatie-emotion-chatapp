import React from 'react';
import {Grid, Form, Segment, Button, Header, Message, Icon, Image} from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import logo from '../../static/images/logo.png'


class Register extends React.Component {
state = {}

    handleChange = () => {}

    render(){
        return (
            <Grid textAlign="center" verticalAlign="middle" className='app'>
                <Grid.Column style={{maxWidth: 450}}>
                    <Image className="img-center" style={{maxWidth: 200}} src={logo}></Image>
                    <Header as="h2" icon color="blue" textAlign="center">
                        注册成为 MLCatie｜机器喵 的会员
                    </Header>
                    <Form size="large">
                        <Segment stacked>
                            <Form.Input fluid name="username" icon="user" iconPosition="left" placeholder="暱称" 
                            onChange={this.handleChange} type="text" />

                            <Form.Input fluid name="email" icon="mail" iconPosition="left" placeholder="邮箱" 
                            onChange={this.handleChange} type="email" />

                            <Form.Input fluid name="password" icon="lock" iconPosition="left" placeholder="密码" 
                            onChange={this.handleChange} type="password" />

                            <Form.Input fluid name="passwordComfirmation" icon="repeat" iconPosition="left" placeholder="请再输入一次密码" 
                            onChange={this.handleChange} type="password" />

                            <Button color="blue" fluid size="large" >注册</Button>

                        </Segment>
                        <Message>已经是会员了吗？ <Link to="/login">登入</Link></Message>
                    </Form>
                </Grid.Column>
            </Grid>
        )
    }
}

export default Register;