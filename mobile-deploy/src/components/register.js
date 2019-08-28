import React from 'react';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'

import APIEndPoints from '../utils/APIEndPoints'
import httpClient from '../utils/httpClient'
import { ComponentHelpers, connect } from '../utils/componentHelper';
import Popup from 'reactjs-popup';

class Register extends ComponentHelpers {

  state = {
    email: "", //asifali_121@mailinator.com
    password: "",
    reEnterPassword: '',
    phone_no: '',
    name: '',
    loggedIn: false,
    registerBtnText: 'Register',
    otp: '',
    otpModal: false
  }

  otpVerify = async () => {
    this.setState({ loading: true })
    const respomse = await this.verifyOtp(this.state.confirmation_code, this.state.otp)
    if(!respomse){
      return
    }
    this.setState({ loading: false })
    const url = localStorage.getItem('URL')
    if (url) {
      localStorage.removeItem('URL')
      this.props.history.push(url)
    } else {
      this.props.history.push('/')
    }
  }

resendOTP = async()=>{
  await this.resendOtp(this.state.phone_no)
  this.setState({disabledBtn: true})
  setTimeout(()=>{
      this.setState({disabledBtn: false})
  },30000)
}



  register = async (e) => {
      e.preventDefault()
    try {
        const {name, email, password, phone_no}= this.state
      this.setState({registerBtnText: 'Please Wait'})
      const response = await httpClient.ApiCall('post', APIEndPoints.register,
        {
            name,
            email,
            password,
            phone_no
        })
        if(response &&  response.success === 1){
            
            this.setState({loading:false, registerBtnText: 'Register', otpModal: true, confirmation_code: response.data.confirmation_code})
            // this.verifyOtp(response.data.confirmation_code, this.state.otp)
        } else{
          this.setState({registerBtnText: 'Register', loading: false})
        }
    } catch (error) {
      this.setState({registerBtnText: 'Register'})
      console.log(error)
    }

    return false
  }

  render() {
    return (
      <div className="appContainer">
      <div className="LoginWrapp">
        <form onSubmit={(e)=>this.register(e)} className="forCenter">
          <div className="inpWrap">
            <p>Name</p>
            <input type="name" required onChange={(e) => this.setState({ name: e.target.value })}></input>
          </div>
          <div className="inpWrap">
            <p>Phone Number</p>
            <input max="10" min="10" type="text" required onChange={(e) => this.setState({ phone_no: e.target.value })}></input>
          </div>
          <div className="inpWrap">
            <p>E-mail ID</p>
            <input type="email" required onChange={(e) => this.setState({ email: e.target.value })}></input>
          </div>
          <div className="inpWrap">
            <p>Password</p>
            <input type="password" required onChange={(e) => this.setState({ password: e.target.value })}></input>
          </div>
          <button style={{marginBottom:'6%'}} disabled={this.state.registerBtnText === 'Please Wait'} className="LogindoneBtn" >{this.state.registerBtnText}</button>
        </form>
      </div>
      <Popup className="itemCart" position="right center" open={this.state.otpModal} onClose={() => this.setState({otpModal: false})}>
                    <div className="addressHeader">
                        <p>Enter OTP, which is sent to {this.state.phone_no}</p>
                        <hr />
                        <div>
                            <input style={{border: 'none', borderBottom: '1px solid grey'}} type='text' onChange={(e)=>this.setState({otp: e.target.value})}/>
                            <button className="verifyOtp"  type="submit" onClick={()=>this.otpVerify()}>Verify</button>
                            <button disabled={this.state.disabledBtn} className="resendOtp"  type="button" onClick={()=>this.resendOTP()}>Resend</button>
                            </div>
                    </div>
                </Popup>
      </div>
    )
  }

}
export default connect(Register);
