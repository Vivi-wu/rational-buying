'use strict';

const questionAnswerDict = [
  {
    "title": "该商品购入后的使用频率？",
    "answers": [
      { "text": "每天", score: 2 },
      { "text": "每周", score: 1 },
      { "text": "每月", score: 0 },
      { "text": "低于每月一次", score: -2 }
    ]
  },
  {
    "title": "家里是否有该商品的同类商品？",
    "answers": [
      { "text": "无同类商品", score: 1 }, // 转第4题
      { "text": "有同类商品", score: 0 } // 转第3题
    ]
  },
  {
    "title": "同类商品的使用情况？",
    "answers": [
      { "text": "已用完/不好用", score: 1 },
      { "text": "快用完且没有囤货", score: 0 },
      { "text": "还有很多", score: -1 },
    ]
  },
  {
    "title": "缺少该类商品会造成的问题？",
    "answers": [
      { "text": "对日常生活产生严重困扰", score: 1 },
      { "text": "对日常生活产生一定困扰，但可以忍受", score: 0 },
      { "text": "对日常生活没有任何影响", score: -2 },
    ]
  },
  {
    "title": "对该商品的了解程度？",
    "answers": [
      { "text": "使用过", score: 1 },
      { "text": "从未使用过，但已经搜索并浏览了商品评价，好评与差评各10条", score: 0 },
      { "text": "不清楚，但感觉大数据推送的都是好评", score: -2 },
    ]
  },
  {
    "title": "当前商品的价格？",
    "answers": [
      { "text": "全年最低", score: 2 },
      { "text": "距离同类商品用完期间，无更低促销价", score: 1 },
      { "text": "距离同类商品用完期间，有更低促销价", score: 0 },
      { "text": "日常价", score: -1 }
    ]
  },
  {
    "title": "购买该商品后，本月累计消费的程度？",
    "answers": [
      { "text": "不超出月支出计划额度的30%", score: 1 },
      { "text": "超出月支出计划额度的30%", score: 0 },
      { "text": "超出月支出计划额度的50%", score: -2 },
    ]
  }
];

const resultMap = [
  {
    "name": "-10 ~ 0 分",
    "description": "完全不需要的消费。数值越低，代表越没有购入价值。实在想买，先加入愿望清单，过一段时间再看看..."
  },
  {
    "name": "1 ~ 5 分",
    "description": "非必要性消费。可以考虑大促凑单的时候买一买"
  },
  {
    "name": "6 ~ 8 分",
    "description": "必要性消费。遇到好价赶紧买吧～"
  }
];


/**
 * Use React without JSX
 */
const e = React.createElement;
const { useState, useEffect } = React;

function Calculator() {
  const [price, setPrice] = useState(undefined)
  const [budget, setBudget] = useState(undefined)

  return e(
    'div',
    { className: 'calculator' },
    e(
      'p', null, '算一算：',
      price && budget && e(
        'span',
        { style: { color: 'red' }},
        `${parseInt(price * Math.pow(10, 10)) / (budget * Math.pow(10, 10)) * 100}%`
      )
    ),
    e(
      'div', { className: 'input__wrapper'},
      e(
        'input',
        { type: 'number', placeholder: '购买商品预计花费', value: price, onChange: (e) => setPrice(e.target.value) },
        null
      ),
      e(
        'span', null, ' / '
      ),
      e(
        'input',
        { type: 'number', placeholder: '月支出计划额度', value: budget, onChange: (e) => setBudget(e.target.value) },
        null
      )
    )
  )
}

function QuestionBlock({ title, answers, hidden, total, questionIndex, onSelect, onBack }) {
  const [score, setScore] = useState(undefined)

  useEffect(() => {
    // 重新开始答题时清空已选值，避免干扰
    if (total === null) {
      setScore(undefined)
    }
  }, [total])

  const handleChange = (e) => {
    setScore(Number(e.target.value))
  }

  const handleNext = () => {
    if (typeof score !== "undefined") {
      onSelect(questionIndex, score)
    } else {
      alert('本题答案还没有选择！')
    }
  }

  return e(
    'div',
    { className: hidden ? 'hidden': '' },
    e(
      'h2',
      null,
      `${questionIndex + 1}、${title}`
    ),
    e(
      'ol',
      null,
      answers.map((a, index) => {
        return e(
          'li',
          { key: index },
          e(
            'div',
            null,
            e(
              'label',
              { className: 'radio-label' },
              a.text,
              e(
                'input',
                {
                  type: 'radio',
                  name: `decision_${questionIndex}`,
                  value: a.score,
                  checked: a.score === score,
                  onChange: handleChange,
                },
                null
              ),
              e(
                'span', { className: 'checkmark' }, null
              )
            )
          )
        )
      })
    ),
    questionIndex === 6 && e(Calculator),
    e(
      'div',
      { className: 'footer' },
      e(
        'button',
        {
          className: `${questionIndex === 0 ? 'v-hidden' : ''}`,
          onClick: onBack
        },
        '上一步'
      ),
      e(
        'button',
        {
          onClick: handleNext
        },
        questionIndex !== 6 ? '下一步' : '结论'
      )
    )
  )
}

function App () {
  const [showIndex, setShowIndex] = useState(0)
  const [total, setTotal] = useState(null)

  const onSelect = (questionInex, score) => {
    if (questionInex !== 1) {
      setShowIndex(questionInex + 1)
      setTotal(data => ({ ...data, [questionInex]: score }))
    } else {
      // questionInex === 1，重新选第2题时，重置把第3题得分
      setShowIndex(score === 1 ? 3 : 2)
      setTotal(data => ({ ...data, [questionInex]: score, [2]: undefined }))
    }
  }

  const onBack = () => {
    // 当第2题选“无同类商品”，从第4题返回第2题
    if (showIndex === 3 && total[1] === 1) {
      setShowIndex(1)
    } else {
      setShowIndex(showIndex - 1)
    }
  }

  console.log('total', total)

  return e(
    'div',
    { className: 'container' },
    questionAnswerDict.map((q, index) => {
      return e(QuestionBlock, {
        title: q.title,
        answers: q.answers,
        hidden: index !== showIndex,
        total,
        questionIndex: index,
        onSelect,
        onBack,
        key: index
      })
    }),
    showIndex === 7 && e(ResultContent, {
      total,
      onBack,
      onRestart: () => {
        setShowIndex(0)
        setTotal(null)
      }
    })
  )
}

function ResultContent ({ total, onBack, onRestart }) {
  const score = Object.values(total).reduce((a, b) => b ? a + b : a, 0);
  let resultIndex
  if (score <= 0) resultIndex = 0
  if (score > 0 && score <=5) resultIndex = 1
  if (score > 5) resultIndex = 2
  const description = resultMap[resultIndex].description

  return e(
    'div',
    null,
    e(
      'h2',
      null,
      '解读'
    ),
    e(
      'div',
      { className: 'result__desc' },
      description
    ),
    e(
      'div',
      { className: 'result__score' },
      `最终得分：${score}，参考值：${resultMap[resultIndex].name}`
    ),
    e(
      'div',
      { className: 'footer' },
      e(
        'button',
        {
          onClick: onBack
        },
        '返回上一步'
      ),
      e(
        'button',
        {
          onClick: onRestart
        },
        '重新来一次'
      )
    )
  )
}

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(e(App));
