import { observer } from "mobx-react-lite";
import EditableContent from "../../component/EditableContent";
import state from "../../store/state";
import { wrappedAction } from "../../store/history";
import Text from "../Text";

function Chord({ offsetX, notation }) {

  const handleChangeChord = wrappedAction((value) => {
    state.selectedNotationKey = "";
    state.shouldNotationBlurAfterClick = true;
    notation.chord = value
  });

  return (
    <>
      <EditableContent
        inputType="click"
        initialValue={notation.chord}
        onChange={handleChangeChord}
      >
        <Text
          editable
          x={offsetX - 5}
          y={0}
          className={
            notation.chord
              ? null
              : 'text-transparent hover:text-orange-400'
          }
        >
          {notation.chord || '＋'}
        </Text>
      </EditableContent>
    </>
  );
}

Chord.defaultProps = {
  offsetX: 0,
  offsetY: 0,
};

export default observer(Chord);
