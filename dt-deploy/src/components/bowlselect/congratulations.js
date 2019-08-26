import React from 'react';
import {Route,Link,BrowserRouter as Router} from 'react-router-dom'
import { ComponentHelpers, connect } from '../../utils/componentHelper';


import '../../shared.scss';
import '../../styles/yourCart.scss';
import bowlImage from '../../assets/images/bowl.png';
import '../../styles/congrat.scss';
import { ReactComponent as BackLogo } from '../../assets/icons/back2.svg';
   
class AboutUs extends ComponentHelpers {

    state = {
        loading: false,
        pastaName: ''

    }

    myCart = async()=>{
      await this.addProductToCart(this.props.data.placeOrder);
      this.props.history.push('/cart')
  }

checkoutItems = async ()=>{
    try {
        if(this.state.pastaName === ''){
          return
        }
        this.setState({loading: true})
        let item = JSON.parse(localStorage.getItem('cartItem'))
        if(item !== null){
          item['name'] = this.state.pastaName
          localStorage.setItem('cartItem', JSON.stringify(item))
        }
        // const sides =JSON.parse(localStorage.getItem('sides'))
        // if(sides !== null){
        //     await Promise.all(sides.map((data)=>{
        //         return this.addProductToCart({},data.id)
        //     })
        //   )
        // }
        // localStorage.removeItem('cartItem')
        // localStorage.removeItem('sides')
        this.setState({loading: false})
        this.props.history.push('/cart')
    } catch (error) {
        this.setState({loading: false})
        console.log(error)
    }

  }
        
    render(){
        return (
            <div className='container'>
              <div className='wrapper'>
                <div className='header'>
                  <Link to='/'>
                    <BackLogo />
                  </Link>
                </div>
                <div className='congratText'>Congratulations</div>
        
                <div className='cartWrapper' style={{ marginLeft: '1%' }}>
                  <div>
        
                    <img style={{position: 'absolute',marginTop: '-12%',left: '57%'}} alt='bowl' src={bowlImage} />
                    <div>You have made your pasta</div>
        
                    <div style={{marginTop: '17%'}}>NAME YOUR PASTA</div>
                    <div>
                      <input required onChange={(e)=>this.setState({pastaName: e.target.value})} className='nameInput' type='text' />
                    </div>
                    <br />
                    <div>
                      <button type="submit" disabled={this.state.pastaName === ''} onClick={()=>this.checkoutItems()} className='shareWithFriendBtn'>Checkout</button>
                      <button className='shareWithFriendBtn'>Share with friends</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
    }

} 
export default connect(AboutUs);
