export const WEEKS_PER_QUARTER = 13
export const PASS_PERCENT = 60
export const XP_PER_WEEK = 10
export const XP_PER_EXAM = 50

type QuarterDef = { id: number; title: string; examName: string; months: string[] }

const QUARTER_DEFS: QuarterDef[] = [
  { id: 1, title: 'Q1: Foundations', examName: 'Foundations of Math', months: ['Intro to Math', 'Calculus I', 'Linear Algebra'] },
  { id: 2, title: 'Q2: Computing Basics', examName: 'Computing Basics', months: ['Discrete Math', 'Algorithms', 'Data Structures'] },
  { id: 3, title: 'Q3: AI Fundamentals', examName: 'AI Fundamentals', months: ['Statistics', 'ML Basics', 'Python for ML'] },
  { id: 4, title: 'Q4: Advanced AI', examName: 'Advanced AI', months: ['Deep Learning', 'NLP', 'Computer Vision'] },
]

// 13 weeks split across 3 months: 4 + 5 + 4.
const MONTH_WEEK_SPLIT = [4, 5, 4]

export type Week = { key: string; number: number; month: string; title: string }
export type Quarter = QuarterDef & { weeks: Week[] }

export const QUARTERS: Quarter[] = QUARTER_DEFS.map((q) => {
  const weeks: Week[] = []
  let n = 1
  q.months.forEach((month, mi) => {
    for (let part = 1; part <= MONTH_WEEK_SPLIT[mi]; part++) {
      weeks.push({ key: `q${q.id}-w${n}`, number: n, month, title: `${month} — Part ${part}` })
      n++
    }
  })
  return { ...q, weeks }
})

export const TOTAL_WEEKS = QUARTERS.length * WEEKS_PER_QUARTER
export const VALID_WEEK_KEYS = new Set(QUARTERS.flatMap((q) => q.weeks.map((w) => w.key)))

type Question = { prompt: string; options: string[]; answer: number }

export const EXAM_QUESTIONS: Record<number, Question[]> = {
  1: [
    { prompt: 'What is the derivative of x²?', options: ['x', '2x', 'x³/3', '2'], answer: 1 },
    { prompt: 'What is ∫(1/x) dx?', options: ['ln|x| + C', '1/x² + C', 'x + C', 'eˣ + C'], answer: 0 },
    { prompt: 'What is the determinant of [[1, 2], [3, 4]]?', options: ['10', '2', '-2', '-10'], answer: 2 },
    { prompt: 'What is lim(x→0) sin(x)/x?', options: ['0', '∞', 'Undefined', '1'], answer: 3 },
    { prompt: 'If A is 3×2 and B is 2×4, what is the size of AB?', options: ['2×2', '3×4', '4×3', 'Not defined'], answer: 1 },
  ],
  2: [
    { prompt: 'Worst-case time complexity of binary search?', options: ['O(n)', 'O(1)', 'O(log n)', 'O(n log n)'], answer: 2 },
    { prompt: 'Which data structure is LIFO?', options: ['Queue', 'Stack', 'Linked list', 'Heap'], answer: 1 },
    { prompt: 'How many subsets does a set with n elements have?', options: ['n²', 'n!', '2n', '2ⁿ'], answer: 3 },
    { prompt: 'Average-case complexity of quicksort?', options: ['O(n log n)', 'O(n²)', 'O(log n)', 'O(n)'], answer: 0 },
    { prompt: 'Average lookup time in a hash table?', options: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'], answer: 2 },
  ],
  3: [
    { prompt: 'What is the mean of 2, 4, 6, 8?', options: ['4', '5', '6', '20'], answer: 1 },
    { prompt: 'Supervised learning requires…', options: ['Labeled data', 'No data', 'Only images', 'Reinforcement signals'], answer: 0 },
    {
      prompt: 'Overfitting means a model…',
      options: ['Trains too slowly', 'Has too few parameters', 'Does well on training data but poorly on new data', 'Always predicts the mean'],
      answer: 2,
    },
    { prompt: 'Which Python library is best known for DataFrames?', options: ['NumPy', 'Matplotlib', 'Flask', 'pandas'], answer: 3 },
    { prompt: 'For independent events A and B, P(A and B) = ?', options: ['P(A) + P(B)', 'P(A) · P(B)', 'P(A) / P(B)', '1 − P(A)'], answer: 1 },
  ],
  4: [
    { prompt: 'Which activation function is most common in hidden layers?', options: ['ReLU', 'Identity', 'Step', 'Softmax'], answer: 0 },
    { prompt: 'CNNs are primarily designed for…', options: ['Tabular data', 'Image data', 'Audio only', 'Graph search'], answer: 1 },
    { prompt: 'Transformers are built around…', options: ['Recurrence', 'Decision trees', 'Self-attention', 'k-means'], answer: 2 },
    { prompt: 'Backpropagation computes…', options: ['Training data', 'Learning rate', 'Model accuracy', 'Gradients of the loss w.r.t. weights'], answer: 3 },
    { prompt: 'In NLP, tokenization is…', options: ['Encrypting text', 'Splitting text into units', 'Translating text', 'Summarizing text'], answer: 1 },
  ],
}

export function publicCourse() {
  return {
    totalWeeks: TOTAL_WEEKS,
    passPercent: PASS_PERCENT,
    quarters: QUARTERS.map((q) => ({
      id: q.id,
      title: q.title,
      examName: q.examName,
      months: q.months,
      weeks: q.weeks,
      questionCount: EXAM_QUESTIONS[q.id].length,
    })),
  }
}
