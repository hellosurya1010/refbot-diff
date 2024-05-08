import ModeSwitch from "./ModeSwitch";
import DiffViewer from "./DiffViewer";
import { ModeProvider } from "./store";
import mockDocOld from "./doc/docOld";
import mockDocNew from "./doc/docNew";

export default () => {
  return (
    <ModeProvider>
      <ModeSwitch />
      <DiffViewer comparedVersion={mockDocOld} currentVersion={mockDocNew} />
    </ModeProvider>
  );
};
