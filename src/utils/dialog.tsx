import { nextGoodStr } from "./random";
import { I18nString } from "../i18n/core";
import { defer } from "./defer";
import { TippedError } from "./errors";
import { Modal, ModalFuncProps } from "antd";
import { AsyncText } from "./async/components";
import { CSSProperties, isValidElement } from "react";
import { _logger } from "./logger"; 

const logger = _logger(import.meta.url);

export async function showConfirm(
  title: I18nString | Promise<I18nString>,
  content?: I18nString | Promise<I18nString> | JSX.Element,
  opt: ModalFuncProps = {}
): Promise<void> {
  logger.args.info(showConfirm, {title, content, opt});

  const { onOk, ...others } = opt;
  const confirmDefer = defer<void>();

  Modal.confirm({
    autoFocusButton: null,
    title: <AsyncText style={{fontWeight: "normal"}} children={title}/>,
    content: isValidElement(content) 
      ? content 
      : (content === undefined ? undefined : <AsyncText children={content}/>),
    onOk() {
      if (onOk) {
        return onOk(confirmDefer.resolve, confirmDefer.reject);
      }
      return confirmDefer.resolve();
    },
    onCancel() {
      const titleInfos = Promise.all(
        content
          ? [Promise.resolve(title), Promise.resolve(content)] 
          : [Promise.resolve(title)]
      );
      titleInfos.catch(e => {
        logger.error(e); 
        confirmDefer.reject("confirm dialog ? canceled.");
      });
      titleInfos.then(args => 
        confirmDefer.reject(`confirm dialog ${args.join(" ")} canceled.`)
      );
    },
    ...others,
  });
  return confirmDefer.promise;
}

interface ShowWarn {
  (alert: Promise<I18nString> | I18nString): Promise<Error>;

  (alert: Promise<I18nString> | I18nString, message: string, ...args: any[])
    : Promise<Error>;

  (alert: Promise<I18nString> | I18nString, e: Error, ...args: any[])
    : Promise<Error>;

  (alert: Promise<I18nString> | I18nString, e: any, ...args: any[])
    : Promise<Error>;
}

const warnTextStyle: CSSProperties = {
  fontSize: 16,
  lineHeight: "20px",
};
export const showWarn: ShowWarn = async (
  alert: I18nString | Promise<I18nString> | JSX.Element,
  ...logs: any[]
) => {
  const id = nextGoodStr(8, true);
  logger.args.info(showWarn, { alert });

  const dialogDefer = defer<void>();

  const withId = logs.length > 0;
  logger.warn(id, ...logs);
  const alertEl = isValidElement(alert) 
    ? alert 
    : <AsyncText style={warnTextStyle} children={alert}/>;
  Modal.warn({
    content: withId ? (
      <div style={{display: "inline-block"}}>
        {alertEl}
        <br/>
        <span>CODE: {id}</span>
      </div>
    ) : alertEl,
    onOk: () => dialogDefer.resolve(),
    onCancel: () => dialogDefer.resolve(),
  });

  await dialogDefer.promise;
  return TippedError;
}

const successTextStyle: CSSProperties = {
  fontSize: 14,
  lineHeight: "20px",
};
export async function showSuccess(
  message: I18nString | Promise<I18nString>
): Promise<void> {
  logger.args.info(showSuccess, {message});
  const dialogDefer = defer<void>();
  Modal.success({
    content: <AsyncText style={successTextStyle} children={message}/>,
    onOk: () => dialogDefer.resolve(),
    onCancel: () => dialogDefer.resolve(),
  });
  return dialogDefer.promise;
}
