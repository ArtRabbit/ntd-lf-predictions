import React from 'react';

const Layout = (props) => {
    return (
        <React.Fragment>
            <header>
                header
            </header>
            <div className="contents">
                {props.children}
            </div>
            <footer>
                footer
            </footer>
        </React.Fragment>
    )
}
export default Layout;
