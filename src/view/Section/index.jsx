import { observer } from "mobx-react-lite";
import EditableContent from "../../component/EditableContent";
import state from "../../store/state";
import { wrappedAction } from "../../store/history";
import Text from "../Text";

function Section({ offsetX, notation, editable }) {
  const handleChangeSection = wrappedAction((value) => {
    state.selectedNotationKey = "";
    state.shouldNotationBlurAfterClick = true;
    notation.section = value
  });

  return (
    editable
      ? <EditableContent
        inputType="click"
        initialValue={notation.section}
        onChange={handleChangeSection}
      >
        <Text
          editable
          x={offsetX - (notation.section ? 5 : 8)}
          className={
            [
              'text-xs',
              notation.section
                ? null
                : 'text-transparent hover:text-orange-400'
            ].filter(v => v).join(' ').trim()
          }
        >
          {notation.section ? `[ ${notation.section} ]` : '＋'}
        </Text>
      </EditableContent>
      : <Text x={offsetX - 8} className="text-xs">
        {notation.section ? `[ ${notation.section} ]` : null}
      </Text>
  );
}

Section.defaultProps = {
  offsetX: 0,
  offsetY: 0,
};

export default observer(Section);
