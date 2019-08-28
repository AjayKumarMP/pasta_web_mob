import React from "react";
import { Route, Link, BrowserRouter as Router } from "react-router-dom";
import Popup from 'reactjs-popup'
import APIEndPoints from "../utils/APIEndPoints";
import httpClient from "../utils/httpClient";
import { ComponentHelpers, connect } from "../utils/componentHelper";
import { Spinner } from './loader'

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
      currentKey: ''
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
      if(response.data){
        this.setState({
          popupData: response.data,
          loading: false,
          showPopup: true
        })
      } else {
        this.setState({loading: false})
      }
    } catch (error) {
      this.setState({ loading: false })
      console.log(error)
    }

  }

  componentDidMount() {
    this.source && this.source.cancel()
  }

  selectData(event, data){
    if(!this.order[this.state.currentKey]){
      this.order[this.state.currentKey] = []
    }
    if(this.state.currentKey === 'pastas' || this.state.currentKey === 'sauces'){
      this.order[this.state.currentKey] =[]
      document.querySelectorAll('.activeborder') && 
      document.querySelectorAll('.activeborder').forEach(data=>data.classList.remove('activeborder'))
    }
    if(event.target.classList.contains('activeborder')){
      const index = this.order[this.state.currentKey].map(_=>_.id).indexOf(data.id)
      this.order[this.state.currentKey].splice(index , 1)
      event.target.classList.remove('activeborder')
    } else {
      this.order[this.state.currentKey].push({id:data.id})
      event.target.classList.add('activeborder')
    }
  }

  updateItem = async ()=>{
    if(Object.keys(this.order).length ===0 || 
    (this.order[this.state.currentKey] && Object.keys(this.order[this.state.currentKey]).length === 0)){
      return
    }
    this.setState({loading: true})
    const reqObj = {bowl: {id: this.props.location.state.bowl && this.props.location.state.bowl.id}}
    if(this.state.currentKey =='garnishes')
    reqObj['garnish'] = this.order[this.state.currentKey]
    else if(this.state.currentKey =='meats')
    reqObj['meat'] = this.order[this.state.currentKey]
    else if(this.state.currentKey =='pastas')
    reqObj['pasta'] = this.order[this.state.currentKey][0]
    else if(this.state.currentKey =='sauces')
    reqObj['sauce'] = this.order[this.state.currentKey][0]
    else if(this.state.currentKey =='vegetables')
    reqObj['veggies'] = this.order[this.state.currentKey]
    console.log(reqObj, this.props.location.state.id)
    await this.updateItemInCart(reqObj, this.props.location.state.id)
    this.setState({loading: false, showPopup: false})
  }

  render() {
    const { state: cartItem } = this.props.location
    const { loading, popupData } = this.state
    return (
      <div className="contactUsWrapp">
        <Spinner data={loading} />
        <div className="cnt-nav">
          <Link to="/cart">
            <img className="prevBtn" src="./images/prevBtn.png" />
          </Link>
          <h4>Edit pasta</h4>
        </div>
        <div className="editPastaItemsWrap">
          {
            cartItem && Object.keys(cartItem).map((key, index) => {
              return key !== 'bowl' && cartItem[key] && (Array.isArray(cartItem[key]) || cartItem[key].name) ?
                <div key={index} className="editPastaItem">
                  <div className="editPastaItemLeft">
                    <h5>{key}</h5>
                    {/* <p>{cartItem[key] ?cartItem[key].name: 'Not selected'}</p> */}
                  </div>
                  <div className="editPastaItemRight">
                    <button onClick={() => this.getItems(this.options[key], key)}>
                      CHANGE
          </button>
                  </div>
                </div>
                : ''
            }
            )
          }

        </div>
        <Popup onClose={()=>this.setState({showPopup: false})} className="modal" open={this.state.showPopup}>
          <div className='editPastaPopup modalContent'>
            <div className="modal-header">
              <h2>Choose Item</h2>
              <span onClick={()=>this.setState({showPopup: false})} className="close">&times;</span>
            </div>
            <div className='modal-body'>
              <div style={{maxHeight: '220px',overflowY: 'auto'}}>
              {
                popupData.map((data, index) =>
                <section key={index} style={{display: 'flex', alignItems: 'center',marginBottom: '4%'}}>
                  <div onClick={(e)=>this.selectData(e, data)} key={index} style={{ position: 'relative' }} className="choosePl">

                    <img  style={{ animation: 'auto',background: 'lightgray' }} className="myborder" src={data.picture} />
                  </div>
                    <span style={{marginLeft:'20%'}}>{data.name}</span>
                  </section>
                )
              }
              </div>
              <button className="editPopupBtn" onClick={() => this.updateItem()}>Update</button>
            </div>
          </div>
        </Popup>
      </div>
    );
  }
}
export default connect(Editpasta);
