class Header extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <style>
        .infoBox {
            border-right: 1px solid grey;
            height: 100%;
            background: grey;
            opacity: .8;
        }

        @font-face {
          font-family: "Big-Mister-C";
          src: url("../resources/fallind.ttf") format("truetype");
        }

        .customFont {
          font-family: "Big-Mister-C", Verdana, Tahoma;
        }
      </style>
      <div id="header">
        <nav class="navbar navbar-expand-lg navbar-light headerColor">
            <div class="container-fluid flex-column flex-md-row bd-navbar">
            <a class="navbar-brand" href="#"> <span class="whiteText"> Correlate Journal </span></a>
                <div class="navbar-nav-scroll">
                <div >
                    <button class="btn btn-outline-light me-2" type="button" id="addNote"> Add Note </button>
                    <button class="btn btn-outline-light me-2" type="button" id="journalWall"> Journal Wall </button>
                </div>
                </div>
                <ul class="navbar-nav flex-row ml-md-auto d-md-flex">
                <li><a href="../pages/account.html">Account: -</a></li>
                </ul>
            </div>
        </nav>
      </div>
    `;

    this.getElementsByTagName('li')[0].children[0].innerHTML = "Account: " + 
      sessionStorage.getItem('username');
  }
}

customElements.define('header-component', Header);

window.addEventListener("load", () => {
    document.getElementById('addNote').addEventListener("click", () => {
        window.location.href = '../pages/addNote.html';
    });
    document.getElementById('journalWall').addEventListener("click", () => {
        window.location.href = '../pages/home.html';
    });
});