import { observer } from "mobx-react-lite";
import { useRef } from "react";
import EditableContent from "../../../component/EditableContent";
import store from "../../../store/global";
import { wrappedAction } from "../../../store/history";
import Row from "../../Row";
import Text from "../../Text";
const handleChangeTitle = wrappedAction((value) => {
  store.subtitle = value;
});

function Subtitle() {
  const ref = useRef();
  return (
    <Row type="title" offsetY={store.marginTop + 32}>
      <EditableContent
        ref={ref}
        title="副标题："
        initialValue={store.subtitle}
        onChange={handleChangeTitle}
      >
        <Text
          editable
          x="50%"
          style={{
            fontWeight: 300,
          }}
          fontSize="16"
          fill="currentColor"
          stroke="none"
          textAnchor="middle"
        >
          {store.subtitle}
        </Text>
      </EditableContent>
    </Row>
  );
}

export default observer(Subtitle);
