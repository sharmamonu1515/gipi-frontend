import { Injectable } from '@angular/core';
import { clippingParents } from '@popperjs/core';

@Injectable({
  providedIn: 'root'
})
export class FinancialRatioService {
  constructor() { }

  calculateAllRatios(
    balanceSheetData: { [year: string]: any[] },
    assetsData: { [year: string]: any[] },
    profitLossData: { [year: string]: any[] },
    years: string[],
    subTotalData: { [year: string]: any[] }
  ) {
    const results = {
      profitabilityRatios: this.calculateProfitabilityRatios(profitLossData, years),
      returnRatios: this.calculateReturnRatios(profitLossData, balanceSheetData, assetsData, subTotalData, years),
      liquidityRatios: this.calculateLiquidityRatios(subTotalData, assetsData, years),
      turnoverRatios: this.calculateTurnoverRatios(assetsData, profitLossData, years),
      solvencyRatios: this.calculateSolvencyRatios(balanceSheetData, profitLossData, subTotalData, years),
      efficiencyRatios: this.calculateEfficiencyRatios(assetsData, profitLossData, years),
      workingCapitalRatios: this.calculateWorkingCapitalRatios(balanceSheetData, assetsData, profitLossData, subTotalData, years),
      altmanScore: this.calculateAltmanScore(balanceSheetData, assetsData, profitLossData, subTotalData, years)
    };

    return results;
  }

  private calculateProfitabilityRatios(profitLossData: { [year: string]: any }, years: string[]) {
    const grossProfitMargin = { particulars: 'Gross Profit Margin (%)', values: [] };
    const operatingProfitMargin = { particulars: 'Operating Profit Margin (%)', values: [] };

    for (const year of years) {
      const pnl = profitLossData[year];
      if (!pnl) {
        grossProfitMargin.values.push(' ');
        operatingProfitMargin.values.push(' ');
        continue;
      }

      if (pnl && pnl.net_revenue) {
        const gpMargin = ((pnl.net_revenue - (pnl.total_cost_of_materials_consumed + pnl.total_purchases_of_stock_in_trade + pnl.total_changes_in_inventories_or_finished_goods)) / pnl.net_revenue) * 100;
        grossProfitMargin.values.push(this.formatValue(gpMargin));
      } else {
        grossProfitMargin.values.push(' ');
      }

    //   if (revenue && revenue !== 0 && operatingProfit !== undefined) {
    //     const opMargin = (operatingProfit / revenue) * 100;
    //     operatingProfitMargin.values.push(this.formatValue(opMargin));
    //   } else {
    //     operatingProfitMargin.values.push('N/A');
    //   }
    }

    return [grossProfitMargin, operatingProfitMargin];
  }

  private calculateReturnRatios(
    profitLossData: { [year: string]: any },
    balanceSheetData: { [year: string]: any },
    assetsData: { [year: string]: any },
    subTotalData: { [year: string]: any },
    years: string[]
  ) {
    const netProfitMargin = { particulars: 'Net Profit Margin (%)', values: [] };
    const returnOnAssets = { particulars: 'Return on Assets (%)', values: [] };
    const returnOnTNW = { particulars: 'Return on Tangible Net worth (%)', values: [] };
    const returnOnCapital = { particulars: 'Return on Capital Employed (%)', values: [] };
    for (const year of years) {
        if (profitLossData[year] && profitLossData[year].net_revenue && profitLossData[year].net_revenue > 0) {
            const npMargin = (profitLossData[year].profit_after_tax / profitLossData[year].net_revenue) * 100;
            netProfitMargin.values.push(this.formatValue(npMargin));
        } else {
            netProfitMargin.values.push(' ');
        }

        // Calculate Return on Assets
        // if (totalAssets && totalAssets !== 0 && netProfit !== undefined) {
        //     const roa = (netProfit / totalAssets) * 100;
        //     returnOnAssets.values.push(this.formatValue(roa));
        // } else {
        //     returnOnAssets.values.push('N/A');
        // }

        // // Calculate Return on Tangible Net Worth
        // if (tangibleNetWorth && tangibleNetWorth !== 0 && netProfit !== undefined) {
        //     const rotnw = (netProfit / tangibleNetWorth) * 100;
        //     returnOnTNW.values.push(this.formatValue(rotnw));
        // } else {
        //     returnOnTNW.values.push('N/A');
        // }

        // Calculate Return on Capital Employed
        if (profitLossData[year] && balanceSheetData[year] && subTotalData[year]) {
            const roce = (profitLossData[year].profit_before_interest_and_tax / (balanceSheetData[year].long_term_borrowings +  balanceSheetData[year].short_term_borrowings + (subTotalData[year].total_equity)) * 100);
            returnOnCapital.values.push(this.formatValue(roce));
        } else {
            returnOnCapital.values.push(' ');
        }
    }

    return [netProfitMargin, returnOnAssets, returnOnTNW, returnOnCapital];
  }

  private calculateLiquidityRatios(
    subTotalData: { [year: string]: any },
    assetsData: { [year: string]: any },
    years: string[]
  ) {
    const quickRatio = { particulars: 'Quick Ratio (Times)', values: [] };
    const currentRatio = { particulars: 'Current Ratio (Times)', values: [] };

    for (const year of years) {
      const st = subTotalData[year];
      const assets = assetsData[year];

      if (!st) {
        quickRatio.values.push(' ');
        currentRatio.values.push(' ');
        continue;
      }

      if (st && assets) {
        const qr = (st.total_current_assets  - assets.inventories )/ st.total_current_liabilities;
        quickRatio.values.push(this.formatValue(qr));
      } else {
        quickRatio.values.push(' ');
      }

      if (st) {
        const cr = st.total_current_assets / st.total_current_liabilities;
        currentRatio.values.push(this.formatValue(cr));
      } else {
        currentRatio.values.push(' ');
      }
    }

    return [quickRatio, currentRatio];
  }

  private calculateTurnoverRatios(
    assetsData: { [year: string]: any[] },
    profitLossData: { [year: string]: any[] },
    years: string[]
  ) {
    const fixedAssetTurnover = { particulars: 'Fixed Asset Turnover Ratio (Times)', values: [] };

    for (const year of years) {
      const assets = assetsData[year];
      const pnl = profitLossData[year];

      if (!assets || !pnl) {
        fixedAssetTurnover.values.push(' ');
        continue;
      }

      const revenue = this.findValueByName(pnl, 'Revenue from operations');
      const fixedAssets = this.findValueByName(assets, 'Property, plant and equipment');

      if (fixedAssets && fixedAssets !== 0 && revenue !== undefined) {
        const fat = revenue / fixedAssets;
        fixedAssetTurnover.values.push(this.formatValue(fat));
      } else {
        fixedAssetTurnover.values.push(' ');
      }
    }

    return [fixedAssetTurnover];
  }

  private calculateSolvencyRatios(
    balanceSheetData: { [year: string]: any },
    profitLossData: { [year: string]: any },
    subTotalData: { [year: string]: any },
    years: string[]
  ) {
    const debtEquityRatio = { particulars: 'Total Debt Equity Ratio (Times)', values: [] };
    const liabilitiesToTNW = { particulars: 'Total Liabilities to Tangible Net worth (%)', values: [] };
    const interestCoverage = { particulars: 'Interest Coverage Ratio (Times)', values: [] };

    for (const year of years) {
      const bs = balanceSheetData[year];
      const pnl = profitLossData[year];
      const subtotals = subTotalData[year];

      if (!bs || !pnl || !subtotals) {
        debtEquityRatio.values.push(' ');
        liabilitiesToTNW.values.push(' ');
        interestCoverage.values.push(' ');
        continue;
      }

      if (bs) {
        const der = bs.long_term_borrowings + bs.short_term_borrowings / subtotals.total_equity;
        debtEquityRatio.values.push(this.formatValue(der));
      } else {
        debtEquityRatio.values.push(' ');
      }

      // Calculate Total Liabilities to TNW
    //   if (equity && equity !== 0 && totalLiabilities !== undefined) {
    //     const tltnw = (totalLiabilities / equity) * 100;
    //     liabilitiesToTNW.values.push(this.formatValue(tltnw));
    //   } else {
    //     liabilitiesToTNW.values.push('N/A');
    //   }

      // Calculate Interest Coverage Ratio
      if (pnl) {
        const icr = pnl.profit_before_interest_and_tax / pnl.interest;
        interestCoverage.values.push(this.formatValue(icr));
      } else {
        interestCoverage.values.push(' ');
      }
    }

    return [debtEquityRatio, liabilitiesToTNW, interestCoverage];
  }

  private calculateEfficiencyRatios(
    assetsData: { [year: string]: any[] },
    profitLossData: { [year: string]: any[] },
    years: string[]
  ) {
    const collectionPeriod = { particulars: 'Collection Period (Days)', values: [] };

    for (const year of years) {
      const assets = assetsData[year];
      const pnl = profitLossData[year];

      if (!assets || !pnl) {
        collectionPeriod.values.push(' ');
        continue;
      }

      // Extract required values
      const tradeReceivables = this.findValueByName(assets, 'Trade receivables');
      const revenue = this.findValueByName(pnl, 'Revenue from operations');

      // Calculate Collection Period
      if (revenue && revenue !== 0 && tradeReceivables !== undefined) {
        const cp = (tradeReceivables / revenue) * 365;
        collectionPeriod.values.push(this.formatValue(cp));
      } else {
        collectionPeriod.values.push(' ');
      }
    }

    return [collectionPeriod];
  }

  /**
   * Calculate working capital ratios
   */
  private calculateWorkingCapitalRatios(
    balanceSheetData: { [year: string]: any[] },
    assetsData: { [year: string]: any[] },
    profitLossData: { [year: string]: any[] },
    subTotalData: { [year: string]: any[] },
    years: string[]
  ) {
    const currentLiabToTNW = { particulars: 'Current Liabilities to Tangible Net worth (%)', values: [] };
    const workingCapitalTurnover = { particulars: 'Working Capital Turnover Ratio (Times)', values: [] };

    for (const year of years) {
      const bs = balanceSheetData[year];
      const assets = assetsData[year];
      const pnl = profitLossData[year];
      const subtotals = subTotalData[year];

      if (!bs || !assets || !pnl || !subtotals) {
        currentLiabToTNW.values.push(' ');
        workingCapitalTurnover.values.push(' ');
        continue;
      }

      // Extract required values
      const currentLiabilities = this.findValueByName(bs, 'Current liabilities');
      const tangibleNetWorth = this.findValueByName(subtotals, 'Shareholders\' funds');
      const currentAssets = this.findValueByName(assets, 'Current assets');
      const revenue = this.findValueByName(pnl, 'Revenue from operations');
      
      // Safe calculation of working capital
      const workingCapital = currentAssets && currentLiabilities ? 
                             currentAssets - currentLiabilities : 0;

      // Calculate Current Liabilities to TNW
      if (tangibleNetWorth && tangibleNetWorth !== 0 && currentLiabilities !== undefined) {
        const cltnw = (currentLiabilities / tangibleNetWorth) * 100;
        currentLiabToTNW.values.push(this.formatValue(cltnw));
      } else {
        currentLiabToTNW.values.push(' ');
      }

      // Calculate Working Capital Turnover
      if (workingCapital && workingCapital !== 0 && revenue !== undefined) {
        const wct = revenue / workingCapital;
        workingCapitalTurnover.values.push(this.formatValue(wct));
      } else {
        workingCapitalTurnover.values.push(' ');
      }
    }

    return [currentLiabToTNW, workingCapitalTurnover];
  }

  private calculateAltmanScore(
    balanceSheetData: { [year: string]: any[] },
    assetsData: { [year: string]: any[] },
    profitLossData: { [year: string]: any[] },
    subTotalData: { [year: string]: any[] },
    years: string[]
  ) {
    const altmanZScore = { particulars: "Altman's Z Score", values: [] };
    const duPontScore = { particulars: 'Du Pont Analysis Score', values: [] };

    for (const year of years) {
      const bs = balanceSheetData[year];
      const assets = assetsData[year];
      const pnl = profitLossData[year];
      const subtotals = subTotalData[year];

      if (!bs || !assets || !pnl || !subtotals) {
        altmanZScore.values.push(' ');
        duPontScore.values.push(' ');
        continue;
      }

      // Extract values for Altman Z-Score
      const totalAssets = this.findValueByName(subtotals, 'Total Assets');
      const currentAssets = this.findValueByName(assets, 'Current assets') || 0;
      const currentLiabilities = this.findValueByName(bs, 'Current liabilities') || 0;
      const workingCapital = currentAssets - currentLiabilities;
      const retainedEarnings = this.findValueByName(bs, 'Reserves and surplus');
      const ebit = this.findValueByName(pnl, 'Earnings before interest and tax');
      const marketValueEquity = this.findValueByName(subtotals, 'Shareholders\' funds'); // Using book value as proxy
      const totalLiabilities = this.findValueByName(subtotals, 'Total Liabilities');
      const sales = this.findValueByName(pnl, 'Revenue from operations');

      // Calculate Altman Z-Score (For manufacturing companies)
      if (totalAssets && totalAssets !== 0 && totalLiabilities && totalLiabilities !== 0) {
        // Z = 1.2X₁ + 1.4X₂ + 3.3X₃ + 0.6X₄ + 1.0X₅
        const X1 = workingCapital / totalAssets;
        const X2 = (retainedEarnings || 0) / totalAssets;
        const X3 = (ebit || 0) / totalAssets;
        const X4 = (marketValueEquity || 0) / totalLiabilities;
        const X5 = (sales || 0) / totalAssets;

        const zScore = (1.2 * X1) + (1.4 * X2) + (3.3 * X3) + (0.6 * X4) + (1.0 * X5);
        altmanZScore.values.push(this.formatValue(zScore));
      } else {
        altmanZScore.values.push(' ');
      }

      // Calculate Du Pont Analysis
      // ROE = (Net Profit/Sales) × (Sales/Total Assets) × (Total Assets/Equity)
      const netProfit = this.findValueByName(pnl, 'Profit (loss) for period');
      const equity = this.findValueByName(subtotals, 'Shareholders\' funds');

      if (sales && sales !== 0 && totalAssets && totalAssets !== 0 && 
          equity && equity !== 0 && netProfit !== undefined) {
        const netProfitMargin = netProfit / sales;
        const assetTurnover = sales / totalAssets;
        const equityMultiplier = totalAssets / equity;
        
        const duPont = netProfitMargin * assetTurnover * equityMultiplier * 100; // ROE in percentage
        duPontScore.values.push(this.formatValue(duPont));
      } else {
        duPontScore.values.push(' ');
      }
    }

    return [altmanZScore, duPontScore];
  }

  private findValueByName(data: any[], name: string): number | undefined {
    if (!data || !Array.isArray(data)) return undefined;
    
    const item = data.find(item => item && (item.name === name || item.particulars === name));
    return item ? parseFloat(item.value) : undefined;
  }

  private formatValue(value: number): string {
    return isNaN(value) ? ' ' : value.toFixed(2);
  }
}