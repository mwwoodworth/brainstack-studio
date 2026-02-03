// Pricing Optimizer Implementation

import { ToolResult } from '../types';
import {
  parseNumericInput,
  getConfidenceLevel,
  formatCurrency,
  formatPercentage,
  calculateInputConfidence,
} from '../utils';

export function executePricingOptimizer(inputs: Record<string, string | number>): ToolResult {
  // Parse inputs
  const unitCost = parseNumericInput(inputs.unitCost, 0);
  const currentPrice = parseNumericInput(inputs.currentPrice, 0);
  const competitorLowPrice = parseNumericInput(inputs.competitorLowPrice, 0);
  const competitorHighPrice = parseNumericInput(inputs.competitorHighPrice, 0);
  // Cap target margin at 95% to prevent division by zero (1 - 1.0 = 0)
  const targetMargin = Math.min(0.95, parseNumericInput(inputs.targetMargin, 70) / 100);
  const monthlyVolume = parseNumericInput(inputs.monthlyVolume, 100);

  // Calculate price points (targetMargin is capped at 95% to ensure valid division)
  const minViablePrice = unitCost / (1 - targetMargin); // Price needed for target margin
  const marketMidpoint = (competitorLowPrice + competitorHighPrice) / 2;

  // Generate three pricing tiers
  const economyPrice = Math.max(minViablePrice, competitorLowPrice * 0.9);
  const standardPrice = Math.max(minViablePrice * 1.1, marketMidpoint);
  const premiumPrice = Math.max(minViablePrice * 1.3, competitorHighPrice * 0.95);

  // Calculate margins for each tier
  const economyMargin = (economyPrice - unitCost) / economyPrice;
  const standardMargin = (standardPrice - unitCost) / standardPrice;
  const premiumMargin = (premiumPrice - unitCost) / premiumPrice;

  // Calculate monthly revenue at each tier (with volume adjustments)
  // Economy gets more volume, premium gets less
  const economyVolume = monthlyVolume * 1.3;
  const standardVolume = monthlyVolume;
  const premiumVolume = monthlyVolume * 0.7;

  const economyRevenue = economyPrice * economyVolume;
  const standardRevenue = standardPrice * standardVolume;
  const premiumRevenue = premiumPrice * premiumVolume;

  // Calculate profit at each tier
  const economyProfit = (economyPrice - unitCost) * economyVolume;
  const standardProfit = (standardPrice - unitCost) * standardVolume;
  const premiumProfit = (premiumPrice - unitCost) * premiumVolume;

  // Determine recommended tier
  let recommendedTier = 'Standard';
  let recommendedPrice = standardPrice;
  let maxProfit = standardProfit;

  if (premiumProfit > standardProfit && premiumProfit > economyProfit) {
    recommendedTier = 'Premium';
    recommendedPrice = premiumPrice;
    maxProfit = premiumProfit;
  } else if (economyProfit > standardProfit) {
    recommendedTier = 'Economy';
    recommendedPrice = economyPrice;
    maxProfit = economyProfit;
  }

  // Calculate current price analysis if provided
  let currentMargin = 0;
  let currentProfit = 0;
  let priceChangeRecommendation = '';

  if (currentPrice > 0) {
    currentMargin = (currentPrice - unitCost) / currentPrice;
    currentProfit = (currentPrice - unitCost) * monthlyVolume;

    if (currentPrice < minViablePrice) {
      priceChangeRecommendation = `Current price is below viable margin. Increase by ${formatCurrency(minViablePrice - currentPrice)} minimum.`;
    } else if (currentPrice < recommendedPrice * 0.9) {
      priceChangeRecommendation = `Room to increase price by ${formatPercentage(((recommendedPrice - currentPrice) / currentPrice) * 100)} based on market position.`;
    } else if (currentPrice > recommendedPrice * 1.2) {
      priceChangeRecommendation = `Price may be above market tolerance. Consider value-add features to justify.`;
    } else {
      priceChangeRecommendation = `Current pricing is well-positioned within the competitive range.`;
    }
  }

  // Market positioning
  let positioning = 'Mid-Market';
  if (recommendedPrice <= competitorLowPrice) {
    positioning = 'Value Leader';
  } else if (recommendedPrice >= competitorHighPrice * 0.9) {
    positioning = 'Premium';
  }

  // Calculate confidence
  let confidence = calculateInputConfidence(inputs, ['currentPrice']);
  if (competitorLowPrice === 0 && competitorHighPrice === 0) confidence *= 0.7;
  if (unitCost === 0) confidence *= 0.6;
  confidence = Math.min(0.90, Math.max(0.55, confidence));

  const confidenceLevel = getConfidenceLevel(confidence);

  // Build decision trail
  const decisionTrail = [
    `Unit cost: ${formatCurrency(unitCost)} requires minimum price of ${formatCurrency(minViablePrice)} for ${formatPercentage(targetMargin * 100)} margin`,
    `Competitive range: ${formatCurrency(competitorLowPrice)} to ${formatCurrency(competitorHighPrice)}`,
    `Market midpoint: ${formatCurrency(marketMidpoint)}`,
    `Analyzed three pricing tiers: Economy (${formatCurrency(economyPrice)}), Standard (${formatCurrency(standardPrice)}), Premium (${formatCurrency(premiumPrice)})`,
    `${recommendedTier} tier maximizes profit at ${formatCurrency(maxProfit)}/month`,
  ];

  // Generate recommendations
  const recommendations: string[] = [];

  recommendations.push(`Recommended: ${recommendedTier} tier at ${formatCurrency(recommendedPrice)} (${formatPercentage(recommendedTier === 'Economy' ? economyMargin * 100 : recommendedTier === 'Standard' ? standardMargin * 100 : premiumMargin * 100)} margin)`);

  if (priceChangeRecommendation) {
    recommendations.push(priceChangeRecommendation);
  }

  if (targetMargin > 0.8) {
    recommendations.push('High target margin may limit market penetration - consider volume vs. margin tradeoff');
  }

  if (competitorHighPrice > competitorLowPrice * 3) {
    recommendations.push('Wide competitive range suggests differentiated market segments - consider niche positioning');
  }

  // Build summary
  const summary = `Optimal pricing is ${formatCurrency(recommendedPrice)} (${recommendedTier} tier) with ${formatPercentage((recommendedTier === 'Economy' ? economyMargin : recommendedTier === 'Standard' ? standardMargin : premiumMargin) * 100)} gross margin. This positions you as ${positioning} in the market and projects ${formatCurrency(maxProfit)}/month profit.`;

  return {
    outputs: [
      {
        id: 'recommendedPrice',
        label: 'Recommended Price',
        value: recommendedPrice,
        format: 'currency',
        trend: 'positive',
        highlight: true,
        description: `${recommendedTier} tier pricing`,
      },
      {
        id: 'grossMargin',
        label: 'Gross Margin',
        value: (recommendedTier === 'Economy' ? economyMargin : recommendedTier === 'Standard' ? standardMargin : premiumMargin) * 100,
        format: 'percentage',
        trend: 'positive',
        highlight: true,
        description: 'Margin at recommended price',
      },
      {
        id: 'monthlyProfit',
        label: 'Projected Monthly Profit',
        value: maxProfit,
        format: 'currency',
        trend: 'positive',
        highlight: true,
        description: `At ${recommendedTier.toLowerCase()} volume`,
      },
      {
        id: 'positioning',
        label: 'Market Positioning',
        value: positioning,
        format: 'text',
        trend: 'neutral',
        description: 'Relative to competition',
      },
      {
        id: 'minViablePrice',
        label: 'Minimum Viable Price',
        value: minViablePrice,
        format: 'currency',
        trend: 'neutral',
        description: `Floor price for ${formatPercentage(targetMargin * 100)} margin`,
      },
      {
        id: 'monthlyRevenue',
        label: 'Projected Monthly Revenue',
        value: recommendedTier === 'Economy' ? economyRevenue : recommendedTier === 'Standard' ? standardRevenue : premiumRevenue,
        format: 'currency',
        trend: 'positive',
        description: 'Revenue at recommended tier',
      },
    ],
    confidence,
    confidenceLevel,
    chart: {
      labels: ['Economy', 'Standard', 'Premium'],
      datasets: [
        {
          label: 'Price Point',
          data: [economyPrice, standardPrice, premiumPrice],
          color: '#22d3ee', // cyan
          type: 'bar',
        },
        {
          label: 'Monthly Profit',
          data: [economyProfit, standardProfit, premiumProfit],
          color: '#10b981', // emerald
          type: 'bar',
        },
      ],
    },
    summary,
    recommendations,
    decisionTrail,
    timestamp: new Date().toISOString(),
  };
}
