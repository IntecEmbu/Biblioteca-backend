# Sobre 💾

### ...

### ...

<br>

# Rota de Bibliotecário 📖

> ### Método POST 🕊️

#### Inserir um voluntário use `.../librian/insert-collaborator`

```json
{
  "name": "nome-colaborador",
  "email": "email-colaborador",
  "password": "senha-colaborador",
  "user": "nomeUsuario-colaborador"
}
```

#### Para fazer login use `.../librian/login-collaborator`

```json
{
  "user": "nomeUsuario-colaborador",
  "password": "senha-colaborador"
}
```

<br>

> ### Método GET 📬

#### Todos os colaboradores `.../librian/all-collaborators`

<br>

> ### Método PUT 📝

#### Atualizar um colaborador `.../librian/update-collaborator`

```json
{
  "id": "id-colaborador",
  "name": "nome-colaborador",
  "email": "email-colaborador",
  "user": "nomeUsuario-colaborador"
}
```

<br>

> ### Método DELETE 🗑️

#### Desativar um colaborador `.../librian?id=id-colaborador`

#

# Rota de Livros 📚

> ### Método POST 🕊️

#### Para inserir um livro use `.../book/insert`

```json
{
  "title": "titulo",
  "edition": "edição/volume",
  "isbn": "número",
  "year": "anoLançamento",
  "category": "categoria",
  "cdd": "númeroCdd",
  "idiom": "idioma"
}
```

<br>

> ### Método GET 📬

#### Todos os livros cadastrados `.../book/all`

#### Quantidade de livros cadastrados `.../book/all-count`

#### Livros por nome `.../book/search-name?name=nome_livro`

#### Livros por autor `.../book/search-author?author=nome_autor`

#### Livros por categoria `.../book/search/search-category?category=nome_categoria`

<br>

> ### Método PUT 📝

#### Para atualizar um livro use `.../book/update-book`

```json
{
  "id": "id-livro",
  "title": "titulo",
  "edition": "edição/volume",
  "isbn": "número",
  "release_year": "anoLançamento",
  "category": "categoria",
  "cdd": "númeroCdd",
  "language": "idioma"
}
```

<br>

> ### Método DELETE 🗑️

#### Para deletar um livro use `.../book?id=id_livro`

#

# Rota de Usuário

> ### Método POST 🕊️

#### Inserir um novo usuário `.../user/insert`

```json
{
  "name": "nome-usuario",
  "email": "email-usuario",
  "type": "Funcionario/aluno",
  "phone": "telefone-usuario",
  "course": "curso-usuario"
}
```

<br>

> ### Método GET 📬

#### Coletar todos os usuários `.../user/all`

#### Pesquisa usuário por nome `.../user/search-user?name=nomeUsuario`

<br>

> ### Método PUT 📝

#### Atualizar um usuário `.../user/update-user`

```json
{
  "id": "id-usuario",
  "name": "nome-usuario",
  "email": "email-usuario",
  "type": "Funcionario/aluno",
  "phone": "telefone-usuario",
  "course": "curso-usuario"
}
```

<br>

> ### Método DELETE 🗑️

#### Desativar um usuário `.../user?id=id-usuario`

#

# Rota de Empréstimo 🏁

> ### Método POST 🕊️

#### Inserir um novo emprestimo `.../lending/insert`

```json
{
  "librian_id": "id-bibliotecario",
  "book_id": "id-livro",
  "user_cpf": "cpf-usuário"
}
```

#### Devolver um livro `.../lending/return-book`

```json
{
  "lending_id": "id-emprestimo"
}
```

<br>

> ### Método GET 📬

#### Livros não devolvidos `.../lending/not-returned`

#### Todos os empréstimos `.../lending/all`

#

# Rota de Relátório 📄

> ### Método GET 📬

#### Coleta a quantidade de livros parados, emprestados e em circulação `.../report/quantity-book"`

<br>

## Projetos relacionados 📁

- ### [Backend](https://github.com/IntecEmbu/Biblioteca-backend) - API REST desenvolvida em NodeJS.
- ### [Backend auxiliar](https://github.com/PedroFnseca/Subprocess-API) - Desenvolvida em Nodejs para auxiliar o sistema aplicando multas e avisos de email.
