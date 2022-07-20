/**
 * FadeIn 淡入组件 props.if由false->true时，会先创建一个透明度为0的组件，之后逐渐变为1。
 * FadeOut 淡出组件
 * FadeInOut 淡入且淡出组件
 */
import React, { cloneElement, isValidElement, memo, useEffect, useState } from "react"
import { _logger } from "./logger";

const logger = _logger(import.meta.url);

type Props = React.PropsWithChildren<{ 
  if: boolean;
  in?: boolean;
  out?: boolean;
  duration?: number;
}>;
export function FadeInOut(props: Props): JSX.Element | null {
  const { if: vIf, children } = props;
  const duration = props.duration || 0.3;
  const fadeIn = props.in ?? true;
  const fadeOut = props.out ?? true;
  const [opacity, setOpacity] = useState(vIf ? 1 : 0);
  const [visible, setVisible] = useState(vIf);

  if (vIf) {
    if (visible === false) {
      setVisible(true); 
    }
    if (!fadeIn && opacity === 0) {
      setOpacity(1);
    }
  }

  useEffect(() => {
    if (fadeIn) {
      setOpacity(vIf ? 1 : 0);
    }
    let timer: number;
    if (!vIf) {
      if (fadeOut) {
        timer = window.setTimeout(() => {
          setVisible(false);
        }, duration * 1000);
      } else {
        setVisible(false);
      }
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [vIf, fadeIn, fadeOut, duration]); 

  if (!visible) {
    return null;
  }
  if (!isValidElement(children)) {
    logger.warn(FadeInOut.name, "'s children isn't a valid element.");
    return <>{children}</>;
  }

  const styleOld: React.CSSProperties | undefined = children.props.style;
  const style: React.CSSProperties = {
    ...styleOld,
    opacity,
    transition: (styleOld?.transition || "") + 
      `opacity ${duration}s cubic-bezier(0.645, 0.045, 0.355, 1)`,
  };
  return cloneElement(children, { style });
}

export const FadeIn = memo((props: Omit<Props, "in" | "out">) => 
  FadeInOut({...props, in: true, out: false}));

export const FadeOut = memo((props: Omit<Props, "in" | "out">) => 
  FadeInOut({...props, in: false, out: true}));
