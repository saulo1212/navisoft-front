Oi! Vi suas 4 dúvidas sobre o pedido de Devices/SIM Cards que mandamos ontem. Fazem sentido, então deixa eu detalhar melhor o que a gente precisa em cada uma — e já aproveito pra contar o que a gente já conseguiu avançar sem depender dessas respostas, pra você ter o quadro completo.

## 1. Trocar o SIM de um device ativo, sem desativar

Hoje a única coisa que temos confirmada é a liberação automática do SIM quando o device é desativado (`PUT .../devices/:uid` com `active:false`). Isso resolve o caso de "desligar o equipamento", mas não o caso de "o SIM deu problema, preciso trocar sem tirar o device de operação".

Pra resolver isso, qualquer uma destas duas coisas já funciona pra nós:

- Um endpoint de unlink pra device ativo (algo como `DELETE /v1/admin/devices/linked-simcards/:uid`), **ou**
- Se eu vincular um SIM novo num device que já tem um SIM vinculado, isso já libera o antigo e vincula o novo automaticamente (sem dar erro de conflito).

Se nenhuma das duas existir e não for prioridade criar agora, não tem problema — só confirma pra gente, que a gente documenta "pra trocar SIM, tem que desativar o device, reativar, e vincular outro" como o caminho oficial. A tela já está pronta pra funcionar assim, se for esse o caso.

Outra coisa que ajuda: quando o `PUT` desativa o device e libera o SIM, a resposta vem com `simcard_unlinked` (true/false) e `unlinked_simcards` (lista). Os dois nomes aparecem sempre juntos, ou é só um dos dois? Preciso saber se posso confiar nos dois campos separadamente.

## 2. Listar as identidades protocolares e os mapeamentos de telemetria

Hoje só existe `POST` para criar esses dois recursos, não achamos nenhum `GET`/busca. Precisaríamos de algo como:

```
GET/POST .../devices/protocol-identities/search
GET/POST .../devices/telemetry-mappings/search
```

Mas aqui não é urgente — essa telinha ("o que já foi cadastrado nesse device") ainda nem foi desenhada nesta etapa, a gente está focando primeiro em device + SIM card básico. Só me confirma se isso é algo que "ainda não existe, mas vai existir" ou "não existe por design" — isso já me ajuda a decidir se entra como parte dessa mesma fase ou se vira algo separado pra depois.

## 3. Excluir device e excluir SIM card

Achei uma anotação antiga dizendo que isso foi testado e funcionou (retornou 204), mas não achei a rota documentada em lugar nenhum. Pode confirmar:

1. É `DELETE /v1/admin/devices/:uid` e `DELETE /v1/admin/simcards/:uid` mesmo?
2. É exclusão lógica (fica marcado como excluído, dá pra reverter) ou física (some de vez)?
3. Tem alguma regra de bloqueio? Tipo: device com SIM vinculado não deixa excluir (409)? SIM vinculado a um device também bloqueia? Algum outro vínculo (custódia, histórico de ordem de serviço) impede também?

Isso não trava a gente agora — enquanto não confirma, a gente já deixou implementado usando essa mesma rota (a que a anotação antiga menciona), bloqueando quando tem SIM vinculado. Só precisamos validar isso ao vivo antes de ir pra produção.

## 4. Senha do device

Não achei nenhum exemplo de `POST`/`PUT` de device que mande o campo `password` — só vi `has_password` aparecendo na resposta do `GET`. Pode confirmar:

1. `password` no `POST` de criação é aceito, e é opcional (dá pra criar sem senha)?
2. Tem alguma rota separada pra trocar a senha depois (tipo `PUT /v1/admin/devices/:uid/password`)?

Também não trava nada agora: a tela de criação já tem um campo "senha (opcional)" que só manda esse campo se o usuário realmente digitar algo. A troca de senha depois da criação a gente deixa pra uma próxima rodada.

---

## O que já fizemos enquanto isso

Pra não ficar tudo parado esperando essas respostas, já implementamos tudo que já estava confirmado no pedido de ontem — devices e SIM cards básicos:

- Listagem de devices via `POST /devices/search` (igual já funciona em assets/entidades) e listagem de SIM cards via `GET /simcards` com filtro — trocamos a forma antiga que usava um `GET` com query solta, que a gente não tinha certeza se funcionava.
- Tiramos do código (e da tela) a chamada pra `DELETE /v1/admin/devices/:uid/linked-simcards` — era um palpite nosso de uma rodada anterior que, como vimos no levantamento de ontem, não existe em lugar nenhum. O botão de "Desvincular" direto saiu da tela; agora ela só orienta a desativar o device pra liberar o SIM (o único caminho que realmente existe hoje).
- Ajustamos a paginação de devices/SIM cards pra usar o mesmo padrão de offset que já funciona em assets/entidades, em vez do padrão de cursor que a gente tinha copiado errado de outro módulo.

Então, resumindo o que falta pra fechar: a resposta pro item 1 é a mais importante (sem ela a troca de SIM continua manual); os itens 3 e 4 são mais tranquilos, só precisamos confirmar antes de ir pra produção; e o item 2 pode esperar, é só pra alinhar expectativa sobre quando/se entra.

Valeu!
