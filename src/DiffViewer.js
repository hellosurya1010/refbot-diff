import { useEffect, useRef } from "react";
import { schema as baseSchema } from "prosemirror-schema-basic";
import { addListNodes } from "prosemirror-schema-list";
import { Node, Schema, DOMSerializer } from "prosemirror-model";
import { EditorState, Plugin, PluginKey } from "prosemirror-state";
import { EditorView, Decoration, DecorationSet } from "prosemirror-view";
// 当前实现必须prosemirror-changeset@1.0.5
import { ChangeSet } from "prosemirror-changeset";
import { recreateTransform } from "@manuscripts/prosemirror-recreate-steps";
import { ViewMode, useModeContext } from "./store";
import "./styles.css";

const DiffViewer = ({ comparedVersion, currentVersion }) => {
  const { mode } = useModeContext();

  const domRefDiff = useRef(null);
  const domRefNew = useRef(null);
  const domRefOld = useRef(null);

  useEffect(() => {
    const { current: mountElDiff } = domRefDiff;
    const { current: mountElNew } = domRefNew;
    const { current: mountElOld } = domRefOld;
    if (mountElDiff === null || mountElNew === null || mountElOld === null) {
      return;
    }

    const withListSchema = new Schema({
      nodes: addListNodes(baseSchema.spec.nodes, "paragraph block*", "block"),
      marks: baseSchema.spec.marks
    });

    const docOld = Node.fromJSON(withListSchema, comparedVersion);
    const docNew = Node.fromJSON(withListSchema, currentVersion);

    // 旧版
    const stateOld = EditorState.create({ doc: docOld });
    const viewOld = new EditorView(mountElOld, { state: stateOld });
    // 新版
    const stateNew = EditorState.create({ doc: docNew });
    const viewNew = new EditorView(mountElNew, { state: stateNew });
    // 差异
    let tr = recreateTransform(docOld, docNew);
    let decoration = DecorationSet.empty;
    let changes = ChangeSet.create(docOld).addSteps(tr.doc, tr.mapping.maps);
    changes.inserted.forEach((insertion) => {
      decoration = decoration.add(tr.doc, [
        Decoration.inline(
          insertion.from,
          insertion.to,
          { class: "diff insertion" },
          {}
        )
      ]);
    });
    changes.deleted.forEach((deletion) => {
      let dom = document.createElement("span");
      dom.setAttribute("class", "diff deletion");
      dom.appendChild(
        DOMSerializer.fromSchema(withListSchema).serializeFragment(
          deletion.slice.content
        )
      );
      decoration = decoration.add(tr.doc, [
        Decoration.widget(deletion.pos, dom, { marks: [] })
      ]);
    });
    const stateDiff = EditorState.create({
      doc: tr.doc,
      plugins: [
        new Plugin({
          key: new PluginKey("diffs"),
          props: {
            decorations(state) {
              return decoration;
            }
          },
          filterTransaction: (tr) => false
        })
      ]
    });
    const viewDiff = new EditorView(mountElDiff, { state: stateDiff });

    return () => {
      viewDiff.destroy();
      viewNew.destroy();
      viewOld.destroy();
    };
  }, [comparedVersion, currentVersion]);

  const styleProp = (where) => {
    return mode === where ? { display: "block" } : { display: "none" };
  };

  return (
    <article>
      <div
        style={styleProp(ViewMode.DIFF)}
        className="editor-container"
        ref={domRefDiff}
      />
      <div
        style={styleProp(ViewMode.NEW)}
        className="editor-container"
        ref={domRefNew}
      />
      <div
        style={styleProp(ViewMode.OLD)}
        className="editor-container"
        ref={domRefOld}
      />
    </article>
  );
};

export default DiffViewer;
