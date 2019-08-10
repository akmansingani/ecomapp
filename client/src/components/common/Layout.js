import React from 'react';
import Menu from './Menu';

const Layout = ({title = "Ecom App", description = "Ecommerce application",className,children}) => {

    return (

        <div>

            <Menu />

            <div className="jumbotron">
                <h2>{title} | Page</h2>
                <p className="lead">{description}</p>
            </div>
      
            <div className={className}>
                {children}
            </div>

        </div>
    );


}

export default Layout;