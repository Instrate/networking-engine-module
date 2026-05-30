import CoreHandlersBuilder from "@core/handlers/handler";
import config from "@config";

export type TMessageOptions = {
    message: string;
    context: string;
};

type TMessagesAttachTemplate = (_: TMessageOptions) => string;

export default class MessageHandlerBuilder<
    TMessages extends string
> extends CoreHandlersBuilder<
    TMessages,
    TMessageOptions,
    TMessagesAttachTemplate,
    string
> {
    private static defaultOptions: TMessageOptions = {
        context: "unspecified",
        message: "Message: [$context]"
    };

    private static defaultMessageName = config.localization.messages.toString();

    protected handle(
        messageName?: TMessages,
        messageOptions?: Partial<TMessageOptions>
    ): string {
        const verifiedMessageName =
            messageName ||
            (MessageHandlerBuilder.defaultMessageName as TMessages);

        let message = "";

        message =
            this.prepared.get(verifiedMessageName)?.(messageOptions) ||
            Object.entries(messageOptions || {}).reduce(
                (acc, [key, value]) =>
                    acc.replaceAll(`$${key}`, value.toString()),
                MessageHandlerBuilder.defaultOptions.message
            );

        return message;
    }
}
