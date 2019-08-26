import React from "react";
import { connect } from "react-redux";
import { Route, Link, BrowserRouter as Router } from "react-router-dom";

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
    const item = this.state.pasta
    return (
      <div className="contactUsWrapp">
        <div className="cnt-nav">
          <Link to="/cart">
            <img className="prevBtn" src="./images/prevBtn.png" />
          </Link>
          <h4>Edit pasta</h4>
        </div>
        <div className="editPastaItemsWrap">
          <div className="editPastaItem">
            <div className="editPastaItemLeft">
              <h5>BOWL</h5>
              <p>{item['bowl'] ?item["bowl"].name: 'Not selected'}</p>
            </div>
            <div className="editPastaItemRight">
			<Link to="/bowlSelect1">
            CHANGE
          </Link>
            </div>
          </div>
		  <div className="editPastaItem">
            <div className="editPastaItemLeft">
              <h5>SAUCE</h5>
              <p>{item['sauce'] ?item['sauce'].name: 'Not selected'}</p>
            </div>
            <div className="editPastaItemRight">
			<Link to="/bowlSelect2">
            CHANGE
          </Link>
            </div>
          </div>
		  <div className="editPastaItem">
            <div className="editPastaItemLeft">
              <h5>PASTA</h5>
              <p>{item['pasta'] ? item['pasta'].name:'Not selected'}</p>
            </div>
            <div className="editPastaItemRight">
			<Link to="/bowlSelect3">
            CHANGE
          </Link>
            </div>
          </div>

        </div>
      </div>
    );
  }
}
export default connect(mapStateToProps)(Editpasta);
