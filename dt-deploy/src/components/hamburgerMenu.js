import React from 'react';
import {Route, Link, BrowserRouter as Router} from 'react-router-dom';
import LogoutComponent from './logout';
import {ComponentHelpers, connect} from '../utils/componentHelper';
import {FaUserAlt} from 'react-icons/fa'
import {IconContext} from 'react-icons'

class Hamburger extends ComponentHelpers {
    constructor(props) {
        super(props);
        this.state = {
            checkLogout: false,
            userLoggedIn: this
                .props
                .data
                .isUserLoggedIn()
        };
    }

    handlerCheckLogout = () => {
        if (this.state.checkLogout) {
            return this.setState({checkLogout: false});
        }
        this.setState({checkLogout: true});
    };

    componentWillMount() {
        document.addEventListener('mousedown', this.handleClick, false);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClick, false);
    }

    handleClick = e => {
        if (this.side.contains(e.target)) {
            this
                .props
                .handle();
            return;
        }
    };

    render() {
        const {userLoggedIn} = this.state
        return (
            <div className='mainWrap'>
                {this.state.checkLogout
                    ? <LogoutComponent handlFun={this.handlerCheckLogout}/>
                    : null}
                <div className='hambMenu'>
                    <div className='hambHeader'>
                        <div className='userArea'>
                            <div className='circle'/>
                            <IconContext.Provider
                                value={{
                                className: 'react-icons'
                            }}>
                                <FaUserAlt
                                    className=""
                                    style={{
                                    color: 'black',
                                    position: 'absolute',
                                    top: '7%',
                                    left: '41.4%'
                                }}
                                    size="2em"/>
                            </IconContext.Provider>
                            <div className='userInfo'>
                                <h3>{this.props.userInfo && this.props.userInfo.name
                                        ? this.props.userInfo.name
                                        : 'Guest User'}</h3>
                                <p>{this.props.userInfo.email}</p>
                                {/* <p>{this.props.userInfo.phone}</p> */}
                            </div>
                        </div>
                    </div>
                    <div className='hambMain'>
                        <ul>
                            <li hidden={!userLoggedIn}>
                                <img src='/images/shopping-bag.png' alt='my orders'/>
                                <Link to='/myorders'>My orders</Link>
                            </li>
                            <li hidden={!userLoggedIn}>
                                <img src='/images/placeholder.png' alt='address'/>
                                <Link to='/manageaddress'>Manage Addresses</Link>
                            </li>
                            <li>
                                <img src='/images/information.png' alt='about'/>
                                <Link to='/aboutus'>About pasta project</Link>
                            </li>
                            <li hidden={!userLoggedIn} onClick={this.handlerCheckLogout}>
                                <img src='/images/logout.png' alt='logout'/>
                                <p>Log out</p>
                            </li>
                            <li>
                                <img src='/images/phone-call.png' alt='contact us'/>
                                <Link to='/contactus'>Contact us</Link>
                            </li>
							<li hidden={userLoggedIn}>
                                <img src='/images/logout.png' alt='contact us'/>
                                <Link to='/login'>Login</Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className='hambEffect' ref={side => (this.side = side)}/>
            </div>
        );
    }
}
export default connect(Hamburger);
