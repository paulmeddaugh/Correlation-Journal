import appStyles from '../../styles/App.module.css';
import styles from '../../styles/LoginComponentStyles/Loading.module.css';

const Loading = () => {
    return (
        <div className={appStyles.fullSize + ' ' + styles.container}>
            <div className={styles.loadingCenterContainer}>
                <div className={styles.loadingIcon} />
                <div className={styles.text}>Loading...</div>
            </div>
        </div>
    );
}
export default Loading;