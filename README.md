# Projeto [Nome do Projeto]

Este é um projeto full-stack utilizando **NestJS** no backend, **React** no frontend e **PostgreSQL** como banco de dados.

## Execução

Para rodar o projeto, utilize o Docker Compose para subir os containers necessários.

1. Execute o comando abaixo para iniciar os containers em segundo plano:

```bash
docker-compose up -d
```


# Acesse o frontend no seguinte endereço: 

Acesse o backend no seguinte endereço: 
- FrontEnd: http://localhost:3000/

- Backend: http://localhost:3040/

### Acesse a documentação da API: http://localhost:3040/api 

### Testes
```bash 
npm run test
```
- PASS  src/tests/balance.service.spec.ts
- PASS  src/tests/auth.controller.spec.ts
- PASS  src/tests/balance.controller.spec.ts
- PASS  src/tests/payments.controller.spec.ts
- PASS  src/tests/payments.service.spec.ts


- Test Suites: 5 passed, 5 total
- Tests:       34 passed, 34 total
- Snapshots:   0 total
- Time:        4.968 s, estimated 5 s



## Tecnologias Utilizadas
- Backend: NestJS
- Frontend: React
- Banco de Dados: PostgreSQL