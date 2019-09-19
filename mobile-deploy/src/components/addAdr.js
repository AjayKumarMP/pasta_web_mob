import React from 'react';
import {Route, Link, BrowserRouter as Router} from 'react-router-dom';
import httpClient from '../utils/httpClient';
import APIEndPoints from '../utils/APIEndPoints';
import { ComponentHelpers, connect } from '../utils/componentHelper';
import {Spinner} from './loader'
import Popup from 'reactjs-popup';

class AddAdr extends ComponentHelpers {

    state = {
        isEdit: false,
        address: {},
        flat_no: '',
        street: '',
        locality: '',
        city: '',
        email: '',
        phone_no: '',
        address_name: '',
        loading: false,
        confirmation_code: '',
        otp: 0,
        otpModal: false,
        disabledBtn: false
    }

    componentDidMount() {
        const address = JSON.parse(localStorage.getItem('editAddress'))
        if (address) {
            const {
                address_name,
                flat_no,
                street,
                locality,
                city,
                phone_no,
                email
            } = address
            this.setState({
                isEdit: true,
                address_name,
                flat_no,
                street,
                locality,
                city,
                phone_no,
                email})
        }
    }

    addAddress = async(e) => {
        e.preventDefault()
        try {
            this.setState({loading: true})
            const {
                address_name,
                flat_no,
                street,
                locality,
                city,
                phone_no,
                email,
            } = this.state
            const response = await httpClient.ApiCall('post', APIEndPoints.addAddress, {
                address_name,
                flat_no,
                street,
                locality,
                city,
                phone_no,
                email
            })
            this.setState({loading: false})
            if(!this.props.data.isUserLoggedIn()){
                this.setState({confirmation_code: response.data.confirmation_code, otpModal: true})
                // 
            } else {
                const url = localStorage.getItem('URL')
                if (url) {
                    localStorage.removeItem('URL')
                    this.props.history.push(url)
                  } else {
                    this.props.history.push('/manageaddress')
                  }
            }
        } catch (error) {
            this.setState({ loading: false })
            if (error.response.data && error.response.data.message) {
                return this.NotificationManager.error(error.response.data && error.response.data.message, 'Error', 1500)
            }
            return this.NotificationManager.error('Cannot add address, Please try later', 'Error', 1500)
        }
    }

    otpVerify = async () => {

        if (this.state.otp === '') {
            return this.NotificationManager.info('Please enter OTP', 'Warning!!')
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
            this.setState({ loading: false })
            if (response.data && response.data !== null) {
              localStorage.setItem('user', JSON.stringify(response.data))
              httpClient.setDefaultHeader('access-token', response.data ? response.data.access_token : "")
              const url = localStorage.getItem('URL')
              if (url) {
                localStorage.removeItem('URL')
                this.props.history.push(url)
              } else {
                this.props.history.push('/')
              }
              return this.NotificationManager.success(response.message, 'Success')
            }
            this.NotificationManager.error(response.message, 'Error')

          } catch (error) {
            this.setState({ loading: false })
            this.NotificationManager.error(error.response.data.message, 'Error')
          }
      }

    resendOTP=async()=>{
        this.setState({disabledBtn: true, loading: true})
        setTimeout(()=>{
            this.setState({disabledBtn: false})
        },30000)
        await this.resendOtp(this.state.phone_no)
        this.setState({loading: false})
    }

    render() {
        const {
            isEdit,
            flat_no,
            street,
            locality,
            city,
            email,
            phone_no,
            address_name,
            loading,
            otpModal
        } = this.state
        return (
            <div className="appContainer" style={{overflowY: 'scroll'}}>
                <Spinner data={loading} />
                <div className='contactUsWrapp'>
                    <div className='cnt-nav'>
                        <Link to={localStorage.getItem('URL') === null? '/manageaddress': '/cart'}>
                            <img  className='prevBtn' alt="loading.." src='./images/prevBtn.png'/>
                        </Link>
                        <h4 style={{marginLeft: '1%'}}>Add address</h4>
                    </div>
                    <div
                        className='mainFormWrap'
                      >
                        <form onSubmit={(e) => this.addAddress(e)}>
                            <div className='inpCont'>
                                <p>Flat no./ Building no.</p>
                                <input required
                                    type="text"
                                    value={flat_no?flat_no: ''}
                                    onChange={(e) => this.setState({flat_no: e.target.value})}/>
                            </div>
                            <div className='inpCont'>
                                <p>Street</p>
                                <input required
                                    type="text"
                                    value={street?street: ''}
                                    onChange={(e) => this.setState({street: e.target.value})}/>
                            </div>
                            <div className='inpCont'>
                                <p>Locality</p>
                                <input required
                                    type="text"
                                    value={locality?locality: ''}
                                    onChange={(e) => this.setState({locality: e.target.value})}/>
                            </div>
                            <div className='inpCont'>
                                <p>City</p>
                                <input required
                                    type="text"
                                    value={city?city: ''}
                                    onChange={(e) => this.setState({city: e.target.value})}/>
                            </div>
                            <div className='inpCont'>
                                <p>Email</p>
                                <input required
                                    type="email"
                                    value={email?email: ''}
                                    onChange={(e) => this.setState({email: e.target.value})}/>
                            </div>
                            <div className='inpCont'>
                                <p>Phone Number</p>
                                <input required
                                    maxLength="10"
                                    minLength="10"
                                    pattern="[0-9]*"
                                    type="text"
                                    value={phone_no?phone_no: ''}
                                    onChange={(e) =>  +e.target.value === +e.target.value?this.setState({phone_no: e.target.value}):''}/>
                            </div>
                            <div className='inpCont' style={{marginBottom: '16%'}}>
                                <p>Address nickname</p>
                                <input required onChange={() => this.setState({address_name: 'Home'})} name="address" type="radio" value="Home" // checked={address_name && address
                                checked={address_name.toLowerCase() === `home`}/>
                                <label htmlFor="address">Home</label>
                                <input required onChange={() => this.setState({address_name: 'Work'})} name="address" type="radio" // value="Work"
                                   checked={address_name.toLowerCase() === `work`} />
                                <label htmlFor="address">Work</label>
                            </div>
                            <button
                                disabled={loading}
                                type="submit"
                                className="addAddressBtn doneBtn">{isEdit
                                    ? 'Update'
                                    : 'Add'}</button>
                        </form>
                    </div>
                <Popup className="itemCart" position="right center" open={otpModal} onClose={() => this.setState({otpModal: false})}>
                    <div className="addressHeader">
                        <p>Enter OTP, which is sent to {this.state.phone_no}</p>
                        <hr />
                        <div>
                            <input placeholder="Enter OTP" style={{}} type='text' onChange={(e)=>this.setState({otp: e.target.value})}/>
                            <button style={{width: '60%', marginLeft: '20%'}} className="verifyOtp"  type="submit" onClick={()=>this.otpVerify()}>Verify</button>
                            <button disabled={this.state.disabledBtn} className="resendOtp"  type="button" onClick={()=>this.resendOTP()}>Resend</button>
                            </div>
                    </div>
                </Popup>
                </div>
            </div>
        )
    }
}

export default connect(AddAdr)