import { Model } from './model.js'; 
import { View } from './view.js'; 

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    // should display initital contacts
    this.displayCurrentContacts();

    this.view.toggleContactForm(this.displayCurrentContacts);
    this.view.bindShowAll(this.displayCurrentContacts);
    this.view.bindAddContact(this.handleAddContact);
    this.view.bindEditContact(this.handleEditContact);
    this.view.bindDeleteContact(this.handleDeleteContact);
    this.view.bindFilterTags(this.handleFilterTags);

    this.model.bindContactsChanged(this.displayCurrentContacts);
  }

  displayCurrentContacts = async () => {
    await this.model.getContacts();
    this.view.displayContacts(this.model.contacts);
  }

  handleAddContact = data => {
    this.model.addContact(data);
  }

  handleEditContact = (id, data) => {
    this.model.editContact(id, data);
  }

  handleDeleteContact = id => {
    this.model.deleteContact(id);
  }

  handleFilterTags = tag => {
    let filteredTags = this.model.contacts.filter(({tags}) => {
      return tags && tags.split(',').includes(tag);
    });
    this.view.displayContacts(filteredTags, true);
  }
}

const app = new Controller(new Model(), new View());