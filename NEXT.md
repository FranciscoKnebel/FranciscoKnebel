# NEXT

Itens combinados para depois do merge da stack atual. Fora de escopo por decisão: feed de publicações, blog e newsletter.

## Pendências pequenas

- [ ] **Página de privacidade**: criar `/privacy/` e `/pt/privacidade/` e linkar no banner de consentimento e no rodapé.
- [ ] **Dados estruturados**: `ScholarlyArticle`/`ItemList` nas publicações e `CreativeWork`/`SoftwareSourceCode` nos projetos.
- [ ] **Chaves BibTeX**: ignorar artigo inicial (`a`/`an`/`the`) na primeira palavra, para chaves como `knebel2023study` em vez de `knebel2023a`.

## Roadmap

- [ ] **Página `/cv`**: versão HTML imprimível + PDF gerado dos JSON de experiências, projetos e publicações, com botão no hero.
- [ ] **Talks & Teaching**: seção para palestras, aulas e orientações, com dados em JSON.
- [ ] **Now e Uses**: páginas de "agora" e do setup e ferramentas.
- [ ] **Métricas em build-time**: substituir os SVGs commitados por componentes nativos e aposentar o workflow de commits de métricas.
- [ ] **Busca no site**: Pagefind quando houver volume de conteúdo (projetos e case studies).

## Conteúdo

- [ ] **JEMS 3**: escrever o case study e trocar `status: planned` por `published`.
- [ ] **Digital Twins**: escrever o case study e publicar.
- [ ] **Mural de Bolsas**: publicar quando o texto estiver revisado.

Para publicar um case study, basta trocar `status: planned` por `status: published` no frontmatter e escrever o corpo do markdown (detalhes no README, seção Development).
