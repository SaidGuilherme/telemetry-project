export const MESSAGING_EVENT_BUS = 'MESSAGING_EVENT_BUS';

export interface MessagingEventBusPort {
    publish(eventTopic: string, eventPayload: any): Promise<void>;
}