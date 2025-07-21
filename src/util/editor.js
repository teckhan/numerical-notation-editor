import { remove, transaction } from "mobx";
import state from "../store/state";
import store from "../store/global";
import { clearHistory, unwrappedAction } from "../store/history";
import { createParagraphWithNotations } from "../util/paragraph";
import { VERSION } from "./version";

const initialData = {
  version: VERSION,
  canvasWidth: 896,
  canvasHeight: 1024,
  defaultFontSize: 16,
  defaultSubFontSize: 12,
  title: "无标题",
  subtitle: "无副标题",
  tone: "C",
  marginHorizontal: 64,
  marginTop: 32,
  gapAfterTitle: 16,
  gapAfterHeader: 32,
  gapBetweenParagraph: 32,
  gapBetweenNotation: 16,
  beat: [4, 4],
  speed: 75,
  authors: ["佚名  作词", "简谱编辑器  制谱"],
  notations: [],
};

function getDefaultGlobalData() {
  return JSON.parse(JSON.stringify(initialData));
}
function getDefaultGlobalDataWidthNotations() {
  const d = getDefaultGlobalData();
  d.paragraphs = [createParagraphWithNotations()];
  return d;
}

// 根据key查找符号在全局记录中的位置
function findParagraphAndNotation(key) {
  let res = {};
  const paras = store.paragraphs || [];
  paras.some((p, i) => {
    const notationIndex = (p.notations || []).findIndex((n) => n.key === key);
    if (notationIndex !== -1) {
      res.notation = p.notations[notationIndex];
      res.notationIndex = notationIndex;
      res.paragraph = p;
      res.paragraphIndex = i;
      return true;
    }
    return false;
  });
  return res;
}

const resetGlobalData = unwrappedAction((globalData) => {
  if (!globalData) {
    globalData = getDefaultGlobalDataWidthNotations();
  }
  state.lastSelectedNotationKey = state.selectedNotationKey = state.tieSourceKey = null;
  clearHistory();
  transaction(() => {
    for (const key of Object.keys(store)) {
      remove(store, key);
    }
    Object.assign(store, globalData);
  });
});

export {
  getDefaultGlobalData,
  findParagraphAndNotation,
  getDefaultGlobalDataWidthNotations,
  resetGlobalData,
};
