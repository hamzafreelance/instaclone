import React, { Component } from 'react';

import Header from './header.component';
import Footer from './footer.component';

class Layout extends Component {
    render() {
        return(
            <>  
            <Header />
            {this.props.children}
            <Footer />
            </>
        );
    }
}

export default Layout;