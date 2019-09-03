import React from 'react'
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'
import { slideInRight } from 'react-animations';
import Radium, { StyleRoot } from 'radium';
import './bowlselect.css';
import {ComponentHelpers, connect} from '../../utils/componentHelper'


const styles = {
    bounce: {
        animation: 'x 0.5s',
        animationName: Radium.keyframes(slideInRight, 'bounce')
    }
}

class Bowlselect extends ComponentHelpers {
    constructor(props) {
        super(props);
    }
    handler = () => {
        this.props.placeOrder({bowl: {name: "Regular bowl", id: 2, price: 150}})
    }

    switchBowl(){
        if(this.props.location.state){
            return
        }
        return this.props.histroy.push('/minibowl')
    }

    render() {
        return (
            <StyleRoot>
                <div className="bowlSelectContainer updatet">
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
                        <img  className="regMainBowl select1" src="/images/regularBowl.png" />

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