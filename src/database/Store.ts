import { readFileSync, writeFileSync } from "node:fs";

export class Store<Schema> {
	private _data!: Schema;
	private _path: string;

	public constructor(data: Schema | undefined, path: string) {
		this._path = path;

		if (data) this._data = data;
		else this.read();
	}

	public get() {
		return this._data;
	}

	/**
	 * Update the storage with the provided data
	 * @param data The data to update the storage with
	 */
	public update(data: Schema) {
		this._data = data;
		this.save();
	}

	/**
	 * Save the data to the storage file
	 */
	public save() {
		writeFileSync(this._path, JSON.stringify(this._data, null, 2));
	}

	/**
	 * Read the data from the storage file
	 */
	public read() {
		const data = readFileSync(this._path, "utf-8");
		this._data = JSON.parse(data, this.parse.bind(this)) as Schema;
	}

	/**
	 * Parse the data
	 * @param key The field key
	 * @param value The value to parse
	 * @returns parsed value
	 */
	protected parse(key: string, value: unknown) {
		if (key.toLowerCase().includes("date")) return new Date(value as string);
		return value;
	}
}
