#

# Rota de livros 📚

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

#

# Rota de bibliotecário 📖

> ### Método POST 🕊️

##### Para inserir um voluntário use ```.../librian/insert-collaborator```
```
{
    "name": "nome-colaborador",
    "email": "email-colaborador",
    "password": "senha-colaborador",
    "user": "nomeLogin-colaborador"
}
```

##### Para fazer login use ```.../librian/login-collaborator```
```
{
    "user": "nomeLogin-colaborador",
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
