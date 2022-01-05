import { nextId } from "./random";
import { I18nString } from "../i18n/core-type";
import { defer } from "./defer";
import { logger } from "./logger";
import { TippedError } from "./errors";

export function showDialog(message: string): Promise<void> {
    const dialogClosedPromiseDefer = defer<void>();
    // alert(message);
    console.log(message);
    dialogClosedPromiseDefer.resolve();
    return dialogClosedPromiseDefer.promise;
}

export async function showSuccess(message: Promise<I18nString>): Promise<void> {
    return showDialog(await message);
}

interface ShowWarnAndLog {
    (alert: Promise<I18nString> | I18nString, message: string, ...args: any[]): Promise<Error>;
    (alert: Promise<I18nString> | I18nString, e: Error, ...args: any[]): Promise<Error>;
    (alert: Promise<I18nString> | I18nString, e: any, ...args: any[]): Promise<Error>;
}
export const showWarnAndLog: ShowWarnAndLog = async (alert: Promise<I18nString> | I18nString, ...args: any[]): Promise<Error> => {
    const id = nextId();
    logger.warn("[WARN]" + id, args);
    const alertResolved = await alert;
    await showDialog(alertResolved + "id: " + id);
    return TippedError;
}
