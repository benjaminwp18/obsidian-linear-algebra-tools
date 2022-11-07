const LOG_PREFIX: string = 'Linear Algebra Tools: ';

export default class Logger {
	private static processMessage(msg: string): string {
		return LOG_PREFIX + msg;
	}

	static debug(msg: string): void {
		console.debug(this.processMessage(msg));
	}

	static log(msg: string): void {
		console.log(this.processMessage(msg));
	}

	static warn(msg: string): void {
		console.warn(this.processMessage(msg));
	}

	static error(msg: string): void {
		console.error(this.processMessage(msg));
	}
}
