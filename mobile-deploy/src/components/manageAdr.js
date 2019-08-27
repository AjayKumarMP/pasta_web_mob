import React from 'react';
import { Link, BrowserRouter as Router } from 'react-router-dom'
import Addr from './addr'
import { ComponentHelpers, connect } from '../utils/componentHelper'
import httpClient from '../utils/httpClient';
import APIEndPoints from '../utils/APIEndPoints';
import Loading from './loader'


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
            this.setState({loading: true})
            this.source = httpClient.getSource()
            var response = await httpClient.ApiCall('post', APIEndPoints.myAddressList)
            this.props.addMyAddAddress(response.data)
            this.setState({address: response.data, loading: false})
        } catch (error) {
            if(error.message !== 'UnMounted'){
                this.setState({loading: false})
            }
            console.log(error)
        }
    }

    componentWillUnmount(){
        this.source && this.source.cancel("unMounted")
    }

    editAddress=(data)=>{
        localStorage.setItem('editAddress', JSON.stringify(data))
        this.props.history.push('/addaddress')
    }

    render() {
        return (
            <div className="contactUsWrapp" style={{paddingBottom: this.state.loading?'70%':'0%'}}>
                <Loading data={this.state.loading} />    
                <div className="cnt-nav">
                    <Link to="/"><img className="prevBtn" src="./images/prevBtn.png" /></Link>
                    <h4>Manage address</h4>
                </div>
                <div className="mainContF">
                    <Link to="/addaddress" className="addAdrBtn">Add address</Link>
                    <div className="undr-cont">
                        <div className="wrok-home-cont">
                            <button >Home</button>
                            <button >Work</button>
                        </div>
                    </div>
                </div>
                <div className="addresses">
                    {
                        this.state.address.map((item, index) => {
                            return <Addr editAddr={this.editAddress} inf='home' info={item} key={index} />
                        })
                    }
                </div>
                <Link to="" className="doneBtn" >Done</Link>
            </div>
        )
    }

}
export default connect(ManageAdressess);
