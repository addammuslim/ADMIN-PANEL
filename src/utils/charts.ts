/**
 * AuraMaster Lightweight SVG Chart Engine
 * 100% Vanilla JS + SVG charts without heavy charting library overhead
 */

export interface ChartDataPoint {
  label: string;
  value: number;
  secondaryValue?: number;
}

export function renderAreaSplineChart(
  container: HTMLElement,
  data: ChartDataPoint[],
  options: {
    height?: number;
    color?: string;
    secondaryColor?: string;
    valuePrefix?: string;
  } = {}
) {
  const height = options.height || 260;
  const color = options.color || 'var(--primary)';
  const valuePrefix = options.valuePrefix || '';

  if (!data || data.length === 0) return;

  const width = 800; // SVG viewBox coordinate width
  const padding = { top: 20, right: 30, bottom: 40, left: 50 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const maxVal = Math.max(...data.map((d) => d.value)) * 1.15 || 100;
  const minVal = 0;

  // Calculate coordinates
  const points = data.map((d, i) => {
    const x = padding.left + (i / (data.length - 1)) * chartW;
    const y = padding.top + chartH - ((d.value - minVal) / (maxVal - minVal)) * chartH;
    return { x, y, ...d };
  });

  // Generate smooth SVG curve path
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? 0 : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2 < points.length ? i + 2 : i + 1];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    pathD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }

  const areaD = `${pathD} L ${points[points.length - 1].x} ${padding.top + chartH} L ${points[0].x} ${padding.top + chartH} Z`;

  // Grid lines
  const gridSteps = 4;
  let gridHtml = '';
  for (let s = 0; s <= gridSteps; s++) {
    const y = padding.top + (s / gridSteps) * chartH;
    const val = maxVal - (s / gridSteps) * (maxVal - minVal);
    gridHtml += `
      <line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="currentColor" stroke-opacity="0.08" stroke-dasharray="4 4" />
      <text x="${padding.left - 10}" y="${y + 4}" fill="currentColor" opacity="0.45" font-size="11" text-anchor="end" class="tabular-nums">
        ${Math.round(val / 1000)}k
      </text>
    `;
  }

  // X labels
  let xLabelsHtml = '';
  const labelInterval = Math.max(1, Math.floor(data.length / 7));
  points.forEach((p, idx) => {
    if (idx % labelInterval === 0 || idx === points.length - 1) {
      xLabelsHtml += `
        <text x="${p.x}" y="${padding.top + chartH + 24}" fill="currentColor" opacity="0.5" font-size="11" text-anchor="middle">
          ${p.label}
        </text>
      `;
    }
  });

  // Interactive points
  const pointsHtml = points
    .map(
      (p, i) => `
      <g class="chart-point-group" data-idx="${i}" style="cursor: pointer;">
        <circle cx="${p.x}" cy="${p.y}" r="4" fill="#ffffff" stroke="${color}" stroke-width="2.5" class="transition-all hover:scale-150" />
      </g>
    `
    )
    .join('');

  container.innerHTML = `
    <div class="relative w-full select-none text-slate-600 dark:text-slate-400" style="height: ${height}px;">
      <svg viewBox="0 0 ${width} ${height}" class="w-full h-full block overflow-visible">
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${color}" stop-opacity="0.28" />
            <stop offset="100%" stop-color="${color}" stop-opacity="0.0" />
          </linearGradient>
        </defs>
        ${gridHtml}
        ${xLabelsHtml}
        <path d="${areaD}" fill="url(#chartGradient)" />
        <path d="${pathD}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" />
        ${pointsHtml}
      </svg>
      <div id="chart-tooltip" class="absolute pointer-events-none opacity-0 transition-opacity bg-slate-900 text-white text-xs px-2.5 py-1.5 rounded shadow-lg -translate-x-1/2 -translate-y-full mb-2 z-20 whitespace-nowrap">
        <span class="tooltip-label text-slate-400 block text-[10px]"></span>
        <span class="tooltip-val font-semibold font-mono"></span>
      </div>
    </div>
  `;

  // Attach hover interactions
  const tooltip = container.querySelector('#chart-tooltip') as HTMLElement;
  const pointGroups = container.querySelectorAll('.chart-point-group');

  pointGroups.forEach((group) => {
    group.addEventListener('mouseenter', (e) => {
      const idx = parseInt((group as HTMLElement).dataset.idx || '0', 10);
      const pt = points[idx];
      if (!tooltip || !pt) return;

      const rect = container.getBoundingClientRect();
      const pctX = (pt.x / width) * 100;
      const pctY = (pt.y / height) * 100;

      tooltip.style.left = `${pctX}%`;
      tooltip.style.top = `${pctY}%`;
      tooltip.querySelector('.tooltip-label')!.textContent = pt.label;
      tooltip.querySelector('.tooltip-val')!.textContent = `${valuePrefix}${new Intl.NumberFormat('id-ID').format(pt.value)}`;
      tooltip.style.opacity = '1';
    });

    group.addEventListener('mouseleave', () => {
      if (tooltip) tooltip.style.opacity = '0';
    });
  });
}

export function renderDonutChart(
  container: HTMLElement,
  data: { label: string; value: number; color: string }[],
  centerTitle: string = 'Total'
) {
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
  const size = 180;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let currentOffset = 0;
  const slicesHtml = data
    .map((d) => {
      const pct = d.value / total;
      const strokeDash = pct * circumference;
      const strokeDashoffset = -currentOffset;
      currentOffset += strokeDash;

      return `
      <circle
        cx="${size / 2}"
        cy="${size / 2}"
        r="${radius}"
        fill="transparent"
        stroke="${d.color}"
        stroke-width="${strokeWidth}"
        stroke-dasharray="${strokeDash} ${circumference - strokeDash}"
        stroke-dashoffset="${strokeDashoffset}"
        class="transition-all duration-300 hover:opacity-85"
      />
    `;
    })
    .join('');

  const legendHtml = data
    .map(
      (d) => `
    <div class="flex items-center justify-between text-xs py-1">
      <div class="flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full shrink-0" style="background-color: ${d.color};"></span>
        <span class="text-slate-600 dark:text-slate-400 truncate max-w-[130px]">${d.label}</span>
      </div>
      <span class="font-semibold text-slate-800 dark:text-slate-200 tabular-nums">${Math.round((d.value / total) * 100)}%</span>
    </div>
  `
    )
    .join('');

  container.innerHTML = `
    <div class="flex flex-col items-center gap-5 justify-center w-full py-1">
      <div class="relative w-[160px] h-[160px] shrink-0 mx-auto">
        <svg width="100%" height="100%" viewBox="0 0 ${size} ${size}" class="-rotate-90">
          <circle cx="${size / 2}" cy="${size / 2}" r="${radius}" fill="transparent" stroke="currentColor" stroke-opacity="0.08" stroke-width="${strokeWidth}" />
          ${slicesHtml}
        </svg>
        <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
          <span class="text-[10px] uppercase tracking-wider text-slate-400 font-medium">${centerTitle}</span>
          <span class="text-xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">${new Intl.NumberFormat('id-ID').format(total)}</span>
        </div>
      </div>
      <div class="w-full max-w-[280px] flex flex-col justify-center divide-y divide-slate-100 dark:divide-slate-800/80 pt-1">
        ${legendHtml}
      </div>
    </div>
  `;
}
