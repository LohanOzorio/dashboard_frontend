import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';

import * as echarts from 'echarts/core';
import { BarChart, LineChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent, ToolboxComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { EChartsOption } from 'echarts/types/dist/shared';

echarts.use([BarChart, LineChart, GridComponent, LegendComponent, TooltipComponent, ToolboxComponent, CanvasRenderer]);

@Component({
  selector: 'app-chart-card',
  standalone: true,
  imports: [IonicModule, CommonModule, NgxEchartsDirective],
  templateUrl: './chart-card.component.html',
  styleUrls: ['./chart-card.component.scss'],
  providers: [provideEchartsCore({ echarts })],
})
export class ChartCardComponent implements OnChanges {
  @Input() title = 'Gráfico';
  @Input() seriesData: EChartsOption['series'] | undefined = [];
  @Input() xAxisLabels: string[] = [];
  @Input() yAxisOptions: EChartsOption['yAxis'] | undefined = [];

  
  @Input() textColor = '#000000ff';
  @Input() xLabelRotate = 35;
  @Input() compactXLabels = true; 
  @Input() gridPadding: Partial<Record<'left'|'right'|'top'|'bottom', number>> =
    { left: 24, right: 16, top: 32, bottom: 56 };

  @Input() valueFormatter?: (v: number | string | null | undefined) => string;

  chartOptions: EChartsOption = {};

  ngOnChanges(c: SimpleChanges): void {
    if (c['seriesData'] || c['xAxisLabels'] || c['yAxisOptions'] || c['valueFormatter'] ||
        c['textColor'] || c['xLabelRotate'] || c['gridPadding'] || c['compactXLabels']) {
      this.buildChartOptions();
    }
  }

  private buildChartOptions(): void {
    if (!this.seriesData || !Array.isArray(this.seriesData) || this.seriesData.length === 0) {
      this.chartOptions = {};
      return;
    }

    const legendNames = this.seriesData.map((s: any) => s?.name).filter(Boolean);
    const yAxisNormalized =
      this.yAxisOptions && (Array.isArray(this.yAxisOptions) ? this.yAxisOptions : [this.yAxisOptions]);

    const vf = this.valueFormatter
      ? (value: any) => {
          const raw = Array.isArray(value) ? value[0] : value;
          const norm = raw instanceof Date ? raw.getTime() : (raw ?? 0);
          return this.valueFormatter!(norm as number | string | null | undefined);
        }
      : undefined;

    const axisCommon = {
      axisLine: { lineStyle: { color: 'rgba(0, 0, 0, 1)' } },
      axisTick: { show: false },
      axisLabel: { color: this.textColor },
      splitLine: { show: true, lineStyle: { color: 'rgba(0, 0, 0, 0.2)' } },
    } as const;

    const yAxisStyled = (yAxisNormalized?.length ? yAxisNormalized : [{ type: 'value' }]).map((y: any) => ({
      ...y,
      axisLabel: { ...(y.axisLabel ?? {}), color: this.textColor },
      axisLine: { ...(y.axisLine ?? {}), lineStyle: { ...(y.axisLine?.lineStyle ?? {}), color: 'rgba(255,255,255,.35)' } },
      splitLine: { ...(y.splitLine ?? {}), show: true, lineStyle: { ...(y.splitLine?.lineStyle ?? {}), color: 'rgba(255,255,255,.2)' } },
    }));

    this.chartOptions = {
      textStyle: { color: this.textColor },

      tooltip: { trigger: 'axis', axisPointer: { type: 'cross' }, valueFormatter: vf },

      toolbox: {
        feature: {
          dataView: { show: true, readOnly: false },
          magicType: { show: true, type: ['line', 'bar'] },
          restore: { show: true },
          saveAsImage: { show: true },
        },
        iconStyle: { borderColor: this.textColor },
      },

      legend: { data: legendNames, textStyle: { color: this.textColor } },

      grid: {
        left: this.gridPadding.left ?? 24,
        right: this.gridPadding.right ?? 16,
        top: this.gridPadding.top ?? 32,
        
        bottom: this.gridPadding.bottom ?? 24, 
        containLabel: true
      },

      xAxis: [{
        type: 'category',
        data: this.xAxisLabels ?? [],
        axisPointer: { type: 'shadow' },
        ...axisCommon,
        axisLabel: {
          
          show: false,
        },
      }],

      yAxis: yAxisStyled,
      
      series: this.seriesData,
    };
  }
}
