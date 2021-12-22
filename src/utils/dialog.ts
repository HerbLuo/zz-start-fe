import { nextId } from "./random";
import { I18nString } from "../i18n/i18n.core.type";
import { defer } from "./defer";
import { logger } from "./logger";
import {TippedError} from "./errors";

export function showDialog(message: string): Promise<void> {
    const dialogClosedPromiseDefer = defer<void>();
    alert(message);
    dialogClosedPromiseDefer.resolve();
    return dialogClosedPromiseDefer.promise;
}

export function showSuccess(message: I18nString): Promise<void> {
    return  showDialog(message);
}

interface ShowWarnAndLog {
    (alert: I18nString, message: string, ...args: any[]): Promise<Error>;
    (alert: I18nString, e: Error, ...args: any[]): Promise<Error>;
    (alert: I18nString, e: any, ...args: any[]): Promise<Error>;
}
export const showWarnAndLog: ShowWarnAndLog = async (alert: I18nString, ...args: any[]): Promise<Error> => {
    const id = nextId();
    console.log(id);
    logger.warn("[WARN]")
    await showDialog(alert + "id: " + id);
    return TippedError;
}
