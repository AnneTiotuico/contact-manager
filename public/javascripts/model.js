class Model {
  constructor() {
    this.contacts;
    this.contact;
  }

  async getContacts() {
    this.contacts = await fetch('http://localhost:3000/api/contacts').then(response => response.json());
  }

  async getContact(id) {
    this.contact = await fetch(`http://localhost:3000/api/contacts/${id}`).then(response => response.json());
  }

  async addContact(data) {
    await fetch('http://localhost:3000/api/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data), 
    });

    this.displayCurrentContacts(this.contacts);
  }

  async editContact(id, data) {
    await fetch(`http://localhost:3000/api/contacts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data), 
    });

    this.displayCurrentContacts(this.contacts);
  }

  async deleteContact(id) {
    const response = await fetch(`http://localhost:3000/api/contacts/${id}`, {
      method: 'DELETE',
    });
    // so fetch doesn't give 'fetch failed loading error'
    await response.text();
    this.displayCurrentContacts(this.contacts);
  }

  filterTags(tag) {
    return this.contacts.filter(({tags}) => {
      return tags && tags.split(',').includes(tag);
    });
  }

  filterSearch(input) {
    return this.contacts.filter(({full_name}) => {
      full_name = full_name.toLowerCase();
      return full_name.startsWith(input.toLowerCase());
    });
  }

  bindContactsChanged(callback) {
    this.displayCurrentContacts = callback;
  }
}

export { Model };