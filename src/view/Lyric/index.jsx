import { observer } from "mobx-react-lite";
import EditableContent from "../../component/EditableContent";
import state from "../../store/state";
import { wrappedAction } from "../../store/history";
import Text from "../Text";

function Lyric({ offsetX, notation }) {
  const handleChangeLyric = wrappedAction((value) => {
    state.selectedNotationKey = "";
    state.shouldNotationBlurAfterClick = true;
    notation.lyric = value
  });

  return (
    <EditableContent
      inputType="click"
      initialValue={notation.lyric}
      onChange={handleChangeLyric}
    >
      <Text
        editable
        x={offsetX - 8}
        dominantBaseline="hanging"
        className={
          notation.lyric
            ? 'font-semibold'
            : 'font-semibold text-transparent hover:text-orange-400'
        }
      >
        {notation.lyric || '＋'}
      </Text>
    </EditableContent>
  );
}

Lyric.defaultProps = {
  offsetX: 0,
  offsetY: 0,
};

export default observer(Lyric);
