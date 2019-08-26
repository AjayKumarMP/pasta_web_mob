import React from 'react';
import { connect } from 'react-redux'
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'
import CheffItem from './chfPl'
import httpClient from '../utils/httpClient';
import APIEndPoints from '../utils/APIEndPoints';
import Loading from './loader'

let mapStateToProps = (state) => {
    return { data: state }
}


class CheffCurated extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            kitchen_id: 2,
            CheffCurated: [],
            loading: true
        }
    }

    async componentDidMount() {
        try {
            this.setState({ loading: true })
            const response = await httpClient.ApiCall('post', APIEndPoints.getChefCurated, {
                kitchen_id: this.state.kitchen_id
            })
            this.setState({
                CheffCurated: JSON.parse(JSON.stringify(response.data).replace(/picture/g, 'src')),
                loading: false
            })
        } catch (error) {
            this.setState({ loading: false })
            console.log(error)
        }
    }

    addToCart = async (data)=>{
        console.log(data)
        try {
            this.setState({loading: true})
            const requestObject = {
                kitchen_id: this.props.data.kitchen_id,
                side_id: 0,
                bowl_id: 0,
                sauce_id: 0,
                pasta_id: 0,
                garnish_id: 0,
                meat_id: 0,
                vegetable_id: 0,
                extra_id: 0,
                quantity: 1,
                curated_id: data
            }
            this.source = httpClient.getSource()
            await httpClient.ApiCall('post', APIEndPoints.addToCart, requestObject, this.source.token)
            this.setState({loading: false})
        } catch (error) {
            if(error.message !== 'UnMounted'){
                this.setState({loading: false})
            }
            console.log(error)
        }
    }

    componentWillUnmount(){
        this.source && this.source.cancel("unMounted")
    }

    render() {
        return (
            <div style={{paddingBottom: this.state.loading?'60%':'0%'}}>
                <Loading data={this.state.loading} />    
                <div className="cheffCurMainWrap">
                    <div className="headContCheff">
                        <Link to="/"><img className="btnPr" src="./images/prevBtn.png" /></Link>
                        <h5 className="srch">Search</h5>
                        <h2 className="headH2">Chef curated</h2>
                    </div>
                    <div className="cheffCuratedMainCont">
                        {
                            this.state.CheffCurated.map((item, index) => {
                                return <CheffItem handler={this.addToCart} info={item} key={index} />
                            })
                        }
                    </div>
                </div>
            </div>
        )
    }

}
export default connect(mapStateToProps)(CheffCurated);
