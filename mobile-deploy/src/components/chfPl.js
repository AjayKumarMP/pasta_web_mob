import React from 'react';
import { connect } from 'react-redux'
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'
let mapStateToProps = (state) => {
    return { data: state }
}


class CheffCurated extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cart: []
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ cart: nextProps.cart });  
      }
    
    render() {
        return (
            <div className="chfPlMainWrap">
                <img style={{ width: '90%' }} src={this.props.info.src}></img>
                <div className="underDescription">
                    <h5>{this.props.info.name}</h5>
                    <p>{this.props.info.description}</p>
                    <div className="undr">
                        <span>₹ {this.props.info.price}</span>
                        <a onClick={() => { this.props.handler(this.props.info) }}>
                        {this.state.cart.indexOf(this.props.info.id)>-1?"Added": '+Add to cart'}</a>
                    </div>
                </div>
            </div>
        )
    }

}
export default connect(mapStateToProps)(CheffCurated);
