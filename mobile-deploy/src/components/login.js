import React from 'react';
import { connect } from 'react-redux'
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'

import APIEndPoints from '../utils/APIEndPoints'
import httpClient from '../utils/httpClient'
import {addUserDetails} from '../actions/actions'

let mapStateToProps = (state) => {
  return { data: state }
}

let mapDispatchToProps = (dispatch)=>{
  return {
    UserDetails: user => dispatch(addUserDetails(user))
  }
}

class Login extends React.Component {

  state = {
    emailId: "asifali_121@mailinator.com",
    password: "secret",
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
          console.log(this.props.data.userDetails)
          localStorage.setItem("user",JSON.stringify(response.data))
          this.props.history.push('/')
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
          <button disabled={this.state.loginBtnText === 'Please Wait'} className="LogindoneBtn" onClick={()=>this.login()}>{this.state.loginBtnText}</button>
        </div>
      </div>
    )
  }

}
export default connect(mapStateToProps, mapDispatchToProps)(Login);
