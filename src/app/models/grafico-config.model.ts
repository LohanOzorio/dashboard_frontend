// src/app/models/grafico-config.model.ts
import type { EChartsOption } from 'echarts/types/dist/shared';

/**
 * Interface que define a estrutura de dados necessária para
 * alimentar o componente de gráfico reutilizável.
 */
export interface GraficoConfig {
  title: string;
  seriesData: EChartsOption['series'];
  xAxisLabels: string[];
  yAxisOptions?: EChartsOption['yAxis'];
} 
