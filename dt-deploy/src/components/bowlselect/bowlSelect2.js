import React from "react";
import { Route, Link, BrowserRouter as Router } from "react-router-dom";
import httpClient from "../../utils/httpClient";
import APIEndPoints from "../../utils/APIEndPoints"
import Loading from '../loader'
import { ComponentHelpers, connect } from '../../utils/componentHelper'

import "../../shared.scss";
import "../../styles/yourCart.scss";
import '../../styles/order.scss';
import { ReactComponent as BackLogo } from "../../assets/icons/back2.svg";

function val_y(x) {
  var y = 175 * 175 - (x - 140) * (x - 140);
  return Math.floor(Math.sqrt(y) - 195);
}
class Bowlselect extends ComponentHelpers {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      order_details: {}
    };
  }

  async componentDidMount() {
    try {
      this.setState({ loading: true })
      this.source = httpClient.getSource()
      const response = await httpClient.ApiCall('post', APIEndPoints.getOrderDetails, {
        order_id: parseInt(localStorage.getItem('order_details_id')) ?
          parseInt(localStorage.getItem('order_details_id')) : 1
      }, this.source.token)
      this.setState({
        order_details: response.data,
        loading: false
      })
    } catch (error) {
      if (error.message !== "unMounted") {
        this.setState({ loading: false })
      }
      console.log(error)
    }
  }
  componentWillUnmount() {
    this.source.cancel('unMounted')
  }

  render() {
    const { loading, order_details } = this.state
    return (
      <div className='container'>
        <Loading data={loading} />
        <div className='wrapper'>
          <div className='header'>
            <Link to="/myorders"><BackLogo /></Link>
            Order Summary
          </div>
          <div style={{ marginTop: '-8%', display: 'grid' }} className='cartWrapper'>
            <div style={{ gridColumn: 1 / 6 }}><img src="" alt="" /></div>
            <div style={{ gridColumn: 1 / 6 }} className='orderSummary'>
              <div className="grid-container">
                <div style={{ gridColumn: 1 / 6 }}>

                  <label>ORDER DELIVERED TO</label>
                  <p>{order_details.address && order_details.address.address_text}</p>
                </div>
                <div style={{ gridColumn: 1 / 6 }}>
                  <label>ORDERED ON</label>
                  <p>{order_details.created_at && order_details.created_at.split(' ')[0]}</p>
                </div>
              </div>
              <div className='break'> </div>
              <div className="grid-container">
                <div style={{ gridColumn: 1 / 6 }}>

                  <label>ORDER NUMBER</label>
                  <p>{order_details.unique_order_id}</p>
                </div>
                <div style={{ gridColumn: 1 / 6 }}>
                  <label>TOATL</label>
                  <p>{order_details.grant_total}</p>
                </div>
              </div>

              <div className='break'><hr /> </div>
              {
                order_details.items && order_details.items.user_pasta.map((data, index) =>
                  <div key={index}> 
                    {data.side?""
                    :<div className='orderSummaryCard'>
                    <div>
                      <label>Bowl</label>
                      <p>{data.bowl ? data.bowl.name : 'not selected'}</p>

                      <div className='break'> </div>

                      <label>Pasta</label>
                      <p>{data.pastas ? data.pastas.map(_ => _.name).join(', ') : 'not selected'} </p>

                      <div className='break'> </div>

                      <label>Garnish</label>
                      <p>{data.garnishes ? data.garnishes.map(_ => _.name).join(', ') : 'not selected'}</p>

                      <div className='break'> </div>

                      <p>*(Parmesan and basil will always be included)</p>
                    </div>

                    <div>
                      <label>Sauce</label>
                      <p>{data.sauces ? data.sauces.map(_ => _.name).join(', ') : 'not selected'}</p>

                      <div className='break'> </div>

                      <label>Meat</label>
                      <p>{data.meats ? data.meats.map(_ => _.name).join(', ') : 'not selected'}</p>

                      <div className='break'> </div>

                      <label>Veggies</label>
                      <p style={{ width: '35%' }}>{data.vegetables ? data.vegetables.map(_ => _.name).join(', ') : 'not selected'}</p>
                    </div>


                  </div>
                  }
                  </div>
                )
              }

            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default connect(Bowlselect);
