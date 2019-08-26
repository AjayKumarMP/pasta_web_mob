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
            await httpClient.ApiCall('post', APIEndPoints.logout)
            localStorage.clear()
            this.setState({ checkLogout: true });
            this.props.UserDetails({})
            console.log(this.props.data.userDetails)
        } catch (error) {
            console.log(error)            
        }
    }

    render(){
        if(this.state.checkLogout){
            return (<Redirect to="/login"/>)
        } else
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
