import {
  FolderOpenOutlined,
  HighlightOutlined,
  MenuUnfoldOutlined,
  PlusOutlined,
  RedoOutlined,
  SaveOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import state from "../store/state";
import store from "../store/global";
import {
  cloneNotation,
  createNotation,
  isNote,
  notations as N,
  placeTie,
} from "../util/notation";
import {
  cloneParagraph,
  createParagraph,
  createParagraphWithNotations,
} from "../util/paragraph";
import { convertTone, convertToneTo } from "../util/tone-convert";
import { exportFile, loadFile, saveFile } from "../util/file";
import { findParagraphAndNotation, resetGlobalData } from "../util/editor";
import {
  go,
  runInWrappedAction,
  unwrappedAction,
  wrappedAction,
} from "../store/history";

const { SubMenu } = Menu;

const handleOpenFile = unwrappedAction((ev) => {
  const file = ev.target.files[0];
  loadFile(file);
});
const handleSaveFile = () => {
  saveFile();
};
const handleExportFile = unwrappedAction(() => {
  state.selectedNotationKey = null;
  exportFile();
});
const handleCreate = () => {
  resetGlobalData();
};
const handleEditMenu = wrappedAction(({ key }) => {
  switch (key) {
    case "undo":
      go(-1);
      break;
    case "redo":
      go(1);
      break;
    case "reset-title":
      runInWrappedAction(() => {
        store.title = "【歌曲名称】";
      });
      break;
    case "reset-authors":
      store.authors = [
        "【作曲者】  作曲",
        "【填词者】  填词",
        "【记谱者】  记谱",
      ];
      break;
    case "add-paragraph": {
      store.paragraphs.push(createParagraphWithNotations());
      break;
    }
    default:
      break;
  }
});
const handleConvertMenu = ({ key }) => {
  switch (true) {
    case key.startsWith("convertTo"):
      const destTone = key.split("-", 2)[1];
      convertToneTo(destTone);
      break;
    case key === "convert-up":
      convertTone(2);
      break;
    case key === "convert-down":
      convertTone(-2);
      break;
    case key === "convert-up8":
      convertTone(12);
      break;
    case key === "convert-down8":
      convertTone(-12);
      break;
    default:
      break;
  }
};

// 画布上的点击事件
const handleClick = wrappedAction((ev) => {
  if (state.shouldNotationBlurAfterClick && state.selectedNotationKey) {
    state.lastSelectedNotationKey = state.selectedNotationKey;
    state.selectedNotationKey = null;
  }
  state.shouldNotationBlurAfterClick = true;
});

const handleKeyPress = wrappedAction((ev) => {
  const inputKey = ev.key.toLowerCase();
  const shift = ev.shiftKey;
  const ctrl = ev.ctrlKey;

  if (state.selectedNotationKey) {
    // 仅选中符号时作用
    if (state.helpDialogVisible || state.configDialogVisible) {
      return;
    }
    const {
      paragraph,
      notation,
      paragraphIndex,
      notationIndex,
    } = findParagraphAndNotation(state.selectedNotationKey);
    if (!notation) {
      return;
    }
    switch (true) {
      case isNote(inputKey) && !ctrl && !shift:
        notation.note = inputKey;
        break;
      case inputKey === "(" && !ctrl:
        notation.note = N.crackerOpen;
        break;
      case inputKey === ")" && !ctrl:
        notation.note = N.crackerClose;
        break;
      case inputKey === "-" && !ctrl && !shift:
        notation.note = N.extend;
        break;

      case inputKey === "|" && !ctrl:
        if (notation.note === N.separator) {
          notation.note = N.separatorEnd
          break;
        }
        if (notation.note === N.separatorEnd) {
          notation.note = N.separatorOpen
          break;
        }
        if (notation.note === N.separatorOpen) {
          notation.note = N.separatorClose
          break;
        }
        notation.note = N.separator;
        break;

      case inputKey === "u" && !ctrl && !shift:
        notation.underline += 1;
        break;
      case inputKey === "u" && !ctrl && shift:
        notation.underline -= 1;
        notation.underline = Math.max(0, notation.underline);
        break;
      case inputKey === "." && !ctrl && !shift:
        notation.dotted = !notation.dotted;
        break;
      case inputKey === "8" && !ctrl && !shift:
        notation.octave += 1;
        break;
      case inputKey === "*" && !ctrl:
        notation.octave -= 1;
        break;
      case inputKey === "#" && !ctrl:
        if (notation.prefixSups.indexOf("♯") !== 0) {
          if (notation.prefixSups[0] === "♭") {
            notation.prefixSups.shift();
          }
          notation.prefixSups.unshift("♯");
        } else {
          notation.prefixSups.shift();
        }
        break;
      case inputKey === "b" && !ctrl && !shift: {
        if (notation.prefixSups.indexOf("♭") !== 0) {
          if (notation.prefixSups[0] === "♯") {
            notation.prefixSups.shift();
          }
          notation.prefixSups.unshift("♭");
        } else {
          notation.prefixSups.shift();
        }
        break;
      }
      case inputKey === "a" && !ctrl && !shift: {
        if (!state.tieSourceKey) {
          state.tieSourceKey = notation.key;
        } else if (state.tieSourceKey === notation.key) {
          state.tieSourceKey = null;
        } else {
          placeTie(notation);
        }
        break;
      }
      case inputKey === "a" && !ctrl && shift: {
        if (notation.tieTo) {
          const { notation: tieDesc } = findParagraphAndNotation(
            notation.tieTo
          );
          if (tieDesc) {
            tieDesc.tieTo = null;
          }
          notation.tieTo = null;
          break;
        }
      }
      case inputKey === "!" && !ctrl: {
        notation.breakUnderline = !notation.breakUnderline;
        break;
      }
      case inputKey === "~" && !ctrl: {
        if (notation.topDecorators.includes("~")) {
          notation.topDecorators.splice(notation.topDecorators.indexOf("~"), 1);
        } else {
          notation.topDecorators.push("~");
        }
        break;
      }
      case inputKey === "enter" && !ctrl && !shift: {
        if (paragraph.notations[notationIndex + 1]) {
          state.selectedNotationKey =
            paragraph.notations[notationIndex + 1].key;
        } else {
          const nextNotation = createNotation();
          paragraph.notations.push(nextNotation);
          state.selectedNotationKey = nextNotation.key;
        }
        break;
      }
      case inputKey === "l" && !ctrl && !shift: {
        const nextNotation =
          paragraph.notations[notationIndex + 1] ||
          store.paragraphs[paragraphIndex + 1].notations?.at(0);
        if (nextNotation) {
          state.selectedNotationKey = nextNotation.key;
        }
        break;
      }
      case inputKey === "enter" && !ctrl && shift: {
        if (paragraph.notations[notationIndex - 1]) {
          state.selectedNotationKey =
            paragraph.notations[notationIndex - 1].key;
        }
        break;
      }
      case inputKey === "h" && !ctrl && !shift: {
        const prevNotation =
          paragraph.notations[notationIndex - 1] ||
          store.paragraphs[paragraphIndex - 1].notations?.at(-1);
        if (prevNotation) {
          state.selectedNotationKey = prevNotation.key;
        }
        break;
      }
      case inputKey === "enter" && ctrl && !shift: {
        const newNotation = createNotation();
        if (
          notationIndex === paragraph.notations.length - 1 &&
          paragraphIndex === store.paragraphs.length - 1
        ) {
          // 在最后一个音符时ctrl+enter插入新段落并创建符号
          store.paragraphs.push(createParagraph({ notations: [newNotation] }));
          state.selectedNotationKey = store.paragraphs
            .at(-1)
            .notations.at(0).key;
        } else {
          paragraph.notations.splice(notationIndex + 1, 0, newNotation);
          state.selectedNotationKey = newNotation.key;
        }
        break;
      }
      case inputKey === "j" && !ctrl && !shift: {
        const nextParagraph = store.paragraphs[paragraphIndex + 1];
        if (nextParagraph?.notations?.length) {
          const nextNotation =
            nextParagraph.notations[notationIndex] ||
            nextParagraph.notations.at(-1);
          state.selectedNotationKey = nextNotation.key;
        }
        break;
      }
      case inputKey === "k" && !ctrl && !shift: {
        const prevParagraph = store.paragraphs[paragraphIndex - 1];
        if (prevParagraph?.notations?.length) {
          const prevNotation =
            prevParagraph.notations[notationIndex] ||
            prevParagraph.notations.at(-1);
          state.selectedNotationKey = prevNotation.key;
        }
        break;
      }
      case inputKey === "backspace" && !ctrl && !shift:
      case inputKey === "delete" && !ctrl && !shift: {
        paragraph.notations.splice(notationIndex, 1);
        const currNotation =
          paragraph.notations[notationIndex] ||
          paragraph.notations[notationIndex - 1];
        state.selectedNotationKey = currNotation?.key;
        break;
      }
      case inputKey === "backspace" && !ctrl && shift:
      case inputKey === "delete" && !ctrl && shift: {
        store.paragraphs.splice(paragraphIndex, 1);
        const currParagraph =
          store.paragraphs[paragraphIndex] || store.paragraphs.at(-1);
        const currNotation =
          currParagraph?.notations?.at(notationIndex) ||
          currParagraph?.notations?.at(-1);
        state.selectedNotationKey = currNotation?.key;
        break;
      }
      case inputKey === "=" && !ctrl && !shift: {
        if (typeof paragraph.alignJustify !== "boolean") {
          paragraph.alignJustify = !(
            paragraphIndex ===
            store.paragraphs.length - 1
          );
        }
        paragraph.alignJustify = !paragraph.alignJustify;
        break;
      }
      case inputKey === "c" && ctrl && !shift: {
        ev.preventDefault();
        state.clipboardContent = notation;
        break;
      }
      case inputKey === "c" && ctrl && shift: {
        ev.preventDefault();
        state.clipboardContent = paragraph;
        break;
      }
      case inputKey === "v" && ctrl && !shift: {
        ev.preventDefault();
        if (state.clipboardContent) {
          switch (state.clipboardContent.type) {
            case "notation":
              paragraph.notations.splice(
                notationIndex + 1,
                0,
                cloneNotation(state.clipboardContent)
              );
              break;
            case "paragraph":
              store.paragraphs.splice(
                paragraphIndex + 1,
                0,
                cloneParagraph(state.clipboardContent)
              );
              break;
            default:
              state.clipboardContent = null;
          }
        }
        break;
      }
      default:
        break;
    }
  } else {
    if (!state.editableContentVisible) {
      // 仅未选中符号时
      switch (true) {
        case ["h", "j", "k", "l"].includes(inputKey): {
          const { notation: n } = findParagraphAndNotation(
            state.lastSelectedNotationKey
          );
          state.selectedNotationKey = (
            n || store.paragraphs?.at(0)?.notations?.at(0)
          )?.key;
          break;
        }
        default:
          break;
      }
    }
  }
  // 全局
  switch (true) {
    case inputKey === "z" && ctrl && !shift:
      go(-1);
      break;
    case inputKey === "y" && ctrl && !shift:
    case inputKey === "z" && ctrl && shift:
      go(1);
      break;
    case inputKey === "s" && ctrl && !shift: {
      ev.preventDefault();
      saveFile();
      break;
    }
    case inputKey === "o" && ctrl && !shift: {
      ev.preventDefault();
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".json";
      input.onchange = handleOpenFile;
      input.click();
      break;
    }
    case inputKey === "?" && !ctrl: {
      if (state.helpDialogVisible) {
        state.helpDialogVisible = false;
      } else {
        state.configDialogVisible = false;
        state.helpDialogVisible = true;
      }
      break;
    }
    default:
      break;
  }
});
const fileMenu = [
  {
    key: 'create',
    icon: <PlusOutlined />,
    label: '新建',
    onClick: handleCreate
  },
  {
    key: 'open',
    icon: <FolderOpenOutlined />,
    label: <div>
      打开
      <input
        onChange={handleOpenFile}
        accept=".json"
        type="file"
        title=""
        style={{
          opacity: 0,
          cursor: "pointer",
          width: "100%",
          left: 0,
          top: 0,
          height: "100%",
          position: "absolute",
        }}
      />
    </div>,
  },
  {
    key: 'save',
    icon: <SaveOutlined />,
    label: '保存',
    onClick: handleSaveFile
  },
  {
    key: 'export',
    icon: <SaveOutlined />,
    label: '导出为图片',
    onClick: handleExportFile
  },
];
const editMenu = [
  {
    key: "undo",
    icon: <UndoOutlined />,
    label: "撤销",
    onClick: handleEditMenu,
  },
  {
    key: "redo",
    icon: <RedoOutlined />,
    label: "重做",
    onClick: handleEditMenu,
  },
  {
    key: "add-paragraph",
    icon: <MenuUnfoldOutlined />,
    label: "添加段落",
    onClick: handleEditMenu,
  },
  {
    key: "reset-title",
    icon: <HighlightOutlined />,
    label: "重置歌曲名称",
    onClick: handleEditMenu,
  },
  {
    key: "reset-authors",
    icon: <HighlightOutlined />,
    label: "重置作者信息",
    onClick: handleEditMenu,
  },
];

const convertMenu = [
  {
    key: "convertTo",
    label: "转到...",
    children: [
      { key: "convertTo-C", label: "1 = C", onClick: handleConvertMenu },
      { key: "convertTo-D", label: "1 = D", onClick: handleConvertMenu },
      { key: "convertTo-E", label: "1 = E", onClick: handleConvertMenu },
      { key: "convertTo-F", label: "1 = F", onClick: handleConvertMenu },
      { key: "convertTo-G", label: "1 = G", onClick: handleConvertMenu },
      { key: "convertTo-A", label: "1 = A", onClick: handleConvertMenu },
      { key: "convertTo-B", label: "1 = B", onClick: handleConvertMenu },
      {
        key: "convertTo-♭D",
        label: (
          <span>
            1 = <sup>♭</sup>D
          </span>
        ),
        onClick: handleConvertMenu,
      },
      {
        key: "convertTo-♭E",
        label: (
          <span>
            1 = <sup>♭</sup>E
          </span>
        ),
        onClick: handleConvertMenu,
      },
      {
        key: "convertTo-♭G",
        label: (
          <span>
            1 = <sup>♭</sup>G
          </span>
        ),
        onClick: handleConvertMenu,
      },
      {
        key: "convertTo-♭A",
        label: (
          <span>
            1 = <sup>♭</sup>A
          </span>
        ),
        onClick: handleConvertMenu,
      },
      {
        key: "convertTo-♭B",
        label: (
          <span>
            1 = <sup>♭</sup>B
          </span>
        ),
        onClick: handleConvertMenu,
      },
    ],
  },
  {
    key: "convert-up",
    label: "升高一个音",
    onClick: handleConvertMenu,
  },
  {
    key: "convert-down",
    label: "降低一个音",
    onClick: handleConvertMenu,
  },
  {
    key: "convert-up8",
    label: "升高一个八度",
    onClick: handleConvertMenu,
  },
  {
    key: "convert-down8",
    label: "降低一个八度",
    onClick: handleConvertMenu,
  },
];

export { fileMenu, editMenu, convertMenu, handleKeyPress, handleClick };
