import React from 'react'
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'
import { slideInRight } from 'react-animations';
import Radium, { StyleRoot } from 'radium';
import {ComponentHelpers, connect} from '../../utils/componentHelper'


const styles = {
    bounce: {
        animation: 'x 1s',
        animationName: Radium.keyframes(slideInRight, 'bounce')
    }
}
class Bowlselect extends ComponentHelpers {
    constructor(props) {
        super(props);
        this.state ={
            bowls: {}
        }
    }
    handler = () => {
        this.props.placeOrder({bowl: {name: "Mini bowl", id: 1, price: 100.00}})
    }

    componentDidMount(){
        // if(this.props.data.bowls.length === 0){
        //     return this.props.history.push('/bowlselect1')
        // }
        // this.obj= {}
        // this.props.data.bowls.forEach(val=>{
        //     this.obj[val["name"]]=val 
        // })
        // this.setState({bowls: this.obj})
    }

    switchBowl(){
        if(this.props.location.state){
            return
        }
        return this.props.histroy.push('/regularbowl')
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
                        <img className="regMainBowl1" src="/images/regularBowl.png" />

                        <div className="textArea updatetTextarea"><p>Select your</p> <span>bowl</span></div>
                    </div>

                    <div className="underArea">
                        <div className="mainSelectedBowl">
                            <h5>Mini bowl</h5>
                            <p>350 ml</p>
                            <span>Starting from 100</span>
                        </div>
                    </div>
                    <div className="miniBowlArea1 rightSide1">
                        <div><p>Regular bowl</p>
                        <span>650ml</span></div>
                        <div style={{cursor: this.props.location.state?'auto':'pointer' }} onClick={()=>this.switchBowl()}>
                            <img style={{opacity: this.props.location.state?0.4: 1}} className="regBowlImg1" src="./images/miniBowl.png" /></div>
                    </div>
                    <Link onClick={this.handler} to="/bowlselect2" className="nextBtn">Next</Link>
                </div>
            </StyleRoot>
        )
    }
}
export default connect(Bowlselect);