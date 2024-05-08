import { useState } from "react";
import { ViewMode, useModeContext } from "./store";

const ModeSwitch = () => {
  const { mode, setMode } = useModeContext();
  const [num, setNum] = useState(0);
  setTimeout(() => {
    const diffClass = ".diff";
    const diffs = document.querySelectorAll(diffClass);
    setNum(diffs.length);
  });
  return (
    <nav>
      <span>
        <button
          onClick={() => setMode(ViewMode.DIFF)}
          className={`${mode === ViewMode.DIFF ? "on" : "off"}`}
        >
          看差异
        </button>
        <button
          onClick={() => setMode(ViewMode.NEW)}
          className={`${mode === ViewMode.NEW ? "on" : "off"}`}
        >
          看新版
        </button>
        <button
          onClick={() => setMode(ViewMode.OLD)}
          className={`${mode === ViewMode.OLD ? "on" : "off"}`}
        >
          看旧版
        </button>
      </span>
      {num && <span className="diff_num">差异数：{num}</span>}
    </nav>
  );
};

export default ModeSwitch;
