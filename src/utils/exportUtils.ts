import { BOMItem, FundingLead, PitchSlide } from '../types';

/**
 * Downloads a string content as a downloadable file
 */
export function downloadFile(content: string, fileName: string, contentType: string) {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Converts BOM items to CSV format
 */
export function exportBOMToCSV(items: BOMItem[], scale: number = 10) {
  const headers = ['Category', 'Part Name', 'Specification', 'Supplier (NZ)', 'Unit Cost (NZD)', 'Qty Per Buoy', 'Lead Time (Weeks)', `Total Cost (${scale} Buoys)`];
  const rows = items.map(item => {
    const totalCost = Math.round(item.unitCostNZD * item.qtyPerBuoy * scale * (scale >= 100 ? 0.8 : scale >= 10 ? 0.9 : 1.0));
    return [
      `"${item.category}"`,
      `"${item.partName}"`,
      `"${item.specification}"`,
      `"${item.supplier}"`,
      item.unitCostNZD,
      item.qtyPerBuoy,
      item.leadTimeWeeks,
      totalCost
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\n');
  downloadFile(csvContent, `SaliBuoy_MarkIII_BOM_${scale}Units.csv`, 'text/csv');
}

/**
 * Converts Funding Leads to CSV format
 */
export function exportFundingLeadsToCSV(leads: FundingLead[]) {
  const headers = ['Organization', 'Category', 'Focus Area', 'Target Amount (NZD)', 'Status', 'Probability (%)', 'Decision Quarter', 'Key Requirement', 'NZ Region'];
  const rows = leads.map(lead => [
    `"${lead.organization}"`,
    `"${lead.category}"`,
    `"${lead.focusArea}"`,
    lead.targetAmountNZD,
    `"${lead.status}"`,
    lead.probabilityPercent,
    `"${lead.expectedDecisionMonth}"`,
    `"${lead.keyRequirement}"`,
    `"${lead.nzRegion}"`
  ].join(','));

  const csvContent = [headers.join(','), ...rows].join('\n');
  downloadFile(csvContent, 'SaliBuoy_12Month_Funding_Pipeline.csv', 'text/csv');
}

/**
 * Exports Pitch Deck to Markdown presentation document
 */
export function exportPitchDeckMarkdown(slides: PitchSlide[]) {
  const mdContent = slides.map(s => `
# Slide ${s.id}: ${s.title}
**Subtitle:** ${s.subtitle}
**Key Metric:** ${s.highlightMetric.value} (${s.highlightMetric.label})

### Bullet Points:
${s.bulletPoints.map(p => `- ${p}`).join('\n')}

> **Investor Takeaway:** ${s.calloutNote}
---
`).join('\n');

  downloadFile(mdContent, 'SaliBuoy_Systems_VC_Pitch_Deck.md', 'text/markdown');
}
