import React from 'react';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'
import { ComponentHelpers, connect } from '../../utils/componentHelper';
import Loading from '../loader'
import Popup from 'reactjs-popup'
import { FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa'
import { IconContext } from 'react-icons'


class AboutUs extends ComponentHelpers {
  state = {
    loading: false,
    pastaName: '',
    sharePopup: false
  }

  myCart = async () => {
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
        const url = encodeURIComponent(document.origin);  //'https://mobile-pasta.firebaseapp.com/congratulations'
        const title = encodeURIComponent(document.title);
        link.href = link.href
          .replace('{url}', url)
          .replace('{title}', title);
      });
    }, 100)
  }

  render() {
    if (this.props.data.placeOrder.sauce && Object.keys(this.props.data.placeOrder.sauce).length > 0
      && this.props.data.placeOrder.pasta && Object.keys(this.props.data.placeOrder.pasta).length > 0) {
      var { sauce, pasta, vegetable, garnish, meat } = this.props.data.placeOrder
    } else if (localStorage.getItem('cartItem')) {
      var { sauce, pasta, vegetable, garnish, meat } = JSON.parse(localStorage.getItem('cartItem'))
    }
    return (
      <div className="contactUsWrapp" style={{ justifyContent: 'center' }}>
        <Loading data={this.state.loading} />
        <div className="cnt-nav">
          <Link to="/selectsides"><img className="prevBtn" src="./images/prevBtn.png" /></Link>
        </div>
        <div className="congrMainWrapp">
          <div className="head">
            <h5>Congratulations!</h5>
            <p>You have made your pasta</p>
          </div>

        </div>
        <div className="congrImgWrap">
          <img className="congbg" src="./images/congbg.png" />
          {/* <img className="congPlate" src="./images/regularbowl.png"/> */}
          <div className="sauceBowl">
            <img alt='sauce' className="congPlate" src="./images/regularBowl.png" />
            {sauce && Object.keys(sauce).length > 0 && (<img className="sauceInbowlSauceCong" alt='sauce' src={sauce.src} />)}
            {pasta && Object.keys(pasta).length > 0 && (<img className="sauceInbowlPastaCong" alt='pasta' src={pasta.src} />)}
            {vegetable && vegetable.map((el, index) => {
              return (<img key={index} className={`sauceInbowlVeggie${index}Cong`} alt={`veggie${index}`} src={el.src} />)
            })}
            {garnish && garnish.map((el, index) => {
              return (<img key={index} className={`sauceInbowlGarnish${index}Cong`} alt={`garnish${index}`} src={el.src} />)
            })}
            {meat && meat.map((data, index) => {
              return (<img key={index} className={`sauceInbowlMeat${index}Cong`} alt={`meat${index}`} src={data.src} />)
            })}
          </div>
        </div>
        <div className="congrUnderSect">
          <h4>Name your pasta</h4>
          <input onChange={(e) => this.setState({ pastaName: e.target.value })} placeholder="For eg- 'Sam's pasta'" type='name' />
          <button onClick={() => this.myCart()} className="congratsCartBtn">Checkout</button>
          <button onClick={() => this.shareWithFrds()} className="sWfBtn">Share with friends</button>
        </div>

        <Popup className="social" position="bottom center" open={this.state.sharePopup} onClose={() => this.setState({ sharePopup: false })}>
          <div className="" >
            <a className="close" onClick={() => this.setState({ sharePopup: false })}>
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
    )
  }

}
export default connect(AboutUs);
