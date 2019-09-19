import React from 'react';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'
import { ComponentHelpers, connect } from '../../utils/componentHelper';


import '../../shared.scss';
import '../../styles/yourCart.scss';
import bowlImage from '../../assets/images/bowl.png';
import '../../styles/congrat.scss';
import { ReactComponent as BackLogo } from '../../assets/icons/back2.svg';
import { FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa'
import { IconContext } from 'react-icons'
import Popup from 'reactjs-popup'

class AboutUs extends ComponentHelpers {

  state = {
    loading: false,
    pastaName: '',
    sharePopup: false

  }

  myCart = async () => {
    await this.addProductToCart(this.props.data.placeOrder);
    this.props.history.push('/cart')
  }

  checkoutItems = async () => {
    try {
      this.setState({ loading: true })
      let item = JSON.parse(localStorage.getItem('cartItem'))
      if (item !== null) {
        item['name'] = this.state.pastaName
        localStorage.setItem('cartItem', JSON.stringify(item))
      }
      this.setState({ loading: false })
      this.props.history.push('/cart')
    } catch (error) {
      this.setState({ loading: false })
      console.log(error)
    }

  }

  btnClicked(event) {

    event.preventDefault();
    window.open(
      event.currentTarget.href,
      'Поделиться',
      'width=600,height=500,location=no,menubar=no,toolbar=no'
    )
  }

  shareWithFrds() {
    this.setState({ sharePopup: true })
    setTimeout(() => {

      const links = document.querySelectorAll('.share a');

      links.forEach((link) => {
        const url = encodeURIComponent(window.location.origin );  //'https://mobile-pasta.firebaseapp.com/congratulations' + window.location.pathname
        const title = encodeURIComponent(document.title);
        console.log(url, title)
        link.href = link.href
          .replace('{url}', url)
          .replace('{title}', title)
      });
    }, 100)
  }

  render() {
    if (this.props.data.placeOrder.sauce && Object.keys(this.props.data.placeOrder.sauce).length > 0
      && this.props.data.placeOrder.pasta && Object.keys(this.props.data.placeOrder.pasta).length > 0) {
      var { sauce, pasta, vegetable, garnish, meat } = this.props.data.placeOrder
    } else if (localStorage.getItem('cartItem')) {
      var { sauce, pasta, veggies:vegetable, garnish, meat } = JSON.parse(localStorage.getItem('cartItem'))
    }
    return (
      <div className='container' style={{overflow: "hidden"}}>
        <div className='wrapper'>
          <div className='header'>
            <Link to='/bowlselect1'>
              <BackLogo />
            </Link>
          </div>
          <div className='congratText'>Congratulations</div>

          <div className='cartWrapper' style={{ marginLeft: '1%' }}>
            <div className="inBowl">

              <img style={{ position: 'absolute', marginTop: '-12%', left: '57%' }} alt='bowl' src={bowlImage} />
              {/* <img style={{position: 'absolute',marginTop: '-12%',left: '57%'}} alt='bowl' src={bowlImage} /> */}
              {sauce && Object.keys(sauce).length > 0 && (<img className="inBowlSauce" alt='sauce' src={sauce.inbowl_picture} />)}
              {pasta && Object.keys(pasta).length > 0 && (<img className="inBowlPasta" alt='pasta' src={pasta.inbowl_picture} />)}
              {vegetable && vegetable.map((veg, index) => {
                return (<img key={index} className={`inBowlveggie${index}`} alt={`veggie${index}`} src={veg.inbowl_picture} />)
              })}
              {garnish && garnish.map((gar, index) => {
                return (<img key={index} className={`inBowlgarnish${index}`} alt={`garnish${index}`} src={gar.inbowl_picture} />)
              })}
              {meat && meat.map((data, index) => {
                return (<img key={index} className={`inBowlmeat${index}`} alt={`meat${index}`} src={data.inbowl_picture} />)
              })}
              <div>You have made your pasta</div>

              <div style={{ marginTop: '17%' }}>NAME YOUR PASTA</div>
              <div>
                <input required onChange={(e) => this.setState({ pastaName: e.target.value })} className='nameInput' type='text' />
              </div>
              <br />
              <div>
                <button type="submit" onClick={() => this.checkoutItems()} style={{ background: '#67023f' }} className='shareWithFriendBtn'>Checkout</button>
                <button onClick={() => this.shareWithFrds()} className='shareWithFriendBtn'>Share with friends</button>
              </div>
            </div>
          </div>
        </div>
        <div className="appContainer">

          <Popup className="itemCart loc" position="bottom center" open={this.state.sharePopup} onClose={() => this.setState({ sharePopup: false })}>
            <div className="editPastaPopup" >
              <a className="closePopup" onClick={() => this.setState({ sharePopup: false })}>
                &times;
        				</a>
              <h3>Share with Friends</h3>

              <hr />
              <div className="share">
                <ul style={{ display: 'flex', listStyleType: 'none' }}>
                  <li style={{ marginLeft: '15%' }}>
                    <a onClick={(e) => this.btnClicked(e)} href="https://www.facebook.com/sharer.php?u={url}&img=url.png" title="Facebook" target="_blank">
                      <IconContext.Provider value={{ className: 'react-icons' }}>
                        <FaFacebook size="3em" />
                      </IconContext.Provider>
                    </a>
                  </li>
                  <li style={{ marginLeft: '10%' }}>
                    <a onClick={(e) => this.btnClicked(e)} href="https://www.linkedin.com/shareArticle?mini=true&url={url}&title={title}" title="Linkedin" target="_blank">
                      <IconContext.Provider value={{ className: 'react-icons' }}>
                        <FaLinkedin shapeRendering="circle" size="3em" />
                      </IconContext.Provider>
                    </a>
                  </li>
                  <li style={{ marginLeft: '10%' }}>
                    <a onClick={(e) => this.btnClicked(e)} href="https://twitter.com/intent/tweet?url={url}&text={title}" title="Twitter" target="_blank">
                      <IconContext.Provider value={{ className: 'react-icons' }}>
                        <FaTwitter size="3em" />
                      </IconContext.Provider>
                    </a>
                  </li>
                </ul>

              </div>
            </div>
          </Popup>
        </div>
      </div>
    );
  }

}
export default connect(AboutUs);
