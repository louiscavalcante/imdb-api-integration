## IMDB Rest API - Integrator

Script Node.js para atualização e inserção de novos dados no database.<br>
Os dados são baixados do site IMDB, extraidos do formado .gz e são passados de forma incremental no banco de dados do PostgreSQL hosteado no Docker.<br>
Todas essas ações são realizadas diariamente à 1:00am (Timezone America/São Paulo) através de um Cron Job.
<br>
## Uso:
Roda o banco de dados:<br>
`docker run --name db -p 5555:5432 -d louiscavalcante/imdb-api-db:latest`<br>

---
Roda o script de integração:<br>
`docker run --name integrador -it louiscavalcante/imdb-api-integration:latest`<br>
<br>

---
## >!< Importante
O database se encontra sem dados, só contém o schema. Será necessario rodar o integrador primeiro.<br>
Favor rodar o integrador por 2 minutos antes de testar a API.<br>

A função de Cron Job está comentada no código.<br>
Assim o integrador pode ser testado e usado para preenxer o banco de dados a qualquer momento.<br>