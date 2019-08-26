import React,{crea} from 'react';
import * as $ from 'jquery'

class FavComp extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      style: {
        boxShadow: "0px 0px 6px hsl(0, 5%, 75%)",
        border: ""
      }
    }
  }

  change(index) {
    let elements = document.getElementsByClassName('favorite')
    Object.keys(elements).forEach(val=>{
      elements[val].style.boxShadow = "0px 0px 6px hsl(0, 5%, 75%)"
      elements[val].style.border = ""
    })
    // $('.favourites').css('box-shadow', '0px 0px 6px hsl(0, 5%, 75%)').css('border','')
    // this.setState({
    //   style: {
    //     boxShadow: "0 3px 10px rgba(0,0,0,0.5)",
    //     border: "1px solid #FFFFFF"
    //   }
    // })
    var currentElement = document.getElementById(`${index}favorite`)
    if(currentElement){
      currentElement.style.boxShadow = "0 3px 10px rgba(0,0,0,0.5)"
      currentElement.style.boxShadow = "1px solid #FFFFFF"
    }
  }

  render() {
    return (
      <div id={this.props.index+"favorite"} className="favorite" style={this.state.style} 
      onClick={(e) => { this.props.handler({id:this.props.info.id, name:this.props.info.name}); this.change(this.props.index) }}>
        <img src={this.props.info.src}></img>
        <h5 id="favName">{this.props.info.name}</h5>
        <div className="under-sect">
          <div className='leftSide'>
            <div className="und-decoration">
              <span className="dot"></span>
            </div>
          </div>
          <div className="rightSide">
            <p> ₹ {this.props.info.price}</p>
          </div>
        </div>
      </div>
    )
  }
};

export default FavComp;
