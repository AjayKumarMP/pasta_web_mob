import React from 'react';
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
 import httpClient from '../utils/httpClient'
 import APIEndPoints from '../utils/APIEndPoints'
 import { Redirect } from 'react-router-dom'
 import { addUserDetails } from '../actions/actions'

 let mapStateToProps=(state)=>{
    return {data:state}
  }
   
  let mapDispatchToProps = (dispatch)=>{
    return {
      UserDetails: user => dispatch(addUserDetails(user))
    }
  }

class Logout extends React.Component {
    constructor(props){
        super(props);
        this.state ={
            checkLogout: false
        }
    }

    logout = async ()=>{
        try {
            this.setState({loading: true})
            httpClient.ApiCall('post', APIEndPoints.logout)
            localStorage.clear()
            this.setState({ checkLogout: true, loading: false });
            this.props.UserDetails({})
            // this.props.history.push('/')
            window.location.reload(true)
        } catch (error) {
            console.log(error)            
        }
    }

    render(){
        return(
            <div className="logoutMainWrap">
                 <div className="popUp">
                     <h5>Are you sure?</h5>
                     <ul>
                         <li onClick={()=>this.logout()}>Yes, log out</li>
                         <li onClick={this.props.handlFun} ><a >No, go back</a></li>
                     </ul>
                 </div>
            </div>
        )
    }

} 
export default connect(mapStateToProps, mapDispatchToProps)(Logout);
