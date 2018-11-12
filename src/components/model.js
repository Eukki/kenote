const notes = localStorage.notes ? JSON.parse(localStorage.notes) : [];

function generateID() {
	return Math.random().toString(36).substr(2, 9);
}

class Note {
	constructor(notes) {
		this.notes = notes;
	}
	
	getNotes() {
		return this.notes;
	}

	addNote(title = 'Новая заметка', text = null, tag = null) {
		let note = {
			title: title,
			text: text,
			tag: tag,
			id: generateID()
		}

		this.notes.push(note);
		localStorage.setItem('notes', JSON.stringify(this.notes));

		console.log('Заметка создана');
	}

	getNote(title = null, tag = null) {
		let note = [];
		
		this.notes.forEach(elem => {
			if (title) {
				if (elem.title === title) notes.push(elem);
			}

			if (tag) {
				if (elem.tag === tag) notes.push(elem);
			}
		});

		return note;
	}
	// запускать функцию только после нажатия кнопки "сохранить"
	changeNote(id, title = null, text = null, tag = null) {
		this.notes.forEach(elem => {
			if (elem.id === id) {
				if (title) elem.title = title;
				if (text) elem.text = text;
				if (tag) elem.tag = tag;
			}
		});

		localStorage.setItem('notes', JSON.stringify(this.notes));

		console.log('Заметка изменена');
	}

	deleteNote(id) {
		let title;
		
		this.notes.forEach((elem, i) => {
			if (elem.id === id) {
				title = elem.title;
				this.notes.splice(i, i+1)
			}
		});

		localStorage.setItem('notes', JSON.stringify(this.notes));

		console.log('Заметка "${title}" удалена');
	}
}