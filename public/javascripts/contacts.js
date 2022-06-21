// class Model {
//   constructor() {
//     this.contacts;
//     this.contact;
//   }

//   async getContacts() {
//     this.contacts = await fetch('http://localhost:3000/api/contacts').then(response => response.json());
//   }

//   async getContact(id) {
//     this.contact = await fetch(`http://localhost:3000/api/contacts/${id}`).then(response => response.json());
//   }

//   async addContact(data) {
//     await fetch('http://localhost:3000/api/contacts', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(data), 
//     });

//     this.displayCurrentContacts(this.contacts);
//   }

//   async editContact(id, data) {
//     await fetch(`http://localhost:3000/api/contacts/${id}`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(data), 
//     });

//     this.displayCurrentContacts(this.contacts);
//   }

//   async deleteContact(id) {
//     await fetch(`http://localhost:3000/api/contacts/${id}`, {
//       method: 'DELETE',
//     });
//     this.displayCurrentContacts(this.contacts);
//   }

//   filterTags(tag) {

//   }

//   bindContactsChanged(callback) {
//     this.displayCurrentContacts = callback;
//   }
// }


// class View {
//   constructor() {
//     // element we're placing everything in
//     this.main = this.getElement('main');

//     // handlebars templates
//     this.noContactsTempl = this.compileTemplate('#noContactsTemplate');
//     this.noMatchTempl = this.compileTemplate('#noMatchTemplate');
//     this.contactFormTempl = this.compileTemplate('#contactFormTemplate');
//     this.contactsList = this.compileTemplate('#contactsList');
//     this.contactDisplayTempl = this.compileTemplate('#contactDisplayTemplate');
//     this.searchTempl = this.compileTemplate('#searchTemplate');
//     this.tagsTempl = this.compileTemplate('#tagsDisplayTemplate');
//     this.registerTemplate('#searchTemplate');
//     this.registerTemplate('#contactDisplayTemplate');
//     this.registerTemplate('#tagsDisplayTemplate');
//     Handlebars.registerHelper('splitTags', function(tags) {
//       let tagsArr = tags ? tags.split(',') : null;
//       return tagsArr;
//     });
//   }

//   createElement(tag, className) {
//     const element = document.createElement(tag);
//     if (className) element.classList.add(className);
//     return element;
//   }

//   getElement(selector) {
//     const element = document.querySelector(selector);
//     return element;
//   }

//   createTag(label) {
//     const div = this.createElement('div');
//     div.className = 'tag';
//     div.dataset.tagValue = label;
//     const span = this.createElement('span');
//     span.innerText = label;
//     const closeBtn = this.createElement('span');
//     closeBtn.className = 'remove-tag';
//     closeBtn.classList.add('material-symbols-outlined');
//     closeBtn.innerText = 'close';

//     div.appendChild(span);
//     div.appendChild(closeBtn);

//     return div;
//   }

//   compileTemplate(tempName) {
//     let templ = this.getElement(tempName);
//     return Handlebars.compile(templ.innerHTML);
//   }

//   registerTemplate(tempName) {
//     let templ = this.getElement(tempName);
//     Handlebars.registerPartial(templ.id, templ.innerHTML);
//   }

//   displayContacts(contacts) {
//     // resets the main tag's inner html before adding the updated contents
//     this.main.innerHTML = '';
//     if (contacts.length < 1) {
//       // displays no contacts and add button
//       this.main.insertAdjacentHTML('beforeend', this.noContactsTempl());
//     } else {
//       // displays each contact
//       this.main.insertAdjacentHTML('beforeend', this.contactsList({contacts}));
//     }
//   }

//   getContactId(element) {
//     let contact = element.closest('.contact-tile');
//     let id = contact ? contact.dataset.contactId : '';
//     return id;
//   }

//   toggleContactForm(handler) {
//     this.main.addEventListener('click', e => {
//       if (e.target.classList.contains('add-edit')) {
//         e.preventDefault();
//         let action = e.target.dataset.action;
//         let contactId = this.getContactId(e.target);
//         this.main.innerHTML = '';
//         this.main.insertAdjacentHTML('beforeend', this.contactFormTempl({action, contactId}));
//         this.tagsFeature();
//       } else if (e.target.classList.contains('cancel')) {
//         handler();
//       }
//     });
//   }

//   tagsFeature() {
//     this.tagContainer = document.querySelector('.tag-container');
//     this.tagInput = document.querySelector('.tag-container input');
//     this.addTag = document.querySelector('.add-tag');
//     this.tagsInputValue = document.querySelector('#tags').value;
//     this.tags = [];
//     this.addContactTags();
//     this.removeContactTags();
//   }

//   addContactTags() {
//     this.addTag.addEventListener('click', (e) => {
//       e.preventDefault();
//       const tagValue = this.tagInput.value.trim().toLowerCase();
//       if (tagValue === '' || this.tags.includes(tagValue)) {
//         this.tagInput.value = '';
//         return;
//       }
//       this.tags.push(tagValue);
//       this.getElement('#tags').value = this.tags.join(',');
//       this.tagContainer.insertBefore(this.createTag(tagValue), this.tagInput);
//       this.tagInput.value = '';
//     });
//   }

//   removeContactTags() {
//     this.tagContainer.addEventListener('click', (e) => {
//       e.preventDefault();
//       if (e.target.classList.contains('remove-tag')) {
//         this.tags = this.tags.filter(tag => tag !== e.target.closest('.tag').dataset.tagValue);
//         this.getElement('#tags').value = this.tags.join(',');
//         this.tagContainer.removeChild(e.target.closest('.tag'));
//       }
//     });
//   }

//   toJson(data) {
//     let json = {};
//     for (let [key, value] of data.entries()) {
//       if (value && value.trim() !== '') {
//         json[key] = value;
//       }
//     }
//     return json;
//   }

//   bindAddContact(handler) {
//     this.main.addEventListener('submit', (e) => {
//       if (e.target.dataset.actionType === 'Create' &&
//           e.submitter.classList.contains('submit')) {
//         e.preventDefault();
//         let form = e.target.closest('form');
//         let data = new FormData(form);
//         let json = this.toJson(data)
//         handler(json);
//       }
//     });
//   }

//   bindEditContact(handler) {
//     this.main.addEventListener('submit', (e) => {
//       if (e.target.dataset.actionType === 'Edit') {
//         e.preventDefault();
//         let form = e.target.closest('form');
//         let data = new FormData(form);
//         let json = this.toJson(data)
//         handler(form.dataset.contactId, json);
//       }
//     });
//   }

//   bindDeleteContact(handler) {
//     this.main.addEventListener('click', e => {
//       if (e.target.classList.contains('delete')) {
//         let remove = confirm('Are you sure you want to delete this contact?');
//         if (remove) {
//           let contactId = this.getContactId(e.target);
//           handler(contactId);
//         }
//       }
//     });
//   }

//   bindFilterTags(handler) {
//    let contactTile = this.getElement('.contact-tile');
//    contactTile.addEventListener('click', e => {
//      if (e.target.tagName === 'A') {
//        let tagValue = e.target.innerText.slice(1)
//        console.log(tagValue)
      
//      }
//    })
//   }
// }

// class Controller {
//   constructor(model, view) {
//     this.model = model;
//     this.view = view;
//     // should display initital contacts
//     this.displayCurrentContacts();

//     this.view.toggleContactForm(this.displayCurrentContacts);

//     this.view.bindAddContact(this.handleAddContact);
//     this.view.bindEditContact(this.handleEditContact);
//     this.view.bindDeleteContact(this.handleDeleteContact);
//     this.view.bindFilterTags(this.handleFilterTags);

//     this.model.bindContactsChanged(this.displayCurrentContacts);
//   }

//   displayCurrentContacts = async () => {
//     await this.model.getContacts();
//     this.view.displayContacts(this.model.contacts);
//   }

//   handleAddContact = data => {
//     this.model.addContact(data);
//   }

//   handleEditContact = (id, data) => {
//     this.model.editContact(id, data);
//   }

//   handleDeleteContact = id => {
//     this.model.deleteContact(id);
//   }

//   handleFilterTags = tag => {
//     this.model.filterTags(tag);
//   }
// }

// const app = new Controller(new Model(), new View());