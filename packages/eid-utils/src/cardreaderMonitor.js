import { Events } from './constants/index';
import { EidCard } from './eidCard';

const eventListeners = {};

export class CardReaderMonitor {
	constructor(cardReader) {
		const cardReaderMonitor = cardReader.getCardReaderMonitor();

		cardReaderMonitor.addEventListener({
			incorrectCardInserted: () => this.trigger(Events.INCORRECT_CARD_INSERTED),
			cardIncorrectInserted: () => this.trigger(Events.CARD_INCORRECT_INSERTED),
			correctCardInserted: (eidCard, data) => this.trigger(Events.CORRECT_CARD_INSERTED, { eidCard: new EidCard(eidCard), data: data }),
			correctCardRemoved: (data) => this.trigger(Events.CORRECT_CARD_REMOVED, { data: data }),
			incorrectInsertedCardRemoved: () => this.trigger(Events.INCORRECT_INSERTED_CARD_REMOVED),
			incorrectCardRemoved: () => this.trigger(Events.INCORRECT_CARD_REMOVED),
			noCardReaderFound: () => this.trigger(Events.NO_CARD_READER_FOUND),
			cardReaderConnected: (name) => this.trigger(Events.CARD_READER_CONNECTED, { name: name }),
			cardReaderDisconnected: (name) => this.trigger(Events.CARD_READER_DISCONNECTED, { name: name })
		});
	}

	on(eventCode, callback) {
		const eventName = eventCode === '*' ? 'all' : eventCode;

		const events = eventListeners[eventName] || [];
		events.push(callback);
		eventListeners[eventName] = events;
	}

	trigger(event, payload = {}) {
		const listeners = eventListeners[event] || [];
		listeners.forEach((eventCallback) => eventCallback(event, payload));

		const allListeners = eventListeners['all'] || [];
		allListeners.forEach((eventCallback) => eventCallback(event, payload));
	}
}
