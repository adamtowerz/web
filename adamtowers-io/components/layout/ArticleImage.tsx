import Image from "next/image";
import styles from "./ArticleImage.module.scss";

type ArticleImageProps = {
  src: string;
  caption?: string;
  style?: any;
};

const ArticleImage = ({ src, caption, style }: ArticleImageProps) => {
  return (
    <div className={styles.articleImage} style={style}>
      <Image width={150} height={150} src={src} />
      {caption && <p>{caption}</p>}
    </div>
  );
};

export default ArticleImage;
