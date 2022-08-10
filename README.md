# Como consumir a api 🤔

<br>

> ## Método POST ✉️
> ### Rotas com o método POST


#### Para inserir um livro use ```.../books/insert```
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

> ## Método GET 👋
> ### Rotas com o método GET

#### Todos os livros cadastrados ```.../books/all```

#### Quantidade de livros cadastrados ```.../books/all-count```

### Todas as categorias ```.../books/all-category``` 
