import { Model } from './model.js'; 
import { View } from './view.js'; 

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    // should display initital contacts
    this.displayCurrentContacts();

    this.view.toggleContactForm(this.displayCurrentContacts);

    this.view.bindAddContact(this.handleAddContact);
    this.view.bindEditContact(this.handleEditContact);
    this.view.bindDeleteContact(this.handleDeleteContact);
    this.view.bindFilterTags(this.handleFilterTags);

    this.view.bindSearchFilter(this.handleFilterSearch);

    this.view.bindShowAll(this.displayCurrentContacts);

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
    let filteredTags = this.model.filterTags(tag);
    this.view.displayContacts(filteredTags, null, true);
  }

  handleFilterSearch = input => {
    let filteredSearch = this.model.filterSearch(input);
    this.view.displayContacts(filteredSearch, input, true);
  }
}

const app = new Controller(new Model(), new View());