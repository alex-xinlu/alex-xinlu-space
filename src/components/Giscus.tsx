import GiscusComments from "@giscus/react";
import { useEffect, useState } from "react";

const REPO = "alex-xinlu/alex-xinlu-space";
const REPO_ID = "R_kgDOSiGdWg";
const CATEGORY = "Announcements";
const CATEGORY_ID = "DIC_kwDOSiGdWs4C9uw-";

function getTheme() {
  if (typeof document === "undefined") return "light";
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export default function Giscus() {
  const [theme, setTheme] = useState(getTheme);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(getTheme());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  if (!REPO_ID || !CATEGORY_ID) {
    return null;
  }

  return (
    <GiscusComments
      repo={REPO}
      repoId={REPO_ID}
      category={CATEGORY}
      categoryId={CATEGORY_ID}
      mapping="pathname"
      strict="0"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="bottom"
      theme={theme}
      lang="zh-CN"
      loading="lazy"
    />
  );
}
