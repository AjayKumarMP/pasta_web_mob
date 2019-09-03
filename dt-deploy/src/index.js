import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {NotificationContainer} from 'react-notifications';
import 'react-notifications/lib/notifications.css'
// bowl select components
import Bowlselect1 from './components/bowlselect/bowlSelect1';
import Bowlselect2 from './components/bowlselect/bowlSelect2';
import Bowlselect3 from './components/bowlselect/bowlSelect3';
import Bowlselect4 from './components/bowlselect/bowlSelect4';
import Bowlselect5 from './components/bowlselect/bowlSelect5';
import Bowlselect6 from './components/bowlselect/bowlSelect6';
import '../src/fonts/font-awesome/scss/font-awesome.css';
//bowl size select
import RegBowl from './components/bowlselect/bowlReg';
import MiniBowl from './components/bowlselect/bowlMini';
//moduls

import { Provider } from 'react-redux';

//another components
import AboutUsComponent from './components/aboutUs';
import ContactUsComponent from './components/contactUs';
import SelectSides from './components/bowlselect/selectSides';
import ManageAdr from './components/manageAdr';
import AddAddr from './components/addAdr';
import Cart from './components/cart';
import CheffC from './components/cheffCurated';
import Myorders from './components/myOrder';
import YrCollection from './components/Urcollection';
import Payment from './components/payment';
import ApplyC from './components/appC';
import Pmethods from './components/paymentMethod';
import LoginComp from './components/login';
import Congr from './components/bowlselect/congratulations';
import Thanks from './components/bowlselect/thanks';
import TrackOrd from './components/bowlselect/trackorder';
import Editpasta from './components/editPasta';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';
import aboutUs from './components/aboutUs';
import Urcollection from './components/Urcollection';
import store from './store/reduxStore'
import httpClient from './utils/httpClient';
import Register from './components/Register/register'

// store.subscribe(() => {
// 	console.log(store.getState());
// });

const routing = (
	<Provider store={store}>
		<Router>
		<NotificationContainer />
			<div className='homePage-wrapper'>
				<Route path='/cheff' component={CheffC} />
				<Route path='/regularbowl' component={RegBowl} />
				<Route path='/minibowl' component={MiniBowl} />
				<Route path='/contactus' component={ContactUsComponent} />
				<Route path='/yourcollection' component={Urcollection} />
				<Route path='/manageaddress' component={ManageAdr} />
				<Route path='/addaddress' component={AddAddr} />
				<Route path='/cart' component={Cart} />
				<Route path='/apply' component={ApplyC} />
				<Route path='/payment' component={Payment} />
				<Route path='/aboutus' component={AboutUsComponent} />
				<Route path='/bowlselect1' component={Bowlselect1} />
				<Route path='/order-summary' component={Bowlselect2} />
				<Route path='/register' component={Register} />
				<Route path='/bowlselect4' component={Bowlselect4} />
				<Route path='/bowlselect5' component={Bowlselect5} />
				<Route path='/bowlselect6' component={Bowlselect6} />
				<Route path='/myorders' component={Myorders} />
				<Route path='/selectsides' component={SelectSides} />
				<Route path='/paymentmethods' component={Pmethods} />
				<Route path='/thanksfororder' component={Thanks} />
				<Route path='/login' component={LoginComp} />
				<Route path='/editpasta' component={Editpasta} />
				<Route path='/ordertracker' component={TrackOrd} />
				<Route path='/congratulations' component={Congr} />
				<Route exact path='/' component={App} />
			</div>
		</Router>
	</Provider>
);
const user = localStorage.getItem('user')
const userDetails = user !== 'undefined' ? JSON.parse(user) : ''
if (userDetails && userDetails !== "" && userDetails.access_token !== undefined) {
	httpClient.setDefaultHeader('access-token', userDetails.access_token)
}
// payment ,paymentmethods , youcollection , login
ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
