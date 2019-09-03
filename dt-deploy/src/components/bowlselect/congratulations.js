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
      const { sauce, pasta, garnish, veggies, meat} = JSON.parse(localStorage.getItem('cartItem'))
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
                  <div className="inBowl">
        
                    <img style={{position: 'absolute',marginTop: '-12%',left: '57%'}} alt='bowl' src={bowlImage} />
										{/* <img style={{position: 'absolute',marginTop: '-12%',left: '57%'}} alt='bowl' src={bowlImage} /> */}
										{sauce && Object.keys(sauce).length > 0 && (<img className="inBowlSauce" alt='sauce' src={sauce.inbowl_picture} />)}
										{pasta && Object.keys(pasta).length > 0 && (<img className="inBowlPasta" alt='pasta' src={pasta.inbowl_picture} />)}
										{veggies && veggies.map((veg, index) => {
											return (<img key={index} className={`inBowlveggie${index}`} alt={`veggie${index}`} src={veg.inbowl_picture} />)
										})}
										{garnish && garnish.map((gar, index) => {
											return (<img key={index} className={`inBowlgarnish${index}`} alt={`garnish${index}`} src={gar.inbowl_picture} />)
										})}
										{meat && meat.map((data, index) => {
											return (<img key={index} className={`inBowlmeat${index}`} alt={`meat${index}`} src={data.inbowl_picture} />)
										})}
                    <div>You have made your pasta</div>
        
                    <div style={{marginTop: '17%'}}>NAME YOUR PASTA</div>
                    <div>
                      <input required onChange={(e)=>this.setState({pastaName: e.target.value})} className='nameInput' type='text' />
                    </div>
                    <br />
                    <div>
                      <button type="submit" onClick={()=>this.checkoutItems()} style={{background: '#67023f'}} className='shareWithFriendBtn'>Checkout</button>
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
