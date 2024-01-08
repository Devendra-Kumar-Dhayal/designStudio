import React from 'react';
import kafka from './images/kafka.png'
import boomi from './images/boomi.png'
export function IconKafka(props) {
  return (
    <div className="container">
      <img src={kafka} alt="kafka button" className="w-10 h-5 mx-auto" />
    </div>
  );
}

export function IconBoomi(props) {
    return (
    <div className="container">
        <img  src={boomi} alt="boomi button" className='w-10 h-5 mx-auto'/>
    </div>
    );
  }
export function IconApp_R(props) {
    return (
    <div className="container">
        <h1>App Rectangle</h1>
        {/* <img  src={boomi} alt="boomi button"/> */}
    </div>
    );
  }
export function IconApp_C(props) {
    return (
    <div className="container">
        <h1>App Circle</h1>
        {/* <img  src={boomi} alt="boomi button"/> */}
    </div>
    );
  }
  
