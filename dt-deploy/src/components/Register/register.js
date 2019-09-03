import React from 'react';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'

import APIEndPoints from '../../utils/APIEndPoints'
import httpClient from '../../utils/httpClient'
import { ComponentHelpers, connect } from '../../utils/componentHelper';
import Popup from 'reactjs-popup';
import Loading from '../loader'
import { ReactComponent as BackLogo } from '../../assets/icons/back2.svg';

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
    otpModal: false,
    confirmation_code: '',
    loading: false
  }

  otpVerify = async () => {
    if (this.state.otp === '') {
      return
    }
    if (this.state.confirmation_code === '') {
      return this.NotificationManager.info('Please register again', 'Lost Connection!!')
    }
    this.setState({ loading: true })
    try {
      const response = await httpClient.ApiCall('post', APIEndPoints.verifyOtp, {
        confirmation_code: this.state.confirmation_code,
        otp: this.state.otp
      })
      if (response.data && response.data !== null) {
        localStorage.setItem('user', JSON.stringify(response.data))
        httpClient.setDefaultHeader('access-token', response.data ? response.data.access_token : "")
      }
      this.setState({ loading: false })
      const url = localStorage.getItem('URL')
      if (url) {
        localStorage.removeItem('URL')
        this.props.history.push(url)
      } else {
        this.props.history.push('/')
      }
    } catch (error) {
      this.setState({ loading: false })
      this.NotificationManager.error(error.response.data.message, 'Error')
    }
  }


  register = async (e) => {
    e.preventDefault()
    const { name, email, password, phone_no } = this.state
    if (!/^[a-zA-Z0-9 ]+$/.test(name)) {
      return this.NotificationManager.warning('Name contains Special characters', 'Warning!!', 30000)
    }
    try {
      this.setState({ registerBtnText: 'Please Wait', loading: true })
      const response = await httpClient.ApiCall('post', APIEndPoints.register,
        {
          name,
          email,
          password,
          phone_no
        })
      if (response && response.success === 1) {

        this.setState({ loading: false, registerBtnText: 'Register', otpModal: true, confirmation_code: response.data.confirmation_code })
      } else {
        this.NotificationManager.error(response.message, 'Error')
        this.setState({ registerBtnText: 'Register', loading: false })
      }
    } catch (error) {
      error.response.data && this.NotificationManager.error(error.response.data.message, 'Error')
      this.setState({ registerBtnText: 'Register', loading: false })
    }

    return false
  }

  resendOTP = async () => {
    if (this.state.confirmation_code === '') {
      return this.NotificationManager.info('Please register again', 'Lost Connection!!')
    }
    this.setState({ loading: true })
    await this.resendOtp(this.state.phone_no)
    this.setState({ disabledBtn: true, loading: false })
    setTimeout(() => {
      this.setState({ loading: true, disabledBtn: false })
    }, 30000)
  }

  render() {
    return (
      <div className="appContainer">
        <Loading data={this.state.loading} />
        <div className='header'>
          <Link to={localStorage.getItem('URL') === null ? '/' : '/cart'}>
            <BackLogo />
            Register
          </Link>

        </div>
        <div className="LoginWrapp" style={{ height: '100%' }}>
          <form onSubmit={(e) => this.register(e)} className="forCenter">
            <div className="inpWrap">
              <p>Name</p>
              <input type="name" required onChange={(e) => this.setState({ name: e.target.value })}></input>
            </div>
            <div className="inpWrap">
              <p>Phone Number</p>
              <input
                maxLength="10"
                minLength="10"
                type="text"
                pattern="[0-9]*"
                required
                value={this.state.phone_no}
                onChange={(e) => +e.target.value === +e.target.value ? this.setState({ phone_no: e.target.value }) : ''}></input>
            </div>
            <div className="inpWrap">
              <p>E-mail ID</p>
              <input type="email" required onChange={(e) => this.setState({ email: e.target.value })}></input>
            </div>
            <div className="inpWrap">
              <p>Password</p>
              <input type="password" required onChange={(e) => this.setState({ password: e.target.value })}></input>
            </div>
            <button style={{ marginBottom: '10%', fontSize: '16px' }} disabled={this.state.registerBtnText === 'Please Wait'} className="LogindoneBtn" >{this.state.registerBtnText}</button>
            <Link to="/login"  style={{ marginBottom: '6%' }}  className="LogindoneBtn" >Login</Link>
          </form>
        </div>
        <Popup className="itemCart otp" position="right center" open={this.state.otpModal} onClose={() => this.setState({ otpModal: false })}>

          <div className='editPastaPopup  modalContent'>
            <div className="modal-header">
              <span onClick={() => this.setState({ otpModal: false })} className="close">&times;</span>
              <h2>OTP Verification</h2>
            </div>
            <div className='modal-body'>
              <p style={{ textAlign: 'center' }}>An OTP has been sent to  <b>{this.state.phone_no}</b> </p>
              <div>
                <input className="OtpInput" type='number' onChange={(e) => this.setState({ otp: e.target.value })} /><br /><br />
                <button className="LogindoneBtn" style={{ marginLeft: '12%', position: 'relative' }} type="submit" onClick={() => this.otpVerify()}>Verify</button><br />
                <button disabled={this.state.disabledBtn} className="resendOtp" type="button" onClick={() => this.resendOTP()}> Resend OTP</button>
              </div>
            </div>
          </div>
        </Popup>
      </div>
    )
  }

}
export default connect(Register);
