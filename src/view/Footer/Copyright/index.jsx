import { observer } from "mobx-react-lite";
import { useRef } from "react";
import EditableContent from "../../../component/EditableContent";
import store from "../../../store/global";
import { wrappedAction } from "../../../store/history";
import Row from "../../Row";
import Text from "../../Text";
const handleChangeCopyright = wrappedAction((value) => {
  store.copyright = value;
});

function Copyright() {
  const ref = useRef();
  return (
    <Row type="title" offsetY={store.canvasHeight - store.marginTop - store.defaultSubFontSize}>
      <EditableContent
        ref={ref}
        title="版权："
        initialValue={store.copyright}
        onChange={handleChangeCopyright}
      >
        <Text
          editable
          x="50%"
          style={{
            fontWeight: 'light',
          }}
          fontSize={store.defaultSubFontSize}
          fill="currentColor"
          stroke="none"
          textAnchor="middle"
        >
          {store.copyright}
        </Text>
      </EditableContent>
    </Row>
  );
}

export default observer(Copyright);
