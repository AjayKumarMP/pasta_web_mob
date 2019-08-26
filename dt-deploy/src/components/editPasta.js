import React from "react";
import { connect } from "react-redux";
import { Route, Link, BrowserRouter as Router } from "react-router-dom";

import  '../shared.scss';
import '../styles/editPasta.scss';
import '../styles/yourCart.scss';
import {ReactComponent as BackLogo} from '../assets/icons/back2.svg'

let mapStateToProps = state => {
  return { data: state };
};

class Editpasta extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      pasta: this.props.location.state
    }
  }
  render() {

    return (
      <div className='container editPastaContainer'>
        <div className='wrapper'>
          <div className='header'>
            <Link href="/"><BackLogo /></Link>
            Edit Pasta
          </div>
  
          <div className='cartWrapper'>
            <div>
              <div className='editPastaCard'>
                <div>
                  BOWL
                  <br />
                  Big bowl
                </div>
  
                <div className='changeBtn'>
                  Change
                </div>
              </div>
  
              <div className='editPastaCard'>
                <div>
                  BOWL
                  <br />
                  Big bowl
                </div>
  
                <div className='changeBtn'>
                  Change
                </div>
              </div>
  
              <div className='editPastaCard'>
                <div>
                  BOWL
                  <br />
                  Big bowl
                </div>
  
                <div className='changeBtn'>
                  Change
                </div>
              </div>
            </div>
  
            <div>
              <div className='editPastaCard'>
                <div>
                  BOWL
                  <br />
                  Big bowl
                </div>
  
                <div className='changeBtn'>
                  Change
                </div>
              </div><div className='editPastaCard'>
              <div>
                BOWL
                <br />
                Big bowl
              </div>
  
              <div className='changeBtn'>
                Change
              </div>
            </div>
              <div className='editPastaCard'>
                <div>
                  BOWL
                  <br />
                  Big bowl
                </div>
  
                <div className='changeBtn'>
                  Change
                </div>
              </div>
  
            </div>
          </div>
  
          <div className='center'>
            <button className='yourCartBtn'>Your Cart</button>
          </div>
  
  
  
  
  
        </div>
      </div>
    );



    // const item = this.state.pasta
    // return (
    //   <div className="contactUsWrapp">
    //     <div className="cnt-nav">
    //       <Link to="/cart">
    //         <img className="prevBtn" src="./images/prevBtn.png" />
    //       </Link>
    //       <h4>Edit pasta</h4>
    //     </div>
    //     <div className="editPastaItemsWrap">
    //       <div className="editPastaItem">
    //         <div className="editPastaItemLeft">
    //           <h5>BOWL</h5>
    //           <p>{item['bowl'] ?item["bowl"].name: 'Not selected'}</p>
    //         </div>
    //         <div className="editPastaItemRight">
		// 	<Link to="/bowlSelect1">
    //         CHANGE
    //       </Link>
    //         </div>
    //       </div>
		//   <div className="editPastaItem">
    //         <div className="editPastaItemLeft">
    //           <h5>SAUCE</h5>
    //           <p>{item['sauce'] ?item['sauce'].name: 'Not selected'}</p>
    //         </div>
    //         <div className="editPastaItemRight">
		// 	<Link to="/bowlSelect2">
    //         CHANGE
    //       </Link>
    //         </div>
    //       </div>
		//   <div className="editPastaItem">
    //         <div className="editPastaItemLeft">
    //           <h5>PASTA</h5>
    //           <p>{item['pasta'] ? item['pasta'].name:'Not selected'}</p>
    //         </div>
    //         <div className="editPastaItemRight">
		// 	<Link to="/bowlSelect3">
    //         CHANGE
    //       </Link>
    //         </div>
    //       </div>

    //     </div>
    //   </div>
    // );
  }
}
export default connect(mapStateToProps)(Editpasta);
