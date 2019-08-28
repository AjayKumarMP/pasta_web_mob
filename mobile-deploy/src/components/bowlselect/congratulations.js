import React from 'react';
import {Route,Link,BrowserRouter as Router} from 'react-router-dom'
import { ComponentHelpers, connect } from '../../utils/componentHelper';
import Loading from '../loader'

   
class AboutUs extends ComponentHelpers {
    state ={
        loading: false,
        pastaName: ''
    }

    myCart = async()=>{
      try {
        this.setState({loading: true})
        let item = JSON.parse(localStorage.getItem('cartItem'))
        if(item !== null){
          item['name'] = this.state.pastaName
          localStorage.setItem('cartItem', JSON.stringify(item))
        }
        this.setState({loading: false})
        this.props.history.push('/cart')
    } catch (error) {
        this.setState({loading: false})
        console.log(error)
    }
  }
        
    render(){
        return(
            <div className="contactUsWrapp">
              <Loading data={this.state.loading} />
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
                        <input onChange={(e)=>this.setState({pastaName: e.target.value})} placeholder="For eg- 'Sam's pasta'" type='name' />
                        <button onClick={()=>this.myCart()} className="congratsCartBtn">Checkout</button>
                        {/* <Link to='/thanksfororder' className="sWfBtn">Share with friends</Link> */}
                    </div>
                  </div>
        )
    }

} 
export default connect(AboutUs);
