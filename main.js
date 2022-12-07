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
      { "text": "无同类商品", score: 1 },
      { "text": "有同类商品", score: 0 }
    ]
  },
  {
    "title": "同类商品的使用情况？",
    "answers": [
      { "text": "已用完且没有囤货", score: 1 },
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
      { "text": "不超出计划额度的30%", score: 1 },
      { "text": "超出计划额度的30%", score: 0 },
      { "text": "超出计划额度的50%", score: -2 },
    ]
  }
]

let totalScores = []

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
]

function CalculateScore() {
  let result = 0
  if (result <= 0) return resultMap[0]
  if (result > 0 && result <=5) return resultMap[1]
  if (result > 5) return resultMap[2]
}

function CumulateScores(score, question) {
  totalScores.push({
    question,
    score
  })
}

/**
 * Use React without JSX
 */
const e = React.createElement;
const { useState } = React;

function QuestionBlock({ title, answers, hidden }) {
  return e(
    'li',
    { className: hidden ? 'hidden': '' },
    e(
      'h2',
      null,
      title
    ),
    e(
      'ol',
      null,
      answers.map((a, index) => {
        return e(
          'li',
          { type: 'A', key: index },
          a.text
        )
      })
    )
  )
}

function App () {
  const [showIndex, setShowIndex] = useState(0)

  return e(
    'ol',
    null,
    questionAnswerDict.map((q, index) => {
      return e(QuestionBlock, {
        title: q.title,
        answers: q.answers,
        hidden: index !== showIndex,
        key: index
      })
    })
  )
}

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(e(App));
