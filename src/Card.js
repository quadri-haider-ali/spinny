import React from 'react';

const Card = props => {
    if (typeof props.title !== 'undefined') {
        return <div className="card my-2" style={{width: '18rem',backgroundColor:'#454545'}}>
            <img className="card-img-top" src={props.src} alt={props.title} />
            <div className="card-body">
                <h5 className="card-title">{props.title}</h5>
                <p className="card-text ">{props.synopsis}</p>
                {/* {console.log("know more = ",props)} */}
                <a href={props.url} className="btn btn-primary">Know more</a>
            </div>
        </div>
    }
    return <div className="card my-2" style={{width: '18rem',backgroundColor:'#454545'}}>
        <h3>No Data Found</h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit...</p>
        <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris...</p>
    </div>
};

export default Card;