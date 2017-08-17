

export default new class VideoService {

	constructor(name='videoservice') {
		this._name = name;
	}

	requestVideo(url, headers={}) {
		const request = new Request(url, {
			headers: new Headers({
				...headers,
				'Content-Type': 'application/json'
			})
		});

		return fetch(request);
	}

	get name() {return this._name}

}