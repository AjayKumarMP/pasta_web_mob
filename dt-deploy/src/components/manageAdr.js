import React from 'react';
import { Link, BrowserRouter as Router } from 'react-router-dom'
import Addr from './addr'
import { ComponentHelpers, connect } from '../utils/componentHelper'
import httpClient from '../utils/httpClient';
import APIEndPoints from '../utils/APIEndPoints';
import { Spinner } from './loader'
import { ReactComponent as BackLogo } from '../assets/icons/back2.svg';


class ManageAdressess extends ComponentHelpers {
    constructor(props) {
        super(props);
        this.state = {
            address: [],
            loading: true
        }
    }

    async componentDidMount() {
        try {
            localStorage.removeItem('editAddress')
            this.setState({ loading: true })
            this.source = httpClient.getSource()
            var response = await httpClient.ApiCall('post', APIEndPoints.myAddressList)
            this.props.addMyAddAddress(response.data)
            this.setState({ address: response.data, loading: false })
        } catch (error) {
            if (error.message !== 'UnMounted') {
                this.setState({ loading: false })
            }
            console.log(error)
        }
    }

    componentWillUnmount() {
        this.source && this.source.cancel("unMounted")
    }

    editAddress = (data) => {
        localStorage.setItem('editAddress', JSON.stringify(data))
        this.props.history.push('/addaddress')
    }

    render() {
        const { loading, address } = this.state
        return (
            <div className="appContainer" style={{ width: '60%', marginLeft: '10%' }}>
                <Spinner data={loading} />
                <div className="contactUsWrapp" style={{ paddingBottom: this.state.loading ? '70%' : '0%' }}>
                    <Spinner data={this.state.loading} />
                    <div className='header'>
                        <Link to='/'>
                            <BackLogo />
                        </Link>
                        Manage Address
                    </div>
                    <div className="mainContF">
                        <Link to="/addaddress" className="addAdrBtn">Add address</Link>
                        <div className="undr-cont">
                            <div className="wrok-home-cont">
                                <button disabled>Home</button>
                                <button disabled>Work</button>
                            </div>
                        </div>
                    </div>
                    <div className="addresses">
                        {
                            address && address.map((item, index) => {
                                return <Addr editAddr={this.editAddress} inf='home' info={item} key={index} />
                            })
                        }
                    </div>
                    <button className="doneBtn" >Done</button>
                </div>
            </div>
        )
    }

}
export default connect(ManageAdressess);
