import React from 'react'
import {Route,Link,BrowserRouter as Router} from 'react-router-dom'
import Plcomponent from './pl'
import Summary from './summary'
import APIEndPoints from '../../utils/APIEndPoints';
import { ComponentHelpers, connect } from '../../utils/componentHelper'
import httpClient from '../../utils/httpClient';
import Loading from '../loader'

  function val_y(x)
  {
    var y =  175*175-(x - 140)*(x-140);
    return Math.floor(Math.sqrt(y) - 195);
  }
class Bowlselect extends ComponentHelpers { 
    constructor(){
        super();
        this.clicked = false;
        this.hdl = this.hdl.bind(this);
        this.hd2 = this.hd2.bind(this);
        this.hdl1 = this.hdl1.bind(this);
        this.startanimation = 0;
        this.veggie = []
        this.btncheck = this.btncheck.bind(this);
        this.state ={
           leftbtn:0,
           rightbtn:0,
           loading: true,
           veggies: []
        };
    }
    cl=(e)=>{
        e.target.style.transition = 'all 0.5s linear';
        document.querySelector('.mainSummaryWrap').classList.remove("circle_animation1");
        document.querySelector('.mainSummaryWrap').classList.remove("circle_animation2");
        if (this.clicked == false) {
          document.querySelector('.forSumm').style.transform = 'translateY(190px)';
          document.querySelector('.mainSummaryWrap').classList.add("circle_animation1");
          this.clicked = true;
          e.target.style.transform = 'translateY(-145px)';
          e.target.src = './images/summ1.png';
        } else {
          document.querySelector('.forSumm').style.transform = 'translateY(0px)';
          document.querySelector('.mainSummaryWrap').classList.add("circle_animation2");
          this.clicked = false;
          e.target.style.transform = 'translateY(0px)';
          e.target.src = './images/ordsm.png';
        }
    }
   async componentDidMount(){
        this.startanimation = 0;
        this.startanimationcount = 280;
        try {
          this.setState({ loading: true })
          this.source = httpClient.getSource()
          const response = await httpClient.ApiCall('post', APIEndPoints.getVeggies, {
            kitchen_id: this.props.data.kitchen_id
          }, this.source.token)
          this.setState({
            veggies: JSON.parse(JSON.stringify(response.data).replace(/picture/g, 'src')),
            loading: false
          })
          this.interval1 = setInterval(() => {
            this.hdl1();
          }, 5);
        } catch (error) {
          if (error.message !== "unMounted") {
            this.setState({ loading: false })
          }
          console.log(error)
        }
    }
    componentWillUnmount(){
      this.source.cancel('unMounted')
        clearInterval(this.interval);
        
    }
    btncheck()
    {
      let tmp = document.querySelectorAll('.choosePl');
      var leftflag = 0;
      var rightflag = 0;
      for(var i = 0; i<tmp.length;i++)
      {
        var xx = tmp[i].style.transform.split(",")[0].split("(")[1];
        var xx1 = xx.slice(0, xx.length-2);
        var x = Number(xx1);
        if( x > 300)
        {
           leftflag = 1
        }
        if( x < 0)
        {
           rightflag = 1;
        }
      }
      this.setState(
        {
           leftbtn:leftflag,
           rightbtn:rightflag
        }
      )
    }
    renderbtn() {
      let leftHdl = () => {};
      let rightHdl = () => {};
      let classLeft = 'fa fa-chevron-left fa-2x arrowLeft';
      let classRight = 'fa fa-chevron-right fa-2x arrowRight';
      if (this.state.leftbtn == 1 && this.state.rightbtn == 0) {
        leftHdl = this.hd2;
        classLeft += ' activeArrow'
      } else if (this.state.rightbtn == 1 && this.state.leftbtn == 0) {
        rightHdl = this.hdl;
        classRight += ' activeArrow'
      } else if (this.state.rightbtn == 1 && this.state.leftbtn == 1){
        leftHdl = this.hd2;
        rightHdl = this.hdl;
        classLeft += ' activeArrow'
        classRight += ' activeArrow'
      }
  
      return (
        <div>
          <i
            onClick={leftHdl}
            className={classLeft}
          />
          <i
            onClick={rightHdl}
            className={classRight}
          />
        </div>
      );
    }
    hdl1(){
       this.startanimationcount-= 5;
       if(this.startanimationcount <-20)
       {
        let tmp = document.querySelectorAll('.choosePl');
        for(var i = 0; i<tmp.length;i++){
          tmp[i].style.transition = 'all 0.2s linear';
          if(tmp[i].id == 4)
           {
               tmp[i].style.transform = "translate(280px,"+val_y(280)+"px)";
           }else if(tmp[i].id == 3)
           {
               tmp[i].style.transform = "translate(215px,"+val_y(215)+"px)";
           }else if(tmp[i].id == 2)
           {
               tmp[i].style.transform = "translate(140px,"+val_y(140)+"px)";
           }else if(tmp[i].id == 1)
           {
               tmp[i].style.transform = "translate(65px,"+val_y(65)+"px)";
           }else if(tmp[i].id == 0)
           {
               tmp[i].style.transform = "translate(0px,"+val_y(0)+"px)";
           }
        }
          this.startanimation = 1;
          this.btncheck();
       }
       if(this.startanimation == 0)
       {
  
        let tmp = document.querySelectorAll('.choosePl');
        for(var i = 0; i<tmp.length;i++)
        {
           if(tmp[i].id == 0)
           {
               tmp[i].style.transform = "translate("+this.startanimationcount+"px,"+val_y(this.startanimationcount)+"px)";
           }else if(tmp[i].id == 1)
           {
             if(this.startanimationcount < 215)
             {
                var x = this.startanimationcount + 65;
                var y = val_y(x);
                tmp[i].style.transform = "translate("+x+"px,"+y+"px)";
             }
           }else if(tmp[i].id == 2)
           {
            if(this.startanimationcount < 140)
            {
               var x = this.startanimationcount + 140;
               var y = val_y(x);
               tmp[i].style.transform = "translate("+x+"px,"+y+"px)";
            }
           }else if(tmp[i].id == 3)
           {
            if(this.startanimationcount < 65)
            {
               var x = this.startanimationcount + 215;
               var y = val_y(x);
               tmp[i].style.transform = "translate("+x+"px,"+y+"px)";
            }
           }else if(tmp[i].id == 4)
           {
            if(this.startanimationcount < 10)
            {
               var x = this.startanimationcount + 280;
               var y = val_y(x);
               tmp[i].style.transform = "translate("+x+"px,"+y+"px)";
            }
           }
        }
       }
       else{
       
        clearInterval(this.interval1);
       }
    }
    hdl(){
      let tmp = document.querySelectorAll('.choosePl');
      for(var i = 0; i<tmp.length;i++)
      {
         tmp[i].style.transition = 'all 0.5s linear';
         var xx = tmp[i].style.transform.split(",")[0].split("(")[1];
         var xx1 = xx.slice(0, xx.length-2);
         var yy = tmp[i].style.transform.split(",")[1].split(")")[0];
         var yy1 = yy.slice(0, yy.length-2);
         var x = Number(xx1);
         var y = Number(yy1);
         if( x == -70 && y == -130)
         {
             tmp[i].style.transform = "translate(0px, -90px)";
         }else if( x == 0 && y == -90)
         {
             tmp[i].style.transform = "translate(65px, -37px)";
         }else if(x == 65 && y == -37)
         {
             tmp[i].style.transform = "translate(140px, -20px)";
         }else if(x == 140 && y == -20)
         {
             tmp[i].style.transform = "translate(215px, -37px)";
         }else if(x == 215 && y == -37)
         {
             tmp[i].style.transform = "translate(280px, -90px)";
         }else if(x == 280 && y == -90)
         {
             if(tmp.length > 5) {tmp[i].style.transform = "translate(350px, -130px) scale(0)";}
             else{
                  tmp[i].style.transition = 'all 0s linear';
                  tmp[i].style.transform = "translate(0px, -90px)";
             } 
         }else{
              if(x == 350 + (tmp.length - 6) * 70)
              {
                tmp[i].style.transition = 'all 0s linear';
                tmp[i].style.transform = "translate(0px, -90px)";
              }else{
                var x_next = x + 70;
                tmp[i].style.transform = "translate("+x_next+"px, -130px) scale(0)";
              }
              
         }
  
      }
      this.btncheck();
    };
    hd2(){
      let tmp = document.querySelectorAll('.choosePl');
      for(var i = 0; i<tmp.length;i++)
      {
         tmp[i].style.transition = 'all 0.5s linear';
         var xx = tmp[i].style.transform.split(",")[0].split("(")[1];
         var xx1 = xx.slice(0, xx.length-2);
         var yy = tmp[i].style.transform.split(",")[1].split(")")[0];
         var yy1 = yy.slice(0, yy.length-2);
         var x = Number(xx1);
         var y = Number(yy1);
         if( x == 0 && y == -90)
         {
             if(tmp.length > 5)
             {
                var x = 350 + (tmp.length - 6) * 70;
                // tmp[i].style.transform = "translate("+x+"px, -130px) scale(0)";
                tmp[i].style.transform = "translate(-70px, -130px) scale(0)";
             }
             else{
                  tmp[i].style.transition = 'all 0s linear';
                  tmp[i].style.transform = "translate(280px, -90px)";
             } 
         }else if(x == 65 && y == -37)
         {
             tmp[i].style.transform = "translate(0px, -90px)";
         }else if(x == 140 && y == -20)
         {
             tmp[i].style.transform = "translate(65px, -37px)";
         }else if(x == 215 && y == -37)
         {
             tmp[i].style.transform = "translate(140px, -20px)";
         }else if(x == 280 && y == -90)
         {
            tmp[i].style.transform = "translate(215px, -37px)";
         }else{
              if(x == 350 )
              {
                // tmp[i].style.transition = 'all 0s linear';
                tmp[i].style.transform = "translate(280px, -90px)";
              }else{
                var x_next = x - 70;
                tmp[i].style.transform = "translate("+x_next+"px, -130px) scale(0)";
              }
              
         }
  
      }
      this.btncheck();
    };

    addVeggies = (veggie) => {
      const index = this.veggie.indexOf(veggie)
      if (index > -1) {
        this.veggie.splice(index, 1)
      } else {
        this.veggie.push(veggie)
      }
    }
  
    addVeggieToOrder = () => {
      console.log(this.veggie[0])
      this.props.placeOrder(Object.assign(this.props.data.placeOrder, { vegetable: this.veggie[0] }))
    }

    render(){
      const cost = this.props.data.getOrderPrice()
        return(
            <div className="mainWrapForSect">
              <Loading data={this.state.loading} />
            <div className="bowlSelectContainer updatet forSumm">
                 <div className="circle updatetCircle">
                    <Summary/>
                   <Link to="/bowlselect3"><img className="prevBtn" src="./images/prevBtn.png"/></Link>
                   <p hidden={!cost} className="orderTotal">&#8377; {cost}</p>
                   <img onClick={this.cl.bind(this)} className="ordsm" src="./images/ordsm.png"></img>
                    <div className="selectCont regCont">
                        <span className="entered"></span>
                        <span className="entered"></span>
                        <span className="entered"></span>
                        <span className="active"></span> 
                        <span></span>
                        <span></span>
                    </div>
                    <img className="regMainBowl" src="./images/regularBowl.png" />
                    
                    <div className="textArea updatetTextarea">
                        <p>Select your</p> <span>veggies</span> <h2 style={{fontSize:"8px",textAlign:'center'}}>(choose any 3)</h2>
                        </div>
                </div> 
                <div className="under-sect plpops">
                {this.state.loading || this.state.sauces.length < 0?"": this.renderbtn()}
                    {
                        this.state.veggies.map((item , index) => {
                           return  <Plcomponent handler={this.addVeggies} type={'veggies'} info = {item} key= {index} id={index}/>
                        })
                    }
                </div>
                <Link to="/bowlselect5" className="skpBtn">Skip >></Link>
                <Link onClick={this.addVeggieToOrder} to="/bowlselect5" className="nextBtn wtCart">Next</Link>
                <Link to="/cart" className="cartBtn">Your cart</Link>
            </div>
            </div>
        )
    }
}
export default connect(Bowlselect);