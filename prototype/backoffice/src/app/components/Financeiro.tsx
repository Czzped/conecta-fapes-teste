import React from 'react';
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from './ui/card';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from './ui/table';
import { Badge } from './ui/badge';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { 
  DollarSign, ArrowUpRight, ArrowDownRight, FileText, Calendar, Filter, Search, RotateCcw, Upload
} from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';

const mockData = [
  { name: 'Jan', value: 45000 },
  { name: 'Fev', value: 52000 },
  { name: 'Mar', value: 48000 },
  { name: 'Abr', value: 61000 },
  { name: 'Mai', value: 55000 },
  { name: 'Jun', value: 67000 },
];

const transactions = [
  { id: '1', project: 'Estudo Bioma Mata Atlântica', value: 'R$ 12.500,00', status: 'Pago', date: '15/02/2026', category: 'Pesquisa', rubrica: 'Material de consumo', valorPassagemComprada: null, operacao: 'DEBITO', classificacao: 'DESPESA', origemTerceiro: null, transacaoEstornadaId: null, situacaoDebito: null, prestacaoAssociada: null, efeitoLiquido: null },
  { id: '2', project: 'Desenvolvimento Tech ES', value: 'R$ 45.000,00', status: 'Pendente', date: '18/02/2026', category: 'Inovação', rubrica: 'Serviços de terceiros', valorPassagemComprada: null, operacao: 'DEBITO', classificacao: 'DESPESA', origemTerceiro: null, transacaoEstornadaId: null, situacaoDebito: null, prestacaoAssociada: null, efeitoLiquido: null },
  { id: '3', project: 'Bolsas de Mestrado 2026/1', value: 'R$ 8.200,00', status: 'Pago', date: '10/02/2026', category: 'Bolsas', rubrica: 'Bolsas', valorPassagemComprada: null, operacao: 'DEBITO', classificacao: 'DESPESA', origemTerceiro: null, transacaoEstornadaId: null, situacaoDebito: null, prestacaoAssociada: null, efeitoLiquido: null },
  { id: '4', project: 'Equipamentos Lab Central', value: 'R$ 125.000,00', status: 'Atrasado', date: '05/02/2026', category: 'Infraestrutura', rubrica: 'Material permanente', valorPassagemComprada: null, operacao: 'DEBITO', classificacao: 'DESPESA', origemTerceiro: null, transacaoEstornadaId: null, situacaoDebito: null, prestacaoAssociada: null, efeitoLiquido: null },
  { id: '5', project: 'Publicação Científica Internacional', value: 'R$ 3.450,00', status: 'Pago', date: '01/02/2026', category: 'Difusão', rubrica: 'Passagens', valorPassagemComprada: 'R$ 3.450,00', operacao: 'DEBITO', classificacao: 'DESPESA', origemTerceiro: null, transacaoEstornadaId: null, situacaoDebito: null, prestacaoAssociada: null, efeitoLiquido: null },
  { id: '6', project: 'Conecta Fapes', value: 'R$ 1.280,00', status: 'Pendente', date: '21/02/2026', category: 'Passagem', rubrica: 'Passagens', valorPassagemComprada: 'R$ 1.280,00', operacao: 'DEBITO', classificacao: 'DESPESA', origemTerceiro: null, transacaoEstornadaId: null, situacaoDebito: null, prestacaoAssociada: null, efeitoLiquido: null },
  { id: '7', project: 'Conecta Fapes', value: 'R$ 1.250,00', status: 'Classificado', date: '24/02/2026', category: 'Crédito de terceiro', rubrica: '—', valorPassagemComprada: null, operacao: 'CREDITO', classificacao: 'ESTORNO', origemTerceiro: 'Fornecedor Alfa', transacaoEstornadaId: 'TR-2026-041', situacaoDebito: 'Sem prestação de contas', prestacaoAssociada: 'PC-2026-013', modoAssociacao: 'Ajuste pós-prestação', efeitoLiquido: 'R$ 0,00' },
  { id: '8', project: 'Conecta Fapes', value: 'R$ 400,00', status: 'Comprovar', date: '24/02/2026', category: 'Devolução do coordenador', rubrica: 'Material de consumo', valorPassagemComprada: null, operacao: 'CREDITO', classificacao: 'DEVOLUCAO', origemTerceiro: 'Coordenador do projeto', transacaoEstornadaId: 'TR-2026-045', situacaoDebito: 'Parcialmente devolvido', prestacaoAssociada: 'PC-2026-013', modoAssociacao: 'Ajuste conciliatório', efeitoLiquido: 'R$ 850,00', valorOriginal: 'R$ 1.250,00', valorDevolvido: 'R$ 400,00', valorResidual: 'R$ 850,00', comprovante: 'Pix obrigatório' },
];

export const Financeiro: React.FC = () => {
  const estornos = transactions.filter((t) => t.classificacao === 'ESTORNO');
  const devolucoes = transactions.filter((t) => t.classificacao === 'DEVOLUCAO');

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gestão Financeira</h2>
          <p className="text-muted-foreground">Monitore o fluxo de recursos e pagamentos de editais.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" /> Filtros
          </Button>
          <Button size="sm" className="bg-primary hover:bg-primary/90">
            Novo Repasse
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orçamento Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 12.450.000</div>
            <p className="text-xs text-muted-foreground">+2.1% em relação ao ano anterior</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Empenhado</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 8.120.400</div>
            <div className="mt-2 h-2 w-full bg-secondary rounded-full overflow-hidden">
               <div className="h-full bg-primary" style={{ width: '65%' }}></div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">65% do orçamento utilizado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagamentos Hoje</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 45.200</div>
            <p className="text-xs text-muted-foreground">12 ordens de pagamento</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-destructive-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-destructive-foreground font-medium">Pendências críticas</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Prestações de Passagens</CardTitle>
          <CardDescription>Passagens devem ser salvas com valor comprado e rubrica de passagem associada.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {transactions.filter((t) => t.rubrica === 'Passagens').map((t) => (
              <div key={t.id} className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{t.project}</p>
                    <p className="text-xs text-muted-foreground mt-1">{t.date} • Rubrica: {t.rubrica}</p>
                  </div>
                  <Badge variant={t.status === 'Pago' ? 'default' : 'outline'} className={t.status === 'Pago' ? 'bg-primary text-white' : ''}>
                    {t.status}
                  </Badge>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-md bg-muted/60 p-3">
                    <p className="text-xs text-muted-foreground">Valor da passagem comprada</p>
                    <p className="text-lg font-bold">{t.valorPassagemComprada}</p>
                  </div>
                  <div className="rounded-md bg-muted/60 p-3">
                    <p className="text-xs text-muted-foreground">Transação financeira</p>
                    <p className="text-lg font-bold">{t.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Estornos de Terceiros</CardTitle>
          <CardDescription>Créditos que anulam débitos anteriores e podem ser associados a prestações já feitas como ajuste conciliatório.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {estornos.map((t) => (
              <div key={t.id} className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="size-10 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                      <RotateCcw className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{t.project}</p>
                      <p className="text-xs text-muted-foreground mt-1">{t.date} • Origem: {t.origemTerceiro}</p>
                    </div>
                  </div>
                  <Badge className="bg-primary text-white">{t.classificacao}</Badge>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-md bg-muted/60 p-3">
                    <p className="text-xs text-muted-foreground">Crédito recebido</p>
                    <p className="text-lg font-bold text-primary">{t.value}</p>
                  </div>
                  <div className="rounded-md bg-muted/60 p-3">
                    <p className="text-xs text-muted-foreground">Débito estornado</p>
                    <p className="text-lg font-bold">{t.transacaoEstornadaId}</p>
                  </div>
                  <div className="rounded-md bg-muted/60 p-3">
                    <p className="text-xs text-muted-foreground">Operação</p>
                    <p className="text-sm font-semibold">{t.operacao}</p>
                  </div>
                  <div className="rounded-md bg-muted/60 p-3">
                    <p className="text-xs text-muted-foreground">Situação do débito</p>
                    <p className="text-sm font-semibold">{t.situacaoDebito}</p>
                  </div>
                  <div className="rounded-md bg-muted/60 p-3">
                    <p className="text-xs text-muted-foreground">Prestação associada</p>
                    <p className="text-sm font-semibold">{t.prestacaoAssociada}</p>
                  </div>
                  <div className="rounded-md bg-muted/60 p-3">
                    <p className="text-xs text-muted-foreground">Modo</p>
                    <p className="text-sm font-semibold">{t.modoAssociacao}</p>
                  </div>
                  <div className="rounded-md bg-muted/60 p-3">
                    <p className="text-xs text-muted-foreground">Efeito líquido</p>
                    <p className="text-sm font-semibold">{t.efeitoLiquido}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Devoluções do Coordenador</CardTitle>
          <CardDescription>Créditos devolvidos pelo coordenador exigem comprovante obrigatório e podem regularizar compras de forma parcial ou integral.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {devolucoes.map((t) => (
              <div key={t.id} className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="size-10 rounded-md bg-amber-500/10 flex items-center justify-center shrink-0">
                      <Upload className="h-5 w-5 text-amber-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{t.project}</p>
                      <p className="text-xs text-muted-foreground mt-1">{t.date} • Origem: {t.origemTerceiro}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-amber-500/40 text-amber-500">{t.classificacao}</Badge>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-md bg-muted/60 p-3">
                    <p className="text-xs text-muted-foreground">Valor original</p>
                    <p className="text-lg font-bold">{t.valorOriginal}</p>
                  </div>
                  <div className="rounded-md bg-muted/60 p-3">
                    <p className="text-xs text-muted-foreground">Valor devolvido</p>
                    <p className="text-lg font-bold text-primary">{t.valorDevolvido}</p>
                  </div>
                  <div className="rounded-md bg-muted/60 p-3">
                    <p className="text-xs text-muted-foreground">Saldo residual</p>
                    <p className="text-sm font-semibold">{t.valorResidual}</p>
                  </div>
                  <div className="rounded-md bg-muted/60 p-3">
                    <p className="text-xs text-muted-foreground">Compra/debito</p>
                    <p className="text-sm font-semibold">{t.transacaoEstornadaId}</p>
                  </div>
                  <div className="rounded-md bg-muted/60 p-3">
                    <p className="text-xs text-muted-foreground">Prestação associada</p>
                    <p className="text-sm font-semibold">{t.prestacaoAssociada}</p>
                  </div>
                  <div className="rounded-md bg-muted/60 p-3">
                    <p className="text-xs text-muted-foreground">Comprovante</p>
                    <p className="text-sm font-semibold text-amber-500">{t.comprovante}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Chart */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Evolução de Gastos</CardTitle>
            <CardDescription>Repasses mensais realizados no primeiro semestre de 2026.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] pl-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value/1000}k`} />
                <Tooltip 
                  cursor={{fill: 'rgba(0, 193, 106, 0.1)'}}
                  contentStyle={{ borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {mockData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === mockData.length - 1 ? 'var(--primary)' : 'var(--primary-foreground)'} style={{ fill: index === mockData.length - 1 ? 'var(--primary)' : 'rgba(0, 193, 106, 0.4)' }} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent actions */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Fluxo Recente</CardTitle>
            <CardDescription>Últimas movimentações financeiras.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.slice(0, 4).map((t) => (
                <div key={t.id} className="flex items-center gap-4 border-b border-border pb-3 last:border-0 last:pb-0">
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-none truncate">{t.project}</p>
                    <p className="text-xs text-muted-foreground mt-1">{t.date} • {t.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{t.value}</p>
                    <p className={`text-[10px] font-bold uppercase mt-1 ${
                      t.status === 'Pago' ? 'text-primary' : t.status === 'Pendente' ? 'text-orange-500' : 'text-destructive-foreground'
                    }`}>{t.status}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4 text-xs">Ver extrato completo</Button>
          </CardContent>
        </Card>
      </div>

      {/* Main Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Listagem de Repasses</CardTitle>
            <CardDescription>Gerencie e acompanhe todos os repasses financeiros ativos.</CardDescription>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar projeto..." className="pl-8 h-9" />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Projeto</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Operação</TableHead>
                <TableHead>Classificação</TableHead>
                <TableHead>Rubrica</TableHead>
                <TableHead>Valor da Passagem</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.project}</TableCell>
                  <TableCell>{t.category}</TableCell>
                  <TableCell>
                    <span className={t.operacao === 'CREDITO' ? 'text-primary font-semibold' : ''}>{t.operacao}</span>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Badge
                        variant={t.classificacao === 'ESTORNO' ? 'default' : 'outline'}
                        className={
                          t.classificacao === 'ESTORNO'
                            ? 'bg-primary text-white'
                            : t.classificacao === 'DEVOLUCAO'
                              ? 'border-amber-500/40 text-amber-500'
                              : ''
                        }
                      >
                        {t.classificacao}
                      </Badge>
                      {t.classificacao === 'ESTORNO' && (
                        <p className="text-xs text-muted-foreground">Estorna {t.transacaoEstornadaId} • {t.prestacaoAssociada}</p>
                      )}
                      {t.classificacao === 'DEVOLUCAO' && (
                        <p className="text-xs text-muted-foreground">Devolve {t.valorDevolvido} • residual {t.valorResidual}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{t.rubrica}</TableCell>
                  <TableCell>{t.valorPassagemComprada ?? '—'}</TableCell>
                  <TableCell>{t.date}</TableCell>
                  <TableCell>{t.value}</TableCell>
                  <TableCell>
                    <Badge variant={t.status === 'Pago' ? 'default' : t.status === 'Pendente' ? 'outline' : 'destructive'} className={t.status === 'Pago' ? 'bg-primary text-white' : ''}>
                      {t.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Detalhes</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
