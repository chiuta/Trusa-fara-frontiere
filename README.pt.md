# Trusa fără frontiere

[English](README.md) · [Română](README.ro.md) · [Français](README.fr.md) · [Italiano](README.it.md) · [Español](README.es.md) · **Português** · [Deutsch](README.de.md) · [Magyar](README.hu.md)

**Versão:** 1.1.0 · **Última atualização:** 2026-10-14

Um kit de 15 pequenas ferramentas num único ficheiro HTML: regex, JSON, diff, hash, palavras-passe, sub-rede, notas, folha de cálculo, Kanban e outras. Funciona localmente no navegador, sem conta.

**Aplicação online:** https://chiuta.github.io/Trusa-fara-frontiere/

![Captura de ecrã](screenshot.png)

## O que é

Um conjunto de pequenos módulos, escritos de raiz, inspirados na funcionalidade básica de algumas categorias de aplicações do catálogo YunoHost (desenvolvimento, escritório, utilitários, ferramentas de sistema, produtividade, leitura). Não é uma reconstrução dessas aplicações e não é afiliado ao YunoHost; as aplicações que dependem de um servidor (chat, sincronização, redes sociais) não têm equivalente num ficheiro local.

## Funcionalidades

Verificadas no código e testadas em Chromium sem interface:
- **Regex Lab**: correspondências realçadas, grupos (incluindo nomeados), sinalizadores g/i/m/s/u, pré-visualização da substituição (`$1`, `$<nome>`, `$&`, `$$`, `` $` ``, `$'`); corre num Worker com limite de 1,5 s, para que um padrão com retrocesso catastrófico não bloqueie a página.
- **JSON Lab**: validação, formatação (2/4 espaços/tabulação), minificação, ordenação recursiva das chaves, pesquisa por caminho (`a.b[0].c`) e conversão de uma lista de objetos → CSV.
- **Diff Viewer**: diferença por linhas (LCS), com realce das palavras alteradas nos pares de linhas modificadas, com limite de tamanho.
- **Hash & Encoding Lab**: SHA-1/256/384/512 e HMAC com chave (Web Crypto), verificação de um hash conhecido, Base64 (UTF-8), URL-encode, hex.
- **Inspetor de ficheiros**: metadados, pré-visualização de imagem, estatísticas de texto, SHA-256, tudo localmente.
- **Gerador de palavras-passe**: palavra-passe de carateres e frase-passe de 150 palavras, com `crypto.getRandomValues` (sem recurso a `Math.random`) e estimativa de entropia.
- **Calculadora de sub-redes** IPv4/CIDR, **Conversor de unidades** (comprimento, massa, volume, dados, temperatura).
- **Caderno Markdown** (subconjunto: títulos, listas com marcadores e numeradas, citações, linha horizontal, tabelas com `|`, código, ligações http/https/mailto; «Exportar .md» descarrega a nota selecionada), **Mini folha de cálculo** (8×20, SUM/AVG/MIN/MAX/COUNT; «Exportar CSV» com os valores calculados e «Importar CSV» com separador vírgula, ponto e vírgula ou tabulação), **Mapa mental** (rato, toque, teclado), **Quadro Kanban**, **Diário financeiro**, **Cofre de fragmentos**.
- **Leitor RSS/Atom** para ficheiros XML carregados ou colados (não descarrega feeds).
- Exportação/importação JSON de todos os dados locais; tema dia/noite.

## Manual de utilização

1. Escolha um módulo no menu da esquerda (no telemóvel, o botão ☰).
2. Introduza os dados nos campos do módulo; os resultados atualizam-se de imediato (em Diff e Palavras-passe prime o botão).
3. As notas, a folha, o mapa, o Kanban, o diário e os fragmentos são guardados automaticamente no navegador.
4. Para uma cópia de segurança prima «exportar dados» (descarrega um ficheiro JSON); «importar dados» volta a carregá-lo e substitui os dados dos módulos encontrados no ficheiro, após confirmação.
5. «acerca de e fontes» explica o projeto e os seus limites.

## Privacidade e rede

- A aplicação não faz pedidos de rede: a CSP da página tem `connect-src 'none'` e `script-src` por hash SHA-256 (sem `'unsafe-inline'`), sem scripts, tipos de letra ou imagens externos. Não há telemetria, conta nem cookies.
- Armazenamento: `localStorage`, chaves com o prefixo `tff:` (`notebook`, `spreadsheet`, `mindmap`, `kanban`, `ledger`, `paste`), **sem cifra**. Se o armazenamento estiver bloqueado (modo privado), a aplicação funciona, mas mostra um aviso de que os dados não são guardados.
- Anfitriões externos: nenhum, além da ligação para github.com/YunoHost/apps na caixa «acerca de» (só se abre se a premir, com `noopener noreferrer`) e das ligações nas notas/feeds em que clicar.
- Permissões do navegador: nenhuma. Os ficheiros escolhidos ficam no navegador. Usam-se um Worker a partir de um Blob (Regex Lab) e a área de transferência (botões «Copiar»).

## Limites e avisos

- Os dados em `localStorage` perdem-se se apagar os dados do site ou mudar de navegador/dispositivo; faça exportações periódicas. Dois separadores abertos em simultâneo podem sobrescrever-se mutuamente.
- Não guarde palavras-passe, chaves ou dados sensíveis no Caderno, na folha ou no Cofre: ficam armazenados em texto simples no navegador.
- As palavras-passe são geradas localmente, mas não garantem a presença de todos os tipos de carateres. A frase-passe usa uma lista pequena (150 palavras, ≈7,2 bits/palavra): use 10–12 palavras para algo importante. Os hashes SHA rápidos não são adequados para guardar palavras-passe; o SHA-1 está obsoleto.
- A folha de cálculo e o Markdown são subconjuntos simples e não substituem programas completos. O diário financeiro é um registo pessoal simples, não um software de contabilidade, e não especifica a moeda.
- Os inteiros acima de 2^53 perdem precisão no JSON Lab (limite do JavaScript). O Diff recusa textos muito grandes.
- Os mapas e os módulos foram testados em Chromium; outros navegadores não foram testados.

## Execução local / offline

Descarregue `index.html` e abra-o num navegador; não tem dependências. Para um servidor local: `python3 -m http.server`.

## Histórico / Changelog

### 1.1.0 — 2026-10-14
- Cópia de segurança e etiquetagem de dados (fff-kit).

### 1.0.0 — 12 de outubro de 2026
- A versão e a data da última atualização são apresentadas na aplicação (janela «acerca de e fontes»).

### 11.10.2026 (terceira atualização) — 11 de outubro de 2026
- Regex Lab: pré-visualização da substituição (construída a partir das correspondências encontradas no Worker, pelo que mantém o limite de 1,5 s), grupos nomeados e sinalizador `u`.
- JSON Lab: pesquisa por caminho e lista de objetos → CSV. Diff Viewer: as palavras alteradas são realçadas dentro das linhas modificadas. Hash & Encoding Lab: HMAC com chave e verificação de um hash conhecido.

### 11.10.2026 (segunda atualização) — 11 de outubro de 2026
- Segurança: o `script-src` da CSP usa um hash SHA-256 em vez de `'unsafe-inline'`.
- Caderno: tabelas Markdown, listas numeradas, linha horizontal e «Exportar .md». Folha de cálculo: «Exportar CSV» (com proteção contra fórmulas noutros programas: os valores de texto que começam por `=`, `+`, `-`, `@` recebem um apóstrofo) e «Importar CSV» (máx. 8 colunas × 20 linhas, com confirmação).
- Estilo de impressão: imprime-se apenas o módulo atual, em fundo branco.

### 11.10.2026 — 11 de outubro de 2026
- Verificação de rotina de 11.10.2026: axe sem violações a 1280 e 360 px, sem erros na consola; sem alterações ao código.

## Licença

MIT — ver o ficheiro LICENSE.

## Autor

Alexio — Alexandru-Ionuț Chiuță, contacto: alexio@trom.tf. Construído com o Claude (Anthropic) a pedido do autor.

## Resumo

Trusa fără frontiere («Kit sem fronteiras») é um kit de ficheiro único, em língua romena, com 15 pequenas ferramentas offline: testador de regex (Worker com limite de tempo), JSON, diff, hash/codificação, inspetor de ficheiros, gerador de palavras-passe e frases-passe CSPRNG, calculadora de sub-redes, conversor de unidades, caderno Markdown, mini folha de cálculo, mapa mental, Kanban, diário financeiro, cofre de fragmentos e leitor de ficheiros RSS/Atom. Sem pedidos de rede (CSP `connect-src 'none'`), sem telemetria; os dados ficam sem cifra em `localStorage`, com exportação/importação JSON. Licença: MIT (ver o ficheiro LICENSE).
