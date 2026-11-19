# MiniProj2 · Animalec com patrocinadores e especialistas

Tarefa 3.2 da UC **Programação Web Avançada** (MEIW 2026/27) · Pedro Brás

Desenvolvimento do front-end (e da API correspondente) que complementa o projeto **Animalec** do livro *Desenvolvimento Avançado para a Web: Do front-end ao back-end* (Portela & Queirós, 2020). Acrescentam-se as duas entidades planeadas na Tarefa 3.1 b): **patrocinadores** (*sponsors*) e **especialistas** (*experts*).

## Estrutura

```
back-end/    API em Node.js + Express + Mongoose (porta 8080)
front-end/   SPA em Vue 2 + Vuex + Vue Router + BootstrapVue (porta 8081)
```

O primeiro commit tem o código do livro tal como foi distribuído; os seguintes mostram, um a um, o que foi alterado.

## Como pôr a correr localmente

**Base de dados**
1. Instalar o MongoDB Community e o Studio 3T.
2. No Studio 3T, ligar à base de testes do livro (endereço no enunciado da Tarefa 3.2) e à base local (`localhost:27017`).
3. Criar a base `test` na ligação local e copiar para lá todas as coleções da base do livro (*Copy all collections* → *Paste collections*).

**Back-end**
```
cd back-end
npm install
npm start            # «Your app is listening on 8080»
npm test             # 11 testes das rotas novas (não precisam do MongoDB)
```
A ligação está em `config/config.js` (`mongodb://localhost:27017/test`) e pode mudar-se com a variável de ambiente `MONGODB_URI`.

**Front-end**
```
cd front-end
npm install
npm run serve        # http://localhost:8081
```
Em versões recentes do Node.js (17 ou mais), o Vue CLI 4 precisa antes de `export NODE_OPTIONS=--openssl-legacy-provider` (Windows PowerShell: `$env:NODE_OPTIONS="--openssl-legacy-provider"`).

Se o login **admin / admin** falhar, é porque a base partilhada do livro já não tem esse utilizador no formato do Animalec. Com o MongoDB local ligado, correr `node scripts/criar_admin.js` na pasta `back-end`.

Entrar com **admin / admin** e abrir **ADMIN → Patrocinadores** ou **Especialistas**. Também se pode usar o Vue UI, como no capítulo A.1.1 do livro.

## O que foi acrescentado

### Entidades (especificação da Tarefa 3.1 b)

**Patrocinador:** nome, tipo (empresa, associação, particular), NIF (9 algarismos), logótipo (link), email, site, telefone, nível (ouro, prata, bronze), animais patrocinados, data de início e de fim, mensagem para o público (até 300 caracteres), ativo.

**Especialista:** título, nome, fotografia (link), especialidade (com sugestões de famílias), instituição, animais que acompanha, ORCID, nota biográfica (até 500 caracteres), email, página pessoal, se pode validar quizzes, ativo.

Os dados ficam nas coleções **`patrocinadores`** e **`especialistas`**. Não se usam os nomes `sponsors` e `experts` porque a base de testes do livro, que é partilhada, já tem coleções com esses nomes criadas por outros alunos, com outros campos.

A ligação aos animais é **N:N**: cada patrocinador ou especialista guarda a lista dos ids dos animais, e a API devolve-os preenchidos (`populate`) com o nome e o grupo.

O logótipo e a fotografia são links, como as imagens dos animais no livro, porque a API não recebe ficheiros.

### API

| Método | Caminho | Login | O que faz |
|---|---|---|---|
| GET | `/sponsors` · `/experts` | sim | lista (aceita filtros, ex.: `?active=true`) |
| GET | `/sponsors/public` · `/experts/public` | não | só os ativos (página principal e página do animal) |
| GET | `/sponsors/:id` · `/experts/:id` | sim | um registo |
| POST | `/sponsors` · `/experts` | sim | criar (201 + cabeçalho `Location`) |
| PUT | `/sponsors/:id` · `/experts/:id` | sim | atualizar |
| PUT | `/sponsors/activate/:id`, `/deactivate/:id` (e o mesmo em `/experts`) | sim | ativar ou desativar |
| DELETE | `/sponsors/:id` · `/experts/:id` | sim | remover |

Os dados validam-se duas vezes: no browser (tipos e atributos HTML5: `email`, `url`, `date`, `pattern`, `required`, `maxlength`) e na API (`express-validator` e o esquema do Mongoose). Dados inválidos devolvem **406** com a lista dos campos errados.

### Front-end

- **ADMIN:** dois cartões novos, Patrocinadores e Especialistas.
- Para cada entidade: **listar** (ordenar por nome), **adicionar**, **editar**, **ver**, **ativar/desativar** e **remover**, com o mesmo aspeto das páginas dos animais.
- O formulário é um componente partilhado entre Adicionar e Editar (`SponsorForm.vue`, `ExpertForm.vue`).
- Cada entidade tem o seu serviço da API (`src/api/*.service.js`, com `fetch` e JSON) e o seu módulo Vuex (`src/store/sponsors`, `src/store/experts`).
- **Página principal:** secção «Os nossos patrocinadores», só com os ativos.
- **Página de cada animal:** os especialistas que o acompanham e os patrocinadores.

### Correções ao código original

1. **A sessão perdia-se ao recarregar a página.** O login gravava o token em `localStorage.STORAGE_ACCESS_TOKEN` (a chave «STORAGE_ACCESS_TOKEN»), mas a aplicação lia e apagava a chave `user_token`. Passou a usar-se `localStorage.setItem(STORAGE_ACCESS_TOKEN, …)`.
2. **O CSS não carregava em rotas com dois níveis** (ex.: `/admin/animals`), porque o `index.html` usava um caminho relativo (`css/animalec.css`). Passou a `<%= BASE_URL %>css/animalec.css`.
3. As credenciais do email que vinham no `config.js` foram retiradas do repositório (variáveis de ambiente `EMAIL_USER` e `EMAIL_PASS`).

## Referência

Portela, F., & Queirós, R. (2020). *Desenvolvimento avançado para a Web: Do front-end ao back-end*. FCA – Editora de Informática.
