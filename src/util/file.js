import { message } from "antd";
import { toJS } from "mobx";
import store from "../store/global";
import domtoimage from "./dom-to-image";
import { VERSION } from "./version";
import { resetGlobalData } from "./editor";

function read(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(file, "utf8");
    reader.onloadend = () => {
      resolve(JSON.parse(reader.result));
    };
  });
}

async function loadFile(file) {
  const data = await read(file);
  if (!(data.version <= VERSION)) {
    message.error("不支持的文件格式，请使用最新版本");
    return;
  }
  resetGlobalData(data);
}

async function saveFile() {
  const content = JSON.stringify(toJS(store), null, 2);
  const filename = (store.title || "未标题") + ".json";

  // Check for File System Access API support
  if (window.showSaveFilePicker) {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: filename,
        types: [
          {
            description: 'JSON File',
            accept: { 'application/json': ['.json'] },
          },
        ],
      });
      const writable = await handle.createWritable();
      await writable.write(content);
      await writable.close();
      return;
    } catch (err) {
      if (err.name === 'AbortError') {
        // User canceled Save As dialog — do nothing
        return;
      }
      // Only fallback if error is not user cancellation
      console.warn("File System API failed, falling back:", err);
    }
  }

  // Fallback download
  const blob = new Blob([content], { type: "application/json" });
  const downloadLink = document.createElement("a");
  downloadLink.download = filename;
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.click();
  URL.revokeObjectURL(downloadLink.href);
}

function exportFile() {
  domtoimage
    .toPng(document.querySelector("#temp_svg"), { bgcolor: "white" })
    .then((dataUrl) => {
      const downloadLink = document.createElement("a");
      downloadLink.download = (store.title || "未标题") + ".png";
      downloadLink.href = dataUrl;
      downloadLink.click();
    });
}

export { saveFile, loadFile, exportFile };
