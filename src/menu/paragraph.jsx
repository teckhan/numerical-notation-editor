import { DeleteOutlined, EnterOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import store from "../store/global";
import { createNotation, notations } from "../util/notation";
import { createParagraph } from "../util/paragraph";
import { wrappedAction } from "../store/history";

function getParagraphMenuOptions(paragraph) {
  const handleMenu = wrappedAction(({ key }) => {
    switch (key) {
      case "add": {
        const idx = store.paragraphs.findIndex((p) => p.key === paragraph.key);
        const para = createParagraph({
          notations: [
            createNotation({ note: "0" }),
            createNotation({ note: "0" }),
            createNotation({ note: "0" }),
            createNotation({ note: "0" }),
            createNotation({ note: notations.separator }),
          ],
        });
        if (idx !== -1) {
          store.paragraphs.splice(idx + 1, 0, para);
        } else {
          store.paragraphs.push(para);
        }
        break;
      }
      case "delete":
        const idx = store.paragraphs.findIndex((p) => p.key === paragraph.key);
        if (idx !== -1) {
          store.paragraphs.splice(idx, 1);
        }
        break;
      default:
        break;
    }
  });

  const items = [
    {
      key: "add",
      icon: <EnterOutlined />,
      label: "添加段落",
      onClick: handleMenu,
    },
    {
      key: "delete",
      icon: <DeleteOutlined />,
      label: "删除段落",
      danger: true,
      onClick: handleMenu,
    },
  ];

  return <Menu items={items} />;
}

export { getParagraphMenuOptions };
