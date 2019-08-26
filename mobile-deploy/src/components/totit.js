import React from 'react'

class Ord extends React.Component{

    render(){
        return(
           <div>
               <span>{this.props.info.name}</span>
               <span> {this.props.info.quantity}</span>
               <span> x {this.props.price}</span>
           </div>
        )
    }
}
export default Ord;