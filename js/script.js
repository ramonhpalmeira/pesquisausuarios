let tabUsuarios = document.querySelector('#dados-usuarios');
let cabecalhoUsuarios = document.querySelector('#cabecalho-usuarios');
let tabEstatisticas = document.querySelector('#dados-estatistica');

let todosUsuarios = [];
let usuariosFiltrados = [];
let estatisticas = {
  Homem: 0,
  Mulher: 0,
  SomaIdades: 0,
  MediaIdades: 0.0,
};

let btBuscaUsuarios = document.querySelector('#inputUsuario');
let botao = document.getElementById('botao');
let formatacaoNumero = Intl.NumberFormat('pr-BR');

window.addEventListener('load', () => {
  btBuscaUsuarios.addEventListener('keyup', inputBuscar);
  botao.addEventListener('click', filtroUsuarios);
  fetchUsuarios();
});

const inputBuscar = (e) => {
  if (btBuscaUsuarios.value.length) {
    botao.disabled = false;
  } else {
    botao.disabled = true;
  }

  btBuscaUsuarios.value.length
    ? (botao.disabled = false)
    : (botao.disabled = true);
  if (e.key === 'Enter' && btBuscaUsuarios.value.length) {
    filtroUsuarios();
  } else {
  }
};

async function fetchUsuarios() {
  const res = await fetch(
    'https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo'
  );
  const json = await res.json();
  todosUsuarios = json.results.map((usuario) => {
    return {
      nome: usuario.name.first + ' ' + usuario.name.last,
      imagem: usuario.picture.thumbnail,
      idade: usuario.dob.age,
      genero: usuario.gender,
    };
  });
}

const filtroUsuarios = () => {
  usuariosFiltrados = todosUsuarios.filter(
    (usuario) =>
      usuario.nome.toLowerCase().search(btBuscaUsuarios.value.toLowerCase()) !==
      -1
  );
  usuariosFiltrados.sort((a, b) => a.nome.localeCompare(b.nome));

  render();
};

function render() {
  renderEstatisticas();
  renderUsuarios();
}

function renderUsuarios() {
  let usuariosHTML = `<div>`;
  if (usuariosFiltrados.length) {
    usuariosFiltrados.forEach((usuario) => {
      const { nome, imagem, idade } = usuario;

      const usuarioHTML = `      
      <div class='usuario'>      
        <div>
        <img src="${imagem}" alt="imagem">
        </div>
        <div>
        <a>${nome} </a>
        </div>
        <div>
        <a>, ${idade} anos</a>
        </div>
      </div>  
    `;
      usuariosHTML += usuarioHTML;
    });
  } else {
    const usuarioHTML = `
    <div class="usuario">
      <h5>Nenhum usuário encontrado</h5>
    </div>`;

    usuariosHTML += usuarioHTML;
  }

  tabUsuarios.innerHTML = usuariosHTML;
  cabecalhoUsuarios.innerHTML = `<div class='cabecalho-usuarios'>${usuariosFiltrados.length} usuário(s) encontrado(s)`;
}

const renderEstatisticas = () => {
  tabEstatisticas.innerHTML = '';

  if (!usuariosFiltrados.length) {
    estatisticas = {
      Homem: 0,
      Mulher: 0,
      SomaIdades: 0,
      MediaIdades: 0.0,
    };

    return;
  }

  estatisticas.Homem = usuariosFiltrados.filter(
    (usuario) => usuario.genero === 'male'
  ).length;
  estatisticas.Mulher = usuariosFiltrados.filter(
    (usuario) => usuario.genero === 'female'
  ).length;
  estatisticas.SomaIdades = usuariosFiltrados.reduce(
    (acc, proxUsuario) => (acc += proxUsuario.idade),
    0
  );
  estatisticas.MediaIdades = (
    estatisticas.SomaIdades / usuariosFiltrados.length
  ).toFixed(2);

  tabEstatisticas.innerHTML += `
    
    <div class='estatistica'>
      <span><strong>Sexo masculino: </strong>${estatisticas.Homem}</span><br />
      <span><strong>Sexo feminino: </strong>${estatisticas.Mulher}</span><br />
      <span><strong>Soma das idades: </strong>${formatoNumero(
        estatisticas.SomaIdades
      )}</span><br />
      <span><strong>Média das idades: </strong>${
        estatisticas.MediaIdades
      }</span>
    </div>
    
  `;
};

function formatoNumero(numero) {
  return formatacaoNumero.format(numero);
}
