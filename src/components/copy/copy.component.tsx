import "./copy.styles.css";
import { useEffect } from "react";
import { FaRegCopy, FaCheck } from "react-icons/fa";

type CopyPropsTypes = {
  text: string | null;
  isCopied: boolean;
  setIsCopied: (n: boolean) => void;
};
const Copy: React.FC<CopyPropsTypes> = ({ text, setIsCopied, isCopied }) => {
  const handlecopy = async () => {
    if (text) {
      try {
        await navigator.clipboard.writeText(text);
        setIsCopied(true);
      } catch (err) {
        console.error("Failed to copy text: ", err);
      }
    }
  };

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied, setIsCopied]);

  return (
    <div className="copy-container">
      <button onClick={handlecopy} className={isCopied ? "copied" : ""}>
        {isCopied ? <FaCheck size={20} /> : <FaRegCopy size={20} />}
        {isCopied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
};

export default Copy;
