import React from 'react';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'

import APIEndPoints from '../utils/APIEndPoints'
import httpClient from '../utils/httpClient'
import {addUserDetails} from '../actions/actions'
import { ComponentHelpers, connect } from '../utils/componentHelper';

class Login extends ComponentHelpers {

  state = {
    emailId: "", // login username
    password: "", //login password
    loggedIn: false,
    loginBtnText: 'Log In'
  }


  login = async () => {
    try {
      this.setState({loginBtnText: 'Please Wait'})
      const response = await httpClient.ApiCall('post', APIEndPoints.login,
        {
          login_name: this.state.emailId,
          password: this.state.password
        })
        if(response &&  response.success === 1){
          this.props.UserDetails(response.data)
				  httpClient.setDefaultHeader('access-token', response.data.access_token)
          const url = localStorage.getItem('URL')
          localStorage.removeItem('URL')
          if(url === null){
            this.props.history.push('/')
          } else{
            this.props.history.push(url)
          }
        } else{
          this.setState({loginBtnText: 'Log In'})
        }
    } catch (error) {
      this.setState({loginBtnText: 'Log In'})
      console.log(error)
    }

    return false
  }

  render() {
    return (
      <div className="appContainer">
      <div className="LoginWrapp">
        <div className="forCenter">
          <div className="inpWrap">
            <p>E-mail ID/ Phone number</p>
            <input type="email" onChange={(e) => this.setState({ emailId: e.target.value })}></input>
          </div>
          <div className="inpWrap">
            <p>Password</p>
            <input type="password" onChange={(e) => this.setState({ password: e.target.value })}></input>
          </div>
          <Link className="fPassLink" to="/login">Forget password?</Link>
          <button style={{marginBottom:'6%'}} disabled={this.state.loginBtnText === 'Please Wait'} className="LogindoneBtn" onClick={()=>this.login()}>{this.state.loginBtnText}</button>
        </div>
      </div>
      </div>
    )
  }

}
export default connect(Login);
