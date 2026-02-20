# n8n-nodes-piperun

Integração oficial (comunidade) com o **PipeRun CRM de Vendas brasileiro** para o [n8n](https://n8n.io/). Este node permite gerenciar todo o ciclo de vendas, desde o contato inicial até o fechamento de propostas.

## ✨ Recursos Implementados

O node cobre os principais recursos da API do PipeRun utilizando o estilo declarativo do n8n:

- **👤 Pessoa**: Gestão de contatos (Criar, Buscar, Listar, Atualizar, Deletar).
- **💼 Oportunidade**: Gerencie seus negócios (Deals). Inclui troca de etapas, filtros por status (Aberto/Ganho/Perdido) e campos adicionais.
- **🏷️ Tag**: Organize seus registros com etiquetas personalizadas via CRUD completo.
- **📝 Nota**: Registro de histórico e comentários em Pessoas ou Oportunidades.
- **📄 Proposta**: Gerenciamento de propostas comerciais vinculadas a negócios.
- **🏢 Empresa**: Cadastro e manutenção de organizações B2B.
- **📅 Atividade**: Controle de tarefas, reuniões e ligações na agenda do CRM.
- **🛤️ Funil & Etapa**: Listagem de pipelines e estágios para automação de processos.

## 🚀 Instalação e Setup

### Pré-requisitos
- **n8n**: v1.0 ou superior
- **PipeRun API Token**: Obtido nas configurações da sua conta PipeRun.

### Desenvolvimento Local
1. Clone este repositório.
2. Instale as dependências: `npm install`.
3. Compile o projeto: `npm run build`.
4. Vincule ao n8n:
   ```bash
   npm link
   cd ~/.n8n/custom # Ou a pasta custom do seu SO
   npm link n8n-nodes-piperun
   ```
5. Reinicie o n8n e procure por "Piperun" na lista de nodes.

## ⚙️ Configuração

1. No n8n, crie uma nova credencial **Piperun API**.
2. Insira sua **Base URL** (Ex: `https://app.pipe.run/api/v1`) e seu **Token**.
3. No workflow, selecione o **Recurso** (Ex: Oportunidade) e a **Operação** desejada.

## ⚠️ Observações Importantes

- **Rate Limit**: A API do PipeRun possui um limite de **100 requisições por minuto**. Recomendamos o uso de nodes de "Wait" ou atrasos em loops extensos.
- **Terminologia**: Este node utiliza os termos oficiais do CRM (**Oportunidade** em vez de Negócio, e **Etapa** em vez de Fase) para facilitar o uso.

---
Desenvolvido para facilitar a automação de vendas no ecossistema brasileiro. 🇧🇷
