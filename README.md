#

# Rota de livros 📚

> ### Método POST ✉️


##### Para inserir um livro use ```.../books/insert```
``` 
{
    "title": titulo,
    "edition": edição/volume,
    "isbn": número,
    "year": anoLançamento,
    "category": categoria,
    "cdd": númeroCdd,
    "idiom": idioma
}
```

<br>

> ### Método GET 👋

##### Todos os livros cadastrados ```.../books/all```
##### Quantidade de livros cadastrados ```.../books/all-count```
##### Todas as categorias ```.../books/all-category``` 

#

# Rota de bibliotecário 📖

> ### Método POST ✉️

##### Para inserir um voluntário use ```.../librian/insert-collaborator```
```
{
    "name": "nome-colaborador",
    "email": "email-colaborador",
    "password": "senha-colaborador"
}
```

##### Para fazer login use ```.../librian/login-collaborator```
```
{
    "email": "email-colaborador",
    "password": "senha-colaborador"
}
```

##### Para mudar status do colaborador (ativo / inativo) ```.../librian/status-collaborator```
```
{
    "id": "id-colaborador",
    "newStatus": ativo/inativo
}
```

<br>

> ### Método GET 👋

##### Todos os colaboradores ```.../librian/all-collaborators```
##### Colaboradores ativos ```.../librian/collaborators-active```
##### Colaboradores inativos ```.../librian/collaborators-inactive```