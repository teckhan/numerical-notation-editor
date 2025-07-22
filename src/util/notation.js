import { message } from "antd";
import { toJS } from "mobx";
import state from "../store/state";
import { wrappedAction } from "../store/history";
import { findParagraphAndNotation } from "./editor";

const notations = {
  zero: "0",
  do: "1",
  re: "2",
  mi: "3",
  fa: "4",
  sol: "5",
  la: "6",
  si: "7",
  extend: "─",
  separator: "│",
  separatorEnd: "‖",
  separatorOpen: "𝄇",
  separatorClose: "𝄆",
  crackerOpen: "(",
  crackerClose: ")",
};
const notes = [
  notations.zero,
  notations.do,
  notations.re,
  notations.mi,
  notations.fa,
  notations.sol,
  notations.la,
  notations.si,
];
const separators = [
  notations.separator,
  notations.separatorEnd,
  notations.separatorOpen,
  notations.separatorClose
];

function isNote(notationOrNote) {
  return notes.includes(notationOrNote?.note || notationOrNote);
}
function isPauseNote(notationOrNote) {
  return notations.zero === (notationOrNote?.note || notationOrNote);
}
function isSeparator(notationOrNote) {
  return separators.includes(notationOrNote?.note || notationOrNote);
}
// 创建符号
function createNotation(initial) {
  const n = {
    type: "notation",
    key: `n_${String(Math.random())}`,
    note: "0",
    octave: 0,
    dotted: false,
    underline: 0,
    breakUnderline: false,
    prefixSups: [],
    topDecorators: [],
    tieTo: null,
    section: "",
    lyric: "",
    chord: ""

  };
  if (initial) {
    Object.assign(n, initial);
  }
  return n;
}
function cloneNotation(notation) {
  const origin = JSON.parse(JSON.stringify(toJS(notation)));
  delete origin.key;
  const n = createNotation(origin);
  return n;
}

// 放置连音线
const placeTie = wrappedAction((notation) => {
  if (state.tieSourceKey) {
    // 处理连音线
    if (state.tieSourceKey === notation.key) {
      state.tieSourceKey = null;
      // NOTICE: 如果要添加其他逻辑注意这里的return
      return;
    }
    const {
      notation: sourceNotation,
      paragraph: sourceParagraph,
    } = findParagraphAndNotation(state.tieSourceKey);
    if (!sourceNotation) {
      state.tieSourceKey = null;
      return;
    }
    if (!sourceParagraph.notations.includes(notation)) {
      message.warn("只允许相同段落的音符相连！");
    } else if (!isNote(notation)) {
      message.warn("只允许在音符上添加连音线！");
    } else {
      sourceNotation.tieTo = notation.key;
      notation.tieTo = sourceNotation.key;
    }
    state.tieSourceKey = null;
  }
});

export {
  notations,
  isNote,
  isPauseNote,
  isSeparator,
  createNotation,
  cloneNotation,
  placeTie,
};
