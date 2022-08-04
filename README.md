> ## Como usar a api 🤔
> #### Passo a passo de como consumir a api

<br>

> ## Método POST ✉️
> ### Rotas com o método POST


#### Para inserir um livro use ```.../cataloguin/insertbook```
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

#### Todos os livros cadastrados ```.../cataloguin/getallbooks```

#### Quantidade de livros cadastrados ```.../cataloguin/getcountbooks```
