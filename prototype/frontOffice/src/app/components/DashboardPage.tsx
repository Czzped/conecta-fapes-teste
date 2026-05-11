import { BarChart3, FolderKanban, Users, DollarSign, UserCheck, ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';

export function DashboardPage() {
  const projectsChartRef = useRef<HTMLDivElement>(null);
  const budgetChartRef = useRef<HTMLDivElement>(null);
  const scholarsChartRef = useRef<HTMLDivElement>(null);
  const equipmentChartRef = useRef<HTMLDivElement>(null);
  const fapesChartRef = useRef<HTMLDivElement>(null);
  const [cnpqLevel, setCnpqLevel] = useState('Nível 3');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateCharts = () => {
      // Get CSS variable values
      const rootStyles = getComputedStyle(document.documentElement);
      const foregroundColor = rootStyles.getPropertyValue('--foreground').trim();
      const cardColor = rootStyles.getPropertyValue('--card').trim();
      const borderColor = rootStyles.getPropertyValue('--border').trim();
      const mutedForegroundColor = rootStyles.getPropertyValue('--muted-foreground').trim();

      // Projects by Area Chart
      if (projectsChartRef.current) {
        const existingChart = echarts.getInstanceByDom(projectsChartRef.current);
        const projectsChart = existingChart || echarts.init(projectsChartRef.current);
        const projectsOption = {
          backgroundColor: 'transparent',
          tooltip: {
            trigger: 'item',
            backgroundColor: cardColor,
            borderColor: borderColor,
            textStyle: {
              color: foregroundColor,
              fontFamily: 'Poppins, sans-serif',
            },
          },
          legend: {
            bottom: '5%',
            left: 'center',
            orient: 'horizontal',
            itemGap: 15,
            itemWidth: 16,
            itemHeight: 16,
            textStyle: {
              color: foregroundColor,
              fontFamily: 'Poppins, sans-serif',
              fontSize: 12,
            },
          },
          series: [
            {
              name: 'Projetos por Área',
              type: 'pie',
              radius: ['40%', '55%'],
              center: ['50%', '40%'],
              avoidLabelOverlap: false,
              label: {
                show: false,
                position: 'center',
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: foregroundColor,
                  fontFamily: 'Poppins, sans-serif',
                },
              },
              labelLine: {
                show: false,
              },
              data: [
                { value: 1048, name: 'Sistemas de Computação', itemStyle: { color: '#0891b2' } },
                { value: 735, name: 'Telecomunicações', itemStyle: { color: '#06b6d4' } },
                { value: 580, name: 'Matemática Aplicada', itemStyle: { color: '#0891b2' } },
                { value: 484, name: 'Saneamento Ambiental', itemStyle: { color: '#0e7490' } },
                { value: 300, name: 'Estatística', itemStyle: { color: '#155e75' } },
              ],
            },
          ],
        };
        projectsChart.setOption(projectsOption);
      }

      // Budget Evolution Chart
      if (budgetChartRef.current) {
        const existingChart = echarts.getInstanceByDom(budgetChartRef.current);
        const budgetChart = existingChart || echarts.init(budgetChartRef.current);
        const budgetOption = {
          backgroundColor: 'transparent',
          tooltip: {
            trigger: 'axis',
            backgroundColor: cardColor,
            borderColor: borderColor,
            textStyle: {
              color: foregroundColor,
              fontFamily: 'Poppins, sans-serif',
            },
          },
          legend: {
            data: ['Orçamento Aprovado', 'Orçamento Executado'],
            bottom: '0%',
            left: 'center',
            textStyle: {
              color: foregroundColor,
              fontFamily: 'Poppins, sans-serif',
            },
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '12%',
            top: '3%',
            containLabel: true,
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
            axisLine: {
              lineStyle: {
                color: borderColor,
              },
            },
            axisLabel: {
              color: mutedForegroundColor,
              fontFamily: 'Poppins, sans-serif',
            },
          },
          yAxis: {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: borderColor,
              },
            },
            axisLabel: {
              color: mutedForegroundColor,
              fontFamily: 'Poppins, sans-serif',
              formatter: 'R$ {value}k',
            },
            splitLine: {
              lineStyle: {
                color: borderColor,
              },
            },
          },
          series: [
            {
              name: 'Orçamento Aprovado',
              type: 'line',
              data: [120, 132, 101, 134, 90, 230, 210, 182, 191, 234, 290, 330],
              smooth: true,
              itemStyle: {
                color: '#0891b2',
              },
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: 'rgba(8, 145, 178, 0.3)',
                  },
                  {
                    offset: 1,
                    color: 'rgba(8, 145, 178, 0.0)',
                  },
                ]),
              },
            },
            {
              name: 'Orçamento Executado',
              type: 'line',
              data: [45, 52, 38, 58, 35, 98, 85, 72, 78, 95, 115, 128],
              smooth: true,
              itemStyle: {
                color: '#0891b2',
              },
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: 'rgba(8, 145, 178, 0.3)',
                  },
                  {
                    offset: 1,
                    color: 'rgba(8, 145, 178, 0.0)',
                  },
                ]),
              },
            },
          ],
        };
        budgetChart.setOption(budgetOption);
      }

      // Scholars by Type Chart
      if (scholarsChartRef.current) {
        const existingChart = echarts.getInstanceByDom(scholarsChartRef.current);
        const scholarsChart = existingChart || echarts.init(scholarsChartRef.current);
        const scholarsOption = {
          backgroundColor: 'transparent',
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
            },
            backgroundColor: cardColor,
            borderColor: borderColor,
            textStyle: {
              color: foregroundColor,
              fontFamily: 'Poppins, sans-serif',
            },
          },
          legend: {
            show: false,
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: '0%',
            containLabel: true,
          },
          xAxis: {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: borderColor,
              },
            },
            axisLabel: {
              color: mutedForegroundColor,
              fontFamily: 'Poppins, sans-serif',
            },
            splitLine: {
              lineStyle: {
                color: borderColor,
              },
            },
          },
          yAxis: {
            type: 'category',
            data: ['BPIG-I', 'BPIG-II', 'BPIG-III', 'BPIG-IV', 'BPIG-V', 'IC', 'Mestrado', 'Doutorado'],
            axisLine: {
              lineStyle: {
                color: borderColor,
              },
            },
            axisLabel: {
              color: mutedForegroundColor,
              fontFamily: 'Poppins, sans-serif',
            },
          },
          series: [
            {
              name: 'Bolsistas',
              type: 'bar',
              data: [145, 198, 167, 132, 156, 320, 180, 150],
              barWidth: '40%',
              itemStyle: {
                color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                  { offset: 0, color: '#0891b2' },
                  { offset: 1, color: '#0891b2' },
                ]),
                borderRadius: [0, 8, 8, 0],
              },
              emphasis: {
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                    { offset: 0, color: '#06b6d4' },
                    { offset: 1, color: '#0e7490' },
                  ]),
                },
              },
            },
          ],
        };
        scholarsChart.setOption(scholarsOption);
      }

      // Equipment by Type Chart
      if (equipmentChartRef.current) {
        const existingChart = echarts.getInstanceByDom(equipmentChartRef.current);
        const equipmentChart = existingChart || echarts.init(equipmentChartRef.current);
        const equipmentOption = {
          backgroundColor: 'transparent',
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
            },
            backgroundColor: cardColor,
            borderColor: borderColor,
            textStyle: {
              color: foregroundColor,
              fontFamily: 'Poppins, sans-serif',
            },
          },
          legend: {
            show: false,
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: '0%',
            containLabel: true,
          },
          xAxis: {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: borderColor,
              },
            },
            axisLabel: {
              color: mutedForegroundColor,
              fontFamily: 'Poppins, sans-serif',
            },
            splitLine: {
              lineStyle: {
                color: borderColor,
              },
            },
          },
          yAxis: {
            type: 'category',
            data: ['Notebook', 'Projetor', 'Ar Condicionado', 'Monitor', 'Impressora', 'Servidor', 'Tablet', 'Celular', 'Microscópio', 'Câmera'],
            axisLine: {
              lineStyle: {
                color: borderColor,
              },
            },
            axisLabel: {
              color: mutedForegroundColor,
              fontFamily: 'Poppins, sans-serif',
            },
          },
          series: [
            {
              name: 'Material Permanente',
              type: 'bar',
              data: [245, 89, 56, 198, 112, 34, 145, 167, 78, 92],
              barWidth: '40%',
              itemStyle: {
                color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                  { offset: 0, color: '#0891b2' },
                  { offset: 1, color: '#0891b2' },
                ]),
                borderRadius: [0, 8, 8, 0],
              },
              emphasis: {
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                    { offset: 0, color: '#06b6d4' },
                    { offset: 1, color: '#0e7490' },
                  ]),
                },
              },
            },
          ],
        };
        equipmentChart.setOption(equipmentOption);
      }

      // Fapes Chart
      if (fapesChartRef.current) {
        const existingChart = echarts.getInstanceByDom(fapesChartRef.current);
        const fapesChart = existingChart || echarts.init(fapesChartRef.current);
        const fapesOption = {
          backgroundColor: 'transparent',
          tooltip: {
            trigger: 'item',
            backgroundColor: cardColor,
            borderColor: borderColor,
            textStyle: {
              color: foregroundColor,
              fontFamily: 'Poppins, sans-serif',
            },
          },
          legend: {
            bottom: '0%',
            left: 'center',
            orient: 'horizontal',
            itemGap: 15,
            itemWidth: 16,
            itemHeight: 16,
            textStyle: {
              color: foregroundColor,
              fontFamily: 'Poppins, sans-serif',
              fontSize: 12,
            },
          },
          series: [
            {
              name: 'Classificação Fapes',
              type: 'pie',
              radius: ['40%', '55%'],
              center: ['50%', '40%'],
              avoidLabelOverlap: false,
              label: {
                show: false,
                position: 'center',
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: foregroundColor,
                  fontFamily: 'Poppins, sans-serif',
                },
              },
              labelLine: {
                show: false,
              },
              data: [
                { value: 85, name: 'Pesquisa', itemStyle: { color: '#0891b2' } },
                { value: 78, name: 'Carreira Científica', itemStyle: { color: '#0e7490' } },
                { value: 58, name: 'Difusão do Conhecimento', itemStyle: { color: '#155e75' } },
                { value: 72, name: 'Inovação', itemStyle: { color: '#06b6d4' } },
                { value: 45, name: 'Chamadas Internacionais', itemStyle: { color: '#164e63' } },
                { value: 65, name: 'Extensão', itemStyle: { color: '#0891b2' } },
              ],
            },
          ],
        };
        fapesChart.setOption(fapesOption);
      }
    };

    // Initial chart setup
    updateCharts();

    // Handle resize
    const handleResize = () => {
      if (projectsChartRef.current) {
        const chart = echarts.getInstanceByDom(projectsChartRef.current);
        chart?.resize();
      }
      if (budgetChartRef.current) {
        const chart = echarts.getInstanceByDom(budgetChartRef.current);
        chart?.resize();
      }
      if (scholarsChartRef.current) {
        const chart = echarts.getInstanceByDom(scholarsChartRef.current);
        chart?.resize();
      }
      if (equipmentChartRef.current) {
        const chart = echarts.getInstanceByDom(equipmentChartRef.current);
        chart?.resize();
      }
      if (fapesChartRef.current) {
        const chart = echarts.getInstanceByDom(fapesChartRef.current);
        chart?.resize();
      }
    };

    window.addEventListener('resize', handleResize);

    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          updateCharts();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      
      // Dispose chart instances
      if (projectsChartRef.current) {
        const chart = echarts.getInstanceByDom(projectsChartRef.current);
        chart?.dispose();
      }
      if (budgetChartRef.current) {
        const chart = echarts.getInstanceByDom(budgetChartRef.current);
        chart?.dispose();
      }
      if (scholarsChartRef.current) {
        const chart = echarts.getInstanceByDom(scholarsChartRef.current);
        chart?.dispose();
      }
      if (equipmentChartRef.current) {
        const chart = echarts.getInstanceByDom(equipmentChartRef.current);
        chart?.dispose();
      }
      if (fapesChartRef.current) {
        const chart = echarts.getInstanceByDom(fapesChartRef.current);
        chart?.dispose();
      }
    };
  }, []);

  const handleDropdownClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <div
      style={{
        padding: '2rem',
        maxWidth: '1400px',
        margin: '0 auto',
      }}
      className="px-4 sm:px-6 md:px-8"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start gap-3 mb-6">
          <button
            className="p-2 transition-colors"
            style={{
              backgroundColor: 'rgba(8, 145, 178, 0.1)',
              color: 'var(--primary)',
              borderRadius: 'var(--radius)',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(8, 145, 178, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(8, 145, 178, 0.1)';
            }}
            aria-label="Dashboard"
          >
            <BarChart3 size={20} />
          </button>
          <div style={{ flex: 1 }}>
            <h1
              style={{
                color: 'var(--foreground)',
                margin: 0,
                marginBottom: '0.5rem',
              }}
            >
              Dashboard
            </h1>
            <p
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--muted-foreground)',
                margin: 0,
              }}
            >
              Dados dos projetos da sua instituição.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: '1px',
            backgroundColor: 'var(--border)',
            width: '100%',
          }}
        />
      </div>

      {/* Stats Cards */}
      <div
        className="mb-8"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem',
        }}
      >
        {/* Projetos Card */}
        <div
          style={{
            backgroundColor: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--primary)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(8, 145, 178, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div
              style={{
                padding: '0.75rem',
                backgroundColor: 'rgba(8, 145, 178, 0.1)',
                borderRadius: 'var(--radius)',
              }}
            >
              <FolderKanban size={20} style={{ color: 'var(--primary)' }} />
            </div>
            <p
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--muted-foreground)',
                margin: 0,
                fontWeight: 'var(--font-weight-medium)',
              }}
            >
              Projetos
            </p>
          </div>
          <h3
            style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 'var(--font-weight-normal)',
              color: 'var(--foreground)',
              margin: 0,
              textAlign: 'center',
            }}
          >
            147
          </h3>
        </div>

        {/* Coordenadores Card */}
        <div
          style={{
            backgroundColor: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--primary)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(8, 145, 178, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div
              style={{
                padding: '0.75rem',
                backgroundColor: 'rgba(8, 145, 178, 0.1)',
                borderRadius: 'var(--radius)',
              }}
            >
              <UserCheck size={20} style={{ color: 'var(--primary)' }} />
            </div>
            <p
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--muted-foreground)',
                margin: 0,
                fontWeight: 'var(--font-weight-medium)',
              }}
            >
              Coordenadores
            </p>
          </div>
          <h3
            style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 'var(--font-weight-normal)',
              color: 'var(--foreground)',
              margin: 0,
              textAlign: 'center',
            }}
          >
            98
          </h3>
        </div>

        {/* Bolsistas Card */}
        <div
          style={{
            backgroundColor: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--primary)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(8, 145, 178, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div
              style={{
                padding: '0.75rem',
                backgroundColor: 'rgba(8, 145, 178, 0.1)',
                borderRadius: 'var(--radius)',
              }}
            >
              <Users size={20} style={{ color: 'var(--primary)' }} />
            </div>
            <p
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--muted-foreground)',
                margin: 0,
                fontWeight: 'var(--font-weight-medium)',
              }}
            >
              Bolsistas
            </p>
          </div>
          <h3
            style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 'var(--font-weight-normal)',
              color: 'var(--foreground)',
              margin: 0,
              textAlign: 'center',
            }}
          >
            1.245
          </h3>
        </div>

        {/* Valor Total Card */}
        <div
          style={{
            backgroundColor: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--primary)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(8, 145, 178, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div
              style={{
                padding: '0.75rem',
                backgroundColor: 'rgba(8, 145, 178, 0.1)',
                borderRadius: 'var(--radius)',
              }}
            >
              <DollarSign size={20} style={{ color: 'var(--primary)' }} />
            </div>
            <p
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--muted-foreground)',
                margin: 0,
                fontWeight: 'var(--font-weight-medium)',
              }}
            >
              Valor Total
            </p>
          </div>
          <h3
            style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 'var(--font-weight-normal)',
              color: 'var(--foreground)',
              margin: 0,
              textAlign: 'center',
            }}
          >
            R$ 4,8M
          </h3>
        </div>
      </div>

      {/* Charts */}
      <div
        className="grid gap-6"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1.5rem',
        }}
      >
        {/* Projects by Area Chart */}
        <div
          style={{
            backgroundColor: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0' }}>
            <h1
              style={{
                color: 'var(--foreground)',
                margin: 0,
                fontSize: 'var(--text-sm)',
              }}
            >
              Projetos por Área do CNPQ
            </h1>
            <div
              ref={dropdownRef}
              style={{
                position: 'relative',
                display: 'inline-block',
              }}
            >
              <button
                onClick={handleDropdownClick}
                style={{
                  backgroundColor: 'var(--card)',
                  color: 'var(--foreground)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  padding: '0.625rem 1rem',
                  fontSize: 'var(--text-sm)',
                  fontFamily: 'Poppins, sans-serif',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  minWidth: '130px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.boxShadow = '0 0 0 2px rgba(8, 145, 178, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <span>{cnpqLevel}</span>
                <ChevronDown size={16} style={{ color: 'var(--primary)' }} />
              </button>
              {isDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 5px)',
                    left: 0,
                    right: 0,
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                    zIndex: 1000,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      padding: '0.625rem 1rem',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                      backgroundColor: cnpqLevel === 'Nível 1' ? 'rgba(8, 145, 178, 0.15)' : 'transparent',
                    }}
                    onClick={() => {
                      setCnpqLevel('Nível 1');
                      setIsDropdownOpen(false);
                    }}
                    onMouseEnter={(e) => {
                      if (cnpqLevel !== 'Nível 1') {
                        e.currentTarget.style.backgroundColor = 'rgba(8, 145, 178, 0.08)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (cnpqLevel !== 'Nível 1') {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      } else {
                        e.currentTarget.style.backgroundColor = 'rgba(8, 145, 178, 0.15)';
                      }
                    }}
                  >
                    <span
                      style={{
                        color: cnpqLevel === 'Nível 1' ? 'var(--primary)' : 'var(--foreground)',
                        fontSize: 'var(--text-sm)',
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: cnpqLevel === 'Nível 1' ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)',
                      }}
                    >
                      Nível 1
                    </span>
                  </div>
                  <div
                    style={{
                      padding: '0.625rem 1rem',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                      backgroundColor: cnpqLevel === 'Nível 2' ? 'rgba(8, 145, 178, 0.15)' : 'transparent',
                    }}
                    onClick={() => {
                      setCnpqLevel('Nível 2');
                      setIsDropdownOpen(false);
                    }}
                    onMouseEnter={(e) => {
                      if (cnpqLevel !== 'Nível 2') {
                        e.currentTarget.style.backgroundColor = 'rgba(8, 145, 178, 0.08)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (cnpqLevel !== 'Nível 2') {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      } else {
                        e.currentTarget.style.backgroundColor = 'rgba(8, 145, 178, 0.15)';
                      }
                    }}
                  >
                    <span
                      style={{
                        color: cnpqLevel === 'Nível 2' ? 'var(--primary)' : 'var(--foreground)',
                        fontSize: 'var(--text-sm)',
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: cnpqLevel === 'Nível 2' ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)',
                      }}
                    >
                      Nível 2
                    </span>
                  </div>
                  <div
                    style={{
                      padding: '0.625rem 1rem',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                      backgroundColor: cnpqLevel === 'Nível 3' ? 'rgba(8, 145, 178, 0.15)' : 'transparent',
                    }}
                    onClick={() => {
                      setCnpqLevel('Nível 3');
                      setIsDropdownOpen(false);
                    }}
                    onMouseEnter={(e) => {
                      if (cnpqLevel !== 'Nível 3') {
                        e.currentTarget.style.backgroundColor = 'rgba(8, 145, 178, 0.08)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (cnpqLevel !== 'Nível 3') {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      } else {
                        e.currentTarget.style.backgroundColor = 'rgba(8, 145, 178, 0.15)';
                      }
                    }}
                  >
                    <span
                      style={{
                        color: cnpqLevel === 'Nível 3' ? 'var(--primary)' : 'var(--foreground)',
                        fontSize: 'var(--text-sm)',
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: cnpqLevel === 'Nível 3' ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)',
                      }}
                    >
                      Nível 3
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div ref={projectsChartRef} style={{ width: '100%', height: '400px' }} />
        </div>

        {/* Fapes Chart */}
        <div
          style={{
            backgroundColor: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0' }}>
            <h1
              style={{
                color: 'var(--foreground)',
                margin: 0,
                fontSize: 'var(--text-sm)',
              }}
            >
              Projetos por Classificação Fapes
            </h1>
            <div style={{ width: '130px', height: '40px' }} />
          </div>
          <div ref={fapesChartRef} style={{ width: '100%', height: '400px' }} />
        </div>

        {/* Budget Evolution Chart */}
        <div
          style={{
            backgroundColor: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            gridColumn: '1 / -1',
          }}
        >
          <h1
            style={{
              color: 'var(--foreground)',
              margin: 0,
              marginBottom: '1rem',
              fontSize: 'var(--text-sm)',
            }}
          >
            Evolução Orçamentária
          </h1>
          <div ref={budgetChartRef} style={{ width: '100%', height: '350px' }} />
        </div>

        {/* Scholars by Type Chart */}
        <div
          style={{
            backgroundColor: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
          }}
        >
          <h1
            style={{
              color: 'var(--foreground)',
              margin: 0,
              marginBottom: '1rem',
              fontSize: 'var(--text-sm)',
            }}
          >
            Bolsistas por Tipo
          </h1>
          <div ref={scholarsChartRef} style={{ width: '100%', height: '350px' }} />
        </div>

        {/* Equipment by Type Chart */}
        <div
          style={{
            backgroundColor: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
          }}
        >
          <h1
            style={{
              color: 'var(--foreground)',
              margin: 0,
              marginBottom: '1rem',
              fontSize: 'var(--text-sm)',
            }}
          >
            Material permanente
          </h1>
          <div ref={equipmentChartRef} style={{ width: '100%', height: '350px' }} />
        </div>
      </div>
    </div>
  );
}