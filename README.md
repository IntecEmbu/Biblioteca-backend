# Rotas 🛣️ 

## Rota de Bibliotecário 📖

> ### Método POST 🕊️

#### Inserir um voluntário use ```.../librian/insert-collaborator```
```
{
    "name": "nome-colaborador",
    "email": "email-colaborador",
    "password": "senha-colaborador",
    "login": "nomeLogin-colaborador"
}
```

#### Para fazer login use ```.../librian/login-collaborator```
```
{
    "login": "nomeLogin-colaborador",
    "password": "senha-colaborador"
}
```

#### Para mudar status do colaborador (ativo / inativo) ```.../librian/status-collaborator```
```
{
    "id": "id-colaborador",
    "newStatus": "ativo/inativo"
}
```

<br>

> ### Método GET 📬

#### Todos os colaboradores ```.../librian/all-collaborators```
#### Colaboradores ativos ```.../librian/collaborators-active```
#### Colaboradores inativos ```.../librian/collaborators-inactive```


#

## Rota de Livros 📚

> ### Método POST 🕊️


#### Para inserir um livro use ```.../book/insert```
``` 
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

#### Todos os livros cadastrados ```.../book/all```
#### Quantidade de livros cadastrados ```.../book/all-count```
#### Todas as categorias ```.../book/all-category```
#### Livros por nome ```.../book/search-name?name=nome_livro```
#### Livros por autor ```.../book/search-author?author=nome_autor```
#### Livros por categoria ```.../book/search/search-category?category=nome_categoria```

#
## Rota de Usuário

> ### Método POST 🕊️

#### Inserir um novo usuário ```.../user/insert```
```
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

#### Coletar todos os usuários ```.../user/all```
#### Pesquisa usuário por nome ```.../user/search-user?name=nomeUsuario``` 

#
## Rota de Empréstimo 🏁

> ### Método POST 🕊️
#### Inserir um novo emprestimo ```.../lending/insert```
```
{
    "librian_id": "id-bibliotecario",
    "book_id": "id-livro",
    "user_id": "id-usuário",
    "return_prediction": "dias-emprestimo"
}
```

#### Devolver um livro ```.../lending/return-book```
```
{
    "lending_id": "id-emprestimo"
}
```


<br>

> ### Método GET 📬

#### Livros não devolvidos ```.../lending/not-returned```
#### Todos os empréstimos ```.../lending/all```

<br>

# Funcionalidades Internas 🛠️

## 🚧 Envio de E-mail 🚧
> ### Em testes - Funcionando 🚀

<br>

# Funcionalidades Externas 🌳

## [API Auxiliar](https://github.com/pedroFnseca/Subprocess-API) 📈
> #### Envio emails automaticamente para os usuarios quando estiver proximo da data de devolução do livro, realizando processamentos de rotina.
> #### Verificação e aplicação de multa para os usuarios que não devolveram o livro dentro do tempo estipulado.
