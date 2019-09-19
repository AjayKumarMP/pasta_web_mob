import React from 'react'
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'
import { slideInRight } from 'react-animations';
import Radium, { StyleRoot } from 'radium';
import './bowlselect.css';
import {ComponentHelpers, connect} from '../../utils/componentHelper'
import Loading from '../loader'
import httpClient from '../../utils/httpClient';
import APIEndPoints from '../../utils/APIEndPoints';


const styles = {
    bounce: {
        animation: 'x 0.5s',
        animationName: Radium.keyframes(slideInRight, 'bounce')
    }
}

class Bowlselect extends ComponentHelpers {
    constructor(props) {
        super(props);
        this.state ={
            price: 100,
            loading: true
        }
    }
    handler = () => {
        this.props.placeOrder({bowl: {name: "Regular bowl", id: 2, price: parseInt(this.state.price)}})
    }

    switchBowl(){
        if(this.props.location.state){
            return
        }
        return this.props.histroy.push('/minibowl')
    }

    async componentDidMount(){
        this.setState({loading: true})
        const response = await httpClient.ApiCall('post', APIEndPoints.getBowls, {
            kitchen_id: this.props.data.kitchen_id
        })
        this.setState({
            price: response.data.filter(data=>data.name.toLowerCase() === 'regular bowl')[0].price
        })
        this.setState({loading: false})
    }

    render() {
        return (
            <StyleRoot>
                <div className="bowlSelectContainer updatet">
                <Loading data={this.state.loading} />
                    <div className="circle updatetCircle">
                        <Link to="/bowlselect1">
                            <img className="prevBtn" src="./images/prevBtn.png" /></Link>
                        <div className="selectCont regCont">
                            <span className="active"></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                        {/* <img style={styles.bounce} className="regMainBowl" src="/images/regularBowl.png" /> */}
                        <img  className="regMainBowl select1" src="./images/regularBowl.png" />

                        <div className="textArea updatetTextarea"><p>Select your</p> <span>bowl</span></div>
                    </div>

                    <div className="underArea">
                        <div className="mainSelectedBowl">
                            <h5>Regular bowl</h5>
                            <p>650 ml</p>
                            <span>Starting from &#8377; 250</span>
                        </div>
                    </div>
                    <div className="miniBowlArea area1">
                        
                        <Link to={this.props.location.state?'/regularbowl':'/minibowl'} style={{cursor: this.props.location.state?'auto':'pointer' }}>
                            <img style={{opacity: this.props.location.state?0.4: 1}} src="./images/miniBowl.png" /></Link>
                        <p>Mini bowl</p>
                        <span>350ml</span>
                    </div>
                    <Link onClick={this.handler} to="/bowlselect2" className="nextBtn">Next</Link>
                </div>
            </StyleRoot>
        )
    }
}
export default connect(Bowlselect);