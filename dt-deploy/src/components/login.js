import React from 'react';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'

import APIEndPoints from '../utils/APIEndPoints'
import httpClient from '../utils/httpClient'
import { addUserDetails } from '../actions/actions'
import { ComponentHelpers, connect } from '../utils/componentHelper';
import Loading from './loader'
import { ReactComponent as BackLogo } from '../assets/icons/back2.svg';

class Login extends ComponentHelpers {

  state = {
    emailId: "", //asifali_121@mailinator.com
    password: "", //secret
    loggedIn: false,
    loginBtnText: 'Log In',
    loading: false
  }


  login = async (e) => {
    e.preventDefault()
    try {
      this.setState({ loginBtnText: 'Please Wait', loading: true })
      const response = await httpClient.ApiCall('post', APIEndPoints.login,
        {
          login_name: this.state.emailId,
          password: this.state.password
        })
      if (response && response.success === 1) {
        this.props.UserDetails(response.data)
        httpClient.setDefaultHeader('access-token', response.data.access_token)
        const url = localStorage.getItem('URL')
        localStorage.removeItem('URL')
        if (url === null) {
          this.props.history.push('/')
        } else {
          this.props.history.push(url)
        }
      } else {
        this.NotificationManager.error(response.message, 'Error')
        this.setState({ loginBtnText: 'Log In', loading: false })
      }
    } catch (error) {
      error.response.data && this.NotificationManager.error(error.response.data.message, 'Error')
      this.setState({ loginBtnText: 'Log In', loading: false })
    }

    return false
  }

  forgotPassword = async ()=>{
    try {
      if(this.state.emailId === ''){
        return this.NotificationManager.warning("E-mail/phone number is required", "Warning!!")
      }
      this.setState({loading: true})
      const response = await httpClient.ApiCall('post', APIEndPoints.forgotPassword, {
        login_name: this.state.emailId
      })
      this.NotificationManager.success("Please check your mail/phone to reset password", "Success")
      this.setState({loading: false})
    } catch (error) {
      this.setState({loading: false})
      this.NotificationManager.error("Cannot reset password, Please try later", "Error")
    }
  }

  render() {
    return (
      <div className="appContainer">
        <Loading data={this.state.loading} />
        <div className='header'>
          <Link to={localStorage.getItem('URL') === null ? '/' : '/cart'}>
            <BackLogo />
          </Link>
            Login
        </div>
        <div className="LoginWrapp">
          <form className="forCenter" onSubmit={(e) => this.login(e)}>
            <div className="inpWrap">
              <p>E-mail ID/ Phone number</p>
              <input required type="text" onChange={(e) => this.setState({ emailId: e.target.value })}></input>
            </div>
            <div className="inpWrap">
              <p>Password</p>
              <input type="password" onChange={(e) => this.setState({ password: e.target.value })}></input>
            </div>
            <button type="reset" onClick={(e)=>{e.preventDefault();this.forgotPassword()}} className="fPassLink">Forget password?</button>
            <button type="submit" style={{ marginBottom: '10%', fontSize: '16px' }} disabled={this.state.loginBtnText === 'Please Wait'} className="LogindoneBtn" >{this.state.loginBtnText}</button>
            <Link to="/register" type="submit" style={{ marginBottom: '6%' }} className="LogindoneBtn" >Register</Link>
          </form>
        </div>
      </div>
    )
  }

}
export default connect(Login);
