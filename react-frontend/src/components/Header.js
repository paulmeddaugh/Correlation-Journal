import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Header.module.css';
import appStyles from '../styles/App.module.css';

const Header = ({ username }, ref) => {

    return (
        <div id="header" ref={ref}>
            <nav className={"navbar navbar-expand-lg navbar-light " + styles.headerColor}>
                <div className="container-fluid flex-column flex-md-row bd-navbar">
                <a className="navbar-brand" href="#"> <span className={appStyles.whiteText}> Correlation Journal </span></a>
                    <div className="navbar-nav-scroll">
                        <div>
                            <Link to="/editor">
                                <button className="btn btn-outline-light me-2" type="button" id={styles.addNote}> Edit Notes </button>
                            </Link>
                            <Link to="/">
                                <button className="btn btn-outline-light me-2" type="button" id={styles.journalWall}> Journal Wall </button>
                            </Link>
                        </div>
                    </div>
                    <ul className="navbar-nav flex-row ml-md-auto d-md-flex">
                        <li><Link to="account">Account: {username}</Link></li>
                    </ul>
                </div>
            </nav>
        </div>
    );
}

export default forwardRef(Header);