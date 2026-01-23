import pool from '../config/database.js';

// NF-e Types based on Brazilian fiscal requirements
export interface NFeEmitente {
  cnpj: string;
  nome: string;
  fantasia?: string;
  endereco: {
    logradouro: string;
    numero: string;
    bairro: string;
    codigoMunicipio: string;
    municipio: string;
    uf: string;
    cep: string;
    pais: string;
    codigoPais: string;
  };
  ie: string; // Inscrição Estadual
  im?: string; // Inscrição Municipal
  crt: number; // Código de Regime Tributário: 1=Simples, 2=Simples Excesso, 3=Normal
}

export interface NFeDestinatario {
  cpf?: string;
  cnpj?: string;
  nome: string;
  email?: string;
  telefone?: string;
  endereco?: {
    logradouro: string;
    numero: string;
    bairro: string;
    codigoMunicipio: string;
    municipio: string;
    uf: string;
    cep: string;
  };
  ie?: string;
  indicadorIE: number; // 1=Contribuinte, 2=Isento, 9=Não Contribuinte
}

export interface NFeItem {
  numero: number;
  codigo: string;
  descricao: string;
  ncm: string;
  cfop: string;
  unidade: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  origem: number; // 0=Nacional, 1=Estrangeira importação direta, etc.
  cst: string;
  csosn?: string; // Para Simples Nacional
  baseIcms: number;
  aliquotaIcms: number;
  valorIcms: number;
  basePis: number;
  aliquotaPis: number;
  valorPis: number;
  baseCofins: number;
  aliquotaCofins: number;
  valorCofins: number;
}

export interface NFeData {
  tipo: 'NFE' | 'NFCE';
  naturezaOperacao: string;
  tipoOperacao: number; // 0=Entrada, 1=Saída
  finalidade: number; // 1=Normal, 2=Complementar, 3=Ajuste, 4=Devolução
  presencaComprador: number; // 0=Não se aplica, 1=Presencial, 2=Não presencial
  emitente: NFeEmitente;
  destinatario: NFeDestinatario;
  itens: NFeItem[];
  valorProdutos: number;
  valorServicos?: number;
  valorFrete?: number;
  valorSeguro?: number;
  valorDesconto?: number;
  valorTotal: number;
  formaPagamento: {
    tipo: string; // 01=Dinheiro, 02=Cheque, 03=Cartão Crédito, 04=Cartão Débito, etc.
    valor: number;
    bandeira?: string;
    autorizacao?: string;
  }[];
  informacoesComplementares?: string;
}

// Mock NFE Provider - In production, integrate with real provider like Focus NFe, WebmaniaBR, etc.
class MockNFeProvider {
  async emitir(nfe: NFeData): Promise<{
    sucesso: boolean;
    chaveAcesso?: string;
    protocolo?: string;
    xml?: string;
    pdf?: string;
    mensagem?: string;
    erros?: string[];
  }> {
    // Simulate NF-e emission
    const chaveAcesso = this.generateChaveAcesso(nfe);
    const protocolo = this.generateProtocolo();

    console.log('📄 [MOCK] NF-e emitida:', {
      chave: chaveAcesso,
      protocolo,
      valor: nfe.valorTotal,
    });

    return {
      sucesso: true,
      chaveAcesso,
      protocolo,
      xml: `<?xml version="1.0"?><NFe>${chaveAcesso}</NFe>`,
      pdf: `data:application/pdf;base64,MOCK_PDF_BASE64`,
      mensagem: 'Autorizado o uso da NF-e',
    };
  }

  async cancelar(chaveAcesso: string, justificativa: string): Promise<{
    sucesso: boolean;
    protocolo?: string;
    mensagem?: string;
  }> {
    console.log('❌ [MOCK] NF-e cancelada:', chaveAcesso, justificativa);
    return {
      sucesso: true,
      protocolo: this.generateProtocolo(),
      mensagem: 'Cancelamento de NF-e homologado',
    };
  }

  async consultar(chaveAcesso: string): Promise<{
    sucesso: boolean;
    status?: string;
    mensagem?: string;
  }> {
    return {
      sucesso: true,
      status: 'authorized',
      mensagem: 'NF-e autorizada',
    };
  }

  private generateChaveAcesso(nfe: NFeData): string {
    const uf = '35'; // SP
    const dataEmissao = new Date().toISOString().slice(2, 4) + new Date().toISOString().slice(5, 7);
    const cnpj = nfe.emitente.cnpj.replace(/\D/g, '');
    const modelo = nfe.tipo === 'NFCE' ? '65' : '55';
    const serie = '001';
    const numero = String(Math.floor(Math.random() * 999999999)).padStart(9, '0');
    const tipoEmissao = '1';
    const codigoNumerico = String(Math.floor(Math.random() * 99999999)).padStart(8, '0');
    
    const chaveBase = `${uf}${dataEmissao}${cnpj}${modelo}${serie}${numero}${tipoEmissao}${codigoNumerico}`;
    const dv = this.calcularDigitoVerificador(chaveBase);
    
    return `${chaveBase}${dv}`;
  }

  private generateProtocolo(): string {
    const timestamp = Date.now().toString();
    return `135${timestamp.slice(-12)}`;
  }

  private calcularDigitoVerificador(chave: string): number {
    let peso = 2;
    let soma = 0;
    
    for (let i = chave.length - 1; i >= 0; i--) {
      soma += parseInt(chave[i]) * peso;
      peso = peso === 9 ? 2 : peso + 1;
    }
    
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  }
}

// Focus NFe Provider (production-ready integration)
class FocusNFeProvider {
  private apiUrl: string;
  private token: string;

  constructor() {
    this.apiUrl = process.env.FOCUS_NFE_URL || 'https://homologacao.focusnfe.com.br';
    this.token = process.env.FOCUS_NFE_TOKEN || '';
  }

  private getHeaders() {
    const auth = Buffer.from(`${this.token}:`).toString('base64');
    return {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json',
    };
  }

  async emitir(nfe: NFeData): Promise<any> {
    if (!this.token) {
      throw new Error('Focus NFe token not configured');
    }

    const endpoint = nfe.tipo === 'NFCE' ? '/v2/nfce' : '/v2/nfe';
    const payload = this.convertToFocusFormat(nfe);

    const response = await fetch(`${this.apiUrl}${endpoint}?ref=${Date.now()}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(payload),
    });

    return response.json();
  }

  private convertToFocusFormat(nfe: NFeData): any {
    // Convert internal format to Focus NFe API format
    return {
      natureza_operacao: nfe.naturezaOperacao,
      tipo_documento: nfe.tipoOperacao,
      local_destino: 1,
      finalidade_emissao: nfe.finalidade,
      consumidor_final: 1,
      presenca_comprador: nfe.presencaComprador,
      cnpj_emitente: nfe.emitente.cnpj,
      nome_destinatario: nfe.destinatario.nome,
      cpf_destinatario: nfe.destinatario.cpf,
      cnpj_destinatario: nfe.destinatario.cnpj,
      indicador_inscricao_estadual_destinatario: nfe.destinatario.indicadorIE,
      items: nfe.itens.map((item, index) => ({
        numero_item: index + 1,
        codigo_produto: item.codigo,
        descricao: item.descricao,
        codigo_ncm: item.ncm,
        cfop: item.cfop,
        unidade_comercial: item.unidade,
        quantidade_comercial: item.quantidade,
        valor_unitario_comercial: item.valorUnitario,
        valor_bruto: item.valorTotal,
        unidade_tributavel: item.unidade,
        quantidade_tributavel: item.quantidade,
        valor_unitario_tributavel: item.valorUnitario,
        origem: item.origem,
        icms_situacao_tributaria: item.csosn || item.cst,
      })),
      formas_pagamento: nfe.formaPagamento.map(fp => ({
        tipo_pagamento: fp.tipo,
        valor_pagamento: fp.valor,
        bandeira_operadora: fp.bandeira,
        numero_autorizacao: fp.autorizacao,
      })),
      informacoes_adicionais_contribuinte: nfe.informacoesComplementares,
    };
  }
}

// Main NF-e Service
class NFeService {
  private provider: MockNFeProvider | FocusNFeProvider;

  constructor() {
    // Use real provider if configured, otherwise mock
    if (process.env.FOCUS_NFE_TOKEN) {
      this.provider = new FocusNFeProvider();
    } else {
      this.provider = new MockNFeProvider();
      console.log('⚠️ Using mock NF-e provider. Configure FOCUS_NFE_TOKEN for production.');
    }
  }

  /**
   * Get fiscal configuration for a branch
   */
  async getFiscalConfig(branchId: string): Promise<any> {
    const result = await pool.query(
      `SELECT * FROM fiscal_config WHERE branch_id = $1 AND is_active = true`,
      [branchId]
    );
    return result.rows[0] || null;
  }

  /**
   * Save fiscal configuration
   */
  async saveFiscalConfig(branchId: string, config: any): Promise<any> {
    const existing = await this.getFiscalConfig(branchId);

    if (existing) {
      const result = await pool.query(
        `UPDATE fiscal_config SET
          cnpj = $2, inscricao_estadual = $3, inscricao_municipal = $4,
          regime_tributario = $5, crt = $6, ambiente = $7,
          serie_nfe = $8, serie_nfce = $9, csc_id = $10, csc_token = $11,
          updated_at = CURRENT_TIMESTAMP
        WHERE branch_id = $1 RETURNING *`,
        [
          branchId, config.cnpj, config.inscricaoEstadual, config.inscricaoMunicipal,
          config.regimeTributario, config.crt, config.ambiente,
          config.serieNfe, config.serieNfce, config.cscId, config.cscToken,
        ]
      );
      return result.rows[0];
    } else {
      const result = await pool.query(
        `INSERT INTO fiscal_config (
          branch_id, cnpj, inscricao_estadual, inscricao_municipal,
          regime_tributario, crt, ambiente, serie_nfe, serie_nfce, csc_id, csc_token
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
        [
          branchId, config.cnpj, config.inscricaoEstadual, config.inscricaoMunicipal,
          config.regimeTributario, config.crt, config.ambiente,
          config.serieNfe, config.serieNfce, config.cscId, config.cscToken,
        ]
      );
      return result.rows[0];
    }
  }

  /**
   * Generate next NF-e/NFC-e number
   */
  async getNextNumber(branchId: string, tipo: 'NFE' | 'NFCE'): Promise<{ serie: number; numero: number }> {
    const config = await this.getFiscalConfig(branchId);
    if (!config) {
      throw new Error('Fiscal configuration not found for this branch');
    }

    const serieField = tipo === 'NFCE' ? 'serie_nfce' : 'serie_nfe';
    const numeroField = tipo === 'NFCE' ? 'ultimo_numero_nfce' : 'ultimo_numero_nfe';

    // Increment and get new number
    const result = await pool.query(
      `UPDATE fiscal_config 
       SET ${numeroField} = ${numeroField} + 1, updated_at = CURRENT_TIMESTAMP
       WHERE branch_id = $1
       RETURNING ${serieField} as serie, ${numeroField} as numero`,
      [branchId]
    );

    return result.rows[0];
  }

  /**
   * Emit NF-e or NFC-e from an order
   */
  async emitirFromOrder(orderId: string, tipo: 'NFE' | 'NFCE' = 'NFCE'): Promise<any> {
    // Get order with customer and branch info
    const orderResult = await pool.query(
      `SELECT o.*, c.name as customer_name, c.email as customer_email, 
              c.phone as customer_phone, c.tax_id as customer_cpf,
              b.name as branch_name, b.address as branch_address,
              b.city as branch_city, b.state as branch_state, b.zip_code as branch_cep
       FROM orders o
       JOIN customers c ON c.id = o.customer_id
       JOIN branches b ON b.id = o.branch_id
       WHERE o.id = $1`,
      [orderId]
    );

    if (orderResult.rows.length === 0) {
      throw new Error('Order not found');
    }

    const order = orderResult.rows[0];

    // Get order items
    const itemsResult = await pool.query(
      `SELECT * FROM order_items WHERE order_id = $1`,
      [orderId]
    );

    // Get fiscal config
    const fiscalConfig = await this.getFiscalConfig(order.branch_id);
    if (!fiscalConfig) {
      throw new Error('Fiscal configuration not found');
    }

    // Get next number
    const { serie, numero } = await this.getNextNumber(order.branch_id, tipo);

    // Build NF-e data
    const nfeData: NFeData = {
      tipo,
      naturezaOperacao: 'VENDA DE SERVICOS',
      tipoOperacao: 1, // Saída
      finalidade: 1, // Normal
      presencaComprador: tipo === 'NFCE' ? 1 : 2, // Presencial for NFC-e
      emitente: {
        cnpj: fiscalConfig.cnpj,
        nome: order.branch_name,
        endereco: {
          logradouro: order.branch_address || '',
          numero: 'S/N',
          bairro: 'Centro',
          codigoMunicipio: '3550308', // São Paulo - default
          municipio: order.branch_city || 'São Paulo',
          uf: order.branch_state || 'SP',
          cep: (order.branch_cep || '').replace(/\D/g, ''),
          pais: 'Brasil',
          codigoPais: '1058',
        },
        ie: fiscalConfig.inscricao_estadual || 'ISENTO',
        im: fiscalConfig.inscricao_municipal,
        crt: fiscalConfig.crt || 1,
      },
      destinatario: {
        cpf: order.customer_cpf?.replace(/\D/g, ''),
        nome: order.customer_name,
        email: order.customer_email,
        telefone: order.customer_phone,
        indicadorIE: 9, // Não contribuinte
      },
      itens: itemsResult.rows.map((item, index) => ({
        numero: index + 1,
        codigo: item.id.slice(0, 20),
        descricao: item.service_name,
        ncm: '99971701', // Serviços de lavanderia
        cfop: '5933',
        unidade: 'UN',
        quantidade: item.quantity,
        valorUnitario: parseFloat(item.unit_price),
        valorTotal: parseFloat(item.subtotal),
        origem: 0,
        cst: fiscalConfig.crt === 1 ? '' : '00',
        csosn: fiscalConfig.crt === 1 ? '102' : undefined,
        baseIcms: 0,
        aliquotaIcms: 0,
        valorIcms: 0,
        basePis: 0,
        aliquotaPis: 0,
        valorPis: 0,
        baseCofins: 0,
        aliquotaCofins: 0,
        valorCofins: 0,
      })),
      valorProdutos: parseFloat(order.subtotal),
      valorDesconto: parseFloat(order.discount || 0),
      valorTotal: parseFloat(order.total),
      formaPagamento: [{
        tipo: this.mapPaymentMethod(order.payment_method),
        valor: parseFloat(order.total),
      }],
      informacoesComplementares: `Pedido: ${order.order_number}`,
    };

    // Emit via provider
    const resultado = await this.provider.emitir(nfeData);

    // Store in database
    const docResult = await pool.query(
      `INSERT INTO fiscal_documents (
        branch_id, order_id, customer_id, tipo, serie, numero,
        chave_acesso, protocolo_autorizacao, data_emissao, data_autorizacao,
        status, valor_total, valor_produtos, valor_desconto,
        xml_content, pdf_base64, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *`,
      [
        order.branch_id, orderId, order.customer_id, tipo, serie, numero,
        resultado.chaveAcesso, resultado.protocolo, new Date(),
        resultado.sucesso ? new Date() : null,
        resultado.sucesso ? 'authorized' : 'rejected',
        order.total, order.subtotal, order.discount || 0,
        resultado.xml, resultado.pdf, order.created_by,
      ]
    );

    // Store items
    for (const item of nfeData.itens) {
      await pool.query(
        `INSERT INTO fiscal_document_items (
          fiscal_document_id, numero_item, codigo_produto, descricao, ncm, cfop,
          unidade, quantidade, valor_unitario, valor_total
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          docResult.rows[0].id, item.numero, item.codigo, item.descricao,
          item.ncm, item.cfop, item.unidade, item.quantidade,
          item.valorUnitario, item.valorTotal,
        ]
      );
    }

    return {
      success: resultado.sucesso,
      document: docResult.rows[0],
      chaveAcesso: resultado.chaveAcesso,
      protocolo: resultado.protocolo,
      message: resultado.mensagem,
    };
  }

  /**
   * Cancel a fiscal document
   */
  async cancelar(documentId: string, justificativa: string, userId: string): Promise<any> {
    const docResult = await pool.query(
      `SELECT * FROM fiscal_documents WHERE id = $1`,
      [documentId]
    );

    if (docResult.rows.length === 0) {
      throw new Error('Fiscal document not found');
    }

    const doc = docResult.rows[0];

    if (doc.status !== 'authorized') {
      throw new Error('Only authorized documents can be cancelled');
    }

    if (!doc.chave_acesso) {
      throw new Error('Document has no access key');
    }

    const resultado = await this.provider.cancelar(doc.chave_acesso, justificativa);

    if (resultado.sucesso) {
      await pool.query(
        `UPDATE fiscal_documents 
         SET status = 'cancelled', motivo_cancelamento = $2, 
             cancelamento_protocolo = $3, cancelamento_data = CURRENT_TIMESTAMP,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $1`,
        [documentId, justificativa, resultado.protocolo]
      );
    }

    return resultado;
  }

  /**
   * Get fiscal documents
   */
  async getDocuments(params: {
    branchId?: string;
    orderId?: string;
    status?: string;
    tipo?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  }): Promise<{ documents: any[]; total: number }> {
    let query = `SELECT fd.*, c.name as customer_name, o.order_number
                 FROM fiscal_documents fd
                 LEFT JOIN customers c ON c.id = fd.customer_id
                 LEFT JOIN orders o ON o.id = fd.order_id
                 WHERE 1=1`;
    const queryParams: any[] = [];
    let paramIndex = 1;

    if (params.branchId) {
      query += ` AND fd.branch_id = $${paramIndex++}`;
      queryParams.push(params.branchId);
    }

    if (params.orderId) {
      query += ` AND fd.order_id = $${paramIndex++}`;
      queryParams.push(params.orderId);
    }

    if (params.status) {
      query += ` AND fd.status = $${paramIndex++}`;
      queryParams.push(params.status);
    }

    if (params.tipo) {
      query += ` AND fd.tipo = $${paramIndex++}`;
      queryParams.push(params.tipo);
    }

    if (params.startDate) {
      query += ` AND fd.data_emissao >= $${paramIndex++}`;
      queryParams.push(params.startDate);
    }

    if (params.endDate) {
      query += ` AND fd.data_emissao <= $${paramIndex++}`;
      queryParams.push(params.endDate);
    }

    // Count total
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM (${query}) as subquery`,
      queryParams
    );
    const total = parseInt(countResult.rows[0].count);

    // Add pagination
    query += ` ORDER BY fd.data_emissao DESC`;
    if (params.limit) {
      query += ` LIMIT $${paramIndex++}`;
      queryParams.push(params.limit);
    }
    if (params.offset) {
      query += ` OFFSET $${paramIndex++}`;
      queryParams.push(params.offset);
    }

    const result = await pool.query(query, queryParams);

    return { documents: result.rows, total };
  }

  private mapPaymentMethod(method: string): string {
    const mapping: Record<string, string> = {
      'cash': '01',
      'dinheiro': '01',
      'cheque': '02',
      'credit_card': '03',
      'cartao_credito': '03',
      'debit_card': '04',
      'cartao_debito': '04',
      'pix': '17',
      'boleto': '15',
      'outros': '99',
    };
    return mapping[method?.toLowerCase()] || '99';
  }
}

export const nfeService = new NFeService();
export default nfeService;
