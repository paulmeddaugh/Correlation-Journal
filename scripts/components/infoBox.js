import Note from '../notes/note.js';
import Graph from '../graph/graph.js';
import { checkIfNoteProps } from '../utility/errorHandling.js';

/* Custom 'info-box-component' element. Displays the user's notes (all or a certain notebook) as well as 
 * provides searching for their titles. */

const infoBoxTemplate = document.createElement('template');
infoBoxTemplate.innerHTML = `
  <div id="infobox">
    <div class="list-group-flush">
      <div id="searchBar" class="configs">
        <label for="searchingFor">Search:&nbsp;</label> 
        <input type="text" id="searchingFor" />
        <div id="unpin"><img src="../resources/unpinIcon2.png" alt="unpin"></div>
      </div>
      <div id="showing" class="configs">
        <select id="notebook" value="All Notebooks">
        <option value="All Notebooks">All Notebooks</option>
        </select>
      </div>
    </div>
  </div>
  <div id="pin">
    <span> Notes </span>
    <img src="../resources/unpinIcon.jpg" alt="pin">
  </div>
  <style>

  :host {
    
  }

  #infobox {
    border-right: 1px solid grey;
    background: grey;
    opacity: .8;
    overflow-y: auto;
    width: 300px;
    height: 100%;
    transition: 1s ease;
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
    top: 40%;
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

  h5 {
    text-overflow: ellipsis;
  }

  p {
    text-overflow: ellipsis;
  }

  small {
    white-space: nowrap;
  }

  </style>
`;

class InfoBox extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {

    const shadowRoot = this.attachShadow({ mode: 'open'});
    shadowRoot.appendChild(infoBoxTemplate.content);

    const infobox = shadowRoot.getElementById('infobox');

    const bootstrap = document.querySelector('link[href*="bootstrap"]');
    if (bootstrap) {
      shadowRoot.appendChild(bootstrap.cloneNode());
    }

    // Clicking 'Unpin' icon
    shadowRoot.getElementById('unpin').addEventListener("click", () => {
      infobox.style.width = '0px'; // smooth effect with transition
      shadowRoot.getElementById('pin').style.display = 'block'; // makes visible

      setTimeout(() => { // Allows transition effect
        infobox.style.position = 'absolute';
        infobox.style.right = '100%';
      }, 1000);
    });

    // Clicking 'Pin' icon
    shadowRoot.getElementById('pin').addEventListener("click", () => {
      infobox.style.width = '300px'; // smooth effect with transition
      infobox.style.position = 'unset';
      shadowRoot.getElementById('pin').style.display = 'none'; // makes invisible
    });

    this.makeVisibleOrInvisible('searchBar', this.getAttribute('searchBar'));
    this.makeVisibleOrInvisible('showing', this.getAttribute('showing'));
  }

  /**
   * Changing the 'balance' attribute can change the balance displayed in the InfoBox after loading.
   */
   attributeChangedCallback(name, oldValue, newValue) {
    this.makeVisibleOrInvisible(name, newValue);
  }

  makeVisibleOrInvisible(elementId, val) {

    if (elementId != 'searchBar' || elementId != 'showing') return;

    if (!!val) {
      this.getElementById(elementId).style.display = 'inline-block';
      this.getElementById(elementId).innerHTML = val;
    } else {
      this.getElementById(elementId).style.display = 'none';
      this.getElementById(elementId).innerHTML = '';
    }
  }
}

customElements.define('info-box-component', InfoBox);

/* ------------
 * Functions for loading the notes into the infoBox
 * ------------ */

let active = null;

export function addNotesToInfoBox (infoBox, notes) {
  for (let note of notes) {
    addNoteToInfoBox(infoBox, note, false);
  }
}

export function addNoteToInfoBox (infoBox, note, first) {
    checkIfNoteProps({ note });

    // Entire note display area
    let a = document.createElement('A');
    a.href = '#';
    a.classList.add('list-group-item', 'list-group-item-action', 'flex-column', 'align-items-start');
    if (first) (active = a).classList.add('active');
    
    // Title and date div
    let div = document.createElement('div');
    div.classList.add('d-flex', 'w-30', 'justify-content-between');

    let title = document.createElement('h5');
    title.classList.add('mb-1');
    title.innerHTML = note.title;

    let date = document.createElement('small');
    // date.innerHTML = new Date(note.date.replace(/[\\n]/, ''))
    //   
    date.innerHTML = new Date(note.dateCreated).toLocaleDateString('en-us', { month:"short", day:"numeric"});
    div.appendChild(title);
    div.appendChild(date);

    // note content
    let p = document.createElement('p');
    p.classList.add('mb-1');
    p.innerHTML = note.text;

    a.appendChild(div);
    a.appendChild(p);

    a.addEventListener("click", e => {
      if (active) active.classList.remove('active');
      (active = e.currentTarget).classList.add('active');
    });

    console.log(infoBox.shadowRoot.children[1].children[0]);
    infoBox.shadowRoot.children[0].children[0].appendChild(a);
}

/**
 * Adds the notebooks to the options of the notebook selector
 * 
 * @param {*} infoBox The infoBox to add the notebooks to its notebook selector.
 * @param {*} notebooks The notebooks to add.
 */
export function addNotebooksToInfoBox (infoBox, notebooks) {
  for (let notebook of notebooks) {
    let option = document.createElement('option');
    option.value = option.innerHTML = notebook.name;
    infoBox.shadowRoot.getElementById('notebook').appendChild(option);
  }
}