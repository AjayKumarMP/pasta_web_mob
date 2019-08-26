import React from 'react';
import {Route,Link,BrowserRouter as Router} from 'react-router-dom'
import { ComponentHelpers, connect } from '../../utils/componentHelper';

   
class AboutUs extends ComponentHelpers {
    state ={
        name: '',
        loading: false
    }

    myCart = async()=>{
        this.setState({loading: true})
        let order = this.props.data.placeOrder
    if(order){
            order['name'] = this.state.name
            await this.addProductToCart(order);
        }
      this.setState({loading: false})
      this.props.history.push('/cart')
  }
        
    render(){
        return(
            <div className="contactUsWrapp">
              <div className="cnt-nav">
                <Link to="/selectsides"><img className="prevBtn" src="./images/prevBtn.png"/></Link>
              </div>
              <div className="congrMainWrapp">
                  <div className="head">
                    <h5>Congratulations!</h5>
                    <p>You have made your pasta</p>
                  </div>
                  
              </div>
                   <div className="congrImgWrap">
                   <img  className="congbg" src="./images/congbg.png"/>
                    <img className="congPlate" src="./images/regularbowl.png"/>
                   </div>
                   <div className="congrUnderSect">
                        <h4>Name your pasta</h4>
                        <input required onChange={(e)=>this.setState({name: e.target.value})} placeholder="For eg- 'Sam's pasta'" type='name' />
                        <Link to='/thanksfororder' className="sWfBtn">Share with friends</Link>
                        <button onClick={()=>this.myCart()} className="congratsCartBtn">Checkout</button>
                    </div>
                  </div>
        )
    }

} 
export default connect(AboutUs);
