document.addEventListener('DOMContentLoaded', () => {
  const summarizeBtn = document.getElementById('summarizeBtn')
  const inputText = document.getElementById('inputText')
  const summaryBox = document.getElementById('summaryBox')
  const copyBtn = document.getElementById('copyBtn')
  const downloadBtn = document.getElementById('downloadBtn')

  summarizeBtn.onclick = async () => {
    const text = inputText.value.trim()
    if (!text) {
      summaryBox.innerText = 'Please paste some text to summarize.'
      return
    }

    summaryBox.innerHTML = '<div class="loader"></div> Summarizing...'

    const minLen = document.getElementById('minLen').value
    const maxLen = document.getElementById('maxLen').value

    try {
      const res = await fetch('/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, min_length: minLen, max_length: maxLen })
      })

      const data = await res.json()
      if (res.ok) {
        summaryBox.innerText = data.summary
      } else {
        summaryBox.innerText = 'Error: ' + (data.error || res.statusText)
      }
    } catch (err) {
      summaryBox.innerText = 'Network error: ' + err.message
    }
  }

  copyBtn.onclick = () => {
    const text = summaryBox.innerText
    navigator.clipboard?.writeText(text)
  }

  downloadBtn.onclick = () => {
    const text = summaryBox.innerText
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'summary.txt'
    a.click()
    URL.revokeObjectURL(url)
  }
})
