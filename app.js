/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle (src) {
  const copy = [...src]

  const length = copy.length
  for (let i = 0; i < length; i++) {
    const x = copy[i]
    const y = Math.floor(Math.random() * length)
    const z = copy[y]
    copy[i] = z
    copy[y] = x
  }

  if (typeof src === 'string') {
    return copy.join('')
  }

  return copy
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/
function App() {

  const defaultWords = [
    'apple','banana','orange','grapes','mango',
    'peach','cherry','melon','kiwi','lemon'
  ]

  const maxStrikes = 5
  const maxPasses = 3

  // Load from localStorage or default
  const [words, setWords] = React.useState(() => {
    const saved = localStorage.getItem('words')
    return saved ? JSON.parse(saved) : shuffle(defaultWords)
  })

  const [currentWord, setCurrentWord] = React.useState(words[0])
  const [scrambled, setScrambled] = React.useState(shuffle(words[0]))
  const [guess, setGuess] = React.useState('')
  const [message, setMessage] = React.useState('')

  const [points, setPoints] = React.useState(() => {
    return Number(localStorage.getItem('points')) || 0
  })

  const [strikes, setStrikes] = React.useState(() => {
    return Number(localStorage.getItem('strikes')) || 0
  })

  const [passes, setPasses] = React.useState(() => {
    return Number(localStorage.getItem('passes')) || maxPasses
  })

  const [gameOver, setGameOver] = React.useState(false)

  // Save to localStorage
  React.useEffect(() => {
    localStorage.setItem('words', JSON.stringify(words))
    localStorage.setItem('points', points)
    localStorage.setItem('strikes', strikes)
    localStorage.setItem('passes', passes)
  }, [words, points, strikes, passes])

  // Handle guess
  function handleSubmit(e) {
    e.preventDefault()

    if (gameOver) return

    if (guess.toLowerCase() === currentWord.toLowerCase()) {
      setMessage('Correct!')
      setPoints(points + 1)
      nextWord()
    } else {
      setMessage('Incorrect!')
      setStrikes(strikes + 1)
    }

    setGuess('')
  }

  // Next word
  function nextWord() {
    const remaining = words.slice(1)
    setWords(remaining)

    if (remaining.length === 0) {
      setGameOver(true)
      return
    }

    setCurrentWord(remaining[0])
    setScrambled(shuffle(remaining[0]))
  }

  // Pass
  function handlePass() {
    if (passes === 0 || gameOver) return

    setPasses(passes - 1)
    nextWord()
  }

  // Reset
  function resetGame() {
    const newWords = shuffle(defaultWords)
    setWords(newWords)
    setCurrentWord(newWords[0])
    setScrambled(shuffle(newWords[0]))
    setPoints(0)
    setStrikes(0)
    setPasses(maxPasses)
    setMessage('')
    setGameOver(false)
  }

  // End conditions
  React.useEffect(() => {
    if (strikes >= maxStrikes) {
      setGameOver(true)
    }
  }, [strikes])

  return (
    <div style={{textAlign:'center'}}>
      <h1>Scramble Game</h1>

      {!gameOver && (
        <>
          <h2>{scrambled}</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="Enter your guess"
            />
          </form>

          <p>{message}</p>

          <p>Points: {points}</p>
          <p>Strikes: {strikes}</p>
          <p>Passes: {passes}</p>

          <button onClick={handlePass} disabled={passes === 0}>
            Pass
          </button>
        </>
      )}

      {gameOver && (
        <>
          <h2>Game Over</h2>
          <p>Final Score: {points}</p>
          <button onClick={resetGame}>Play Again</button>
        </>
      )}
    </div>
  )
}

// Render
const root = ReactDOM.createRoot(document.body)
root.render(<App />)