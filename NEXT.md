# NEXT

Itens combinados para depois do merge da stack atual. Fora de escopo por decisão: feed de publicações, blog e newsletter.

## Pendências pequenas

- [x] **Página de privacidade**: criar `/privacy/` e `/pt/privacidade/` e linkar no banner de consentimento e no rodapé.
- [x] **Dados estruturados**: `ScholarlyArticle`/`ItemList` nas publicações e `CreativeWork`/`SoftwareSourceCode` nos projetos.
- [x] **Chaves BibTeX**: ignorar artigo inicial (`a`/`an`/`the`) na primeira palavra, para chaves como `knebel2023study` em vez de `knebel2023a`.

## Roadmap

- [x] **Página `/cv`**: versão HTML imprimível + PDF gerado dos JSON de experiências, projetos e publicações, com botão no hero.
- [x] **Talks & Teaching**: seção para palestras, aulas e orientações, com dados em JSON.
- [x] **Now e Uses**: páginas de "agora" e do setup e ferramentas.
- [x] **Métricas em build-time**: substituir os SVGs commitados por componentes nativos e aposentar o workflow de commits de métricas.
- [x] **Busca no site**: Pagefind quando houver volume de conteúdo (projetos e case studies).

## Conteúdo

- [x] **JEMS 3**: relato curto EN/PT com participação e escopo documentados.
- [x] **Digital Twins**: caso EN/PT com referência ao preprint e à dissertação.
- [x] **Mural de Bolsas**: texto EN/PT revisado, sem métricas ou causalidades não comprovadas.

Para publicar um case study, basta trocar `status: planned` por `status: published` no frontmatter e escrever o corpo do markdown (detalhes em `docs/maintenance.md`).

Implementações preparadas em PRs para decisão. Talks & Teaching mantém dados vazios e noindex até haver materiais reais. A verificação de produção roda depois do deploy, sem antecipar merge ou publicação durante a revisão.
