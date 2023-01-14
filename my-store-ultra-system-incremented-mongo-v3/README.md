# my-store-ultra-system-incremented-mongo-v3

Crie as seguintes duas rotas no servidor:

1. PUT `/products/:id`
    
    Atualiza um produto com o id recebido por path params sobrescrevendo todas as propriedades com os valores recebidos por body e retorna status 200 caso obtenha sucesso
    
    Caso não encontre o produto, retorna status 404
    
2. PUT `/customers/:id`
    
    Atualiza um cliente com o id recebido por path params sobrescrevendo todas as propriedades com os valores recebidos por body e retorna status 200 caso obtenha sucesso
    
    Caso não encontre o cliente, retorna status 404