import React from 'react';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'

import APIEndPoints from '../utils/APIEndPoints'
import httpClient from '../utils/httpClient'
import Loader from './loader';
import { ComponentHelpers, connect } from '../utils/componentHelper';


class Login extends ComponentHelpers {

  state = {
    emailId: "", //asifali_121@mailinator.com
    password: "secret", //secret
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
        httpClient.setDefaultHeader('access-token', response.data && response.data.access_token)
        localStorage.setItem("user", JSON.stringify(response.data))
        const url = localStorage.getItem('URL')
        if (url) {
          this.props.history.push(url)
        } else {
          this.props.history.push('/')
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
      <>
        <div className="contactUsWrapp">
        <div className='cnt-nav'>
          <Link to={localStorage.getItem('URL') === null ? '/' : '/cart'}>
            <img className='prevBtn' alt="loading.." src='./images/prevBtn.png' />
          </Link>
          <h4 style={{ marginLeft: '1%' }}>Login</h4>
        </div>
        </div>
        <div className="LoginWrapp">
          <Loader data={this.state.loading} />
          <form onSubmit={(e) => this.login(e)} className="forCenter">
            <div className="inpWrap">
              <p>E-mail ID/ Phone number</p>
              <input
                required
                type="text"
                onChange={(e) => this.setState({ emailId: e.target.value })} />
            </div>
            <div className="inpWrap">
              <p>Password</p>
              <input
                type="password"
                required
                onChange={(e) => this.setState({ password: e.target.value })} />
            </div>
            <button type="reset" onClick={(e)=>{e.preventDefault();this.forgotPassword()}} className="fPassLink">Forget password?</button>
            <button type="submit" disabled={this.state.loginBtnText === 'Please Wait'} className="LogindoneBtn">{this.state.loginBtnText}</button>
            <Link to="/register"><button style={{marginTop: '4%'}} className="LogindoneBtn">Register</button></Link>
          </form>
        </div>
      </>
    )
  }

}
export default connect(Login);
