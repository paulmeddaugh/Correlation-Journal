import Note from '../notes/note.js';
import Graph from '../graph/graph.js';
import { checkIfNoteProps } from '../utility/errorHandling.js';
import Notebook from '../notes/notebook.js';

/* Custom 'info-box-component' element. Displays the user's notes (all or a certain notebook) as well as 
 * provides searching for their titles. */

const infoBoxTemplate = document.createElement('template');
infoBoxTemplate.innerHTML = `
  <div id="infobox">
    <div id="searchBar" class="configs">
      <label for="searchingFor">Search:&nbsp;</label>
      <input type="text" list="noteOptions" id="searchingFor" placeholder="By Title, Content"/>
      <datalist id="noteOptions"></datalist>
      <div id="unpin"><img src="../resources/unpinIcon2.png" alt="unpin"></div>
    </div>
    <div id="showing" class="configs">
      <div class="nbDropdown">
        <select id="notebook" value="All Notebooks">
          <option id="option">All Notebooks</option>
        </select>
        <div id="nbOptions">
        </div>
      </div>
    </div>
    <div class="list-group-flush">
      <div id="noNotes"> No notes found. </div>
    </div>
  </div>
  <div id="pin">
    <span> Notes </span>
    <img src="../resources/unpinIcon.jpg" alt="pin">
  </div>
  <style>

  #infobox {
    border-right: 1px solid grey;
    background: grey;
    opacity: .8;
    width: 300px;
    height: 100%;
    transition: 1s ease;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .configs {
    background: white;
    display: flex;
    align-items: center;
  }

  #searchBar { /* Container for searchingFor */
    border-bottom: 1px solid grey;
    padding: 8px 10px;
    background: lightgrey;
  }

  #searchingFor {
    font-size: 9pt;
    width: 100%;
  }

  #searchingFor:focus-visible {
    
  }

  #unpin {
    padding: 2px;
    margin-left: 6px;
    margin-right: -4px;
    display: inherit;
  }

  #unpin:hover img {
    content:url("../resources/unpinIconHover2.png");
  }

  img {
    max-width: 16px;
    max-height: 16px;
  }

  #pin {
    display: none;
    position: absolute;
    top: 30%;
    left: 0%;
    background: lightgrey;
    transform-origin: bottom left;
    transform: rotate(90deg);
    border: 1px solid grey;
    margin-right: 4px;
    z-index: 3;

    /* Prevents text highlighting */
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Old versions of Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Opera and Firefox */
                outline: none;
    -webkit-tap-highlight-color: rgba(255, 255, 255, 0); /* mobile webkit */
  }

  #pin span {
    margin: 0px 4px;
  }

  #pin:hover {
    background: #c1c1c1;
  }

  #showing { /* The container for notebook */
    border-bottom: 1px solid rgba(0,0,0,.125);
    padding: 9px;
  }

  #notebook {
    border: none;
    width: 100%;
    font-size: 18pt;
    color: grey;
    padding: 6px;
  }

  #notebook:hover {
    background: lightgrey;
  }

  #notebook:focus-visible {
    outline: none;
  }

  .nbDropdown {
    position: relative;
    width: 100%;
  }

  #nbOptions {
    position: absolute;
    top: 100%;
    border: 1px solid;
    background: lightgrey;
    z-index: 3;
    width: 100%;
    display: none;
    box-shadow: 0px 0px 3px black;
  }

  #nbOptions:focus-visible {
    outline: none;
  }

  .nbOption {
    padding: 3px 5px;
    font-size: 16pt;
    display: flex;
    justify-content: space-between;
  }

  .nbOption:hover {
    background: #1E90FF;
    color: white;
  }

  .removeNb {
    background: url('../resources/removeIcon.png');
    background-size: contain;
    width: 15px;
    height: 15px;
    display: inline-block;
    position: absolute;
    right: 0%;
    margin: 8px;
    opacity: 0;
    transition: .5s ease;
  }

  .nbOption:hover .removeNb {
    opacity: 1;
  }

  .removeNb:hover {
    background: url('../resources/removeIconHover.png');
    background-size: contain;
  }

  .list-group-flush {
    overflow-y: auto;
  }

  a {
    cursor: pointer;
  }

  h5 {
    overflow: hidden;
    max-height: 3rem;
  }

  p {
    overflow: hidden;
    max-height: 2.9rem;
  }

  small {
    white-space: nowrap;
  }

  .removeNote {
    position: absolute;
    width: 20px;
    height: 20px;
    background: url('../resources/removeIcon.png');
    background-size: cover;
    left: 89%;
    bottom: 5%;
    opacity: 0;
    display: none;
    transition: .25s ease;
  }

  .removeNoteEntry {
    left: 92%;
    display: block;
    opacity: 1;
  }

  .removeNote:hover {
    background: url('../resources/removeIconHover.png');
    background-size: cover;
  }

  #noNotes {
    width: 100%;
    text-align: center;
    padding: 6px;
    display: none;
  }

  </style>
`;

class InfoBox extends HTMLElement {

  nbOptionsVisible = false;

  constructor() {
    super();
  }

  connectedCallback() {

    const shadowRoot = this.attachShadow({ mode: 'open'});
    shadowRoot.appendChild(infoBoxTemplate.content);

    const infobox = shadowRoot.getElementById('infobox');
    const listGroupFlush = infobox.children[2]; // class 'list-group-flush' using Bootstrap

    const bootstrap = document.querySelector('link[href*="bootstrap"]');
    if (bootstrap) {
      shadowRoot.appendChild(bootstrap.cloneNode());
    }

    ///// Pinning /////
    // (1) Clicking 'Unpin' icon
    shadowRoot.getElementById('unpin').addEventListener("click", () => {
      infobox.style.width = '0px';
      shadowRoot.getElementById('pin').style.display = 'block'; // makes visible

      setTimeout(() => { // Allows transition effect first
        infobox.style.position = 'absolute';
        infobox.style.right = '100%';
      }, 1000);
    });

    // (2) Clicking 'Pin' icon
    shadowRoot.getElementById('pin').addEventListener("click", () => {
      infobox.style.width = '300px';
      infobox.style.position = 'unset';
      shadowRoot.getElementById('pin').style.display = 'none'; // makes invisible
    });

    ///// Custom Notebook Menu /////
    // Creating customized options menu for the notebook selector in #nbOptions
    const nbOptions = shadowRoot.getElementById('nbOptions');
    nbOptions.tabIndex = 20; // makes focusable

    addNotebookToInfoBox(this, { id: '', name: 'All Notebooks'});

    // Visibilty of custom menu
    shadowRoot.getElementById('notebook').addEventListener("mousedown", (e) => {
      e.preventDefault();
      nbOptions.style.display = (['none', ''].includes(nbOptions.style.display)) ? 'block' : 'none';
      nbOptions.focus();
    });
    nbOptions.addEventListener("blur", () => {
      nbOptions.style.display = 'none';
    });

    ///// Searching and Notebook Selector /////
    // Searches for notes when typing in search bar's text within the selected notebook
    shadowRoot.getElementById('searchingFor').addEventListener("keyup", (e) => {

      let anyNotes = false;
      const notesInBox = listGroupFlush.children;
      for (let i = 1; i < notesInBox.length; i++) {

        const selectedNb = shadowRoot.getElementById('notebook');
        const idSelectedNb = selectedNb.options.item(selectedNb.selectedIndex).getAttribute('data-idNotebook');
        const idNotebook = notesInBox[i].getAttribute('data-idNotebook');
        const regex = new RegExp(shadowRoot.getElementById('searchingFor').value, 'i');
        const isMatching = notesInBox[i].children[0].children[0].innerHTML.match(regex) || // title
          notesInBox[i].children[1].innerHTML.match(regex); // text

        if (isMatching && (!idSelectedNb || idSelectedNb == idNotebook)) {
          notesInBox[i].style.display = "block";
          anyNotes = true;
        } else {
          notesInBox[i].style.display = "none";
        }
      }

      shadowRoot.getElementById('noNotes').style.display = (anyNotes) ? 'none' : 'block';
    });

    // Displaying notes of a notebook when selecting a notebook
    const option = shadowRoot.getElementById('option');
    const observer = new MutationObserver((mutations) => {
      if (mutations.find((mutation) => mutation.type == "attributes")) {
        
        const idSelectedNotebook = option.getAttribute('data-idNotebook');
        let anyNotes = false;
        for (let i = 1, notesInBox = listGroupFlush.children; i < notesInBox.length; i++) {
          if ((notesInBox[i].getAttribute('data-idNotebook') == idSelectedNotebook) || (!idSelectedNotebook)) {
            notesInBox[i].style.display = 'block';
            anyNotes = true;
          } else {
            notesInBox[i].style.display = 'none';
          }
        }

        shadowRoot.getElementById('noNotes').style.display = (!anyNotes) ? 'block' : 'none';
      }
    });
    observer.observe(option, { attributes: true });
  }
}

customElements.define('info-box-component', InfoBox);

// --------------------------------------------------------------------------------------------
// Functions for loading notes and notebooks into the info-box-component
// --------------------------------------------------------------------------------------------

let active = null;

export function loadInfoBox(infoBox, notes, notebooks) {
  addNotebooksToInfoBox(infoBox, notebooks);
  addNotesToInfoBox(infoBox, notes);
}

/**
 * Adds the notebooks to the options of the notebook selector.
 * 
 * @param {InfoBox} infoBox The infoBox to add the notebooks to its notebook selector.
 * @param {*} notebooks The array of {@link Notebook} objects to add.
 */
 export function addNotebooksToInfoBox (infoBox, notebooks) {
  for (let notebook of notebooks) {
    addNotebookToInfoBox(infoBox, notebook);
  }
}

/**
 * Adds a notebook to the options of the notebook selector in the info side box.
 * 
 * @param {InfoBox} infoBox The infoBox to add the notebooks to its notebook selector.
 * @param {Notebook} notebook The notebook to add.
 */
export function addNotebookToInfoBox(infoBox, notebook) {

  let div = document.createElement('div');
  div.innerHTML = notebook.name;
  div.setAttribute('data-idNotebook', notebook.id);
  div.classList.add('nbOption');

  div.addEventListener("click", () => { // Selecting a notebook
    infoBox.shadowRoot.getElementById('option').innerHTML = div.innerHTML;
    infoBox.shadowRoot.getElementById('option')
      .setAttribute('data-idNotebook', div.getAttribute('data-idNotebook'));
    infoBox.shadowRoot.getElementById('nbOptions').style.display = 'none';
  });

  let remove = document.createElement('div');
  remove.classList.add('removeNb');
  remove.addEventListener("click", () => { // Removing a notebook

    if (!confirm("Are you sure you want to delete notebook '" + notebook.name + "' and all of its notes?")) {
      return;
    }

    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
          let result = xhr.responseText;
          alert(result);
          console.log(result);
      }
    }

    xhr.open("POST", "../php/removeNotebook.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send('idNotebook=' + notebook.id);
  });

  if (notebook.name != 'All Notebooks') div.appendChild(remove);
  infoBox.shadowRoot.getElementById('nbOptions').appendChild(div);
}

export function addNotesToInfoBox (infoBox, notes) {
  for (let note of notes) {
    addNoteToInfoBox(infoBox, note, false);
  }
}

/**
 * 
 * @param {InfoBox} infoBox 
 * @param {Note} note 
 * @param {boolean} first 
 */
export function addNoteToInfoBox (infoBox, note, first) {
    checkIfNoteProps({ note });

    // Entire note display area
    let a = document.createElement('A');
    a.classList.add('list-group-item', 'list-group-item-action', 'flex-column', 'align-items-start');
    a.setAttribute('data-idNotebook', note.idNotebook); // stores the notebook id in the note container
    if (first) (active = a).classList.add('active');
    
    // Title and date div
    let div = document.createElement('div');
    div.classList.add('d-flex', 'w-30', 'justify-content-between');

    let title = document.createElement('h5');
    title.classList.add('mb-1');
    title.id = 'title';
    title.innerHTML = note.title;

    let date = document.createElement('small');
    date.innerHTML = new Date(note.dateCreated).toLocaleDateString('en-us', { month:"short", day:"numeric"});
    div.appendChild(title);
    div.appendChild(date);

    // note content
    let p = document.createElement('p');
    p.classList.add('mb-1');
    p.innerHTML = note.text;

    // remove note icon
    let removeDiv = document.createElement('div');
    removeDiv.classList.add('removeNote');
    removeDiv.addEventListener("click", () => {

      if (!confirm("Are you sure you want to delete note titled '" + note.title + "'?")) {
        return;
      }
  
      let xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            let result = xhr.responseText;
            alert(result);
            console.log(result);
        }
      }
  
      xhr.open("POST", "../php/removeNote.php", true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.send('idNote=' + note.id);
    });

    a.appendChild(div);
    a.appendChild(p);
    if (note.id != null) a.appendChild(removeDiv);

    a.addEventListener("click", e => {
      if (active) {
        active.classList.remove('active');
        active.children[2]?.classList.remove('removeNoteEntry');
      }
      (active = e.currentTarget).classList.add('active');
      active.children[2]?.classList.add('removeNoteEntry');
    });

    infoBox.shadowRoot.children[0].children[2].appendChild(a);

    // Adds the note as an option in the search bar
    let option = document.createElement('option');
    option.value = option.innerHTML = note.title;
    infoBox.shadowRoot.getElementById('noteOptions').appendChild(option);
}

/**
 * Adds "click" listeners to the displaying note containers in the specified infoBox.
 * 
 * @param {InfoBox} infoBox The infoBox to add listeners to its displayed notes.
 * @param {function} listener A function passed a parameter of the index of the note container from the
 * top to the bottom.
 */
export function addNotesClickListenersToInfoBox(infoBox, listener) {
  const notesInBox = infoBox.shadowRoot.getElementById('infobox').children[2].children;

  for (let i = 1; i < notesInBox.length; i++) {
    notesInBox[i].addEventListener("click", (e) => {
      listener(i - 1);
    });
  }
}

/**
 * Adds a listener for when a value is selected in the notebook dropdown in the specified infoBox.
 * 
 * @param {InfoBox} infoBox The infoBox to add the listener to.
 * @param {function} listener A function passed a parameter of the value that the notebook dropdown 
 * was changed to.
 */
export function selectNotebookListener (infoBox, listener) {
  infoBox.shadowRoot.getElementById('notebook').addEventListener("change", (e) => {
    listener(e.currentTarget.value);
  });
}