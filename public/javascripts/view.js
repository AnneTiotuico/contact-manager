import { debounce } from './debounce.js';

class View {
  constructor() {
    // element we're placing everything in
    this.main = this.getElement('main');

    // handlebars templates
    this.noContactsTempl = this.compileTemplate('#noContactsTemplate');
    this.noMatchTempl = this.compileTemplate('#noMatchTemplate');
    this.contactFormTempl = this.compileTemplate('#contactFormTemplate');
    this.contactsList = this.compileTemplate('#contactsList');
    this.contactDisplayTempl = this.compileTemplate('#contactDisplayTemplate');
    this.searchTempl = this.compileTemplate('#searchTemplate');
    this.tagsTempl = this.compileTemplate('#tagsDisplayTemplate');
    this.formTagsTempl = this.compileTemplate('#formTagsTemplate');
    this.editTagsTempl = this.compileTemplate('#editTagsTemplate');
    this.registerTemplate('#searchTemplate');
    this.registerTemplate('#contactDisplayTemplate');
    this.registerTemplate('#tagsDisplayTemplate');
    this.registerTemplate('#formTagsTemplate');
    this.registerTemplate('#editTagsTemplate');
    Handlebars.registerHelper('splitTags', function(tags) {
      let tagsArr = tags ? tags.split(',') : null;
      return tagsArr;
    });
  }

  createElement(tag, className) {
    const element = document.createElement(tag);
    if (className) element.classList.add(className);
    return element;
  }

  getElement(selector) {
    const element = document.querySelector(selector);
    return element;
  }

  createTag(label) {
    const div = this.createElement('div');
    div.className = 'tag';
    div.dataset.tagValue = label;
    const span = this.createElement('span');
    span.innerText = label;
    const closeBtn = this.createElement('span');
    closeBtn.className = 'remove-tag';
    closeBtn.classList.add('material-symbols-outlined');
    closeBtn.innerText = 'close';

    div.appendChild(span);
    div.appendChild(closeBtn);

    return div;
  }

  compileTemplate(tempName) {
    let templ = this.getElement(tempName);
    return Handlebars.compile(templ.innerHTML);
  }

  registerTemplate(tempName) {
    let templ = this.getElement(tempName);
    Handlebars.registerPartial(templ.id, templ.innerHTML);
  }

  displayContacts(contacts, input, filtered) {
    // resets the main tag's inner html before adding the updated contents
    this.main.innerHTML = '';
    console.log(contacts, input, filtered)
    if (contacts.length < 1 && !input) {
      // displays no contacts and add button
      this.main.insertAdjacentHTML('beforeend', this.noContactsTempl());
    } else if (contacts.length < 1 && input) {
      this.main.insertAdjacentHTML('beforeend', this.noMatchTempl({input, filtered}));
      let searchBox = this.getElement('.search');
      console.log('no contacts')
      searchBox.focus();
      searchBox.value = input;
    } else {
      // displays each contact
      this.main.insertAdjacentHTML('beforeend', this.contactsList({contacts, input, filtered}));
      let searchBox = this.getElement('.search');
      if (input) {
        searchBox.focus();
        searchBox.value = input;
      }
    }
  }

  getContactId(element) {
    let contact = element.closest('.contact-tile');
    let id = contact ? contact.dataset.contactId : '';
    return id;
  }

  toggleContactForm(handler) {
    this.main.addEventListener('click', e => {
      if (e.target.classList.contains('add')) {
        e.preventDefault();
        let action = e.target.dataset.action;
        let contactId = this.getContactId(e.target);
        this.main.innerHTML = '';
        this.main.insertAdjacentHTML('beforeend', this.contactFormTempl({action, contactId}));
        this.tagsFeature();
      } else if (e.target.classList.contains('edit')) {
        e.preventDefault();
        let action = e.target.dataset.action;
        let contactId = this.getContactId(e.target);
        this.main.innerHTML = '';
        let contactTile = e.target.closest('.contact-tile');
        let name = $(contactTile).find('h3')[0].dataset.value;
        let email = $(contactTile).find('.email')[0].dataset.value;
        let phone = $(contactTile).find('.phone')[0].dataset.value;
        let tags = $(contactTile).find('.tags')[0].dataset.value;
        let contact = {name, email, phone, tags}
        this.main.insertAdjacentHTML('beforeend', this.contactFormTempl({action, contactId, contact}));
        this.tagsFeature();
      } else if (e.target.classList.contains('cancel')) {
        handler();
      }
    });
  }

  tagsFeature() {
    this.tagContainer = document.querySelector('.tag-container');
    this.tagInput = document.querySelector('.tag-container input');
    this.addTag = document.querySelector('.add-tag');
    this.tagsInputValue = document.querySelector('#tags').value;
    this.tags = [];
    this.addContactTags();
    this.removeContactTags();
  }

  addContactTags() {
    this.addTag.addEventListener('click', (e) => {
      e.preventDefault();
      const tagValue = this.tagInput.value.trim().toLowerCase();
      let tags = this.getElement('.tag-container').querySelectorAll('.tag');
      tags = [...tags].map(tag => tag.dataset.tagValue)
      this.tags = tags.join(',');
      if (tagValue === '' || tags.includes(tagValue)) {
        this.tagInput.value = '';
        return;
      } else {
        let tempDiv = this.createElement('div');
        tempDiv.insertAdjacentHTML('beforeend', this.formTagsTempl({tagValue}));
        this.tagContainer.insertBefore(tempDiv.lastElementChild, this.tagInput);
        this.tagInput.value = '';
      }
    });
  }

  removeContactTags() {
    this.tagContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('remove-tag')) {
        e.preventDefault();
        this.tags = [...this.tags].filter(tag => tag !== e.target.closest('.tag').dataset.tagValue);
        this.getElement('#tags').value = this.tags.join(',');
        this.tagContainer.removeChild(e.target.closest('.tag'));
      }
    });
  }

  toJson(data) {
    let json = {};
    for (let [key, value] of data.entries()) {
      if (value && value.trim() !== '') {
        json[key] = value;
      }
    }
    return json;
  }

  bindFilterTags(handler) {
    this.main.addEventListener('click', e => {
      if (e.target.tagName === 'A') {
        e.preventDefault();
        let tagValue = e.target.innerText.slice(1);
        handler(tagValue)
      }
    });
  }

  bindAddContact(handler) {
    this.main.addEventListener('submit', (e) => {
      if (e.target.dataset.actionType === 'Create' &&
          e.submitter.classList.contains('submit')) {
        e.preventDefault();
        let form = e.target.closest('form');
        let data = new FormData(form);
        let json = this.toJson(data)
        let tags = this.getElement('.tag-container').querySelectorAll('.tag')
        this.tags = [...tags].map(tag => tag.dataset.tagValue).join(',');
        if (this.tags > 1) json.tags = this.tags;
        handler(json);
      }
    });
  }

  bindEditContact(handler) {
    this.main.addEventListener('submit', (e) => {
      if (e.target.dataset.actionType === 'Edit' &&
          e.submitter.classList.contains('submit')) {
        e.preventDefault();
        let form = e.target.closest('form');
        let data = new FormData(form);
        let json = this.toJson(data)
        let tags = this.getElement('.tag-container').querySelectorAll('.tag');
        this.tags = [...tags].map(tag => tag.dataset.tagValue).join(',');
        let name = this.getElement('#full_name').value;
        let email = this.getElement('#email').value;
        let phone = this.getElement('#phone_number').value;
        json = {full_name: name, email, phone_number: phone, tags: this.tags,};

        handler(form.dataset.contactId, json);
      }
    });
  }

  bindDeleteContact(handler) {
    this.main.addEventListener('click', e => {
      if (e.target.classList.contains('delete')) {
        let remove = confirm('Are you sure you want to delete this contact?');
        if (remove) {
          let contactId = this.getContactId(e.target);
          handler(contactId);
        }
      }
    });
  }

  bindFilterTags(handler) {
    this.main.addEventListener('click', e => {
      if (e.target.tagName === 'A') {
        e.preventDefault();
        let tagValue = e.target.innerText.slice(1);
        handler(tagValue)
      }
    });
  }

  bindSearchFilter(handler) {
    this.main.addEventListener('input', e => {
      if (e.target.className === 'search') {
        let input = e.target.value.toLowerCase();
        debounce(handler(input), 300);
      }
    });
  }

  bindShowAll(handler) {
    this.main.addEventListener('click', e => {
      if (e.target.classList.contains('show-all')) {
        e.preventDefault();
        handler();
      }
    });
  }
}

export { View };