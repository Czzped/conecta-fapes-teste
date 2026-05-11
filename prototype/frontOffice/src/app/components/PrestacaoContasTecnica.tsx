import { FileText, Paperclip, Send } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Dropdown } from '@/app/components/Dropdown';
import { useState } from 'react';

interface PrestacaoContasTecnicaProps {
  onBack?: () => void;
}

export function PrestacaoContasTecnica({ onBack }: PrestacaoContasTecnicaProps) {
  const { t } = useLanguage();
  const [selectedObjective, setSelectedObjective] = useState('');
  return (
    <div 
      className="w-full px-4 md:px-8 py-8"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div 
          className="p-2 transition-colors"
          style={{
            color: 'var(--primary)',
            borderRadius: 'var(--radius)',
            backgroundColor: 'rgba(8, 145, 178, 0.1)',
          }}
        >
          <FileText size={20} />
        </div>
        <h1 style={{ color: 'var(--foreground)', margin: 0 }}>
          Prestação de Contas Técnica
        </h1>
      </div>

      {/* Subtitle */}
      <p 
        className="mb-6"
        style={{ 
          color: 'var(--muted-foreground)',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--font-weight-normal)',
          marginLeft: 'calc(32px + 0.75rem)', // Aligns with title (icon size + gap)
        }}
      >
        Este relatório técnico deve informar os resultados do projeto, metas alcançadas e atividades cumpridas.
      </p>

      {/* Divider */}
      <div 
        className="mb-8"
        style={{
          height: '1px',
          backgroundColor: 'var(--border)',
        }}
      />

      {/* Form */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Palavras-chave */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label 
            style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-normal)',
              color: 'var(--foreground)',
            }}
          >
            Palavras-chave <span style={{ color: '#fb2c36' }}>*</span>
          </label>
          <p 
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--muted-foreground)',
              marginBottom: '0.25rem',
            }}
          >
            Indique de três a cinco palavras-chave que identificam a pesquisa
          </p>
          <input
            type="text"
            placeholder="Ex: Educação, Tecnologia, Inovação"
            style={{
              backgroundColor: 'var(--input)',
              color: 'var(--foreground)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '0.5rem 0.75rem',
              fontSize: 'var(--text-sm)',
              outline: 'none',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--primary)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
            }}
          />
        </div>

        {/* Resumo para Publicação */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label 
            style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-normal)',
              color: 'var(--foreground)',
            }}
          >
            Resumo para Publicação no site da Fapes <span style={{ color: '#fb2c36' }}>*</span>
          </label>
          <p 
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--muted-foreground)',
              marginBottom: '0.25rem',
            }}
          >
            Descreva de forma objetiva, com mínimo de 250 e máximo de 500 palavras.
          </p>
          <textarea
            placeholder="Digite aqui"
            rows={6}
            style={{
              backgroundColor: 'var(--input)',
              color: 'var(--foreground)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '0.5rem 0.75rem',
              fontSize: 'var(--text-sm)',
              outline: 'none',
              resize: 'vertical',
              fontFamily: 'inherit',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--primary)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
            }}
          />
          <p 
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--muted-foreground)',
            }}
          >
            Máximo de 500 palavras (0/500)
          </p>
        </div>

        {/* Descrição do Projeto */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h2 
            style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-normal)',
              color: 'var(--foreground)',
            }}
          >
            Descrição do Projeto <span style={{ color: '#fb2c36' }}>*</span>
          </h2>

          {/* Introdução */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label 
              style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-normal)',
                color: 'var(--foreground)',
              }}
            >
              Introdução
            </label>
            <textarea
              placeholder="Digite aqui"
              rows={6}
              style={{
                backgroundColor: 'var(--input)',
                color: 'var(--foreground)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                padding: '0.5rem 0.75rem',
                fontSize: 'var(--text-sm)',
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'inherit',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)';
              }}
            />
            <p 
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--muted-foreground)',
              }}
            >
              Máximo de 2.000 palavras (0/2000)
            </p>
          </div>

          {/* Objetivos Propostos */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label 
              style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-normal)',
                color: 'var(--foreground)',
              }}
            >
              Objetivos Propostos
            </label>
            <textarea
              placeholder="Digite aqui"
              rows={6}
              style={{
                backgroundColor: 'var(--input)',
                color: 'var(--foreground)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                padding: '0.5rem 0.75rem',
                fontSize: 'var(--text-sm)',
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'inherit',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)';
              }}
            />
            <p 
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--muted-foreground)',
              }}
            >
              Máximo de 500 palavras (0/500)
            </p>
          </div>

          {/* Metodologia */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label 
              style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-normal)',
                color: 'var(--foreground)',
              }}
            >
              Metodologia
            </label>
            <textarea
              placeholder="Digite aqui"
              rows={6}
              style={{
                backgroundColor: 'var(--input)',
                color: 'var(--foreground)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                padding: '0.5rem 0.75rem',
                fontSize: 'var(--text-sm)',
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'inherit',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)';
              }}
            />
            <p 
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--muted-foreground)',
              }}
            >
              Máximo de 500 palavras (0/500)
            </p>
          </div>
        </div>

        {/* Objetivos Alcançados */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h2 
            style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-normal)',
              color: 'var(--foreground)',
            }}
          >
            Objetivos Alcançados
          </h2>

          {/* Select - Objetivos atingidos */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label 
              style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-normal)',
                color: 'var(--foreground)',
                marginBottom: '0.5rem',
                display: 'block',
              }}
            >
              Até o momento, os objetivos da pesquisa foram atingidos?
            </label>
            <Dropdown
              value={selectedObjective}
              onChange={setSelectedObjective}
              options={[
                { value: '', label: 'Selecione uma opção' },
                { value: 'sim-totalmente', label: 'Sim, totalmente' },
                { value: 'sim-parcialmente', label: 'Sim, parcialmente' },
                { value: 'nao', label: 'Não' },
              ]}
              placeholder="Selecione uma opção"
            />
          </div>

          {/* Justifique */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label 
              style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-normal)',
                color: 'var(--foreground)',
              }}
            >
              Justifique
            </label>
            <textarea
              placeholder="Digite aqui"
              rows={6}
              style={{
                backgroundColor: 'var(--input)',
                color: 'var(--foreground)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                padding: '0.5rem 0.75rem',
                fontSize: 'var(--text-sm)',
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'inherit',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)';
              }}
            />
            <p 
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--muted-foreground)',
              }}
            >
              Máximo de 250 palavras (0/250)
            </p>
          </div>
        </div>

        {/* Divider */}
        <div 
          style={{
            height: '1px',
            backgroundColor: 'var(--border)',
          }}
        />

        {/* Parcerias Institucionais */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h2 
            style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-normal)',
              color: 'var(--foreground)',
            }}
          >
            Parcerias Institucionais
          </h2>

          <p 
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--muted-foreground)',
            }}
          >
            Indicar as instituições de P&D, empresas, órgãos públicos e não governamentais ou sociedade civil que foram parceiras durante a execução da pesquisa, mostrando articulação institucional vivenciada pela pesquisa.
          </p>

          <textarea
            placeholder="Digite aqui"
            rows={6}
            style={{
              backgroundColor: 'var(--input)',
              color: 'var(--foreground)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '0.5rem 0.75rem',
              fontSize: 'var(--text-sm)',
              outline: 'none',
              resize: 'vertical',
              fontFamily: 'inherit',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--primary)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
            }}
          />
          <p 
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--muted-foreground)',
            }}
          >
            0/500 palavras
          </p>
        </div>

        {/* Dificuldades encontradas e sugestões */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label 
            style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-normal)',
              color: 'var(--foreground)',
            }}
          >
            Dificuldades encontradas e sugestões <span style={{ color: '#fb2c36' }}>*</span>
          </label>
          <p 
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--muted-foreground)',
              marginBottom: '0.25rem',
            }}
          >
            Descreva dificuldades de caráter técnico-científico, financeiro, administrativo e gerencial, enfrentadas durante a realização da pesquisa.
          </p>
          <textarea
            placeholder="Digite aqui"
            rows={6}
            style={{
              backgroundColor: 'var(--input)',
              color: 'var(--foreground)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '0.5rem 0.75rem',
              fontSize: 'var(--text-sm)',
              outline: 'none',
              resize: 'vertical',
              fontFamily: 'inherit',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--primary)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
            }}
          />
          <p 
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--muted-foreground)',
            }}
          >
            0/250 palavras
          </p>
        </div>

        {/* Conclusões e Perspectivas */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label 
            style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-normal)',
              color: 'var(--foreground)',
            }}
          >
            Conclusões e Perspectivas <span style={{ color: '#fb2c36' }}>*</span>
          </label>
          <p 
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--muted-foreground)',
              marginBottom: '0.25rem',
            }}
          >
            Descreva as conclusões do projeto e apresente perspectivas de trabalhos futuros que poderão ser financiados.
          </p>
          <textarea
            placeholder="Digite aqui"
            rows={6}
            style={{
              backgroundColor: 'var(--input)',
              color: 'var(--foreground)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '0.5rem 0.75rem',
              fontSize: 'var(--text-sm)',
              outline: 'none',
              resize: 'vertical',
              fontFamily: 'inherit',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--primary)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
            }}
          />
          <p 
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--muted-foreground)',
            }}
          >
            0/1000 palavras
          </p>
        </div>

        {/* Divider */}
        <div 
          style={{
            height: '1px',
            backgroundColor: 'var(--border)',
          }}
        />

        {/* Avaliação Geral */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h2 
            style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-normal)',
              color: 'var(--foreground)',
            }}
          >
            Avaliação Geral <span style={{ color: '#fb2c36' }}>*</span>
          </h2>

          {/* Questão 1 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label 
              style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-normal)',
                color: 'var(--foreground)',
              }}
            >
              O resultado do projeto tem inovação tecnológica?
            </label>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="inovacao-tecnologica"
                  value="sim"
                  style={{
                    accentColor: 'var(--primary)',
                    cursor: 'pointer',
                  }}
                />
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>Sim</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="inovacao-tecnologica"
                  value="nao"
                  style={{
                    accentColor: 'var(--primary)',
                    cursor: 'pointer',
                  }}
                />
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>Não</span>
              </label>
            </div>
          </div>

          {/* Questão 2 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label 
              style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-normal)',
                color: 'var(--foreground)',
              }}
            >
              O resultado do projeto (tecnologia gerada) pode ser repassado a terceiros?
            </label>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="repassado-terceiros"
                  value="sim"
                  style={{
                    accentColor: 'var(--primary)',
                    cursor: 'pointer',
                  }}
                />
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>Sim</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="repassado-terceiros"
                  value="nao"
                  style={{
                    accentColor: 'var(--primary)',
                    cursor: 'pointer',
                  }}
                />
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>Não</span>
              </label>
            </div>
          </div>

          {/* Questão 3 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label 
              style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-normal)',
                color: 'var(--foreground)',
              }}
            >
              O resultado do projeto é passível de proteção (patentes, cultivares, direitos autorais ou softwares)?
            </label>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="protecao"
                  value="sim"
                  style={{
                    accentColor: 'var(--primary)',
                    cursor: 'pointer',
                  }}
                />
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>Sim</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="protecao"
                  value="nao"
                  style={{
                    accentColor: 'var(--primary)',
                    cursor: 'pointer',
                  }}
                />
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>Não</span>
              </label>
            </div>
          </div>

          {/* Questão 4 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label 
              style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-normal)',
                color: 'var(--foreground)',
              }}
            >
              Houve relação de pesquisa com atividades de ensino e de extensão na sua instituição (Ensino, Pesquisa e Extensão)?
            </label>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="ensino-pesquisa-extensao"
                  value="sim"
                  style={{
                    accentColor: 'var(--primary)',
                    cursor: 'pointer',
                  }}
                />
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>Sim</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="ensino-pesquisa-extensao"
                  value="nao"
                  style={{
                    accentColor: 'var(--primary)',
                    cursor: 'pointer',
                  }}
                />
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>Não</span>
              </label>
            </div>
          </div>

          {/* Questão 5 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label 
              style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-normal)',
                color: 'var(--foreground)',
              }}
            >
              Houve durante a execução da pesquisa momentos de interação e integração com a sociedade civil?
            </label>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="sociedade-civil"
                  value="sim"
                  style={{
                    accentColor: 'var(--primary)',
                    cursor: 'pointer',
                  }}
                />
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>Sim</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="sociedade-civil"
                  value="nao"
                  style={{
                    accentColor: 'var(--primary)',
                    cursor: 'pointer',
                  }}
                />
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>Não</span>
              </label>
            </div>
          </div>
        </div>

        {/* Público-alvo */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label 
            style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-normal)',
              color: 'var(--foreground)',
            }}
          >
            Descreva o público-alvo que pode se beneficiar com os resultados da pesquisa.
          </label>
          <textarea
            placeholder="Digite aqui"
            rows={6}
            style={{
              backgroundColor: 'var(--input)',
              color: 'var(--foreground)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '0.5rem 0.75rem',
              fontSize: 'var(--text-sm)',
              outline: 'none',
              resize: 'vertical',
              fontFamily: 'inherit',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--primary)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
            }}
          />
          <p 
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--muted-foreground)',
            }}
          >
            0/500 palavras
          </p>
        </div>

        {/* Número estimado de pessoas */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label 
            style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-normal)',
              color: 'var(--foreground)',
            }}
          >
            Qual o número estimado de pessoas que podem se beneficiar com os resultados da pesquisa?
          </label>
          <input
            type="text"
            placeholder="000000"
            style={{
              backgroundColor: 'var(--input)',
              color: 'var(--foreground)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '0.5rem 0.75rem',
              fontSize: 'var(--text-sm)',
              outline: 'none',
              maxWidth: '200px',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--primary)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
            }}
          />
        </div>

        {/* Divider */}
        <div 
          style={{
            height: '1px',
            backgroundColor: 'var(--border)',
          }}
        />

        {/* Inclusão de Arquivos */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <h2 
            style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-normal)',
              color: 'var(--foreground)',
              marginBottom: '0.25rem',
            }}
          >
            Inclusão de Arquivos
          </h2>
          <p 
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--muted-foreground)',
              marginBottom: '0.5rem',
            }}
          >
            Incluir documentos ou imagens relevantes para documentar o projeto
          </p>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'transparent',
              color: 'var(--foreground)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '0.5rem 1rem',
              fontSize: 'var(--text-sm)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              alignSelf: 'flex-end',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--primary)';
              e.currentTarget.style.backgroundColor = 'rgba(8, 145, 178, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <Paperclip size={16} />
            Anexar Comprovação
          </button>
        </div>

        {/* Divider */}
        <div 
          style={{
            height: '1px',
            backgroundColor: 'var(--border)',
          }}
        />

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'transparent',
              color: 'var(--primary)',
              border: '1px solid var(--primary)',
              borderRadius: 'var(--radius)',
              padding: '0.5rem 1.5rem',
              fontSize: 'var(--text-sm)',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(8, 145, 178, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            Salvar Rascunho
          </button>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'var(--primary)',
              color: '#0a0e27',
              border: 'none',
              borderRadius: 'var(--radius)',
              padding: '0.5rem 1.5rem',
              fontSize: 'var(--text-sm)',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            <Send size={16} />
            Enviar
          </button>
        </div>

      </div>
    </div>
  );
}