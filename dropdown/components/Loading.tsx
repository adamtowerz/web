import styles from "./Loading.module.scss";

// see the styles
const Loading = () => {
  return (
    <div className={styles.lds}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default Loading;
