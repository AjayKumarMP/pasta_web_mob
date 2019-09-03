import React from 'react';
import { connect } from 'react-redux'
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'
import Orditem from './ordItem'
import httpClient from '../utils/httpClient';
import APIEndPoints from '../utils/APIEndPoints';
import Loading from './loader'

let mapStateToProps = (state) => {
  return { data: state }
}


class ContactUs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      myOrders: [],
      loading: true
    }
  }

  async componentDidMount() {
    try {
      if (!this.props.data.isUserLoggedIn()) {
        return this.props.history.push('/login')
      }
      this.setState({ loading: true })
      const response = await httpClient.ApiCall('post', APIEndPoints.myOrders)
      this.setState({
        myOrders: response.data,
        loading: false
      })
    } catch (error) {
      this.setState({ loading: false })
      console.log(error)
    }

  }

  render() {
    return (
      <div style={{paddingBottom: this.state.loading?'70%':'0%',overflowY: 'auto'}}>

        <Loading data={this.state.loading}/>
      <div className="contactUsWrapp">
        <div className="cnt-nav">
          <Link to="/"><img className="prevBtn" src="./images/prevBtn.png" /></Link>
          <h4>My orders</h4>
        </div>
        <div className="cnt-main-wrap">
          {
            this.state.myOrders.map((item, index) => {
              return <Orditem info={item} key={index} />
            })
          }
        </div>
      </div>
          </div>
    )
  }

}
export default connect(mapStateToProps)(ContactUs);
