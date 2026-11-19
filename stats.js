const PASSING_PERCENTAGE = 67

function isArray(value) {
  return Array.isArray(value)
}

export function validateQuizData(data) {
  if (typeof data !== 'object' || data === null || isArray(data)) {
    return false
  }

  if (typeof data.quizTitle !== 'string' || data.quizTitle.trim() === '') {
    return false
  }

  if (!isArray(data.correctAnswers) || data.correctAnswers.length === 0) {
    return false
  }

  if (!isArray(data.attempts) || data.attempts.length === 0) {
    return false
  }

  for (const attempt of data.attempts) {
    if (typeof attempt !== 'object' || attempt === null || isArray(attempt)) {
      return false
    }

    if (typeof attempt.name !== 'string' || attempt.name.trim() === '') {
      return false
    }

    if (!isArray(attempt.answers) || attempt.answers.length !== data.correctAnswers.length) {
      return false
    }
  }

  return true
}

export function calculateAttempt(attempt, correctAnswers) {
  let score = 0

  for (let i = 0; i < correctAnswers.length; i++) {
    if (attempt.answers[i] === correctAnswers[i]) {
      score++
    }
  }

  const percentage = Math.round(score / correctAnswers.length * 100)

  return {
    name: attempt.name.trim(),
    score: score,
    percentage: percentage,
    passed: percentage >= PASSING_PERCENTAGE,
  }
}

export function calculateReport(data) {
  const attempts = []
  let totalPercentage = 0
  let passedCount = 0
  let best = null

  for (const attempt of data.attempts) {
    const result = calculateAttempt(attempt, data.correctAnswers)
    attempts.push(result)
    totalPercentage += result.percentage

    if (result.passed) {
      passedCount++
    }

    if (best === null || result.score > best.score) {
      best = result
    }
  }

  return {
    quizTitle: data.quizTitle.trim(),
    questionCount: data.correctAnswers.length,
    participantCount: attempts.length,
    averagePercentage: Math.round(totalPercentage / attempts.length),
    passedCount: passedCount,
    threshold: PASSING_PERCENTAGE,
    best: best,
    attempts: attempts,
  }
}
