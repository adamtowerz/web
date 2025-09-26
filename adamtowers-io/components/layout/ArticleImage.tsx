import Image from "next/image";
import styles from "./ArticleImage.module.scss";
import classNames from "classnames";

type ArticleImageProps = {
  src: string;
  caption?: string;
  style?: any;
  left?: boolean;
  right?: boolean;
};

const ArticleImage = ({
  src,
  caption,
  style,
  left,
  right,
}: ArticleImageProps) => {
  return (
    <div
      className={classNames(styles.articleImage, {
        [styles.left]: left,
        [styles.right]: right,
      })}
      style={style}
    >
      <Image width={150} height={150} src={src} alt={caption || ""} />
      {caption && <p>{caption}</p>}
    </div>
  );
};

export default ArticleImage;
