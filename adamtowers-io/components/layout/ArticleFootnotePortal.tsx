// does not support multiple on same page
const FOOTNOTE_CONTAINER_ID = "footnotes";

export function getFootnoteContainerEl(): HTMLElement | null {
  return document.getElementById(FOOTNOTE_CONTAINER_ID);
}

const ArticleFootnotePortal = () => {
  return <div id={FOOTNOTE_CONTAINER_ID} />;
};

export default ArticleFootnotePortal;
