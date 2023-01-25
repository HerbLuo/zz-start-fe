import { I18nString } from "../i18n/core";
import { defer } from "./defer";
import { TippedError } from "./errors";
import { Modal, ModalFuncProps, message } from "antd";
import { AsyncText } from "./async/components";
import { CSSProperties, isValidElement } from "react";
import { _logger } from "./logger"; 
import { PromiseOr } from "./ts";

interface Confirm {
  (
    title: PromiseOr<I18nString>, 
    content?: PromiseOr<I18nString> | JSX.Element, 
    opt?: ModalFuncProps,
  ): Promise<void>;
}

interface Warn {
  (alert: PromiseOr<I18nString>): Promise<Error>;
  (alert: PromiseOr<I18nString>, msg: string, ...args: any[]): Promise<Error>;
  (alert: PromiseOr<I18nString>, e: Error, ...args: any[]): Promise<Error>;
  (alert: PromiseOr<I18nString>, e: any, ...args: any[]): Promise<Error>;
}

interface Success {
  (message: PromiseOr<I18nString>): Promise<void>;
}

const logger = _logger(import.meta.url);

export const confirm: Confirm = async function(title, content, opt = {}) {
  logger.args.info(confirm, { title, content, opt });

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

const warn = (dialog: boolean): Warn => async(alert, ...logs: any[]) => {
  const displayLogId = logs.length > 0;
  const argsLogger = (displayLogId ? logger.genId : logger).args;
  const id = argsLogger.info(warn, { alert, logs });

  const alertEl = isValidElement(alert) 
    ? alert 
    : <AsyncText style={{fontSize: 16, lineHeight: "20px"}} children={alert}/>;
  const content = displayLogId && id ? (
    <div style={{display: "inline-block", verticalAlign: "middle"}}>
      {alertEl}
      <br/>
      <span>CODE: {id}</span>
    </div>
  ) : alertEl;

  const dialogDefer = defer<void>();
  if (dialog) {
    Modal.warn({
      content,
      onOk: () => dialogDefer.resolve(),
      onCancel: () => dialogDefer.resolve(),
    });
  } else {
    message.warning(content);
    dialogDefer.resolve();
  }
  
  await dialogDefer.promise;
  return TippedError;
}

export const warnDialog = warn(true);
export const warnMessage = warn(false);

const successTextStyle: CSSProperties = {
  fontSize: 14,
  lineHeight: "20px",
};
export const success = (dialog: boolean): Success => async (msg) => {
  logger.args.info(successDialog, { msg });
  const dialogDefer = defer<void>();
  const content = <AsyncText style={successTextStyle} children={msg}/>;
  if (dialog) {
    Modal.success({
      content,
      onOk: () => dialogDefer.resolve(),
      onCancel: () => dialogDefer.resolve(),
    });
  } else {
    message.success(content);
    dialogDefer.resolve();
  }
  return dialogDefer.promise;
}

export const successDialog = success(true);
export const successMessage = success(false);
