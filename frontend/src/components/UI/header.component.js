import React, { Component } from "react";

class Header extends Component {
  
    state = {
        showMenu: false
    };

    toggleMenu = () => {
        this.setState( prevState => ({showMenu: !prevState.showMenu}));
    }

    render() {
      
    return (
      <>
        <header className="site-header">
          <div className={ "site-branding" + (!this.state.showMenu ? '': ' hide') } >
            <h1 className="site-title">
              <a href="index.html" rel="home">
                <img src="../../images/logo.png" alt="Logo" />
              </a>
            </h1>
          </div>
          <div className={ "hamburger-menu" + (this.state.showMenu ? " close": "") }>
            <div className="menu-icon">
              <img src="../../images/menu-icon.png" alt="menu icon" onClick={this.toggleMenu} />
            </div>

            <div className={ "menu-close-icon" + (!this.state.showMenu ? ' hide': '')} >
              <img src="../../images/x.png" alt="menu close icon" onClick={this.toggleMenu} />
            </div>
          </div>
        </header>
        <nav className={"site-navigation flex flex-column justify-content-between" + (this.state.showMenu ? ' show' : '')}>
          <div className="site-branding d-none d-lg-block ">
            <h1 className="site-title">
              <a href="index.html" rel="home">
                <img src="images/logo2.png" alt="Logo" />
              </a>
            </h1>
          </div>
          <ul className="main-menu flex flex-column justify-content-center">
            <li className="current-menu-item">
              <a href="index.html">Home</a>
            </li>
            <li>
              <a href="portfolio.html">Portfolio</a>
            </li>
            <li>
              <a href="blog.html">Blog</a>
            </li>
            <li>
              <a href="#">About</a>
            </li>
            <li>
              <a href="#">Contact</a>
            </li>
          </ul>
          <p></p>
          <div className="social-profiles">
            <ul className="flex justify-content-start justify-content-lg-center align-items-center">
              <li>
                <a href="#">
                  <i className="fa fa-facebook"></i>
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="fa fa-instagram"></i>
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="fa fa-twitter"></i>
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="fa fa-pinterest"></i>
                </a>
              </li>
            </ul>
          </div>
        </nav>
        <div className="nav-bar-sep d-lg-none"></div>
      </>
    );
  }
}
export default Header;
