//
// yay!
//
var gun = GUN({peers: ['http://54.39.143.211:8000/gun']});
var nome = '';
var comentarios = '';
var listaLivros = Array();
var postagens = Array();
var author = gun.user().recall({sessionStorage: true});
document.addEventListener('DOMContentLoaded', () => {
    atualizaPostagens();
    for (let l of listaLivros) {
        adicionaLista(l);
    }
});
function fazRegister(e) {
    e.preventDefault();
    nome = document.querySelector('#register').value;
    senha = document.querySelector('#newPass').value;
    gun.user().create(nome,senha);
    author = gun.get('~@'+nome); // There should be the same `username` in Step 2
}
function fazLogin(e) {
    e.preventDefault();
    nome = document.querySelector('#login').value;
    senha = document.querySelector('#passw').value;
    gun.user().auth(nome,senha);
    author = gun.get('~@'+nome); // There should be the same `username` in Step 2
    el = document.querySelector('#panel');
    // el.innerHTML = gun.user().get('name').val();
    el.style.visibility = 'hidden';
    el.style.height = 0;
    el1 = document.querySelector('#digitacao');
    el1.style.visibility = 'visible';
    el1.style.height = 'auto';
}
function fazLogout(e) {
    e.preventDefault();
    gun.user().leave();
    el = document.querySelector('#panel');
    // el.innerHTML = '<input type="text" id="login"><input type="password" id="passw"><button onclick="fazLogin(event)">Login</button>';
    el.style.visibility = 'visible';
    el.style.height = 'auto';
    el1 = document.querySelector('#digitacao');
    el1.style.visibility = 'hidden';
    el1.style.height = 0;
}
function atualizaNome() {
    nomezin = document.querySelector('#name').value;
    copia = gun.user().get('amigo_oculto').get('name');
    copia.put(nomezin.value);
    copia.on((data) => {nomezin.value = data});
    nome = nomezin;
}
function atualizaTexto() {
    comentarios = document.querySelector('#comments');
    copia = gun.user().get('amigo_oculto').get('comments');
    copia.put(comentarios.value);
    copia.on((data) => {comentarios.value = data});
    tc = document.querySelector('#textocomentarios');
    tc.innerHTML = comentarios.value;
}
function adicionaLista() {
    title = document.querySelector("#titulo").value;
    author = document.querySelector("#autor").value;
    
    document.querySelector("#titulo").value = '';
    document.querySelector("#autor").value = '';

    elem = document.createElement('li');
    elem.setAttribute('id', `${title.replace(" ","_")}_${author.replace(" ","_")}`);
    elem.innerHTML = `Quero ganhar o livro ${title} escrito por ${author}.  `;
    
    botao = document.createElement('button');
    botao.setAttribute('onclick', 'deletaLista(this)');
    botao.setAttribute('id', `${title.replace(" ","_")}_${author.replace(" ","_")}`);
    botao.innerHTML = 'x';
    
    elem.appendChild(botao);
    
    lista = document.querySelector('#lista');
    lista.appendChild(elem);
    copia = gun.user().get('amigo_oculto').get('lista');
    copia.put({'titulo':title, 'autor':author});

    listaLivros.push({'titulo':title, 'autor':author});
}
function deletaLista(botao) {
    item = document.getElementById(botao.id);
    item.remove();
    
    const index = listaLivros.indexOf({'titulo':title, 'autor':author});
    if (index > -1) { // only splice array when item is found
        listaLivros.splice(index, 1); // 2nd parameter means remove one item only
    }
}
function postagem() {
    copia = gun.user().get('amigo_oculto').get('postagens');

    copia.get('name').put(nome);
    copia.get('comments').put(comentarios);
    lis = {}
    for (let i=0; i<listaLivros.length; i++) {
        lis[i] = listaLivros[i];
    }
    copia.get('lista').put(lis);
}
function deleta() {
    copia = gun.user().get('amigo_oculto').get('postagens');
    copia.put(null);
}
function atualizaPostagens(a) {
    copia = gun.get('amigo_oculto'); //.get('postagens');
    console.log('carregou');
    // copia.map().on(function(a)  {
    console.log(a);
    divoutros = document.querySelector('#outros');
    c = document.createElement('p');
    copia.user('qLFrhvFduOGOAIztcNyfc9eSP7KhPpM1QE3WMcJWWrA.OFncMy45TPyHWG9TeDzH5z4eSs1otKetMRpKQlknWEk')
        .get('postagens')
        .on(
            function (dados) {
                console.log(dados.stringify());
                c.innerHTML = dados.stringify();
            }
        );
    divoutros.appendChild(c);
    // });
}
// sharing is caring via pubKey
gun.user('qLFrhvFduOGOAIztcNyfc9eSP7KhPpM1QE3WMcJWWrA.OFncMy45TPyHWG9TeDzH5z4eSs1otKetMRpKQlknWEk').on(
    function (dados) {
        atualizaPostagens(dados);
    }
);