# Rotas 🛣️ 

## Rota de Bibliotecário 📖

> ### Método POST 🕊️

##### Para inserir um voluntário use ```.../librian/insert-collaborator```
```
{
    "name": "nome-colaborador",
    "email": "email-colaborador",
    "password": "senha-colaborador",
    "login": "nomeLogin-colaborador"
}
```

##### Para fazer login use ```.../librian/login-collaborator```
```
{
    "login": "nomeLogin-colaborador",
    "password": "senha-colaborador"
}
```

##### Para mudar status do colaborador (ativo / inativo) ```.../librian/status-collaborator```
```
{
    "id": "id-colaborador",
    "newStatus": "ativo/inativo"
}
```

<br>

> ### Método GET 📬

##### Todos os colaboradores ```.../librian/all-collaborators```
##### Colaboradores ativos ```.../librian/collaborators-active```
##### Colaboradores inativos ```.../librian/collaborators-inactive```

<br>

#

## Rota de Livros 📚

> ### Método POST 🕊️


##### Para inserir um livro use ```.../book/insert```
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

##### Todos os livros cadastrados ```.../book/all```
##### Quantidade de livros cadastrados ```.../book/all-count```
##### Todas as categorias ```.../book/all-category```
##### Livros por nome ```.../book/search-name?name=nome_livro```
##### Livros por autor ```.../book/search-author?author=nome_autor```
##### Livros por categoria ```.../book/search/search-category?category=nome_categoria```

<br>
<br>

# Funcionalidades internas 🛠️



> ## 🚧 Funcionalidade de E-mail 🚧
> ### Em testes - Funcionando 🚀

##### Para enviar um email com somente texto
```
{
    "email": "email-usuario",
    "subject": "asssunto",
    "text": "conteudo"
}
```

##### Para enviar um email com html
```
{
    "email": "email-usuario",
    "subject": "asssunto",
    "html": "conteudo"
}
```