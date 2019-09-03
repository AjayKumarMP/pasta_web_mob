import React from "react";
import { Route, Link, BrowserRouter as Router } from "react-router-dom";

import '../shared.scss';
import '../styles/editPasta.scss';
import '../styles/yourCart.scss';
import { ReactComponent as BackLogo } from '../assets/icons/back2.svg'
import { ComponentHelpers, connect } from "../utils/componentHelper";
import APIEndPoints from "../utils/APIEndPoints";
import httpClient from "../utils/httpClient";
import Popup from 'reactjs-popup';
import Loading from './loader'


class Editpasta extends ComponentHelpers {
  constructor(props) {
    super(props);
    this.options = {
      garnishes: APIEndPoints.getGarnishes,
      meats: APIEndPoints.getMeats,
      pastas: APIEndPoints.getPastas,
      sauces: APIEndPoints.getSauces,
      vegetables: APIEndPoints.getVeggies
    }
    this.order = {}
    this.state = {
      showPopup: false,
      popupData: [],
      currentKey: '',
      cartItem: {},
      loading: false
    }
  }

  getItems = async (url, key) => {
    this.order = {}
    this.setState({ loading: true, currentKey: key })
    this.source = httpClient.getSource()
    try {
      const response = await httpClient.ApiCall('post', url, {
        kitchen_id: this.props.data.kitchen_id
      }, this.source.token)
      if (response.data) {
        this.setState({
          popupData: response.data,
          loading: false,
          showPopup: true
        })
      } else {
        this.setState({ loading: false })
      }
    } catch (error) {
      this.setState({ loading: false })
      console.log(error)
    }

  }

  componentWillUnmount() {
    this.source && this.source.cancel()
  }

  componentDidMount(){
    this.setState({cartItem: this.props.location.state})
  }

  selectData(event, data) {
    if (!this.order[this.state.currentKey]) {
      this.order[this.state.currentKey] = []
    }
    if (this.state.currentKey === 'pastas' || this.state.currentKey === 'sauces') {
      this.order[this.state.currentKey] = []
      document.querySelectorAll('.activeborder') &&
        document.querySelectorAll('.activeborder').forEach(data => data.classList.remove('activeborder'))
    }
    const index = this.order[this.state.currentKey].map(_ => _.id).indexOf(data.id)
    if(index === -1 && this.order[this.state.currentKey].length ===2 &&(this.state.currentKey === 'meats' || this.state.currentKey === 'garnishes')){
      return
    }
    if(index === -1 && this.order[this.state.currentKey].length ===3 &&this.state.currentKey === 'vegetables'){
      return
    }
    if (event.target.classList.contains('activeborder')) {
      this.order[this.state.currentKey].splice(index, 1)
      event.target.classList.remove('activeborder')
    } else {
      this.order[this.state.currentKey].push({ id: data.id, name: data.name })
      event.target.classList.add('activeborder')
    }
  }

  updateItem = async () => {
    if (Object.keys(this.order).length === 0 ||
      (this.order[this.state.currentKey] && Object.keys(this.order[this.state.currentKey]).length === 0)) {
      return
    }
    debugger

    this.setState({ loading: true })
    const reqObj = { bowl: { id: this.props.location.state.bowl && this.props.location.state.bowl.id } }
    if (this.state.currentKey == 'garnishes')
      reqObj['garnish'] = this.order[this.state.currentKey].map(_=>{return {id:_.id}})
    else if (this.state.currentKey == 'meats')
      reqObj['meat'] = this.order[this.state.currentKey].map(_=>{return {id:_.id}})
    else if (this.state.currentKey == 'pastas')
      reqObj['pasta'] = this.order[this.state.currentKey][0]
    else if (this.state.currentKey == 'sauces')
      reqObj['sauce'] = this.order[this.state.currentKey][0]
    else if (this.state.currentKey == 'vegetables')
      reqObj['veggies'] = this.order[this.state.currentKey].map(_=>{return {id:_.id}})
      console.log(this.order[this.state.currentKey])
    await this.updateItemInCart(reqObj, this.props.location.state.id)
    var item =  this.state.cartItem[this.state.currentKey]
    if(!item || this.state.currentKey == 'sauces' || this.state.currentKey == 'pastas'){
      item = []
    }
    this.order[this.state.currentKey].map(data=>{
      item.push({name: data.name, id: data.id})
    })
    const obj = this.state.cartItem
    obj[this.state.currentKey] = item
    this.setState({ loading: false, showPopup: false, cartItem: obj })
  }
  render() {
    const { cartItem } = this.state
    const { loading, popupData } = this.state
    return (
      <div className='container editPastaContainer'>
        <Loading data={loading} />
        <div className='wrapper'>
          <div className='header'>
            <Link to="/cart"><BackLogo /></Link>
            Edit Pasta
          </div>

          <div className='cartWrapper'>
            <div>
              <div hidden={cartItem.sauces && cartItem.sauces.length === 0} className='editPastaCard'>
                <div>
                  SAUCE
                  <br />
                  {cartItem.sauces && cartItem.sauces.map(_=>_.name).join(", ")}
                </div>

                <div className='changeBtn' onClick={() => this.getItems(this.options.sauces, 'sauces')}>
                  Change
                </div>
              </div>

              <div hidden={cartItem.pastas && cartItem.pastas.length === 0} className='editPastaCard'>
                <div>
                  PASTA
                  <br />
                  {cartItem.pastas && cartItem.pastas.map(_=>_.name).join(", ")}
                </div>

                <div className='changeBtn' onClick={() => this.getItems(this.options.pastas, 'pastas')}>
                  Change
                </div>
              </div>

              <div hidden={cartItem.vegetables && cartItem.vegetables.length === 0} className='editPastaCard'>
                <div>
                  VEGETABLES
                  <br />
                  {cartItem.vegetables && cartItem.vegetables.map(_=>_.name).join(", ")}
                </div>

                <div className='changeBtn' onClick={() => this.getItems(this.options.vegetables, 'vegetables')}>
                  Change
                </div>
              </div>
            </div>

            <div>
              <div hidden={cartItem.meats && cartItem.meats.length === 0} className='editPastaCard'>
                <div>
                  MEAT
                  <br />
                  {cartItem.meats && cartItem.meats.map(_=>_.name).join(", ")}
                </div>

                <div className='changeBtn' onClick={() => this.getItems(this.options.meats, 'meats')}>
                  Change
                </div>
              </div>
              <div hidden={cartItem.garnishes && cartItem.garnishes.length === 0} className='editPastaCard'>
                <div>
                  GARNISH
                <br />
                {cartItem.garnishes && cartItem.garnishes.map(_=>_.name).join(", ")}
                </div>

                <div className='changeBtn' onClick={() => this.getItems(this.options.garnishes, 'garnishes')}>
                  Change
              </div>
              </div>
            </div>
          </div>

          <div className='center'>
            <button onClick={()=>this.props.history.push('/cart')} className='yourCartBtn'>Your Cart</button>
          </div>
        </div>
        <div className="appContainer">

          <Popup onClose={() => this.setState({ showPopup: false })} className="editPasta" open={this.state.showPopup}>
            <div className='editPastaPopup modalContent'>
              <div className="modal-header" style={{padding: '9px'}}>
                <span onClick={() => this.setState({ showPopup: false })} className="close">&#x2714;</span>
                <h2>Choose {this.state.currentKey}</h2>
              </div>
              <div className='modal-body'>
                <div style={{ maxHeight: '220px', overflowY: 'auto' }}>
                  {
                    popupData.map((data, index) =>
                      <section key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '4%' }}>
                        <div onClick={(e) => this.selectData(e, data)} key={index} style={{ position: 'relative' }} className="choosePl">

                          <img style={{ animation: 'auto', background: 'lightgray', objectFit: 'contain' }} className="myborder" src={data.picture} />
                        </div>
                        <span style={{ marginLeft: '20%' }}>{data.name}</span>
                      </section>
                    )
                  }
                </div>
                <button className="editPopupBtn" onClick={() => this.updateItem()}>Update</button>
              </div>
            </div>
          </Popup>
        </div>
      </div>
    );
  }
}
export default connect(Editpasta);
