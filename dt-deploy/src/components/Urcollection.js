import React from 'react'
import {Route,Link,BrowserRouter as Router} from 'react-router-dom'
import {connect} from 'react-redux'
import Comp from './favComp'

 let mapStateToProps=(state)=>{
    return {data:state}
  }
   
class Bowlselect extends React.Component { 
    constructor(props){
        super(props);
    }
    render(){
        return(
            <div className="contactUsWrapp">
                
                    <div className="cnt-nav">
                    <Link to="/"><img className="prevBtn" src="./images/prevBtn.png"/></Link>
                    <h4>Your collection</h4>
                    </div>
                    <div className="collectionWrapp">
                    <div className="">
                        {
                            this.props.data.yourCollection.map((item,index)=>{
                                return <Comp info={item} key={index} />
                            })
                        }
                    </div>
                </div>
             
          </div>
        )
    }
}
export default connect(mapStateToProps)(Bowlselect);