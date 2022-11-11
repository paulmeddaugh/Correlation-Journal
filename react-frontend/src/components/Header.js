import { forwardRef } from 'react';
import styles from '../styles/Header.module.css';
import appStyles from '../styles/App.module.css';

const Header = ({ username }, ref) => {

    return (
        <div id="header" ref={ref}>
            <nav className={"navbar navbar-expand-lg navbar-light " + styles.headerColor}>
                <div className="container-fluid flex-column flex-md-row bd-navbar">
                <a className="navbar-brand" href="#"> <span className={appStyles.whiteText}> Correlate Journal </span></a>
                    <div className="navbar-nav-scroll">
                        <div>
                            <button className="btn btn-outline-light me-2" type="button" id={styles.addNote}> Edit Notes </button>
                            <button className="btn btn-outline-light me-2" type="button" id={styles.journalWall}> Journal Wall </button>
                        </div>
                    </div>
                    <ul className="navbar-nav flex-row ml-md-auto d-md-flex">
                        <li><a href="../pages/account.html">Account: {username}</a></li>
                    </ul>
                </div>
            </nav>
        </div>
    );
}

export default forwardRef(Header);