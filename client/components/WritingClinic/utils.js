export const sigmoid = value => 1 / (1 + Math.exp(-value))

export const percentage = value => (Number(value || 0) * 100).toFixed(1)

export const resemblanceAfterFixes = (plan, selectedTypes) => {
  if (!plan?.available || plan.logit_now === undefined) return null

  let logit = plan.logit_now
  ;(plan.contributions || []).forEach(contribution => {
    if (selectedTypes.has(contribution.type)) logit -= contribution.logit_gain
  })

  return 1 - sigmoid(logit)
}

export const getUsefulContributions = plan =>
  (plan?.contributions || []).filter(contribution => !contribution.counterproductive)

export const getLevelLabel = (data, level) => data?.level_labels?.[level] || String(level ?? '')
