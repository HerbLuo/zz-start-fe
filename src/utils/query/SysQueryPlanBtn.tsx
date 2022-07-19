import CloseCircleTwoTone from "@ant-design/icons/CloseCircleTwoTone";
import { Button } from "antd";
import { useCallback, useRef, useState } from "react";
import { AutoWidthInput } from "../input-suit/input-suit-auto-width";
import { withIndicateValue } from "../input-suit/input-suit-with-indicate";
import { FadeIn } from "../transition";
import { styles } from "./SysQuery.style";

interface PlanBtnProps {
  text: string;
  active: boolean;
  changed: boolean;
  editing: boolean;
  editable: boolean;
  onClick?: React.MouseEventHandler<HTMLElement>;
  onRename?: (newName: string) => void;
  onDelete?: React.MouseEventHandler<HTMLElement>;
}

const WAutoWidthInput = withIndicateValue(AutoWidthInput);

export function SysQueryPlanBtn(props: PlanBtnProps) {
  const { active, editing, editable, onClick: propOnClick, onRename } = props;
  const btnRef = useRef<HTMLElement>(null);
  const [renaming, setRenaming] = useState(false);
  const [hover, setHover] = useState(false);
  const onMouseEnter = useCallback(() => {
    setHover(true);
  }, []);
  const onMouseLeave = useCallback(() => {
    setHover(false);
  }, []);

  const onClick: React.MouseEventHandler<HTMLElement> = useCallback((e) => {
    if (editing) {
      setRenaming(true);
    } else {
      propOnClick?.(e);
    }
  }, [editing, propOnClick]);

  const onBlur = useCallback((e: unknown, text: string) => {
    onRename?.(text);
  }, [onRename]);

  return (
    <div style={styles.planButtonBox}>
      <Button
        ref={btnRef}
        type={active ? "primary" : "default"}
        style={styles.planButton(active, editing, editable)}
        onClick={onClick}
      >
        {renaming 
          ? (
            <WAutoWidthInput
              autoFocus
              style={styles.planButtonText(active)}
              gap={false}
              defaultWidth={
                (btnRef.current?.firstChild as any)
                  ?.getBoundingClientRect?.().width
              }
              indicateValue={props.text}
              onBlur={onBlur}
            />
          )
          : props.text
        }
      </Button>
      {props.changed ? <div style={styles.point}/> : null}
      <FadeIn if={editing && editable}>
        <CloseCircleTwoTone
          twoToneColor={hover ? "#FF5500" : "#FFA500"}
          style={styles.deleteIcon} 
          onClick={props.onDelete} 
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        />
      </FadeIn>
    </div> 
  );
}

