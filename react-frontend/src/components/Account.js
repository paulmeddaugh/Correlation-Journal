import styles from '../styles/Account.module.css';

const Account = ({ user, graphValues }) => {
    return (
        <div className={styles.main}>
            <div className={styles.info}>
                <div>Name: <b>{user.name}</b></div>
                <div>Username: <b>{user.username}</b></div>
                <div>Email: <b>{user.email}</b></div>
                <div>Date Created: <b>{new Date(user.dateCreated)
                        .toLocaleDateString('en-us', { month:"short", day:"numeric", year: "numeric"})}</b></div>
            </div>
        </div>
    )
}

export default Account;