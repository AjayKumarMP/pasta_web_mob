import React from 'react';
import Swiper from 'react-id-swiper';
import Favorite from './favComp'

class SimpleSwiperWithParams extends React.Component{
    constructor(props){
        super(props);
      }
    render(){
        const params = {
            slidesPerView: 'auto',
            spaceBetween: 0,
            freeMode: true,
            slideClass: 'favorite',
          }

        return(
            <Swiper {...params}> 

            {
                this.props.info.map((item,index)=>{
                    return <Favorite handler={this.props.handlerFunc} index={index} info = {item} key={index}/>
                    
                })
            }
           </Swiper>
        )
  } 
 }


export default SimpleSwiperWithParams;